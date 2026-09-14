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
