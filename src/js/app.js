// Savva Cafe behaviour. Contract: data-* attributes only, eight independent parts below.
(function () {
  "use strict";

  var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isArabic = document.documentElement.lang === "ar";
  var FOCUSABLE = "a[href], button:not([disabled])";
  var PASSIVE = { passive: true };

  function queryAll(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  // Shared focus trap for the nav panel and the lightbox.
  function trapFocus(e, root) {
    if (e.key !== "Tab") return;
    var focusable = queryAll(FOCUSABLE, root);
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // reveal — fades/lifts into view on scroll. Reads [data-reveal], [data-reveal-delay].
  function reveal() {
    var items = queryAll("[data-reveal]");
    if (!items.length || reducedMotion || !window.IntersectionObserver) return;
    var observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: 0.15 });
    items.forEach(el => {
      el.classList.add("is-reveal");
      var delay = el.dataset.revealDelay;
      if (delay) el.style.transitionDelay = delay + "ms";
      observer.observe(el);
    });
  }

  // nav — header. Reads [data-nav], [data-nav-link], [data-nav-toggle] + #nav-panel.
  function nav() {
    var navEl = document.querySelector("[data-nav]");
    if (!navEl) return;

    if (window.IntersectionObserver) {
      var sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText = "position:absolute;top:40px;inset-inline-start:0;width:1px;height:1px;pointer-events:none";
      document.body.prepend(sentinel);
      new IntersectionObserver(entries =>
        entries[0].isIntersecting ? delete navEl.dataset.navScrolled : navEl.dataset.navScrolled = ""
      ).observe(sentinel);

      var navLinks = queryAll("[data-nav-link]");
      var sections = navLinks.map(link => document.getElementById(link.dataset.navLink)).filter(Boolean);
      if (sections.length) {
        var spy = new IntersectionObserver(entries => entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => link.setAttribute("aria-current", link.dataset.navLink === entry.target.id ? "true" : "false"));
        }), { rootMargin: "-40% 0px -55% 0px" });
        sections.forEach(section => spy.observe(section));
      }
    }

    var toggle = document.querySelector("[data-nav-toggle]"), panel = document.getElementById("nav-panel");
    if (!toggle || !panel) return;
    var lastFocus = null;

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
        var focusable = queryAll(FOCUSABLE, panel);
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
    var layers = queryAll("[data-parallax]");
    if (!layers.length || reducedMotion) return;
    var ticking = false;
    function paint() {
      var offset = scrollY * 0.12;
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
    var triggers = queryAll("[data-lightbox]");
    if (!triggers.length) return;

    var labels = isArabic
      ? { close: "إغلاق العارض", prev: "الصورة السابقة", next: "الصورة التالية" }
      : { close: "Close viewer", prev: "Previous photo", next: "Next photo" };
    var dialog, image, caption, group = [], index = 0, opener = null;

    function makeButton(className, glyph, label, onClick) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = className; btn.textContent = glyph;
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
      var best = null;
      (img.getAttribute("srcset") || "").split(",").forEach(function (part) {
        var pair = part.trim().split(/\s+/);
        var width = pair.length === 2 ? parseInt(pair[1], 10) : NaN;
        if (!isNaN(width) && (!best || width > best.width)) best = { url: pair[0], width: width };
      });
      return best ? best.url : img.currentSrc || img.src;
    }
    function paint() {
      var img = group[index].querySelector("img");
      if (!img) return;
      image.src = widest(img);
      caption.textContent = img.alt || "";
    }
    function build() {
      dialog = document.createElement("dialog");
      dialog.className = "lightbox"; dialog.setAttribute("aria-modal", "true");
      var figure = document.createElement("figure"); figure.className = "lightbox__figure";
      image = document.createElement("img"); image.className = "lightbox__image"; image.alt = "";
      caption = document.createElement("figcaption"); caption.className = "lightbox__caption"; caption.id = "lightbox-caption";
      figure.append(image, caption); dialog.setAttribute("aria-labelledby", caption.id);

      var prevGlyph = isArabic ? "›" : "‹", nextGlyph = isArabic ? "‹" : "›";
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
      dialog.addEventListener("close", () => opener && opener.focus());
      var startX = null;
      dialog.addEventListener("touchstart", e => startX = e.changedTouches[0].clientX, PASSIVE);
      dialog.addEventListener("touchend", e => {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
        startX = null;
      }, PASSIVE);

      document.body.appendChild(dialog);
    }

    triggers.forEach(tile => {
      tile.addEventListener("click", () => {
        if (!dialog) build();
        var groupName = tile.dataset.lightboxGroup || "";
        group = queryAll('[data-lightbox][data-lightbox-group="' + groupName + '"]');
        index = group.indexOf(tile); opener = tile;
        paint();
        dialog.showModal();
      });
    });
  }

  // toTop — scrolls to top, appears past the first screen. No [data-to-top]
  // host exists (04/05 never added one); unlike the other seven, this
  // builds its own button. By design — don't look for that hook in templates.
  function toTop() {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "to-top"; btn.hidden = true;
    btn.setAttribute("aria-label", isArabic ? "العودة إلى الأعلى" : "Back to top"); btn.innerHTML = "↑";
    btn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" })); document.body.appendChild(btn);

    var threshold = innerHeight, paint = () => btn.hidden = scrollY < threshold;
    addEventListener("scroll", paint, PASSIVE);
    paint();
  }

  // map — lazy <iframe> on click. Reads [data-map], -src, -title, -open, -preview.
  function map() {
    queryAll("[data-map]").forEach(box => {
      var openBtn = box.querySelector("[data-map-open]"), src = box.dataset.mapSrc;
      if (!openBtn || !src) return;
      openBtn.addEventListener("click", () => {
        var frame = document.createElement("iframe");
        frame.src = src; frame.title = box.dataset.mapTitle || ""; frame.loading = "lazy"; frame.className = "map-frame";
        var preview = box.querySelector("[data-map-preview]");
        if (preview) preview.remove();
        box.appendChild(frame);
      }, { once: true });
    });
  }

  // hours — "open now"/"opens at" in Asia/Riyadh time. Reads [data-day], -opens, -closes; writes [data-hours-*].
  function hours() {
    var target = document.querySelector("[data-hours]"), rows = queryAll("[data-day]");
    if (!target || !rows.length) return;

    var dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], byDay = {};
    rows.forEach(row => { byDay[row.dataset.day] = { opens: row.dataset.opens, closes: row.dataset.closes }; });
    function toMinutes(hhmm) {
      var parts = hhmm.split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    var riyadhNow = new Date(Date.now() + 3 * 3600000);
    var dayIndex = riyadhNow.getUTCDay(), nowMinutes = riyadhNow.getUTCHours() * 60 + riyadhNow.getUTCMinutes();
    var today = byDay[dayKeys[dayIndex]], yesterday = byDay[dayKeys[(dayIndex + 6) % 7]];
    if (!today) return;

    var openUntil = null, opens = toMinutes(today.opens), closes = toMinutes(today.closes);
    if (closes > opens) {
      if (nowMinutes >= opens && nowMinutes < closes) openUntil = today.closes;
    } else if (nowMinutes >= opens) {
      openUntil = today.closes; // wraps past midnight
    }
    if (!openUntil && yesterday) {
      var prevOpens = toMinutes(yesterday.opens), prevCloses = toMinutes(yesterday.closes);
      if (prevCloses <= prevOpens && nowMinutes < prevCloses) openUntil = yesterday.closes; // overnight from yesterday
    }

    if (openUntil) {
      var closesText = (target.dataset.hoursClosesAt || "").replace("{time}", openUntil);
      target.textContent = target.dataset.hoursOpen + " · " + closesText;
    } else {
      var opensText = (target.dataset.hoursOpensAt || "").replace("{time}", today.opens);
      target.textContent = target.dataset.hoursClosed + " · " + opensText;
    }
  }

  // copy — copies address, swaps label to confirmation for 2s. Reads [data-copy], -done, -label; no Clipboard API, exits quietly.
  function copy() {
    var buttons = queryAll("[data-copy]");
    if (!buttons.length || !navigator.clipboard) return;
    buttons.forEach(button => {
      var label = button.querySelector("[data-copy-label]");
      if (!label) return;
      var original = label.textContent;
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
