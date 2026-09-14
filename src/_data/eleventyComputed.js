import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "../../scripts/content-lib.js";

const DATA_DIR = path.dirname(fileURLToPath(import.meta.url));

/**
 * Draft strings are unwrapped here rather than in a Nunjucks filter because
 * `.eleventy.js` belongs to another ticket's zone. Templates therefore always
 * receive plain strings; the flag survives as a sibling `<key>Draft`.
 */

/** Read fresh on every build so `--watch` never serves a cached dictionary. */
function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
}

function build(lang) {
  const dictDrafts = [];
  const siteDrafts = [];
  const dictionary = resolve(readJson(`content.${lang}.json`), "", dictDrafts);
  const site = resolve(readJson("site.json"), "site", siteDrafts);

  // Section badges are keyed by section name only; site.json facts are separate
  // so no template has to remember that `site` is not a section.
  const draftSections = {};
  for (const keyPath of dictDrafts) {
    draftSections[keyPath.split(/[.[]/)[0]] = true;
  }
  const draftSite = {};
  for (const keyPath of siteDrafts) {
    draftSite[keyPath.replace(/^site\./, "")] = true;
  }

  return {
    t: dictionary,
    site,
    draftSections,
    draftSite,
    draftPaths: [...dictDrafts, ...siteDrafts],
  };
}

/** Two pages per build: re-resolving is cheaper than a cache that can go stale. */
function forLang(lang) {
  return build(lang === "ar" ? "ar" : "en");
}

export default {
  t: (data) => forLang(data.lang).t,
  site: (data) => forLang(data.lang).site,
  draftSections: (data) => forLang(data.lang).draftSections,
  draftSite: (data) => forLang(data.lang).draftSite,
  draftPaths: (data) => forLang(data.lang).draftPaths,
};
