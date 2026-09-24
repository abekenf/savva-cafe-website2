<!-- autopilot:start -->
# Savva Cafe — лендинг

Одностраничный премиальный сайт кофейни Savva Cafe (Медина, Саудовская Аравия):
знакомит с брендом, показывает интерьер и меню, ведёт гостя к маршруту на карте.
Статика: Eleventy 3 + Tailwind CSS 4, без рантайм-фреймворков, EN/AR на двух страницах.
Визуальный язык — светлая «приложенческая» подача по референсу Bean & Co.
(`screens_references_claude/_inbox/bean-and-co-app.jpg`): кремовый фон, почти белые
карточки, один тёплый коричневый на все действия, жирный гротеск в заголовках.

**Где мы сейчас:** рабочая ветка `redesign/bean`, в проде (`main`) пока прошлый,
забракованный дизайн. Контекст переделки, ответы интервью и спецификация второго
этапа (акция с чеками) — в `docs/HANDOFF.md`, читать сразу после этого файла.

## Команды

| Команда | Что делает |
|---------|------------|
| `npm install` | Установить зависимости |
| `npm run dev` | Tailwind в watch-режиме + `eleventy --serve` на http://localhost:8080 |
| `npm run build` | `content-todo.js` → `build:css` (Tailwind → `_site/assets/app.css`) → `build:html` (Eleventy → `_site/`) |
| `npm test` | `node --test "test/**/*.test.js"` — 21 проверка по собранному `_site/` |

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
├── macros/hours.njk        — часы работы, свёрнутые в диапазоны дней (hero и подвал)
└── sections/*.njk           — nav, hero, menu, promo, place, visit, footer, tabs (нижняя панель)
src/en/, src/ar/            — по index.njk (порядок секций) + *.json (lang/dir/permalink)
src/css/main.css            — токены темы (@theme) и компонентные классы (@layer components)
src/js/app.js               — всё поведение страницы, один IIFE
src/assets/images/          — оригиналы фото (не копируются passthrough, только через {% image %})
test/build.test.js          — 21 тест на собранном _site/
```

## Ключевые файлы

- `.eleventy.js` — шорткод `{% image src, alt, sizes="100vw", eager=false, classes="" %}`, пустой `alt` роняет сборку; `build.preloadFont` — единственный прогреваемый шрифт на язык (EN — Manrope, AR — IBM Plex Sans Arabic), единый источник для `base.njk` и `main.css`; `build.preview` — `PREVIEW=1` показывает бейджи черновиков.
- `src/_data/content.{en,ar}.json` — тексты; правишь их, а не шаблоны, если меняется формулировка.
- `scripts/content-lib.js` — единственное место, знающее форму `{ "text": "…", "draft": true }`.
- `src/_data/eleventyComputed.js` — превращает draft-узлы в строки для шаблонов.
- `src/js/app.js` — шесть функций поведения в `init()`, контракт — `data-*` атрибуты.
- `.autopilot/2026-09-14-savva-cafe-landing/interfaces.md` — полный список `data-*` контрактов и решённых границ; читать перед правкой шва разметка↔поведение.

## Архитектура

**Тексты и два языка.** `src/_data/content.en.json` и `content.ar.json` — один и тот же набор из 129 путей ключей. `scripts/content-todo.js` перед каждой сборкой сверяет: (1) набор ключей идентичен в обоих файлах, (2) значения `image`, `imageNote`, `id` и якорных `href` (начинающихся с `#`) побайтово совпадают. Расхождение — это `process.exit(1)` со списком путей, а не предупреждение. `site.json` даёт общие факты (адрес, телефон, часы, JSON-LD), не переводится.

**Форма черновика.** Незаполненный текст пишется в JSON как `{ "text": "…", "draft": true }`. `src/_data/eleventyComputed.js` вызывает `resolve()` из `scripts/content-lib.js` и превращает это в обычную строку `t.about.body` плюс соседний булев флаг `t.about.bodyDraft` (для янтарного бейджа в шаблоне). Любое отклонение от точной формы (`draft: "true"`, лишний ключ, пустой `text`) роняет сборку с именем пути — второй такой проверки в кодовой базе нет. `draftSections` группирует по секции, `draftSite` — по фактам из `site.json` (это не секция).

**Конвейер изображений.** `<picture>` рендерится только через шорткод `{% image %}` из `.eleventy.js`, который зовёт `@11ty/eleventy-img`: AVIF + WebP + JPEG на ширинах 480/800/1200/1600, кеш в `.cache/`, выход в `_site/assets/img/`. `src/_data/media.js` в рантайме сканирует `src/assets/images/<группа>/` и отдаёт список реально существующих файлов (`media.files`); шаблоны обязаны проверять `{% if item.image in media.files %}` перед вызовом `{% image %}` и рисовать фирменную плитку-заглушку (`macros/brand.njk` → `monogram()`), если файла ещё нет — так словарь может ссылаться на кадр, которого ещё не привезли, без падения сборки.

**Шов «разметка ↔ поведение».** Только `data-*`-атрибуты, никогда — CSS-классы оформления. Полный список — `data-reveal`, `data-reveal-delay`, `data-nav`, `data-nav-toggle`, `data-nav-link`, `data-map`, `data-map-src`, `data-map-open`, `data-map-preview`, `data-day`/`data-opens`/`data-closes`, `data-hours` (+ `-open`/`-closed`/`-opens-at`/`-closes-at`), `data-copy` (+ `-done`/`-label`). `src/js/app.js` — один IIFE, `init()` на `DOMContentLoaded`, шесть независимых функций
(`reveal`, `nav`, `toTop`, `map`, `hours`, `copy`). Лайтбокс, параллакс и отложенная
загрузка шрифтов удалены вместе с секциями и шрифтами, которым принадлежали.
Исключение из контракта — кнопка «наверх» (`toTop`): хоста в разметке нет, `app.js`
создаёт её сам.

**Шрифты.** Две гарнитуры и больше никаких: **Manrope** (400–800, вариативная) задаёт
всю страницу, **IBM Plex Sans Arabic** — арабскую. Cormorant и Amiri удалены вместе с
антиквой и орнаментами. Первый экран не проявляется анимацией: его заголовок — самая
крупная отрисовка страницы, и вход через `data-reveal` только отодвигал бы её.

**Знак Savva.** `src/assets/images/brand/savva-logo.svg` инлайнится макросом `macros/brand.njk` (`sprite()` в `base.njk` один раз, дальше `mark()`/`monogram()` через `<use>`), а не подключается через `<img src>`: внутри `fill="currentColor"` — так знак перекрашивается между кремовой шапкой и тёмным подвалом, а `src/assets/images/` вообще не копируется passthrough.

**Карта без загрузки до клика.** В собранном HTML `<iframe>` карты нет: `data-map`/`data-map-src` на контейнере, `app.js` создаёт `<iframe>` только по клику на `[data-map-open]`. Это осознанный выбор ради Lighthouse, тест `test/build.test.js` проверяет отсутствие `<iframe>` на выходе.

## Соглашения кода

- Код и коммиты — английский; тексты сайта — английский и арабский.
- Рантайм — только ванильный ES6: React/jQuery/Alpine/GSAP/Swiper/lightbox-библиотеки не ставить.
  Исключение оговорено заранее: второй этап (акция с чеками) сознательно переводит проект
  на Next.js — это решение заказчика, а не отступление. До него сайт остаётся статикой.
- Новый CSS-компонент заводится в `main.css` только если среди существующих (`.container-page`, `.section`, `.section-head`/`.section-title`/`.section-lead`, `.btn` (+ `--primary`, `--quiet`, `--cream`), `.card`, `.rating`, `.field-label`, `.icon`, `.tabs`, `.skip-link`) правда нет подходящего.
- Надзаголовки (eyebrow) над заголовками секций не ставить: заголовок несёт себя сам.
- Засечки, орнаменты-разделители и тёмный первый экран в этом проекте под запретом — заказчик забраковал их прямым текстом.
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
- Блок «Акция» (`sections/promo.njk`) — пока витрина: механика чеков и розыгрыша не построена, кнопка честно ведёт в Instagram. Спецификация — в `docs/HANDOFF.md`.
- Секретов в проекте нет и быть не должно: переменных окружения нет, координаты карты встраиваются как обычный `output=embed`-URL без ключа.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
