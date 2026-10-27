---
name: cleartax-deck-skill
description: Create Cleartax-branded slide decks and presentations (16:9 HTML decks with PDF/PPTX export) using Cleartax's 2026 design system (V1.3) — Vault Navy / Nova Blue / Flux Lime tokens, the Inter Tight + Google Sans typography scale, brand-pattern backgrounds, the bundled deck-stage.js navigation runtime, and logo assets, all included inside this skill. Use whenever asked to create, build, recreate, or restyle a deck, presentation, slide deck, or pitch deck for Cleartax — including turning a rough brief, an existing PDF deck, or a plain-text slide outline into a finished deck. For portrait one-pagers/brochures/PDF assets (not decks), use cleartax-asset-skill instead.
---

# Cleartax Deck Skill (2026 Design System V1.3)

## Overview

Use this skill to build finished 16:9 slide decks that read as native Cleartax collateral in the **2026 rebrand (V1.3)** — not a generic AI-deck template, not the retired Nohemi/Gilroy + `#3355FF` look, and not a clone of whatever visual style a reference file happened to use. Reskin content into this system every time, even when working from an existing deck (old PDF export, competitor deck, previous campaign PPTX) as a content/structure reference.

Typical asks: "create a 5-slide deck on X", "recreate this PDF deck with our design system", "build a pitch deck for Y", "turn this outline into a Cleartax-branded presentation", "give me an editable PPTX version of this deck".

**This skill is self-contained.** Every design-system dependency (tokens, fonts, logos, backgrounds, the navigation runtime) is bundled under this skill's own folder. All paths below are relative to this skill's root (the folder containing this SKILL.md).

## Bundled Resources (source of truth — read these, don't hardcode)

- `assets/tokens/Semantics.json` + `Primitives.json` — color tokens. The V1.3 brand ramps live in Primitives as **Vault Navy**, **Nova Blue**, **Flux Lime**, **Ledger White**; Semantics maps them to roles (`Content/Primary`, `Background/Button/Primary/Default`, …).
- `assets/tokens/Typography.json` — font families (`Font/Family/Primary = Inter Tight`, `Secondary = Google Sans`), size / line-height / letter-spacing scales.
- `assets/tokens/Spacing.json`, `Border.json`, `Layout.json` — spacing, radius/border-width, breakpoint/max-width scale.
- `references/Typography Style Guide.pdf` — the human-readable type scale (the table below is transcribed from it).
- `references/v1.3-deck-examples.jpg` — nine approved V1.3 deck slides from the rebrand guide. **Look at this before designing** — it is the target look.
- `assets/fonts/inter-tight/*.woff2` (Medium, SemiBold, Bold) and `assets/fonts/google-sans/*.woff2` (Regular, Medium, SemiBold, MediumItalic) — Latin-subset woff2 files (~25 KB each), ready to base64-embed.
- `assets/logo/Cleartax-logo-black.png` (light backgrounds) / `Cleartax-logo-white.png` (navy/indigo backgrounds); SVG equivalents `Logo-dark.svg` (black) / `Logo.svg` (white). **Never render the logo as typed text.**
- `assets/backgrounds/*.png` — official pattern-only brand backgrounds (transparent RGBA, 1512×800; layer over white or Ledger White with `background-size:cover`). For covers, section dividers, and closing slides:
  - `pattern-1-lime-dot-columns.png` — lime dot columns at both edges, clear centre (centred cover/CTA)
  - `pattern-2-grey-dot-grid.png` — quiet even grey dot grid (any content slide)
  - `pattern-3-dot-ring-center.png` — dot field with a clear oval centre (single-statement / divider slides)
  - `pattern-4-lime-field-spotlight.png` — lime dot field with a clear spotlight top-right (cover with a right-side visual)
  Use the files from `Design system/Background/Brand Pattern - Only Pattern/` if refreshing these — **not** `Brand Pattern/`, whose PNGs have sample headline text baked in.
