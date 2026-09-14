# Savva Cafe — landing page

A single-page, bilingual (English / Arabic) site for Savva Cafe in Madinah,
Saudi Arabia. Static output, no runtime framework: Eleventy 3 builds the HTML,
Tailwind CSS 4 builds the stylesheet, and one hand-written ES6 file carries all
page behaviour. The build produces plain HTML5, CSS3 and ES6 in `_site/`.

## Requirements

- Node.js 20 or newer (`node -v`)
- npm 10 or newer

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Rebuild CSS on change and serve the site locally at http://localhost:8080 |
| `npm run build` | Build the stylesheet and the site into `_site/` |
| `npm test` | Run the build checks in `test/` against the contents of `_site/` |

`npm run build` runs two steps in order: `build:css` (Tailwind CLI →
`_site/assets/app.css`) and `build:html` (Eleventy → `_site/`). Run `npm run build`
before `npm test`: the tests parse the built pages, not the sources.

## Project layout

```
src/
  _data/              site-wide data (texts, contacts, menu, gallery)
  _includes/
    layouts/base.njk  document shell: <head>, fonts, CSS/JS, skip link
    sections/*.njk    nine page sections, one file each
  en/index.njk        English page  -> /
  ar/index.njk        Arabic page   -> /ar/
  css/main.css        theme tokens (@theme) and component classes
  js/app.js           all page behaviour, one init() on DOMContentLoaded
  assets/images/      source photography, resized at build time
  assets/static/      files copied verbatim (fonts, icons)
_site/                build output — generated, not committed
```

Both language pages include the same nine sections in the same order: `nav`,
`hero`, `about`, `menu`, `gallery`, `experience`, `visit`, `instagram`, `footer`.
Language-specific strings come from the data files, so a section is written once.

## Fonts

Manrope (400/500/700) and IBM Plex Sans Arabic (400/600) are committed as `.woff2`
files in `src/assets/static/fonts/` and declared with `@font-face` in
`src/css/main.css`. The built pages make no request to `fonts.googleapis.com`.
To update a font, replace the file and keep the same name.

## Colours

The eleven brand tokens live in the `@theme` block of `src/css/main.css` and
nowhere else. Tailwind generates the utilities from them (`bg-sage`, `text-ink`,
`border-latte`, …), so changing a hex value there changes it everywhere.

## Deploying to Vercel

`vercel.json` already sets the build command, the output directory and a one-year
immutable cache for `/assets/*`. No environment variables and no API keys are
needed.

1. Push the repository to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Leave the framework preset as **Other** — `vercel.json` supplies the settings
   (build command `npm run build`, output directory `_site`).
4. Deploy. Later pushes to the default branch redeploy automatically.

To deploy from a terminal instead, install the Vercel CLI and run `vercel --prod`
in the project root.
