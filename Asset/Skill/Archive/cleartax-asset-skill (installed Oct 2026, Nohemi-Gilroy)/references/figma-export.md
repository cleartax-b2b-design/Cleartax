# Editable Figma Export — three tiers

Read this only when the user wants the asset editable in Figma (not just a PDF). Format choice matters; pick the cheapest tier that gives the editability actually needed. Paths are relative to this skill's root.

## A. Direct build in Figma via `use_figma` (preferred — genuinely editable, no import step)

Build the asset as real native Figma nodes from the start (`figma.createText()`, `figma.createRectangle()`, auto-layout frames, etc.) instead of exporting anything for import. Every paragraph becomes one genuine auto-wrapping `TEXT` node from the moment it's created — this sidesteps the SVG-import splitting problem entirely (see tier C) because there's no import step at all.

**The font problem and its solution.** `use_figma` executes in a remote/cloud sandbox that can never load Nohemi or Gilroy — confirmed exhaustively: `listAvailableFontsAsync()` returns 0 matches out of ~7,739 fonts every time, there's no font-upload API on the Plugin API surface, importing a *published library style* that references "Gilroy Bold" by name still fails to load the actual font, and this is true regardless of whether the fonts are installed locally on the machine running the session — the sandbox has no visibility into local OS font sync. The fix has two parts:

1. **Build with close fallback fonts** that Figma's hosted catalog does have — **Poppins** stands in for Nohemi, **Inter** stands in for Gilroy (both carry the full Regular/Medium/SemiBold/Bold/ExtraBold range needed). Match every size/weight/line-height to the real token exactly, so the later font swap needs zero layout adjustment.
2. **Swap to the real fonts with a local Figma plugin** — `scripts/figma/font-swap-plugin/nohemi-gilroy/` (`manifest.json` + `code.js`). This plugin runs *inside* Figma's desktop app on a machine that has Nohemi/Gilroy actually installed, where the sandbox limitation above doesn't apply. It walks every text node on every page, matches placeholder (family, style) pairs against a mapping table, and swaps to the real font — self-discovering the exact installed font name via `listAvailableFontsAsync()` at runtime rather than hardcoding a guess. This matters because **Nohemi's font files use inconsistent internal family naming**: only the Regular and Bold weights use a clean `family="Nohemi"` — every other weight (Medium, SemiBold, ExtraBold, etc.) ships as its own separate legacy family name (`"Nohemi SemBd"`, `"Nohemi Med"`, `"Nohemi ExtBd"`, each internally styled just `"Regular"`). The plugin's `NOHEMI_LEGACY_FAMILY`/`NOHEMI_LEGACY_STYLE` maps encode these exact strings, extracted directly from each font file's name table via `fontTools` — don't re-guess them from memory.

**One-time local setup** (per machine + Figma account; macOS-specific as written):

- Nohemi + Gilroy installed system-wide — copy this skill's `assets/fonts/nohemi/*.ttf` and `assets/fonts/gilroy/*.otf` (non-italic) into `~/Library/Fonts/` (no permission dialog needed). Check with `system_profiler SPFontsDataType | grep -i "nohemi\|gilroy"`.
- The plugin imported into Figma desktop: Plugins → Development → Import plugin from manifest… → `scripts/figma/font-swap-plugin/nohemi-gilroy/manifest.json`. Persists in Figma's local dev-plugin list going forward. This step cannot be automated or prompted by the system at all — say so plainly and give the exact click path.
- macOS Accessibility permission granted to **both** the `claude` CLI binary *and* Terminal. Tell the user *before* running the first `osascript` command that macOS will likely open System Settings → Privacy & Security → Accessibility automatically — but they still need to manually toggle **on** both "Terminal" and "Claude" entries themselves; the dialog opening isn't the same as the permission being granted. Without this, `osascript` UI-scripting calls fail with `"osascript is not allowed assistive access"`.
- The correct Figma account/team connected — check with the `whoami` MCP tool (a normal OAuth connect flow; no special handling needed).

`scripts/figma/check-figma-setup.sh` checks the first three conditions automatically and reports exactly which manual step is outstanding, rather than a build failing partway through. The fourth (account) needs the `whoami` MCP tool, which the script can't call itself. `scripts/figma/figma-setup-hook-gate.sh` is an optional `PreToolUse` hook wrapper (register it on `use_figma`/`upload_assets` in the project's `settings.local.json`) that runs the check once per session and surfaces a `systemMessage` if something fails — it never blocks the tool call, since the failures it catches all require manual human action anyway.

**Walk a less-technical user through first-time setup explicitly** — only the account connection is self-explanatory; fonts/permission/plugin-import each need Claude to spell out what's happening and why, because the OS/Figma either show a cryptic error or nothing at all.

