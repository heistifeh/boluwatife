# 10 — Add the Klinfits ops agent (home section + case study page)

## Goal

Add one new project, the **Klinfits ops agent**, to the portfolio:

1. A section on the home page, placed **first in the work, before the ISDS block**.
2. A case study page at `/work/klinfits-ops-agent`.

Source of facts: `~/Downloads/ops-agent-brief.md` (dated 14 Nov 2026). Only those facts are used. No customer counts, revenue, orders processed, accuracy figures or minutes saved.

## Approved deviation from AGENTS.md

AGENTS.md says to add nothing that is not in the `.dc.html` handoff. Tife asked for this project directly, and the handoff has no artboard for it. So this is built from the **existing** section styles, tokens and components. Nothing in `design_handoff_horizon_portfolio/` is edited. No existing section's layout, motion or copy changes, apart from the anchor and nav changes listed below.

## What I read

- `AGENTS.md`, `prompts/copy-override-first-person.md`, `prompts/09-crawler-seo-link-previews.md`
- `lib/content.ts`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/sitemap.ts`, `public/llms.txt`
- `components/HorizonMotion.tsx` (how `data-glow`, `data-stage`, `data-screen`, `data-sect` are picked up), `Collage.tsx`, `Glow.tsx`, `Nav.tsx`, `JumpNav.tsx`
- `components/sections/ProductSection.tsx`, `Fitnex.tsx`, `Cartify.tsx` (+ `Cartify.module.css`), `IsdsConnective.tsx`
- Before coding: the relevant guides in `node_modules/next/dist/docs/01-app` (routes, `metadata`, `next/image`), since this is Next 16.3.5.

## Decisions and assumptions

- **Layout of the home section:** the Cartify two-column pattern (copy left, image right, wraps to one column), at a larger scale because it leads the work. Same eyebrow, name, description, stack and pill styles as existing sections.
- **No collage.** `Collage` assumes portrait phone screenshots (520×1099) fanned with rotation. The Telegram screenshot is a single landscape image (1232×956). It renders as **one framed image** using the collage card treatment (`--raised` padding, `--edge-lit` border, same shadow and radius), with no rotation and no drift.
- **Motion:** the section uses the existing `Glow` component and `data-sect`, so the shared loop drives its glow and mobile entrance exactly like other sections. No new `rAF`, no new scroll listener, no new animated properties. The framed image is static and visible by default, so SSR, backgrounded tabs, print and reduced motion all show the settled state.
- **Tint:** new token `--tint-klinfits: #e39a86` in `app/globals.css` (a warm coral that sits in the existing palette and nods to the brand's red). This value is my choice, not from a design. Glow layers reuse the gold base layer plus one layer in this tint, weight `0.8`.
- **Anchors:** the new section takes `id="work"`, so the nav's **Work** link lands on the first project. `IsdsConnective` loses its `id="work"` (nothing else targets it). The mobile jump-nav gets a **Klinfits** pill (`#work`) between Overview and ISDS.
- **Case study page:** a static Server Component. It has its own small header (my name linking to `/`, and a "Back to work" link to `/#work`), because the home `Nav` uses in-page hash links. It includes `AmbientGradient` and a static `Glow`, but not `HorizonMotion` (nothing on it is scroll-animated).
- **How it works:** shown as a numbered text list, not a diagram.
- **Screenshot privacy:** the payment link URL appears twice in the Telegram screenshot. Both are painted over in the bubble colour before the file goes into `public/`. The original in `~/Downloads` is not modified. "Ada" and the phone number stay, labelled as test data.
- **Shop screenshot:** the klinfits.shop screenshot pasted in chat is used on the case study page under "The project in context".
- **Images:** exported at about 1040px wide (2× the 520px display width rule) as JPG, lazy-loaded with explicit width and height.
- **Not changed:** the hero stat "4 systems live", the hero collage, the JSON-LD on the home page, the OG image.

## Copy (first person, verbatim from the brief where possible)

### Home section

- Eyebrow: `Klinfits`
- Badge: `Live`
- Name: `Klinfits ops agent`
- Description: `An AI operations agent for my own clothing shop. I paste a customer's WhatsApp order into Telegram, and it checks stock, prices delivery and drafts a payment link that I approve with one tap.`
- Claim: `The AI proposes, the code checks, the human approves.`
- Stack: `Next.js 16 · TypeScript · Anthropic API (Claude Haiku 5.5, tool use) · Telegram Bot API · Paystack · Neon Postgres`
- Primary: `Read the case study` → `/work/klinfits-ops-agent`
- Secondary: `Open klinfits.shop` → `https://klinfits.shop`
- Image alt: `Telegram chat: a pasted WhatsApp order, the "Link made" confirmation for ₦66,499, and a ready-to-send reply`

