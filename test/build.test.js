/**
 * Build checks for the Savva Cafe landing page.
 *
 * The single seam is the built `_site/` directory: every assertion below reads
 * the files a visitor would receive, never the sources that produced them.
 * Run `npm run build` first.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "_site");

function built(relative) {
  const file = path.join(site, relative);
  assert.ok(fs.existsSync(file), `missing build output: ${relative} — run \`npm run build\``);
  return fs.readFileSync(file, "utf8");
}

const html = {
  en: built("index.html"),
  ar: built("ar/index.html"),
};
const pages = [
  { lang: "en", dir: "ltr", doc: html.en, canonical: "/", alternate: "/ar" },
  { lang: "ar", dir: "rtl", doc: html.ar, canonical: "/ar", alternate: "/" },
];

const siteData = JSON.parse(fs.readFileSync(path.join(root, "src/_data/site.json"), "utf8"));
const baseUrl = (siteData.url.text ?? siteData.url).replace(/\/$/, "");

/** All values of one attribute across a document, e.g. every `alt` of every `<img>`. */
function tags(doc, name) {
  return doc.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
  return m ? m[1] : null;
}
function head(doc) {
  return doc.slice(0, doc.indexOf("</head>"));
}
function meta(doc, key) {
  const tag = tags(head(doc), "meta").find(
    (t) => attr(t, "property") === key || attr(t, "name") === key
  );
  return tag ? attr(tag, "content") : null;
}
function links(doc, rel) {
  return tags(head(doc), "link").filter((t) => (attr(t, "rel") ?? "").split(/\s+/).includes(rel));
}

/* --- the page a guest receives ------------------------------------------- */

test("both language pages are built", () => {
  for (const page of pages) assert.match(page.doc, /<\/html>/);
});

test("each page declares its own language and direction", () => {
  for (const page of pages) {
    const tag = tags(page.doc, "html")[0];
    assert.equal(attr(tag, "lang"), page.lang);
    assert.equal(attr(tag, "dir"), page.dir);
  }
});

test("nine sections are present on both pages", () => {
  const ids = ["hero", "about", "menu", "gallery", "experience", "visit", "instagram"];
  for (const page of pages) {
    for (const id of ids) assert.ok(page.doc.includes(`id="${id}"`), `${page.lang}: no #${id}`);
    assert.ok(/<nav\b/.test(page.doc), `${page.lang}: no <nav>`);
    assert.ok(/<footer\b/.test(page.doc), `${page.lang}: no <footer>`);
  }
});

test("every image has a non-empty alt", () => {
  for (const page of pages) {
    const imgs = tags(page.doc, "img");
    assert.ok(imgs.length > 20, `${page.lang}: only ${imgs.length} images`);
    for (const img of imgs) {
      const alt = attr(img, "alt");
      assert.ok(alt && alt.trim() !== "", `${page.lang}: empty alt on ${img.slice(0, 90)}`);
    }
  }
});

test("every image reserves its space with width and height", () => {
  for (const page of pages) {
    for (const img of tags(page.doc, "img")) {
      assert.ok(attr(img, "width"), `${page.lang}: no width on ${img.slice(0, 90)}`);
      assert.ok(attr(img, "height"), `${page.lang}: no height on ${img.slice(0, 90)}`);
    }
  }
});

test("the map iframe is absent from the delivered HTML", () => {
  for (const page of pages) assert.equal(tags(page.doc, "iframe").length, 0);
});

test("opening hours are seven rows, one per day", () => {
  for (const page of pages) {
    const rows = tags(page.doc, "li").filter((t) => attr(t, "data-day"));
    assert.equal(rows.length, 7, `${page.lang}`);
    for (const row of rows) {
      assert.match(attr(row, "data-opens"), /^\d{2}:\d{2}$/);
      assert.match(attr(row, "data-closes"), /^\d{2}:\d{2}$/);
    }
  }
});

test("nine Instagram tiles link to nine different posts", () => {
  for (const page of pages) {
    const posts = new Set(
      (page.doc.match(/https:\/\/www\.instagram\.com\/savva_cafe\/(?:p|reel)\/[A-Za-z0-9_-]+/g) ?? [])
    );
    assert.equal(posts.size, 9, `${page.lang}`);
  }
});

test("eleven gallery tiles open the lightbox", () => {
  for (const page of pages) {
    const tiles = tags(page.doc, "button").filter(
      (t) => attr(t, "data-lightbox-group") === "gallery"
    );
    assert.equal(tiles.length, 11, `${page.lang}`);
  }
});

/* --- what a search engine and a messenger receive ------------------------- */