**Triggering the plugin from a session** (no manual click needed once set up):

```bash
# 1. ALWAYS verify the correct file is frontmost before clicking anything —
#    this runs against whatever file is currently open in Figma desktop.
osascript -e 'tell application "System Events" to tell process "Figma" to get name of every window'

# 2. Click the plugin via the Plugins > Development submenu
osascript -e 'tell application "System Events" to tell process "Figma" to click menu item "Cleartax Font Swap" of menu 1 of menu item "Development" of menu 1 of menu bar item "Plugins" of menu bar 1'
```

Then verify independently through `use_figma` — don't just trust the plugin's own toast — by reading back `node.getStyledTextSegments(['fontName'])` across all text nodes and confirming zero remaining Poppins/Inter entries.

**Other direct-build notes:**

- Upload photos (cover backgrounds) with `upload_assets` (`nodeId` + `scaleMode:'FILL'` against a pre-sized rectangle, then `curl -X POST` the JPEG bytes to the returned URL) rather than `createNodeFromSvg` with a base64 data URI — cleaner and avoids the EXIF-orientation SVG `<image>` bug entirely (see tier C).
- The logo is safe to inline via `figma.createNodeFromSvg()` even in this direct-build context — it's pure vector paths, no text, so none of the font or splitting issues apply.
- Scrims and the CTA panel gradient use real Figma `GRADIENT_LINEAR` paints, not a simulated gradient — translate the CSS angle to a `gradientTransform` matrix rather than approximating with layered flat rects.
- **Placeholder fonts render slightly taller than the real ones** (Poppins/Inter vs. Nohemi/Gilroy metrics differ) — a page that fit exactly in the original HTML/PDF build can overflow by 100–150px when reconstructed with fallback fonts. Don't fight this with small spacing tweaks; split the overflowing section onto its own page/frame, the same as any other genuine content-density overflow.

## B. Per-page PDF (cheap, when retypable text is enough but native Figma editing isn't required)

Split the final PDF with `pdfseparate`. Figma's native PDF import reads the PDF's real text objects directly and creates genuine editable text layers, as long as the source PDF has real embedded fonts (Chrome's `--print-to-pdf` output qualifies — verify with `pdftotext`). No extra tooling needed — just hand over the files for the user to drag in themselves.

## C. Hand-authored SVG (fallback only — text lands as one layer per *line*, not per paragraph)

`scripts/svg-export/` (`build.py`, `components.py`, `fontembed.py`, `wrap.py`) builds self-contained SVGs with real `<text>` (not outlined), fonts subset to used glyphs and embedded as base64 woff2, photos embedded as base64 JPEG, logo inlined as raw vector paths. Run with `python3 build.py <page-number|all>`; content/layout is hardcoded per asset in `build.py` — adapt it for each new asset (font/logo/background paths already resolve to this skill's bundled `assets/`). Requires `fontTools` and `Pillow` (`pip install fonttools pillow brotli --break-system-packages`).

**Known limitation, confirmed empirically via `figma.createNodeFromSvg()` (the same engine behind Figma's drag-and-drop import) — do not re-litigate this without a new test:** SVG has no native text auto-wrap, so multi-line paragraphs must be pre-wrapped into positioned `<tspan>`s. Figma's SVG importer explodes *any* positioned tspan into its own separate `TEXT` node, regardless of whether they share one parent `<text>` element — a 5-line paragraph always becomes 5 separate text layers. Wrapping the tspans in one `<text>` parent only changes whether Figma groups the resulting layers (`GROUP` wrapper) — it does not merge them into one editable string. There is no SVG markup fix for this; it's a Figma platform limitation. **Prefer tier A (direct build) whenever the user actually wants to keep editing in Figma; only reach for this option when handing over a static one-shot file where per-line text objects are acceptable.**

Two supporting gotchas if this route is used anyway:

- **Margin collapsing must be replicated by hand.** CSS collapses adjacent block margins to `max(prev-bottom, next-top)`; the Python layout cursor does not do this automatically — each component that adds its own top gap (e.g. a sub-heading after a paragraph) must top up only the *difference* over the previous block's trailing gap, not add its full margin on top of it. Getting this wrong silently pushes content into the footer with no error.
- **Strip EXIF orientation from any embedded photo.** Chrome's SVG `<image>` renderer honors an EXIF rotation tag even though its CSS `background-image` path does not — embedding a photo with an orientation tag intact renders sheared/misaligned in the SVG despite looking correct in every HTML/PDF build. Downscale and re-save with `exif=b""` (Pillow) before embedding, keeping the raw pixel orientation as-is. (The background JPEGs bundled in this skill's `assets/backgrounds/` were already re-saved with EXIF stripped, so they're safe to embed directly.)
