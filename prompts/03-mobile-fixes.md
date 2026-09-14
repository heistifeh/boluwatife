# Motion-engine mobile fixes (scope: motion only)

Supersedes the layout/CSS portion of the original draft of this file. Per user direction after reviewing the draft, **this pass is motion-engine only**: the rail rotation bug, the hero per-breakpoint rotation contract, and gating section entrance to mobile. The layout/CSS bugs (rail screens at desktop size, ISDS Driver empty band, oversized/clipped hero fan, clipped jump-nav, right-aligned footer CTAs, headings clipped under sticky nav) are explicitly deferred to a separate follow-up pass so cause and effect stay distinguishable.

## What I read (see prior version of this file / conversation for full citations)

- `motion-reference.js` (root) and `components/HorizonMotion.tsx` — the current port.
- `design_handoff_horizon_portfolio/design/Horizon - Mobile.dc.html` script — confirms rail screens are always upright (no rotation authored on filmstrip markup) while the hero fan carries its own distinct mobile rotation values, separate from desktop.
- `components/Collage.tsx` / `Collage.module.css` — confirmed every screen (rail or fan) always renders `data-rot={s.rot}` (the desktop angle); the stage wrapper carries `data-variant="rail"` or `"fan"`, which is the only reliable signal for which layout a screen belongs to. `ScreenSpec.rot` is required, so `hasAttribute("data-rot")` can never be used to distinguish rail from fan.
- `components/sections/*.tsx` — verified via `grep` that all nine sections except `ProofBar` already carry `data-sect=""` (Hero, ProofBar-excluded, TrackRecord, IsdsConnective, ProductSection×4, Fitnex, Cartify, FrontEndToSystem, Recommendations, Contact = 9 with the attribute). So no DOM/JSX changes are needed for which sections carry `data-sect` — only `HorizonMotion.tsx`'s handling of it changes.

## Root causes

1. **Rail rotation bug.** `baseT()`'s existing `isMobileRail() && !el.hasAttribute("data-rot")` check never fires because every screen (rail included) always has `data-rot`. Result: once JS mounts, mobile filmstrip screens pick up their desktop tilt via inline `transform`, even though the rail is meant to be flat/upright. The same dead condition gates the drift loop's "vertical-only" branch, so it never runs either — filmstrip screens get full rotate+scale drift instead of vertical-only.
2. **No per-breakpoint hero rotation.** The hero fan needs a *different* resting angle on mobile than desktop (both non-zero), which the current single `data-rot` attribute can't express.
3. **Section entrance is not mobile-gated.** The reference design has no section fade/slide-in on desktop — SECTION_BEHAVIOUR.md's mobile section (§11) is the only place "each section eases in as it enters view" is specified. The current code applies the hidden-state + `IntersectionObserver` entrance to every `data-sect` element regardless of viewport width, so desktop sections briefly render at `opacity:0` on load.

## Fixes (in `components/HorizonMotion.tsx` only, plus a same-shape check in root `motion-reference.js` if the project wants it kept in sync — confirm before editing that file since AGENTS.md treats it as the porting *source*, not a maintained duplicate; if it's source-only, leave it untouched and note that in the report)

### A. Layout-aware `baseT()`

- Cache each screen's containing stage variant once at setup (`el.closest("[data-stage]")?.dataset.variant`), not on every frame.
- `baseT(el)`:
  - If `isMobileRail()` is true and the screen's stage variant is `"rail"`: return `""` — no `translateX(-50%)`, no `rotate()`. Filmstrip screens are flat at any width once the rail layout is active.
  - If `isMobileRail()` is true and the screen's stage variant is `"fan"` (hero): prefer `data-rot-mobile` if present, falling back to `data-rot`, for the rotation term. Keep the existing `translateX(-50%)` term when the element is `position:absolute`.
  - Otherwise (desktop): unchanged — `data-rot`, `translateX(-50%)` when absolute.

### B. Layout-aware vertical-only drift branch

- In the per-frame drift loop, replace `if (rail && !el.hasAttribute("data-rot"))` with `if (rail && screenVariant === "rail")` (using the same cached variant lookup as A). Everything inside that branch (amplitude, period, phase math) stays byte-identical to the current port — only the gating condition changes.

### C. `data-rot-mobile` contract

- `Collage.tsx`: render `data-rot-mobile={s.mobile?.rot}` alongside the existing `data-rot={s.rot}` (only meaningful for fan-variant screens; harmless no-op attribute on rail screens since baseT ignores rotation for rail regardless). No `data-variant`/`variantOf` inference, no reordering — purely an authored optional attribute, consistent with the sign-off.
- No change to `lib/content.ts` values — hero screens already carry `mobile.rot` per screen; this pass only wires the existing data through.

