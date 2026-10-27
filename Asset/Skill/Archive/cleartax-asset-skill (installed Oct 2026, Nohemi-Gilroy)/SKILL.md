---
name: cleartax-asset-skill
description: Create Cleartax-branded visual assets (one-pagers, LinkedIn/social assets, compliance guides, case studies, portrait PDFs) using Cleartax's real design system — brand tokens, Nohemi/Gilroy typography scale, logo marks, and cover backgrounds, all bundled inside this skill. Use whenever asked to create, recreate, reskin, or brand an asset, brochure, one-pager, PDF, flyer, playbook, or LinkedIn/social visual for Cleartax — even if the request doesn't name the design system, the output must still be on-brand, so use this skill.
---

# Cleartax Asset Skill

## Overview

Use this skill to produce finished portrait PDF assets that read as native Cleartax collateral — not a generic template, and not a clone of whatever visual style a reference file happened to use. Reskin content into Cleartax's current brand system every time, even when working from an existing asset (old brochure, competitor asset, previous campaign PDF) as a content/structure reference.

Typical asks this covers: "create a one-pager on X", "recreate this brochure with our design system", "build a LinkedIn asset for Y", "make a compliance guide like Z but on-brand".

**This skill is self-contained.** Every design-system dependency (tokens, fonts, logos, backgrounds, export scripts) is bundled under this skill's own folder — no external vault or repo is required. All paths below are relative to this skill's root directory (the folder containing this SKILL.md); resolve them against it before use.

## Bundled Resources (source of truth — read these, don't hardcode)

- `assets/tokens/Semantics.json` — color tokens (a single flat file; no per-market split). `Primitives.json`, `Layout.json`, `Components.json` are included for completeness.
- `assets/tokens/Typography.json` — the exact type scale (sizes, line-heights, weights, letter-spacing) for Display, H1–H6, Paragraph, Label, and Overline. `references/Typography Style Guide.pdf` is the human-readable companion.
- `assets/tokens/Spacing.json` and `assets/tokens/Border.json` — spacing and radius scale
- `assets/fonts/nohemi/*.woff2` (+ `.ttf` for subsetting scripts) and `assets/fonts/gilroy/*.otf` — the two brand typefaces. Only the sanctioned weights are bundled: Nohemi Medium/SemiBold/Bold, Gilroy Medium/Semibold (plus Regular/Bold/MediumItalic and Nohemi ExtraBold for the legacy SVG-export script mappings).
- `assets/logo/Logo.svg` (white) and `assets/logo/Logo-dark.svg` (black) — vector logo marks. `Cleartax-logo-black.png` / `Cleartax-logo-white.png` are raster alternates. Never render the logo as typed text.
- `assets/backgrounds/stars/Stars-<n>.jpg` (10 images) — the default cover background source (see Layout System below). `assets/backgrounds/gradient/{dark,light}/<n>.jpg` are the secondary/alternative photographic-gradient backgrounds (a representative subset of 5 each; the full sets live in the Cleartax vault).
- `scripts/svg-export/` — reusable Python tooling for exporting a finished asset as editable-text SVG slides (see `references/figma-export.md`). Not needed for a normal PDF build.
- `scripts/figma/` — the Figma font-swap dev plugin and setup-check scripts for the direct-Figma-build workflow (macOS + Figma desktop only; see `references/figma-export.md`).

## Color Tokens (Cleartax brand, from Semantics)

- Brand: `#3355FF` — headings, accents, primary buttons/pills
- Brand hover/600: `#2944CC`, Brand pressed/700: `#1F3399` — gradients, darker accents
- Info subtle: `#D6DDFF` — light-blue highlight fills (callouts, table headers, tag chips)
- Ink: `#0D0D0D` — headings/emphasis text on white
- Body: `#4D4D4D` — default paragraph text
- Muted: `#808080` — footers, running headers, secondary labels
- Divider: `#E5E5E5` — hairlines, table borders
- Card background: `#F9FAFB` — neutral card fills
- Notice: `#FF8000`, Positive: `#66C285` — used sparingly as accent colors (e.g. in the spectrum bar), not as text colors
- Background: `#FFFFFF`

Always pull from `assets/tokens/Semantics.json` rather than reusing these numbers blindly — verify the file still defines them before a build.

## Typography — map every text style to a named token

