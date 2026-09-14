# Mobile filmstrip gutter, drift, and scroll-stuck fixes

## Goal
Fix three mobile-only bugs the user hit testing the live site on their phone:
1. Fitnex and Cartify sections' text and filmstrip hug the screen edges (no side gutter), unlike the ISDS sections which correctly have one.
2. Filmstrip (rail) screens visibly bob up and down while scrolling — user wants them to only move sideways (native horizontal scroll), no vertical wobble.
3. Vertical page scroll got stuck somewhere around/before the ISDS filmstrip section.

## What I read
- `design_handoff_horizon_portfolio/design/Horizon - Mobile.dc.html` — full `<style>`/body attributes and the Fitnex/Cartify/ISDS section markup (lines 42, 76, 107, 141, 177, 219) and the `data-rail` stage divs (`padding:22px 20px 6px`, or `20px 20px 6px` for Cartify). Confirmed `overscroll-behavior-y: contain` is set on `body` (line 18) in the reference and currently missing from `app/globals.css`.
- The reference mobile JS (lines 475–592) — confirmed the reference applies the *same* full drift (Y + rotation + scale) to every drifting screen with no rail/fan distinction; there is no spec basis for "sideways-only," so this fix is a deliberate deviation the user is explicitly asking for now, not a bug against the handoff.
- Current app code: `components/Collage.tsx`, `components/Collage.module.css`, `components/HorizonMotion.tsx`, `components/sections/{ProductSection,Fitnex,Cartify}.tsx` and their `.module.css`, `app/globals.css`.
- Confirmed `ProductSection.module.css`'s mobile `.section` padding is `34px 20px 30px` (has the 20px gutter), while `Fitnex.module.css` and `Cartify.module.css` mobile `.section` padding is `44px 0 34px` / `34px 0 30px` — zero horizontal padding. This is the direct cause of bug 1; `ProductSection` already does it correctly, so this brings the other two in line with that existing, working pattern rather than inventing a new one.
- Confirmed `HorizonMotion.tsx`'s per-frame drift loop has a rail-specific branch that already limits rail screens to vertical-only translation (no rotation/scale) — a prior, intentional deviation from the reference (see `prompts/02-motion-engine-fixes.md`). This pass goes one step further, per the user's live-device feedback: no drift transform at all for rail screens.
- Prior prompts (`prompts/03-mobile-fixes.md`, `04-mobile-rail-filmstrip-styling.md`) confirm `align-items:flex-end` and the taper in per-screen widths are intentional/spec-accurate, so bug 2 is specifically about the *animated* vertical bob, not the static bottom-aligned taper.

## Root causes
1. **Gutter**: `Fitnex.module.css` / `Cartify.module.css` mobile `.section` padding has `0` for the horizontal value where `ProductSection.module.css` has `20px`. Nothing else in the layout supplies a gutter for these two sections, so their heading, description, CTA buttons, and filmstrip all sit flush against the viewport edge.
2. **Wobble**: `HorizonMotion.tsx`'s frame loop still writes a `translate3d(0, y, 0)` transform every frame for rail-variant screens (just with reduced amplitude and no rotation), which reads as up/down jitter while the user scrolls the filmstrip horizontally.
3. **Stuck scroll**: two deviations from the reference, both plausible contributors on real mobile browsers: (a) `overscroll-behavior-y: contain` from the reference's `body` rule is missing from `app/globals.css`, so scroll can chain unexpectedly at section boundaries; (b) the rail stages (`overflow-x:auto` + `scroll-snap-type:x proximity`) have no explicit `touch-action`, so an ambiguous (slightly diagonal) touch-start over a filmstrip can be captured by the horizontal scroller and stall the vertical page scroll — a known WebKit/Chrome mobile behavior with nested scroll containers.

## Fixes
### A. Gutter (`components/sections/Fitnex.module.css`, `components/sections/Cartify.module.css`)
- In each file's `@media (max-width: 699px) { .section { padding: ... } }` rule, change the horizontal value from `0` to `20px` — i.e. `44px 0 34px` → `44px 20px 34px` (Fitnex), `34px 0 30px` → `34px 20px 30px` (Cartify). Mirrors `ProductSection.module.css`'s existing, correct mobile padding exactly.
- No change to `Collage.module.css`'s rail padding (stays horizontal `0`) — the gutter now comes from the section, same as it already does for the ISDS sections, so the filmstrip isn't double-padded.

