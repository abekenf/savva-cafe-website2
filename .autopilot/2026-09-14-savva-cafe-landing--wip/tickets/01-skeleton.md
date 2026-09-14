# 01 — Каркас сборки и дизайн-система

**Требования:** R70, R71, R21, R25, R30, R31, R32, R33, R34, R35, R36, R17, R19, R74i, G01, R04, R07, R14, R29, R73
**Blocked by:** —
**Зона:** `package.json` · `.eleventy.js` · `vercel.json` · `src/css/` · `src/_includes/layouts/` · `src/en/` · `src/ar/` · `src/_includes/sections/` (только пустые заглушки) · `README.md`
**Волна:** 1
**Status:** ready

## Что должно заработать

`npm install && npm run build` собирает две страницы — `_site/index.html` и
`_site/ar/index.html`. Обе пустые по содержанию, но настоящие: правильные `lang` и `dir`,
подключённый CSS с фирменными токенами, подключённый (пока пустой) `app.js`,
подключённые самохостящиеся шрифты, skip-link, и девять пустых секций-заглушек
в правильном порядке. Дальше каждый следующий таск наполняет свои секции, не трогая
ни каркас, ни чужие файлы.

## Из брифа, дословно

> «Используй: HTML5; CSS3; Tailwind CSS; JavaScript ES6»
> «Код должен быть чистым, структурированным и готовым к размещению на Vercel»
> «Минимализм. Много воздуха. Крупная типографика. Натуральные оттенки. Мягкие тени.»
> «Используй современный шрифт. Например: Manrope; Inter; General Sans»
> «Избегать ярких цветов»

## Разделы спецификации

«Фирменный стиль» целиком (палитра, типографика, сетка, уровень исполнения),
Решения §1–§4, «Границы и швы».

## Что именно построить

- `package.json`: скрипты `build`, `dev`, `test`; зависимости — `@11ty/eleventy`,
  `@11ty/eleventy-img`, `tailwindcss`, `@tailwindcss/cli`. Больше ничего.
- `.eleventy.js`: input `src`, output `_site`, Nunjucks; шорткод `image`
  (AVIF+WebP+JPEG, ширины 480/800/1200/1600, `width`/`height` в разметке,
  `loading="lazy"` по умолчанию, `eager` + `fetchpriority="high"` по флагу);
  passthrough для `src/assets/static`, `src/js`; кеш изображений в `.cache/`.
- `src/css/main.css`: `@import "tailwindcss"`, блок `@theme` со **всеми** токенами
  из таблицы спецификации, включая `--color-latte`, `--color-coffee`, `--color-espresso`;
  шкала шрифтов и вертикального ритма; `@layer components` с `.btn-primary`,
  `.btn-ghost`, `.card`, `.section`, `.container-page`, `.eyebrow`, `.h-display`.
  Тени — только две: `--shadow-soft` и `--shadow-lift`.
- Шрифты: Manrope (400/500/700) и IBM Plex Sans Arabic (400/600), `.woff2`, в
  `src/assets/static/fonts/`, подключены через `@font-face` с `font-display: swap`
  и `<link rel="preload">` на основной вес. Скачать с Google Fonts при сборке нельзя —
  файлы кладутся в репозиторий.
- `src/_includes/layouts/base.njk`: `<html lang dir>`, `<head>` с местом под SEO
  (наполнит таск 07), skip-link, шапка-заглушка, `{{ content }}`, подвал-заглушка,
  `<script src="/js/app.js" defer>`.
- `src/en/index.njk` и `src/ar/index.njk`: одинаковые, включают девять секций по
  порядку — `nav`, `hero`, `about`, `menu`, `gallery`, `experience`, `visit`,
  `instagram`, `footer`. Рядом `src/en/en.json` и `src/ar/ar.json` с `lang`, `dir`,
  `permalink`.
- `src/_includes/sections/*.njk` — девять файлов, в каждом только `<section id="…">`
  с комментарием «наполняется таском NN». **Создать все девять здесь**, чтобы таски
  04 и 05 писали каждый в свои файлы и не сталкивались.
- `src/js/app.js` — пустой `init()` на `DOMContentLoaded`.
- `vercel.json`: `buildCommand`, `outputDirectory: "_site"`, заголовки
  `Cache-Control: public, max-age=31536000, immutable` для `/assets/*`.
- `README.md`: что это, как поставить, как запустить, как собрать, как выложить на Vercel.

## Критерии приёмки

- [ ] `npm install && npm run build` проходит без ошибок и предупреждений
- [ ] `_site/index.html` имеет `lang="en" dir="ltr"`, `_site/ar/index.html` — `lang="ar" dir="rtl"`
- [ ] Обе страницы содержат девять `<section>` в заданном порядке
- [ ] Собранный CSS содержит все одиннадцать цветовых токенов из спецификации
- [ ] Шрифты отдаются с собственного домена, ни одного запроса на fonts.googleapis.com
- [ ] В `_site/` нет ни одной ссылки на внешний CDN
- [ ] `README.md` описывает все четыре команды
