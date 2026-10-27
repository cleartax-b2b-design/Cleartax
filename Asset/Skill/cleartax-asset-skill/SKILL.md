---
name: cleartax-asset-skill
description: Create Cleartax-branded visual assets (one-pagers, brochures, LinkedIn/social assets, compliance guides, case studies, portrait PDFs, and native-Figma portrait A4 assets) using Cleartax's 2026 design system (V1.3) — Vault Navy / Nova Blue / Flux Lime tokens, the Inter Tight + Google Sans typography scale, brand-pattern backgrounds, logo marks, and the Cleartax | Design System - WIP Figma variable-binding rules, all bundled inside this skill. Use whenever asked to create, recreate, reskin, or brand an asset, brochure, one-pager, PDF, flyer, playbook, or LinkedIn/social visual for Cleartax — in HTML/PDF or directly in Figma — even if the request doesn't name the design system, the output must still be on-brand, so use this skill.
---

# Cleartax Asset Skill (2026 Design System V1.3)

## Overview

Use this skill to produce finished portrait assets (PDF or native Figma) that read as native Cleartax collateral in the **2026 rebrand (V1.3)** — not a generic template, not the retired Nohemi/Gilroy + `#3355FF` look, and not a clone of whatever visual style a reference file happened to use. Reskin content into the current system every time, even when working from an existing asset (old brochure, competitor asset, previous campaign PDF) as a content/structure reference.

Typical asks: "create a one-pager on X", "recreate this brochure with our design system", "build a LinkedIn asset for Y", "make a compliance guide like Z but on-brand", "create an asset from this content file in Figma".

For 16:9 slide decks use `cleartax-deck-skill`; for landscape page-numbered research reports built natively in Figma use `cleartax-report-skill`. This skill is for portrait A4 assets.

**This skill is self-contained.** Every design-system dependency (tokens, fonts, logos, backgrounds, Figma plugin) is bundled under this skill's folder. All paths below are relative to this skill's root (the folder containing this SKILL.md).

> **Status (rewritten 2026-10-23):** moved from Nohemi/Gilroy + `#3355FF` to V1.3 to match `cleartax-deck-skill`, and gained a native-Figma build workflow with the **Cleartax | Design System - WIP** library rules. The previous version is archived at `Asset/Skill/Archive/` in the Cleartax project folder. Portrait covers using the V1.3 pattern backgrounds have **not** been test-rendered yet — render and check the crop before shipping the first one.

## Bundled Resources (source of truth — read these, don't hardcode)