The table below reflects `assets/tokens/Typography.json` + `references/Typography Style Guide.pdf` (reformalized 2026-07-15). Re-diff against those two files before trusting the table blindly; it has gone stale once before (an earlier version included `H4/Extrabold` and `Display/Extrabold` tokens that no longer exist — Nohemi ExtraBold ships as a font file for legacy script mappings but is **not** part of the sanctioned scale).

Nohemi is used for Display and H1–H6 only, each available in **Medium / Semi Bold / Bold** — same size/line-height across all three weights, pick weight for emphasis, not size. Gilroy is used for Paragraph, Label, and Overline, each available in **Medium / Semi Bold** (Paragraph also has Special variants: underline, strikethrough, italic — all on the Medium weight). Never use an arbitrary in-between size (e.g. "21px" or "12.6px") — always round to the nearest defined token:

| Token | Font / weight | Size / line-height (Desktop) |
|---|---|---|
| Display/Large | Nohemi Medium / Semi Bold / Bold | 52 / 56 |
| Display/Small | Nohemi Medium / Semi Bold / Bold | 44 / 48 |
| H1 | Nohemi Medium / Semi Bold / Bold | 40 / 48 |
| H2 | Nohemi Medium / Semi Bold / Bold | 36 / 44 |
| H3 | Nohemi Medium / Semi Bold / Bold | 32 / 40 |
| H4 | Nohemi Medium / Semi Bold / Bold | 28 / 36 |
| H5 | Nohemi Medium / Semi Bold / Bold | 24 / 32 |
| H6 | Nohemi Medium / Semi Bold / Bold | 20 / 28 |
| Paragraph/Large | Gilroy Medium / Semibold | 18 / 28 |
| Paragraph/Medium | Gilroy Medium / Semibold | 16 / 24 |
| Paragraph/Small | Gilroy Medium / Semibold | 14 / 20 |
| Paragraph/XSmall | Gilroy Medium / Semibold | 12 / 20 |
| Label/Large | Gilroy Medium / Semibold | 16 / 18 |
| Label/Medium | Gilroy Medium / Semibold | 14 / 16 |
| Label/Small | Gilroy Medium / Semibold | 12 / 14 |
| Label/XSmall | Gilroy Medium / Semibold | 10 / 14 |
| Overline/Large | Gilroy Semibold | 14 / 20 |
| Overline/Small | Gilroy Semibold | 12 / 20 |

Each Heading level (H1–H6) also has a Mobile size one step down from Desktop (e.g. H1/Mobile is 36/44, matching H2/Desktop) — irrelevant for a fixed-canvas A4 PDF, relevant if this scale is ever reused for a responsive web asset.

