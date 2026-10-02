# Vantaged Design Tokens & UI Guidelines

## Brand Palette & Distribution
- **60% Neutral / Surface**: Light mode uses white (`#FFFFFF`) / tinted neutrals; Dark mode uses deep indigo-tinted darks (`#12101F`, `#1E1B30`).
- **30% Brand Orange (`#EF5F18`)**: Brand accent, hero highlights, active states, key visual elements.
- **10% Scarlet Bikini Indigo (`#261A66`)**: Deep accent, headers, contrast accents, shadows.

## Token Usage Rules
1. **Always build with semantic tokens**: Never hardcode arbitrary hex values or ad-hoc colors. Use `--vt-color-*` CSS variables or `@vantaged/config` tokens.
2. **Primary Buttons**: Always use `primary.default` (orange 700 `#B33C08`) or `--vt-color-primary-default` for interactive button backgrounds to ensure accessible contrast (>= 4.5:1) with white text.
3. **Brand Orange 500 (`#EF5F18`)**: Reserved for decorative accents, banners, badges, illustrations, and large headlines.
4. **Warning Fills**: Warning surfaces (amber) must use dark indigo text (`#170F42`), never white text.
5. **Shadows**: Shadows must be tinted with Scarlet Bikini (`rgba(38, 26, 102, ...)` / `--vt-shadow-*`), never harsh pure black.
6. **Currency & Numbers**: Always use tabular figures (`font-feature-settings: 'tnum' 1`) when rendering money amounts in Nigerian Naira (`₦`) or tabular tables.
7. **Font Family**: Plus Jakarta Sans (weights 200–800) for UI, monospace for code/hashes/IDs.

## Monorepo Imports
- **Web (`apps/web` & `apps/admin`)**:
  - CSS: `@import "@vantaged/config/src/tokens.css";` or `--vt-*` custom properties.
  - TS: `import { tokens } from "@vantaged/config";`
- **Mobile (`apps/mobile`)**:
  - TS: `import { native as tokens } from "@vantaged/config";` (provides unitless numbers, absolute line heights, and React Native shadow objects).
