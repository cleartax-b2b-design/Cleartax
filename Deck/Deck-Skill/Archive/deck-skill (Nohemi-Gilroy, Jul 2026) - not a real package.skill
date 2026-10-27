---
name: deck-skill
description: Create Cleartax-branded slide decks and presentations (16:9 HTML decks with PDF/PPTX export) using Cleartax's actual design system tokens, typography scale, deck navigation runtime, and logo assets. Use whenever asked to create, build, recreate, or restyle a deck, presentation, slide deck, or pitch deck for Cleartax — including turning a rough brief, an existing PDF deck, or a plain-text slide outline into a finished deck. For portrait one-pagers/brochures/PDF assets (not decks), use asset-skill instead.
---

# Cleartax Deck Skill

## Overview

Use this skill to build finished 16:9 slide decks that read as native Cleartax collateral — not a generic AI-deck template, and not a clone of whatever visual style a reference file happened to use. Reskin content into Cleartax's current brand system every time, even when working from an existing deck (old PDF export, competitor deck, previous campaign PPTX) as a content/structure reference.

Typical asks this covers: "create a 5-slide deck on X", "recreate this PDF deck with our design system", "build a pitch deck for Y", "turn this outline into a Cleartax-branded presentation", "give me an editable PPTX version of this deck".

`Deck/Tester/` holds test-only briefs (currently `testdeck.txt`) for exercising this skill end-to-end — its own `README.md` explicitly says nothing in that folder is production content. When building from something in `Deck/Tester/`, label the output clearly as a test artifact (e.g. prefix the filename with `Deck-Skill Test - `) instead of using a plain deliverable-looking name, so it can't be mistaken for a real client deck sitting in `Deck/Output/`.

## Required References

Read these instead of hardcoding values — they are the source of truth and can change:

