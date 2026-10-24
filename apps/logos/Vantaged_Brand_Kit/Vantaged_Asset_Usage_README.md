# Vantaged — Logo and Icon Usage Guide

This guide explains where to use each asset in `Vantaged_Brand_Kit.zip`. Paths below are relative to the extracted `Vantaged_Brand_Kit` folder.

All supplied logo and icon SVG, PNG and ICO files have **transparent backgrounds**. Set the background colour in your website, app or design rather than editing a background into the source artwork.

## 1. Quick selection guide

| Where you need the image | File to use | Why |
| --- | --- | --- |
| Website header or expanded dashboard sidebar | `vectors/vantaged-measurement-logo.svg` | Full Vantaged name with the approved measurement lines; scalable and sharp. |
| Landing page, sign-in page or large branding area | `vectors/vantaged-measurement-logo.svg` | Shows the full brand name where there is enough space. |
| Collapsed sidebar, compact navigation or in-app brand mark | `vectors/vantaged-v-orange.svg` | The original V stays recognisable at small sizes. |
| Brand mark on a light background | `vectors/vantaged-v-purple.svg` or orange V | Choose the version with the clearest contrast. |
| Brand mark on a dark background | `vectors/vantaged-v-white.svg` or orange V | White works where purple would blend into the background. |
| Browser tab / bookmark icon | `web/favicon.ico` and `web/favicon.svg` | Orange V on transparency; supplied specifically for browser use. |
| Mobile app launcher artwork source | `app-icons/orange-1024.png` | Square high-resolution source for your platform's icon workflow. |
| Web app icon | `web/icon-192.png` and `web/icon-512.png` | Referenced by the supplied web manifest. |
| Apple home-screen touch icon source | `web/apple-touch-icon.png` | Dedicated 180 × 180 PNG. |
| Presentations or documents that do not support SVG | `png/vantaged-measurement-logo-4096.png` | Large transparent raster version of the full logo. |
| Design handoff or resizing | Files in `vectors/` | Editable vector paths; no installed font is required. |

**Use the full wordmark when people need to read the brand name. Use the V alone when space is limited.** Do not squeeze the full logo into a favicon or app-icon square.

## 2. What each format means

### SVG — the vector master

SVG describes shapes as paths rather than a fixed grid of pixels. Use it for website logos, interface branding and design work. It can be enlarged without the pixelation of an enlarged PNG.

These SVG files contain actual vector paths, including the lettering. They do not contain an embedded screenshot and do not rely on a font being installed. They were traced from the approved generated artwork, so small contour differences from the original images are possible.

### PNG — transparent image exports

Use PNG when your app, document editor or upload form needs an image file. PNG supports transparency, but each file has a fixed pixel size. Use the largest suitable source and scale it down; enlarging a small PNG does not create additional detail.

### ICO — browser icon bundle

`web/favicon.ico` contains several icon sizes in one file: 16, 32, 48, 64, 128 and 256 pixels square. It uses the orange V with transparency.

### Web manifest — icon configuration

`web/site.webmanifest` is a JSON configuration file, not an image. It names Vantaged and references the 192px and 512px web app icons. It contains no background or theme colour. It does not implement offline functionality by itself.

## 3. Folder contents

### `vectors/`

| File | Purpose |
| --- | --- |
| `vantaged-measurement-logo.svg` | Full orange-and-purple wordmark with measurement lines. |
| `vantaged-v-orange.svg` | Original orange V, with modest padding. |
| `vantaged-v-purple.svg` | Original purple V, with modest padding. |
| `vantaged-v-white.svg` | Original white V, with modest padding. |
| `app-icon-orange.svg` | Orange V on a square transparent canvas with icon spacing. |
| `app-icon-purple.svg` | Purple V on a square transparent canvas with icon spacing. |
| `app-icon-white.svg` | White V on a square transparent canvas with icon spacing. |

The standalone V files suit interface layouts. The app-icon SVGs already place the V inside a square canvas, so you do not need to stretch or crop it to make it square.

### `png/`

- `vantaged-measurement-logo-4096.png`: full logo, 4096 pixels wide.
- `vantaged-v-orange-2048.png`: orange V, 2048 pixels wide.
- `vantaged-v-purple-2048.png`: purple V, 2048 pixels wide.
- `vantaged-v-white-2048.png`: white V, 2048 pixels wide.

These preserve their original aspect ratios; the standalone symbols and full logo are not square.

### `app-icons/`

Each of orange, purple and white is available at **192 × 192**, **512 × 512** and **1024 × 1024** pixels. For example:

- `orange-192.png`
- `orange-512.png`
- `orange-1024.png`

Use 1024px as your source when preparing mobile launcher assets. Use the other colours when they fit your app's background. These are transparent source assets, not complete platform-specific icon bundles. Apply your chosen background and generate the sizes required by your mobile build workflow when preparing final launcher or store assets. Rounded corners are not baked into the supplied artwork.

### `web/`

