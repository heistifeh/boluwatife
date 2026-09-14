# Section-by-section behaviour

Companion to `README.md`. The README says what things look like; this says **what every section does** — at rest, on load, as it enters view, while it sits in view, and on interaction. `design/motion-reference.js` is the working implementation of all of it: port that file, then use this document to confirm each section behaves correctly.

A shared rule first, because it applies everywhere:

- **Two motion layers, always both present.** (1) The ambient gold gradient drifts behind the entire site forever, independent of scroll. (2) Each section's own glow responds to scroll position *and* carries a slow independent breath. They never write the same property on the same element: ambient touches `transform` only on its two fixed sheets; section glows touch `transform` and `opacity` on their own wrapper.
- **Nothing in view is ever frozen.** Any collage on screen keeps drifting for as long as someone lingers. If a section looks like a static screenshot arrangement, it is wrong.
- **Nothing else moves.** No hover lifts, no card tilts, no decorative loops competing with the glow. Links change underline colour; focus rings appear. That's it.
- **Off-screen means untouched.** Drift and glow updates only run for elements an IntersectionObserver has marked in view.
- **Reduced motion** holds the ambient sheets still, drops all drift, breathing and scroll drift, and renders every collage settled at full opacity. The still page must look finished, not broken.

---

## 1. Fixed top nav (desktop)

**At rest:** translucent `rgba(11,10,9,0.72)` bar with `backdrop-filter: blur(16px)` and a gold-alpha bottom hairline, pinned for the whole scroll. Name at left; Work / How he builds / Contact; an "Available" row with a gold dot carrying a soft gold halo.

**Behaviour:** no scroll-driven change — it does not shrink, hide or re-colour. Anchor links scroll smoothly to their sections. The gold dot is static (a pulsing dot would compete with the glow layers).

**On mobile** this is replaced by the sticky jump-nav (§11).

---

## 2. Hero

**Composition order is deliberate:** the collage sits **above** the headline, and the type overlaps up into it by a few pixels. The screens pass *behind* the name — headline `z-index:8`, screen frames top out at 6 — so the name is never occluded, but the two read as one composition rather than two stacked blocks.

**Glow:** the strongest arc on the page after Fitnex (weight 1.15), top-anchored so its bright core sits behind the collage and **ends above the headline** (`top:-8%; height:54%`). This placement is load-bearing: if the core reaches the subhead and stat line, that copy loses contrast and the section fails. Whenever you retune glow strength, re-check contrast on "Mobile App Developer" and the stat line first.

**On load:** each screen animates in from `opacity:0`, 34px down, `scale(0.96)` to rest — `transform 840ms cubic-bezier(0.16,0.72,0.24,1)`, `opacity 520ms ease-out` — staggered `40ms + order × 95ms`, anchor first, supporting screens following. Pieces settling into light, not bouncing. The type does not animate; it is there from the first paint.