### D. Mobile-gated section entrance, resize-safe

- Keep the screen/collage `settle()` mechanism (opacity/transform entrance for individual screenshots) exactly as-is, at every width — that part of the reference is universal, not mobile-only.
- Move the *section-level* hide + `IntersectionObserver` entrance into a mode that is only armed while `isMobileRail()` is true:
  - Track each section's reveal state via `dataset.entered`.
  - `armSections()`: for every section not yet `entered`, set it to the hidden entrance state (`opacity:0`, `translate3d(0,18px,0)`) and `observe()` it with the existing `sectIO` (unchanged rootMargin/threshold/easing). Since `observe()` fires an initial callback for already-intersecting elements, anything already on screen when arming happens reveals itself immediately (briefly re-animating in, not stuck).
  - `revealAllSections()`: for every section not yet `entered`, force it to the settled state (`opacity:1`, `transform:none`), mark `entered`, and disconnect `sectIO`.
  - On mount: call `armSections()` only if `isMobileRail()` is true at mount time (inside the existing `if (!still)` guard — reduced motion keeps sections unhidden as today).
  - Add a `resize` listener (separate from the existing geometry-cache `resize` listener, or folded into it) that re-checks `isMobileRail()`; on a `false → true` transition call `armSections()`, on `true → false` call `revealAllSections()`. No-op if the mode didn't change, so this doesn't fire on every resize event, only on breakpoint crossings.
  - The existing fail-safe `reveal()` (1.2s safety timeout / `visibilitychange` / `beforeprint`) also marks `dataset.entered = "1"` on every section it touches, so it can't fight with the new resize logic afterward.

## Explicit non-goals for this pass

- No layout/CSS geometry changes (rail screen sizes, hero fan clipping, jump-nav, footer CTA alignment, scroll-margin-top). Tracked for the next prompt.
- No change to drift amplitude/period/phase/easing/stagger constants, or to the glow-breathing / front-end-to-system scroll math.
- No change to the `699px` `RAIL_BREAKPOINT` constant (confirmed correct — matches `Collage.module.css`'s own breakpoint).

## Acceptance criteria

- At ≥1440px: no section fades or slides in on scroll or on load; everything is visible from first paint, matching current desktop behavior exactly.
- At ≤699px: filmstrip (rail) screens are upright (no rotation) immediately after JS mounts and while drifting; the hero fan shows its mobile-specific angles (not desktop angles).
- Continuously resizing 375↔1440px (including dwelling in 700–879px) never leaves any section or screen stuck at `opacity:0`, and never freezes a collage that is currently in view at any width.
- `prefers-reduced-motion: reduce` still renders every section and screen fully visible and static immediately, unchanged from today.
- No new `rAF` loops, scroll listeners, or per-frame layout reads introduced; `screenVariant` lookup is cached at setup, not recomputed inside the frame loop.

## Checks to run

- `npm run lint`, `npm run build`.
- Manual pass at ≥1440px confirming zero entrance animation on any section (compare against current production behavior / git stash if needed).
- Manual pass at 390×844 confirming rail screens are upright and the hero fan uses mobile angles, both immediately on load and while scrolling/drifting.
- Manual resize-drag pass from ~375px to ~1440px and back, watching for any section or screen stuck invisible, and for collage drift continuing uninterrupted through 700–879px.
- Reduced-motion pass (`prefers-reduced-motion: reduce`) at both a mobile and desktop width.
- Keyboard/focus and print/backgrounded-tab checks unaffected — quick spot check only, since this pass doesn't touch those paths.

## Manual test steps (for the report)

1. `npm run dev`, open at ≥1440px width; scroll the full page; confirm no section ever animates in (all content visible immediately, as it is today).
2. Resize devtools viewport to 390×844; reload; confirm rail screens (ISDS/Fitnex/Cartify) sit upright with no rotation, and the hero's four phones show their mobile fan angles, not desktop angles.
3. With the page loaded at 390px, slowly drag the viewport width up to 1440px and back down, pausing inside 700–879px; confirm no section or screen ever gets stuck invisible, and any collage in view keeps drifting throughout.
4. Toggle `prefers-reduced-motion: reduce` in devtools rendering panel at both 390px and 1440px; reload; confirm everything renders fully visible and static with no hidden sections.
5. Quick spot check: tab through the page and confirm focus rings still show; print-preview once to confirm no blank state.