test("each page has its own title and description", () => {
  for (const page of pages) {
    const title = page.doc.match(/<title>([^<]+)<\/title>/)[1].trim();
    assert.ok(title.length > 10 && title.length < 70, `${page.lang}: title "${title}"`);
    const description = meta(page.doc, "description");
    assert.ok(description && description.length > 50, `${page.lang}: description`);
  }
  assert.notEqual(
    html.en.match(/<title>([^<]+)<\/title>/)[1],
    html.ar.match(/<title>([^<]+)<\/title>/)[1]
  );
});

test("canonical points at the clean URL of its own page", () => {
  for (const page of pages) {
    const canonical = links(page.doc, "canonical");
    assert.equal(canonical.length, 1, `${page.lang}`);
    assert.equal(attr(canonical[0], "href"), baseUrl + (page.canonical === "/" ? "/" : page.canonical));
  }
});

test("hreflang names both languages and a default on both pages", () => {
  for (const page of pages) {
    const alternates = links(page.doc, "alternate");
    const byLang = Object.fromEntries(alternates.map((t) => [attr(t, "hreflang"), attr(t, "href")]));
    assert.equal(byLang.en, baseUrl + "/", `${page.lang}: en`);
    assert.equal(byLang.ar, baseUrl + "/ar", `${page.lang}: ar`);
    assert.equal(byLang["x-default"], baseUrl + "/", `${page.lang}: x-default`);
  }
});

test("Open Graph carries a 1200x630 image that exists in the build", () => {
  for (const page of pages) {
    assert.equal(meta(page.doc, "og:type"), "website");
    assert.ok(meta(page.doc, "og:title"));
    assert.ok(meta(page.doc, "og:description"));
    assert.ok(meta(page.doc, "og:image:alt"));
    assert.equal(meta(page.doc, "og:url"), baseUrl + (page.canonical === "/" ? "/" : page.canonical));
    assert.equal(meta(page.doc, "og:locale"), page.lang === "en" ? "en_SA" : "ar_SA");
    assert.equal(meta(page.doc, "og:image:width"), "1200");
    assert.equal(meta(page.doc, "og:image:height"), "630");

    const image = meta(page.doc, "og:image");
    assert.ok(image.startsWith(baseUrl + "/"), `${page.lang}: og:image must be absolute`);
    built(image.slice(baseUrl.length));
  }
  assert.notEqual(meta(html.en, "og:image"), meta(html.ar, "og:image"));
});

test("the Twitter card is a large summary and the theme colour is the brand sage", () => {
  for (const page of pages) {
    assert.equal(meta(page.doc, "twitter:card"), "summary_large_image");
    assert.equal(meta(page.doc, "theme-color"), "#808366");
  }
});

/* --- structured data ------------------------------------------------------ */

function jsonLd(doc) {
  const block = doc.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  assert.ok(block, "no JSON-LD block");
  return JSON.parse(block[1]);
}

test("JSON-LD describes the coffee shop with the data from site.json", () => {
  for (const page of pages) {
    const data = jsonLd(page.doc);
    assert.deepEqual(data["@type"], ["Restaurant", "CafeOrCoffeeShop"]);
    assert.ok(data.name);
    assert.equal(data.telephone, siteData.phone.display);
    assert.equal(data.address["@type"], "PostalAddress");
    assert.equal(data.address.streetAddress, siteData.address.streetAddress);
    assert.equal(data.address.addressLocality, siteData.address.addressLocality);
    assert.equal(data.address.postalCode, siteData.address.postalCode);
    assert.equal(data.address.addressCountry, siteData.address.addressCountry);
    assert.equal(data.geo["@type"], "GeoCoordinates");
    assert.equal(data.geo.latitude, siteData.geo.latitude);
    assert.equal(data.geo.longitude, siteData.geo.longitude);
    assert.ok(data.servesCuisine);
    assert.ok(data.priceRange);
    assert.ok(Array.isArray(data.image) && data.image.length > 0);
    assert.deepEqual(
      [...data.sameAs].sort(),
      [siteData.links.instagram, siteData.links.maps].sort()
    );
  }
});

test("JSON-LD opening hours are the seven rows of site.json", () => {
  for (const page of pages) {
    const hours = jsonLd(page.doc).openingHoursSpecification;
    assert.equal(hours.length, 7, `${page.lang}`);
    hours.forEach((entry, i) => {
      assert.equal(entry["@type"], "OpeningHoursSpecification");
      assert.equal(entry.dayOfWeek, siteData.hours[i].dayOfWeek);
      assert.equal(entry.opens, siteData.hours[i].opens);
      assert.equal(entry.closes, siteData.hours[i].closes);
    });
  }
});

/* --- icons ---------------------------------------------------------------- */

