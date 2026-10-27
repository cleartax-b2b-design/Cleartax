# Figma — native build and editable export

Read this when the asset must live in Figma (native build, preferred) or be editable there after a PDF build. Paths are relative to this skill's root. Updated 2026-10-23 for V1.3 (Inter Tight + Google Sans) and the **Cleartax |  Design System - WIP** library (note the double space in the library's name).

## A. Native build via `use_figma` (preferred)

Build real Figma nodes from the start — `createText`, `createRectangle`, `createNodeFromSvg` for icons/logo. Every paragraph is one auto-wrapping TEXT node.

### Setup, in order
1. `whoami` → plan keys. Create the file with `create_new_file` in the team the user names (Clear Design = `team::737915672240906879`). Don't create a throwaway file elsewhere first — an abandoned file in the wrong draft folder can't be deleted through the API.
2. `create_session(fileKey, description)`; pass the returned `sessionId` on every later `use_figma` / `get_screenshot` / `search_design_system` call.
3. Load `figma-use` and `figma-generate-design`; pass both in `skillNames`.
4. Fresh files start with one empty page and no libraries enabled.

### Fonts
`use_figma` runs in a hosted sandbox that only sees the Google Fonts catalogue. Inter Tight and Google Sans (and the retired Nohemi/Gilroy) never load there — local installs don't change this. Note `Google Sans Flex` / `Google Sans Code` appear in the list but are **not** Google Sans.

- Build with **Poppins** (stands in for Inter Tight: Bold / SemiBold / Medium) and **Inter** (stands in for Google Sans: Regular / Medium / `Semi Bold` — with a space). Match every size and line-height to the real token so the swap needs zero layout change.
- Swap with the local plugin `scripts/figma/font-swap-plugin/intertight-googlesans/` (Plugins → Development → Import plugin from manifest…, then run it with the target file open in Figma desktop). Verify afterwards by reading `getStyledTextSegments(['fontName'])` and confirming zero Poppins/Inter left.
- Text helper that works: create text → set `fontName`, `characters`, `fontSize`, `lineHeight` (`{unit:'PIXELS',value}`) → `resize(w, h)` → **then** `textAutoResize='HEIGHT'` → position. Setting auto-resize before `resize` collapses wrapping.
- A node whose font can't load still accepts `node.fontName = <loaded substitute>`; after that, `characters` edits work.

### Colours — bind to the DS WIP library
Library key: `lk-97da76fc94c9952fe701865f415af943cd30ce6509b77a2ac4caa4e218311bf7f791c9a737f458c59d4df8a9d390d904e463279a38bf2f80ce540028e57deb81`.

- The library is usually **not enabled** on a new file, so `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` returns nothing for it. Use `search_design_system` (entity `variable`, `includeLibraryKeys`) to get each variable's `key`, then `figma.variables.importVariableByKeyAsync(key)` — this works without enabling the library.
- Search is name-matched; `Text` returned nothing, `Content` found the text colours. Try `Content`, `Background`, `Border`, and primitive names.
- Resolve values by importing and following `VARIABLE_ALIAS` chains before choosing a mapping.

**Semantic colour variables, as resolved on 2026-10-23** (key prefixes shown; fetch full keys by search):

| Variable | Value | Variable | Value |
|---|---|---|---|
| Content/Primary (`08aef824`) | `#05022A` | Background/Primary (`e796d22f`) | `#FFFFFF` |
| Content/Secondary (`757dc1e2`) | `#6B7280` | Background/Hover (`2fd0b7f2`) | `#F2F2F2` |
| Content/Tertiary (`935ad299`) | `#9CA3AF` | Background/Pressed (`61130351`) | `#E5E5E5` |
| Content/Link (`d9b3adc5`) | `#5446FF` | Background/Selected (`cff18c84`) | `#D6DDFF` |
| Content/Link Hover (`62389848`) | `#5336F5` | Background/Info Subtle (`03bded8c`) | `#D6DDFF` |
| Content/Info (`00ed687d`) | `#ADBBFF` | Background/Brand (`87243598`) | `#3355FF` ⚠ retired value |
| Content/Info Bold (`df883474`) | `#2944CC` ⚠ | Background/Brand Hover (`a6644cdd`) | `#2944CC` ⚠ |
| Content/Positive (`7ad07eef`) | `#66C285` | Background/Brand Pressed (`91dbfde7`) | `#1F3399` ⚠ |
| Content/Notice (`a5cee607`) | `#FF8000` | Background/Notice (`c21b81c3`) | `#FF8000` |
| Content/Notice Bold (`5afaf889`) | `#994D00` | Background/Inverse (`67f47b2d`) | `#0D0D0D` ⚠ |
| Border/Brand (`7e2a8ff5`) | `#5446FF` | Background/Positive (`96faf1fd`) | `#009933` |
| Border/Divider (`84d0ee0e`) | `#F2F1F0` | Border/Tertiary (`5e843757`) | `#CCCCCC` |
| Border/Inverse (`b746a13b`) | `#FFFFFF` | Border/Mono (`55e6d158`) | `#0D0D0D` ⚠ |

