"use client";

import { useEffect } from "react";

/**
 * The one shared rAF loop for the whole page. Faithful port of
 * design_handoff_horizon_portfolio/design/motion-reference.js — see
 * prompts/02-motion-engine-fixes.md for the rail-breakpoint deviation
 * (699px, this project's real CSS breakpoint, instead of the reference's
 * literal 880) and prompts/03-mobile-fixes.md for two further additive
 * deviations: (1) a screen's stage variant ("rail" vs "fan"), not
 * hasAttribute("data-rot"), decides whether it gets rotation, since every
 * screen always authors data-rot for desktop; (2) fan screens may carry an
 * optional data-rot-mobile that baseT() prefers over data-rot once the
 * mobile layout is active, and section-level entrance (data-sect) is armed
 * only on mobile, re-evaluated on resize. Drift/settle/glow/timeline math
 * is untouched. Queries the DOM by data attribute rather than refs so every
 * section component stays a plain server component.
 */
const RAIL_BREAKPOINT = 699;

export default function HorizonMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = reduce;
    const isMobileRail = () => window.innerWidth <= RAIL_BREAKPOINT;

    const glows = Array.from(document.querySelectorAll<HTMLElement>("[data-glow]"));
    const stages = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    const screens = Array.from(document.querySelectorAll<HTMLElement>("[data-screen]"));
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-layer]"));
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-sect]"));

    glows.forEach((g) => {
      const weight = parseFloat(g.getAttribute("data-glow") || "1") || 1;
      const base = Math.max(0, Math.min(1, weight));
      g.dataset.base = String(base);
      g.style.opacity = String(base);
      g.style.willChange = "transform,opacity";
    });

    // which layout a screen belongs to — the only reliable discriminator,
    // since every screen (rail or fan) always carries data-rot for desktop.
    // Cached once here rather than walked with closest() every frame.
    const screenVariant = new Map<HTMLElement, string>();
    screens.forEach((el) => {
      const stage = el.closest<HTMLElement>("[data-stage]");
      screenVariant.set(el, stage?.getAttribute("data-variant") || "fan");
    });

    // resting transform of a screen. Rail (filmstrip) screens are flat at
    // any width once the rail layout is active — no rotation, no
    // translateX. The fan (hero) keeps translateX(-50%) + rotation, and on
    // mobile prefers its own data-rot-mobile angle over the desktop one.
    const baseT = (el: HTMLElement) => {
      const absolute = getComputedStyle(el).position === "absolute";
      if (isMobileRail()) {
        if (screenVariant.get(el) === "rail") return "";
        const rot = el.getAttribute("data-rot-mobile") || el.getAttribute("data-rot");
        return (absolute ? "translateX(-50%) " : "") + (rot ? `rotate(${rot}deg)` : "");
      }
      const rot = el.getAttribute("data-rot");
      return (absolute ? "translateX(-50%) " : "") + (rot ? `rotate(${rot}deg)` : "");
    };

    // a rail (filmstrip) screen under the mobile layout takes no entrance and
    // no drift — the rail CSS already renders it settled. Beyond matching the
    // design, the fan entrance's translate3d(0,34px,0) would push the rail's
    // scrollHeight ~15px past its clientHeight, and since overflow-x:auto
    // forces overflow-y:auto, that slack latches a vertical swipe to the rail
    // and the page stops scrolling. See prompts/07-mobile-filmstrip-scroll-lock.md.
    const railStill = (el: HTMLElement) => isMobileRail() && screenVariant.get(el) === "rail";

    // per-screen drift character: outer, dimmer screens travel further and
    // slower than the anchor — one formula, no viewport branching.
    screens.forEach((el, i) => {
      const order = parseInt(el.getAttribute("data-order") || "0", 10);
      const depth = 1 + order * 0.42;
      el.dataset.ampY = (2.1 * depth).toFixed(2);
      el.dataset.ampR = (0.14 * depth).toFixed(3);
      el.dataset.per = (13 + order * 2.6 + (i % 3) * 1.7).toFixed(2);
      el.dataset.ph = ((i * 1.37) % 6.283).toFixed(3);
      const skipEntrance = still || railStill(el);
      el.dataset.settled = skipEntrance ? "1" : "0";
      if (!skipEntrance) {
        el.style.opacity = "0";
        el.style.transform = `${baseT(el)} translate3d(0,34px,0) scale(0.96)`;
        el.style.willChange = "transform,opacity";
      }
    });

    // fail-safe reveal: entrance states start at opacity 0, so anything that
    // starves observers or rAF (SSR, backgrounded tab, print) must still show
    // a complete page.
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
        s.dataset.entered = "1";
      });
    };

    let safety = 0;
    const observers: IntersectionObserver[] = [];
    let dirty = true;
    let onSectionsResize: (() => void) | null = null;

    if (!still) {
      // collage entrance ("settle"): pieces arriving into light, anchor
      // first, supporting screens following. Transition removed afterwards
      // so the drift loop can own the transform without fighting the easing.
      const settle = (el: HTMLElement) => {
        const order = parseInt(el.getAttribute("data-order") || "0", 10);
        setTimeout(() => {
          el.style.transition = "transform 840ms cubic-bezier(0.16,0.72,0.24,1), opacity 520ms ease-out";
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
            settle(e.target as HTMLElement);
          });
        },
        { rootMargin: "0px 0px -4% 0px", threshold: 0.02 }
      );
      // Anything already on screen at load settles immediately rather than waiting.
      screens.forEach((el) => {
        if (railStill(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) settle(el);
        else settleIO.observe(el);
      });
      observers.push(settleIO);

      // section entrance — mobile only. The reference design has no
      // section fade/slide-in on desktop; SECTION_BEHAVIOUR.md §11 scopes
      // "each section eases in as it enters view" to mobile specifically.
      if (sections.length) {
        const sectIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              sectIO.unobserve(e.target);
              const el = e.target as HTMLElement;
              el.style.transition = "opacity 640ms ease-out, transform 760ms cubic-bezier(0.16,0.72,0.24,1)";
              el.style.opacity = "1";
              el.style.transform = "none";
              el.dataset.entered = "1";
            });
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
        );
        observers.push(sectIO);

        const armSections = () => {
          sections.forEach((s) => {
            if (s.dataset.entered === "1") return;
            s.style.opacity = "0";
            s.style.transform = "translate3d(0,18px,0)";
            sectIO.observe(s);
          });
        };
        const revealAllSections = () => {
          sections.forEach((s) => {
            if (s.dataset.entered === "1") return;
            s.style.transition = "none";
            s.style.opacity = "1";
            s.style.transform = "none";
            s.dataset.entered = "1";
          });
          sectIO.disconnect();
        };

        let sectionsMobile = isMobileRail();
        if (sectionsMobile) armSections();
        onSectionsResize = () => {
          const nowMobile = isMobileRail();
          if (nowMobile === sectionsMobile) return;
          sectionsMobile = nowMobile;
          if (sectionsMobile) armSections();
          else revealAllSections();
        };
        window.addEventListener("resize", onSectionsResize, { passive: true });
      }
    }

    // Only an element that is currently in the viewport and still hidden
    // counts as "stuck" (observers/JS genuinely failed). Most of a long
    // scroll page is legitimately still off-screen and waiting for its
    // scroll-triggered entrance 1.2s after load — that is not a failure,
    // so it must not be swept up by this net.
    const inViewport = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    safety = window.setTimeout(() => {
      const stuck =
        screens.some((el) => inViewport(el) && getComputedStyle(el).opacity === "0") ||
        sections.some((s) => inViewport(s) && getComputedStyle(s).opacity === "0");
      if (stuck) reveal();
    }, 1200);

    const onVisibility = () => {
      if (document.visibilityState === "visible") dirty = true;
      else reveal();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeprint", reveal);

    // membership sets: which screens drift, which glows are live. Nothing
    // off-screen is ever touched.
    const drifting = new Set<HTMLElement>();
    const live = new Set<HTMLElement>();

    const stageIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const kids = Array.from(e.target.querySelectorAll<HTMLElement>("[data-screen]"));
          kids.forEach((k) => (e.isIntersecting ? drifting.add(k) : drifting.delete(k)));
        });
      },
      { rootMargin: "12% 0px 12% 0px", threshold: 0.01 }
    );
    stages.forEach((s) => stageIO.observe(s));
    observers.push(stageIO);

    const viewIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? live.add(e.target as HTMLElement) : live.delete(e.target as HTMLElement)));
      },
      { rootMargin: "25% 0px 25% 0px" }
    );
    glows.forEach((g) => viewIO.observe(g));
    observers.push(viewIO);

    // geometry cache: measured on init, load and resize only — never inside
    // the frame loop (no layout reads while animating).
    const geo = new Map<HTMLElement, { top: number; h: number }>();
    let stackGeo: { top: number; h: number } | null = null;

    const measure = () => {
      glows.forEach((g) => {
        const s = g.parentElement as HTMLElement;
        geo.set(g, { top: s.offsetTop, h: s.offsetHeight || 1 });
      });
      if (layers.length) {
        const host = (layers[0].closest("section") || layers[0].parentElement) as HTMLElement;
        stackGeo = { top: host.offsetTop, h: host.offsetHeight || 1 };
      }
      dirty = true;
    };
    measure();
    const onScroll = () => (dirty = true);
    window.addEventListener("load", measure);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // the single frame loop. Only transform and opacity are written.
    let raf = 0;

    const frame = (ts: number) => {
      const t = (ts || 0) / 1000;

      if (!still) {
        // glow: scroll-driven position + a slow independent breath
        live.forEach((g) => {
          const q = parseFloat(g.dataset.q || "0");
          const near = 1 - Math.abs(q);
          const weight = parseFloat(g.getAttribute("data-glow") || "1") || 1;
          const breath = Math.sin(t * 0.32 + weight * 2.1);
          g.style.transform = `translate3d(0,${(-q * 44 + breath * 5).toFixed(2)}px,0) scale(${(1 + near * 0.07 + breath * 0.012).toFixed(4)})`;
          g.style.opacity = (parseFloat(g.dataset.base || "1") * (0.7 + near * 0.3) * (0.955 + breath * 0.045)).toFixed(3);
        });

        // collage: continuous, per-depth drift. Never frozen.
        const rail = isMobileRail();
        drifting.forEach((el) => {
          if (el.dataset.settled !== "1") return;
          if (rail && screenVariant.get(el) === "rail") return;
          const w = 6.283 / parseFloat(el.dataset.per || "13");
          const ph = parseFloat(el.dataset.ph || "0");
          const y = parseFloat(el.dataset.ampY || "2") * Math.sin(t * w + ph);
          const r = parseFloat(el.dataset.ampR || "0.14") * Math.sin(t * w * 0.62 + ph * 1.3);
          const sc = 1 + 0.0035 * Math.sin(t * w * 0.48 + ph);
          el.style.transform = `${baseT(el)} translate3d(0,${y.toFixed(2)}px,0) rotate(${r.toFixed(3)}deg) scale(${sc.toFixed(4)})`;
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

        // front-end-to-system: the glow becomes functional, walking
        // attention down the five layers as the section scrolls by.
        if (layers.length && stackGeo) {
          const p = (mid + vh * 0.12 - stackGeo.top) / Math.max(1, stackGeo.h * 0.88);
          layers.forEach((l, i) => {
            const lp = still ? 1 : Math.min(1, Math.max(0, (p - i * 0.13) / 0.2));
            l.style.opacity = (0.4 + lp * 0.6).toFixed(3);
            const dot = l.querySelector<HTMLElement>("[data-dot]");
            if (dot) {
              const on = lp > 0.5;
              dot.style.background = on ? "#E0C495" : "#332C24";
              dot.style.boxShadow = on
                ? `0 0 0 4px rgba(226,200,156,0.12), 0 0 20px rgba(226,200,156,${(0.6 * lp).toFixed(2)})`
                : "none";
            }
          });
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeprint", reveal);
      window.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (onSectionsResize) window.removeEventListener("resize", onSectionsResize);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}
