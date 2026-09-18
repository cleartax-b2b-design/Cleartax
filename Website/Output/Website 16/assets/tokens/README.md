# ClearTax Design System — tokens

444 tokens, generated from `Design system/Variables/*.json`.

## What's in here

| File | Use it for |
|---|---|
| `cleartax-tokens.css` | Drop-in CSS custom properties on `:root` |
| `cleartax-tokens.scss` | SCSS variables (`$ct-color-...`) |
| `cleartax-tokens.js` | ES module, grouped by category |
| `cleartax-tokens.json` | Normalized, tool-agnostic |
| `json/<category>.json` | One category at a time |
| `figma/*.json` | The untouched Figma exports (W3C token shape) |

## Naming

`--ct-<domain>-<path>` — e.g. `--ct-color-content-primary`,
`--ct-font-size-md`, `--ct-space-l`, `--ct-radius-m`, `--ct-border-width-m`.

## Use semantics, not primitives

Reach for `--ct-color-content-primary` rather than `--ct-color-primary-950`.
Semantic tokens describe intent, so a palette change flows through without
touching product code. Primitives are the raw ramp behind them.

## Notes on the source

- `--ct-radius-circle` is `50%` here; the Figma value is `50`.
- `Surface.L0`–`L6` are all `#FFFFFF` — elevation is not yet differentiated.
- Duplicate values exist inside two ramps: `Destructive.400`/`500` and
  `Blue.300`/`400`.
- Skipped `Icon` in `Typography.json` — placeholder value `String value`.
