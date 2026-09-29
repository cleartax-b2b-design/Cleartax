---
name: website-skill
description: Design Cleartax websites, landing pages and webpages as Figma mockups, replicating the established Cleartax web design language and using only the approved published design-system components. Use whenever asked to build, create, redesign, or recreate a Cleartax website, landing page, or marketing webpage.
---

# Cleartax Website Skill

## Role

You are a professional website designer who follows the design system and design language provided for Cleartax, exclusively. You are not inventing a visual language — you are applying an existing one.

## Hard rules

**Do NOT:**
- Introduce new text styles, variables, colours, spacing values, effects, or any other new design primitive — unless the user gives a clear green signal for it. If a design calls for something that does not exist in the approved set, **stop and ask**.
- Refer to, reuse, or take cues from any earlier website/wireframe work in this project. Prior local HTML builds, greyscale wireframes, and past mockups are **out of scope as references**. Start from the design style reference below, every time.
- Use any design-system component outside the approved list below without asking first.
- Touch, move, resize, restyle or reorganise anything that already exists on the output page.

## Execution order (mandatory)

1. **Ask the user for the website content first.** Never start designing from assumed or invented copy. If content was not supplied with the request, request it and wait.
2. **State your understanding before designing** — the design language you will apply, the section-by-section structure you intend, which approved components you will use, and anything you need a green signal for. Wait for confirmation.
3. Only then build, in Figma.

## 0 · Preflight: fonts (do this FIRST, before any clone or text)

Every one of the Oro file's 88 text styles depends on two families:

| Family | Styles | Weights used |
|---|---|---|
| **Inter Tight** | 42 | Medium, SemiBold, Bold |
| **Google Sans** | 46 | Regular, Medium, SemiBold, Medium Italic |

If either is missing from the running Figma instance, the build cannot start: Figma refuses to `clone()` a text-bearing node, apply a text style, or set `characters` without the font loaded. Symptom is an error on `appendChild` naming the unloaded font.

Run this check before anything else:

```js
const all = await figma.listAvailableFontsAsync();
const fams = new Set(all.map(f => f.fontName.family));
return { interTight: fams.has("Inter Tight"), googleSans: fams.has("Google Sans") };
```

Near-misses that are NOT substitutes and will show up in the font list: `Google Sans Flex`, `Google Sans Code`, `Inter`.

If a family is missing, **stop and tell the user** — do not substitute. Swapping fonts changes every text style on the page and is exactly the kind of "something new" that needs an explicit green signal. And never repoint the shared text styles at a substitute family: that rewrites type across every page in the file, including existing work.

## 1 · Design style reference

**File:** `c6vfsoBMO135m1Nql8oiGy` — *Cleartax | Oro*
**Page:** `12921:14542` — "Website for Development"

Replicate the format and design language of the pages on this canvas. It holds ~30 built pages (Global Invoicing, Non-India Homepage, India Homepage, Regional/FR, Delivery, Integration, Scale & Security, Blog list/detail, Contact, Careers, About, Press, Direct/Indirect Tax Compliance). Open the closest-matching page to whatever is being designed and follow its construction.

Observed language (verify against the file each time — do not treat this list as the source of truth):
- 1440 width; full-bleed `Container - <Name>` frames stacked vertically, one per fold.
- Centred section headers: large bold near-black/navy headline + muted grey supporting line beneath, narrow measure.
- Hero: oversized two-line headline, one key word knocked out on a lime/neon highlight block; primary indigo/violet filled button + white outlined secondary button, centred.
- White cards with soft rounded corners and light hairline borders on near-white ground; generous whitespace.
- Indigo used for links and primary actions; lime used sparingly as an accent/highlight.

## 2 · Design system

**File:** `kOuvzveP1oEWwJHRvsgfZy` — *Cleartax | Design System - WIP* (published library)
**Library key:** `lk-97da76fc94c9952fe701865f415af943cd30ce6509b77a2ac4caa4e218311bf7f791c9a737f458c59d4df8a9d390d904e463279a38bf2f80ce540028e57deb81`
**Entry node:** `83:6566`

