# Handoff: Horizon — Boluwatife "Tife" Osineye portfolio

## Overview
A single-page portfolio for **Boluwatife "Tife" Osineye**, Mobile App Developer (React Native, plus React / Next.js / Node), Lagos, Nigeria, remote. The audience is brand and business owners deciding whether to trust him with their product, alongside hiring managers and senior engineers.

The art direction is called **Horizon**: a near-black warm base, a slow continuously-animated champagne-gold ambient gradient behind everything, and a scroll-responsive warm glow sitting behind staged collages of real product screens. Every dramatic beat is attached to something true — a shipped app, a real number, a real outcome.

## About the design files
The files in `design/` are **design references written in HTML** — prototypes showing the intended look, layering and motion. They are not production code to copy line by line. The task is to **recreate these designs in the target codebase's environment** (Next.js/React is the natural fit here, and matches Tife's own stack) using its established patterns. If no codebase exists yet, build it fresh in Next.js (App Router) + TypeScript with plain CSS or CSS modules — the design needs no UI library.

Note on file format: the `.dc.html` files are self-contained prototypes with an inline `<style>` block, inline element styles and one script class at the bottom that owns all motion. Open them directly in a browser to see the real thing, including animation. Read the bottom `<script>` of each file for the exact motion implementation — it is the source of truth for timings and easing.

- `design/Horizon - Desktop.dc.html` — the full desktop scroll
- `design/Horizon - Mobile.dc.html` — the mobile design (its own structure, not a shrunk desktop)
- `design/Horizon - Spec.dc.html` — the design spec: tokens, glow construction, collage staging rules, type, motion
- `design/img/*.jpg` — the real product screenshots used in every collage (9:19 phone screens)

## Fidelity
**High fidelity.** Colours, type scale, spacing, layering, glow construction and motion timings are final. Recreate pixel-accurately. The one place to use judgement is breakpoints between the two supplied layouts (see Responsive behaviour).

---

## Design tokens

```css
:root {
  /* base */
  --ink:        #0B0A09;  /* page base, warm near-black */
  --raised:     #1C1815;  /* elevated surfaces, screen frames, nav pill */
  --card-top:   #201B15;  /* card gradient start */
  --card-bot:   #120F0C;  /* card gradient end */
  --edge:       #332C24;  /* hairlines, screen frame borders */
  --edge-lit:   #463C30;  /* border on an anchor screen frame */
  --edge-strong:#564A3A;  /* secondary button border, dashed placeholders */
  --dim:        #8A8177;  /* labels only, never on lit ground */
  --dim-lit:    #B3A99C;  /* labels that sit over the glow (stack lines) */
  --body:       #C7BDAF;  /* supporting paragraphs */
  --paper:      #ECE6DC;  /* primary text, warm off-white */

  /* signature gold */
  --gold-1:     #E8D2A6;  /* brightest point, metrics, eyebrows */
  --gold-2:     #B98F52;  /* deep bronze-gold, gradient far end */
  --gold-hot:   #F4E9D0;  /* rim highlight only */
  --gold-solid: #E0C495;  /* solid accents: available dot, active timeline dot */

  /* per-project tint — replaces --gold-1 as the brightest point only */
  --tint-isds:    #EAD08A;  /* rgb 234,208,138 — all four ISDS apps */
  --tint-fitnex:  #E7B188;  /* rgb 231,177,136 — copper, most energetic */
  --tint-cartify: #E8E5BB;  /* rgb 232,229,187 — champagne-silver, coolest */
  --tint-voltra:  #DF967C;  /* rgb 223,150,124 — bronze, concept work */

  /* CTA pill — the one element borrowed from the reference directly */
  --cta:        linear-gradient(180deg, #EFDDB6, #B98F52);
  --cta-ink:    #241B0E;
  --cta-shadow: 0 16px 44px rgba(226,200,156,0.40);
}
```

Per-project CTA top stops: ISDS `#F0E2B0`, Fitnex `#F0C6A6`, Cartify/Contact `#EFDDB6`; bottom stop is always `--gold-2`.

