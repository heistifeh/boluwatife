# Implementation prompt: bring the motion engine in line with motion-reference.js + SECTION_BEHAVIOUR.md

## Goal
The site already has a working build (see `prompts/01-horizon-portfolio.md`), but the shared motion
controller (`components/HorizonMotion.tsx`) has drifted from the canonical implementation the user just
supplied (`motion-reference.js`) and from the section-by-section contract (`SECTION_BEHAVIOUR.md`). This
pass ports the reference file faithfully and fixes the section markup that disagrees with the behaviour doc,
without touching layout/visual code that already matches.

## What I read
- `SECTION_BEHAVIOUR.md` (pasted in full into this conversation) — the shared rules (two motion layers,
  "nothing in view is ever frozen," off-screen = untouched, reduced motion) and the per-section behaviour,
  including "Proof bar... drops the staging entirely: no glow, no collage, **no entrance animation**, no drift."
- `motion-reference.js` (pasted in full) — the canonical rAF loop: settle entrance, fail-safe reveal,
  drift formula, glow scroll-tie + breathing, front-end-to-system scroll math. Single `isMobileRail = width < 880`
  check, no other breakpoint branching, no per-viewport tuning of amplitude/period/breathing constants.
- Existing code: `components/HorizonMotion.tsx`, `components/Glow.tsx`, `components/Collage.tsx` (+ `.module.css`),
  `components/AmbientGradient.tsx`, `components/JumpNav.tsx`, `components/Nav.tsx`, and every section under
  `components/sections/` (Hero, ProofBar, TrackRecord, IsdsConnective, ProductSection, Fitnex, Cartify,
  FrontEndToSystem, Recommendations, Contact) plus `lib/content.ts`.

## What's already correct (not touching)
- Glow weights/tints per section already match the SECTION_BEHAVIOUR table exactly (hero 1.15, Fitnex 1.30,
  ISDS Customer 0.85, Vendors/Driver 0.80, B2B 0.62, ISDS intro 0.50, Track record 0.42, Cartify 0.40,
  front-end-to-system 0.36, Contact 0.70), bottom/top anchoring, and the hero's `top:-8%; height:54%` cap.
- Nav has no scroll-driven behaviour (matches "no scroll-driven change... static dot").
- ProofBar and Recommendations already have no `<Glow>` and no collage (matches "drops staging" / "no glow, no
  collage, no motion").
- `lib/content.ts` data (weights, screens, copy, placeholder flags) is untouched.

## Bugs found vs. the reference, and the fix for each

1. **Invented "compact" dead-zone (700–880px) disables collage drift entirely.**
   `HorizonMotion.tsx` currently gates the whole drift block behind `mobile || !compact`, where `compact`
   is `innerWidth < 880 && innerWidth >= 700`. In that band, in-view collages simply stop moving — this
   directly violates "Nothing in view is ever frozen... If a section looks like a static screenshot
   arrangement, it is wrong" and does not exist in `motion-reference.js` (which has no such band; drift
   always runs for every member of `drifting` once `settled`). **Fix:** delete the `compact` concept.
   Drift always runs for every `drifting`, `settled` screen whenever `!still`, at every viewport width.