- `assets/tokens/Semantics.json` + `Primitives.json` — color tokens. V1.3 brand ramps live in Primitives as **Vault Navy**, **Nova Blue**, **Flux Lime**, **Ledger White**; Semantics maps them to roles.
- `assets/tokens/Typography.json` — `Font/Family/Primary = Inter Tight`, `Secondary = Google Sans`, plus size / line-height / letter-spacing scales.
- `assets/tokens/Spacing.json`, `Border.json`, `Layout.json`, `Components.json`.
- `references/Typography Style Guide.pdf` — human-readable type scale (table below is transcribed from it).
- `references/v1.3-deck-examples.jpg` — approved V1.3 slides from the rebrand guide. Target look for colour, shapes, highlighter and icon chips (translate to portrait; don't copy slide layouts).
- `assets/fonts/inter-tight/*.woff2` (Medium, SemiBold, Bold) and `assets/fonts/google-sans/*.woff2` (Regular, Medium, SemiBold, MediumItalic) — Latin-subset woff2, ready to base64-embed.
- `assets/logo/Logo-dark.svg` (black) / `Logo.svg` (white), `Cleartax-logo-black.png` / `Cleartax-logo-white.png`. **Never render the logo as typed text.**
- `assets/backgrounds/pattern-*.png` — official pattern-only brand backgrounds (transparent RGBA, 1512×800, landscape): `pattern-1-lime-dot-columns`, `pattern-2-grey-dot-grid`, `pattern-3-dot-ring-center`, `pattern-4-lime-field-spotlight`. Use files from `Design system/Background/Brand Pattern - Only Pattern/` if refreshing — **not** `Brand Pattern/` (sample headline text baked in).
- `scripts/figma/font-swap-plugin/intertight-googlesans/` — current Figma font-swap dev plugin. `.../nohemi-gilroy/` is **legacy**.
- `scripts/svg-export/` — legacy SVG exporter, still mapped to Nohemi/Gilroy. Needs its font map updated before use; not needed for a normal PDF or native-Figma build.

If any document disagrees with the token files on a colour or font value, the token files win.

## Color System (V1.3)

| Role | Token | Hex | Use |
|---|---|---|---|
| Ink / primary dark | Vault Navy/950 (`Content/Primary`) | `#05022A` | Headlines, body on light, dark cover/closing panels |
| Primary light | Ledger White/100 | `#F2F1F0` | Off-white page/panel fill |
| Surface | White | `#FFFFFF` | Default page background |
| Accent 1 — indigo | Nova Blue/500 | `#5446FF` | Section-heading rules, stats, pills, CTAs, shapes, icon strokes |
| Indigo hover/pressed | Nova Blue/600 / 700 | `#5336F5` / `#482AD8` | Gradient stops, hover/pressed |
| Indigo tints | Nova Blue/50 / 100 / 200 | `#ECEFFF` / `#DDE1FF` / `#C2C8FF` | Icon chips, callout / info-card fills |
| Accent 2 — lime | Flux Lime/500 | `#C8F006` | **Highlighter** behind 1–3 key words, one highlight element per page, sparkle accents |
| Lime tints | Flux Lime/100 / 200 | `#F2FFC5` / `#E9FF8F` | Soft lime bloom, light bars |
| Text secondary / muted | Neutral/500 / 400 | `#6B7280` / `#9CA3AF` | Body-secondary, footers, captions |
| Hairline / border | Neutral/200 | `#E5E7EB` | Card outlines, dividers |
| Card background | Ledger White/100 or Neutral/50 | `#F2F1F0` / `#F9FAFB` | Neutral card fills |
| Status (meaning only) | Negative `#E50000`, Positive `#009933`, Notice `#FF8000` (+ subtles `#FACCCC` / `#CCEBD6` / `#FFE6CC`) | | Risk/penalty/success only — never decoration |

**Usage ratio:** ~50% clean neutrals, ~30% Vault Navy, ~10% Flux Lime, ~10% Nova Blue. Lime *highlights*; indigo *drives* accents and CTAs.

**Contrast:** lime is a fill, never text on white (navy text on lime). White on Nova Blue / Vault Navy is fine. Never lime text on indigo.

**Retired — do not use:** `#3355FF` / `#2944CC` / `#1F3399` (old brand blue, still present in some `Semantics.json` Brand/Link/Border entries and in the DS WIP library's `Background/Brand` pending cleanup), `#0D0D0D` black as a panel background, the `#D6DDFF` old-blue tint, Nohemi/Gilroy, and anything in Primitives groups marked "(not in use)".

Re-check the token files before each build — verify the hexes above still hold.

## Typography — map every text style to a named token

**Inter Tight** (Primary) for Display and H1–H6. **Google Sans** (Secondary) for Paragraph, Overline, Label. Snap to the nearest token; never an in-between size. Portrait assets use the **Desktop** column.

| Token | Font / weight | Size / LH (px) |
|---|---|---|
| Display/XLarge | Inter Tight Medium–Semibold | 80 / 88 |
| Display/Large · Small | Inter Tight Medium–Semibold | 52 / 56 · 44 / 48 |
| H1 Large | Inter Tight Semibold (Bold max) | 56 / 64 |
| H1 · H2 | Inter Tight Semibold | 40 / 48 · 36 / 44 |
| H3 · H4 | Inter Tight Semibold | 32 / 40 · 28 / 36 |
| H5 · H6 | Inter Tight Semibold | 24 / 32 · 20 / 28 |
| Paragraph/Large · Medium | Google Sans Regular or Medium | 18 / 28 · 16 / 24 |
| Paragraph/Small · XSmall | Google Sans Regular or Medium | 14 / 20 · 12 / 20 |
| Paragraph/Special/Italics (L/M) | Google Sans Medium Italic | 18 / 28 · 16 / 24 |
| Overline/Large · Small | Google Sans Semibold, uppercase | 14 / 20 · 12 / 20 |
| Label/Large · Medium · Small · XSmall | Google Sans Medium or Semibold | 16/18 · 14/16 · 12/14 · 10/14 |

Rebrand typography rules (`Rebrand.pdf`):
- Semibold is the default headline weight; Bold at most; never ExtraBold/Black. One weight per headline — emphasis comes from the lime highlighter or indigo, not weight.
- Use token line-heights exactly; no cramming/loosening.
- No other typefaces; no icons/images inline between words.
- Letter-spacing tokens: `S` −0.5px or `XS` −1px allowed at 52px+; body stays 0. Sentence case for headlines and buttons; overlines are the only all-caps text.

**Cover title** deliberately sits above the scale: use **H1 Large 56/64** (or Display/Small 44/48 for long titles), Inter Tight Semibold, white on navy. Cover subtitle: Paragraph/Large 18/28 Google Sans Medium. Do not extend the exception to interior pages.

## Layout System

- Canvas: A4 portrait **794×1123px** at 96dpi (`@page { size: 794px 1123px; margin: 0; }` → 595×842pt). Margins **56px** all sides, content width **682px**.
- Spacing tokens (px): 2, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64 … Radius: XS 4, S 8, M 12, L 16, Pill 999. Border width: 1 / 1.5 / 2 / 4.
- **Cover — standard recipe:** Vault Navy background + one brand pattern PNG (`pattern-3-dot-ring-center` or `pattern-1-lime-dot-columns`, `background-size:cover`, check the portrait crop per image) + white logo top-left at **32px tall** (top 44px) + title block top-aligned with its top edge **160px below the logo's bottom edge** (`top:224px`) + subtitle beneath (title `margin-bottom:26px`). No eyebrow chip. Optional: a single lime highlighter phrase in the title. Alternative light cover: Ledger White background with soft Nova Blue/100 + Flux Lime/100 corner blooms and the dark logo.
- **Interior page chrome:** dark logo top-left (~20px tall) + uppercase running title top-right (Overline/Small, Neutral/400) + 1px divider at y≈84 + content from y≈130 + 1px footer rule at y=1055 + footer row (`cleartax.com` left, page number right, Label/XSmall, y≈1071).
- **Section heading:** H5 Inter Tight Semibold in Vault Navy or Nova Blue, followed by a 38×4 Nova Blue rounded rule. One heading level per page — use bold inline text or Overline labels for sub-points.
- **Closing/CTA page:** bookend with a Vault Navy or Nova Blue panel matching the cover, rather than ending flat on white.

## Component Library

Reuse rather than invent per asset (colours per the V1.3 table):

- **Pull-quote** — 4px Nova Blue left bar + H5 text in Vault Navy. Always reuses a sentence already in the source copy.
- **Pill-banner** — solid Nova Blue pill, white Inter Tight text.
- **Tag-chip grid** — 2×2+ neutral or navy rounded chips.
- **Icon-badge card** — circular badge (Nova Blue/50 fill, Nova Blue line icon) + text, solo or stacked.
- **Info-card / callout** — Nova Blue/50 fill, 4px Nova Blue left bar, Overline label + Paragraph body.
- **Comparison table** — header row Nova Blue/50 with Label-style navy labels, body Paragraph/XSmall, zebra via Neutral/50.
- **Stat-strip** — 3-col neutral cards, big H4 number in Nova Blue + Paragraph/XSmall label.
- **Timeline** — vertical rail in Nova Blue/100, circular nodes (filled Nova Blue for the key milestone), one card per milestone.
- **Flow diagram** — rounded nodes (white/outlined for actors, Nova Blue and Vault Navy fills for platforms), line arrows with small captions, dashed elbow connector for delivery paths.
- **Lime highlighter** — navy text on `#C8F006`, radius 8, 1–3 words, once per page.

Use pull-quotes, stat-strips and icon-badge cards to balance a sparse page — never inflated font sizes or invented copy.

## Design Guardrails

- Only colours from the token files / the DS WIP library — never an invented hex.
- **Indigo and lime are the only accents**; status colours mean status. For >3 categories use Nova Blue / Flux Lime / Vault Navy / Nova Blue/200 / Neutral/400 before reaching for status colours.
- No stock or moody photography on content pages; abstract geometric shapes and the dot-grid motif instead. Photography only when the brief supplies a real photo.
- Real logo only, correct variant per background.
- **Content-file-only text:** never add text that isn't in the provided content file. Chrome (running title taken from the content's own wording, `cleartax.com`, page numbers) is the exception. Icons and graphics stand in for decoration, never text stand-ins.
- Reskin the visual system when recreating an old asset; keep its copy and structure.
- One visual system per asset.
- Every text style maps to a named token. When a table/card feels tight, don't shrink the font — take the next token, trim rows, or split the page. Token compliance and page balance are the same problem.
- Avoid generic AI defaults: cream-and-serif, full-bleed purple gradients, an accent line under every title, emoji as icons.

## Production Workflow — HTML → PDF

0. Resolve the skill root; verify `assets/tokens`, `assets/fonts`, `assets/logo`, `assets/backgrounds` exist (a missing font/logo fails silently as a fallback render).
1. Read the full source content (every page of any reference asset) before writing HTML — content and structure from there, visuals not.
2. One self-contained `index.html`: one `<style>` block with colour tokens as CSS custom properties and typography utility classes matching the table exactly; one `<section class="page">` per page.
3. Embed fonts via `@font-face` + base64 `data:` URIs (`'Inter Tight'` 500/600/700; `'Google Sans'` 400/500/600 + 500 italic). Embed only weights used. Embed the logo and any background PNG as base64 too.
4. Build shared chrome/components first, then page content.
5. QA-render each page (headless Chrome `--screenshot --window-size=794,1123`, or `qlmanage -t` through WebKit if Chrome isn't installed — as of Oct 2026 it isn't on the design Mac). Hunt for overflow, overlap, imbalance; confirm Inter Tight actually loaded (tight letterforms vs fallback).
6. Fix, then render the final PDF: `chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=<name>.pdf file://…/index.html`. Verify `pdfinfo` = 595×842pt, rasterize with `pdftoppm -png -r 120` and re-check the real output.
7. Deliver the PDF with the HTML source beside it; clean up QA PNGs.

## Production Workflow — Native Figma (editable asset)

Read `references/figma-export.md` first. Summary of the current setup:

1. **File:** if the user names a team/draft, create the file there (`create_new_file`, `planKey` from `whoami`). The Clear Design team is `team::737915672240906879`; "Mohammed Shafin's team" is `team::1640982223503501504`. Then `create_session` with the returned file key and pass its `sessionId` on every file tool. Load the `figma-use` and `figma-generate-design` skills before `use_figma`.
2. **Frames:** one 794×1123 frame per page, laid out left-to-right at a 914px pitch (120px gap), named `Page N — <Topic>`.
3. **Fonts:** the hosted `use_figma` session cannot load Inter Tight or Google Sans (or Nohemi/Gilroy). Build with placeholders at the exact token sizes — **Poppins** for Inter Tight, **Inter** for Google Sans (style names `Semi Bold` for Inter) — then swap with the local plugin `scripts/figma/font-swap-plugin/intertight-googlesans/`. Placeholders render slightly taller than the real fonts: split a page rather than shrinking text.
4. **Colours:** bind to the **Cleartax |  Design System - WIP** library variables, not raw hex — see the mapping and gotchas in `references/figma-export.md`.
5. **Logo:** `figma.createNodeFromSvg()` with `Logo-dark.svg`, or the same string with `#05022A` → `#FFFFFF` for the white version. Name the node `Logo Image`. Ignore the black clip-mask vector inside it.
6. **Check each page** with `get_screenshot`; a page whose content bottom passes y=1055 collides with the footer — re-flow (e.g. pair short cards in two columns, give long lists a full-width card) rather than overlapping.

## Quality Checklist (verify before delivering)

- [ ] Colours from the V1.3 ramps (or DS WIP variables) — no `#3355FF`, no invented hex
- [ ] ~50/30/10/10 balance; one lime highlight per page; lime never text on white
- [ ] Inter Tight for Display/Headings, Google Sans for everything else; every style maps to a token; headlines Semibold (Bold max)
- [ ] Real logo, correct variant per background (cover logo 32px, interior ~20px)
- [ ] 794×1123 canvas, 56px margins, nothing below y=1055 on interior pages
- [ ] Text only from the content file (plus chrome)
- [ ] Every page screenshotted and inspected; fonts confirmed loaded (or placeholders swapped)
- [ ] Figma builds: variables bound, translucent shapes keep their opacity, session ID used throughout
