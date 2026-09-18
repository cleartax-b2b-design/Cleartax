---
name: website-skill
description: Build Cleartax-branded websites, landing pages, and webpages using Cleartax's real design system (brand colors, Nohemi/Gilroy typography scale, logo) plus proven component and animation patterns (GSAP ScrollTrigger, an optional Three.js hero, marquees, pinned timelines). Use whenever asked to build, create, redesign, or recreate a Cleartax website, landing page, or marketing webpage.
---

# Cleartax Website Skill

## Overview

Use this skill to build self-contained HTML/CSS/JS websites and landing pages that read as native Cleartax collateral — not a generic template, and not a clone of whatever visual style a reference site happened to use. When working from a reference site (for animation/structure inspiration) or an existing flow doc/wireframe, reskin it into Cleartax's current brand system every time.

Typical asks this covers: "build a landing page for X", "create a website like \<reference\> for Cleartax", "recreate this page with our design system", "add a new section to the \<market\> website".

A finished reference implementation of this skill lives at `Website/Cleartax WIP/Landing Page/` — a full GSAP + Three.js landing page built for the UAE e-invoicing mandate. Read it for concrete examples of every pattern below before building something new.

> **Paths below were last verified 2026-07-11.** This project's folders have moved once already (a full top-level reorg, likely from a Google Drive re-sync) without any corresponding update here, which left this skill silently pointing at dead paths. If a path below doesn't resolve, don't guess a nearby-sounding folder — re-run a quick `find`/`ls` sweep from the project root for the actual current name before continuing, and update this file once you confirm the new location.

## Required References

Read these instead of hardcoding values — they are the source of truth and can change:

- `Design system/Variables/*.json` — color and layout tokens as flat, unzipped JSON files (`Primitives.json`, `Semantics.json`, `Typography.json`, `Spacing.json`, `Border.json`, `Layout.json`, `Components.json`). There is currently **no per-market split** — `Semantics.json` is a single file with top-level `Content`/`Background`/`Border`/`Surface`/`Overlay` categories, not a folder of market variants. If a market-specific look is needed, check whether that's represented as nested keys inside this one file before assuming it doesn't exist.
- `Design system/Fonts/Typograpghy Style Guide.pdf` — the exact type scale (sizes, line-heights, weights) for Display, H1–H6, Paragraph, Label, and Overline (filename has a typo in the source file itself — that's not a typo introduced here). **This is the only source for letter-spacing too**: it lists no tracking value for any named style, meaning all of them use the scale's `None` (0) default — don't invent negative tracking on headings.
- `Design system/Fonts/Nohemi/Web-TT/*.woff2` and `Design system/Fonts/Gilroy - font/*.otf` — the two brand typefaces (Nohemi has woff2; Gilroy is otf-only)
- `Design system/Logo/Cleartax-logo-*.png` (also `Logo.svg` / `Logo-dark.svg`) — the only acceptable logo marks. Never render the logo as typed text.
- The relevant `Website/<Country or campaign>/.../*flow.pdf` and any mockup/icon assets in that folder — content, section order, and copy come from there, not from imagination. The active project lives at `Website/Cleartax WIP/` (flow doc under `Website-flow/`, the approved design mockup under `Design/`, icon/compliance-badge assets under `Icons/`); older per-market builds live under `Website/Old/<Country>/` (Germany, Global, Malaysia, Oman, Phillipines, Spain, UAE, UK). Look for a matching country/campaign folder before starting from scratch.

## Custom Design Systems (opt-in only — default is always Cleartax)

`Website/custom-design-system/` holds design-system specs for brands **other than** Cleartax (e.g. `DESIGN-coinbase.md`), each a single markdown file with frontmatter (`name`, `description`) followed by `colors`, `typography`, and other token sections in the same spirit as this skill's own Color/Typography sections.

- **Default behavior is unchanged**: build with Cleartax's own design system (per Required References above) unless told otherwise. Do not open or apply anything from this folder on a normal request.
- **Only use a file from this folder when the user explicitly names it** — e.g. "build this using the coinbase design system" or references `DESIGN-coinbase.md` directly. Match against the filename and the frontmatter `name` field.
- When triggered, that file's `colors`/`typography`/token sections fully replace Cleartax's own tokens for that build (fonts, palette, spacing, tone) — but the Component Library, Animation Conventions, and Known Pitfalls Checklist below still apply, since those are structural/engineering patterns, not brand-specific.
- If the user names a design system that has no matching file in `Website/custom-design-system/`, say so rather than inventing one — don't guess at an unlisted brand's tokens.
- Some brand specs explicitly discourage certain default conventions of this skill (e.g. inventing dashboard mockup data, or using a pinned horizontal-scroll timeline for roadmap content) — when a custom design system's own Do's/Don'ts contradict a default in this skill, the custom system's explicit guidance wins for that build; note the deliberate divergence rather than silently blending the two.

## Color Tokens (Cleartax brand, from Primitives)

Always re-verify against the token files before a build — these are a starting reference, not a substitute for reading the source:

| Token | Hex |
|---|---|
| Purple/400 | `#925CFF` |
| Purple/500 (primary accent) | `#7733FF` |
| Purple/600 (hover/pressed) | `#5F29CC` |
| Purple/700 | `#471F99` |
| Purple/800 | `#301466` |
| Purple/900 | `#180A33` |
| Violet/300 (accent text on dark) | `#D685FF` |
| Violet/400 | `#C95CFF` |
| Violet/500 | `#BB33FF` |

Neutrals are chosen per build (a near-black ink for dark sections, off-white paper for light sections) rather than pulled from a single fixed pair — check the market's `Semantics` file for the current ink/paper/muted values.

## Typography — map every text style to a named token

Nohemi is used for Display and H1–H6 only. Gilroy is used for Paragraph, Label, and Overline. Never use an arbitrary in-between size — always round to the nearest defined token.

| Category | Desktop size/line-height | Mobile size/line-height | Weights available |
|---|---|---|---|
| Display | 52/56 (Large), 44/48 (Small) | — | Medium, Semibold, Bold, Extrabold |
| H1 | 40/48 | 36/44 | Medium, Semibold, Bold, Extrabold |
| H2 | 36/44 | 32/40 | Medium, Semibold, Bold, Extrabold |
| H3 | 32/40 | 28/36 | Medium, Semibold, Bold, Extrabold |
| H4 | 28/36 | 24/32 | Medium, Semibold, Bold, Extrabold |
| H5 | 24/32 | 20/28 | Medium, Semibold, Bold, Extrabold |
| H6 | 20/28 | 18/24 | Medium, Semibold, Bold, Extrabold |
| Paragraph Large/Medium/Small/XSmall | 18/28, 16/24, 14/20, 12/20 | same | Regular, Medium, Semibold (+ Underline/Strikethrough/Italic) |
| Overline Large/Small | 14/20, 12/20 | same | Semibold |
| Label Large/Medium/Small/XSmall | 16/18, 14/16, 12/14, 10/14 | same | Regular, Medium, Semibold |

**Letter-spacing rule**: every named style above uses `None` (0px) — that's the documented default, not a gap in the spec. The separate letter-spacing scale (`2XS` −2px, `XS` −1px, `S` −0.5px, `None` 0, `XS+` +0.5px, `S+` +1px, `M+` +2px) exists as a deliberate, optional override, not something to bake into headings/body text. The one place it's appropriate: uppercase eyebrow/overline micro-copy reads better with `S+` or `M+` tracking. Don't add negative tracking to large display headlines "because it looks more premium" — the actual spec doesn't do that.

Default heading weight across a page: Semibold, with Extrabold reserved for a hero/display moment that should stand out from the rest of the hierarchy.

## Component Library

Reuse these patterns rather than inventing new ones per build — see the reference implementation for full code.

- **Nav** — fixed, transparent over the hero, transitions to a solid/blurred bar (`backdrop-filter: blur`) once scrolled past the hero; swaps a light-on-dark logo for a dark-on-light one at the same breakpoint.
- **Hero** — big Nohemi headline animated in with a line-by-line reveal (each line wrapped in an `overflow:hidden` span, inner span starts at `translateY(110%)` and animates to `0%`), optionally over a Three.js canvas background (see Animation Conventions).
- **Section-head rhythm** — eyebrow → heading → body copy → optional CTA button, as a flex column with a *graduated* gap: ~16px eyebrow→heading, ~24px heading→body, ~32–40px body→CTA. Never leave a heading/body/CTA cluster to plain block-margin defaults — that's how a CTA button ends up sitting flush against the paragraph above it with zero gap (a real bug caught in this project). If a section's eyebrow sits outside a flex-column wrapper (a "naked" eyebrow followed directly by something else, e.g. a logo ticker), give it an explicit `margin-bottom` of at least 12–16px — don't rely on inherited spacing.
- **Buttons** — the primary CTA (`.btn--primary`, e.g. "Book a demo") should default to the brand accent color, not a neutral ink/black — it's the action you want taken, so it should look like it. Reserve a neutral/dark variant for secondary emphasis (`.btn--dark`), and a bordered variant for tertiary actions (`.btn--outline`/`.btn--ghost`).
- **Bento/card grids** — a `grid-template-columns: repeat(3,1fr)` with one or two cards spanning 2 columns for visual variety. Double-check the actual resulting layout (which cards end up adjacent to which) before shipping — a wide card can silently wrap to its own row and end up nowhere near the card it was supposed to sit beside.
- **Pinned horizontal timeline** — a horizontally-scrolling card track pinned via `ScrollTrigger` (`pin: true, scrub: 1`), driving `track.scrollLeft` from scroll progress. Good for a compliance roadmap / mandate timeline / step sequence — unless the active design system's own documentation explicitly favors an unframed, rule-separated list instead (some editorial-leaning brand specs do; follow that brand's own guidance when it says so).
- **Marquee/ticker** — see Animation Conventions below; this has a specific correct implementation and an easy-to-get-wrong one.
- **FAQ accordion** — click-to-expand with `gsap.to(answer, {height: ...})`; only one item open at a time reads cleaner than allowing several.
- **CTA band + form** — a two-column band (copy left, form right) near the end of the page, distinct from the primary hero CTA, for a second conversion moment.
- **Footer** — multi-column link groups + a bottom bar (address/legal/compliance badges).