2. **Duplicated, re-tuned amplitude/period/breathing constants for "mobile."**
   The reference computes each screen's `ampY`/`ampR`/`per`/`ph` once with a single formula (lines 89–95)
   and uses a single glow-breathing formula (lines 274–289) and a single front-end-to-system step formula
   (lines 330–347) — no viewport branching anywhere except the (here-unused) mobile-rail vertical-only
   case. `HorizonMotion.tsx` invented separate mobile coefficients (2.0 vs 2.1, 0.4 vs 0.42, 0.3 vs 0.32,
   vh-offset 0.1 vs 0.12, etc.) that were never in the design. Per AGENTS.md §11 ("match the design exactly
   rather than improving it") these are re-derived guesses. **Fix:** delete all `mobile ? x : y` tuning and
   use the exact reference constants for every element, at every width.

3. **Mobile rail vertical-only drift branch is correctly a no-op here — leave it in for parity.**
   Every `ScreenSpec` in `lib/content.ts` always sets `rot` (even `0` for anchors), so `data-rot` is always
   present and `baseT()`'s absolute/rotate math already produces the right per-screen result on both the
   fan and the filmstrip. I'll port the reference's `if (rail && !el.hasAttribute("data-rot"))` branch
   verbatim (for fidelity / future screens without rotation) but it won't change current visuals.

4. **`isMobileRail` threshold should match this project's actual layout breakpoint, not the reference's
   literal `880`.** The reference's `880` assumes a CSS layout that also switches at 880. This codebase's
   `Collage.module.css` only switches the stage from absolute fan → flex snap-rail at `max-width: 699px`.
   Using `880` for the JS while CSS switches at `699` would make `baseT()` drop the `translateX(-50%)`
   centering prefix for 700–879px screens that are still positioned `absolute` by CSS, breaking their
   horizontal placement. **Fix:** define the rail check as `window.innerWidth <= 699` (matching the real
   CSS breakpoint) instead of `880`, and use that single constant everywhere `isMobileRail`/`baseT` need it.
   This is the one deliberate deviation from the reference's literal number, justified by AGENTS.md's own
   "read the code before assuming" step — the breakpoint must match the CSS that already exists.

5. **Mobile section-entrance (`data-sect`) is on the wrong two sections.**
   Only `ProofBar` and `TrackRecord` currently carry `data-sect`. SECTION_BEHAVIOUR §11 says *every*
   section eases in on mobile ("each section eases in as it enters view... so one section never hard-cuts
   into the next") **except** Proof bar, which is explicitly called out as the one section with "no
   entrance animation" at all. **Fix:**
   - Remove `data-sect` from `ProofBar.tsx`.
   - Add `data-sect` to every other top-level section that doesn't already have it: `Hero.tsx`,
     `IsdsConnective.tsx`, `ProductSection.tsx`, `Fitnex.tsx`, `Cartify.tsx`, `FrontEndToSystem.tsx`,
     `Recommendations.tsx`, `Contact.tsx`. `TrackRecord.tsx` keeps it.
   - No visual effect on desktop: the reference's section-entrance IntersectionObserver only ever hides/
     reveals elements found via `data-sect`, and the fail-safe/settle logic already treats desktop the same
     way regardless — I'm just letting every section run it, not adding a new mechanism.

6. **Fail-safe reveal doesn't cover `dirty = true` on visibility restore.**
   The reference's `onVisibility` handler sets `dirty = true` when the tab becomes visible again (so the
   next frame re-measures/re-applies scroll-derived state) and only calls `reveal()` when hidden. The
   current `onVis` only calls `reveal()` on hidden and does nothing on restore, which is harmless today
   (rAF just resumes) but I'll port it verbatim for parity since it's cheap and matches the reference.

## Files I expect to touch
- `components/HorizonMotion.tsx` — rewrite the rAF loop/observers to be a faithful port of
  `motion-reference.js` (fixes 1, 2, 3, 6), with the single rail breakpoint constant from fix 4.
- `components/sections/ProofBar.tsx` — remove `data-sect`.
- `components/sections/Hero.tsx`, `IsdsConnective.tsx`, `ProductSection.tsx`, `Fitnex.tsx`, `Cartify.tsx`,
  `FrontEndToSystem.tsx`, `Recommendations.tsx`, `Contact.tsx` — add `data-sect` to the `<section>` root.

No changes to `lib/content.ts`, `Glow.tsx`, `Collage.tsx`, `AmbientGradient.tsx`, `Nav.tsx`, `JumpNav.tsx`,
or any `.module.css` file — none of the CSS/data issues identified above require it.

## Acceptance criteria
- No section's collage ever stops drifting while it's in the `drifting` set and settled, at any viewport width.
- Resizing continuously from 1440px down to 375px shows no dead zone where drift stops.
- On a ≤699px viewport, every section except Proof bar visibly eases in (opacity/translate) as it enters
  view; Proof bar's content is present at full opacity immediately, no transition.
- `prefers-reduced-motion: reduce` still holds everything static and fully visible (unchanged behaviour,
  re-verified after the rewrite).
- `npm run build` and `npm run lint` pass.

## Checks to run
1. `npm run build` (type check + production build) — report real output.
2. `npm run lint` — report real output.
3. Manual: resize continuously 1440→375px while a product section's collage is in view; confirm it never
   freezes at any width, including 700–879px.
4. Manual: `prefers-reduced-motion: reduce` in dev tools — reload, scroll full page, confirm ambient/glow/
   collage/stack are all static and every screen is fully visible (no regression from the rewrite).
5. Manual: narrow to 430px width, scroll top to bottom — confirm Proof bar has no entrance animation and
   every other section fades/slides in once per visit, and the jump-nav / filmstrips still work.
6. Manual: throttled-CPU scroll pass over Fitnex (densest collage) checking for dropped frames.
7. Manual: keyboard-only pass confirming focus rings still visible (unaffected by this change, but verifying
   no regression).

Is this good to execute?
