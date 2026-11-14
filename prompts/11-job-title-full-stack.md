# 11 — Job title: "Mobile & Web Engineer" → "Full-Stack Engineer"

## Goal

Tife chose **Full-Stack Engineer** as the site's job title, with **React Native & Next.js** as the specialty, to match the titles recruiters search for. Replace every instance of "Mobile & Web Engineer" so the site says one thing everywhere.

This is an approved copy deviation from the handoff (read-only, not edited), like `prompts/copy-override-first-person.md`.

## What I read

`app/layout.tsx`, `app/page.tsx` (JSON-LD), `app/opengraph-image.tsx`, `app/twitter-image.tsx` (re-exports the OG image), `app/manifest.ts`, `components/sections/Hero.tsx` + `Hero.module.css` (`.subhead`), `components/sections/Contact.tsx`, `public/llms.txt`.

## Changes

| File | Before | After |
|---|---|---|
| `Hero.tsx` subhead | Mobile & Web Engineer | Full-Stack Engineer · React Native & Next.js |
| `layout.tsx` title | Boluwatife Osineye — Mobile & Web Engineer \| React Native, Next.js | Boluwatife Osineye — Full-Stack Engineer \| React Native, Next.js |
| `layout.tsx` description | …is a mobile and web engineer in Nigeria building React Native, React and Next.js apps for logistics, payments and commerce. | …is a full-stack engineer in Nigeria building React Native, React and Next.js apps for logistics, payments and commerce, and AI agents built on Claude. |
| `layout.tsx` keywords | …"mobile engineer", "frontend engineer"… | adds "full-stack engineer" first; keeps "mobile engineer" and "frontend engineer" |
| `page.tsx` JSON-LD `jobTitle` and ProfilePage `name` | Mobile & Web Engineer | Full-Stack Engineer |
| `opengraph-image.tsx` (also used by twitter-image) | `alt` and line 2: Mobile & Web Engineer | Full-Stack Engineer |
| `manifest.ts` `name` | …Mobile & Web Engineer | …Full-Stack Engineer |
| `Contact.tsx` footer | Boluwatife Osineye, Mobile & Web Engineer | Boluwatife Osineye, Full-Stack Engineer |
| `public/llms.txt` summary | Mobile and web engineer based in Nigeria. | Full-stack engineer based in Nigeria. |

## Decisions

- **Hero subhead:** one line on desktop. On mobile it may wrap to two lines inside the existing `.subhead` style. No new styles. The glow placement rule (glow never crosses headline, subhead or stats) is checked after the change.
- **Not "AI Engineer"**, and no "Senior": one AI project; AI goes in the description only.
- **The CV PDF** (`Boluwatife Osineye - Mobile Engineer.pdf`) is not touched. Flagged to Tife to update the CV and LinkedIn to match.
- **The stack line** under the OG title ("React Native · React · Next.js · Node") stays.

## Checks

- Type check, lint, build.
- Hero at 1280px and 375px: subhead fits, no overlap, no sideways scroll, glow doesn't sit on the text.
- Open `/opengraph-image` to confirm the preview image reads "Full-Stack Engineer".
- `grep -rn "Mobile & Web\|Mobile &amp; Web\|mobile and web"` across `app components lib public` returns nothing.

## Manual test steps

1. `npm run dev`, open the home page. The hero reads "Full-Stack Engineer · React Native & Next.js".
2. Set the viewport to 375px. The subhead wraps cleanly with no sideways scroll.
3. Open `/opengraph-image`. The image says "Full-Stack Engineer".
4. Scroll to the footer. It reads "Boluwatife Osineye, Full-Stack Engineer".
5. Reduced motion: turn on `prefers-reduced-motion: reduce` and reload. The hero is static and readable.
