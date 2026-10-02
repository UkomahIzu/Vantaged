# Vantaged design tokens

**White 60% · Orange #EF5F18 30% · Scarlet Bikini #261A66 10%**, with light and dark mode.

Edit only `src/tokens.json` (W3C Design Tokens format: `$value`, `$type`, `{alias}` references). Run `npm run build` to regenerate everything in `dist/`. The build checks 44 colour pairs across both modes and fails if any drop below their contrast target.

## What's inside

| Group | Tokens |
|---|---|
| Colour, primitive | `orange`, `indigo` (Scarlet Bikini), `neutral` (indigo-tinted greys), `green`, `amber`, `red`, `white`, `black` |
| Colour, semantic | `background`, `surface`, `text`, `border`, `primary`, `secondary`, `success`, `warning`, `error`, `info`, each in light and dark |
| Typography | Plus Jakarta Sans (interface) and a monospace (code); weights, sizes `2xs`–`7xl`, line heights, letter spacing, and 17 text styles from `display-lg` to `code` |
| Layout | `space` (4px grid), `size` (controls, icons, touch target, containers), `radius`, `border-width`, `breakpoint` |
| Effects | `shadow` (xs–xl, focus), `opacity`, `duration`, `easing`, `z-index` |

## Outputs

- `dist/tokens.css`: CSS variables. Light (white background) on `:root` is the default everywhere. Dark is opt-in: add `data-theme="dark"` to `<html>`. Text style classes `.vt-h1`, `.vt-body`, etc.
- `dist/tokens.ts`: `tokens` for JS on the web; `native` for React Native (numbers, absolute line heights, native shadows). `tokens.semantic` is light, `tokens.dark` is dark.
- `dist/tokens.json`: flat, resolved values for anything else (Figma, emails, docs).
- `dist/preview.html`: visual reference of every token, with a light/dark switch.

## Naming

`semantic.color.text.default` → `--vt-color-text-default`. Dark values use the same variable names, so components never need to know the mode.

## Rules

- Build with **semantic** tokens. Primitives exist to define them.
- **Primary buttons use `primary.default`** (orange 700). White on the brand orange 500 is only 3.3:1, so brand orange carries panels, illustrations and large text.
- **Body text stays on `background.default` or `surface.*`.** `text.subtle` is for large text and icons only.
- **Warning fills take indigo text**, not white.
- Shadows are tinted with Scarlet Bikini, not black.

## Font

Plus Jakarta Sans, variable (200–800). Install with `npm i @fontsource-variable/plus-jakarta-sans` and import it once in each web app; it includes the naira sign ₦ in the latin-ext subset. Turn on tabular figures where numbers line up: `font-feature-settings: 'tnum' 1`. For React Native, load the static weights from Google Fonts with `expo-font`.
