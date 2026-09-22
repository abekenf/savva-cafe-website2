<!-- autopilot:start -->
# Savva Cafe — лендинг

Одностраничный премиальный сайт кофейни Savva Cafe (Медина, Саудовская Аравия):
знакомит с брендом, показывает интерьер и меню, ведёт гостя к маршруту на карте.
Статика: Eleventy 3 + Tailwind CSS 4, без рантайм-фреймворков, EN/AR на двух страницах.
Визуальный язык — семья F6 «тёплое ремесло», по референсу REF-028 (SYBAGA) из
`/Users/bek/Project in Claude/screens_references_claude`.

## Команды

| Команда | Что делает |
|---------|------------|
| `npm install` | Установить зависимости |
| `npm run dev` | Tailwind в watch-режиме + `eleventy --serve` на http://localhost:8080 |
| `npm run build` | `content-todo.js` → `build:css` (Tailwind → `_site/assets/app.css`) → `build:html` (Eleventy → `_site/`) |
| `npm test` | `node --test "test/**/*.test.js"` — 22 проверки по собранному `_site/` |

Перед `npm test` обязателен свежий `npm run build` — тесты читают файлы в `_site/`, не исходники.

## Структура

```
.eleventy.js              — конфиг Eleventy, шорткод {% image %} (eleventy-img)
scripts/
├── content-lib.js          — форма draft-узла: walk / resolve / checkDraft
└── content-todo.js         — генерит CONTENT-TODO.md, валит сборку при расхождении словарей
src/_data/
├── content.en.json, content.ar.json — все тексты сайта, оба языка
├── site.json                        — общие факты: адрес, телефон, часы, JSON-LD
├── eleventyComputed.js               — разворачивает draft-узлы в t / site / draftSections / draftSite
└── media.js                          — что реально лежит в src/assets/images/
src/_includes/
├── layouts/base.njk        — <head>, SEO, JSON-LD, шрифты, подключение CSS/JS
├── macros/brand.njk        — инлайновый SVG-знак Savva (sprite/mark/monogram)
├── macros/nav.njk          — общие пункты меню и переключатель языка
├── macros/ornament.njk     — орнамент-разделитель и заголовок секции `sectionHead()`
├── macros/hours.njk        — часы работы, свёрнутые в диапазоны дней (hero и подвал)
└── sections/*.njk           — 9 секций: nav, hero, about, menu, gallery, experience, visit, instagram, footer
src/en/, src/ar/            — по index.njk (порядок секций) + *.json (lang/dir/permalink)
src/css/main.css            — токены темы (@theme) и компонентные классы (@layer components)
src/js/app.js               — всё поведение страницы, один IIFE
src/assets/images/          — оригиналы фото (не копируются passthrough, только через {% image %})
test/build.test.js          — 22 теста на собранном _site/
```

## Ключевые файлы

- `.eleventy.js` — шорткод `{% image src, alt, sizes="100vw", eager=false, classes="" %}`, пустой `alt` роняет сборку; `build.preloadFont` — единственный прогреваемый шрифт на язык (EN — Manrope, AR — латинский срез Cormorant под строку бренда), единый источник для `base.njk` и `main.css`; `build.preview` — `PREVIEW=1` показывает бейджи черновиков.
- `src/_data/content.{en,ar}.json` — тексты; правишь их, а не шаблоны, если меняется формулировка.
- `scripts/content-lib.js` — единственное место, знающее форму `{ "text": "…", "draft": true }`.
- `src/_data/eleventyComputed.js` — превращает draft-узлы в строки для шаблонов.
- `src/js/app.js` — девять функций поведения в `init()`, контракт — `data-*` атрибуты.
- `.autopilot/2026-09-14-savva-cafe-landing--wip/interfaces.md` — полный список `data-*` контрактов и решённых границ; читать перед правкой шва разметка↔поведение.

## Архитектура

**Тексты и два языка.** `src/_data/content.en.json` и `content.ar.json` — один и тот же набор из 185 путей ключей. `scripts/content-todo.js` перед каждой сборкой сверяет: (1) набор ключей идентичен в обоих файлах, (2) значения `image`, `imageNote`, `id` и якорных `href` (начинающихся с `#`) побайтово совпадают. Расхождение — это `process.exit(1)` со списком путей, а не предупреждение. `site.json` даёт общие факты (адрес, телефон, часы, JSON-LD), не переводится.

**Форма черновика.** Незаполненный текст пишется в JSON как `{ "text": "…", "draft": true }`. `src/_data/eleventyComputed.js` вызывает `resolve()` из `scripts/content-lib.js` и превращает это в обычную строку `t.about.body` плюс соседний булев флаг `t.about.bodyDraft` (для янтарного бейджа в шаблоне). Любое отклонение от точной формы (`draft: "true"`, лишний ключ, пустой `text`) роняет сборку с именем пути — второй такой проверки в кодовой базе нет. `draftSections` группирует по секции, `draftSite` — по фактам из `site.json` (это не секция).

**Конвейер изображений.** `<picture>` рендерится только через шорткод `{% image %}` из `.eleventy.js`, который зовёт `@11ty/eleventy-img`: AVIF + WebP + JPEG на ширинах 480/800/1200/1600, кеш в `.cache/`, выход в `_site/assets/img/`. `src/_data/media.js` в рантайме сканирует `src/assets/images/<группа>/` и отдаёт список реально существующих файлов (`media.files`); шаблоны обязаны проверять `{% if item.image in media.files %}` перед вызовом `{% image %}` и рисовать фирменную плитку-заглушку (`macros/brand.njk` → `monogram()`), если файла ещё нет — так словарь может ссылаться на кадр, которого ещё не привезли, без падения сборки.