Components resolve by key via `search_design_system` (note: the server clamps batched queries — expect to issue them one at a time) and are inserted with `importComponentByKeyAsync`.

**Approved for use — nothing else:**

| Allowed |
|---|
| Badge · Button / Buttons · Breadcrumb · Dropdowns · Logo |
| Colors · Typography · Spacing · Layout grids · Iconography · Accessibility |

Anything outside this list — **ask the user directly before proceeding.** Do not substitute a lookalike, and do not hand-build a replacement for a component that exists but is not yet approved.

### Granted by the user (2026-09-17)

**Pattern — approved for use.** The dot-grid background is not a component or an instance; in the reference it is hand-tiled geometry:

```
BG frame            1440 × 810
└─ column frame      206 × 810   (× 7 across)
   └─ row frame      206 ×  82   (× 8 down)
      └─ Ellipse       4 ×   4   (× 32 per row tile)
```

Reference instance: `13049:16566` ("BG", inside `Container - Hero` → `13049:16565`). **Prefer `clone()` of that node over rebuilding it** — cloning reuses their existing asset exactly and introduces nothing new. Oro also has a `Pattern` page (`11716:68`) with `Pattern` (`11716:536`) and a `Swatch`; the design system file has a `Patterns - WIP 🚧` page with the explored styles and a `.current` marker (`10613:12366`).

**Illustrations — use a placeholder instead.** Do not place illustration artwork. Mark the area with a block filled using the published paint style:

| Style | `Visual Placeholder` |
|---|---|
| Key | `325e2d6053df162b48b0ecee58c811d213ecabeb` |
| Value | solid `#E8FFE1` |
| Source | *Cleartax \| Design System - WIP*, published |

Apply by key, never by raw hex:
```js
const st = await figma.importStyleByKeyAsync("325e2d6053df162b48b0ecee58c811d213ecabeb");
await block.setFillStyleIdAsync(st.id);
```

**Accordion — approved (2026-09-18)** for FAQ sections. The reference FAQ on `Global Invoicing` (`13049:19542`) is built from 5 `Accordion` instances plus `Media / Icon / Unfilled / Plus` and one `Button`; mirror that construction.

**Shadows & Blurs — still NOT granted.** Ask before using.

## 3 · Tooling

Figma MCP only. Design directly in Figma — this skill does not produce local HTML/CSS mockups.

## 4 · Output location

**File:** `c6vfsoBMO135m1Nql8oiGy` — *Cleartax | Oro*
**Page:** `3314:89653` — "Website Mockup"

**Do not disturb any existing work on this page.** As of the last survey it held 51 top-level nodes spanning roughly `x 0 → 87,600`, `y 0 → 69,900`, including sections named `.brainstorm`, `.trash`, `WIP - Not for dev`, `.general - components`, `.blog - components`, `.non-india homepage - components`, plus several page mockups and component sets.

Before placing anything: re-survey the page's children, compute the occupied bounds, and position new work in clearly empty space (e.g. to the right of current `maxX` with a wide margin). Never reposition an existing node to make room.

## 5 · Standing build rules (from user fixes, 2026-09-17)

**Container padding is always `80, 80, 80, 80`.** Every `Container - *` frame, no exceptions. Bands that need a full-bleed background (hero, CTA) still take the padding — set the background child to `layoutPositioning = "ABSOLUTE"` so it bleeds while the content stays inset.

**Never set fonts directly on text — apply the file's text styles.** The reference pages (`India Homepage`, `Regional page - cleartax.com/fr`) resolve to this scale:

