/**
 * Savva Cafe — all page behaviour lives here.
 * Contract with the markup is data-* attributes only, never styling classes.
 * Behaviours are added by later tickets; this file exposes one init().
 */
(function () {
  "use strict";

  function init() {
    // Behaviours are registered here by later tickets:
    // sticky header, reveal on scroll, lightbox, back to top,
    // mobile navigation, lazy map, "open now".
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