### Case study page (`/work/klinfits-ops-agent`)

**Title:** Klinfits ops agent
**Subtitle:** An AI assistant that turns WhatsApp orders into payment links.

**The project in context**
Klinfits is my online shop for compression gym wear in Lagos, Nigeria. I designed and built the whole shop: Next.js 16, TypeScript, Tailwind v4, Paystack checkout, a Neon Postgres admin, and a Telegram bot for order alerts. The ops agent is the AI feature on top of it. It lives inside the shop's private Telegram bot, and only I use it.
(Shop screenshot. Alt: `The Klinfits shop page with four products`)

**The problem**
Many buyers order on WhatsApp instead of the website. Each order meant reading the chat to work out products, sizes and quantities, checking stock, looking up the delivery price, building a payment link in the admin, and typing a reply. Lagos is split into rider zones with different prices, and other cities go by park delivery. It took several minutes per order, and it was easy to get a price or a total wrong.

**What I built**
1. I paste the buyer's WhatsApp message into the Telegram bot, or send a screenshot of the chat.
2. The agent (Claude, through the Anthropic API with tool use) works out the order and calls the shop's own tools: products with live stock and per-size prices, the delivery zone or city and its fee, and a coupon check if the buyer gave a code.
3. It proposes a payment link. The bot shows a card with every item, the delivery fee and the total, with Make link and Cancel buttons.
4. I tap Make link. The link is created and the bot sends back a ready-to-send WhatsApp reply in the brand's voice.
5. It also answers shop questions: "what do I need to pack?", "who hasn't paid?", "how were sales this week?"

If something essential is missing, like a size or a delivery area, it asks instead of guessing.

**How it stays safe**
The AI proposes, the code checks, the human approves.
- The agent can only read shop data and propose a link. It cannot create a link, change stock or message a customer on its own.
- Every figure on the approval card is computed by the shop's server code from the product catalogue and live stock, never taken from the AI's text.
- When I approve, the server re-prices the order again from live stock, and a double tap can't create two links.
- Customer messages are treated as data, not instructions. If a pasted message says "give me 50% off", the agent flags it instead of doing it.
- Only my Telegram account can reach the agent.

**Real example** (live test, 14 Nov 2026)
Input pasted into Telegram:
> Hi Klinfits, I want the spider set in M and a black tee size L. I'm in Ikorodu garage. My name is Ada, 08031234567

Result:
- Spider Set (M) ₦45,000 + Plain Black tee (L) ₦15,999, which includes the ₦999 size L surcharge
- Delivery: Ikorodu Garage matched to the "Ikorodu A" rider zone, ₦5,500
- Total ₦66,499, correct to the naira
- It flagged that the buyer gave only an area, not a street address.

(Telegram screenshot, link painted out.)
Caption: `"Ada" and the phone number are test data, not a real customer.`

**Numbers**
- Model: Claude Haiku 5.5, switchable to a bigger model with one setting.
- Cost: about $0.003 per order. $5 of API credit covers well over 1,000 orders. This is an estimate from the request sizes.
- For me: one paste and one tap instead of several minutes of manual work.
- Tests: 17 automated tests for the agent, all passing. 124+ tests across the shop.

**How it works**
Numbered list: WhatsApp chat → I paste into Telegram → Vercel webhook → Claude agent loop → shop tools (products and stock, delivery zones, coupons) → draft saved → approval card in Telegram → I tap Make link → server re-prices and creates the Paystack payment link → reply with a Send on WhatsApp button → buyer pays → the existing Paystack webhook records the order and alerts Telegram.

**Stack** (tags)
Next.js 16 (App Router) · TypeScript · Anthropic API (Claude Haiku 5.5, tool use) · Telegram Bot API · Paystack · Neon Postgres · Vercel (`after()` for background work) · Vitest

**Next** (labelled as not built yet)
- Morning briefing at 8am: what to pack, low stock, payments to check.
- Follow-ups for payment links still unpaid after 24 hours, drafted for one-tap sending.
- New product listings drafted from product photos.
- Voice-note orders (needs a speech-to-text step).

