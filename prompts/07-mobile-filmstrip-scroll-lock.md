# 07 — Fix: mobile vertical scroll dies when the swipe starts on a filmstrip

Follow-up to `06-scroll-deadlock-fix.md`. That fix (`overflow-x: clip`) restored page
scrolling; this is a **second, independent** defect with the same user-facing symptom,
found while verifying 06 and confirmed through Chrome's real gesture pipeline
(`Input.synthesizeScrollGesture`, `gestureSourceType: touch`) — not synthetic touch events.

## Symptom
On mobile, a vertical swipe that **starts on a rail filmstrip** does not scroll the page
at all. Repeated swipes from the same spot also do nothing (Chrome latches a gesture to
one scroller for that gesture's lifetime). Since the product sections are mostly
filmstrip, a thumb landing there feels like the page is frozen.

## Two causes, both required
Measured at `scrollY 2350` on an iPhone 13 profile, swiping up from y = 300/400/500:

| rail screens settled | `touch-action` | vertical swipe | filmstrip horizontal pan |
|---|---|---|---|
| no (current) | `pan-x` (current) | **STALL** | PANS |
| no | `pan-x pan-y` | **STALL** | PANS |
| yes | `pan-x` | **STALL** | PANS |
| yes | `pan-x pan-y` | **OK** | PANS |
| yes | `auto` | OK | PANS |

**Cause A — `touch-action: pan-x`** (`components/Collage.module.css:17`). It declares the
rail handles horizontal panning only, so a vertical gesture starting there is dropped
rather than chained to the page.

**Cause B — un-settled entrance transforms leave the rail vertically scrollable.**
`HorizonMotion.tsx` puts *every* `[data-screen]` into the fan entrance state
(`opacity: 0; transform: … translate3d(0,34px,0) scale(0.96)`) as an inline style, rail
screens included — overriding the `transform: none; opacity: 1` the rail CSS already
declares for them. That 34px offset makes each rail `scrollHeight` 15px greater than its
`clientHeight`, so `overflow-x: auto` (which forces `overflow-y: auto`) gives the rail
~15px of vertical scroll the gesture latches onto. Measured: `railSlack = 15px`; with rail
screens forced to their settled state, `railSlack = 0px`.

Note `overflow-y: hidden` does **not** help — `hidden` is still a scroll container and the
slack survives (verified: slack stayed 15px). The transform has to go.

### Bonus defect fixed by Cause B
Rail screens settle via an `IntersectionObserver`. Screens sitting past the right edge of a
filmstrip never intersect the viewport, so they never settle and stay at `opacity: 0`
— **27 filmstrip screens across the page are invisible** until the user happens to pan that
strip horizontally. Not applying the fan entrance to rail screens fixes this too
(measured: `invisibleFilmstripScreens` 27 → 0).

## Change

**1. `components/Collage.module.css`** — rail stage:
```css
touch-action: pan-x pan-y;   /* was: pan-x */
```
`pan-y` here permits the *page* to pan vertically; the rail has no vertical overflow of its
own once (2) lands, so the gesture chains straight to the document. Horizontal panning of
the filmstrip is unaffected (verified in every row of the table above).

**2. `components/HorizonMotion.tsx`** — do not apply the fan entrance to rail screens while
the mobile rail layout is active. This extends the existing, documented rail carve-outs
(no rotation in `baseT`, skipped in the drift loop) to the one place it was missed:
- in the init `screens.forEach`, when `isMobileRail() && screenVariant.get(el) === "rail"`,
  leave `opacity`/`transform` alone and set `el.dataset.settled = "1"`;
- do not `settleIO.observe()` or `settle()` those screens.

Mobile section-level entrance (`data-sect`, already mobile-only) continues to provide the
"eases in as it enters view" motion the README specifies for mobile, so nothing is lost
visually — the fan entrance was never part of the rail design in the first place.

## Files touched
- `components/Collage.module.css`
- `components/HorizonMotion.tsx`

## Constraints preserved (AGENTS.md §6/§7/§8)
- Still one shared rAF loop; still `transform`/`opacity` only; no new listener.
- Desktop fan collages keep their depth-staggered settle and drift exactly as now — the
  carve-out is gated on `isMobileRail()` and the `rail` variant.
- Reduced motion (`still`) path unchanged.
- Filmstrip horizontal snap panning unchanged.
- Fail-safe `reveal()` / print / backgrounded-tab paths unchanged.

## Acceptance criteria
On an iPhone 13 profile, via the real touch gesture pipeline:
- Vertical swipe from y = 300, 400 and 500 at `scrollY 2350` (all over a filmstrip) scrolls
  the page.
- Filmstrip still pans horizontally (`scrollLeft` 0 → ~267).
- `railSlack === 0` for every rail.
- Zero filmstrip screens at `opacity: 0` after the strips are in view.
- Desktop 1440×900 collage entrance and drift visually unchanged.

## Checks to run
`npx tsc --noEmit`, `npm run lint`, `npm run build`, plus the headless desktop + mobile
suite from 06 extended with the gesture-pipeline swipe cases above, in both normal and
reduced-motion contexts.

## Manual test steps
1. Device toolbar → iPhone 13. Scroll to any product section. Drag **starting with the
   pointer on a phone screenshot in the filmstrip** and swipe up — the page scrolls.
2. Drag horizontally on the same filmstrip — it pans and snaps, page does not move.
3. Scroll the full page: every filmstrip screenshot is visible without panning the strip.
4. Desktop 1440px: confirm hero and collage entrances still stagger and drift as before.
5. Reduced motion on: everything static, both scroll axes still work.