**Шов «разметка ↔ поведение».** Только `data-*`-атрибуты, никогда — CSS-классы оформления. Полный список — `data-reveal`, `data-reveal-delay`, `data-nav`, `data-nav-toggle`, `data-nav-link`, `data-parallax`, `data-lightbox`, `data-lightbox-group`, `data-lightbox-index`, `data-map`, `data-map-src`, `data-map-open`, `data-map-preview`, `data-day`/`data-opens`/`data-closes`, `data-hours` (+ `-open`/`-closed`/`-opens-at`/`-closes-at`), `data-copy` (+ `-done`/`-label`). `src/js/app.js` — один IIFE, `init()` на `DOMContentLoaded`, девять независимых функций (`reveal`, `nav`, `parallax`, `lightbox`, `toTop`, `map`, `hours`, `copy`, `lateFonts`). `lateFonts` после загрузки и первой отрисовки ставит на `<html>` класс `fonts-late`, который включает шрифты, не нужные первому экрану (сейчас — Amiri для арабских заголовков). Исключение — кнопка «наверх» (`toTop`): у неё нет хоста в разметке, `app.js` создаёт и добавляет её сам.

**Шрифты и порядок загрузки.** Три голоса: Manrope — текст и интерфейс; Cormorant Garamond — строка бренда и заголовки секций (антиква, F6); IBM Plex Sans Arabic — арабский текст. Арабские заголовки — Amiri (срез на весь алфавит, 42 КБ), имя «سافا» под знаком — Amiri на три буквы (2 КБ, семейство `Savva Arabic`). На арабской странице строка бренда (английская, дословно из Instagram) набирается латинским срезом Cormorant на 12 КБ (`Cormorant Line`). Шрифт, которым первый экран не рисует, грузится после первой отрисовки через `fonts-late` — иначе Lighthouse на арабской странице падает до 95. Первый экран не проявляется анимацией: его строка бренда — самая крупная отрисовка страницы.

**Знак Savva.** `src/assets/images/brand/savva-logo.svg` инлайнится макросом `macros/brand.njk` (`sprite()` в `base.njk` один раз, дальше `mark()`/`monogram()` через `<use>`), а не подключается через `<img src>`: внутри `fill="currentColor"` — так знак перекрашивается между кремовой шапкой и тёмным подвалом, а `src/assets/images/` вообще не копируется passthrough.

**Карта без загрузки до клика.** В собранном HTML `<iframe>` карты нет: `data-map`/`data-map-src` на контейнере, `app.js` создаёт `<iframe>` только по клику на `[data-map-open]`. Это осознанный выбор ради Lighthouse, тест `test/build.test.js` проверяет отсутствие `<iframe>` на выходе.

## Соглашения кода

- Код и коммиты — английский; тексты сайта — английский и арабский.
- Рантайм — только ванильный ES6: React/Next.js/jQuery/Alpine/GSAP/Swiper/lightbox-библиотеки не ставить.
- Новый CSS-компонент заводится в `main.css` только если среди существующих (`.container-page`, `.section`, `.section-head`/`.section-title`, `.ornament`, `.btn-frame` (+ `--solid`, `--ink`), `.eyebrow`, `.card`, `.skip-link`) правда нет подходящего. `.btn-primary`/`.btn-ghost` удалены — кнопки только в рамке.
- Заголовок секции — только через макрос `sectionHead()` из `macros/ornament.njk`: надзаголовки (eyebrow) над заголовками не ставить.
- Полупрозрачные цвета в новом CSS — через `color-mix(in oklab, var(--color-…) N%, transparent)`, не литералами `rgb(… / …)`.
- Один коммит — одна законченная вещь, формат `feat: …` / `fix: …` / `refactor: …`.
- `CONTENT-TODO.md` генерируется `scripts/content-todo.js` на каждой сборке — руками не редактировать, править данные.

## Тесты

`test/build.test.js` — единственный файл, `node --test`, 22 проверки, единственный шов — собранный `_site/` (парсит `index.html` и `ar/index.html` как их получает браузер). Юнит-тестов на шаблоны или функции `app.js` нет намеренно. Прогнать один файл: `node --test test/build.test.js` (сейчас он и так единственный).

## Подводные камни

- Пустой `alt` в `{% image %}` — это `throw`, а не предупреждение.
- Расхождение словарей `content.en.json`/`content.ar.json` по ключам или по `image`/`imageNote`/`id`/`#`-якорям валит `npm run build` целиком, до Eleventy.
- `npm run dev` фонит Tailwind-watch через `&` — пакет `concurrently` в проект специально не ставился.
- `npm audit` показывает 3 high в транзитивных `sharp`/`image-size` — версии не менялись намеренно.
- В минифицированном `app.css` есть комментарий-лицензия Tailwind со ссылкой на `tailwindcss.com` — это не «внешний запрос», проверка в тестах смотрит только `href`/`src`.
- Подпись в лайтбоксе берётся из `alt` картинки, отдельного атрибута для неё нет и не планируется — дублирование развело бы два источника правды.
- Стартовое скрытое состояние для `data-reveal` ставит JS, а не CSS: без JavaScript страница остаётся видимой.
- Разрядку (letter-spacing) на арабском тексте не ставить никогда — она рвёт соединения букв; у каждого правила с трекингом есть пара `[dir="rtl"] … { letter-spacing: 0 }`.
- Новый шрифт — только самостоятельно хостить, срезом под нужные символы (Google Fonts, параметр `text=`); `font-display: swap`.
- Секретов в проекте нет и быть не должно: переменных окружения нет, координаты карты встраиваются как обычный `output=embed`-URL без ключа.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