- `Design system/Variables/Semantics.json` — color tokens (a single flat file; there is no longer a per-market split — if one reappears, e.g. a `UAE.json`, check it before falling back to the generic file)
- `Design system/Fonts/Typograpghy Style Guide.pdf` — the exact type scale (sizes, line-heights, weights) for Display, H1–H6, Paragraph, Overline, and Label. (The filename really is misspelled "Typograpghy" — that's the actual file on disk, not a typo to fix.)
- `Design system/Variables/Spacing.json`, `Border.json`, and `Layout.json` — spacing, radius/border, and breakpoint/max-width scale
- `Design system/Fonts/Nohemi/Web-TT/*.woff2` and `Design system/Fonts/Gilroy - font/*.otf` — the two brand typefaces (Nohemi ships as woff2; Gilroy is otf-only)
- `Design system/Logo/Cleartax-logo-black.png` (light backgrounds) and `Design system/Logo/Cleartax-logo-white.png` (dark/brand-color backgrounds) — the only acceptable logo marks. SVG equivalents also exist (`Logo.svg`, `Logo-dark.svg`) if a vector source is ever needed. **Never render the logo as typed text.**
- `HTML Presentation/System/runtime/deck-stage.js` — the slide-navigation web component (see below). Copy it inline; don't re-implement navigation from scratch.

If a different `.skill` file in this project ever disagrees with the token files above on a color or font value, the token files win — treat the discrepancy as that other file being stale, not as a second valid palette.

**A note on paths in this section**: this project's folder gets reorganized externally (Drive sync, manual renames) between sessions — every path above has already moved at least once. Before relying on any of them, confirm with a quick `find`/`ls` that the file is still where this document says; if it has moved, treat that as the current truth and update this file rather than assuming the doc is right.

## Color Tokens (Cleartax brand, from Semantics)

- Brand: `#3355FF` — headings accents, primary buttons/pills, links, focus states
- Brand hover: `#2944CC`, Brand pressed: `#1F3399` — hover/active states, gradient stops
- Brand/Info subtle: `#D6DDFF` — light-blue tint fills (callouts, chips, table header tints)
- Ink (body text on white): `#111827` — Primitives Neutral.900
- Ink secondary: `#374151` — Neutral.700, default paragraph text
- Ink muted: `#6B7280` — Neutral.500, captions/secondary labels
- Ink faint: `#D1D5DB` — Neutral.300, disabled/quiet accents
- Border: `#E5E7EB` — Neutral.200, hairlines and card borders
- Surface: `#FFFFFF`; Surface tint: `#F9FAFB` — Neutral.50, neutral card fills
- Dark/Inverse background: `#0D0D0D` — cover slides, CTA blocks that need a dark treatment
- On-dark text: primary `#F9FAFB`, secondary `#D9D9D9`, muted `#808080`
- Negative (risk/penalty content): `#E50000`, subtle tint `#FEF2F2`/`#FACCCC`, bold `#B70000`
- Positive: `#009933`, subtle tint `#CCEBD6`, content-positive `#66C285`
- Notice: `#FF8000`, subtle tint `#FFE6CC`

Optional category-coding accents (from Primitives, for things like a 4-stage phase timeline that needs 4 distinct hues): Success `#22C55E`, Secondary.Pink `#EC4899`, Notice/Orange `#FF8000`, Secondary.Violet `#8B5CF6`. These are secondary — the brand blue stays the one dominant accent everywhere else.

Always re-check the token file before a build rather than reusing these numbers blindly — verify it still defines them, and check for a market-specific override.

## Typography — map every text style to a named token

Nohemi is used for Display and H1–H6 only. Gilroy is used for Paragraph, Overline, and Label. Never use an arbitrary in-between size — always round to the nearest defined token.

| Role | Token | Font / weight | Size / line-height (px) |
|---|---|---|---|
| Hero / biggest stat | Display/Large | Nohemi Medium–ExtraBold | 52 / 56 |
| Cover title | H1/Desktop | Nohemi Bold or ExtraBold | 40 / 48 |
| Slide section title | H2/Desktop | Nohemi SemiBold or Bold | 36 / 44 |
| Card/column heading | H3/Desktop | Nohemi SemiBold | 32 / 40 |
| Sub-heading | H4/Desktop | Nohemi SemiBold | 28 / 36 |
| Small heading / KPI number | H5/Desktop | Nohemi SemiBold or Bold | 24 / 32 |
| Card title | H6/Desktop | Nohemi SemiBold | 20 / 28 |
| Intro / lede paragraph | Paragraph/Large | Gilroy Regular | 18 / 28 |
| Body copy, table cells | Paragraph/Medium | Gilroy Regular | 16 / 24 |
| Captions, card body | Paragraph/Small | Gilroy Regular | 14 / 20 |
| Fine print | Paragraph/XSmall | Gilroy Regular | 12 / 20 |
| Eyebrow / kicker | Overline/Small | Gilroy SemiBold, uppercase, +0.06–0.08em tracking | 12 / 20 |
| Pills, chips, table headers | Label/Medium–Small | Gilroy SemiBold | 14/16 or 12/14 |

Mobile sizes exist in the source PDF one step down from Desktop for H1–H6 (e.g. H1/Mobile is 36/44) — decks are desktop/16:9 only, so use the Desktop column unless a slide is explicitly being adapted for a narrow viewport.

Paragraph also has a documented Special axis (Underline, Strikethrough, Italic) at every size — reach for Italic on callout/quote text rather than inventing a new style.

## Canvas & Layout

- Canvas: **1440 × 810px** (16:9), authored at 1:1 pixel scale.
- Padding: **80px** left/right, **64px** top/bottom → content width **1280px** — this is not arbitrary: it exactly matches the `Layout.Max-width` token (1280), so the deck's content column and the web/product content column stay visually consistent.
- Spacing scale (`Spacing` tokens, px): 2, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112 — named XXS→12XL. Use these for every gap/margin; don't eyeball a random px value.
- Radius scale (`Border` tokens): XS 4, S 8, M 12, L 16, Pill 999, Circle 50%. Cards/chips → M or L; pills/badges → Pill; avatars/dots → Circle.
- Border width: XS 1, S 1.5, M 2, L 4, XL 8. Hairlines use XS/S; accent bars/left-borders use L.

## Slide Navigation Runtime

Every deck is a single self-contained HTML file using the `<deck-stage>` web component:

```html
<deck-stage width="1440" height="810">
  <section data-label="Cover">...</section>
  <section data-label="...">...</section>
</deck-stage>
<script>/* deck-stage.js contents, inlined */</script>
```

Copy the full contents of `HTML Presentation/System/runtime/deck-stage.js` into an inline `<script>` tag — do not link it externally (self-contained artifacts can't make outside requests) and do not reimplement it. It gives you, for free:

- Keyboard nav (←/→, space, Home/End, number keys, R to reset) and click/tap nav with a fading slide-count overlay
- Auto-scaling to fit any viewport while preserving the authored 1440×810 geometry
- A built-in `@media print` rule that lays out one slide per printed page at full design size — this is what makes `--print-to-pdf` produce a clean, one-slide-per-page PDF with zero extra setup

## Slide Archetype Library

Choose per slide based on the content shape — vary archetypes across a deck; never repeat the same structure on consecutive slides.

| Content looks like | Archetype |
|---|---|
| Title, subtitle, framing paragraph | **Cover** — kicker + big Nohemi title (one word/phrase can carry the brand-blue accent) + subtitle + supporting paragraph, optional hero diagram beside/below it |
| 3–4 parallel benefits/pillars, each with a couple of points and maybe a stat | **Card grid** — equal-height cards, icon badge (brand-subtle circle/square + emoji or simple glyph) + H6 title + 1–3 short bullets + optional stat chip footer; top-aligned content throughout |
| Metrics that should read like a report/dashboard | **Dashboard** — hand-drawn bar/line chart(s) (plain divs/SVG shapes, not a native chart object, so you control exactly which data point gets the brand-blue highlight) + a row of KPI stat cards below |
| A sequence of phases/steps with durations | **Roadmap/timeline** — horizontal row of phase cards under a connecting track line with a milestone dot/icon per phase; a "Weeks X–Y" or "Phase N" tag per card |
| Structured comparison data (fines, formats, requirements) | **Data table** — semantic-colored header row (e.g. `Negative`/red for a penalty table), tinted body rows, generous cell padding |
| "How X flows between parties" / "how the system works" | **Network/flow diagram** — either a **linear chain** (peer nodes left-to-right joined by connectors) or a **radial hub** (center node + nodes arranged around it, joined by spokes); pick whichever matches the story, and don't reuse the exact same composition on two different decks in the same session |
| Closing statement + call to action | **Closing/CTA** — solid brand-blue (or dark) background, white text, a short checklist of takeaways, a CTA pill button, optional footer line |

If a slide's content fits none of these cleanly, compose from the same vocabulary (Nohemi headline, brand-blue accent, rounded cards, the type/spacing tokens above) rather than inventing an unrelated visual language.

## Design Guardrails

- **Real logo only.** Embed the actual `Design system/Logo/Cleartax-logo-black.png` or `-white.png` (matching the slide's background) as a data URI. Never type "cleartax" as a text wordmark, even stylized.
- **One dominant accent.** Brand blue carries the deck. Semantic colors (negative/positive/notice) mean status, not decoration — don't reach for them just for variety. The optional 4-hue category palette is for genuinely multi-category content only (e.g. a 4-phase timeline), not a general accent replacement.
- **No stock photography or moody dark imagery.** Build diagrams/illustrations from simple shapes (circles, lines, rounded cards, emoji-in-a-badge) — abstract and on-brand, not decorative.
- **Don't build a misleading chart.** If the underlying numbers aren't strictly additive or comparable (e.g. category counts that don't sum to a stated total), use independent stat cards instead of a stacked/part-to-whole chart that implies a relationship the data doesn't support.
- **Numbering means something.** Only use numbered steps/phases (01/02/03, Phase N) when the content is genuinely sequential. Don't decorate a non-sequential list with numbers just for visual rhythm.
- **Avoid generic AI-deck defaults** unless the brief specifically asks for that look: warm-cream-and-serif, purple-to-blue gradient hero, `rounded-lg` on absolutely everything, an accent line under every title, emoji as section markers. Ground each deck in its actual subject and this brand's actual tokens instead.
- **When recreating an existing deck/PDF**, preserve its real content, figures, and claims — reskin the *visual* system into current Cleartax brand, don't clone the source's palette, typeface, or photographic treatment. If the user asks for text preserved verbatim, don't paraphrase; if they don't, you may tighten prose for slide format as long as facts/figures are unchanged.
- **One visual system per deck** — don't mix in a different template's visual language partway through, and don't reuse a previous deck's specific illustration composition verbatim in a new deck.

## Production Workflow

1. **Gather content first.** If recreating an existing PDF/deck, render its pages (`pdftoppm`) and read the exact text/figures before writing any HTML — content and facts come from there.
2. **Set up one self-contained HTML file**: a shared `<style>` block defining the tokens above as CSS custom properties plus typography utility classes matching the table exactly, and one `<section>` per slide inside `<deck-stage width="1440" height="810">`.
3. **Embed `deck-stage.js` inline** (copy from the runtime file above).
4. **Embed fonts** via `@font-face` + base64 `data:` URIs — a curated weight subset is enough (Nohemi Regular/Medium/SemiBold/Bold/ExtraBold; Gilroy the same five plus Regular Italic). Embedding every weight bloats the file for no benefit.
5. **Embed the real logo** PNGs as base64 `data:` URIs, swapping black/white per slide background.
6. **Build shared chrome first** (logo position, kicker/overline style, the typography classes, card/table components), then fill in slide content — pick an archetype per slide, varying them.
7. **QA-render every slide**: headless Chrome screenshot per slide (`--headless --screenshot --window-size=1440,810 "file://.../deck.html#N"`) and visually inspect each one. Assume there are bugs — overflow, overlap, misalignment — and look for them; don't stop at the first clean-looking render.
8. **Fix and re-render** until a full pass finds nothing new.
9. **Publish as a Claude Artifact** when the deliverable is for in-chat review/sharing.
10. **Export PDF** when asked: `chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="<name>.pdf" "file://.../deck.html"` — this relies on `deck-stage.js`'s injected print rule for clean one-slide-per-page output. Verify page count/size (`pdfinfo` or `pypdf`), then rasterize (`pdftoppm -png -r 150`) and eyeball the real output, not just the HTML screenshot.
11. **Export an editable PPTX** when asked: rebuild the same design with `pptxgenjs` (native shapes/text, not a screenshot) — same tokens, same logo, hand-drawn shapes for charts/diagrams so colors stay exact. If reusing a build script across sessions, its logo/font path constants are hardcoded strings, not references to this doc — they will not follow a location change on their own. Update them to the current `Design system/Logo` / `Design system/Fonts` paths (see Required References) before trusting a rebuild, the same way you'd check any other path in this file. Content-QA the result with `python-pptx` (dump every shape's text, check nothing's missing/duplicated). Visual-QA it: split the deck into single-slide `.pptx` files (`python-pptx`, delete all slides but one) and render each with `qlmanage -t -s 1600 -o . file.pptx` (fast, ships with macOS, no install needed) — or `soffice --headless --convert-to pdf` + `pdftoppm` if LibreOffice is already installed. Dispatch a fresh-eyes subagent to hunt for overlaps/overflow/contrast/alignment issues (ignore font-substitution — Nohemi/Gilroy may render as a fallback font on the QA machine, that's expected, not a bug). Fix, then re-verify at least once — a fix in one spot can introduce a new bug elsewhere (e.g. a bullet's hanging indent escaping its card after a padding change).
12. **Deliver** to `Deck/Output/` (exports/working deliverables) or `Deck/Reference/` (a finished, delivered deck — this folder also doubles as inspiration/source-deck storage, so it's not exclusively an output location) — never `Asset/Output/`, which is `asset-skill`'s output folder for one-pager/brochure assets, not decks.

## Quality Checklist (verify before delivering)

- [ ] Colors pulled from `Design system/Variables/Semantics.json` — no invented hex values
- [ ] Real `Design system/Logo` PNG on every slide, correct black/white variant per background — never a typed wordmark
- [ ] Every text style maps to a named Display/H1–H6/Paragraph/Overline/Label token — no arbitrary sizes
- [ ] Canvas is 1440×810 with 80px/64px padding (1280px content width)
- [ ] `deck-stage.js` embedded inline; keyboard nav and the print rule both verified
- [ ] Archetypes vary across the deck — no back-to-back repeats of the same layout
- [ ] Any chart/diagram is honest (no misleading additive visuals) and built from shapes, not stock imagery
- [ ] Numbered/sequential devices used only where content is genuinely ordered
- [ ] Every slide screenshotted and visually inspected at least once — assume bugs exist until proven otherwise
- [ ] If exporting PPTX: content QA'd via python-pptx text dump, visually QA'd via rendered images with a fresh-eyes pass, re-verified after every fix round
- [ ] Output saved to `Deck/Output/` or `Deck/Reference/`
