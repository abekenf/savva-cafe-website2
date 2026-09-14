import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIR = path.dirname(fileURLToPath(import.meta.url));

/**
 * A string the owner still has to write is authored in JSON as
 * `{ "text": "…", "draft": true }`. Templates must never see that object:
 * the value is unwrapped here and the flag survives as a sibling key
 * `<key>Draft`. `{{ t.about.body }}` therefore always prints a string, and
 * `{% if t.about.bodyDraft %}` decides whether the badge is rendered.
 *
 * Resolution happens in the data layer rather than in a Nunjucks filter
 * because `.eleventy.js` belongs to another ticket's zone.
 */
function isDraftValue(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.text === "string" &&
    value.draft === true
  );
}

function resolve(node, prefix, drafts) {
  if (Array.isArray(node)) {
    return node.map((item, i) => resolve(item, `${prefix}[${i}]`, drafts));
  }
  if (node === null || typeof node !== "object") return node;

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    if (isDraftValue(value)) {
      out[key] = value.text;
      out[`${key}Draft`] = true;
      drafts.push(keyPath);
    } else {
      out[key] = resolve(value, keyPath, drafts);
    }
  }
  return out;
}

/** Read fresh on every build so `--watch` never serves a cached dictionary. */
function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
}

function build(lang) {
  const drafts = [];
  const dictionary = resolve(readJson(`content.${lang}.json`), "", drafts);
  const site = resolve(readJson("site.json"), "site", drafts);
  const sections = {};
  for (const keyPath of drafts) {
    sections[keyPath.split(/[.[]/)[0]] = true;
  }
  return { t: dictionary, site, draftPaths: drafts, draftSections: sections };
}

/** Two pages per build: re-resolving is cheaper than a cache that can go stale. */
function forLang(lang) {
  return build(lang === "ar" ? "ar" : "en");
}

export default {
  t: (data) => forLang(data.lang).t,
  site: (data) => forLang(data.lang).site,
  draftSections: (data) => forLang(data.lang).draftSections,
  draftPaths: (data) => forLang(data.lang).draftPaths,
};
