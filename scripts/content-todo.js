#!/usr/bin/env node
/**
 * Collects every string still marked `{ "text": "…", "draft": true }` in the
 * data files and writes CONTENT-TODO.md — the owner's replacement list.
 * Also refuses to finish when the two dictionaries have drifted apart, because
 * a key that exists in one language only reaches the other page as nothing.
 * Runs from `npm run build`, before Eleventy. No dependencies on purpose.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "./content-lib.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "src", "_data");
const OUTPUT = path.join(ROOT, "CONTENT-TODO.md");

const SOURCES = [
  { file: "src/_data/content.en.json", label: "English", disk: "content.en.json" },
  { file: "src/_data/content.ar.json", label: "Arabic", disk: "content.ar.json" },
  { file: "src/_data/site.json", label: "Shared facts", disk: "site.json" },
];

/** Key path (without array indices) → one line saying what the owner must supply. */
const HINTS = [
  [/^hero\.subtitle$/, "One line under the hero title, 12-18 words."],
  [/^about\.body$/, "40-60 words about the place: what it feels like and why people stay."],
  [/^menu\.items\[\d+\]\.desc$/, "One short line about this item, up to 12 words."],
  [/^instagram\.items\[\d+\]\.href$/, "Permalink of this post (https://www.instagram.com/p/...)."],
  [/^site\.url$/, "Public address of the deployed site — used for canonical, hreflang and Open Graph."],
];

/**
 * A frame the owner still has to confirm is authored as a plain string sitting
 * next to its `image`, under the same name with `Note` appended:
 *
 *   "image":     "assets/images/menu/flat-white.jpg",
 *   "imageNote": "Closest match available, not a frame Savva labelled …"
 *
 * The rule is general: any `<key>Note` beside an image key becomes a row under
 * "Confirm the photo", so a caveat recorded by whoever sourced the file reaches
 * the owner instead of staying in ASSETS.md, which only a developer reads.
 */
const IMAGE_KEYS = /(^|\.)(image)$/;
const IMAGE_NOTE_KEYS = /(^|\.)(imageNote)$/;

/** `menu.items[0].imageNote` → `menu.items[0].image` — the frame it speaks about. */
function imageKeyOf(noteKeyPath) {
  return noteKeyPath.replace(/Note$/, "");
}

function hintFor(keyPath) {
  for (const [pattern, hint] of HINTS) {
    if (pattern.test(keyPath)) return hint;
  }
  return "Replace with the owner's own wording.";
}

function escapeCell(text) {
  return String(text).replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
}

