# 09 — Crawler, SEO & link-preview fixes

(Your spec, filed as "04", saved here as 09 because prompts/ already runs to 08.)

## Goal
Make boluwatifeosineye.com fully readable and well presented for search engines (Googlebot,
Bingbot), AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) and link-preview bots
(LinkedInBot, Twitterbot, facebookexternalhit/WhatsApp, Slackbot). Change nothing visually,
apart from the one copy fix in task 7c.

## What I read
- AGENTS.md; Next 16 docs in `node_modules/next/dist/docs/` for `opengraph-image`, `robots`,
  `sitemap`, `ImageResponse`, and `redirects` (`has` host matcher).
- `app/layout.tsx`: metadata is only `title` + `description`, and there's no `metadataBase`.
- `app/page.tsx`: a server component that renders the sections.
- `components/sections/Hero.tsx` and `Hero.module.css`: the H1 has no whitespace before
  `<span class=subhead>`, and both stats have `dOnly`/`mOnly` duplicates, which are toggled with `display:none`.
  `grep dOnly|mOnly` finds these only in Hero.
- `lib/content.ts:232`: the `trackRecordBlock.body` ISDS line is in the present tense.
- `components/Collage.module.css:43`: `.screen { opacity: 0 }`, revealed only by
  `HorizonMotion`. Mobile rail screens already have `opacity: 1`. No other CSS rule sets opacity to 0
  (section fades are set from JS only).
- `ProofBar.tsx`, `Contact.tsx`, and `content.ts`: the App Store, Fitnex, Cartify, GitHub, LinkedIn, and email links
  that llms.txt and the JSON-LD will reuse.

## Hard constraints
- No visual, layout, motion, or copy-tone changes except 7c.
- Section components stay server components, and nothing new gets "use client".
- No new dependencies (`next/og` is built in).
- The canonical domain is https://boluwatifeosineye.com everywhere.
- No city or region anywhere. Country (Nigeria / NG) only.
- Fitnex wording stays "200+ active users".

## Tasks and decisions

### 1. Metadata (`app/layout.tsx`)
`metadataBase`, keep the current `title`, a new `description` (<160 chars):
"Boluwatife Osineye is a mobile and web engineer in Nigeria building React Native, React and
Next.js apps for logistics, payments and commerce."
Also: `alternates.canonical "/"`, `openGraph` (website, url "/", siteName, locale en_US,
title, description), `twitter` (summary_large_image, title, description), `authors`,
`creator`, `keywords`, and `robots { index, follow }`.

### 2. OG image: `app/opengraph-image.tsx` + `app/twitter-image.tsx`
- The twitter image re-exports the default, `alt`, `size`, and `contentType`.
- Size 1200×630, PNG, background #0B0A09, and a warm radial glow in the hero golds (#B98F52 / #E2C89C).
- Text: the name large, then "Mobile & Web Engineer", then
  "React Native · React · Next.js · Node" and "boluwatifeosineye.com". The type is sized to stay
  legible at WhatsApp thumbnail size.
- **Decision:** use the default `ImageResponse` font. `next/font/google` doesn't leave a
  local TTF I can `readFile`, and fetching one at build time needs network access. So I'm using the fallback
  you allowed rather than a fragile font load.

### 3. `app/robots.ts`
- Allow `/` for `*`, and add explicit allow entries for GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-SearchBot, PerplexityBot, Googlebot, and Bingbot.
- Add the `sitemap` line and `host`.

### 4. `app/sitemap.ts`
One entry: `/`, `lastModified: new Date()`, monthly, priority 1.

### 5. Duplicate domain (`next.config.ts`)
- `redirects()`: `source "/:path*"`, `has: [{ type: "host", value: "tifethedev.vercel.app" }]`,
  destination `https://boluwatifeosineye.com/:path*`, `permanent: true` (308).
- localhost and preview hosts don't match, so they're unaffected.

### 6. JSON-LD (`app/page.tsx`)
- A server-rendered `<script type="application/ld+json">` with an `@graph` of Person / WebSite / ProfilePage,
  exactly as specified.
- IDs: `https://boluwatifeosineye.com/#person`, `/#website`, `/#profile`.
- `addressCountry "NG"` only.
- `<` is escaped in the JSON so the string can't close the script tag.

### 7. Text extraction and copy
a) H1: add `{" "}` between "Boluwatife Osineye" and the subhead span. The span is block-level,
   so the space doesn't render. I'll confirm the rendered H1 is identical.

