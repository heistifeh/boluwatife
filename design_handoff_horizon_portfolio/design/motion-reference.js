/**
 * Horizon — motion reference
 *
 * Framework-free, dependency-free implementation of every animated behaviour in the
 * Horizon portfolio design. PORT THIS FILE rather than re-deriving the motion from the
 * README prose: the numbers here are the ones the design was tuned with.
 *
 * Contract with the markup (identical on desktop and mobile):
 *
 *   [data-ambient]            the fixed, site-wide gold gradient layer (CSS-animated; see
 *                             the @keyframes at the bottom of this file). This script only
 *                             disables it for reduced motion.
 *   [data-glow="<weight>"]    a section's glow wrapper. weight 0.36–1.30 (see WEIGHTS note).
 *                             Must be a direct child of the section it lights.
 *   [data-stage]              a collage container (position:relative on desktop, a flex
 *                             snap-rail on mobile).
 *   [data-screen]             one framed phone screenshot inside a stage.
 *     data-order="0..n"       0 = the anchor screen; higher = further out, dimmer, slower.
 *     data-rot="<deg>"        its resting rotation (desktop fan only; omit on mobile rails).
 *   [data-sect]               a section that should ease in as it enters view (mobile).
 *   [data-layer] / [data-dot] the front-end-to-system timeline rows and their dots.
 *
 * Usage:  Horizon.init({ glowIntensity: 1, still: false });
 *         // returns a teardown function — call it on unmount / route change.
 */