## Animation Conventions

- **GSAP + ScrollTrigger** via CDN (`cdnjs.cloudflare.com/ajax/libs/gsap/...`) is the default animation engine: `reveal-up` (fade + translateY(28px) → 0) for generic section content, the line-reveal technique above for hero-scale headlines, `scrub`-driven pinning for the horizontal timeline, and `once: true` scroll-triggered count-up tweens for stat numbers.
- **Three.js hero** (optional — only when the subject genuinely calls for a spatial/network/globe moment, not by default): self-host a **classic UMD build** (e.g. `three@0.128.0/build/three.min.js`, loaded via a plain `<script src>` tag), not the ES-module build. A `<script type="module">` that imports Three.js will silently fail to load at all when the page is opened via plain `file://` — which is exactly how most people will first open a delivered HTML file (double-click, not a local server) — and every animation on the page (not just the 3D scene) can go dark as a result if that failure isn't isolated (see Known Pitfalls).
- **Marquee/ticker**: duplicate the content exactly once (`track.innerHTML = html + html`) and animate with a **pure CSS keyframe**, `transform: translateX(-50%)`, `animation: marquee-scroll <duration> linear infinite`. Do **not** measure `track.scrollWidth` in JS and drive a GSAP tween to `-width` — if any content in the track is an image (especially `loading="lazy"`), the measurement race against image load produces a visible jump on every loop. The `-50%` CSS approach is always exactly correct regardless of image load timing, because the duplicated content is definitionally half the track's total width once it has laid out. Respect `prefers-reduced-motion` by setting `animation: none`.

## Known Pitfalls Checklist

Real bugs caught while building the reference implementation — check for these before calling a build done:

1. **Uncaught errors kill everything downstream.** If `DOMContentLoaded` calls several `init*()` functions in sequence and one throws (e.g. `new THREE.WebGLRenderer()` failing because WebGL is unavailable), every init call after it in that same handler silently never runs — GSAP reveals, marquees, FAQ toggles, all of it. Wrap each `init*()` call in its own `try/catch` so one subsystem failing doesn't take down the rest of the page.
2. **`type="module"` breaks on plain `file://`.** Browsers block ES-module script loading from the `file:` origin. If any script tag uses `type="module"`, the page will look completely broken (blank, unanimated) the moment someone double-clicks the HTML file instead of serving it — which is a completely normal way for this to be opened. Use classic scripts and UMD/global builds instead.
3. **CSS specificity traps.** A compound selector like `.container p` (specificity 0,1,1) silently beats a single class selector like `.eyebrow` (0,1,0) on the same element, even if the class rule is declared later in the file. If a container has both an eyebrow paragraph and another plain paragraph inside it, scope the second rule with `:not(.eyebrow)` or a dedicated class — don't reach for a bare tag-descendant selector.
4. **A container's `font-size` doesn't reach a directly-targeted global tag rule.** If there's a global `p { font-size: ... }` reset, setting `font-size` on some ancestor `.some-block` and expecting its `<p>` children to inherit it will silently do nothing — the directly-matched rule on `p` wins over inheritance regardless of the ancestor's specificity. Target the `<p>` (or whatever tag) directly.
5. **Verify with a plain `file://` open, not only a local server.** A `python -m http.server` test can pass while the real "double-click the file" experience is broken (see pitfall #2). Always test both.
6. **Lazy-loaded images inside anything measured by JS** (marquees, carousels) will report wrong dimensions before they've loaded. Either don't lazy-load small above-the-fold decorative images like ticker badges, or don't measure pixel widths in JS at all (see the CSS marquee technique above).
7. **A `position: fixed` element with a hardcoded `top` offset can silently overlap a sticky/fixed nav once the page scrolls.** If a scroll-progress rail (or any fixed overlay) is offset by a banner's height (e.g. `top: 36px` to sit below an announcement bar) but the nav itself is `position: sticky; top: 0` rather than pushed down by that same banner height, the nav will stick flush to the viewport top on scroll while the overlay stays at its hardcoded offset — landing the overlay inside the nav's own bounds instead of below it. Either pin such overlays to `top: 0` (letting z-index/stacking order handle layering) or give the nav a matching, state-aware top offset — don't hardcode two independent offsets that assume the same layout and then let one of them move.

## Production Workflow

1. **Find or create the right folder.** Look for a matching `Website/<Country or campaign>/` folder before creating a new top-level one (the active project is `Website/Cleartax WIP/`; older per-market builds are under `Website/Old/<Country>/`). Build inside a page-named subfolder there (e.g. `Landing Page/`), self-contained with its own local copy of assets — don't reference the shared `Design system/` folder directly by path from the final build; copy the specific font weights/logo files/icons actually used into a local `assets/` folder so the folder is portable and survives the next reorg.
2. **Gather real content first.** Read the full flow doc/wireframes for the page before writing any HTML — section order, copy, and CTAs come from there.
3. **Pull fresh tokens.** Re-check the color/typography source files listed above rather than trusting this doc's reference tables blindly — they can drift out of date.
4. **Structure**: `index.html`, `css/style.css`, `js/main.js`, `assets/fonts/{nohemi,gilroy}`, `assets/img/`. Self-host GSAP's plugin files or load via CDN (fine either way); self-host Three.js as a classic UMD build if used (not CDN ES module).
5. **Build**, following the component/animation conventions above and the Known Pitfalls checklist as you go — don't leave them for a final pass.
6. **QA visually**, not just by reading the code back. Use `scripts/screenshot.py` in this skill folder to render the real page in headless Chrome:
   - `python3 scripts/screenshot.py --url "file:///abs/path/index.html" --out /tmp/hero.png` — the plain double-click scenario (catches pitfall #2)
   - Repeat with `--scroll <pixel-value>` for every major section down the page
   - Repeat with `--mobile` for the small-viewport layout
   - Read each resulting PNG back and actually look for the specific bugs in the checklist above (dead sections, missing gaps, misaligned grids, wrong button colors) — don't just confirm the page "loaded".
7. **Deliver** to `Website/Output/Website <N>/`, incrementing `<N>` from whatever the highest existing `Website Output/Website <N>/` folder is — this is the standing convention for all new website builds going forward, not just single-asset PDFs.

`scripts/screenshot.py` requires `websocket-client` (`pip install --user websocket-client` if missing) and a local Chrome/Chromium install.