b) Stats: keep the **desktop** wording as the single real text:
   - The `dOnly` span stays in the DOM. On mobile it's visually hidden (sr-only clip) instead of `display:none`,
     so screen readers and crawlers read it at both sizes.
   - The mobile wording moves to CSS: `<span class=mOnly data-text="users, solo build" aria-hidden>`
     with `::after { content: attr(data-text) }`, shown only ≤699px.
   - The result: text content = "200+ users on a solo build" / "100+ developers mentored", and every
     breakpoint looks exactly as it does now. No rewording.

c) ISDS line (`lib/content.ts` `trackRecordBlock.body`). **Please approve this wording:**
   - Before: "I lead frontend engineering at ISDS (wallet, checkout, performance) across four apps."
   - After:  "I led frontend delivery at ISDS (wallet, checkout, performance) across four apps."
   - The rest of the paragraph stays unchanged. The bold `highlights` don't change.
   - I'll also grep for other present-tense ISDS role claims and report any I find, without changing them.

### 8. Screenshots without JS
- `app/layout.tsx` renders `<head><noscript><style>` with `[data-screen]{opacity:1 !important}`.
- The JS-on path is untouched, because `<noscript>` content is inert when JS runs.
- I'll check the page with JS disabled for anything else stuck at opacity 0.

### 9. `public/llms.txt`
- Markdown that covers:
  - who you are
  - roles: ISDS Frontend Developer Jul 2025 – Jul 2026; Imagine Integrated Mobile Developer Jan – Jul 2025;
    Sabi Programmers 2024
  - projects with links: 3 App Store links, fitnexonline.com, the Cartify demo and repo
  - stack
  - availability: full-time and contract, remote
  - contact: email, GitHub, LinkedIn
- Fitnex = "200+ active users". No city, no fluff.

## Files expected to change
- `app/layout.tsx`
- `app/page.tsx`
- `app/opengraph-image.tsx` (new)
- `app/twitter-image.tsx` (new)
- `app/robots.ts` (new)
- `app/sitemap.ts` (new)
- `next.config.ts`
- `components/sections/Hero.tsx`
- `components/sections/Hero.module.css`
- `lib/content.ts`
- `public/llms.txt` (new)

## Performance / accessibility
- No change to the rAF loop, the motion, or transform/opacity usage.
- Focus rings are unaffected.
- Screen readers now get one clean stats string at every breakpoint. On mobile they currently get the abbreviated one.

## Acceptance criteria and checks (I'll run these and report the real output)
1. `npx tsc --noEmit`, `npm run lint`, `npm run build`: all pass.
2. `npm run start`, then:
   - `curl -s localhost:3000/robots.txt` shows the rules and the sitemap line.
   - `curl -s localhost:3000/sitemap.xml` returns one URL.
   - `curl -s localhost:3000/llms.txt` returns the file.
   - `curl -sI localhost:3000/opengraph-image` returns 200, image/png. I'll also view the PNG.
   - `curl -s localhost:3000 | grep -E 'og:|twitter:|canonical|ld\+json'` finds all of them, with absolute
     https://boluwatifeosineye.com URLs.
3. `curl -s localhost:3000 | sed 's/<[^>]*>/ /g' | tr -s ' ' | head -c 1500`: the H1 and stats read cleanly.
4. `grep -rni "lagos\|ibadan" app components lib public` finds no matches.
5. Visual regression: screenshot the hero at desktop and 375px, before and after. They should be identical.
6. JS disabled: the collage screenshots are visible.

## Manual test steps
1. `npm run build && npm run start`, then open http://localhost:3000.
2. Desktop and 375px mobile (devtools): the hero H1, subhead, and stats look unchanged. The Track record
   paragraph reads "I led frontend delivery…".
3. Reduced motion (devtools → Rendering → prefers-reduced-motion: reduce): the page is static, as before.
4. Devtools → Settings → Disable JavaScript, then reload. The collage screenshots show and nothing is blank.
5. Open /opengraph-image, /robots.txt, /sitemap.xml, and /llms.txt.

## After deploy (for you to do)
- Check the previews with LinkedIn Post Inspector and opengraph.xyz.
- Submit the sitemap in Google Search Console and Bing Webmaster Tools.
- Confirm Vercel Firewall bot protection isn't challenging AI crawlers.