- `assets/runtime/deck-stage.js` — the slide-navigation web component. Copy it inline; don't re-implement navigation.

If any other document disagrees with the token files on a color or font value, the token files win.

## Color System (V1.3)

| Role | Token | Hex | Use |
|---|---|---|---|
| Ink / primary dark | Vault Navy/950 (`Content/Primary`) | `#05022A` | Headlines, body text on light, dark slide backgrounds, dark pills, chart bars |
| Primary light | Ledger White/100 (`Background/Page/Highlighter`) | `#F2F1F0` | Off-white slide/panel fill |
| Surface | White | `#FFFFFF` | Default slide background, cards |
| Accent 1 — indigo | Nova Blue/500 | `#5446FF` | Big stat numbers, filled feature cards, primary buttons/CTAs, geometric shapes, icon strokes, chart series 1 |
| Indigo hover/pressed | Nova Blue/600 / 700 | `#5336F5` / `#482AD8` | Gradient stops, hover/pressed |
| Indigo tints | Nova Blue/50 / 100 / 200 | `#ECEFFF` / `#DDE1FF` / `#C2C8FF` | Icon chips, soft card fills, the corner "bloom" glow |
| Accent 2 — lime | Flux Lime/500 | `#C8F006` | **Highlighter** behind 1–3 key words, one highlight card per slide, sparkle accents, chart series 2 |
| Lime tints | Flux Lime/100 / 200 | `#F2FFC5` / `#E9FF8F` | Soft lime bloom in corners, light lime bars |
| Text secondary / muted | Neutral/500 / 400 | `#6B7280` / `#9CA3AF` | Captions, labels, axis text |
| Hairline / border | Neutral/200 | `#E5E7EB` | Card outlines, dividers |
| On-dark text | Vault Navy/50, Neutral/50 | `#E6ECFF`, `#F9FAFB` | Text on navy/indigo |
| Status (meaning only) | Negative `#E50000` / subtle `#FACCCC`; Positive `#009933` / subtle `#CCEBD6`; Notice `#FF8000` / subtle `#FFE6CC` | | Risk/penalty/success states — never decoration |

**Usage ratio (from the rebrand guide):** ~50% clean bright neutrals (white / Ledger White), ~30% Vault Navy, ~10% Flux Lime, ~10% Nova Blue. Lime *highlights* key elements; indigo *drives* accents and CTAs.

**Contrast rules:** lime is a fill, never a text color on white — put navy text on lime. White text on Nova Blue and on Vault Navy is fine; navy text on lime is fine; never lime-on-indigo text.

**Retired — do not use:** `#3355FF` / `#2944CC` / `#1F3399` (old brand blue; still present in some `Semantics.json` Brand/Link/Border entries pending cleanup), `#0D0D0D` inverse black as a slide background (use Vault Navy `#05022A`), and anything in Primitives groups marked "(not in use)".

Re-check the token files before each build — verify the hexes above still hold.

## Typography — map every text style to a named token

**Inter Tight** (Primary) for Display and H1–H6. **Google Sans** (Secondary) for Paragraph, Overline, Label. Never use an in-between size — snap to the nearest token. Decks use the **Desktop** column only.