(function (global) {
  "use strict";

  const EASE_SETTLE = "cubic-bezier(0.16,0.72,0.24,1)";

  function init(options) {
    const opts = options || {};
    const glowIntensity = typeof opts.glowIntensity === "number" ? opts.glowIntensity : 1;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = !!opts.still || reduce;
    const hasIO = "IntersectionObserver" in window;
    const canAnimate = !still && hasIO;
    const isMobileRail = () => window.innerWidth < 880;

    const glows = Array.from(document.querySelectorAll("[data-glow]"));
    const stages = Array.from(document.querySelectorAll("[data-stage]"));
    const screens = Array.from(document.querySelectorAll("[data-screen]"));
    const layers = Array.from(document.querySelectorAll("[data-layer]"));
    const sections = Array.from(document.querySelectorAll("[data-sect]"));

    /* ------------------------------------------------------------------ *
     * 0. reduced motion: hold the ambient sheets still, render everything
     *    at rest. The static composition must still look finished.
     * ------------------------------------------------------------------ */
    if (still) {
      document
        .querySelectorAll("[data-ambient] > *")
        .forEach((el) => (el.style.animation = "none"));
    }

    /* ------------------------------------------------------------------ *
     * 1. glow base opacity — the honest hierarchy of the page.
     *    Fitnex 1.30 > hero 1.15 > ISDS Customer 0.85 > Vendors/Driver 0.80
     *    > contact 0.70 > B2B 0.62 > ISDS intro 0.50 > track record 0.42
     *    > Cartify 0.40 > front-end-to-system 0.36
     * ------------------------------------------------------------------ */
    glows.forEach((g) => {
      const weight = parseFloat(g.getAttribute("data-glow")) || 1;
      const base = Math.max(0, Math.min(1, weight * glowIntensity));
      g.dataset.base = String(base);
      g.style.opacity = String(base);
      g.style.willChange = "transform,opacity";
    });

    /* ------------------------------------------------------------------ *
     * 2. resting transform of a screen.
     *    Desktop fan: translateX(-50%) + its authored rotation.
     *    Mobile rail: no transform at all (the flex rail owns position).
     * ------------------------------------------------------------------ */
    const baseT = (el) => {
      if (isMobileRail() && !el.hasAttribute("data-rot")) return "";
      const absolute = getComputedStyle(el).position === "absolute";
      const rot = el.getAttribute("data-rot");
      return (absolute ? "translateX(-50%) " : "") + (rot ? "rotate(" + rot + "deg)" : "");
    };

    /* ------------------------------------------------------------------ *
     * 3. per-screen drift character. Outer, dimmer screens travel further
     *    and slower than the anchor — that difference IS the parallax.
     * ------------------------------------------------------------------ */
    screens.forEach((el, i) => {
      const order = parseInt(el.getAttribute("data-order") || "0", 10);
      const depth = 1 + order * 0.42;
      el.dataset.ampY = (2.1 * depth).toFixed(2);          // px of vertical travel
      el.dataset.ampR = (0.14 * depth).toFixed(3);         // deg of sway
      el.dataset.per = (13 + order * 2.6 + (i % 3) * 1.7).toFixed(2); // seconds per cycle
      el.dataset.ph = ((i * 1.37) % 6.283).toFixed(3);     // phase, so nothing moves in lockstep
      el.dataset.settled = canAnimate ? "0" : "1";
      if (canAnimate) {
        el.style.opacity = "0";
        el.style.transform = baseT(el) + " translate3d(0,34px,0) scale(0.96)";
        el.style.willChange = "transform,opacity";
      }
    });

    /* ------------------------------------------------------------------ *
     * 4. fail-safe reveal. Entrance states start at opacity 0, so anything
     *    that starves observers or rAF (SSR, backgrounded tab, screenshot
     *    service, print) must still show a complete page.
     * ------------------------------------------------------------------ */
    const reveal = () => {
      screens.forEach((el) => {
        el.style.transition = "none";
        el.style.opacity = "1";
        el.style.transform = baseT(el);
        el.dataset.settled = "1";
      });
      sections.forEach((s) => {
        s.style.transition = "none";
        s.style.opacity = "1";
        s.style.transform = "none";
      });
    };
    const safety = setTimeout(() => {
      const stuck =
        screens.some((el) => getComputedStyle(el).opacity === "0") ||
        sections.some((s) => getComputedStyle(s).opacity === "0");
      if (stuck) reveal();
    }, 1200);
    const onVisibility = () => {
      if (document.visibilityState === "visible") dirty = true;
      else reveal();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeprint", reveal);

    const observers = [];

    /* ------------------------------------------------------------------ *
     * 5. collage entrance ("settle"): pieces arriving into light, anchor
     *    first, supporting screens following. Weighted, never bouncy.
     *    The transition is removed afterwards so the drift loop can own
     *    the transform without fighting a 840ms easing curve.
     * ------------------------------------------------------------------ */
    if (canAnimate) {
      const settle = (el) => {
        const order = parseInt(el.getAttribute("data-order") || "0", 10);
        setTimeout(() => {
          el.style.transition =
            "transform 840ms " + EASE_SETTLE + ", opacity 520ms ease-out";
          el.style.transform = baseT(el);
          el.style.opacity = "1";
          setTimeout(() => {
            el.style.transition = "none";
            el.dataset.settled = "1";
          }, 880);
        }, 40 + order * 95);
      };

      const settleIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            settleIO.unobserve(e.target);
            settle(e.target);
          });
        },
        { rootMargin: "0px 0px -4% 0px", threshold: 0.02 }
      );
      // Anything already on screen at load settles immediately rather than waiting.
      screens.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) settle(el);
        else settleIO.observe(el);
      });
      observers.push(settleIO);

      /* section entrance — used on mobile so the continuous scroll never
         hard-cuts from one section to the next. */
      if (sections.length) {
        sections.forEach((s) => {
          s.style.opacity = "0";
          s.style.transform = "translate3d(0,18px,0)";
        });
        const sectIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              sectIO.unobserve(e.target);
              e.target.style.transition =
                "opacity 640ms ease-out, transform 760ms " + EASE_SETTLE;
              e.target.style.opacity = "1";
              e.target.style.transform = "none";
            });
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
        );
        sections.forEach((s) => sectIO.observe(s));
        observers.push(sectIO);
      }
    }

    /* ------------------------------------------------------------------ *
     * 6. membership sets: which screens drift, which glows are live.
     *    Nothing off-screen is ever touched.
     * ------------------------------------------------------------------ */
    const drifting = new Set();
    const live = new Set();

    if (hasIO) {
      const stageIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            Array.from(e.target.querySelectorAll("[data-screen]")).forEach((k) =>
              e.isIntersecting ? drifting.add(k) : drifting.delete(k)
            );
          });
        },
        { rootMargin: "12% 0px 12% 0px", threshold: 0.01 }
      );
      stages.forEach((s) => stageIO.observe(s));
      observers.push(stageIO);

      const viewIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) =>
            e.isIntersecting ? live.add(e.target) : live.delete(e.target)
          );
        },
        { rootMargin: "25% 0px 25% 0px" }
      );
      glows.forEach((g) => viewIO.observe(g));
      observers.push(viewIO);
    } else {
      glows.forEach((g) => live.add(g));
    }

    /* ------------------------------------------------------------------ *
     * 7. geometry cache. Measured on init, load and resize only — never
     *    inside the frame loop (no layout reads while animating).
     * ------------------------------------------------------------------ */
    const geo = new Map();
    let stackGeo = null;
    let dirty = true;

    const measure = () => {
      glows.forEach((g) => {
        const s = g.parentElement;
        geo.set(g, { top: s.offsetTop, h: s.offsetHeight || 1 });
      });
      if (layers.length) {
        const host = layers[0].closest("section") || layers[0].parentElement;
        stackGeo = { top: host.offsetTop, h: host.offsetHeight || 1 };
      }
      dirty = true;
    };
    measure();
    const onScroll = () => (dirty = true);
    window.addEventListener("load", measure);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ------------------------------------------------------------------ *
     * 8. the single frame loop. Only transform and opacity are written.
     *
     *    Every frame            glow breathing + collage drift (so the page
     *                           is alive even when the user isn't scrolling)
     *    Only when dirty        scroll-derived values: each glow's position
     *                           in its section, and the timeline sequence
     * ------------------------------------------------------------------ */
    let raf = 0;

    const frame = (ts) => {
      const t = (ts || 0) / 1000;

      if (!still) {
        // --- glow: scroll-driven position + a slow independent breath ---
        live.forEach((g) => {
          const q = parseFloat(g.dataset.q || "0");     // -1 above, 0 centred, +1 below
          const near = 1 - Math.abs(q);
          const weight = parseFloat(g.getAttribute("data-glow")) || 1;
          const breath = Math.sin(t * 0.32 + weight * 2.1);
          g.style.transform =
            "translate3d(0," + (-q * 44 + breath * 5).toFixed(2) + "px,0) scale(" +
            (1 + near * 0.07 + breath * 0.012).toFixed(4) + ")";
          g.style.opacity = (
            parseFloat(g.dataset.base) *
            (0.7 + near * 0.3) *
            (0.955 + breath * 0.045)
          ).toFixed(3);
        });

        // --- collage: continuous, per-depth drift. Never frozen. ---
        const rail = isMobileRail();
        drifting.forEach((el) => {
          if (el.dataset.settled !== "1") return;
          if (rail && !el.hasAttribute("data-rot")) {
            // On a mobile snap-rail, drift vertically only — horizontal
            // movement would fight the user's thumb scroll.
            const w0 = 6.283 / parseFloat(el.dataset.per);
            const ph0 = parseFloat(el.dataset.ph);
            el.style.transform =
              "translate3d(0," +
              (parseFloat(el.dataset.ampY) * 0.9 * Math.sin(t * w0 + ph0)).toFixed(2) +
              "px,0)";
            return;
          }
          const w = 6.283 / parseFloat(el.dataset.per);
          const ph = parseFloat(el.dataset.ph);
          const y = parseFloat(el.dataset.ampY) * Math.sin(t * w + ph);
          const r = parseFloat(el.dataset.ampR) * Math.sin(t * w * 0.62 + ph * 1.3);
          const sc = 1 + 0.0035 * Math.sin(t * w * 0.48 + ph);
          el.style.transform =
            baseT(el) +
            " translate3d(0," + y.toFixed(2) + "px,0)" +
            " rotate(" + r.toFixed(3) + "deg)" +
            " scale(" + sc.toFixed(4) + ")";
        });
      }

      if (dirty) {
        dirty = false;
        const vh = window.innerHeight;
        const mid = (window.scrollY || window.pageYOffset) + vh * 0.5;

        live.forEach((g) => {
          const gg = geo.get(g) || { top: 0, h: 1 };
          const q = Math.max(-1, Math.min(1, ((mid - gg.top) / gg.h - 0.5) * 2));
          g.dataset.q = q.toFixed(4);
        });

        // --- front end to system: the glow becomes functional, walking
        //     attention down the five layers as the section scrolls by. ---
        if (layers.length && stackGeo) {
          const p = (mid + vh * 0.12 - stackGeo.top) / Math.max(1, stackGeo.h * 0.88);
          layers.forEach((l, i) => {
            const lp = still ? 1 : Math.min(1, Math.max(0, (p - i * 0.13) / 0.2));
            l.style.opacity = (0.4 + lp * 0.6).toFixed(3);
            const dot = l.querySelector("[data-dot]");
            if (dot) {
              const on = lp > 0.5;
              dot.style.background = on ? "#E0C495" : "#332C24";
              dot.style.boxShadow = on
                ? "0 0 0 4px rgba(226,200,156,0.12), 0 0 20px rgba(226,200,156," +
                  (0.6 * lp).toFixed(2) + ")"
                : "none";
            }
          });
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /* ------------------------------------------------------------------ */
    return function teardown() {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeprint", reveal);
      window.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }

  const Horizon = { init: init };
  if (typeof module !== "undefined" && module.exports) module.exports = Horizon;
  else global.Horizon = Horizon;
})(typeof window !== "undefined" ? window : globalThis);

/* ====================================================================== *
 * CSS this file depends on — copy verbatim into your global stylesheet.
 * These two sheets are the ONLY blurred elements in the design and the
 * only thing that animates independently of scroll.
 * ======================================================================

@keyframes ambientA {
  0%   { transform: translate3d(-7%,-5%,0) scale(1.06); }
  50%  { transform: translate3d(7%,5%,0)   scale(1.20); }
  100% { transform: translate3d(-7%,-5%,0) scale(1.06); }
}
@keyframes ambientB {
  0%   { transform: translate3d(6%,4%,0)   scale(1.14); }
  50%  { transform: translate3d(-6%,-4%,0) scale(1.02); }
  100% { transform: translate3d(6%,4%,0)   scale(1.14); }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-ambient] > * { animation: none !important; }
}

<div data-ambient aria-hidden="true"
     style="position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;contain:strict">
  <div style="position:absolute;inset:-22%;
    background:linear-gradient(116deg, rgba(232,210,166,0) 16%, rgba(232,210,166,0.20) 33%,
                                       rgba(185,143,82,0.12) 46%, rgba(232,210,166,0) 62%);
    filter:blur(44px);mix-blend-mode:screen;
    animation:ambientA 42s ease-in-out infinite;will-change:transform"></div>
  <div style="position:absolute;inset:-28%;
    background:linear-gradient(94deg, rgba(185,143,82,0) 28%, rgba(185,143,82,0.15) 44%,
                                      rgba(232,210,166,0.10) 56%, rgba(185,143,82,0) 72%);
    filter:blur(64px);mix-blend-mode:screen;
    animation:ambientB 61s ease-in-out infinite;will-change:transform"></div>
</div>

Page content sits above it at z-index:1.
 * ====================================================================== */