| File | Purpose |
| --- | --- |
| `favicon.svg` | Scalable orange V browser icon. |
| `favicon.ico` | Multi-size browser favicon. |
| `favicon-16x16.png` | Small PNG favicon. |
| `favicon-32x32.png` | PNG favicon alternative. |
| `favicon-48x48.png` | Larger PNG favicon alternative. |
| `apple-touch-icon.png` | 180px touch icon source. |
| `icon-192.png` | 192px web app icon. |
| `icon-512.png` | 512px web app icon. |
| `site.webmanifest` | Configuration referencing the web app icons. |

`preview.png` in the kit root is an overview for reviewing the designs. Use the individual assets in your product.

## 4. Website setup

### Step 1 — place the files

Copy the **contents** of `web/` into the folder your project serves as its public web root. If your project uses a `public/` folder, this means `public/favicon.ico`, `public/favicon.svg`, and so on.

Create a `brand/` folder inside that public folder and copy these files into it:

- `vectors/vantaged-measurement-logo.svg`
- `vectors/vantaged-v-orange.svg`
- `vectors/vantaged-v-purple.svg`
- `vectors/vantaged-v-white.svg`

The examples below assume the site is hosted at the domain root. If it is hosted under a subdirectory, update the asset URLs and manifest paths to match that location.

### Step 2 — configure browser icons

Put these tags inside the page's `<head>`, or configure equivalent icon metadata through your framework:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

You do not need to reference every PNG size when using the supplied ICO and SVG. If you specifically need a PNG favicon, use:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
```

### Step 3 — use the full logo in your header

```html
<a href="/" aria-label="Vantaged home">
  <img
    class="brand-logo"
    src="/brand/vantaged-measurement-logo.svg"
    alt="Vantaged"
  >
</a>
```

```css
.brand-logo {
  display: block;
  width: 240px;
  max-width: 100%;
  height: auto;
}
```

The 240px width is a starting point, not a fixed brand requirement. Adjust it to your layout and check that the measurement lines remain visible. Keep `height: auto` to preserve the proportions.

### Step 4 — use the V in compact spaces

```html
<img
  class="brand-mark"
  src="/brand/vantaged-v-orange.svg"
  alt="Vantaged"
>
```

```css
.brand-mark {
  display: block;
  width: 36px;
  height: auto;
}
```

If the logo is decorative beside text that already says Vantaged, use `alt=""` to avoid repeating the name to screen-reader users.

### Step 5 — set the background in your program

For example, place the white V on a purple surface:

```html
<div class="brand-surface">
  <img src="/brand/vantaged-v-white.svg" alt="Vantaged">
</div>
```

```css
.brand-surface {
  background-color: #261A66;
  padding: 16px;
}

.brand-surface img {
  display: block;
  width: 48px;
  height: auto;
}
```

This changes the container's background, not the image. The source file remains transparent. Your webpage's CSS does not control the browser tab's background; the favicon will appear against the browser's own theme.

## 5. Mobile and in-app usage

For an image inside your app, choose the appropriate SVG if your image renderer supports SVG, or use the transparent PNG alternative. Keep the aspect ratio and use a contain-style fit rather than stretching or cropping.

For the launcher icon:

1. Start with `app-icons/orange-1024.png`, or the purple/white variant.
2. Choose the launcher background in your project or icon-generation workflow.
3. Generate the platform-specific launcher assets from this source.
4. Preview them at small sizes and with the platform's icon masks.

The source assets remain transparent as requested. A final platform export may require its own opaque background; set that in the project rather than overwriting the master assets.

## 6. Brand colours and layout

| Colour | Hex value | Typical use |
| --- | --- | --- |
| Orange | `#EF5F18` | Primary V, measurement lines, favicon. |
| Deep purple | `#261A66` | Wordmark and alternate V. |
| White | `#FFFFFF` | V on dark surfaces. |

- Keep the original three-piece V intact; do not move its pieces independently.
- Keep the wordmark spelled **Vantaged**, including the final **d**.
- Leave space around the artwork so neighbouring controls do not touch the symbol or measurement arrows.
- Use the V-only mark when the full wordmark becomes too small to read.
- Preserve proportions; do not force a wide logo into a square.
- Avoid adding glow, drop shadows or gradients to the master artwork.
- Keep the vector masters and export copies for individual uses.

## 7. Common issues

**The white logo looks blank:** it is white artwork on transparency. Preview it on a dark surface.

**The image viewer shows black or a checkerboard:** that may be the viewer's transparency preview, not a background inside the image. Test it over a coloured container.

**The favicon still shows the old design:** confirm the new file is served at the URL used by your icon link, then try reloading or opening a fresh browser session. Browser icon caching can delay updates.

**The PNG looks blurry:** switch to SVG where supported, or use a larger PNG source and display it smaller.

**The measurement lines disappear in a narrow header:** increase the full logo's size or use the standalone V in the compact layout.

**The SVG colour does not change when I set CSS `color`:** the assets include brand-colour values. Use the supplied colour variant. An SVG loaded through an `<img>` does not inherit your page's text colour into its internal paths.
