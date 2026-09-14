# 07 — SEO, иконки, производительность и проверка сборки

**Требования:** R02, R18, R27, R36, R62, R63, R64, R65, R66, R67, R68, R69, R71, R72, R74i, R77i, R79i, G01
**Blocked by:** 06
**Зона:** `src/_includes/layouts/base.njk` (блок `<head>`) · `src/assets/static/icons/` · `test/`
**Волна:** 5
**Status:** ready

## Что должно заработать

Страница правильно выглядит в поиске и в мессенджере, имеет иконку, грузится быстрее
95 баллов Lighthouse, и всё это проверяется одной командой `npm test`, а не на глаз.

## Из брифа, дословно

> «Добавить: Title; Description; Open Graph; Schema.org Restaurant; favicon; alt-тексты изображений»
> «Использовать: Lazy Loading; Image Optimization; WebP»
> «Достичь оценки Lighthouse Performance выше 95»
> «Минимальный JavaScript»
> «Полностью адаптивный дизайн… iPhone; Android; iPad; Desktop»

## Разделы спецификации

История 20–23, 28; Решения §10 и §11; «Границы и швы» (шов один — собранный `_site/`).

## Что именно построить

- **`<head>` обеих версий:** `<title>`, `description`, `canonical`,
  `hreflang` на `en`, `ar` и `x-default`, Open Graph (`og:title`, `og:description`,
  `og:image` 1200×630, `og:locale`, `og:type=website`, `og:url`),
  Twitter `summary_large_image`, `theme-color` `#808366`.
- **OG-картинка** — собрать из фирменного кадра плюс логотип, 1200×630, положить в
  `src/assets/static/og/`, по одной на язык.
- **JSON-LD** — `"@type": ["Restaurant", "CafeOrCoffeeShop"]`, поля: `name`, `image`,
  `url`, `address` как `PostalAddress`, `geo` как `GeoCoordinates`, `telephone`,
  `openingHoursSpecification` — семь записей из `site.json`, `servesCuisine`,
  `priceRange`, `sameAs` на Instagram и Google Maps. Собирается из данных, не вписывается руками.
- **Иконки** — `favicon.svg` (квадрат `--color-sage` с кремовой монограммой),
  `favicon.ico` 32, `apple-touch-icon.png` 180, `icon-512.png`, `site.webmanifest`.
- **Производительность** — проверить и исправить. Три находки ревью таска 01, которые
  бьют прямо по Lighthouse и закрываются здесь:
  - `manrope-latin-{400,500,700}.woff2` побайтово идентичны (это один вариативный файл
    под тремя именами) — браузер тянет одни и те же 24 КБ трижды. Оставить один файл,
    один `@font-face` с `font-weight: 400 700`. То же для `-latin-ext-` тройки.
  - `preload` в `base.njk` греет вес 400, а первый экран рисуется весом 700 —
    греть тот файл, которым реально рисуется hero.
  - путь к шрифту продублирован в `base.njk` и `main.css` — свести к одному объявлению.
  Дальше — обычный список: `width`/`height` у всех картинок
  (нулевой CLS), `preload` на основной вес шрифта и на hero-изображение,
  CSS без неиспользуемых правил, `app.js` с `defer`, ни одного блокирующего запроса
  к стороннему домену в первом экране.
- **`README.md`** — строка про `npm test` сейчас описывает команду, которой ещё нет;
  после этого таска она становится правдой. Заодно вписать фактические оценки Lighthouse.
- **`canonical` и `hreflang` строятся на адресах `/` и `/ar`** (в `vercel.json` включён
  `cleanUrls`), а не на `/index.html` и `/ar/index.html`.
- **`test/build.test.js`** на `node --test`, работает только с `_site/`:
  обе страницы собрались · `lang`/`dir` верны · девять секций на месте ·
  у каждого `<img>` непустой `alt` · `title`/`description`/OG/`hreflang`/`canonical`
  присутствуют на обеих · JSON-LD парсится и содержит адрес, телефон и семь строк часов ·
  ключи `content.en.json` и `content.ar.json` совпадают · ни одной ссылки на `localhost`
  или внешний CDN · размер `app.js` ≤ 8 КБ · в исходном HTML нет `<iframe>`.
- Прогнать Lighthouse по собранному `_site/` и записать фактические четыре оценки
  в `README.md`. Если Performance ниже 95 — чинить, а не округлять.

## Критерии приёмки

- [ ] `npm test` зелёный, покрывает все перечисленные проверки
- [ ] JSON-LD проходит валидацию структуры и содержит семь строк часов
- [ ] Иконка видна во вкладке, `apple-touch-icon` на месте
- [ ] У каждого изображения на обеих версиях непустой осмысленный `alt`
- [ ] Lighthouse Performance > 95 на обеих страницах, цифры записаны в `README.md`
- [ ] Accessibility и Best Practices не ниже 95
- [ ] `CONTENT-TODO.md` актуален и перечисляет всё незаполненное
