# ASSETS — origin of every photo in this repository

Every image under `src/assets/images/` is Savva's own material, pulled from two public
sources on **2026-09-14**. No stock photography, no other coffee shop.

**Paths in this document are written exactly as they go into the data dictionaries** —
`assets/images/<dir>/<file>`, the form the `image` shortcode takes (`src`-relative, see
`interfaces.md`). Copy the name straight across; do not re-spell it.

**Sources**

- **IG** — public Instagram grid of [@savva_cafe](https://www.instagram.com/savva_cafe/).
  Grid thumbnails are served at 640 px on the long side; that is the ceiling the public
  profile exposes without authentication. Each row links its post.
- **GM** — the Google Maps business card
  [سافا savva](https://www.google.com/maps/place/%D8%B3%D8%A7%D9%81%D8%A7+savva/@24.4926931,39.5823565,17z/data=!3m1!4b1!4m6!3m5!1s0x15bdbf7c00dd71e3:0x8c75251d63b13c1!8m2!3d24.4926931!4d39.5823565!16s%2Fg%2F11kj12kz9s?hl=en),
  in two places: the card's own **photo gallery** (`gps-cs` frames) and the **photos
  attached to reviews** on that card (`grass-cs` frames — visitor photographs of Savva's
  premises, published on Savva's own card). Both are fetched from
  `lh3.googleusercontent.com` at `=w1600`, which returns the original down-scaled to
  1600 px wide; frames natively smaller arrive at their own size. The CDN links are signed
  and short-lived, so the table records the card, not the expiring direct link.

Frames marked **(crop)** are cut from the frame named in the same row and nothing else —
no retouching, no colour change. The hero needs 16:9 and menu cards need 4:5; the sources
are portrait.

---

## hero/

| File | Source | Date pulled | What is in the frame |
|---|---|---|---|
| `assets/images/hero/interior-lounge-arches-wide.jpg` | GM gallery (crop to 16:9) | 2026-09-14 | **Intended hero.** Indoor lounge: two arched wooden windows, cream bouclé sofas with embroidered cushions, ficus and bamboo in woven planters. 1600×900 |
| `assets/images/hero/storefront-evening-wide.jpg` | GM gallery | 2026-09-14 | Alternate. Shopfront at dusk: lit SAVVA / سافا wordmark, glass front with the counter and guests visible inside, terrace chairs in front. 1170×655 |

Both horizontal. The lounge frame is the interior shot the brief asks for; it appears in
`hero/` **only** — the full-height version was removed from the gallery so the first screen
and the "Inside Savva" section do not show the same room twice.

## gallery/

14 frames (spec allows 9–15). Six are interiors, and four of those are different rooms or
zones, not details of one room.

| File | Source | Date pulled | What is in the frame |
|---|---|---|---|
| `assets/images/gallery/interior-seating-white-tables.jpg` | GM review photos | 2026-09-14 | **Interior, seating room.** Long beige sofa under two arched windows, white pedestal tables and moulded round chairs, potted trees. A different corner from the hero. 1242×2208 |
| `assets/images/gallery/bar-counter-cups-and-grinder.jpg` | GM review photos | 2026-09-14 | **Interior, bar counter.** Service station: stacks of sage SAVVA cups, grinder and espresso machine, stirrer jar, plant on the marble top. 1600×2133 |
| `assets/images/gallery/interior-entrance-string-lights.jpg` | GM review photos | 2026-09-14 | **Interior, general view from the entrance.** Wooden chairs and round tables under string lights, the SAVVA sign above, the counter at the back. 1242×2208 |
| `assets/images/gallery/interior-relief-wall-table.jpg` | GM review photos | 2026-09-14 | **Interior detail.** The embossed white relief wall beside a table with a cinnamon roll and an iced coffee. 1244×2208 |
| `assets/images/gallery/interior-table-red-flowers.jpg` | GM gallery | 2026-09-14 | Interior detail. Tall glass vase of red roses on a marble table, ribbed jug and napkin holder beside it. 1080×1920 |
| `assets/images/gallery/interior-sofa-tray-espresso.jpg` | GM gallery | 2026-09-14 | Interior detail. Wooden tray on a low round table by a bouclé sofa: brownie squares, a glass of water, an espresso cup. 1600×2133 |
| `assets/images/gallery/terrace-storefront-evening.jpg` | GM gallery | 2026-09-14 | Street side after dark: SAVVA sign over the glass front, outdoor tables, dark rattan chairs, potted greenery. 960×1200 |
| `assets/images/gallery/storefront-daylight-plants.jpg` | GM gallery | 2026-09-14 | Street side by day: warm-lit sign under the arcade, olive trees at the entrance, terrace seating. 672×640 |
| `assets/images/gallery/terrace-tables-night.jpg` | GM gallery | 2026-09-14 | Outdoor seating at night along the wooden deck, lit interior behind the glazing. 1600×2133 |
| `assets/images/gallery/latte-art-stone-cup.jpg` | GM gallery | 2026-09-14 | Milk coffee with rosetta latte art in a textured stone-coloured cup on a wooden table, chairs out of focus behind. 1242×2208 |
| `assets/images/gallery/madini-cookies-menu-card.jpg` | GM gallery | 2026-09-14 | Two Madini Cookies on a white plate beside the printed bilingual menu card naming them. 1600×2845 |
| `assets/images/gallery/matcha-berry-and-melon-drinks.jpg` | IG, [post](https://www.instagram.com/savva_cafe/reel/Dbgh-ytMTn9/), 2026-08-01 | 2026-09-14 | Two iced drinks on a wooden board under an Arabic neon sign: matcha-berry and melon. 360×640 |
| `assets/images/gallery/barista-with-iced-coffee.jpg` | IG, [post](https://www.instagram.com/savva_cafe/reel/Dc36cp2sLRS/), 2026-09-04 | 2026-09-14 | Barista in a sand SAVVA tee and black gloves holding an iced coffee outside the café. 360×640 |
| `assets/images/gallery/iced-drinks-on-wooden-shelf.jpg` | IG, [post](https://www.instagram.com/savva_cafe/p/Dc34TRAsAtF/), 2026-09-04 | 2026-09-14 | Three branded cups in a row on a wooden ledge in hard sun — dark, caramel, amber. 477×640 |

## menu/

| File | Source | Date pulled | What is in the frame |
|---|---|---|---|
| `assets/images/menu/flat-white.jpg` | GM gallery (crop of `assets/images/gallery/latte-art-stone-cup.jpg` to 4:5) | 2026-09-14 | Milk coffee with rosetta latte art in a stone-coloured cup. 1242×1552 |
| `assets/images/menu/matcha-latte.jpg` | IG, [post](https://www.instagram.com/savva_cafe/reel/Dbgh-ytMTn9/), 2026-08-01 (crop to 4:5) | 2026-09-14 | Iced matcha, green layered over berry, in a clear branded cup. 360×450 |
| `assets/images/menu/madini-cookies.jpg` | IG, [post](https://www.instagram.com/savva_cafe/p/DdPEf8uNOSa/), 2026-09-13 (crop to 4:5) | 2026-09-14 | Close-up of Madini Cookies, black sesame and chocolate, on the baking tray. 482×602 |

`flat-white.jpg` is the closest available match, not a frame Savva labelled "Flat White":
it is a milk coffee with latte art from the Google gallery. Said plainly so the filename is
not mistaken for a caption by the café.

## instagram/

The nine most recent posts on the grid as of **2026-09-14**, newest first. Grid thumbnails,
640 px on the long side. The last column is the description Instagram itself attaches to the
image in `alt`, translated and tidied — raw material for the alt text task 03 writes, not
alt text itself.

| File | Post | Posted | What is in the frame |
|---|---|---|---|
| `assets/images/instagram/madini-cookies-closeup.jpg` | [p/DdPEf8uNOSa](https://www.instagram.com/savva_cafe/p/DdPEf8uNOSa/) | 2026-09-13 | Cookies close-up, black sesame and dried fruit, filling the frame |
| `assets/images/instagram/iced-berry-drink.jpg` | [p/DdMxDh9MvzH](https://www.instagram.com/savva_cafe/p/DdMxDh9MvzH/) | 2026-09-12 | Deep red iced drink in a branded SAVVA cup on a wooden table |
| `assets/images/instagram/frozen-berry-drink.jpg` | [reel/DdJ6WD4sOUq](https://www.instagram.com/savva_cafe/reel/DdJ6WD4sOUq/) | 2026-09-11 | Frozen berry drink in a clear SAVVA COFFEE cup, red splash above it |
| `assets/images/instagram/pouring-berry-drink.jpg` | [p/DdHV3QCsEbd](https://www.instagram.com/savva_cafe/p/DdHV3QCsEbd/) | 2026-09-10 | Red drink poured over ice into a branded cup |
| `assets/images/instagram/espresso-into-savva-cups.jpg` | [reel/DdCGu6UM5rV](https://www.instagram.com/savva_cafe/reel/DdCGu6UM5rV/) | 2026-09-08 | Espresso pouring into stacked sage and terracotta SAVVA paper cups |
| `assets/images/instagram/sandwich-and-iced-coffee-window-seat.jpg` | [p/Dc_kJc2MzdV](https://www.instagram.com/savva_cafe/p/Dc_kJc2MzdV/) | 2026-09-07 | Window seat: wrapped sandwich and iced coffee on a wooden board beside an open laptop, plants in the sun |
| `assets/images/instagram/tray-at-car-window.jpg` | [p/Dc8_ifwsihu](https://www.instagram.com/savva_cafe/p/Dc8_ifwsihu/) | 2026-09-06 | Tray with an iced drink and a cake slice handed through a car window |
| `assets/images/instagram/sandwich-on-branded-plate.jpg` | [p/Dc6pEniMBhh](https://www.instagram.com/savva_cafe/p/Dc6pEniMBhh/) | 2026-09-05 | Halved sesame-bun sandwich on a SAVVA-monogrammed plate against greenery |
| `assets/images/instagram/three-cups-on-counter.jpg` | [p/Dc37CqYsmCr](https://www.instagram.com/savva_cafe/p/Dc37CqYsmCr/) | 2026-09-04 | Three branded cups on the counter — berry, caramel, iced coffee |

"Nine most recent" means most recent **on 2026-09-14**. Refreshing the section means
replacing these files and the links in `content.*.json` → `instagram.items[]`.

Two further posts from 2026-09-04 and the pinned post of 2026-08-01 live in `gallery/`
(`barista-with-iced-coffee`, `iced-drinks-on-wooden-shelf`,
`matcha-berry-and-melon-drinks`) and are not repeated here.

## brand/

| File | Source | Date pulled | What it is |
|---|---|---|---|
| `assets/images/brand/savva-logo.svg` | traced from `assets/images/brand/savva-logo-sage.png` | 2026-09-15 | The SAVVA COFFEE wordmark as vector outlines. `viewBox="0 0 581.3 242"`, one `<path>`, `fill="currentColor"`, `fill-rule="evenodd"`, 4.4 KB |
| `assets/images/brand/savva-logo-sage.png` | GM — business profile picture of the card, `=s1024` | 2026-09-14 | The wordmark as delivered: cream on a solid sage plate, square, opaque. 1024×1024 |

**Use the SVG in the header and the footer, and inline it.** Two reasons, both hard:

1. It is painted with `currentColor`, so it takes the colour of whatever it sits in —
   `ink` on the cream `paper` header, `cream` on the `espresso` footer. Referenced through
   `<img src>` it loses that and renders black.
2. `.eleventy.js` passthrough-copies only `src/assets/static` and `src/js`; files under
   `src/assets/images/` reach the output solely through the `image` shortcode, which
   rasterises. An `<img src="/assets/images/brand/savva-logo.svg">` would 404.

The PNG is **not** for the header or the footer — it is an opaque sage plate and would show
as a rectangular patch on both. Keep it for the Open Graph / Twitter card image, where a
filled square is what is wanted, and as the reference the SVG was traced from.

The Instagram avatar is the same mark but is served only at 150×150, so the Google version
is the raster of record.

---

## Нужен кадр

Menu positions with no photograph of their own in either public source. They get the branded
sage tile (spec § story 25) — **never** someone else's picture. Keys are spelled as they
appear in `content.*.json` → `menu.items[].id`.

| Menu key | Name on the site | Why nothing fits |
|---|---|---|
| `spanish-latte` | Spanish Latte | The grid is full of iced drinks in identical branded cups; none is identified as a Spanish latte, and a guess would put a wrong caption on a real photo. |
| `cold-brew` | Cold Brew | No black iced coffee in either source — the cold drinks on the grid are berry, melon and milk-based. |
| `cheesecake` | Cheesecake | 36 mentions in Google reviews, no photo in the reachable part of the card. The one cake slice on the grid (`assets/images/instagram/tray-at-car-window.jpg`) is cut off at the frame edge. |

---

## Resolution ceiling — what the pipeline can and cannot make

The `image` shortcode was run over every file with the exact options from `.eleventy.js`
(widths 480/800/1200/1600, formats AVIF/WebP/JPEG). **Every file yields all three formats.**
The number of widths is capped by the source, because `@11ty/eleventy-img` does not upscale:

- Frames pulled at `=w1600` reach all four widths: the hero, `bar-counter-cups-and-grinder`,
  `interior-sofa-tray-espresso`, `terrace-tables-night`, `madini-cookies-menu-card`.
- The remaining Google frames stop at their own native width (672–1244 px).
- **Instagram frames stop at 640 px on the long side.** The public grid serves nothing
  larger: requesting `s1080x1080` breaks the URL signature and returns an empty body. This
  is the limit spec §7 already records, not something a build setting can lift.

Worth asking the owner for (already under "Открытые места" in the spec): high-resolution
originals of the Instagram material, and any interior photograph shot horizontally.
