# Mobile project-card filmstrip — bring rail screens to spec

## Goal
Fix the mobile ("rail" variant) project-card collages — ISDS Customer, ISDS Vendors, ISDS Driver, ISDS Customer B2B, Fitnex, Cartify — which currently render flat, undimmed, mis-aligned phone frames instead of the mobile design's tapered, progressively-dimmed filmstrip. This is the item explicitly deferred in `prompts/03-mobile-fixes.md` ("rail screens at desktop size... deferred to a separate follow-up pass") and is what the user's two attached screenshots show (ISDS Vendors/Customer sections, current vs. intended).

## What I read
- `AGENTS.md` sections 2, 3, 6, 7, 9 (mobile is its own structure; transcribe exact values from the `.dc.html`, never eyeball; single shared rAF loop untouched by this change; placeholder flags untouched).
- `design_handoff_horizon_portfolio/design/Horizon - Mobile.dc.html` in full — every `data-stage data-rail` block: ISDS Customer (141–173), ISDS Vendors (175–204), ISDS Driver (206–238), ISDS Customer B2B (240–274), Fitnex (276–316), Cartify (318–347).
- `design_handoff_horizon_portfolio/README.md` lines 195–206 (filmstrip spec: anchor 188–196px then progressively smaller/dimmer 152→116px — confirmed the actual file carries more precise, section-specific values than this rounded summary).
- Current code: `components/Collage.tsx`, `components/Collage.module.css`, `lib/content.ts` (`ScreenSpec`, `productSections`, `fitnex`, `cartify`), `components/sections/ProductSection.tsx`, `Fitnex.tsx`, `Cartify.tsx`.
- `app/globals.css` tokens: confirmed `--raised:#1C1815`, `--edge:#332C24`, `--edge-lit:#463C30` already equal the hex values hardcoded in the mobile file's filmstrip markup — no new tokens needed.

## Root cause (three compounding bugs)
1. **`Collage.module.css`'s rail-mode override forces `filter:none` and never sets `background`/`border`/`box-shadow`/`padding`/`border-radius` from mobile-specific values.** The base `.screen` rule's `background`/`border`/`box-shadow` come from the *desktop* `--border`/`--shadow` custom properties (via `s.boxShadow`/`s.border`), which are close but not the exact mobile values, and the forced `filter:none` kills the progressive brightness/saturate dimming that makes supporting screens visually recede — the single biggest visible difference in the screenshots (every screen renders equally bright/flat instead of tapering off).
2. **The rail stage container has no `align-items:flex-end`.** The mobile file's `data-rail` sets `align-items:flex-end` so shorter (narrower) screens' frames sit flush with the anchor's bottom edge. Without it, flex default `stretch` distorts the frame boxes to equal height, which is the misaligned/stretched look in the screenshot.
3. **`mobileWidth()` in `Collage.tsx` only has 3 hard-coded size tiers (192/152/116px)** applied by `order` bucket, instead of each section's exact 4–6 per-screen px values from the mobile file (e.g. ISDS Customer: 188/152/140/128/120; Cartify: 164/138/126 for only 3 screens; Fitnex: 196/158/144/132/124/116 for 6). This under-shoots the taper and, worse, Cartify/Fitnex/ISDS Vendors don't even have the same *set* of screens on mobile as on desktop (see below), which this tiering can't express at all.

## A fourth wrinkle: mobile filmstrip composition differs from the desktop fan for 3 sections
The mobile file is "its own structure, not a shrunk desktop" (AGENTS.md §3) — confirmed these aren't 1:1 with today's `screens` arrays:
- **ISDS Vendors**: desktop fan has 5 screens (adds `onboarding-3.jpg`, order 4); mobile filmstrip only shows 4 (`notifications`, `transfer-funds`, `dashboard-24e93d62` anchor, `withdraw-funds`) — `onboarding-3` is desktop-only.
- **Cartify**: desktop fan has 5 screens; mobile filmstrip only shows 3 (`img-7848` anchor, `img-7854`, `img-7856`) — `img-7853` and `img-7855` are desktop-only.
- **Fitnex**: desktop fan anchor is `img-7782` (landing screen); the mobile filmstrip's anchor is a *different* image, `img-7788-2` ("home with sessions/volume/streak"), and mobile adds a screen never used on desktop at all (`img-7785`, onboarding quiz) while keeping `img-7782` as the smallest/last (order 5) item instead of the anchor. Six mobile screens total vs. five desktop.