**While in view:** every screen drifts continuously, each at its own amplitude, period and phase, deeper (higher `data-order`) screens travelling further and slower. Simultaneously the glow breathes — a slow sine on position, scale and opacity — and drifts with scroll (rising as the section's centre passes the viewport centre).

**Stat line:** static text. Numbers in gold with tabular figures so they don't shift width.

---

## 3. Proof bar

**The one section that drops the staging entirely.** Its job is to be scanned, not admired: no glow layer, no collage, no entrance animation, no drift. Content is there at full contrast immediately.

**At rest:** a vertically-fading `#100E0C` band with gold-alpha hairlines top and bottom. Three columns: ISDS (three App Store chips plus a dashed "Customer B2B, coming soon"), Fitnex (link), Cartify (link).

**Interaction:** chips and links are real links; hover changes the underline/border warmth only. Nothing lifts.

---

## 4. Track record

**Glow:** weight 0.42 — a wide, low, quiet arc behind the heading and cards. Bottom-anchored, so the brightest zone sits under the cards rather than through the text.

**Cards:** four elevated dark cards, each with a gold inset top edge — read that edge as light falling on the card from the section's glow, which is why it must be brighter than the card's border. They do **not** animate in, do not lift on hover, and carry no icons.

**While in view:** the glow breathes and drifts with scroll. The cards are still. Metrics (20%+, 50+, 200+) are gold, tabular, static.

---

## 5. ISDS connective moment

**Purpose:** introduce the suite before its four entries, so the four ISDS sections read as one platform rather than four unrelated apps.

**Glow:** weight 0.50, tinted ISDS amber (`#EAD08A`) — a single ellipse, no rim layer. Deliberately weaker than any of the four product moments that follow.

**Behaviour:** no collage, so no settle or drift; the glow breathes and scroll-drifts. The suite-wide metric (20%+ overhead cut, platform-wide) sits here — large, tabular, gold — because it belongs to the platform, not to any one app.

---

## 6. The four ISDS moments — Customer, Vendors, Driver, Customer B2B

All four behave identically; only glow weight and collage density differ (Customer 0.85, Vendors and Driver 0.80, B2B 0.62). That descending weight is the honest hierarchy — Customer is the flagship, B2B is unreleased.

**Structure, top to bottom:** eyebrow in the ISDS tint → display-scale product name → one problem-framed line → the staged collage → a tinted hairline → a large claim line → compact stack line → primary action (and for B2B, no store button, because it isn't shipped).

**Glow:** bottom-anchored, ISDS amber core over a bronze haze resolving to ink. Every ISDS section shares the same tint so the four feel like one platform seen under one light.

**On entering view:** the collage settles with the same 840ms depth-staggered easing as the hero. The text does not animate.

**While in view:** continuous drift across all 4–6 screens, anchor moving least, outermost screens moving most and slowest; glow breathing and scroll-drifting underneath.

**B2B specifics:** carries an "In development" pill, a dashed placeholder frame at the correct 9:19 ratio wherever a real screenshot is missing, and no store link. Placeholders settle and drift exactly like real screens — they are part of the composition, not a gap in it.

**Interaction:** the primary pill is the store link; the stack line is plain text. No hover motion on the screens themselves.

---

## 7. Fitnex

**The heaviest moment on the page** (glow weight 1.30 — stronger than the hero) because it is the best "trust me alone with a project" evidence. Weight here means a bigger glow and a denser, larger collage, never more text.

**Glow:** copper-gold tint (`#E7B188`), three layers including the cream rim — warmer and more saturated than ISDS, still unmistakably the same family.

**Structure:** eyebrow → "Fitnex" at the largest display size on the page → the promise line → the 200+ metric set very large next to a short qualifier → the six-screen collage → hairline → build narrative → stack line → the live-site CTA.

**Behaviour:** settle and drift as elsewhere, but with the widest spread of amplitudes because it has the most screens — the outermost pair should be visibly slower and further-travelling than the anchor.

---

## 8. Cartify

**Deliberately modest** (glow weight 0.40, three screens, a smaller stage, side-by-side text and collage rather than full-width staging). The staging itself communicates that this is a demo, so the copy never has to apologise for it.

**Glow:** champagne-silver-gold tint (`#E8E5BB`) — the coolest and lightest of the set, and the clearest signal that you are in a different project.

**Behaviour:** "Demo project" pill, two secondary pills (live demo, GitHub source), no primary gold CTA. Settle and drift run as normal but at smaller amplitude because the screens are smaller.

---

## 9. Front end to system

**The one section where the glow becomes functional rather than atmospheric.** Its own glow is the weakest on the page (0.36) precisely so the sequence reads.

**At rest:** a five-step timeline — screen → component → state → API → database — on a thin vertical rail with a warm gradient that fades out at both ends. Step 04 carries a monospace code block (gold ink on the raised surface).

**As it scrolls:** the layer nearest the viewport centre brightens to full opacity while the others sit at 0.4, and its dot lights gold with a glow ring; the highlight walks down the five steps as you scroll, then releases. Position is derived from scroll, so scrubbing back up reverses it exactly — no one-way triggers.

**Reduced motion:** all five layers render at full opacity with every dot lit; the sequence becomes a legible static diagram.

---

## 10. Recommendations and Contact

**Recommendations:** no glow, no collage, no motion. Glow-edge cards consistent with Track record. Cards stay visibly flagged "placeholder: real quotes to be supplied" until real quotes arrive — never invent a person or a quote. Lead with whichever real quote speaks to a delivered outcome.

**Contact:** one final glow (weight 0.70) — smaller and calmer than the hero, closing the rhythm the page has been repeating. Display headline, the gold CTA pill (the one element borrowed from the reference button style directly), availability, links, résumé, footer rule. The glow breathes and scroll-drifts; nothing else moves.

---

## 11. Mobile — one continuous scroll

Mobile is **not** a carousel and **not** tap-to-reveal. It is a single smooth vertical scroll through the same sections in the same order as desktop, in one column (max-width 430px, 20px gutters). Everything is reached by scrolling; nothing hides behind an interaction.

**Sticky jump-nav:** a pill bar (`Overview · ISDS · Fitnex · Cartify · Contact`) pinned at the top over a fading ink gradient. Active pill is solid light gold with dark ink; inactive pills are body-colour text. It is a shortcut, not a requirement — the page reads top to bottom without it.

**Section entrance:** each section eases in as it enters view (`opacity 640ms ease-out`, `transform 760ms` from 18px down) so one section never hard-cuts into the next. This is what makes the long scroll feel continuous rather than like a stack of slides.

**Collages become filmstrips:** a horizontal snap rail (`overflow-x:auto`, `scroll-snap-type: x proximity`, `scroll-snap-align: center`, hidden scrollbars, native momentum). The anchor screen comes first and largest (188–196px), then progressively smaller and dimmer. Keeps every screen large and legible without adding vertical length.

**Drift on mobile:** vertical only inside the rails — horizontal drift would fight the user's thumb. Amplitude is slightly reduced. The glow still breathes.

**Glow on mobile:** each section carries its own contained spotlight rather than one continuous arc down a very long page, so the effect stays special each time it appears. The ambient gradient underneath is the same continuous site-wide layer.

**Smoothness is the priority.** Momentum and inertia stay native — no scroll-jacking, no custom smooth-scroll library, no per-section mandatory snap on the vertical axis (proximity snap on the horizontal rails only). If a mechanic makes it feel less smooth, drop the mechanic.

---

## 12. Failure modes to check before you call it done

1. **A collage that stops moving.** Watch any section for 20 seconds without touching the scroll. If it freezes, the settle transition was not removed, or the drift loop is gated behind the scroll dirty-flag. Both are easy mistakes; both kill the effect.
2. **Copy sitting in the bright core.** Especially the hero subhead and stat line, and the claim/stack lines at the bottom of product sections. Check contrast against the glow's brightest breath state, not its dimmest.
3. **A blank page with no JS, no observers, or in print.** Entrance states start at opacity 0. Keep the fail-safe reveal (1.2s timeout, `visibilitychange`, `beforeprint`) or render revealed by default and only hide once an observer is attached.
4. **Jank on a mid-range phone.** Only `transform` and `opacity` should animate. No `filter: blur()` anywhere except the two fixed ambient sheets. No layout reads inside the frame loop.
5. **A section whose tint looks like a different website.** Pull it back toward the base gold. The tints are "a slightly different light in the room," never a different colour system, and never drift toward blue, green or purple.
6. **Evenly-spaced collages.** If the screens line up in a neat row, the depth and overlap that separate this from a wall-of-screenshots are gone.
