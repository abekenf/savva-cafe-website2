// Savva Cafe behaviour. Contract: data-* attributes only, eight independent parts below.
(function () {
  "use strict";

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isArabic = document.documentElement.lang === "ar";
  const FOCUSABLE = "a[href], button:not([disabled])";
  const PASSIVE = { passive: true };

  function queryAll(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  // Shared focus trap for the nav panel and the lightbox.
  function trapFocus(e, root) {
    if (e.key !== "Tab") return;
    const focusable = queryAll(FOCUSABLE, root);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // reveal — fades/lifts into view on scroll. Reads [data-reveal], [data-reveal-delay].
  function reveal() {
    const items = queryAll("[data-reveal]");
    if (!items.length || reducedMotion || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: 0.15 });
    items.forEach(el => {
      el.classList.add("is-reveal");
      const delay = el.dataset.revealDelay;
      if (delay) el.style.transitionDelay = delay + "ms";
      observer.observe(el);
    });
  }

  // nav — header. Reads [data-nav], [data-nav-link], [data-nav-toggle] + #nav-panel.
  function nav() {
    const navEl = document.querySelector("[data-nav]");
    if (!navEl) return;

    if (window.IntersectionObserver) {
      const sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText = "position:absolute;top:40px;inset-inline-start:0;width:1px;height:1px;pointer-events:none";
      document.body.prepend(sentinel);
      new IntersectionObserver(entries =>
        entries[0].isIntersecting ? delete navEl.dataset.navScrolled : navEl.dataset.navScrolled = ""
      ).observe(sentinel);

      const navLinks = queryAll("[data-nav-link]");
      const sections = navLinks.map(link => document.getElementById(link.dataset.navLink)).filter(Boolean);
      if (sections.length) {
        const spy = new IntersectionObserver(entries => entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => link.setAttribute("aria-current", link.dataset.navLink === entry.target.id ? "true" : "false"));
        }), { rootMargin: "-40% 0px -55% 0px" });
        sections.forEach(section => spy.observe(section));
      }
    }

    const toggle = document.querySelector("[data-nav-toggle]");
    const panel = document.getElementById("nav-panel");
    if (!toggle || !panel) return;
    let lastFocus = null;

    function onKeydown(e) {
      if (e.key === "Escape") { setOpen(false); return; }
      trapFocus(e, panel);
    }
    function setOpen(open) {
      panel.hidden = !open;
      if (open) navEl.dataset.navOpen = ""; else delete navEl.dataset.navOpen;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", toggle.dataset[open ? "labelClose" : "labelOpen"]);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        lastFocus = document.activeElement;
        const focusable = queryAll(FOCUSABLE, panel);
        if (focusable.length) focusable[0].focus();
        document.addEventListener("keydown", onKeydown);
      } else {
        document.removeEventListener("keydown", onKeydown);
        if (lastFocus) lastFocus.focus();
      }
    }
    toggle.addEventListener("click", () => setOpen(panel.hidden));
    panel.addEventListener("click", e => e.target.closest("a") && setOpen(false));
  }

  // parallax — hero drifts at 12% of scroll via `transform`. Reads [data-parallax].
  function parallax() {
    const layers = queryAll("[data-parallax]");
    if (!layers.length || reducedMotion) return;
    let ticking = false;
    function paint() {
      const offset = scrollY * 0.12;
      layers.forEach(el => el.style.transform = "translate3d(0, " + offset + "px, 0)");
      ticking = false;
    }
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    }, PASSIVE);
    paint();
  }

  // lightbox — <dialog> built on first click. Reads [data-lightbox], [data-lightbox-group]; glyphs flip for RTL.
  function lightbox() {
    const triggers = queryAll("[data-lightbox]");
    if (!triggers.length) return;

    const labels = isArabic
      ? { close: "إغلاق العارض", prev: "الصورة السابقة", next: "الصورة التالية" }
      : { close: "Close viewer", prev: "Previous photo", next: "Next photo" };
    let dialog;
    let image;
    let caption;
    let group = [];
    let index = 0;
    let opener = null;

    function makeButton(className, glyph, label, onClick) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = className;
      btn.textContent = glyph;
      btn.setAttribute("aria-label", label);
      btn.addEventListener("click", onClick);
      return btn;
    }
    function move(direction) {
      if (!group.length) return;
      index = (index + direction + group.length) % group.length;
      paint();
    }
    // The tile's own currentSrc was picked for a ~308px box; the dialog is up to
    // 1100px wide, so it takes the widest candidate the frame actually has.
    function widest(img) {
      let best = null;
      (img.getAttribute("srcset") || "").split(",").forEach(function (part) {
        const pair = part.trim().split(/\s+/);
        const width = pair.length === 2 ? parseInt(pair[1], 10) : NaN;
        if (!isNaN(width) && (!best || width > best.width)) best = { url: pair[0], width: width };
      });
      return best ? best.url : img.currentSrc || img.src;
    }
    function paint() {
      const img = group[index].querySelector("img");
      if (!img) return;
      image.src = widest(img);
      caption.textContent = img.alt || "";
    }
    function build() {
      dialog = document.createElement("dialog");
      dialog.className = "lightbox";
      dialog.setAttribute("aria-modal", "true");
      const figure = document.createElement("figure");
      figure.className = "lightbox__figure";
      image = document.createElement("img");
      image.className = "lightbox__image";
      image.alt = "";
      caption = document.createElement("figcaption");
      caption.className = "lightbox__caption";
      caption.id = "lightbox-caption";
      figure.append(image, caption);
      dialog.setAttribute("aria-labelledby", caption.id);

      const prevGlyph = isArabic ? "›" : "‹";
      const nextGlyph = isArabic ? "‹" : "›";
      dialog.append(
        makeButton("lightbox__close", "×", labels.close, () => dialog.close()),
        makeButton("lightbox__nav lightbox__nav--prev", prevGlyph, labels.prev, () => move(-1)),
        figure,
        makeButton("lightbox__nav lightbox__nav--next", nextGlyph, labels.next, () => move(1))
      );

      dialog.addEventListener("click", e => e.target === dialog && dialog.close());
      dialog.addEventListener("keydown", e => {
        // Explicit: native <dialog> Escape-close was unreliable in testing.
        if (e.key === "Escape") { e.preventDefault(); dialog.close(); }
        else if (e.key === "ArrowRight") move(1);
        else if (e.key === "ArrowLeft") move(-1);
        else trapFocus(e, dialog);
      });
      dialog.addEventListener("close", () => {
        document.body.style.overflow = "";
        if (opener) opener.focus();
      });
      let startX = null;
      dialog.addEventListener("touchstart", e => startX = e.changedTouches[0].clientX, PASSIVE);
      dialog.addEventListener("touchend", e => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
        startX = null;
      }, PASSIVE);

      document.body.appendChild(dialog);
    }

    triggers.forEach(tile => {
      tile.addEventListener("click", () => {
        if (!dialog) build();
        const groupName = tile.dataset.lightboxGroup || "";
        group = queryAll('[data-lightbox][data-lightbox-group="' + groupName + '"]');
        index = group.indexOf(tile);
        opener = tile;
        paint();
        dialog.showModal();
        // showModal() alone leaves the page behind the backdrop scrollable,
        // so a wheel over the photo moves the page instead of nothing.
        document.body.style.overflow = "hidden";
      });
    });

  }

  // toTop — scrolls to top, appears past the first screen. Builds and owns its
  // own button and class; there is no [data-to-top] host in the markup and none
  // is expected — this is documented behaviour, not a missing hook. Unlike the
  // other seven parts, it is not wired through a data-* attribute at all.
  function toTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.hidden = true;
    btn.setAttribute("aria-label", isArabic ? "العودة إلى الأعلى" : "Back to top");
    btn.innerHTML = "↑";
    btn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(btn);

    const threshold = innerHeight;
    const paint = () => btn.hidden = scrollY < threshold;
    addEventListener("scroll", paint, PASSIVE);
    paint();
  }

  // map — lazy <iframe> on click. Reads [data-map], -src, -title, -open, -preview.
  function map() {
    queryAll("[data-map]").forEach(box => {
      const openBtn = box.querySelector("[data-map-open]");
      const src = box.dataset.mapSrc;
      if (!openBtn || !src) return;
      openBtn.addEventListener("click", () => {
        const frame = document.createElement("iframe");
        frame.src = src;
        frame.title = box.dataset.mapTitle || "";
        frame.loading = "lazy";
        frame.className = "map-frame";
        const preview = box.querySelector("[data-map-preview]");
        if (preview) preview.remove();
        box.appendChild(frame);
      }, { once: true });
    });
  }

  // hours — "open now"/"opens at" in Asia/Riyadh time. Reads [data-day], -opens, -closes; writes [data-hours-*].
  function hours() {
    const target = document.querySelector("[data-hours]");
    const rows = queryAll("[data-day]");
    if (!target || !rows.length) return;

    const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const byDay = {};
    rows.forEach(row => { byDay[row.dataset.day] = { opens: row.dataset.opens, closes: row.dataset.closes }; });
    function toMinutes(hhmm) {
      const parts = hhmm.split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    const riyadhNow = new Date(Date.now() + 3 * 3600000);
    const dayIndex = riyadhNow.getUTCDay();
    const nowMinutes = riyadhNow.getUTCHours() * 60 + riyadhNow.getUTCMinutes();
    const today = byDay[dayKeys[dayIndex]];
    const yesterday = byDay[dayKeys[(dayIndex + 6) % 7]];
    if (!today) return;

    let openUntil = null;
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);
    if (closes > opens) {
      if (nowMinutes >= opens && nowMinutes < closes) openUntil = today.closes;
    } else if (nowMinutes >= opens) {
      openUntil = today.closes; // wraps past midnight
    }
    if (!openUntil && yesterday) {
      const prevOpens = toMinutes(yesterday.opens);
      const prevCloses = toMinutes(yesterday.closes);
      if (prevCloses <= prevOpens && nowMinutes < prevCloses) openUntil = yesterday.closes; // overnight from yesterday
    }

    if (openUntil) {
      const closesText = (target.dataset.hoursClosesAt || "").replace("{time}", openUntil);
      target.textContent = target.dataset.hoursOpen + " · " + closesText;
    } else {
      const opensText = (target.dataset.hoursOpensAt || "").replace("{time}", today.opens);
      target.textContent = target.dataset.hoursClosed + " · " + opensText;
    }
  }

  // copy — copies address, swaps label to confirmation for 2s. Reads [data-copy], -done, -label; no Clipboard API, exits quietly.
  function copy() {
    const buttons = queryAll("[data-copy]");
    if (!buttons.length || !navigator.clipboard) return;
    buttons.forEach(button => {
      const label = button.querySelector("[data-copy-label]");
      if (!label) return;
      const original = label.textContent;
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(button.dataset.copy).then(() => {
          label.textContent = button.dataset.copyDone;
          setTimeout(() => label.textContent = original, 2000);
        }, () => {}); // rejected (permission denied, etc.): leave the label as is
      });
    });
  }

  function init() {
    reveal(); nav(); parallax(); lightbox(); toTop(); map(); hours(); copy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
