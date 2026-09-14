# Copy override: first person instead of third person

The design handoff (`design_handoff_horizon_portfolio/`) is read-only and is
NOT being edited to make this change. This file records an approved
deviation from the handoff copy: every third-person reference to Tife is
rewritten to first person when implemented in the app. All other copy
(numbers, project names, quotes, placeholder flags) stays verbatim.

## Approved rewrites

| Location | Handoff copy (third person) | Use instead (first person) |
|---|---|---|
| README.md:147 — nav link | How he builds | How I build |
| Desktop.dc.html:35 — nav link | How he builds | How I build |
| Desktop.dc.html:134 / Mobile.dc.html:123 — headline | He finishes what he starts, alone | I finish what I start, alone |
| Desktop.dc.html:410 — body copy | One real feature from Insta-Delivery, traced through every layer he touches. When it breaks, he can find it and fix it at any one of them. | One real feature from Insta-Delivery, traced through every layer I touch. When it breaks, I can find it and fix it at any one of them. |
| Mobile.dc.html:355 — body copy | One real feature from Insta-Delivery, traced through every layer he touches. | One real feature from Insta-Delivery, traced through every layer I touch. |
| Desktop.dc.html:323 / Mobile.dc.html:288 — stat caption | active users, from an idea he shipped alone | active users, from an idea I shipped alone |
| Mobile.dc.html:124 — body copy | Fitnex went from an idea to launch to 200+ real users solo, and he still maintains it. | Fitnex went from an idea to launch to 200+ real users solo, and I still maintain it. |
| Desktop.dc.html:480 / Mobile.dc.html:409 — recommendation caption | Managed him directly | Managed me directly |
| Desktop.dc.html:488 / Mobile.dc.html:417 — recommendation caption | Worked alongside him | Worked alongside me |
| Desktop.dc.html:496 — recommendation caption | Mentored by him | Mentored me |

## How to apply

When implementing/updating any prompt or component that sources copy from
the handoff, use the first-person version from this table instead of the
handoff's literal text. If new third-person copy is found later in the
handoff, add it here rather than editing the handoff file.
