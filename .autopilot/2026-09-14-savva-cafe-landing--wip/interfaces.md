# Интерфейсы и правила проекта

Файл читают **все** исполнители перед тем, как написать первую строку.
Первый раздел скопирован из спецификации дословно — это решённые границы,
а не предложение их обсудить.

## Правила, которые нельзя вывести из кода

- **Стек:** Node ≥ 20, Eleventy 3 (Nunjucks), Tailwind CSS 4 через `@tailwindcss/cli`,
  `@11ty/eleventy-img`, ванильный ES6. Никаких фреймворков в рантайме.
  React, Next.js, jQuery, Alpine, GSAP, Swiper, lightbox-библиотеки — **не ставить**.
- **Команды:**
  - `npm install` — зависимости
  - `npm run build` — Tailwind + Eleventy → `_site/`
  - `npm run dev` — то же в watch
  - `npm test` — `node --test test/` по собранному `_site/`
- **Недостающая зависимость — это `BLOCKED`, а не `npm install <что-то ещё>`.**
  Вернись с отчётом, не расширяй список пакетов самовольно.
- **Не трогать:** `.autopilot/`, `brif2.md`, `CLAUDE.md` вне маркеров `autopilot`.
- **Секреты:** в проекте их нет и быть не должно. Ключи Google Maps не нужны —
  карта встраивается через `output=embed`.
- **Язык кода и коммитов** — английский. Тексты сайта — английский и арабский.
  Комментарии в коде — английский, только там, где решение неочевидно.
- **Каждый коммит — одна законченная вещь**, формат `feat: …` / `fix: …` / `refactor: …`.

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `content` (`src/_data/*.json`) | всеми текстами, контактами, списками меню/галереи/преимуществ | словарь `t` и объект `site` в шаблонах | форму `draft`-флага и генерацию `CONTENT-TODO.md` |
| `layout` (`src/_includes/layouts/base.njk`) | каркасом документа: `<head>`, SEO, шрифты, skip-link, подключение CSS/JS | слот `{{ content }}`; переменные `lang`, `dir`, `t`, `site` | сборку мета-тегов и JSON-LD |
| `sections` (`src/_includes/sections/*.njk`) | разметкой одной секции каждая | `{% include "sections/<name>.njk" %}`, читает только `t` и `site` | собственные классы и внутреннюю структуру |
| `img` (шорткод в `.eleventy.js`) | генерацией растра и `<picture>` | `{% image src, alt, sizes, eager %}` | форматы, ширины, кеш, вычисление `sizes` |
| `styles` (`src/css/main.css`) | токенами темы и компонентными классами | утилиты Tailwind и переменные `@theme` | внутреннюю структуру `@layer components` |
| `behaviour` (`src/js/app.js`) | всем поведением страницы | один `init()` на `DOMContentLoaded`; контракт — `data-*` атрибуты в разметке | реализацию каждого поведения |

**Связь `sections` ↔ `behaviour` идёт только через `data-`атрибуты**, не через классы
оформления: `data-reveal`, `data-reveal-delay`, `data-lightbox`, `data-lightbox-group`,
`data-parallax`, `data-map`, `data-map-src`, `data-hours`, `data-nav-toggle`,
`data-copy`, `data-to-top`. Разметка объявляет намерение, скрипт его исполняет.
Секция не знает, как это сделано; скрипт не знает, как это выглядит.

## Шов для тестов — один

Собранный `_site/`. Проверки живут в `test/build.test.js` и работают только с ним:
парсят `_site/index.html` и `_site/ar/index.html`. Никаких юнит-тестов на шаблоны и
на функции скрипта — поведение проверяется через выход сборки.

## Что уже построено

Заполняется по мере готовности тасков. Каждый исполнитель дописывает сюда то,
на что смогут опереться следующие: имена ключей данных, имена секций, классы-компоненты,
`data-`атрибуты, которые он объявил.

### Из таска 01 — каркас сборки и дизайн-система

**Шорткод изображений.** `{% image src, alt, sizes="100vw", eager=false, classes="" %}`
→ `<picture>` с AVIF/WebP/JPEG в ширинах 480/800/1200/1600. `src` — относительно `src/`
(например `"assets/images/hero/interior.jpg"`). **Пустой `alt` роняет сборку** — это намеренно.