test("the browser, the phone and the home screen all find an icon", () => {
  for (const page of pages) {
    const icon = links(page.doc, "icon").map((t) => attr(t, "href"));
    assert.ok(icon.includes("/assets/static/icons/favicon.svg"), `${page.lang}: svg icon`);
    const apple = links(page.doc, "apple-touch-icon")[0];
    assert.ok(apple, `${page.lang}: apple-touch-icon`);
    const manifest = links(page.doc, "manifest")[0];
    assert.ok(manifest, `${page.lang}: manifest`);
    for (const href of [...icon, attr(apple, "href"), attr(manifest, "href")]) built(href);
  }
  const manifest = JSON.parse(built("/assets/static/icons/site.webmanifest"));
  assert.ok(manifest.icons.length >= 2);
  for (const entry of manifest.icons) built(entry.src);
});

/* --- weight and requests -------------------------------------------------- */

test("nothing on the page is fetched from another domain", () => {
  const own = new URL(baseUrl).host;
  const blocking = ["stylesheet", "preload", "prefetch", "preconnect", "dns-prefetch", "modulepreload"];
  for (const page of pages) {
    const urls = [...page.doc.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const url of urls) assert.ok(!url.includes("localhost"), `${page.lang}: ${url}`);

    // Nothing the browser must fetch before first paint may leave this origin:
    // no font CDN, no stylesheet CDN, no third-party script.
    for (const tag of tags(page.doc, "link")) {
      const rel = (attr(tag, "rel") ?? "").split(/\s+/);
      if (!blocking.some((r) => rel.includes(r))) continue;
      const href = attr(tag, "href") ?? "";
      assert.ok(!/^https?:\/\//.test(href), `${page.lang}: external ${rel.join(" ")} ${href}`);
    }
    for (const tag of tags(page.doc, "script")) {
      const src = attr(tag, "src");
      assert.ok(!src || !/^https?:\/\//.test(src), `${page.lang}: external script ${src}`);
    }

    // Absolute URLs that do appear (canonical, hreflang, outbound links) may
    // only point at this site, its Instagram profile or its Google Maps card.
    for (const url of urls.filter((u) => /^https?:\/\//.test(u))) {
      const host = new URL(url).host;
      assert.ok(
        host === own || /(^|\.)instagram\.com$|(^|\.)google\.com$/.test(host),
        `${page.lang}: unexpected host ${host}`
      );
    }
  }
});

test("the behaviour script stays under 12 KB and is deferred", () => {
  const bytes = fs.statSync(path.join(site, "js/app.js")).size;
  assert.ok(bytes <= 12 * 1024, `app.js is ${bytes} bytes`);
  for (const page of pages) {
    const script = tags(page.doc, "script").find((t) => attr(t, "src") === "/js/app.js");
    assert.ok(script && /\bdefer\b/.test(script), `${page.lang}: app.js must be deferred`);
  }
});

test("the preloaded font is the one the first screen draws with, and it is shipped once", () => {
  for (const page of pages) {
    const preloads = links(page.doc, "preload").filter((t) => attr(t, "as") === "font");
    assert.equal(preloads.length, 1, `${page.lang}: exactly one font preload`);
    const href = attr(preloads[0], "href");
    built(href);
    assert.match(preloads[0], /\bcrossorigin\b/, `${page.lang}: preload needs crossorigin`);
    const css = built("/assets/app.css");
    assert.ok(css.includes(href), `${page.lang}: ${href} is not declared in the stylesheet`);
  }
  const dir = path.join(site, "assets/static/fonts");
  const seen = new Map();
  for (const name of fs.readdirSync(dir)) {
    const digest = fs.readFileSync(path.join(dir, name)).toString("base64");
    assert.ok(!seen.has(digest), `${name} is byte-identical to ${seen.get(digest)}`);
    seen.set(digest, name);
  }
});

/* --- content ------------------------------------------------------------- */

test("both dictionaries carry the same keys", () => {
  const keys = (value, prefix = "") =>
    value && typeof value === "object"
      ? Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
      : [prefix];
  const en = keys(JSON.parse(fs.readFileSync(path.join(root, "src/_data/content.en.json"), "utf8")));
  const ar = keys(JSON.parse(fs.readFileSync(path.join(root, "src/_data/content.ar.json"), "utf8")));
  assert.deepEqual(en.sort(), ar.sort());
});

test("the copyright year is the year of the build", () => {
  const year = String(new Date().getFullYear());
  for (const page of pages) {
    const footer = page.doc.slice(page.doc.lastIndexOf("<footer"));
    assert.ok(footer.includes(year), `${page.lang}: footer does not show ${year}`);
  }
});
