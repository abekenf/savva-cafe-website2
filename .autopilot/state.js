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
  "updatedAt": "2026-09-14T18:36:13+05:00",
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
      "startedAt": "2026-09-14T18:35:09+05:00"
    },
    {
      "id": "review",
      "status": "pending"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 0,
    "done": 0,
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
      "status": "in-progress",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-14T18:36:13+05:00"
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
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
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
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
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
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
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
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
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
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
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
  "concerns": [],
  "reviewers": {
    "manifestSpec": null,
    "craft": null
  },
  "blind": null
}
