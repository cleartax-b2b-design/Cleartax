---
name: asset-skill
description: Create Cleartax-branded visual assets (one-pagers, LinkedIn/social assets, compliance guides, portrait PDFs) using Cleartax's actual design system tokens, typography scale, and logo assets. Use whenever asked to create, recreate, or reskin an asset, brochure, one-pager, PDF, or LinkedIn/social visual for Cleartax.
---

# Cleartax Asset Skill

## Overview

Use this skill to produce finished portrait PDF assets that read as native Cleartax collateral — not a generic template, and not a clone of whatever visual style a reference file happened to use. Reskin content into Cleartax's current brand system every time, even when working from an existing asset (old brochure, competitor asset, previous campaign PDF) as a content/structure reference.

Typical asks this covers: "create a one-pager on X", "recreate this brochure with our design system", "build a LinkedIn asset for Y", "make a compliance guide like Z but on-brand".

## Required References

Read these instead of hardcoding values — they are the source of truth and can change. The vault has been reorganized before without notice (top-level content folders were consolidated into a `{Category}/{Design system, Output, Reference, Skill}` shape) — verify each path below still exists before relying on it, and re-locate it (e.g. `find . -iname "<filename>"`) if not:

- `Design system/Variables/Semantics.json` — color tokens (a single flat file; there is no separate file per market/geography)
- `Design system/Fonts/Typography Style Guide.pdf` and `Design system/Variables/Typography.json` — the exact type scale (sizes, line-heights, weights, letter-spacing) for Display, H1–H6, Paragraph, Label, and Overline. This was reformalized on 2026-07-15 — both files now postdate and supersede any older memory of the scale (the filename was also corrected around the same time; it no longer contains the "Typograpghy" misspelling older notes referred to). Re-diff against these two files periodically — this skill doc can go stale the same way it just did once.
- `Design system/Variables/Spacing.json` and `Design system/Variables/Border.json` — spacing and radius scale
- `Design system/Fonts/Nohemi/Web-TT/*.woff2` and `Design system/Fonts/Gilroy - font/*.otf` — the two brand typefaces
- `Design system/Logo/Logo.svg` (white) and `Design system/Logo/Logo-dark.svg` (black) — vector logo marks. `Design system/Logo/Cleartax-logo-black.png` / `Cleartax-logo-white.png` are raster alternates. Never render the logo as typed text.
- `Design system/Background/Stars/Stars-<n>.jpg` (10 images) — the default cover background source (see Layout System below). `Design system/Background/Gradient/{Dark,Light}/<n>.jpg` are the secondary/alternative photographic-gradient backgrounds.
- `Asset/Script/` — reusable Python tooling for exporting a finished asset as editable-text SVG slides (see "Editable Figma Export" below). Not needed for a normal PDF build.

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

Always pull from the token file rather than reusing these numbers blindly — verify the file still defines them before a build.

## Typography — map every text style to a named token

**Reformalized 2026-07-15** — the table below reflects the current `Typography.json` + `Typography Style Guide.pdf`. If you're reading this after that date, re-diff against those two files before trusting the table blindly; it has already gone stale once (the previous version of this table included a `H4/Extrabold` and `Display/Extrabold` token that no longer exist — Nohemi ExtraBold is still installed as a font file but is **not** part of the sanctioned scale anymore).

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

**Letter-spacing tokens** (from the same `Typography.json`, absolute px, not em/percent — stop hand-picking values like `0.03em`/`0.05em`):

| Token | Value |
|---|---|
| 2XS | -2px |
| XS | -1px |
| S | -0.5px |
| None | 0px |
| XS+ | +0.5px |
| S+ | +1px |
| M+ | +2px |

