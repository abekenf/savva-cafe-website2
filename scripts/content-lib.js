/**
 * The draft convention, in one place: the data layer and the CONTENT-TODO
 * generator both walk the same trees and must agree on what a draft is.
 *
 * A string the owner still has to write is authored as
 * `{ "text": "…", "draft": true }` and nothing else. Any near miss —
 * `draft: "true"`, a misspelled `text`, an extra sibling key — is a typo that
 * would otherwise reach a template as `[object Object]`, so it fails the build
 * the way an empty `alt` does in the image shortcode.
 */
export class DraftShapeError extends Error {}

const DRAFT_KEYS = new Set(["text", "draft"]);

function looksLikeDraft(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.hasOwn(value, "text") || Object.hasOwn(value, "draft"))
  );
}

/** Returns true for a well-formed flagged draft, false for a well-formed cleared one. */
export function checkDraft(value, keyPath) {
  const keys = Object.keys(value);
  const bad =
    keys.some((k) => !DRAFT_KEYS.has(k)) ||
    typeof value.text !== "string" ||
    value.text.trim() === "" ||
    typeof value.draft !== "boolean";
  if (bad) {
    throw new DraftShapeError(
      `Malformed draft node at \`${keyPath}\`: expected exactly { "text": <non-empty string>, ` +
        `"draft": <boolean> }, got ${JSON.stringify(value)}`
    );
  }
  return value.draft;
}

/**
 * Depth-first walk. `visit(keyPath, value, kind)` is called for every leaf:
 * kind is "draft" for a flagged draft, "value" for everything else.
 */
export function walk(node, prefix, visit) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${prefix}[${i}]`, visit));
    return;
  }
  if (node === null || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    if (looksLikeDraft(value)) {
      visit(keyPath, value.text, checkDraft(value, keyPath) ? "draft" : "value");
    } else if (value !== null && typeof value === "object") {
      walk(value, keyPath, visit);
    } else {
      visit(keyPath, value, "value");
    }
  }
}

/**
 * Unwraps every draft node to its plain string and records the flag as a
 * sibling `<key>Draft`, so `{{ t.about.body }}` always prints a string and
 * `{% if t.about.bodyDraft %}` gates the badge.
 */
export function resolve(node, prefix, drafts) {
  if (Array.isArray(node)) {
    return node.map((item, i) => resolve(item, `${prefix}[${i}]`, drafts));
  }
  if (node === null || typeof node !== "object") return node;

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    if (looksLikeDraft(value)) {
      out[key] = value.text;
      if (checkDraft(value, keyPath)) {
        out[`${key}Draft`] = true;
        drafts.push(keyPath);
      }
    } else {
      out[key] = resolve(value, keyPath, drafts);
    }
  }
  return out;
}

/** Structural key paths, drafts counted as leaves — the parity comparison. */
export function keyPaths(node) {
  const paths = [];
  walk(node, "", (keyPath) => paths.push(keyPath));
  return paths.sort();
}