Primitives exist too (e.g. `Nova Blue/50`, collection `Primitives`). Searches for `Vault Navy` and `Flux Lime` returned nothing on this date.

**Mapping for V1.3 roles** (⚠ = the library does not yet carry the V1.3 value, so ask rather than bind silently):
- Vault Navy ink → `Content/Primary` ✔
- Nova Blue accent (fills, strokes, pills) → `Border/Brand` or `Content/Link` (`#5446FF`) ✔; **do not** bind `Background/Brand` (`#3355FF`, retired).
- Nova Blue tints → Primitives `Nova Blue/50` ✔; `Background/Info Subtle` is the old-blue tint ⚠.
- Body / muted text → `Content/Secondary` / `Content/Tertiary` ✔
- White → `Background/Primary` ✔; Ledger White `#F2F1F0` → `Border/Divider` value ✔ (use for fills only if no better variable exists).
- Flux Lime → no variable found ⚠ — ask the user before using lime in a variable-bound build.

> The Qatar e-invoicing brochure (file `eDESEIYtFBrCeoZizvrj3r`, Clear Design drafts) was bound on 2026-10-23 using the **old** mapping (`Background/Brand` `#3355FF` etc.) before this skill moved to V1.3. Re-map it to the table above if it is revisited.

### Binding recipe
Build the page with plain colours first, then bind in one pass:

```js
const V = {/* name: await figma.variables.importVariableByKeyAsync(key) */};
const NONTEXT = {'#5446FF':'link', '#FFFFFF':'bgPrimary', /* hex → V key */};
const TEXT    = {'#05022A':'cPrimary', '#6B7280':'cSecondary', /* … */};
for (const n of [frame, ...frame.findAll(() => true)]) {
  const map = n.type === 'TEXT' ? TEXT : NONTEXT;
  for (const prop of ['fills','strokes']) {
    const arr = n[prop]; if (arr === figma.mixed || !Array.isArray(arr) || !arr.length) continue;
    n[prop] = arr.map(p => p.type === 'SOLID' && map[toHex(p.color)]
      ? figma.variables.setBoundVariableForPaint(p, 'color', V[map[toHex(p.color)]]) : p);
  }
}
```

Gotchas confirmed in use:
- **`setBoundVariableForPaint` drops the paint's `opacity`.** Re-apply afterwards (`n.fills = n.fills.map(p => ({...p, opacity}))`) on every translucent shape — rings, glass cards, badges on navy.
- **Gradient stops** bind with `gradientStops: stops.map(s => ({position, color, boundVariables:{color:{type:'VARIABLE_ALIAS', id: variable.id}}}))` — it works.
- Text fills bind fine; load the fonts first (`loadFontAsync` for every placeholder style used) or the write throws.
- Binding replaces a colour with the variable's value only at bind time — if a variable resolves to a slightly different hex, the page shifts. Screenshot afterwards; text vertically centred in cards may need re-centring if wrapping changed.
- Unbound leftovers to ignore: the black vector inside the logo's `clip0_…` group is the clip mask, not visible.

### Other native-build notes
- Photos/backgrounds: `upload_assets` onto a pre-sized rectangle (`scaleMode:'FILL'`), then POST the bytes. Pattern PNGs from `assets/backgrounds/` upload the same way.
- Icons: `createNodeFromSvg` with an explicit `width`/`height`/`viewBox`, line style (stroke 1.8, round caps), then `resize` to the slot. Never rebuild icons from rotated primitives. Arrows and dashed elbow connectors also work as small SVGs.
- Gradients use real `GRADIENT_LINEAR` paints. A 160° CSS gradient ≈ `gradientTransform [[0.267,0.733,0],[-0.733,0.267,0.25]]`.
- Name nodes as you create them (`Logo Image`, `Section Heading`, `Page Number`, `Card <title>`) so later clean-up filters and re-flows can find them by name — not by a name you intend to set later.
- Re-flowing a finished page: remove nodes by name prefix, then rebuild the section; return heights from helpers so cards in a row can be equalised.
- Rows of cards: measure text heights after creation, then size the card; equalise heights within a row.

## B. Per-page PDF (when retypable text is enough)
Split the final PDF with `pdfseparate`. Figma's native PDF import reads real text objects as editable text layers if the PDF has embedded fonts (Chrome's `--print-to-pdf` qualifies — verify with `pdftotext`). Hand the files to the user to drag in.

## C. Hand-authored SVG (fallback only — text lands one layer per line)
`scripts/svg-export/` builds SVGs with real `<text>` and base64-embedded fonts. **Legacy:** its font map still points at Nohemi/Gilroy — update `fontembed.py` / `build.py` to Inter Tight / Google Sans before use. Known limitation: Figma's SVG importer explodes every positioned `<tspan>` into its own TEXT node, so paragraphs become one layer per line; prefer tier A whenever the user will keep editing. Strip EXIF orientation from embedded photos (`exif=b""` in Pillow) and replicate CSS margin-collapsing by hand if you use this route.
