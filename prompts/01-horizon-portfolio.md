# Implementation prompt: Horizon portfolio site (v1, full build)

## Goal
Build Tife's one-page Next.js portfolio (boluwatifeosineye.com) to be pixel- and motion-accurate to the `design_handoff_horizon_portfolio/` handoff, per AGENTS.md. This is the first implementation pass: the whole page, desktop + mobile, all sections, in one prompt.

## What I read
- `design_handoff_horizon_portfolio/README.md` — in full (tokens, glow construction, collage staging rules, motion spec, mobile spec, content rules, quality floor).
- `design/Horizon - Desktop.dc.html` — full markup (all 13 sections) and the entire `<script>` block (motion controller: settle, drift, glow scroll-tie, front-end-to-system stack, reduced motion, fail-safe reveal, cleanup).
- `design/Horizon - Mobile.dc.html` — full `<script>` block and section/anchor structure (jump-nav, `data-sect` entrance animation, filmstrip drift).
- `design/Horizon - Spec.dc.html` — token/motion reference (confirms README as the more complete, final source where the two differ slightly, e.g. `--gold-1/2` vs `--glow-1/2` naming — using README's names).
- Existing code: none yet beyond the Next.js scaffold (`app/layout.tsx`, `app/page.tsx` are the default `create-next-app` placeholders).

## Key decisions / assumptions
1. **Single route, one page** (`app/page.tsx`), Server Component shell; motion/interactive pieces split into Client Components. No routing beyond the one page.
2. **Breakpoint interpolation** (README explicitly leaves this to judgement): mobile layout (filmstrips, single column, jump-nav) below 700px, desktop fan-collage layout above 1000px, and the desktop file's own built-in "compact" collapse (<880px, already scripted: stages become horizontal snap rows, drift disabled) covers the 700–1000px band. This matches the README's guidance to treat mobile-file as definitive under ~700px and desktop-file as definitive above ~1000px.
3. **One shared motion module** (`app/horizon-motion.ts` or similar client hook) implements the rAF loop, IntersectionObservers, scroll dirty-flag, and reduced-motion check once, reused by every animated island (ambient gradient, glow, collages, front-end-to-system stack, mobile section entrance, mobile jump-nav active state). Ports the exact math from both `<script>` blocks (they're ~95% identical; mobile just adds the section-entrance observer and slightly different amplitude/coefficients — both sets of constants are preserved exactly, not unified into one "reduced" set).
4. **`showConceptWork` and `stillMode`/`glowIntensity` props** from the prototype become: `showConceptWork` → a hardcoded `false` constant (Voltra section omitted entirely, matching the prototype default — not built, since section 1 of AGENTS.md says build nothing beyond what's needed and the flag defaults off); `stillMode` → driven only by `prefers-reduced-motion`, no manual toggle UI; `glowIntensity` → hardcoded `1` (default), not exposed as a tunable, since there's no UI for it in either final layout.
5. **Recommendation quotes stay placeholder-flagged exactly as written** in the desktop file (three cards, verbatim placeholder copy including "Cut this card if only two real quotes arrive").
6. **Fonts** via `next/font/google` (Schibsted Grotesk 600/700/800, Archivo 400/500/600/700) — no manual `<link>`/preconnect tags, since `next/font` self-hosts and inlines this automatically (functionally equivalent, better performance than the prototype's Google Fonts `<link>` approach).
7. **Images**: all 35 screenshots copied into `public/design/img/` (flat, same filenames) and rendered with `next/image`, `width`/`height` derived from the 9:19 aspect ratio at the README's ~520px target, hero anchor + first-visible-project anchor screens `priority` (Next's eager-load equivalent), everything else default (lazy).
8. **CSS Modules**, one token file (`styles/tokens.module.css` or a `:root` in `globals.css` using CSS custom properties, since design tokens are consumed as `var(--x)` throughout — a plain CSS custom-properties file in `globals.css` is simpler than trying to force tokens through CSS Modules' scoping, and AGENTS.md's "tokens file" requirement is satisfied either way). One CSS Module per section component.

## Files I expect to touch
- `app/layout.tsx` — root layout: fonts, global CSS import, metadata (title/description), `lang="en"`.
- `app/page.tsx` — assembles all sections in order inside `<main>`.
- `app/globals.css` — reset, `:root` tokens, `@keyframes ambientA/B`, `prefers-reduced-motion` media query for `scroll-behavior` and ambient sheets, `:focus-visible` rule.
- `components/AmbientGradient.tsx` (+ `.module.css`) — the two fixed blurred sheets. Pure CSS animation (not JS-driven), matching the prototype (these run on CSS `animation`, not the rAF loop — confirmed from both scripts: ambient sheets are never touched by JS, only paused via the reduced-motion media query).
- `components/Nav.tsx` (+ `.module.css`) — fixed top nav, desktop only shown as specced; on mobile this is replaced by the sticky jump-nav (separate component), not reused.
- `components/JumpNav.tsx` (+ `.module.css`) — mobile-only sticky pill bar with active-section tracking.
- `components/Hero.tsx`, `ProofBar.tsx`, `TrackRecord.tsx`, `IsdsConnective.tsx`, `ProductSection.tsx` (shared for ISDS Customer/Vendors/Driver/Customer B2B/Fitnex/Cartify, parameterized by props: eyebrow, name, tint, glow weight/ellipses, copy, screenshots, links, badge state), `FrontEndToSystem.tsx`, `Recommendations.tsx`, `Contact.tsx` — one file + module.css each under `components/sections/`.
- `components/Collage.tsx` (+ `.module.css`) — the fan-staged screenshot stack, takes a list of `{src, alt, order, rot, left, bottom, width, tint...}` and renders frames with the settle/drift data attributes the motion module reads. Handles both desktop fan and mobile filmstrip (via CSS + the `compact` resize logic).
- `components/Glow.tsx` (+ `.module.css`) — the 1–3 ellipse glow wrapper, takes `weight` and ellipse configs (haze/core/rim) as props.
- `lib/motion.ts` — the shared client-side motion controller: one hook (`useHorizonMotion`) that owns the rAF loop, all IntersectionObservers, scroll/resize listeners, reduced-motion detection, and the fail-safe reveal timer/visibilitychange/beforeprint handlers. Section components register their glow/screen/layer elements into it via refs.
- `lib/content.ts` — all copy, stats, screenshot lists, and per-project data (tints, glow weights, links) as typed constants, transcribed verbatim from the desktop `.dc.html`, so JSX stays declarative.
- `public/design/img/*.jpg` — the 35 screenshots copied over.
- Font loading via `next/font/google` in `app/layout.tsx` (no separate file).

## Requirements (AGENTS.md section 7) I'm building to
- Ambient gradient: fixed, scroll-independent, CSS-animated, 42s/61s loops, exact keyframe values from the README/prototype, `mix-blend-mode:screen`, `contain:strict`, only blurred layer in the design.
- Per-section glow: exact ellipse configs (alphas, sizes, positions) per section, bottom-anchored in product sections, top-anchored and capped (`top:-8%; height:54%`) in the hero so the bright core never crosses the headline/subhead/stat line. Weight table from the README drives base opacity via `clamp(0,1,weight*1)`.
- Collages: fan staging with exact `left/bottom/width/rotate/z-index/brightness` per screen from the desktop file, anchor screen distinguished (`--edge-lit`, deepest shadow, gold inset), depth-staggered settle (`40ms + order*95ms`, `840ms`/`520ms` easing), continuous drift once settled (exact amplitude/period/phase formulas, desktop and mobile constants kept separate).
- Front-end-to-system: exact scroll-progress formula (`p`, `lp` per layer), dot glow at `lp>0.5`, monospace code block on step 04.
- Mobile: one continuous scroll, sticky jump-nav with 5 anchors and active-pill tracking, horizontal snap filmstrips (188–196px anchor → 152→116px, `scroll-snap-align:center`, momentum scrolling), section entrance easing (`opacity 640ms / transform 760ms` from `translate3d(0,18px,0)`).
- Reduced motion: ambient keyframes off, no drift/breathing, glows pinned to base opacity, screens rendered settled, `scroll-behavior:auto` — all-or-nothing, checked once at mount.
- Fail-safe reveal: force-reveal on 1.2s timeout if unsettled, on tab hidden, on `beforeprint`; render already-settled by default philosophy where practical so SSR/first-paint never shows a blank state.
- All copy in the DOM verbatim from the handoff; placeholder flags (Customer B2B "in development", Cartify "Demo project", recommendation quotes) kept exactly as flagged, never resolved.
- Keyboard focus: `2px solid #E8D2A6` ring, 3px offset, dark halo, visible over the glow, on every link/button/nav item/filmstrip item.

## Performance & accessibility constraints (section 8)
Single shared rAF loop; `transform`/`opacity` only for all scroll-tied and drift motion; blur-free glow gradients; 60fps target on throttled mobile CPU; `prefers-reduced-motion` fully honored; visible focus everywhere; no blank states on SSR/backgrounded-tab/print; text contrast ≥4.5:1 (3:1 display) including on lit ground.

## Acceptance criteria
- `npm run build` succeeds with no type errors.
- `npm run lint` passes.
- Every section from the desktop scroll order (README "Screens / views") is present, in order, with verbatim copy.
- At any scroll position, on desktop, the page is visually indistinguishable from `Horizon - Desktop.dc.html` (side-by-side check).
- At ≤430px width, the page matches `Horizon - Mobile.dc.html`'s structure and motion.
- With `prefers-reduced-motion: reduce`, no element is mid-animation or hidden; page is fully static and legible.
- No console errors; no layout shift from missing image dimensions.

## Checks to run (section 10 — I will run and report real output, not assume)
1. `npm run build` (type check + production build).
2. `npm run lint`.
3. Manual: toggle `prefers-reduced-motion: reduce` in dev tools, scroll the full page, confirm every animated layer (ambient, glow, collages, stack dots) is static/settled.
4. Manual: resize to 375px/430px width, confirm jump-nav sticks, active pill updates on scroll, filmstrips snap-scroll horizontally with visible momentum.
5. Manual: Chrome dev tools CPU throttle (4x–6x slowdown), scroll through a product section + the hero, watch the Performance panel / FPS meter for dropped frames during collage drift and glow movement.
6. Manual: keyboard-only pass (Tab through nav, jump-nav, all links/buttons/filmstrip items), confirm the gold focus ring is visible at every stop, including over the glow's brightest sections.
7. Manual: `Cmd+P` print preview and a backgrounded-tab check (switch tabs mid-entrance-animation, switch back), confirm nothing is stuck blank or mid-transition.

## Manual test steps (detailed, for after approval)
1. `npm run dev`, open `http://localhost:3000`.
2. Scroll top to bottom once at normal speed on a desktop-width window (≥1440px): watch for the hero collage settling in on load, the proof bar (static, no glow), track-record cards, the ISDS connective stat moment, each of the four ISDS product sections plus Fitnex and Cartify (glow brightness should visibly step down per the weight table), the front-end-to-system timeline (dots should light up in sequence as you scroll), recommendations (placeholder-flagged), contact.
3. Resize the window down through 1000px → 880px → 700px and confirm the collage fan collapses to the compact snap-row layout in the 700–1000px band, then to the dedicated mobile layout below ~700px (jump-nav appears, filmstrips replace fans).
4. Open dev tools → Rendering → emulate `prefers-reduced-motion: reduce`, reload, re-scroll: ambient sheets should hold still, glows should sit at flat base opacity with no scroll-linked movement, all screens already fully visible/settled.
5. Dev tools → Performance → CPU 6x slowdown, record while scrolling through Fitnex (densest collage) — check for frame drops in the recording.
6. Tab through the whole page with keyboard only, confirm visible focus rings throughout, including inside the mobile filmstrip and jump-nav.
7. `Cmd+P` (or dev tools print emulation) — page should render fully visible, no blank sections.
8. Switch to another browser tab mid-load, wait a couple seconds, switch back — nothing should be stuck invisible.

---

Is this good to execute?
