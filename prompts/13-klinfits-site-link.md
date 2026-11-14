# 13 — Make the live Klinfits shop easy to reach

## Goal

Tife's feedback: the Klinfits entry has a case study but no clear way to visit the live site, https://www.klinfits.shop/.

## What I found

- Home section: "Open klinfits.shop" is the **secondary** button, and `ProductSection.module.css` hides `.secondary` at ≤699px. On phones there is no shop link at all.
- Case study page: the only shop link is at the very bottom.
- Every link uses `https://klinfits.shop`, which returns a 308 redirect to `https://www.klinfits.shop/`.

## Changes

1. **Home section (`lib/content.ts`, `klinfits`):** the primary button becomes **Visit klinfits.shop** → `https://www.klinfits.shop/` (opens in a new tab), with the same coral-gold gradient. The secondary button becomes **Read the case study** → `/work/klinfits-ops-agent` (same tab). This matches the other projects, where the primary button opens the live product (App Store, fitnexonline.com).
2. **`ProductSection.tsx`:** the secondary link gets the same rule as the primary: links starting with `/` open in the same tab.
3. **`ProductSection.module.css`:** remove the mobile `display: none` on `.secondary`, so both buttons show on phones as full-width stacked pills (primary first). Klinfits is now the only section that uses `secondary` (every ISDS entry has `secondary: null`; Fitnex and Cartify have their own components), so no other section changes.
4. **Case study page:** add a **Visit klinfits.shop** button under the subtitle at the top, styled like the existing bottom CTA. Keep the bottom link, and point both at `https://www.klinfits.shop/`.
5. **Proof bar and `llms.txt`:** point the links at `https://www.klinfits.shop/` (the visible proof bar text stays "klinfits.shop").

## Checks

- Type check, lint, build.
- 1280px and 375px: the home section shows both buttons; the case study shows the shop button near the top.
- Every shop link resolves with a 200, not a redirect.
- Keyboard focus is visible on the new button.

## Release

Tife approved pushing to production when everything passes. Commit only these files plus this prompt on `main`, push to `origin/main`, and confirm the live site.

## Manual test steps

1. On a phone (or 375px), scroll to Klinfits: **Visit klinfits.shop** and **Read the case study** both show.
2. Tap Visit. It opens www.klinfits.shop in a new tab.
3. Open the case study. The Visit button is right under the subtitle.
