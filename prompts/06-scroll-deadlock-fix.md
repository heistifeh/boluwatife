# 04 — Fix: page cannot be scrolled past the hero

## Goal
Restore normal user scrolling (mouse wheel, trackpad, touch drag, keyboard) on the
whole page. Today the page is stuck at the hero: only programmatic `scrollTo()`
moves it, so every section below the hero is unreachable by a real user.

## Diagnosis (measured, not guessed)
Reproduced in headless Chromium against `next dev` on both a 1440×900 desktop
viewport and an iPhone 13 profile:

- `document.documentElement.scrollHeight` is 9479 (desktop) / 8199 (mobile) against
  a ~900 / ~664px viewport, so the content height is correct — nothing is collapsed.
- `window.scrollTo(0, 5000)` works and lands at 5000.
- `mouse.wheel(0, 300)` ×10 and a CDP touch swipe from three different start points
  all leave `scrollY` at **0**.

Bisected by injecting single-property overrides on the live page:

| override | wheel scrollY |
|---|---|
| baseline | 0 |
| `html { overflow-x: visible }` | 1200 |
| `body { overflow-x: visible }` | 1200 |
| `html { height: auto }` | 0 |

The cause is in `app/globals.css:80-84`:

```css
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}
```

`overflow-x: hidden` on **both** the root element and `body` makes each of them a
scroll container. `html`'s non-`visible` overflow stops the usual propagation to the
viewport, and `body` — whose own box is already as tall as its content — becomes the
box that user input hit-tests into, and it has nothing to scroll. `document.scrollingElement`
is still `html`, which is why scripted scrolling keeps working while the user's wheel
and touch do nothing. `html { height: 100% }` is *not* implicated (see table above).

The horizontal overflow those rules were there to hide is real and intentional: the
ambient sheets and every `Glow` layer are deliberately wider than the viewport
(e.g. a glow layer at left `-462px`, right `1902px` at 1440 wide). They still need clipping.

## What I read
- `app/globals.css` (`html`/`body` block, `:root` tokens, reduced-motion block)
- `app/layout.tsx`, `app/page.tsx`
- `components/AmbientGradient.module.css`, `components/Glow.module.css`,
  `components/Collage.module.css`, `components/Nav.module.css`,
  `components/JumpNav.module.css`, `components/sections/Hero.module.css`
- `components/HorizonMotion.tsx` in full — ruled out as a cause: it never touches
  `overflow`, `touch-action`, or `preventDefault`, its scroll listener is passive,
  and the bug reproduces identically with JS-driven states settled.

## Change
`app/globals.css` only — one declaration:

```css
html,
body {
  max-width: 100vw;
  overflow-x: clip;   /* was: hidden */
}
```

`clip` clips the overflow exactly as `hidden` did but does **not** create a scroll
container, so the two elements can no longer deadlock, and it also removes the
programmatically-scrollable horizontal region `hidden` leaves behind. Baseline support
(Chrome 90+, Safari 16+, Firefox 81+) is comfortably inside this site's target.

No other file changes. No motion, token, layout, or copy changes.

## Files touched
- `app/globals.css`

## Requirements it must not break (AGENTS.md §7/§8)
- Single shared rAF loop, `transform`/`opacity` only — untouched.
- `prefers-reduced-motion` behaviour — untouched.
- Mobile sticky jump-nav must stay `position: sticky` (an `overflow: hidden` ancestor
  is a classic way to break sticky; `clip` does not).
- Mobile horizontal snap filmstrips must still pan horizontally.
- Visible keyboard focus, no SSR/backgrounded-tab/print blank states — untouched.
- No new horizontal scrollbar at any width.

## Acceptance criteria
Verified in-browser with the override applied, to be re-verified against the committed change:
- Desktop 1440×900: 14×400px wheel ticks reach `scrollY` 5600; `scrollX` stays 0;
  `scrollWidth === clientWidth`.
- iPhone 13: same wheel budget reaches 5600; `scrollX` stays 0; jump-nav computes `sticky`.
- All 12 sections reachable and reaching `opacity: 1` as they enter view.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Headless pass re-run on desktop + iPhone 13: wheel scroll, touch swipe, `scrollX`,
  horizontal-overflow check, jump-nav `position`.

## Manual test steps
1. `npm run dev`, open `http://localhost:3000` at desktop width. Scroll with wheel and
   trackpad from the hero all the way to the Contact section — no sticking point.
2. Press `End`, then `Home`, then Space/Shift-Space — all move the page.
3. Confirm no horizontal scrollbar at 1440px, 1024px, and 375px.
4. Device toolbar → iPhone 13. Drag-scroll with the pointer starting **on the hero
   collage**, on body copy, and on a filmstrip — vertical scroll works from all three;
   the filmstrip itself still pans horizontally under a horizontal drag.
5. Mobile: confirm the jump-nav still sticks to the top while scrolling, and that its
   pills scroll horizontally.
6. DevTools → Rendering → `prefers-reduced-motion: reduce`, reload: scroll still works
   end to end and every layer is static.
7. Keyboard-only pass: Tab through nav → CTAs → filmstrips → contact links; focus ring
   visible on each and the page auto-scrolls to follow focus.
8. Ctrl/Cmd-P print preview: all sections render in their settled state.
9. Switch to another tab for ~10s, come back: no blank or mid-entrance section.