This means the "same array, `mobile:{...}` override on each item" pattern (already used successfully for the hero) isn't sufficient here — some items need to be desktop-only or mobile-only, and Fitnex needs one image to change *role* (anchor → smallest) between breakpoints.

## Decisions
1. **Extend `ScreenSpec.mobile`** (`lib/content.ts`) with the full filmstrip authoring, transcribed verbatim per screen: `flexWidth` (px, e.g. `"188px"`), `padding`, `radius`, `imgRadius`, `border`, `boxShadow`, `filter?`, and reuse the existing `hidden?: boolean` for desktop-only screens.
2. **Desktop-only screens** (ISDS Vendors' `onboarding-3`, Cartify's `img-7853`/`img-7855`) get `mobile: { hidden: true }` — already-supported, just needs the render path to actually respect it in rail mode (currently only wired for fan mode).
3. **Mobile-only screens** (Fitnex's `img-7785`): add a new entry to `fitnex.screens` carrying only the fields needed to render (`src`, `alt`, `order` matching its mobile-file order) plus a new `desktopHidden: true` flag (on the top-level `ScreenSpec`, not under `mobile`) that hides it at ≥700px via CSS, and a `mobile` block with its real filmstrip styling. Its desktop `left`/`bottom`/`width`/`rot`/etc. fields become inert placeholders (never shown) since the CSS `display:none` at desktop width takes precedence — I'll set them equal to a neighboring screen's values to keep TypeScript/props happy without implying a real desktop position.
4. **Fitnex's role swap** (`img-7782` anchor on desktop, smallest on mobile): handled naturally once every screen carries its own explicit `mobile.flexWidth`/`order` — the mobile order/size is authored independently of the desktop `order`/`width` per screen, so no special-case code needed beyond what's already true of the schema.
5. **`Collage.tsx`**: drop the 3-tier `mobileWidth()` heuristic. Read `s.mobile?.flexWidth` directly as the `--mobile-width` custom property (every rail-mode screen will have one after this pass, so no fallback heuristic is needed). Also emit `--m-*` custom properties for `padding`/`radius`/`imgRadius`/`border`/`boxShadow`/`filter` in rail mode the same way fan mode already does (currently these are only read by the fan-mode CSS block).
6. **`Collage.module.css`**: 
   - Add `align-items: flex-end` to `.stage[data-variant="rail"]`.
   - Change `.stage[data-variant="rail"] .screen` to set `background`, `border`, `box-shadow`, `padding`, `border-radius`, `filter` from the `--m-*` custom properties (falling back to the desktop var only where a mobile value isn't authored — shouldn't happen after this pass, but keeps it non-breaking), instead of hardcoding `filter:none` and leaving the rest un-set.
   - Add `display:none` support in both directions: existing `--m-display` (mobile-hidden, already used by fan mode — extend to rail) for desktop-only screens, and a new rule hiding any screen flagged `desktopHidden` at `min-width:700px`.
7. Out of scope: hero (`variant="fan"`), ISDS connective moment, track record, front-end-to-system, recommendations, contact, and anything at ≥700px (desktop fan geometry is unchanged).

## Files I expect to touch
- `lib/content.ts` — extend `ScreenSpec` type; add `mobile.flexWidth/padding/radius/imgRadius/border/boxShadow/filter` to every screen in `productSections` (all 4 ISDS sections), `fitnex.screens`, `cartify.screens`; add `mobile:{hidden:true}` to ISDS Vendors' `onboarding-3` and Cartify's `img-7853`/`img-7855`; add the new Fitnex-only-on-mobile `img-7785` entry with `desktopHidden:true`.
- `components/Collage.tsx` — remove `mobileWidth()`, wire the new `--m-*` custom properties for rail mode, add `--desktop-hidden` custom property support.
- `components/Collage.module.css` — rail-mode CSS per decision 6.

No changes to `HorizonMotion.tsx`, the shared rAF/IntersectionObserver loop, `Glow`, `JumpNav`, `ProductSection.tsx`/`Fitnex.tsx`/`Cartify.tsx` (they already just forward `screens`/`stageHeight` to `Collage`).

## Requirements carried over from AGENTS.md
- Every size/padding/radius/border/shadow/filter value transcribed verbatim from `Horizon - Mobile.dc.html`, not eyeballed or interpolated.
- Animate only `transform`/`opacity` — this pass only changes static CSS custom properties per breakpoint, no new animated properties.
- Single shared rAF/IntersectionObserver loop in `HorizonMotion.tsx` stays untouched; it already walks `[data-screen]` generically, so entrance/drift/reduced-motion behavior for these screens is unaffected by this styling-only change.
- Placeholder flags (badge "In development" on ISDS Customer B2B, etc.) untouched.
- No SSR/first-paint/backgrounded-tab/print regression — this is a CSS-variable and markup change only, settled-state rendering path is unaffected.

## Acceptance criteria
- At ≤699px, each of the 6 filmstrips shows the exact screen set, order, per-screen width, padding, radius, border, box-shadow, and filter (dimming taper) from `Horizon - Mobile.dc.html`, bottom-aligned (`align-items:flex-end`).
- ISDS Vendors' `onboarding-3` and Cartify's `img-7853`/`img-7855` do not appear in their mobile filmstrips; they still appear correctly in the desktop fan.
- Fitnex's mobile filmstrip anchor is `img-7788-2`, includes the onboarding-quiz screen (`img-7785`) that never appears on desktop, and ends with `img-7782` as the smallest/dimmest item — desktop fan is unchanged (anchor stays `img-7782`).
- Desktop (≥700px) fan geometry, dimming, and shadows are pixel-unchanged from before this pass.
- `tsc`, `eslint`, and `next build` all pass clean.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Manual: Chrome DevTools device mode at 390×844, scroll through all 6 filmstrips, compare each against its section in `Horizon - Mobile.dc.html` rendered in a browser (or the two attached screenshots for ISDS Customer/Vendors) — screen set, order, taper, alignment.
- Manual: confirm ISDS Vendors and Cartify each show one fewer/two fewer screens respectively on mobile than on desktop, and Fitnex shows 6 on mobile vs. 5 on desktop with a different anchor.
- Manual: `prefers-reduced-motion: reduce` toggle — filmstrip screens still appear immediately, fully settled, no change in behavior from before.
- Manual: throttle CPU 4×, scroll through one filmstrip, confirm no dropped frames (this pass shouldn't affect performance, but verifying since `Collage.tsx` changes).
- Desktop pass at ≥1000px confirming no regression to any of the 6 product-section fans.

## Test steps for you
1. `npm run dev`, open in Chrome, toggle device toolbar to 390×844.
2. Scroll to ISDS Vendors and ISDS Customer, compare against your two attached screenshots — screens should now taper in size and dim progressively, bottom-aligned, matching the second screenshot.
3. Scroll to Fitnex — confirm 6 phones with the onboarding-quiz screen included and a different anchor image than the desktop version.
4. Scroll to Cartify — confirm only 3 phones (not 5).
5. DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload, confirm no change in the above (already-static content, no animation involved here).
6. Resize back to ≥1000px, confirm all 6 desktop fans look unchanged from before this change.
