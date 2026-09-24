import path from "node:path";
import Image from "@11ty/eleventy-img";

const IMAGE_WIDTHS = [480, 800, 1200, 1600];
const IMAGE_FORMATS = ["avif", "webp", "jpeg"];
const IMAGE_OUTPUT_DIR = "_site/assets/img/";
const IMAGE_URL_PATH = "/assets/img/";

/**
 * Resolve an image reference from a template to a path on disk.
 * Accepts "assets/images/x.jpg", "/assets/images/x.jpg" or "src/assets/images/x.jpg".
 */
function resolveImageSource(src) {
  const clean = String(src).replace(/^\/+/, "");
  return clean.startsWith("src/") ? clean : path.join("src", clean);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/static");
  eleventyConfig.addPassthroughCopy("src/js");

  // The stylesheet is built by the Tailwind CLI, not by Eleventy.
  eleventyConfig.ignores.add("src/css/**");

  eleventyConfig.addWatchTarget("src/css/");

  /**
   * Build-time facts the templates cannot work out for themselves.
   * `preloadFont` is the single source for the <link rel=preload> in base.njk:
   * it must name a file that src/css/main.css also declares with @font-face,
   * and test/build.test.js asserts exactly that.
   */
  eleventyConfig.addGlobalData("build", {
    year: new Date().getFullYear(),
    // Draft badges are for the owner, not the guest. `PREVIEW=1 npm run build`
    // shows them; a plain build ships the page without them, while the strings
    // stay flagged in the data and listed in CONTENT-TODO.md either way.
    preview: process.env.PREVIEW === "1",
    // One preload per page: the family that sets the first screen. There is
    // only one voice on the page now, so this is simply it, per script.
    preloadFont: {
      ltr: "/assets/static/fonts/manrope-latin.woff2",
      rtl: "/assets/static/fonts/ibm-plex-sans-arabic-arabic-400.woff2",
    },
  });

  /**
   * {% image src, alt, sizes, eager, classes %}
   * Renders a <picture> with AVIF + WebP + JPEG at 480/800/1200/1600,
   * intrinsic width/height (zero CLS) and lazy loading unless `eager` is true.
   */
  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, sizes = "100vw", eager = false, classes = "") {
      if (typeof alt !== "string" || alt.trim() === "") {
        throw new Error(`Missing alt text for image: ${src}`);
      }

      const file = resolveImageSource(src);
      const metadata = await Image(file, {
        widths: IMAGE_WIDTHS,
        formats: IMAGE_FORMATS,
        outputDir: IMAGE_OUTPUT_DIR,
        urlPath: IMAGE_URL_PATH,
        cacheOptions: { directory: ".cache" },
        sharpJpegOptions: { quality: 82, progressive: true },
      });

      const attributes = {
        alt,
        sizes,
        loading: eager ? "eager" : "lazy",
        decoding: eager ? "sync" : "async",
        ...(eager ? { fetchpriority: "high" } : {}),
        ...(classes ? { class: classes } : {}),
      };

      return Image.generateHTML(metadata, attributes, { whitespaceMode: "inline" });
    }
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