Rules that matter:
- No tint may drift toward blue, green or purple. The whole palette stays in the warm gold-to-bronze family.
- A project tint is the **brightest stop only**; the haze and outer edge always resolve back to `--gold-2` and `--ink`, so every section lands in the same base darkness.
- `--dim` (#8A8177) is for labels on unlit ground only. Anywhere copy sits over the glow, use `--dim-lit`, `--body` or `--paper`.

### Type
- Display: **Schibsted Grotesk** 600/700/800 (Google Fonts) — name, section headings, product names, metrics, claim lines.
- Body/UI: **Archivo** 400/500/600/700 (Google Fonts).
- `font-variant-numeric: tabular-nums` on the stat line and every metric.
- Letter-spacing tightens as size grows: −0.02em at 20px through −0.05em at display sizes; line-height 0.88–0.94 on display, 1.4–1.55 on body.
- Body line length stays under ~75 characters (`max-width` in `ch` on paragraphs).
- Desktop display sizes are fluid: `clamp(42px,7.4vw,112px)` for the hero name, `clamp(38px,6vw,92px)` for product names, `clamp(46px,8vw,124px)` for Fitnex, `clamp(30px,4.2vw,60px)` for section headings.

### Radii, shadows, spacing
- Screen frames: padding 3–6px, radius 14–30px (larger frames = larger radius), inner image radius = frame radius − 3px.
- Cards: radius 16px, `background: linear-gradient(180deg, var(--card-top), var(--card-bot))`, `border: 1px solid var(--edge)`, `box-shadow: inset 0 1px 0 rgba(<tint>,0.45), 0 30px 60px rgba(0,0,0,0.45)` — the inset top edge is "light falling on the card from the section glow."
- Pills: `border-radius: 999px`, 12–16px vertical padding, 20–32px horizontal.
- Section padding desktop: `clamp(48px,9vh,150px)` vertical, `clamp(18px,5vw,72px)` horizontal; content `max-width` 1080–1440px centred.
- Anchor-screen shadows go deeper than supporting ones: `0 48px 90px rgba(0,0,0,0.66)` vs `0 24px 48px rgba(0,0,0,0.6)`.

---

## The glow (the signature move)

Each section owns a glow wrapper: `position:absolute; inset:-12% 0; pointer-events:none; mix-blend-mode:screen`, containing 1–3 absolutely-positioned ellipses (`border-radius:50%`, `transform:translateX(-50%)`, pure CSS `radial-gradient(closest-side, …)` — **no `filter: blur()`**, no canvas; blur-free gradients are what keep this at 60fps).

Layers, back to front (alphas shown for a full-strength section; scale them by the section's weight):

```css
/* haze */  radial-gradient(closest-side, rgba(185,143,82,0.56), rgba(185,143,82,0.18) 54%, rgba(11,10,9,0) 78%)
/* core */  radial-gradient(closest-side, rgba(<tint>,0.74), rgba(<tint>,0.34) 44%, rgba(185,143,82,0.08) 70%, rgba(11,10,9,0) 85%)
/* rim  */  radial-gradient(closest-side, rgba(244,233,208,0.48), rgba(<tint>,0.14) 52%, rgba(11,10,9,0) 78%)
```

The wrapper carries `data-glow="<weight>"`, and the weight drives base opacity — this is the honest visual hierarchy:

| Section | weight |
|---|---|
| Fitnex | 1.30 |
| Hero | 1.15 |
| ISDS Customer | 0.85 |
| ISDS Vendors / Driver | 0.80 |
| Contact | 0.70 |
| ISDS Customer B2B | 0.62 |
| ISDS connective moment | 0.50 |
| Track record | 0.42 |
| Cartify | 0.40 |
| Front end to system | 0.36 |

Base opacity = `clamp(0, 1, weight × glowIntensity)` where `glowIntensity` defaults to 1 (it is a tunable knob in the prototype).

**Placement rule:** in product sections the ellipses are bottom-anchored (`bottom:-12%…-34%`), so the bright core sits behind and below the collage. In the hero, where the collage sits **above** the headline, the core is top-anchored and deliberately ends above the type (`top:-8%; height:54%`) — the bright zone must never cross the headline, subhead or stat line, or secondary copy loses contrast.

### Ambient base gradient (site-wide, scroll-independent)
One fixed layer behind all content:

```html
<div data-ambient style="position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; contain:strict">
  <div style="position:absolute; inset:-22%;
    background:linear-gradient(116deg, rgba(232,210,166,0) 16%, rgba(232,210,166,0.20) 33%, rgba(185,143,82,0.12) 46%, rgba(232,210,166,0) 62%);
    filter:blur(44px); mix-blend-mode:screen; animation:ambientA 42s ease-in-out infinite; will-change:transform"></div>
  <div style="position:absolute; inset:-28%;
    background:linear-gradient(94deg, rgba(185,143,82,0) 28%, rgba(185,143,82,0.15) 44%, rgba(232,210,166,0.10) 56%, rgba(185,143,82,0) 72%);
    filter:blur(64px); mix-blend-mode:screen; animation:ambientB 61s ease-in-out infinite; will-change:transform"></div>
</div>
```

```css
@keyframes ambientA { 0%{transform:translate3d(-7%,-5%,0) scale(1.06)} 50%{transform:translate3d(7%,5%,0) scale(1.20)} 100%{transform:translate3d(-7%,-5%,0) scale(1.06)} }
@keyframes ambientB { 0%{transform:translate3d(6%,4%,0) scale(1.14)}  50%{transform:translate3d(-6%,-4%,0) scale(1.02)} 100%{transform:translate3d(6%,4%,0) scale(1.14)} }
```

Page content sits at `z-index:1`. These two sheets are the **only** blurred elements in the design and the only thing that animates without scroll; because they live in one fixed `contain:strict` layer they composite once and never repaint per section.

---

## Screens / views — desktop scroll order

1. **Hero.** Collage first, then type. An 8-deep (currently 6) staged collage of real screens across all products sits above the headline, overlapping the type by a few pixels with the screens **behind** the name (headline `z-index:8`, screen frames top out at 6). Then: `Boluwatife Osineye` / `Mobile App Developer` (subhead in `--body` because it sits on lit ground) / `I turn business problems into products that ship.` / a tabular stat line separated by 1px vertical rules: `4 systems live · 200+ users on a solo build · 20%+ overhead reduction measured · 50+ developers mentored`, numbers in `--gold-1`.
2. **Proof bar.** The one band that drops the staging for pure legibility. Three columns: ISDS (three App Store chips + a dashed "Customer B2B, coming soon"), Fitnex (link to fitnexonline.com), Cartify (link to the Vercel demo). Background is a vertically-fading `#100E0C` with gold-alpha hairlines top and bottom.
3. **Track record.** "Four reasons this is a safe hire" + four elevated glow-edge cards: ships end to end / moved a real business number (20%+) / can run things (50+ mentored) / finishes alone (Fitnex, 200+ users).
4. **The work — six staged moments.** A connective "ISDS" moment (platform line + the suite-wide 20%+ metric), then ISDS Customer, Vendors, Driver, Customer B2B ("In development"), then Fitnex (largest glow and densest collage after the hero), then Cartify (deliberately smaller glow, fewer screens). Each moment: eyebrow in its tint, display-scale product name, one problem-framed line, the staged collage, a tinted hairline, a large claim line, a compact stack line, and primary/secondary pill actions.
5. **Front end to system.** Wallet funding traced screen → component → state → API → database as a 5-step timeline with a warm vertical gradient rail; the layer nearest the scroll centre brightens (opacity 0.4 → 1.0) and its dot lights gold with a glow ring, the others dim. Step 04 includes a monospace code block in `--gold-1` on `--raised`.
6. **Recommendations.** Glow-edge cards, currently flagged `placeholder: real quotes to be supplied` — **never invent quotes**. Each card: quote, name, title/company, relationship line in gold.
7. **Contact.** A smaller closing glow, display headline, the gold CTA pill (`Start a conversation` → mailto), availability, links (github.com/heistifeh · linkedin.com/in/boluwatifeosineye · boluwatifeosineye.com), résumé button, footer rule.

Fixed top nav: translucent `rgba(11,10,9,0.72)` + `backdrop-filter: blur(16px)`, name at left, Work / How he builds / Contact, and an "Available" indicator with a gold dot carrying a soft gold glow.

### Collage staging rules
A fan, not a grid. Inside a `position:relative` stage (height `clamp(280px,41vw,580px)` in the hero, `clamp(240px,38vw,520px)` in product sections), each screen is absolutely positioned by **percentage of stage width** with `left`, `bottom`, `width`, `transform: translateX(-50%) rotate(<±1–12>deg)`:

- One **anchor** screen: centre-ish, largest (18–19.5% of container width), `bottom:0`, brightest, `--edge-lit` border, deepest shadow, gold inset top edge.
- Supporting screens step outward: each one smaller, rotated further, raised higher off the baseline, dimmer (`filter: brightness(0.86 → 0.54) saturate(0.88 → 0.80)`) and lower in `z-index` (6 → 1).
- 4–6 screens per project (target 5; use a dashed placeholder frame at the correct 9:19 ratio where a real screenshot is missing).
- Never let it flatten into an evenly-spaced row — the staggering and overlap are the point.

Every screen carries `data-order` (0 = anchor) and `data-rot`, which the motion system reads.

---

## Interactions & behaviour (motion spec)

Everything below is implemented in the `<script>` at the bottom of each prototype; mirror the numbers exactly. All motion runs on **one shared `requestAnimationFrame` loop** that only touches `transform` and `opacity`.

1. **Ambient base gradient** — continuous, scroll-independent, as specced above (42s / 61s loops).
2. **Scroll-tied staging glow.** A scroll listener sets a dirty flag; on the next frame each in-view glow computes `q = clamp(((scrollMid − sectionTop) / sectionHeight − 0.5) × 2, −1, 1)` and `near = 1 − |q|`. Then, every frame (so it keeps breathing even when the page is still):
   ```js
   breath = sin(t*0.32 + weight*2.1)
   transform = translate3d(0, (-q*44 + breath*5)px, 0) scale(1 + near*0.07 + breath*0.012)
   opacity   = base * (0.7 + near*0.3) * (0.955 + breath*0.045)
   ```
   In-view tracking is an `IntersectionObserver` with `rootMargin: "25% 0px 25% 0px"`.
3. **Collage entrance (settle).** Each screen starts at `opacity:0`, `translate3d(0,34px,0) scale(0.96)` plus its base transform. On entering view (`IntersectionObserver`, `rootMargin:"0px 0px -4% 0px"`, threshold 0.02) it animates to rest with `transform 840ms cubic-bezier(0.16,0.72,0.24,1), opacity 520ms ease-out`, staggered by depth: `delay = 40ms + data-order × 95ms` (anchor first, supporting screens following). Not bouncy — pieces settling into light. The transition is removed once settled so the drift loop can take over.
4. **Continuous collage drift (never freezes).** While a stage is in view (`rootMargin:"12% 0px 12% 0px"`), every settled screen keeps moving, each at its own depth and pace:
   ```js
   depth  = 1 + data-order * 0.42          // outer, dimmer screens travel further
   ampY   = 2.1 * depth  (px)
   ampR   = 0.14 * depth (deg)
   period = 13s + data-order*2.6s + (index % 3)*1.7s
   phase  = (index * 1.37) mod 2π
   w      = 2π / period
   transform = <base translateX(-50%) rotate(data-rot deg)>
             + translate3d(0, ampY*sin(t*w + phase) px, 0)
             + rotate(ampR*sin(t*w*0.62 + phase*1.3) deg)
             + scale(1 + 0.0035*sin(t*w*0.48 + phase))
   ```
   Subtle and slow: "quietly alive," never busy. It must never look like a frozen screenshot arrangement.
5. **Front end to system.** Scroll-driven: `p = (scrollMid + vh*0.12 − sectionTop) / (sectionHeight*0.88)`; layer `i` gets `lp = clamp((p − i*0.13)/0.2, 0, 1)`, `opacity = 0.4 + lp*0.6`; when `lp > 0.5` the dot turns `--gold-solid` with `0 0 0 4px rgba(226,200,156,0.12), 0 0 20px rgba(226,200,156,0.6*lp)`.
6. **Everything else stays still.** No hover lifts, no decorative animation competing with the two glow layers. Links get a gold underline colour on hover; focus is a visible `2px solid #E8D2A6` ring with 3px offset and a dark halo so it never washes out against the glow.
7. **Reduced motion.** With `prefers-reduced-motion: reduce` (or the prototype's `stillMode` flag): ambient keyframes off (sheets hold their pose), no scroll drift or breathing, glows at base opacity, screens rendered settled, `scroll-behavior: auto`. The static version must still be beautiful.
8. **Fail-safe reveal.** Because entrance states start at `opacity:0`, the prototypes force-reveal everything if observers haven't fired within 1.2s, on `visibilitychange` to hidden, and on `beforeprint`. Keep an equivalent in production (or render revealed by default and only hide when an observer is actually attached) so a backgrounded tab, a screenshot service, SSR or print never yields a blank page.

---

## Mobile design (`Horizon - Mobile.dc.html`)
Mobile is **one smooth continuous vertical scroll**, same content and order as desktop in a single mobile-width column (max-width 430px, 20px gutters). Nothing requires a tap to reveal — no carousel, no tap-to-detail.

- **Sticky jump-nav.** A pill bar (`Overview · ISDS · Fitnex · Cartify · Contact`) pinned at the top over a fading ink gradient; active pill is `#EFDDB6` with `--cta-ink` text, inactive `--body`; the bar itself is `rgba(28,24,21,0.92)` + `blur(14px)` with a gold-alpha border. Anchors scroll smoothly to `#isds`, `#fitnex`, `#cartify`, `#contact`.
- **Hero** keeps the collage-above-name composition, scaled to 4 screens.
- **Each project's screens become a horizontal filmstrip**: `display:flex; gap:12px; overflow-x:auto; scroll-snap-type:x proximity`, anchor screen first at 188–196px wide, then progressively smaller and dimmer (152 → 116px), each `scroll-snap-align:center`, scrollbars hidden, native momentum (`-webkit-overflow-scrolling:touch`).
- **Sections ease in** on entering view (`opacity 640ms ease-out, transform 760ms cubic-bezier(0.16,0.72,0.24,1)`, from `translate3d(0,18px,0)`) — no hard cuts between sections.
- **The same continuous drift and glow breathing run on mobile**, with slightly smaller amplitudes (`ampY = 2.0 × depth`, glow travel `-q*26 + breath*4`).
- `overscroll-behavior-y: contain` on the body; each section carries its own contained glow on top of the shared ambient background.

### Responsive behaviour
The desktop prototype collapses its collages itself below 880px: stages become horizontal snap rails (`flex`, `gap:12px`, `scroll-snap-type:x mandatory`, screens at `flex:0 0 56%`, rotation and dimming dropped) and drift is disabled in that mode. In production, treat the mobile file as the definitive layout under ~700px, the desktop file above ~1000px, and interpolate between (single column, filmstrips, fluid type) in between.

---

## State management
No application state — this is a marketing page. What the implementation needs is scroll/viewport state only:

- One shared rAF loop plus a `dirty` flag set by `scroll`, `resize` and `load`.
- Cached geometry per section (`offsetTop`, `offsetHeight`), re-measured on `load` and `resize`.
- Three `IntersectionObserver`s: glow in-view, screen settle (self-unobserving), stage drift membership. Mobile adds a fourth for section entrance.
- `prefers-reduced-motion` read once at mount.
- Cleanup: cancel the rAF, clear the safety timeout, disconnect observers, remove listeners on unmount.
- Two tunables worth exposing: `glowIntensity` (0.5–1.4, default 1) and `stillMode` (boolean).

## Assets
- `design/img/*.jpg` — 35 real product screenshots (ISDS Customer, Vendors, Driver, Customer B2B, Fitnex, Cartify), already compressed for the web and displayed at `aspect-ratio: 9/19`, `object-fit: cover`, `object-position: top`. Ship them at ~520px wide; the originals were ~1206×2622 PNGs, which are the single biggest threat to smooth scrolling. Give the hero's anchor screens `loading="eager"` and lazy-load the rest.
- Fonts: Schibsted Grotesk + Archivo from Google Fonts (`preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`).
- No icon set, no illustrations, no SVG decoration by design.

## Content rules
- The three numbers are confirmed and may be stated unhedged: 20%+ delivery overhead cut at ISDS (platform-wide), 200+ active users on Fitnex (solo build), 50+ developers mentored. Nothing else may be invented.
- Customer B2B is **in development** and must stay labelled that way; Cartify is a **demo project**. Do not pad either to match the weight of the live apps.
- Recommendation cards stay visibly placeholder-flagged until real quotes are supplied.
- House style: no em dashes as separators (use colons, commas or full stops), no "Book a Demo" SaaS-marketing language, no all-caps tracked-out labels, no arrow-suffixed links, no emoji.

## Quality floor
- 60fps on a mid-range phone. Only `transform` and `opacity` animate; glows are blur-free gradients; the two ambient sheets are the only blurred layer and live in one fixed `contain:strict` compositing layer.
- `prefers-reduced-motion` fully honoured.
- All copy present in the DOM — nothing painted only in canvas.
- Visible keyboard focus throughout, checked against the glow's brightest states.
- Text contrast ≥ 4.5:1 (3:1 for display-scale type) **including where copy sits on lit ground** — this is the failure mode to watch when tuning glow strength.

## Files
- `design/Horizon - Desktop.dc.html`
- `design/Horizon - Mobile.dc.html`
- `design/Horizon - Spec.dc.html`
- `design/support.js` (prototype runtime; not for production)
- `design/img/` (35 product screenshots)