| Role in a deck | Token | Font / weight | Size / LH (px) |
|---|---|---|---|
| Single huge statement / hero number | Display/XLarge | Inter Tight Medium–Semibold | 80 / 88 |
| Big stat in a card / hero stat | Display/Large · Display/Small | Inter Tight Medium–Semibold | 52 / 56 · 44 / 48 |
| Cover title | H1 Large/Desktop | Inter Tight Semibold (Bold max) | 56 / 64 |
| Slide title | H1/Desktop or H2/Desktop | Inter Tight Semibold | 40 / 48 · 36 / 44 |
| Section / column heading | H3/Desktop · H4/Desktop | Inter Tight Semibold | 32 / 40 · 28 / 36 |
| Stat number in a row, sub-heading | H5/Desktop | Inter Tight Medium–Semibold | 24 / 32 |
| Card title | H6/Desktop | Inter Tight Semibold | 20 / 28 |
| Lede paragraph | Paragraph/Large | Google Sans Regular or Medium | 18 / 28 |
| Body, table cells | Paragraph/Medium | Google Sans Regular or Medium | 16 / 24 |
| Card body, captions | Paragraph/Small | Google Sans Regular or Medium | 14 / 20 |
| Fine print, sources | Paragraph/XSmall | Google Sans Regular | 12 / 20 |
| Quote / callout | Paragraph/Special/Italics (L/M) | Google Sans Medium Italic | 18 / 28 · 16 / 24 |
| Eyebrow / kicker (uppercase) | Overline/Large · Small | Google Sans Semibold, uppercase | 14 / 20 · 12 / 20 |
| Buttons, pills, chips, table headers | Label/Large · Medium · Small | Google Sans Medium or Semibold | 16/18 · 14/16 · 12/14 |
| Axis ticks, tiny tags | Label/XSmall | Google Sans Medium | 10 / 14 |

Rebrand typography rules (from `Rebrand.pdf`):
- **No heavy headline weights** — Semibold is the default headline weight; Bold at most; never ExtraBold/Black.
- **One weight per headline** — don't mix weights inside a headline. Emphasis comes from the lime highlighter or an indigo color, not a weight change.
- **Don't cram or loosen line spacing** — use the token line-heights exactly.
- **No other typefaces**, and no icons/images placed inline between words.
- Large headlines may use `Letter-spacing/S` (−0.5px) or `XS` (−1px) at 52px+; body stays at 0.
- Sentence case for headlines and buttons. Overlines are the only all-caps text.

## Canvas & Layout

- Canvas **1440 × 810px** (16:9), authored at 1:1.
- Padding **80px** left/right, **64px** top/bottom → content width **1280px** (= `Layout` max-width).
- Logo: top-left at the padding corner, ~110px wide, on every slide (black on light, white on navy/indigo).
- Spacing tokens (px): 2, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112. Use only these.
- Radius tokens: XS 4, S 8, M 12, L 16, Pill 999, Circle 50%. Feature/stat cards → L (16) or larger rounded blocks as in the examples; buttons → 10px per rebrand button spec (round to S/M if building strictly from tokens); pills/chips → Pill.
- Border width: XS 1, S 1.5, M 2, L 4. Outline cards use 1–1.5px navy or Neutral/200.

## V1.3 Visual Language (match `references/v1.3-deck-examples.jpg`)

- **Light, airy slides.** White or Ledger White background with soft, blurred corner **blooms** — a large radial gradient of Nova Blue/100 (indigo tint) in one corner and Flux Lime/100 in the opposite one, both fading to transparent. Subtle, never a full-slide gradient.
- **Lime highlighter** behind the key phrase of a headline: `background:#C8F006; color:#05022A; border-radius:8px; padding:0 8px; box-decoration-break:clone`. One per slide.
- **Indigo + lime blocks.** Stats and feature items sit in solid Nova Blue cards (white text) with at most one Flux Lime card (navy text) as the counterpoint. Folder-tab-shaped cards (a notch carrying "01", "02") are on-brand.
- **Big stats in indigo** (`#5446FF`, Display/H1 size) with a short Paragraph/Small caption under them.
- **Dark navy pills** for name tags / small CTAs; primary CTA buttons in Nova Blue with white text.
- **Line icons** in indigo stroke on a Nova Blue/50 circular or rounded-square chip; lime only as a small accent dot.
- **Geometric shapes** (circle, rounded square, folder tab, 12-ray burst, pill, 4-point sparkle, scalloped gear-circle, fast-forward chevrons) — always filled Nova Blue; a lime sparkle/burst may peek off a slide edge as a corner accent.
- **Charts:** navy bars on white, indigo + lime as the two series colors, Neutral/400 axis labels, a dashed hairline for targets. Donuts: navy/indigo/lime/indigo-tint segments.
- **Dot-grid motif** via `assets/backgrounds/` on cover, divider, and closing slides.
- **Photography** only when the brief supplies a real photo (e.g. a speaker): cut out on white, framed by overlapping indigo and lime rounded blocks, as in the cover example. Never stock imagery.

