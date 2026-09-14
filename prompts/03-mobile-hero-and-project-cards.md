# Mobile hero collage + project-card CTA layout — bring to spec

## Goal
Two mobile-only defects, both visible in the screenshots the user attached (which are screenshots of `design_handoff_horizon_portfolio/design/Horizon - Mobile.dc.html` rendered at 430px):

1. **Hero collage on mobile currently renders as a horizontal scroll filmstrip.** The mobile design is *not* a filmstrip here — it's a fixed, absolutely-positioned 4-phone fan-out above the headline (`Horizon - Mobile.dc.html` lines 57–70), reusing 4 of the desktop's 6 hero screens at mobile-specific positions/sizes/rotations. Today `Hero.tsx` feeds `Collage` the desktop 6-screen dataset, and `Collage.module.css`'s `max-width: 699px` rule unconditionally turns every collage (hero included) into a `flex; overflow-x:auto` rail. That rail behavior is correct for the *project* sections (the mobile file does use `data-rail` there) but wrong for the hero.
2. **Project-card CTA/footer is not restacked for mobile.** In the mobile file, each project card's footer is a vertical stack (claim text → stack line → a full-width, `text-align:center`, block-level pill button), e.g. `Horizon - Mobile.dc.html` lines 168–172 (ISDS Customer's "Get it on the App Store"). Today `ProductSection.module.css`, `Fitnex.module.css`, and `Cartify.module.css` only override `.section` padding at `max-width: 699px` — the footer stays the desktop `display:flex; justify-content:space-between` row, so the CTA renders as a left-aligned, content-width pill instead of the full-width button in the screenshot.

## What I read
- `AGENTS.md` sections 2, 3, 6, 7 (mobile is "its own structure, not a shrunk desktop"; no improvised responsive collapse; single shared rAF/IO already in place via `HorizonMotion.tsx`, not touched here).
- `design_handoff_horizon_portfolio/README.md` lines 195–223 (mobile design behavior, filmstrip range guidance, ~700px/~1000px breakpoint guidance).
- `design_handoff_horizon_portfolio/design/Horizon - Mobile.dc.html` in full (635 lines) — hero stage (lines 50–80), stat grid (74–79), and all six project-card sections' `data-stage data-rail` markup + footer markup (ISDS Customer 141–173, Vendors 175–204, Driver 206–238, Customer B2B 240–274, Fitnex 276–316, Cartify 318–347).
- `design_handoff_horizon_portfolio/design/Horizon - Desktop.dc.html` hero section (lines 48–90) to confirm the desktop 6-screen dataset and confirm the stat-line copy differs between the two files.
- Current code: `components/sections/Hero.tsx`, `Hero.module.css`, `components/Collage.tsx`, `Collage.module.css`, `components/sections/ProductSection.tsx`, `ProductSection.module.css`, `Fitnex.tsx/.module.css`, `Cartify.tsx/.module.css`, `lib/content.ts` (`ScreenSpec` type, `heroScreens`, `heroStats`).

## Confirmed mismatches vs. the mobile file

**Hero:**
- Stage: fixed `height: 310px` (not `clamp(...)`), 4 screens only — `dashboard-24e93d62.jpg` (rot -10, order 3), `img-7775.jpg` (rot 10, order 2), `img-7788-2.jpg` (rot -4, order 1), `dashboard-c92695ae.jpg` (rot 2, order 0, eager). Positions are `left`/`bottom` percentages distinct from desktop's values, and `width` is a % of the 430px column, not vw-clamped.
- Stat line: `display:grid; grid-template-columns:1fr 1fr; gap:12px 16px` — **no vertical rule dividers**, 2-column grid. Copy differs from desktop: `"200+ users, solo build"`, `"20%+ overhead cut"`, `"50+ devs mentored"` (desktop says "users on a solo build" / "overhead reduction measured" / "developers mentored"). Current `heroStats` in `lib/content.ts` only has the desktop copy and is shared by both.

**Project cards (all six):** footer is `padding:18px 20px 0` (or `16px 20px 0` for Cartify), stacked `claim` block then CTA(s) as `display:block; text-align:center` full-width pills, one per line, `margin-top:16px`/`10px` gap between them. Cartify has no gradient CTA on mobile or desktop — both its links are the secondary "outline pill" style, stacked.

