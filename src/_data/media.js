import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_ROOT = "assets/images";
const GROUPS = ["hero", "gallery", "menu", "instagram", "brand"];
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|svg)$/i;

/**
 * What is actually on disk under src/assets/images/.
 * The dictionaries name the file each tile wants; this tells a section
 * whether that file exists yet, so a missing photo degrades to a branded
 * tile instead of failing the build.
 */
function listGroup(group) {
  const dir = path.join(SRC_DIR, IMAGE_ROOT, group);
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && IMAGE_EXT.test(e.name))
    .map((e) => `${IMAGE_ROOT}/${group}/${e.name}`)
    .sort();
}

export default function () {
  const media = { files: [] };
  for (const group of GROUPS) {
    media[group] = listGroup(group);
    media.files.push(...media[group]);
  }
  media.count = media.files.length;
  return media;
}
