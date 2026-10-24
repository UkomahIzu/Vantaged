# Vantaged Brand Logo & Icon Usage Rules

This rule documents the permanent guidelines for using the official Vantaged Brand Kit logos, vectors, and web assets across all applications, derived from `apps/logos/Vantaged_Brand_Kit/Vantaged_Asset_Usage_README.md`.

## 1. Asset Storage & Public Distribution
- **Master Assets Source**: `apps/logos/Vantaged_Brand_Kit/`
  - `vectors/`: Scalable vector master files with actual vector paths (no fonts required).
  - `web/`: Browser favicons, touch icons, web app icons, and `site.webmanifest`.
  - `png/`: High-resolution transparent raster exports (4096px logo, 2048px V marks).
  - `app-icons/`: Square mobile launcher sources (deferred until mobile app phase).
- **Web App Public Assets**:
  - `apps/web/public/`: Root web assets (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`).
  - `apps/web/public/brand/`: Vector masters and high-res PNGs (`vantaged-measurement-logo.svg`, `vantaged-v-orange.svg`, `vantaged-v-purple.svg`, `vantaged-v-white.svg`, etc.).

---

## 2. Selection Matrix: Where to Use Which Asset

| Placement Context | Asset File | Guidelines |
| --- | --- | --- |
| **Website Header / Expanded Dashboard Sidebar** | `/brand/vantaged-measurement-logo.svg` | Full Vantaged name with approved measurement lines; scalable and sharp. Keep `height: auto` and adjust width (typically `130px`–`180px` in sidebars, up to `240px` in spacious headers). |
| **Landing Page, Sign-In, Large Branding Area** | `/brand/vantaged-measurement-logo.svg` | Shows the full brand name where there is sufficient horizontal space. |
| **Collapsed Sidebar / Compact Navigation** | `/brand/vantaged-v-orange.svg` | The original three-piece V remains instantly recognizable at small sizes (e.g. 24px–36px). |
| **Brand Mark on Light Backgrounds** | `/brand/vantaged-v-orange.svg` or `/brand/vantaged-v-purple.svg` | Choose the version with clearest contrast against the container background. |
| **Brand Mark on Dark / Indigo Backgrounds (`#261A66`)** | `/brand/vantaged-v-white.svg` | White works cleanly where purple would blend into dark surfaces. Often paired with white "Vantaged" text. |
| **Browser Tab Favicons** | `/favicon.ico` and `/favicon.svg` | Multi-size ICO and scalable SVG browser icons served from public root. |
| **Touch & Web App Icons** | `/apple-touch-icon.png`, `/icon-192.png`, `/icon-512.png`, `/site.webmanifest` | PWA manifest and mobile browser bookmark icons. |
| **Mobile App Launcher Assets** | `app-icons/` | Deferred until mobile app development commences. |

---

## 3. Mandatory Implementation Standards

1. **Full Wordmark vs. V-Symbol**:
   - Use the **full measurement logo** (`vantaged-measurement-logo.svg`) when people need to read the brand name.
   - Use the **V mark** (`vantaged-v-*.svg`) when space is limited or in compact icon areas.
   - **Never squeeze or warp the full logo into a square icon or favicon container.**
2. **Transparent Backgrounds**:
   - All SVG and PNG assets are transparent.
   - Never bake backgrounds into the image files. Set the container's background color in CSS / HTML.
3. **Aspect Ratio & Proportions**:
   - Always maintain the natural aspect ratio with `height: auto` (or `object-fit: contain`).
   - Do not stretch, distort, or skew the logos.
4. **Brand Integrity**:
   - Keep the original three-piece V intact; do not move or scale pieces independently.
   - Keep the spelling as **Vantaged** (including the final **d**).
   - Do not apply drop shadows, glows, borders, or color filters to the master SVG/PNG artwork.
5. **Brand Colors**:
   - Primary Brand Orange: `#EF5F18` (`--vt-color-orange-500`)
   - Deep Scarlet Bikini Purple: `#261A66` (`--vt-color-indigo-900`)
   - Pure White: `#FFFFFF`
