# Cleartax Website Font Swap

Finishes website mockups that were built through the remote `use_figma` MCP
session. **Run it from Figma desktop, with the page frame selected.**

## Why it's needed

The MCP Figma session only resolves the Google Fonts catalogue — it has no
`Inter Tight` and no `Google Sans`, the two families every one of the Oro
file's 88 text styles is built on. Verified consequences:

| Attempted from MCP | Result |
|---|---|
| `loadFontAsync("Inter Tight" \| "Google Sans")` | fails — family does not exist |
| `node.textStyleId = id` | `Cannot set style successfully: unloaded font …` |
| `setTextStyleIdAsync(id)` | same |
| clone / instantiate any text-bearing node | fails on `appendChild` |

So the MCP build lays the page out with **placeholder fonts at the exact
metrics of the intended style**, and tags each node with what it should
become. This plugin runs where the real fonts live and finishes the job.

## What it does

0. **Replaces placeholder buttons, badges and accordions** with the real
   `Button` / `Badge` / `Accordion` components, at the variant the tag names, writing the label back in
   via the component's own TEXT property and switching off any `Show Icon`
   booleans. Runs first, so removed placeholders aren't styled needlessly.
1. **Binds the real text style** to every node tagged `targetTextStyle`.
   This is exact — no guessing from size or weight.
2. **Font-maps untagged text** as a fallback: `Inter → Inter Tight`,
   `Google Sans Flex → Google Sans` (also `Poppins`/`Space Grotesk` from
   older files). Weight carries across, with loose matching for the
   `SemiBold` / `Semi Bold` spelling difference between families.
3. **Smooths the text rag** on fixed-width body copy — sets each wrapping
   paragraph to about (natural single-line width ÷ line count) so the lines
   come out even instead of leaving a short orphan. Runs after styling, so it
   measures final metrics.
4. **Keeps the navbar Fixed** — Figma counts fixed children from the *end* of
   the children array, so `.current Navbar` must be the **last** child of the
   page frame with `numberOfFixedChildren >= 1`. Every reference page follows
   this (`Global Invoicing` = 1, `India Homepage` = 2 with a gradient overlay).
   A swap can insert the instance wherever the placeholder sat, so this is
   re-asserted on every run.
5. **Swaps in the real chrome** — replaces the node tagged
   `replaceWith: currentNavbar` with a `.current Navbar`, and appends a
   `.current Footer` to the node tagged `appendFooter: currentFooter`.

Pass 1 sets the font *and* links the node to the design system, so a fully
tagged page needs nothing else.

## Tags it reads

Shared plugin data, namespace `cleartax_ws`:

| Key | On | Value |
|---|---|---|
| `targetTextStyle` | each text node | style name, e.g. `Heading/H1/Medium/Desktop` |
| `replaceWith` | placeholder navbar | `currentNavbar` |
| `replaceWith` | placeholder button | `button` |
| `buttonSet` / `buttonVariant` / `buttonLabel` | placeholder button | key, variant, label |
| `replaceWith` | placeholder badge | `badge` |
| `badgeSet` / `badgeVariant` / `badgeLabel` | placeholder badge | key, variant, label |
| `replaceWith` | placeholder FAQ row | `accordion` |
| `accordionSet` / `accordionVariant` / `accordionLabel` | placeholder FAQ row | key, variant, question |
| `appendFooter` | page frame | `currentFooter` |
| `navbarSource` | placeholder navbar | node id of a specific navbar to clone (optional) |
| `footerSource` | page frame | node id of a specific footer to clone (optional) |

A `<kind>Set` value containing a colon is treated as a **node id** rather than
a library key — local component sets (like `.current Navbar`) are not
published, so `importComponentSetByKeyAsync` cannot reach them and only
`getNodeByIdAsync` works.

`navbarSource` / `footerSource` let a page pull its chrome from a named
reference page rather than the generic component — e.g. the India Homepage
navbar (`.current Navbar` instance) and its `Footer` frame. A plain FRAME
source is cloned rather than instantiated.

Website buttons are **`Size=Large`** (46px tall) for both Primary and
Secondary — that is what `India Homepage` uses throughout, including its hero
and navbar.

Badge variants follow `Shape=Rounded, Size=Large` with the `Type` carrying the
meaning (`Neutral`, `Success`, `Primary`) — matching how the reference pages
use `Shape=Rounded, Size=Large, Type=Neutral, Style=Outlined` for chips. The
accent colour is reserved for genuinely important content, not for badges.

`setPluginData` is unavailable in the MCP host runtime, which is why these use
`setSharedPluginData`.

## Scope

**Selection only.** It refuses to run with nothing selected and never walks
`figma.root.children`. Website mockups live in `Cleartax | Oro`, a 20-page
shared file — a whole-file sweep there was measured to rewrite 88 existing
text ranges across 13 pages, including the Typography specimen and a page
named "In-file components (Do not edit)".

It also aborts early, before changing anything, if `Inter Tight` or
`Google Sans` are missing — so running it in the wrong place is a no-op
rather than a mess.

## Install

Figma desktop → Plugins → Development → Import plugin from manifest… → pick
`manifest.json` in this folder.

## Related

`Asset/Script/figma-font-swap-plugin/` holds the **asset** variants
(brochures, case studies) targeting Inter Tight/Google Sans, Nohemi/Gilroy and
PP Neue Montreal. Those map fonts only and know nothing about text styles.
Use this plugin for websites, those for assets.
