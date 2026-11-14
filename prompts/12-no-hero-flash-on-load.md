# 12 — The top of the page never disappears on load

## Goal

Tife's feedback: the header area "disappears and appears" and takes too long, so it looks like lag. Content that is on screen when the page opens must stay visible from first paint, with no hide-and-fade.

## What I measured (production build, 4× CPU slowdown, 4G network, cache off)

Hero opacity sampled every frame from first paint:

- **Phone (390px):** hero visible at 0.75s → **blank at 1.35s** (the motion script arms the mobile section entrance and sets the already-visible hero to opacity 0) → fades back, fully visible at **2.3s**. The hero screenshots do the same.
- **Desktop (1440px):** hero text visible at 0.73s, but the **hero screenshots are invisible until 1.3s** (CSS starts every collage screen at opacity 0 until JS runs), fully visible at **2.26s**.

## What I read

`components/HorizonMotion.tsx` (entrance setup, `settle`, section entrance `armSections`, fail-safe `reveal`, drift loop), `components/Collage.module.css`, `components/sections/Hero.tsx`.

## Approved deviation from the handoff

The handoff's entrance (settle from 34px below at opacity 0; mobile section fade-in) stays for content **below the fold**, which is revealed as you scroll to it. Content **already in view at load** skips the entrance. This is a deliberate change from the reference script, made at Tife's request.

## Changes

1. **`Collage.module.css`:** the hero collage (`[data-variant="fan"]`, used only by the hero) is `opacity: 1` at every width, not only on mobile. Its screenshots are visible from the first paint, before any JS. Other collages (`rail`) keep starting at opacity 0 and settle when scrolled into view.
2. **`HorizonMotion.tsx`, screens:** a screen that is in the viewport when the script starts is marked settled straight away. It is never set to opacity 0 and never moved down. Screens below the fold keep the existing settle entrance unchanged.
3. **`HorizonMotion.tsx`, mobile sections:** when the mobile section entrance is armed, sections already in the viewport are marked entered and left visible. Only sections below the fold are hidden and fade in on scroll, as now.
4. **`HorizonMotion.tsx`, drift start:** each screen records when it first starts drifting, and its drift amplitude eases from 0 to full over 1.2s (ease-out). Without this, a screen that skips its entrance would jump up to ~6px on the first frame. Screens that came through the settle entrance get the same ease, which is invisible after their 840ms settle.
5. Nothing else changes: same single `rAF` loop, still only `transform` and `opacity`. Reduced motion, the fail-safe reveal, print and backgrounded tabs work as before.

## Acceptance criteria

- Phone and desktop, same throttled load: the hero text and screenshots never drop below opacity 1 after first paint.
- No visible jump when the drift starts.
- Below-the-fold collages still settle in when scrolled to; mobile sections below the fold still fade in.
- Landing on `/#work` directly: the Klinfits section is visible straight away.
- Scroll frame rates unchanged from the last perf pass (60fps, no long tasks).
- Reduced motion: everything visible and still.

## Checks

Type check, lint, build. Re-run the frame-by-frame load recording (phone and desktop), the scroll frame-time pass, and the reduced-motion check.

## Release (approved by Tife: "when you're sure everything is good, push to production")

After every check passes, commit this session's work on `main` and push to `origin/main`. Include:

- the Klinfits section, the case study page and `public/work/`
- the B2B removal, the hero swaps, the copy changes and the job title
- this fix
- prompts 10–12

Do **not** include `.claude/`, `favicon asset/` or `prompts/08-…` (not part of this work). Then confirm the production deploy at boluwatifeosineye.com.

## Manual test steps

1. Open the site on a phone or at 375px with "Fast 4G" and "4× CPU slowdown" in DevTools, then hard-reload. The top never blinks out.
2. Do the same at desktop width. The hero screenshots are there from the start and start drifting gently.
3. Scroll down. ISDS, Fitnex and Cartify screenshots still settle in as you reach them.
4. Reduced motion on, reload. Everything is visible and still.