Practical mapping used across built assets: page section headings → H5/Bold; body copy/table cells/card text → Paragraph/XSmall; running header, table headers, "key insight"-style labels, chip text → Overline/Small or Label/XSmall; big stat numbers → H4/Bold (same 28/36 size the old ExtraBold token used — just swap the weight down to Bold, don't invent a new size to compensate). **Cover headline and subtitle are a deliberate exception that sits outside this formal scale** — `Cover/Hero/Bold` (Nohemi Bold, 68/74, tight tracking `-0.01em`) and `Cover/Subtitle/Medium` (Gilroy Medium, 23/33) directly beneath it. Neither 68/74 nor 23/33 appears anywhere in `Typography.json` — this is a bespoke session convention, not a JSON-defined token, kept because it makes the cover read as a hero moment rather than just the biggest heading in the deck (deliberately larger than Display/Large's 52/56). Keep using it for covers specifically; don't extend the same "exception" logic to any other page. Both cover title and subtitle render as solid white (`#ffffff`), no text-shadow — not a gradient text-fill either; a diagonal white-to-white-alpha gradient fill was tested and rejected in favor of plain white. A blurred `text-shadow` (e.g. `0 2px 16px rgba(0,0,0,0.25)`) was also tested and rejected: some PDF renderers (e.g. macOS Preview/Quartz) rasterize Chrome print-to-pdf's text-shadow blur as a visible semi-opaque rectangle behind the glyphs instead of a soft blur — a real bug, not a one-off rendering quirk, so avoid blurred text-shadow on cover type entirely. The bottom-weighted black scrim already provides enough contrast for white text without it.

## Layout System