**Каркас документа.** `layouts/base.njk` даёт `lang`, `dir`, `t`, `site`, `{{ content }}`
и skip-link на `#main`. В `<head>` оставлен пустой блок под SEO — его наполняет таск 07.
Ожидает `t.meta.title` и `t.a11y.skipToContent`, у обоих есть фолбэки.

**Порядок страницы.** `index.njk` включает `nav` → `<main id="main">` c hero…instagram →
`footer`. Навигация и подвал намеренно вне `<main>`.

**Токены темы** (`src/css/main.css`, блок `@theme`):
`--color-{sage,sage-deep,cream,paper,sand,terracotta,ink,ink-soft,latte,coffee,espresso}`,
`--font-{sans,arabic}`, `--text-{eyebrow,display,h1,h2,h3,body,small}`,
`--spacing-{gutter,section,measure}`, `--shadow-{soft,lift}`, `--radius-tile`,
`--ease-brand`, `--container-page`.

**Классы-компоненты:** `.container-page` `.section` `.h-display` `.eyebrow`
`.btn-primary` `.btn-ghost` `.card` `.skip-link`. Новых компонентов без нужды не заводить —
сначала посмотреть, нет ли подходящего здесь.

**Поведение.** `src/js/app.js` — IIFE с одним `init()` на `DOMContentLoaded`;
каждое поведение регистрируется внутри него.

**Пути на выходе:** `/assets/app.css`, `/js/app.js`,
`/assets/static/fonts/<slug>-<subset>-<weight>.woff2`, `/assets/img/` (генерация шорткода).

**Данные страниц:** `src/en/en.json` и `src/ar/ar.json` задают `lang`, `dir`, `layout`,
`permalink` (`/index.html` и `/ar/index.html`).

**Оговорки таска 01, которые касаются следующих:**
- в минифицированном `app.css` есть комментарий с лицензией Tailwind и URL `tailwindcss.com` —
  это не запрос; проверка «внешних ссылок» в таске 07 должна смотреть только `href`/`src`;
- `npm run dev` поднимает watch Tailwind фоном через `&`, пакет `concurrently` ставить нельзя;
- `npm audit` показывает 3 high в транзитивных `sharp`/`image-size` — версии не менялись намеренно.

### Из таска 03 — словари двух языков

**Фильтра нет.** `.eleventy.js` вне зоны таска 03, поэтому разворачивание `draft`-объектов
происходит в слое данных (`src/_data/eleventyComputed.js`). В шаблоне `t.*` — **всегда
обычная строка**, никаких `{{ t.x | text }}`.

**Четыре глобала в шаблонах:** `t`, `site`, `media`, `draftSections` / `draftPaths`.

**`t` — схема ключей** (одинаковая в обоих языках, 194 пути; паритет **действительно** проверяется
`scripts/content-todo.js` — расхождение роняет сборку с перечислением путей):

- `meta{title, description, ogAlt, path, altPath}`
- `a11y{skipToContent, primaryNav, footerNav, openMenu, closeMenu, backToTop,
  languageSwitch, openLightbox, closeLightbox, previousImage, nextImage,
  galleryImageCount, draftBadge, draftBadgeHint}`
- `nav{brand, brandAlt, links[6]{id, href, label},
  language{current, other, otherHref, otherLang}}`
- `hero{eyebrow, title, titleAlt, subtitle, ctaMenu, ctaDirections, scrollHint, image, imageAlt}`
- `about{eyebrow, title, body, quote, quoteSource, image, imageAlt}`
- `menu{eyebrow, title, photoComingSoon, items[6]{id, name, desc, image, imageAlt}}`
- `gallery{eyebrow, title, items[11]{image, alt}}`
- `experience{eyebrow, title, items[6]{id, label}}`
- `visit{eyebrow, title, addressLabel, phoneLabel, hoursLabel, showMap, mapTitle,
  mapPreviewAlt, openInMaps, copyAddress, addressCopied, openNow, closedNow,
  opensAt, closesAt, days{sat…fri}}`
- `instagram{eyebrow, title, cta, note, items[9]{image, alt, href}}`
- `footer{logoAlt, navTitle, followTitle, findTitle, contactTitle, instagram, maps,
  copyright, ratingNote}`

Порядок `menu.items` фиксирован: `flat-white`, `spanish-latte`, `matcha-latte`,
`cold-brew`, `cheesecake`, `cookies`.
Порядок `experience.items` фиксирован: `specialty-coffee`, `fresh-desserts`,
`cozy-interior`, `free-wifi`, `outdoor-seating`, `friendly-staff`.