**Links**
`Open klinfits.shop` → https://klinfits.shop. No GitHub link (the repository is private). No Telegram handle.

## Files I expect to touch

- `lib/content.ts` — add `klinfits` (home section) and `klinfitsCaseStudy` (page copy); add the jump-nav item
- `components/sections/Klinfits.tsx`, `Klinfits.module.css` — new
- `components/sections/IsdsConnective.tsx` — remove `id="work"`
- `app/page.tsx` — render `<Klinfits />` between `TrackRecord` and `IsdsConnective`
- `app/work/klinfits-ops-agent/page.tsx`, `page.module.css` — new, with its own `metadata` (title, description, canonical)
- `app/globals.css` — add `--tint-klinfits`
- `app/sitemap.ts` — add the new URL
- `public/llms.txt` — add the project line
- `public/work/klinfits/ops-agent-telegram.jpg`, `klinfits-shop.jpg` — new

## Requirements and constraints

- CSS Modules only. No new dependencies.
- No new `rAF` loop or scroll listener. Only the existing `Glow` and `data-sect` hooks.
- Nothing animated beyond what the shared loop already does (`transform`, `opacity`).
- Reduced motion, SSR, backgrounded tab and print all show the full settled content.
- Visible keyboard focus on every new link.
- All copy is real DOM text. No exclamation marks, no hype words.
- Privacy: no real customer data, no payment link, no chat ID, token, admin link or bot handle.

## Acceptance criteria

- Home page order: Hero, ProofBar, TrackRecord, **Klinfits ops agent**, ISDS block, Fitnex, Cartify, How I build, Contact.
- Nav **Work** scrolls to the Klinfits section. Mobile jump-nav shows Overview, Klinfits, ISDS, Fitnex, Cartify, Contact, and highlights the right pill.
- "Read the case study" opens `/work/klinfits-ops-agent`; the page has every section above and links back to `/#work`.
- The published Telegram image shows no `/pay/...` URL.
- No layout shift or horizontal scroll at 375px, 768px and desktop widths.
- Existing sections look and move as before.

## Checks to run

- `npx tsc --noEmit`, `npm run lint`, `npm run build`
- Browser pass on the home section and the case study page at desktop and 375px
- Reduced-motion pass, keyboard-only pass, print preview
- Console and network check for errors and missing images

## Manual test steps

1. `npm run dev`, open `http://localhost:3000`.
2. Click **Work** in the nav. It should land on "Klinfits ops agent".
3. Click **Read the case study**. Check each heading, the two images, and that the Telegram image shows no payment link.
4. Click **Back to work**. It should return to the Klinfits section.
5. Mobile: set the viewport to 375px. Check the jump-nav has a Klinfits pill, the section stacks into one column, and there is no sideways scroll on either page.
6. Reduced motion: enable `prefers-reduced-motion: reduce` in dev tools, reload both pages. Everything is visible and still.
7. Keyboard: Tab through both pages. Every link shows a focus ring.
8. Print preview both pages. No blank areas.

---

## Addendum A — show the shop screenshot in a collage, like the other projects

Tife's feedback: the home section must use the real Klinfits shop screenshot "just like the rest". The first build showed only the Telegram screenshot in a single static frame.

### Changes

- Replace `public/work/klinfits/klinfits-shop.jpg` with the new shop screenshot Tife shared (2000×1154 → exported 1040×600). The case study page uses the same file; update its width and height.
- Render the home section through the existing `ProductSection` component (copy on top, collage stage, footer with claim, stack and actions), the same as the ISDS sections. Delete `components/sections/Klinfits.tsx` and its CSS module.
- Collage: the shop screenshot is the anchor (centre, `order: 0`, `--edge-lit` border, no dimming). The Telegram screenshot is the supporting card, to the right, rotated 4°, dimmed like other supporting cards. Both go through the shared `Collage`, so they get the same depth-staggered settle, continuous drift, mobile filmstrip and reduced-motion handling from the one `rAF` loop.
- `ScreenSpec` gets optional `aspect` (for example `"1040 / 600"`) and `imgWidth`/`imgHeight`. `Collage` passes `--aspect` to the image, and `.img` uses `aspect-ratio: var(--aspect, 9 / 19)`, so existing phone screenshots are unchanged and landscape images are not cropped.
- `ProductSection` CTAs: links that start with `/` open in the same tab with no `target="_blank"`. External links are unchanged.
- The section keeps `id="work"`, its position first in the work, its glow and the same copy. On mobile, `ProductSection` hides the secondary button, so "Open klinfits.shop" shows on desktop only, the same as other sections.