### B. Kill rail vertical drift (`components/HorizonMotion.tsx`)
- In the per-frame `drifting.forEach` loop, the branch `if (rail && screenVariant.get(el) === "rail") { ...; return; }` currently sets a Y-translate transform. Change it to just `return;` — no transform write at all, so a settled rail screen keeps whatever `baseT(el)` set at settle-time (static) and only moves via the browser's native horizontal scroll.
- No other change to the drift math for fan-variant (hero) screens or to settle/entrance timing.

### C. Scroll-stuck (`app/globals.css`, `components/Collage.module.css`)
- Add `overscroll-behavior-y: contain;` to the existing `body` rule in `app/globals.css`, matching the reference verbatim.
- In `Collage.module.css`, add `touch-action: pan-x;` to `.stage[data-variant="rail"]` inside the `@media (max-width: 699px)` block, so the browser treats the filmstrip as horizontal-only for gesture routing and doesn't ambiguously capture a vertical swipe that starts over it.

## Files I expect to touch
- `components/sections/Fitnex.module.css`
- `components/sections/Cartify.module.css`
- `components/HorizonMotion.tsx`
- `app/globals.css`
- `components/Collage.module.css`

## Requirements carried over from AGENTS.md
- Animate only `transform`/`opacity` — fix B *removes* an animated write, adds nothing new. Fix C's `touch-action` is a static gesture hint, not an animated property.
- Single shared `rAF` loop stays the only place any transform is written; no new loops or listeners.
- No change to glow math, entrance/settle timing, reduced-motion handling, or any desktop (≥700px) styling — every change here is inside a `max-width:699px` block or is drift-loop logic already gated by `isMobileRail()`.
- Placeholder flags untouched.

## Acceptance criteria
- At ≤699px, Fitnex and Cartify's heading, description, CTA(s), and filmstrip all sit with a 20px gutter from the viewport edge, matching the ISDS sections' existing gutter.
- At ≤699px, filmstrip screens (all six sections that use the rail variant) stay visually still vertically while the user scrolls the filmstrip horizontally — no bob/jitter — while still settling in with their entrance animation on first appearance.
- Scrolling the full page top to bottom on a real mobile device (or Chrome DevTools mobile emulation with touch enabled) no longer catches/stalls around the ISDS filmstrip or anywhere else.
- Desktop (≥700px) fan collages, drift, and layout are pixel-unchanged.
- `tsc`, `eslint`, and `next build` all pass clean.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Manual, Chrome DevTools device mode at ~390×844 with touch simulation on:
  1. Scroll Fitnex and Cartify, confirm text and filmstrip both have a visible side gutter matching ISDS sections.
  2. Watch a filmstrip for ~10s while it's in view — confirm no vertical movement; confirm it still settles in (fades/slides up) the first time it enters view.
  3. Scroll the full page start to finish using simulated touch drag, paying attention to the ISDS filmstrip area, confirming no stall.
  4. Toggle `prefers-reduced-motion: reduce` — confirm filmstrips render fully settled and static immediately (unaffected by this change).
  5. Resize to ≥1000px — confirm hero and product fan collages, drift, and spacing are unchanged from before.
- Real-device pass on your phone (Safari/Chrome) if possible, since the scroll-stuck bug is the kind of thing simulators don't always reproduce.

## Test steps for you
1. `npm run dev`, open on your phone (or Chrome DevTools mobile emulation with touch).
2. Scroll to Fitnex and Cartify — confirm the cards and text no longer touch the screen edges.
3. Watch any filmstrip scroll — confirm cards move only left/right when you swipe, never bob vertically on their own.
4. Scroll the whole page start to finish, several times, paying attention to the point right before/around ISDS — confirm it never catches or stalls.
5. Toggle reduced motion in your OS accessibility settings and reload — confirm everything still renders fully, statically.