## Decisions / approach
1. **Extend `ScreenSpec`** (`lib/content.ts`) with an optional `mobile` block: `{ left, bottom, width, rot, z, padding, radius, imgRadius, border, boxShadow, filter?, hidden? }`. Add a new `heroMobileScreens` export (or a `mobile` field directly on the 4 relevant `heroScreens` entries plus `hidden: true` mobile behavior on the 2 not used — bulk-shipment-1 and img-7848) transcribed verbatim from the mobile file's hero stage. I'll add the mobile fields directly onto the existing `heroScreens` array entries (avoids a second image element / duplicate `<Image>` in the DOM) rather than a parallel array, and mark the two unused-on-mobile screens with `mobile: { hidden: true }`.
2. **`Collage`** takes an optional `variant: "fan" | "rail"` prop (default `"rail"`, matching today's behavior for all project sections). `Hero` passes `variant="fan"`. `Collage.module.css`'s existing `max-width:699px` filmstrip rule moves under `.stage[data-variant="rail"]`; a new `.stage[data-variant="fan"]` rule at the same breakpoint keeps `position:relative; height:310px` and switches each `.screen` to read `--m-left/--m-bottom/--m-width/...` custom properties (set from `s.mobile`) instead of the desktop ones, with `display:none` when `s.mobile?.hidden`. This keeps one `<Image>` per screen (no duplication) and keeps the single shared entrance/drift logic in `HorizonMotion.tsx` untouched — it already walks `[data-screen]` generically.
3. **Hero stats**: replace the shared `heroStats` flex+dividers markup with a mobile-specific render path in `Hero.tsx` (CSS-only toggle, both marked up server-side, one hidden per breakpoint — consistent with how `Collage` will do it) OR simpler: keep one `<div className={styles.stats}>` grid of 4 items whose text differs by breakpoint via two `<span>`s per stat (one `.desktopText`, one `.mobileText`, toggled with `display:none` in the media query) so there's no dead layout swap. I'll implement it as: `.stats` becomes `display:flex` on desktop / `display:grid; grid-template-columns:1fr 1fr` under `699px` (no dividers rendered on mobile — the `.rule` elements get `display:none` in that query), and each stat renders both copy variants inline, toggled by a `.onlyMobile`/`.onlyDesktop` utility class in `Hero.module.css`. Copy stays hard-coded in `Hero.tsx` (matches how `heroStats` already isn't really used generically — confirming during implementation whether `heroStats` is consumed elsewhere before changing its shape).
4. **Project-card footers**: add a `max-width: 699px` block to `ProductSection.module.css`, `Fitnex.module.css`, and `Cartify.module.css` that switches `.footer`/`.actions` (and Cartify's `.actions`) from `flex row / space-between` to `flex column`, and makes `.cta`/`.secondary`/`.action` `display:block; width:100%; text-align:center` with the exact `margin-top` gaps from the mobile file. Also move the rail's own horizontal padding so it can be edge-to-edge per spec (`section` mobile padding becomes `0` horizontally where the mobile file omits it, with the text blocks and footer keeping their own `padding: 0 20px` / `18px 20px 0`) — only if this doesn't regress the already-correct rail scroll-snap behavior; I'll verify by comparing scroll position visually against the screenshot before committing to that part.
5. Out of scope: the 700–1000px interpolation zone the README calls out (I'm targeting the `max-width:699px` breakpoint only, matching the existing codebase convention); anything not shown in the two attached screenshots (nav, track-record cards, ISDS connective stat, front-end-to-system timeline, recommendations, contact) — those aren't touched.

## Files I expect to touch
- `lib/content.ts` — extend `ScreenSpec`, add `mobile` fields to the 6 `heroScreens` entries.
- `components/Collage.tsx`, `components/Collage.module.css` — `variant` prop, fan-mode mobile CSS.
- `components/sections/Hero.tsx`, `Hero.module.css` — `variant="fan"`, 2-col stat grid, mobile-specific stat copy.
- `components/sections/ProductSection.tsx` / `.module.css` — mobile footer/CTA stacking.
- `components/sections/Fitnex.module.css`, `components/sections/Cartify.module.css` — same footer/CTA stacking fix in their own CSS.

No changes to `HorizonMotion.tsx`, the shared rAF loop, `Glow`, `JumpNav`, or any other section.

## Requirements carried over from AGENTS.md
- Values transcribed verbatim from `Horizon - Mobile.dc.html`, not eyeballed.
- Single shared `rAF`/`IntersectionObserver` loop stays the only thing animating `[data-screen]`/`[data-glow]` — no new loops.
- Animate only `transform`/`opacity`; no new `filter`/layout animation introduced.
- `prefers-reduced-motion`: fan-mode screens must resolve to their settled position/opacity immediately, same as today's rail mode (`HorizonMotion.tsx`'s existing `reveal()`/still-mode path already handles this generically via `[data-screen]` — verify it still fires correctly on the new fan-mode markup).
- Visible focus rings preserved on the new full-width mobile CTAs.
- SSR/first-paint/backgrounded-tab/print fail-safe preserved (settled state must be correct without JS).
- Placeholder flags untouched (none affected by this change).

## Acceptance criteria
- At ≤699px viewport, the hero shows the 4 phones fixed/overlapping per the mobile file's exact left/bottom/width/rotation/z/radius/filter/shadow values — no horizontal scrolling in the hero.
- Hero stat line is a 2-column grid, no divider rules, with the mobile-specific copy ("200+ users, solo build" / "20%+ overhead cut" / "50+ devs mentored").
- Each project card's CTA(s) render as full-width, centered, stacked pill(s) below the claim/stack text, matching the screenshot.
- Desktop (≥1000px) and the existing project-card horizontal rails are pixel-unchanged.
- No new console errors/warnings; `next build`, `tsc`, `eslint` clean.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Manual: Chrome DevTools device mode at 390×844 and 430×932, compare hero + ISDS Customer card against the two attached screenshots pixel-by-pixel (position, rotation, radius, button width).
- Manual: `prefers-reduced-motion: reduce` toggle — hero fan screens should appear immediately settled, no flash/jump.
- Manual: throttle CPU 4x, scroll through hero and one project rail, watch for dropped frames in the Performance panel.
- Manual: keyboard-tab through the new full-width CTA buttons, confirm visible focus ring isn't clipped by the button's own border-radius/overflow.
- Manual: print preview + backgrounded-tab check on the hero (fan screens must not be stuck mid-entrance or blank).
- Desktop pass at ≥1000px to confirm no regression.

## Test steps for you
1. `npm run dev`, open in Chrome, toggle device toolbar to 390×844.
2. Compare the hero against the first attached screenshot — phone stack position/overlap/rotation, headline, stat grid.
3. Scroll to the ISDS Customer card, compare against the second screenshot — card copy, phone rail, "Get it on the App Store" button (should span the card width).
4. DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload, confirm hero phones are static and in their final position with no animation.
5. Resize back to desktop width (≥1000px), confirm the hero and project cards look unchanged from before this change.
