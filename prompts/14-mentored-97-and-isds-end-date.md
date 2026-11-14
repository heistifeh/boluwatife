# 14 — Mentoring count 97+ everywhere; ISDS end date October 2026

## Goal

Tife's instruction: use **97+** for developers mentored everywhere (it currently says 100+ on the site and LinkedIn, and 50+ in some older LinkedIn posts), and correct the ISDS end date to **October** (Oct 2026, matching LinkedIn).

This is an approved deviation from the handoff copy, which shows 100+. The handoff stays read-only.

## Site changes

| File | Before | After |
|---|---|---|
| `components/sections/Hero.tsx` stat | 100+ developers mentored / devs mentored | 97+ developers mentored / devs mentored |
| `lib/content.ts` `heroStats` | `{ value: "100+", rest: "developers mentored" }` | `{ value: "97+", … }` |
| `lib/content.ts` `trackRecordBlock.body` | I've mentored 100+ engineers… | I've mentored 97+ engineers… |
| `lib/content.ts` `trackRecordBlock.highlights` | ["100+", "200+"] | ["97+", "200+"] |
| `public/llms.txt` summary | Has mentored 100+ developers. | Has mentored 97+ developers. |
| `public/llms.txt` roles | ISDS, Frontend Developer (Jul 2025 – Jul 2026) | ISDS, Frontend Developer (Jul 2025 – Oct 2026) |

The role title in `llms.txt` ("Frontend Developer") differs from LinkedIn ("Mobile Application Developer"). Tife did not ask to change it, so it stays, and is flagged.

## LinkedIn changes (Tife's instruction, in Chrome)

- About: "mentored 100+ developers" → "mentored 97+ developers".
- Sabi Programmers experience: "Mentored 100+ beginner developers" → "Mentored 97+ beginner developers".
- Every post of Tife's that says "50+ developers mentored" (or another mentoring count) → "97+ developers mentored". Only that phrase changes in each post.
- ISDS experience end date: already Oct 2026. Verify only.

## Checks

Type check, lint, build. Hero stat and Track record at 1280px and 375px (the highlight still applies to "97+", no wrap or overflow). Grep finds no "100+" mentoring claim left.

## Release

Commit these files and this prompt on `main`, push to `origin/main`, confirm the live site.