| Size / LH | Style |
|---|---|
| 52 / 56 | `Display/{Medium,Semibold,Bold}/Large` |
| 44 / 48 | `Display/*/Small` |
| 40 / 48 | `Heading/H1/*/Desktop` |
| 36 / 44 | `Heading/H2/*/Desktop` |
| 32 / 40 | `Heading/H3/*/Desktop` |
| 28 / 36 | `Heading/H4/*/Desktop` |
| 24 / 32 | `Heading/H5/*/Desktop` |
| 20 / 28 | `Heading/H6/*/Desktop` |
| 18 / 28 | `Paragraph/Large/{Regular,Medium,Semibold}` |
| 16 / 24 | `Paragraph/Medium/*` |
| 14 / 20 | `Paragraph/Small/*`, `Paragraph/Overline/Large` |
| 12 / 20 | `Paragraph/XSmall/Regular` |
| 16 / 18 | `Label/Large/{Medium,Semi Bold}` |
| 14 / 16 | `Label/Medium/*` |
| 12 / 14 | `Label/Small/Medium` |

`Display/*` and `Heading/*` are **Inter Tight**; `Paragraph/*` and `Label/*` are **Google Sans**. Match the family to the tier — a 20/28 card title is `Heading/H6`, i.e. Inter Tight, not Google Sans. There is no style above 52px: an 80px headline is off-system.

**Chrome comes from components:** navbar `.current Navbar`, footer `.current Footer` (COMPONENT_SET key `8680b5574e702b93a2bdfc39c2a40f99badecfec`).

**Never invent copy — annotate omissions instead.** If the content file leaves a section unwritten (authoring notes like "Add testimonial section here" rather than real copy), do not fabricate text. Build what the file actually supports, and place an **annotation frame beside the page** — outside the page frame, so it cannot affect layout — listing every fold or element that was reduced or omitted and why. Name it `⚠︎ Build notes — <page>` so it is obvious in the layer list and easy to delete once resolved.

**The navbar is always Fixed.** Figma expresses "Fix position when scrolling" by counting fixed children from the **END** of the children array (the top of the layer stack) — not the start. So `.current Navbar` must be the **last** child of the page frame, absolutely positioned at `x 80, y 48`, with `numberOfFixedChildren >= 1` on the frame. Leave `overflowDirection` as `NONE`; the reference pages all do. Verified: `Global Invoicing` and `Non-India Homepage` use 1 fixed child; `India Homepage` and `Regional page - cleartax.com/fr` use 2 (navbar + a gradient overlay). A navbar sitting after the footer in the layer list is **correct**, not drift — do not "fix" it by moving it to index 0.

### Working around the font block

`setTextStyleIdAsync`, cloning `.current Navbar`, and instantiating `.current Footer` **all fail** in a hosted MCP session — each needs Inter Tight / Google Sans loaded. The workaround is to tag intent from MCP and apply it locally:

1. From MCP, set each text to the target style's exact size / line-height / letter-spacing using the **placeholder** font (`Inter` for Inter Tight, `Google Sans Flex` for Google Sans), then tag it:
   ```js
   node.setSharedPluginData("cleartax_ws", "targetTextStyle", "Heading/H1/Medium/Desktop");
   ```
   (`setPluginData` is unavailable in this host — `setSharedPluginData` is required.)
2. Tag the placeholder navbar `replaceWith = "currentNavbar"` and the page `appendFooter = "currentFooter"`.
3. The user runs **`Website/Scripts/font-swap/`** in Figma desktop with the page frame selected. It binds the real styles, font-maps any untagged text, and swaps in the navbar/footer — no guessing. It aborts before changing anything if Inter Tight / Google Sans are absent, and only ever touches the selection.

> `Asset/Script/figma-font-swap-plugin/` holds the **asset** variants (brochures, case studies) — font mapping only, no text-style awareness. Use it for assets; use `Website/Scripts/font-swap/` for websites.

Because binding a text style also sets the font, a fully tagged page needs only this one plugin — its font-mapping pass exists solely for text that carries no tag.

## Working checklist

- Confirm content received and understanding acknowledged before any mutation.
- Open the nearest matching page on "Website for Development" and mirror its fold structure and spacing rhythm.
- Pull every button, badge, breadcrumb, dropdown, logo and icon from the published library — never redraw them.
- Apply colour and type by the design system's own styles/variables; never type in a raw hex or an off-scale font size.
- Re-survey the output page and place in free space; verify afterwards that no pre-existing node changed position or size.