**`site`** — `name, nameAr, legalName, category, handle, url, locale{en,ar},
phone{display,href}, address{full, streetAddress, addressLocality, addressRegion,
postalCode, addressCountry, plusCode}, geo{latitude,longitude},
hours[7]{day, dayOfWeek, opens, closes}, rating{value,count},
links{maps, mapsEmbed, instagram}, capturedOn`.

**Форма `draft`.** В JSON пишется как `{"text": "…", "draft": true}`, в шаблон приходит
обычной строкой плюс соседним булевым `<ключ>Draft`. То есть `{{ t.about.body }}` печатает
текст, а `{% if t.about.bodyDraft %}` включает янтарный бейдж.
Черновые сегодня: `hero.subtitle`, `about.body`, `menu.items[i].desc`,
`instagram.items[i].href`, `site.url`.
`draftSections` = `{hero, about, menu, instagram, site}` — **ключ `site` не секция**,
бейджем его не помечать. `draftPaths` — массив путей, по одному на строку.

**`media`** — `{hero[], gallery[], menu[], instagram[], brand[], files[], count}`,
пути относительно `src/`, ровно в той форме, которую ждёт шорткод `image`.
**Перед каждым вызовом `{% image %}` проверяй `{% if item.image in media.files %}`** —
иначе рисуй фирменную плитку-заглушку. Имена файлов в словарях писались до того, как
таск 02 положил кадры, поэтому часть путей не совпадёт; `media.files` для того и есть.

**Подстановки в текстах**, которые раскрывают таски 05 и 06:
`{year}` в `footer.copyright`, `{time}` в `visit.opensAt` / `visit.closesAt`,
`{n}` и `{total}` в `a11y.galleryImageCount`.

### Из таска 02 — фотографии

Раскладка: `src/assets/images/<категория>/<имя-по-содержимому>.jpg`.
Путь для шорткода `image` — `"assets/images/<категория>/<файл>.jpg"`.
Происхождение каждого файла — `ASSETS.md` в корне: источник, дата съёма, что на кадре.

- **`hero/` — 2.** `interior-lounge-arches-wide.jpg` (1600×900, **это hero**: настоящий
  интерьер, арочные окна, бархатные диваны, растения) и `storefront-evening-wide.jpg`
  (1170×655, запасной).
- **`gallery/` — 11.** Три интерьера, три витрина/терраса, пять деталей и напитков.
- **`menu/` — 3.** `flat-white.jpg`, `matcha-latte.jpg`, `madini-cookies.jpg`, все 4:5.
- **`instagram/` — 9**, девять последних постов на 2026-09-14, от новых к старым:
  `madini-cookies-closeup`, `iced-berry-drink`, `frozen-berry-drink`,
  `pouring-berry-drink`, `espresso-into-savva-cups`,
  `sandwich-and-iced-coffee-window-seat`, `tray-at-car-window`,
  `sandwich-on-branded-plate`, `three-cups-on-counter`.
  **Ссылки на посты, даты и авторские описания — в `ASSETS.md`.**
- **`brand/` — 1.** `savva-logo.jpg`, 1024×1024, кремовое «SAVVA COFFEE» на шалфейном.

**Без своего кадра остались три позиции меню — `spanish-latte`, `cold-brew`,
`cheesecake`.** Там рисуется фирменная плитка (таск 04).

**Потолок разрешения.** Только 5 кадров из 26 добирают все четыре ширины: eleventy-img
не увеличивает, а публичная сетка Instagram упёрта в 640 px, анонимный просмотр Google
Maps — в «limited view». Это записано в §7 спецификации и в «Открытых местах»:
оригиналы от владельца поднимут инстаграмные кадры выше 640.

**Оговорка по `menu/flat-white.jpg`:** это молочный кофе с латте-артом из галереи Google,
а не кадр, который Savva подписала «Flat White». В `ASSETS.md` сказано прямо, чтобы имя
файла не читалось как подпись.

### Уточнения после дозапросов по таскам 02 и 03

- **Форма `draft` живёт в `scripts/content-lib.js`** — один модуль, которым пользуются и
  слой данных, и генератор `CONTENT-TODO.md`. Узел с ключом `draft` или `text`, но с
  нарушенной формой, **роняет сборку** с именем ключа. Второй обход словаря не писать.