## Slide Navigation Runtime

Every deck is one self-contained HTML file:

```html
<deck-stage width="1440" height="810">
  <section data-label="Cover">...</section>
  <section data-label="...">...</section>
</deck-stage>
<script>/* assets/runtime/deck-stage.js, inlined */</script>
```

Copy the full contents of `assets/runtime/deck-stage.js` into an inline `<script>` — don't link it externally and don't reimplement it. It provides keyboard nav (←/→, space, Home/End, number keys, R), click/tap nav with a slide-count overlay, auto-scaling to any viewport, and an `@media print` rule that prints one slide per page (so `--print-to-pdf` just works).

## Slide Archetype Library

Pick per slide by content shape; never repeat the same structure on consecutive slides.

| Content looks like | Archetype |
|---|---|
| Title + framing | **Cover** — overline kicker, H1 Large title with a lime-highlighted phrase, optional speaker photo in indigo/lime frames or a brand-pattern background, navy name pill |
| A big claim + 2–3 numbers | **Stat statement** — H2 title left, indigo Display stats with captions, optional map/diagram on the right |
| 3–4 parallel pillars | **Feature rows / card grid** — indigo filled label cards (icon chip + Label text) paired with outline description cards, or equal-height cards; top-aligned |
| Two contrasting numbers | **Duo tab cards** — one indigo, one lime folder-tab card with "01/02" in the tab and a Display number |
| Metrics / trends | **Dashboard** — hand-built bar/line chart (divs/SVG) in navy/indigo/lime + KPI cards |
| Growth over time | **Stepped bars** — staggered indigo bars growing right with value + year, labelled list on the left |
| Comparison (before/after, BAU vs AI) | **Progress comparison** — horizontal indigo vs lime bars per metric with a small legend |
| Part-to-whole data | **Donut panel** — navy panel with an indigo/lime donut + legend, explanation text on the left |
| Phases / steps | **Roadmap** — phase cards on a track line, milestone dots; numbered only if truly sequential |
| Structured comparison data | **Data table** — Nova Blue/50 header row, Label/Medium headers, hairline rows |
| How something flows | **Flow diagram** — linear chain or radial hub of rounded nodes, indigo connectors |
| Closing / takeaways / CTA | **Closing** — 3 questions or takeaways each with an icon chip, Nova Blue CTA button, lime burst corner accent; or a full Vault Navy slide with white text |

If content fits none of these, compose from the same vocabulary rather than inventing a new visual language.

## Design Guardrails

- **Real logo only**, correct variant per background, as a base64 data URI.
- **Indigo and lime are the only accents.** Status colors mean status. No extra hues for "variety"; for >3 categories use Nova Blue / Flux Lime / Vault Navy / Nova Blue/200 / Neutral/400 before reaching for status colors.
- **One lime highlight per slide.** Lime loses its job if it's everywhere.
- **No old-brand leftovers**: no `#3355FF`, no Nohemi/Gilroy, no black `#0D0D0D` slides.
- **Honest charts** — no part-to-whole visuals for non-additive numbers; use stat cards instead.
- **Numbering means sequence** — 01/02/03 only for ordered content (tab labels on a duo comparison are the one exception, as in the examples).
- **Avoid generic AI-deck defaults** — cream-and-serif, full-bleed purple gradients, an accent line under every title, emoji as icons.
- **Recreating an existing deck**: keep its real content and figures; reskin only the visuals. Don't paraphrase if the user asks for verbatim text.
- **One visual system per deck**, and don't copy a previous deck's exact illustration composition.
- **Label test builds** — prefix test outputs `Deck-Skill Test - …`.

## Production Workflow

