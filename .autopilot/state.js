window.STATE =
{
  "slug": "savva-cafe-landing",
  "dir": "2026-09-14-savva-cafe-landing--wip",
  "title": "Премиальный лендинг кофейни Savva Cafe (Медина)",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T2",
  "briefFile": "2026-09-14-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/bek/.agents/skills/autopilot",
  "startedAt": "2026-09-14T12:12:37+05:00",
  "updatedAt": "2026-09-15T13:07:50+05:00",
  "finishedAt": null,
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-09-14T12:12:37+05:00",
      "finishedAt": "2026-09-14T12:13:13+05:00"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-09-14T12:13:13+05:00",
      "finishedAt": "2026-09-14T12:14:37+05:00",
      "note": "79 требований"
    },
    {
      "id": "briefing",
      "status": "done",
      "startedAt": "2026-09-14T12:14:37+05:00",
      "finishedAt": "2026-09-14T18:21:24+05:00",
      "note": "5 вопросов"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-09-14T18:21:24+05:00",
      "finishedAt": "2026-09-14T18:30:06+05:00",
      "note": "G2: 13 расхождений, закрыты"
    },
    {
      "id": "plan",
      "status": "done",
      "startedAt": "2026-09-14T18:30:06+05:00",
      "finishedAt": "2026-09-14T18:35:09+05:00",
      "note": "7 тасков, ярус T2, 5 волн"
    },
    {
      "id": "build",
      "status": "active",
      "startedAt": "2026-09-14T18:35:09+05:00",
      "note": "6 из 7 тасков собраны"
    },
    {
      "id": "review",
      "status": "active",
      "startedAt": "2026-09-14T18:47:41+05:00",
      "note": "проверены 3 из 7"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 0,
    "done": 39,
    "inTicket": 78,
    "inSpec": 0,
    "placeholder": 0,
    "deferred": 2,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Каркас сборки и дизайн-система",
      "requirements": [
        "R70",
        "R71",
        "R21",
        "R25",
        "R30",
        "R31",
        "R32",
        "R33",
        "R34",
        "R35",
        "R36",
        "R17",
        "R19",
        "R74i",
        "G01",
        "R04",
        "R07",
        "R14",
        "R29",
        "R73"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "package.json",
        ".eleventy.js",
        "vercel.json",
        "src/css/",
        "src/_includes/layouts/",
        "src/en/",
        "src/ar/",
        "src/_includes/sections/"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-14T18:36:13+05:00",
      "finishedAt": "2026-09-14T18:47:41+05:00",
      "files": [
        "package.json",
        ".eleventy.js",
        "vercel.json",
        "README.md",
        "src/css/main.css",
        "src/_includes/layouts/base.njk",
        "src/_includes/sections/*.njk",
        "src/en/",
        "src/ar/",
        "src/js/app.js",
        "src/assets/static/fonts/"
      ],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "concerns": [
        "тестов нет намеренно — шов строит таск 07"
      ]
    },
    {
      "id": "02",
      "title": "Фотографии и их происхождение",
      "requirements": [
        "R03",
        "R05",
        "R10",
        "R20",
        "R28",
        "R67",
        "R75i"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "src/assets/images/",
        "ASSETS.md"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-14T18:48:06+05:00",
      "finishedAt": "2026-09-15T04:33:12+05:00",
      "note": "закрыт после дозапросов; все находки ревью сняты"
    },
    {
      "id": "03",
      "title": "Словари двух языков и список для владельца",
      "requirements": [
        "R38",
        "R39",
        "R42",
        "R43",
        "R44",
        "R45",
        "R46",
        "R49",
        "R51",
        "R53",
        "R72",
        "R74i",
        "R79i",
        "G01",
        "R06",
        "R76i"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "src/_data/",
        "scripts/"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 1,
      "startedAt": "2026-09-14T18:48:06+05:00",
      "note": "закрыт после дозапросов; все находки ревью сняты",
      "finishedAt": "2026-09-15T04:33:12+05:00"
    },
    {
      "id": "04",
      "title": "Верх страницы: навигация, hero, about, меню",
      "requirements": [
        "R01",
        "R08",
        "R09",
        "R11",
        "R15",
        "R16",
        "R18",
        "R23",
        "R24",
        "R26",
        "R37",
        "R38",
        "R39",
        "R40",
        "R42",
        "R43",
        "R44",
        "R45",
        "R46",
        "R59",
        "R60",
        "R04",
        "R14",
        "R29",
        "R73"
      ],
      "blockedBy": [
        "02",
        "03"
      ],
      "wave": 3,
      "zone": [
        "src/_includes/sections/nav.njk",
        "src/_includes/sections/hero.njk",
        "src/_includes/sections/about.njk",
        "src/_includes/sections/menu.njk"
      ],
      "status": "review",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-15T04:33:12+05:00"
    },
    {
      "id": "05",
      "title": "Низ страницы: галерея, преимущества, карта, Instagram, подвал",
      "requirements": [
        "R10",
        "R12",
        "R47",
        "R48",
        "R49",
        "R50",
        "R51",
        "R52",
        "R53",
        "R54",
        "R55",
        "R06",
        "R76i"
      ],
      "blockedBy": [
        "02",
        "03"
      ],
      "wave": 3,
      "zone": [
        "src/_includes/sections/gallery.njk",
        "src/_includes/sections/experience.njk",
        "src/_includes/sections/visit.njk",
        "src/_includes/sections/instagram.njk",
        "src/_includes/sections/footer.njk"
      ],
      "status": "repair",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-15T04:33:12+05:00"
    },
    {
      "id": "06",
      "title": "Поведение страницы: один файл, семь обязанностей",
      "requirements": [
        "R22",
        "R41",
        "R48",
        "R56",
        "R57",
        "R58",
        "R59",
        "R60",
        "R61",
        "R62",
        "R69"
      ],
      "blockedBy": [
        "04",
        "05"
      ],
      "wave": 4,
      "zone": [
        "src/js/"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-15T04:49:39+05:00",
      "finishedAt": "2026-09-15T13:07:50+05:00",
      "commit": "be423be",
      "note": "восемь функций, 12233 байта, читаемый код после дозапроса"
    },
    {
      "id": "07",
      "title": "SEO, иконки, производительность и проверка сборки",
      "requirements": [
        "R02",
        "R18",
        "R27",
        "R36",
        "R62",
        "R63",
        "R64",
        "R65",
        "R66",
        "R67",
        "R68",
        "R69",
        "R71",
        "R72",
        "R74i",
        "R77i",
        "R79i",
        "G01"
      ],
      "blockedBy": [
        "06"
      ],
      "wave": 5,
      "zone": [
        "src/_includes/layouts/base.njk",
        "src/assets/static/icons/",
        "test/"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    }
  ],
  "singlePass": null,
  "tests": null,
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": {
    "findings": 13,
    "missing": 7,
    "half": 6,
    "extra": 17,
    "action": "7 пропущенных и 6 полупокрытых закрыты в spec.md (Фиксированное содержимое, Решения §12, токены палитры, уровень исполнения); 17 «сверх брифа» — 2 помечены A01/A02, остальные перепривязаны к родительским требованиям или оставлены как ремесленные решения"
  },
  "concerns": [
    "src/assets/static/fonts — три файла Manrope побайтово идентичны, браузер тянет 24 КБ трижды (→ таск 07)",
    "src/_includes/layouts/base.njk:14 — preload греет вес 400, первый экран рисуется весом 700 (→ таск 07)",
    "src/en/index.njk и src/ar/index.njk совпадают побайтово — порядок секций задан дважды",
    "src/css/main.css:240 — .h-display и .eyebrow дублируют литералами значения из токенов --text-*",
    "src/_includes/sections/{nav,footer}.njk — заглушки без лендмарков <nav>/<footer> (→ таски 04, 05)",
    ".eleventy.js:13 — resolveImageSource принимает три формы пути при одной задокументированной",
    "src/css/main.css:216 — глобальный transition-duration !important под reduced-motion шире решения спецификации (→ таск 06)",
    "src/_data/content.{en,ar}.json — 61 непереводимое значение записано дважды; паритет стережёт ключи, но не значения",
    "imageNote и quoteSourceNote — служебные строки внутри словаря, который владеет видимыми текстами; если их станет много, выносить отдельно",
    "src/js/app.js — объявления через var при arrow-функциях рядом; бриф просил ES6 (R70), стиль смешанный",
    "app.js занял 12233 из 12288 байт — исполнитель целится в потолок, а не пишет свободно"
  ],
  "reviewers": {
    "manifestSpec": "a3594414ddf8b0ec6",
    "craft": "aa7276fd765675a63"
  },
  "blind": null
}