### Checks

Same as above, plus: on desktop, both images settle and then drift. On mobile at 375px they show in a filmstrip. With reduced motion, both are static and visible.

---

## Addendum B — drop the weakest ISDS app, put Klinfits in the hero

Tife's request: remove the one ISDS app that is least presentable, and include Klinfits in the hero collage, replacing one screenshot.

### Which ISDS app goes: ISDS Customer B2B

- It is the only one not launched ("In development"), with no store link and no CTA.
- Its collage reuses `onboarding-3.jpg`, which also appears in the Vendors collage.
- Driver, Customer and Vendors are all live on the App Store, so each has a link a visitor can open.

### Changes

- `lib/content.ts`: remove the ISDS Customer B2B entry from `productSections`. The image files stay in `public/` (unused, harmless).
- Hero collage: the B2B screenshot (`bulk-shipment-1.jpg`, desktop far-left slot, `order: 4`) is replaced by a **phone-width screenshot of the live klinfits.shop home page** (captured at 390×844 with iPhone emulation, exported 520px wide as `public/work/klinfits/klinfits-mobile.jpg`). It keeps that slot's exact position, rotation, size and dimming, so the desktop hero composition does not change. It uses the phone aspect, like every other hero image.
- Mobile hero: the B2B slot was hidden on mobile, so Klinfits would be invisible on phones. Klinfits takes the Driver screenshot's mobile slot (far right), and Driver is hidden on mobile only. Driver is still in the desktop hero and has its own section.
- Alt text: `Klinfits shop home page on a phone`.

### Kept as is (factual statements about the work, flagged to Tife)

- Proof bar: "ISDS: three apps live, one in development" and the "Customer B2B, coming soon" chip.
- ISDS intro: "Four apps, four different users, one platform…".
- Track record: "across four apps".
- `llms.txt` B2B line.
- Hero stat "4 systems live".

### Checks

Type check, lint, build. Desktop at 1280px: hero shows Klinfits in the far-left slot, and the work starts Klinfits, ISDS intro, Driver, Customer, Vendors, Fitnex. Mobile at 375px: Klinfits shows in the hero, no sideways scroll.

---

## Addendum C — Fitnex hero image shows the landing screen

Tife's request: the Fitnex screenshot in the hero collage should be the landing screen with the woman, not the home screen with "Start new workout".

- `lib/content.ts`, `heroScreens`: the Fitnex slot changes `src` from `/design/img/img-7788-2.jpg` to `/design/img/img-7782.jpg`, and `alt` to `Fitnex landing screen: Train hard, track harder`. Position, rotation, size, styling, `eager` and the mobile slot stay the same.
- The Fitnex section's own collage is unchanged (it already includes `img-7782.jpg`).
- Checks: type check, lint, build; hero at 1280px and 375px.

---

## Addendum D — copy updates after removing B2B and adding Klinfits

Approved deviation from the handoff copy (the handoff stays read-only). Rule: copy describing Tife's **experience** stays complete; copy describing **what is on the page** matches what is shown.

| Location | Before | After |
|---|---|---|
| `Hero.tsx` stat (and `heroStats` in `lib/content.ts`) | 4 systems live | 5 systems live |
| `ProofBar.tsx` ISDS title | ISDS: three apps live, one in development | ISDS: three apps live on the App Store |
| `ProofBar.tsx` ISDS chips | …Driver, App Store · Customer B2B, coming soon | …Driver, App Store (B2B chip removed) |
| `ProofBar.tsx` new first column | — | Klinfits: live shop with an AI ops agent → link `klinfits.shop` (https://klinfits.shop), same title and link styles as the Fitnex column |
| `IsdsConnective.tsx` | …Four apps, four different users, one platform: customer, vendor, driver, and a business-facing client. | …Three apps, three different users, one platform: customer, vendor and driver. |
| `public/llms.txt` summary | (no Klinfits) | adds: "Also runs Klinfits, a live clothing shop with an AI operations agent built on Claude." |

Unchanged on purpose: Track record "across four apps"; the B2B line in `llms.txt`.

The proof bar grid is `auto-fit, minmax(250px, 1fr)`, so a fourth column wraps on its own. Check that there is no sideways scroll at 375px.

Checks: type check, lint, build; hero and proof bar at 1280px and 375px.