- Canvas: A4 portrait, `794×1123px` at 96dpi (`@page { size: 794px 1123px; margin: 0; }`) — matches 595×842pt when printed
- Margins: 56px on all sides
- **Cover page — standard recipe**: background is a photo from `Design system/Background/Stars/Stars-<n>.jpg` (default choice going forward — night-sky/star-trail photography, chosen over the flat CSS brand gradient and the Gradient-folder photos, which are now secondary alternatives, see below) + a bottom-weighted black scrim (`linear-gradient(180deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,.18) 30%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.55) 100%)`) + logo (white) top-left, sized larger than interior-page logos at **32px tall** (not ~20px) + title/subtitle block, top-aligned. No eyebrow chip/pill — the standard recipe is logo → gap → title → subtitle only.
  - **Title/subtitle placement**: top-aligned, not vertically centered. Exact gap: logo's top edge is at `top:44px`; with a 32px-tall logo (bottom edge ≈76px), the title's top edge sits **160px below the logo's bottom edge** (`top:224px` in the standard 56px-margin layout). Eyebrow removed, so nothing sits in that gap — it's clear space. Title and subtitle stack in normal flow directly beneath (title `margin-bottom:26px`), so the block reflows correctly if the title wraps to a different number of lines.
  - **Stars source images are portrait**, unlike the Gradient-folder photos (which are landscape). On the portrait cover canvas, `background-size:cover` still crops one axis — check each image individually and pick `background-position` (top/center/bottom) so the calmest, darkest region of that specific photo sits behind the logo and title; don't assume one position works for all 10 Stars images (some have a bright star-trail swirl or Milky Way core that needs to be cropped away from the text area).
  - **Legacy/alternative backgrounds** (use only if the brief calls for a different mood than night-sky photography): the flat Cleartax brand gradient (`linear-gradient(160deg, #1F3399 0%, #3355FF 55%, #2944CC 100%)` + dot-grid + one abstract geometric graphic + 8px bottom spectrum bar), or `Design system/Background/Gradient/{Dark,Light}/<n>.jpg` (landscape photographic gradients — orient so the darkest region lands at the top behind the logo/title, since `cover`-fit always shows the image's full vertical range on these). Same scrim principle applies either way. When testing multiple candidates for any of these, render one mockup per option plus a contact-sheet thumbnail grid so they can be compared at a glance before picking one.
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
- No stock photography or moody/dark imagery. Use abstract geometric graphics instead (dot-patterns, node networks, radar rings, skyline silhouettes) even if the source reference material used photography.
- Always embed the real logo SVG/PNG — never a hand-typed "cleartax" text wordmark.
- When recreating an existing asset, preserve its content/copy and page structure, but always reskin the *visual* system into current Cleartax brand — don't clone a legacy asset's palette, typeface, or photographic treatment even if that's what the reference file used.
- One visual system per asset: don't mix in a different palette or typeface partway through.
- Section headings are one level deep per page (H5/Bold) — don't introduce ad hoc heading sizes for sub-points; use bold inline text or Overline labels instead.
- Every text style must map to a named typography token — no arbitrary sizes. **Watch table/card components specifically**: when a table or grid feels too tight, the instinct is to shrink its font (e.g. 11.3px, 10.8px) to force-fit content — this silently breaks token compliance. Instead, either accept the larger token size and let the table run onto a second page, or trim/redistribute rows. In one build, tables and cert-cards drifted to off-token sizes (11.3–11.5px) under exactly this pressure; correcting them back to Paragraph/XSmall (12/20) not only fixed the violation but *also* fixed several pages that had read as too sparse — the undersized text had been leaving real estate unused. Token-compliance and page balance are the same problem, not a trade-off.

## Production Workflow

0. **Verify paths first.** Before building, confirm every path in "Required References" and every path below still resolves — this vault gets reorganized without notice, and a stale path fails silently as a missing font/logo/token rather than a loud error.
1. **Read the full source** (every page of the reference asset, if one exists) before writing any HTML — content and structure come from there, visuals do not.
2. **Set up `Asset/Working/<project-name>/index.html`** as a single self-contained file: one shared `<style>` block, one `<section class="page">` per page. (Create `Asset/Working/` if it doesn't exist — it has been wiped by vault reorganization before, even though `Asset/Output/` survived.)
3. **Embed fonts** via `@font-face` using absolute `file://` paths into `Design system/Fonts/Nohemi/Web-TT/*.woff2` and `Design system/Fonts/Gilroy - font/*.otf` (Nohemi has woff2; Gilroy is otf-only).
4. **Build shared chrome/components first** (CSS variables from the token files, header/footer chrome, section heading, paragraph styles, card/table components), then fill in page content.
5. **QA-render to PNG** with headless Chrome (`--headless --screenshot` at the page's pixel width, stacked height = pages × 1123). Split the tall screenshot per-page (e.g. with Python/PIL) and visually review every page.
6. **Fix overflow and imbalance** — dense and sparse pages should feel equally intentional. Prefer pull-quotes/stat-strips/icon cards over stretching font sizes or leaving large dead space.
7. **Render the final PDF**: `chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf-no-header --print-to-pdf="<name>.pdf" --virtual-time-budget=3000 --run-all-compositor-stages-before-draw file://<path>/index.html`. Confirm page count and page size (`pdfinfo`) — should be A4, 595×842pt.
8. **Rasterize and re-verify the actual PDF** (`pdftoppm -png -r 120`) — print rendering can differ subtly from the screenshot QA, so re-check fonts/gradients/spacing on the real output, not just the preview.
9. **Deliver**: copy the final PDF to `Asset/Output/`. Keep the HTML source in `Asset/Working/<project-name>/` for future edits — note this source has been lost to vault reorganization before, so don't treat it as guaranteed durable storage for anything critical. Clean up intermediate QA PNGs from the working folder before finishing.

Tools used throughout: Google Chrome headless (`--screenshot` and `--print-to-pdf`), `pdfinfo`/`pdftoppm` (poppler, for inspecting and rasterizing the output), Python3 + PIL (for splitting a stacked multi-page QA screenshot into per-page images).

## Editable Figma Export

If the user wants the asset as something they can drop into Figma and edit — not just view — the format choice matters, and there are three tiers depending on how much editability is actually needed.

### A. Direct build in Figma via `use_figma` (preferred — genuinely editable, no import step)

Build the asset as real native Figma nodes from the start (`figma.createText()`, `figma.createRectangle()`, `figma.createAutoLayout()`, etc.) instead of exporting anything for import. Every paragraph becomes one genuine auto-wrapping `TEXT` node from the moment it's created — this sidesteps the SVG-import splitting problem entirely (see part C) because there's no import step at all.

**The font problem and its solution.** `use_figma` executes in a remote/cloud sandbox that can never load Nohemi or Gilroy — confirmed exhaustively: `listAvailableFontsAsync()` returns 0 matches out of ~7,739 fonts every time, there's no font-upload API on the Plugin API surface, importing a *published library style* that references "Gilroy Bold" by name still fails to load the actual font, and this is true regardless of whether the fonts are installed locally on the machine running the session — the sandbox has no visibility into local OS font sync. The fix has two parts:
1. **Build with close fallback fonts** that Figma's hosted catalog does have — **Poppins** stands in for Nohemi, **Inter** stands in for Gilroy (both carry the full Regular/Medium/SemiBold/Bold/ExtraBold range we need). Match every size/weight/line-height to the real token exactly, so the later font swap needs zero layout adjustment.
2. **Swap to the real fonts with a local Figma plugin** — `Asset/Script/figma-font-swap-plugin/` (`manifest.json` + `code.js`). This plugin runs *inside* Figma's desktop app on a machine that has Nohemi/Gilroy actually installed, where the sandbox limitation above doesn't apply. It walks every text node on every page, matches placeholder (family, style) pairs against a mapping table, and swaps to the real font — self-discovering the exact installed font name via `listAvailableFontsAsync()` at runtime rather than hardcoding a guess. This matters because **Nohemi's font files use inconsistent internal family naming**: only the Regular and Bold weights use a clean `family="Nohemi"` — every other weight (Medium, SemiBold, ExtraBold, etc.) ships as its own separate legacy family name (`"Nohemi SemBd"`, `"Nohemi Med"`, `"Nohemi ExtBd"`, each internally styled just `"Regular"`). The plugin's `NOHEMI_LEGACY_FAMILY`/`NOHEMI_LEGACY_STYLE` maps encode these exact strings, extracted directly from each font file's name table via `fontTools` — don't re-guess them from memory.

**One-time local setup** (already done on this machine as of 2026-07-13 — verify still true rather than blindly redoing; none of this carries over to a different machine or Figma account):
- Nohemi + Gilroy installed system-wide at `/Library/Fonts/Nohemi/` and `/Library/Fonts/Gilroy - font/` (check with `system_profiler SPFontsDataType | grep -i "nohemi\|gilroy"`).
- The plugin imported into Figma desktop: Plugins → Development → Import plugin from manifest… → `Asset/Script/figma-font-swap-plugin/manifest.json`. Persists in Figma's local dev-plugin list going forward.
- macOS Accessibility permission granted to **both** the `claude` CLI binary *and* Terminal (confirmed by an actual first-run: attempting the `osascript` command below auto-opens System Settings → Privacy & Security → Accessibility, but the user still has to manually toggle both entries on — it does not grant itself, and it does not always add both entries automatically). Without this, `osascript` UI-scripting calls fail with `"osascript is not allowed assistive access"`.
- The correct Figma account/team connected — check with the `whoami` MCP tool. This one already prompts cleanly on its own (a normal OAuth connect flow) — no special handling needed.

`Asset/Script/check-figma-setup.sh` checks the first three conditions automatically and tells you exactly which manual step is outstanding, rather than a build failing partway through. The fourth (account) needs the `whoami` MCP tool, which the script can't call itself.

**This is now hook-enforced, not just documented.** A `PreToolUse` hook on `mcp__claude_ai_Figma__use_figma`/`upload_assets` (in `.claude/settings.local.json`, both the real vault's and this worktree's) runs `Asset/Script/figma-setup-hook-gate.sh` automatically — it calls the check script once per session (gated by a `/tmp` marker keyed on `session_id`, since `use_figma` fires dozens of times per build and re-checking every call would be pure noise) and surfaces a `systemMessage` only if something fails. It never blocks (`continue` is never set to `false`) — the two things it can catch, Accessibility permission and the plugin import, both require manual human action regardless, so blocking the tool call would be disruptive without fixing anything. Because it lives in `settings.local.json` (gitignored, project-scoped), it doesn't travel to a teammate's machine or a different project automatically — re-add it there if this workflow gets used somewhere else.

**First-time setup — walk a less-technical user through this explicitly, don't assume the system explains itself.** Only the account connection (above) is self-explanatory on its own; the other three need Claude to spell out what's happening and why, because the OS/Figma either show a cryptic error or nothing at all:
1. **Fonts**: Claude can just do this — `cp` every file from `Design system/Fonts/Nohemi/OpenType-TT/*.ttf` and `Design system/Fonts/Gilroy - font/Gilroy-*.otf` (non-italic) into `~/Library/Fonts/`. No permission dialog, no user action needed. Just tell the user it's done — that's enough, don't over-explain this one.
2. **Accessibility permission**: tell the user *before* running the first `osascript` command that macOS will likely open System Settings to Privacy & Security → Accessibility automatically — but they still need to manually find and toggle **on** both "Terminal" and "Claude" (or whatever the CLI entry is labeled) in that list themselves; the dialog opening isn't the same as the permission being granted. If it doesn't auto-open, send them there directly and have them click "+" to add the `claude` binary manually (path via `ps -o pid,ppid,comm -p $$` walked up to the top-level `claude` process).
3. **Figma plugin import**: this cannot be automated or prompted by the system at all — say so plainly, then give the exact click path: open the target file in Figma **desktop app** → menu bar **Plugins → Development → Import plugin from manifest…** → select `Asset/Script/figma-font-swap-plugin/manifest.json`. One-time per machine; persists after that.

**Triggering the plugin from a Claude Code session** (no manual click needed once the above is in place):
```bash
# 1. ALWAYS verify the correct file is frontmost before clicking anything —
#    this runs against whatever file is currently open in Figma desktop.
osascript -e 'tell application "System Events" to tell process "Figma" to get name of every window'

# 2. Click the plugin via the Plugins > Development submenu
osascript -e 'tell application "System Events" to tell process "Figma" to click menu item "Cleartax Font Swap" of menu 1 of menu item "Development" of menu 1 of menu bar item "Plugins" of menu bar 1'
```
Then verify independently through `use_figma` — don't just trust the plugin's own toast — by reading back `node.getStyledTextSegments(['fontName'])` across all text nodes and confirming zero remaining Poppins/Inter entries.

**Other direct-build notes:**
- Upload photos (cover backgrounds) with `upload_assets` (`nodeId` + `scaleMode:'FILL'` against a pre-sized rectangle, then `curl -X POST` the JPEG bytes to the returned URL) rather than `createNodeFromSvg` with a base64 data URI — cleaner and avoids the EXIF-orientation SVG `<image>` bug entirely (see part C).
- The logo is safe to inline via `figma.createNodeFromSvg()` even in this direct-build context — it's pure vector paths, no text, so none of the font or splitting issues apply.
- Scrims and the CTA panel gradient use real Figma `GRADIENT_LINEAR` paints, not a simulated gradient — translate the CSS angle to a `gradientTransform` matrix rather than approximating with layered flat rects.
- **Placeholder fonts render slightly taller than the real ones** (Poppins/Inter vs. Nohemi/Gilroy metrics differ) — a page that fit exactly in the original HTML/PDF build can overflow by 100–150px when reconstructed with fallback fonts. Don't fight this with small spacing tweaks; split the overflowing section onto its own page/frame, the same as any other genuine content-density overflow.

### B. Per-page PDF (cheap, when retypable text is enough but native Figma editing isn't required)

Split the final PDF with `pdfseparate`. Figma's native PDF import reads the PDF's real text objects directly and creates genuine editable text layers, as long as the source PDF has real embedded fonts (Chrome's `--print-to-pdf` output qualifies — verify with `pdftotext`). No extra tooling needed — just hand over the files for the user to drag in themselves.

### C. Hand-authored SVG (fallback only — text lands as one layer per *line*, not per paragraph)

`Asset/Script/` (`build.py`, `components.py`, `fontembed.py`, `wrap.py`) builds self-contained SVGs with real `<text>` (not outlined), fonts subset to used glyphs and embedded as base64 woff2, photos embedded as base64 JPEG, logo inlined as raw vector paths. Run with `python3 build.py <page-number|all>`; content/layout is hardcoded per asset in `build.py` — adapt for a new asset.

**Known limitation, confirmed empirically via `figma.createNodeFromSvg()` (the same engine behind Figma's drag-and-drop import) — do not re-litigate this without a new test:** SVG has no native text auto-wrap, so multi-line paragraphs must be pre-wrapped into positioned `<tspan>`s. Figma's SVG importer explodes *any* positioned tspan into its own separate `TEXT` node, regardless of whether they share one parent `<text>` element — a 5-line paragraph always becomes 5 separate text layers. Wrapping the tspans in one `<text>` parent only changes whether Figma groups the resulting layers (`GROUP` wrapper) — it does not merge them into one editable string. There is no SVG markup fix for this; it's a Figma platform limitation. **Prefer option A (direct build) whenever the user actually wants to keep editing in Figma; only reach for this option when handing over a static one-shot file where per-line text objects are acceptable.**

Two supporting gotchas if this route is used anyway:
- **Margin collapsing must be replicated by hand.** CSS collapses adjacent block margins to `max(prev-bottom, next-top)`; the Python layout cursor does not do this automatically — each component that adds its own top gap (e.g. a sub-heading after a paragraph) must top up only the *difference* over the previous block's trailing gap, not add its full margin on top of it. Getting this wrong silently pushes content into the footer with no error.
- **Strip EXIF orientation from any embedded photo.** Chrome's SVG `<image>` renderer honors an EXIF rotation tag even though its CSS `background-image` path does not — embedding a photo with an orientation tag intact renders sheared/misaligned in the SVG despite looking correct in every HTML/PDF build. Downscale and re-save with `exif=b""` (Pillow) before embedding, keeping the raw pixel orientation as-is (don't bake in the EXIF-implied rotation, since that would no longer match the crop already validated in the HTML build).