- **`draftSections` содержит только имена настоящих секций.** Черновики `site.json`
  вынесены в отдельный глобал `draftSite`. Исключения «ключ `site` не помечать» больше нет.
- **`<ключ>Note` — необязательная оговорка к кадру.** `menu.items[0].imageNote` рядом с
  `menu.items[0].image`. В разметке **не рендерится**; генератор выносит её владельцу
  в раздел «Confirm the photo». Обязана присутствовать в обоих словарях — паритет её ловит.
- **`gallery.items` — 9, а не 11.** Убраны кадры, которые уже заняты карточкой меню и
  инстаграм-плиткой: галерея не повторяет то, что гость уже видел выше.
- **Девять `instagram.items[].href` — настоящие permalink'и**, флага `draft` на них нет.

### Знак Savva — правило для тасков 04 и 05

**`src/assets/images/brand/savva-logo.svg` инлайнится в разметку, а не подключается
через `<img src>`.** Две причины, обе жёсткие:

1. Внутри одна `<path fill="currentColor">` — именно это делает знак тёмным на кремовой
   шапке и кремовым на тёмном подвале. Через `<img>` перекраска не работает.
2. `src/assets/images/` не копируется passthrough, поэтому `<img src="assets/images/…">`
   отдаст 404.

`viewBox="0 0 581.3 242"`, 4.4 КБ, обведён с растрового оригинала и сверен растеризацией.
Подпись для `aria-label` — в данных: `t.footer.logoAlt`. **Пути к знаку в словарях нет**
и быть не должно: разметку пишут таски 04 и 05.

`savva-logo-sage.png` (непрозрачная шалфейная плашка) — **только og-картинка**.
В шапку и подвал не идёт никогда.

### Итог по кадрам после обоих дозапросов

30 файлов: `hero/` 2 · `gallery/` 14 · `menu/` 3 · `instagram/` 9 · `brand/` 2.
В `gallery.items` словарей стоят 11 из 14 — три отброшены как кропы тех же постов,
что уже заняты карточками меню и инстаграм-плитками. Интерьеров в галерее 6 из 11,
в четырёх разных зонах; первый кадр галереи — **не** тот, что в первом экране.

**Паритет словарей стережёт и значения, а не только ключи.** Совпадать обязаны
`image`, `imageNote`, `id` и якорные `href` (те, что начинаются с `#`) — 53 значения.
Законно различаются только `meta.path`, `meta.altPath`, `nav.language.otherHref`
и `nav.language.otherLang`.

### Шов «секции ↔ поведение» — что именно едет через `data-`

Из таска 04 (`nav`, `hero`, `about`, `menu`):
`[data-nav]` (таск 06 ставит и снимает `data-nav-scrolled` после 40px и `data-nav-open`) ·
`[data-nav-toggle]` с `aria-expanded`, `aria-controls="nav-panel"`, `data-label-open`,
`data-label-close` · `#nav-panel` отдан с атрибутом `hidden`, **атрибутом владеет таск 06** ·
`[data-nav-link="<id>"]` на двенадцати ссылках, у каждой `aria-current="false"` ·
`[data-parallax]` на `.hero__media` (слой высотой 116%, сдвиг ровно 12%) ·
`[data-reveal]` и `[data-reveal-delay="<мс>"]`.

Из таска 05 (`gallery`, `experience`, `visit`, `instagram`, `footer`):
`button[data-lightbox][data-lightbox-group="gallery"][data-lightbox-index=0…10]` ·
`div[data-map][data-map-src][data-map-title]` с `div[data-map-preview]` и
`button[data-map-open]` внутри · `li[data-day][data-opens][data-closes]` — семь строк,
источник правды для «сейчас открыто» · `p[data-hours]` с `data-hours-open`, `-closed`,
`-opens-at`, `-closes-at` (в строках `{time}` не раскрыт), элемент `empty:hidden` ·
`button[data-copy][data-copy-done]` со `span[data-copy-label]` внутри.

**Подпись к кадру в лайтбоксе контрактом не едет.** Группа, индекс и счётчик — атрибутами,
а текст подписи таск 06 берёт из `alt` картинки внутри `<picture>`. Зависимость записана
здесь намеренно: дублировать alt во второй атрибут — значит завести второй источник правды
для одной и той же строки, и они разъедутся. **`alt` — это и есть подпись.**

**Стартовое скрытое состояние для `reveal` ставит JS, никогда CSS.** Иначе страница
без JavaScript останется пустой.

