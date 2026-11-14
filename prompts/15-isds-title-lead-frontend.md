# 15 — ISDS title: Lead Frontend Developer (Web & Mobile)

## Goal

Tife's correction: at ISDS the role was frontend developer, as **lead frontend developer for web and mobile**. Make the portfolio and LinkedIn say the same thing.

## Site change

| File | Before | After |
|---|---|---|
| `public/llms.txt` roles | ISDS, Frontend Developer (Jul 2025 – Oct 2026): led frontend delivery… | ISDS, Lead Frontend Developer, web and mobile (Jul 2025 – Oct 2026): led frontend delivery… |

No visible page copy names the ISDS title (Track record already says "I led frontend delivery at ISDS"), so nothing else on the site changes.

## LinkedIn changes (in Chrome)

- ISDS experience title: "Mobile Application Developer" → **Lead Frontend Developer (Web & Mobile)**. Company, dates (Jul 2025 – Oct 2026), employment type, location and skills stay as they are.
- ISDS experience description, if Tife approves, replaced with:

  > Led frontend development for web and mobile on Insta-Delivery, a logistics and commerce platform for businesses across Nigeria and Africa. Built across four React Native apps (customer, vendor, driver and B2B) and the Next.js web marketplace; three apps are live on the App Store and two on Google Play. Owned wallet funding, P2P transfers, checkout and performance work, and shipped features like referrals behind feature flags so launches stayed on schedule.

- If LinkedIn asks to share the profile update with the network, decline.

## Checks

Build passes; live `llms.txt` shows the new title. The LinkedIn experience page shows the new title and dates unchanged.

## Release

Commit `public/llms.txt` and this prompt on `main`, push, confirm live.