0. **Resolve the skill root** and verify `assets/tokens/`, `assets/fonts/`, `assets/logo/`, `assets/backgrounds/`, `assets/runtime/deck-stage.js` exist — a missing font or logo fails silently as a fallback render.
1. **Gather content first.** For a source PDF/deck, render pages (`pdftoppm`) and read exact text/figures before writing HTML.
2. **Open `references/v1.3-deck-examples.jpg`** and decide which archetype each slide uses.
3. **One self-contained HTML file**: a `<style>` block with the color tokens as CSS custom properties, typography utility classes matching the table exactly, shared components (logo, overline, highlighter, stat card, tab card, icon chip, button, bloom background), then one `<section>` per slide inside `<deck-stage width="1440" height="810">`.
4. **Embed `deck-stage.js` inline.**
5. **Embed fonts** via `@font-face` + base64 `data:` URIs from `assets/fonts/` (`font-family:'Inter Tight'` weights 500/600/700; `'Google Sans'` 400/500/600 + 500 italic). Embed only weights you use.
6. **Embed the logo and any background PNG** as base64 data URIs.
7. **QA-render every slide**: `"Google Chrome" --headless --screenshot --window-size=1440,810 "file://.../deck.html#N"` and inspect each one. Assume overflow/overlap/misalignment bugs exist and hunt for them. Also confirm the fonts actually loaded (Inter Tight's tight letterforms vs a fallback sans). If Chrome isn't installed (true on the Cleartax design Mac as of Oct 2026), `qlmanage -t -s 1440 -o . deck.html` renders the HTML through WebKit as a quick check of fonts/colors/layout. It doesn't run `deck-stage.js`, so slides render stacked and unscaled. Install Chrome for real per-slide and PDF QA.
8. **Fix and re-render** until a full pass finds nothing new.
9. **Publish as a Claude Artifact** when the deliverable is for in-chat review/sharing.
10. **Export PDF** when asked: `"Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="<name>.pdf" "file://.../deck.html"`. Verify page count/size (`pdfinfo`), rasterize (`pdftoppm -png -r 150`) and inspect the real output.
11. **Export an editable PPTX** when asked: rebuild with native shapes/text (`python-pptx` in a venv, or `pptxgenjs` if Node is available) — same tokens, same logo, hand-drawn chart shapes. Set fonts to "Inter Tight" / "Google Sans" by name (they render correctly only where installed — tell the user; fallback rendering on a QA machine is expected, not a bug). Content-QA with a `python-pptx` text dump; visual-QA by rendering single-slide files (`qlmanage -t -s 1600 -o . file.pptx` on macOS, or `soffice` + `pdftoppm`) and a fresh-eyes subagent pass. Re-verify after every fix round.
12. **Deliver** HTML + exports to `Deck/Output/` in the Cleartax project folder when working there (otherwise hand them to the user), keeping the HTML source beside the exports.

Tools: Chrome headless, poppler (`pdfinfo`/`pdftoppm`), Python3 + `python-pptx` (or Node + `pptxgenjs`). Install what's missing rather than switching render paths.

## Quality Checklist (verify before delivering)

- [ ] Colors from the V1.3 ramps (Vault Navy, Nova Blue, Flux Lime, Ledger White, Neutral) — no `#3355FF`, no invented hex
- [ ] ~50/30/10/10 neutral/navy/lime/indigo balance; one lime highlight per slide; lime never used as text on white
- [ ] Inter Tight for Display/Headings, Google Sans for everything else; every style maps to a named token; headlines Semibold (Bold max), one weight per headline
- [ ] Real logo PNG on every slide, correct variant per background
- [ ] 1440×810 canvas, 80/64px padding, spacing/radius from tokens
- [ ] `deck-stage.js` inline; keyboard nav and print rule verified
- [ ] Archetypes vary — no back-to-back repeats
- [ ] Charts honest and built from shapes; numbering only for real sequences
- [ ] Every slide screenshotted and inspected; fonts confirmed loaded
- [ ] PPTX (if any) content- and visually-QA'd, re-verified after fixes
- [ ] Test builds labelled as tests