**Letter-spacing tokens** (from the same `Typography.json`, absolute px, not em/percent — don't hand-pick values like `0.03em`/`0.05em`):

| Token | Value |
|---|---|
| 2XS | -2px |
| XS | -1px |
| S | -0.5px |
| None | 0px |
| XS+ | +0.5px |
| S+ | +1px |
| M+ | +2px |

Practical mapping used across built assets: page section headings → H5/Bold; body copy/table cells/card text → Paragraph/XSmall; running header, table headers, "key insight"-style labels, chip text → Overline/Small or Label/XSmall; big stat numbers → H4/Bold (same 28/36 size the old ExtraBold token used — just swap the weight down to Bold, don't invent a new size to compensate). **Cover headline and subtitle are a deliberate exception that sits outside this formal scale** — `Cover/Hero/Bold` (Nohemi Bold, 68/74, tight tracking `-0.01em`) and `Cover/Subtitle/Medium` (Gilroy Medium, 23/33) directly beneath it. Neither 68/74 nor 23/33 appears anywhere in `Typography.json` — this is a bespoke convention, not a JSON-defined token, kept because it makes the cover read as a hero moment rather than just the biggest heading in the deck (deliberately larger than Display/Large's 52/56). Keep using it for covers specifically; don't extend the same "exception" logic to any other page. Both cover title and subtitle render as solid white (`#ffffff`), no text-shadow — not a gradient text-fill either; a diagonal white-to-white-alpha gradient fill was tested and rejected in favor of plain white. A blurred `text-shadow` (e.g. `0 2px 16px rgba(0,0,0,0.25)`) was also tested and rejected: some PDF renderers (e.g. macOS Preview/Quartz) rasterize Chrome print-to-pdf's text-shadow blur as a visible semi-opaque rectangle behind the glyphs instead of a soft blur — a real bug, not a one-off rendering quirk, so avoid blurred text-shadow on cover type entirely. The bottom-weighted black scrim already provides enough contrast for white text without it.

## Layout System

- Canvas: A4 portrait, `794×1123px` at 96dpi (`@page { size: 794px 1123px; margin: 0; }`) — matches 595×842pt when printed
- Margins: 56px on all sides
- **Cover page — standard recipe**: background is a photo from `assets/backgrounds/stars/Stars-<n>.jpg` (default choice — night-sky/star-trail photography, chosen over the flat CSS brand gradient and the gradient-folder photos, which are secondary alternatives, see below) + a bottom-weighted black scrim (`linear-gradient(180deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,.18) 30%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.55) 100%)`) + logo (white) top-left, sized larger than interior-page logos at **32px tall** (not ~20px) + title/subtitle block, top-aligned. No eyebrow chip/pill — the standard recipe is logo → gap → title → subtitle only.
  - **Title/subtitle placement**: top-aligned, not vertically centered. Exact gap: logo's top edge is at `top:44px`; with a 32px-tall logo (bottom edge ≈76px), the title's top edge sits **160px below the logo's bottom edge** (`top:224px` in the standard 56px-margin layout). Eyebrow removed, so nothing sits in that gap — it's clear space. Title and subtitle stack in normal flow directly beneath (title `margin-bottom:26px`), so the block reflows correctly if the title wraps to a different number of lines.
  - **Stars source images are portrait**, unlike the gradient-folder photos (which are landscape). On the portrait cover canvas, `background-size:cover` still crops one axis — check each image individually and pick `background-position` (top/center/bottom) so the calmest, darkest region of that specific photo sits behind the logo and title; don't assume one position works for all 10 Stars images (some have a bright star-trail swirl or Milky Way core that needs to be cropped away from the text area).
  - **Legacy/alternative backgrounds** (use only if the brief calls for a different mood than night-sky photography): the flat Cleartax brand gradient (`linear-gradient(160deg, #1F3399 0%, #3355FF 55%, #2944CC 100%)` + dot-grid + one abstract geometric graphic + 8px bottom spectrum bar), or `assets/backgrounds/gradient/{dark,light}/<n>.jpg` (landscape photographic gradients — orient so the darkest region lands at the top behind the logo/title, since `cover`-fit always shows the image's full vertical range on these). Same scrim principle applies either way. When testing multiple candidates for any of these, render one mockup per option plus a contact-sheet thumbnail grid so they can be compared at a glance before picking one.
- **Interior page chrome**: logo-dark top-left (~20px tall) + uppercase running title top-right (Overline/Small, muted) + 1px divider rule beneath (y≈84) + content starting at y≈130 + a 1px footer rule + footer row (`cleartax.com` left, page number right, Label/XSmall)
- **Section heading**: H5/Bold in brand blue, followed by a short 38×4px brand-blue rounded rule
- If the asset closes on a CTA/product-suite page, bookend it with a second gradient+dot panel matching the cover, rather than ending flat on white

## Component Library

Reuse these rather than inventing new patterns per asset:

- **Pull-quote** — 4px brand-blue left border + H5/Bold text in brand-700. Always reuses a sentence already present in the source copy; never invented filler.
- **Pill-banner** — solid brand-blue rounded pill, white Nohemi Medium text, for short declarative statements.
- **Tag-chip grid** — 2×2 (or more) neutral/dark rounded chips for short label phrases.
- **Quote-card** — card-bg rounded box holding multiple italic quoted lines, dashed dividers between lines.
- **Info-card** — info-subtle rounded box holding a bullet list (brand-blue bullet dot, dashed dividers).
- **Icon-badge card** — circular badge (info-subtle fill, brand-blue stroke SVG line icon) + text, used solo in a 2×2 grid or stacked as a feature list.
- **Comparison table** (2 or 3 col) — header row info-subtle bg with Overline-style brand-blue uppercase labels; body rows Paragraph/XSmall; alternate zebra striping via card-bg; an "emphasis" column can be bolded + card-bg tinted.
- **Stat-strip** — 3-column grid of card-bg boxes, each with a big H4/Bold number and a Paragraph/XSmall label underneath.
- **Callout / key-insight box** — info-subtle bg, 4px brand-blue left border, Overline label + Paragraph/XSmall body.

Use pull-quotes, stat-strips, and icon-badge cards as the go-to tools for balancing a page that reads too sparse — never by inflating font sizes past their token or inventing new marketing copy.

## Design Guardrails

- Only use colors from the token files — never invent a hex value.
- No stock photography or moody/dark imagery in content pages. Use abstract geometric graphics instead (dot-patterns, node networks, radar rings, skyline silhouettes) even if the source reference material used photography. (The Stars/gradient photos are for covers only.)
- Always embed the real logo SVG/PNG from `assets/logo/` — never a hand-typed "cleartax" text wordmark.
- When recreating an existing asset, preserve its content/copy and page structure, but always reskin the *visual* system into current Cleartax brand — don't clone a legacy asset's palette, typeface, or photographic treatment even if that's what the reference file used.
- One visual system per asset: don't mix in a different palette or typeface partway through.
- Section headings are one level deep per page (H5/Bold) — don't introduce ad hoc heading sizes for sub-points; use bold inline text or Overline labels instead.
- Every text style must map to a named typography token — no arbitrary sizes. **Watch table/card components specifically**: when a table or grid feels too tight, the instinct is to shrink its font (e.g. 11.3px, 10.8px) to force-fit content — this silently breaks token compliance. Instead, either accept the larger token size and let the table run onto a second page, or trim/redistribute rows. In one build, tables and cert-cards drifted to off-token sizes (11.3–11.5px) under exactly this pressure; correcting them back to Paragraph/XSmall (12/20) not only fixed the violation but *also* fixed several pages that had read as too sparse — the undersized text had been leaving real estate unused. Token-compliance and page balance are the same problem, not a trade-off.

## Production Workflow

0. **Resolve the skill root first.** Determine this skill's absolute folder path and use it to build absolute `file://` URLs for fonts, logos, and backgrounds. Verify the bundled files exist before starting (a missing font/logo fails silently as a fallback render, not a loud error).
1. **Read the full source** (every page of the reference asset, if one exists) before writing any HTML — content and structure come from there, visuals do not.
2. **Set up a working folder** for the project (e.g. `<workspace>/<project-name>/index.html`) as a single self-contained file: one shared `<style>` block, one `<section class="page">` per page.
3. **Embed fonts** via `@font-face` using absolute `file://` paths into `assets/fonts/nohemi/*.woff2` and `assets/fonts/gilroy/*.otf` (Nohemi has woff2; Gilroy is otf-only).
4. **Build shared chrome/components first** (CSS variables from the token files, header/footer chrome, section heading, paragraph styles, card/table components), then fill in page content.
5. **QA-render to PNG** with headless Chrome/Chromium (`--headless --screenshot` at the page's pixel width, stacked height = pages × 1123). Split the tall screenshot per-page (e.g. with Python/PIL) and visually review every page.
6. **Fix overflow and imbalance** — dense and sparse pages should feel equally intentional. Prefer pull-quotes/stat-strips/icon cards over stretching font sizes or leaving large dead space.
7. **Render the final PDF**: `chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="<name>.pdf" --virtual-time-budget=3000 --run-all-compositor-stages-before-draw file://<path>/index.html`. Confirm page count and page size (`pdfinfo`) — should be A4, 595×842pt.
8. **Rasterize and re-verify the actual PDF** (`pdftoppm -png -r 120`) — print rendering can differ subtly from the screenshot QA, so re-check fonts/gradients/spacing on the real output, not just the preview.
9. **Deliver** the final PDF to the user, and keep the HTML source alongside it for future edits. Clean up intermediate QA PNGs before finishing.

Tools used throughout: Chrome/Chromium headless (`--screenshot` and `--print-to-pdf`), `pdfinfo`/`pdftoppm` (poppler, for inspecting and rasterizing the output), Python3 + PIL (for splitting a stacked multi-page QA screenshot into per-page images). If any is missing, install it (e.g. `apt-get install poppler-utils`, `pip install pillow --break-system-packages`) rather than substituting a different render path.

## Editable Figma Export

If the user wants the asset as something they can drop into Figma and edit — not just view — read `references/figma-export.md`. It covers three tiers: (A) direct native-Figma build via `use_figma` with the bundled font-swap plugin (`scripts/figma/`), (B) per-page PDF import via `pdfseparate`, and (C) hand-authored editable-text SVG via `scripts/svg-export/`. Don't attempt any of them without reading that file — each has confirmed platform gotchas (Figma sandbox font limits, tspan splitting, EXIF orientation) that are documented there so they don't get re-litigated.