function readSource(source) {
  const file = path.join(DATA_DIR, source.disk);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * Values that are not translated and must be byte-identical in both languages:
 * a file name, its caveat, an element id, and an in-page anchor. They point at
 * the same asset or the same section, so a difference between the languages is
 * always a slip — the Arabic page would load another photo or scroll nowhere.
 * `href` is compared only when it is an anchor, because `nav.language.otherHref`
 * legitimately differs (`/ar` against `/`).
 */
const SHARED_VALUE_KEYS = /(^|\.)(image|imageNote|id)$/;
const HREF_KEYS = /(^|\.)href$/;

/** Listed one by one on purpose: a heuristic here would silently excuse drift. */
const TRANSLATED_ANYWAY = new Set(["meta.path", "meta.altPath"]);

function isShared(keyPath, en, ar) {
  if (TRANSLATED_ANYWAY.has(keyPath)) return false;
  if (SHARED_VALUE_KEYS.test(keyPath)) return true;
  return (
    HREF_KEYS.test(keyPath) &&
    [en, ar].some((v) => typeof v === "string" && v.startsWith("#"))
  );
}

/** Every leaf of a dictionary as `keyPath → value`; draft nodes count as their text. */
function leaves(data) {
  const map = new Map();
  walk(data, "", (keyPath, value) => map.set(keyPath, value));
  return map;
}

/**
 * The two dictionaries are one schema in two languages: a key present in only
 * one of them prints an empty string on the other page, and nothing else says
 * so. Compared here rather than in the data layer because the build reaches
 * this script first, and a mismatch has to stop it before Eleventy renders a
 * page with a hole in it.
 */
function checkParity() {
  const en = leaves(readSource(SOURCES[0]));
  const ar = leaves(readSource(SOURCES[1]));
  const missingInAr = [...en.keys()].filter((p) => !ar.has(p)).sort();
  const missingInEn = [...ar.keys()].filter((p) => !en.has(p)).sort();

  const shared = [...en.keys()].filter((p) => ar.has(p) && isShared(p, en.get(p), ar.get(p)));
  const differing = shared.filter((p) => en.get(p) !== ar.get(p)).sort();

  if (missingInAr.length === 0 && missingInEn.length === 0 && differing.length === 0) {
    return { keyCount: en.size, sharedCount: shared.length };
  }

  const report = (label, paths) =>
    paths.length === 0 ? [] : [`  missing from ${label}:`, ...paths.map((p) => `    ${p}`)];
  process.stderr.write(
    [
      "content-todo: the two dictionaries have drifted apart.",
      ...report(SOURCES[1].file, missingInAr),
      ...report(SOURCES[0].file, missingInEn),
      ...(differing.length === 0
        ? []
        : [
            "  values that must be identical in both languages differ:",
            ...differing.map(
              (p) => `    ${p}\n      en: ${JSON.stringify(en.get(p))}\n      ar: ${JSON.stringify(ar.get(p))}`
            ),
          ]),
      "Both languages render one page in two skins: same keys, same files, same ids, same anchors.",
      "",
    ].join("\n")
  );
  process.exit(1);
}

function main() {
  const { keyCount, sharedCount } = checkParity();
  const drafts = [];
  const missingImages = new Map();
  const photoNotes = new Map();

  for (const source of SOURCES) {
    const data = readSource(source);
    const prefix = source.disk === "site.json" ? "site" : "";
    const images = new Map();
    const notes = [];

    walk(data, prefix, (keyPath, text, kind) => {
      if (kind === "draft") {
        drafts.push({ file: source.file, keyPath, text });
        return;
      }
      if (typeof text !== "string" || text === "") return;
      if (IMAGE_NOTE_KEYS.test(keyPath)) {
        notes.push({ keyPath, text });
        return;
      }
      if (!IMAGE_KEYS.test(keyPath)) return;
      images.set(keyPath, text);
      const onDisk = path.join(ROOT, "src", text);
      if (!fs.existsSync(onDisk) && !missingImages.has(text)) {
        missingImages.set(text, keyPath);
      }
    });

    // Both dictionaries carry the same caveat, so the owner sees each frame once.
    for (const note of notes) {
      const imageKey = imageKeyOf(note.keyPath);
      const file = images.get(imageKey);
      if (!file) {
        throw new Error(
          `\`${note.keyPath}\` in ${source.file} has no frame to speak about: ` +
            `expected a non-empty \`${imageKey}\` beside it.`
        );
      }
      if (!photoNotes.has(file)) photoNotes.set(file, { keyPath: imageKey, note: note.text });
    }
  }

  const lines = [];
  lines.push("# Content to write");
  lines.push("");
  lines.push(
    "Generated by `scripts/content-todo.js` on every `npm run build`. Do not edit by hand —"
  );
  lines.push(
    "edit the data files instead. A line disappears from this list the moment its"
  );
  lines.push("`\"draft\": true` flag is removed, and the amber badge disappears from the page with it.");
  lines.push("");

  if (drafts.length === 0) {
    lines.push("Nothing left to write: no string is marked as a draft.");
  } else {
    lines.push(`${drafts.length} strings are still placeholder text.`);
    lines.push("");
    for (const source of SOURCES) {
      const rows = drafts.filter((d) => d.file === source.file);
      if (rows.length === 0) continue;
      lines.push(`## ${source.label} — \`${source.file}\``);
      lines.push("");
      lines.push("| Key | Current text | What is needed |");
      lines.push("| --- | --- | --- |");
      for (const row of rows) {
        lines.push(
          `| \`${row.keyPath}\` | ${escapeCell(row.text)} | ${hintFor(row.keyPath)} |`
        );
      }
      lines.push("");
    }
  }

  if (missingImages.size > 0) {
    lines.push("## Photos still missing");
    lines.push("");
    lines.push(
      "Files named by the dictionaries that are not in `src/assets/images/` yet. Sections fall back to a branded tile."
    );
    lines.push("");
    lines.push("| File | First referenced by |");
    lines.push("| --- | --- |");
    for (const [file, keyPath] of missingImages) {
      lines.push(`| \`src/${file}\` | \`${keyPath}\` |`);
    }
    lines.push("");
  }

  if (photoNotes.size > 0) {
    lines.push("## Confirm the photo");
    lines.push("");
    lines.push(
      "These frames are on the page already, but nobody at Savva has confirmed they show what"
    );
    lines.push(
      "the caption says. Look at each one: if it is right, delete the `…Note` key beside the"
    );
    lines.push(
      "image in **both** dictionaries and the row goes away. If it is wrong, send the photo that is."
    );
    lines.push("");
    lines.push("| File | Shown as | What to confirm |");
    lines.push("| --- | --- | --- |");
    for (const [file, { keyPath, note }] of photoNotes) {
      lines.push(`| \`src/${file}\` | \`${keyPath}\` | ${escapeCell(note)} |`);
    }
    lines.push("");
  }

  lines.push("## Also worth knowing");
  lines.push("");
  lines.push(
    "- The nine Instagram tiles are a snapshot, not a live feed: they show the posts captured on the build date recorded in `site.capturedOn`. Refreshing them means replacing the files in `src/assets/images/instagram/` and the links in `instagram.items[]`."
  );
  lines.push("");

  fs.writeFileSync(OUTPUT, lines.join("\n"), "utf8");
  process.stdout.write(
    `content-todo: ${keyCount} keys and ${sharedCount} shared values matched in both dictionaries, ` +
      `${drafts.length} draft strings, ` +
      `${missingImages.size} missing photos, ${photoNotes.size} ` +
      `photo${photoNotes.size === 1 ? "" : "s"} to confirm → CONTENT-TODO.md\n`
  );
}

main();
