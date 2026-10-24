
# Vantaged transparent brand kit

All SVG, PNG and ICO artwork has a transparent background. Set the background in your app or website. Brand colours: orange #EF5F18, purple #261A66, white #FFFFFF.

- vectors/: original three-piece V in orange, purple and white; measurement-line wordmark; square app-icon vectors. Actual paths, no embedded images or font dependency.
- png/: transparent 2048px-wide V variants and 4096px-wide measurement-line logo.
- app-icons/: transparent square PNGs at 192, 512 and 1024px, in orange, purple and white.
- web/: orange V on transparency for browser tabs and web app icons. favicon.ico contains 16, 32, 48, 64, 128 and 256px sizes. Includes SVG favicon, PNG fallbacks and 180px Apple touch icon.

White artwork may appear blank against a white page. These vectors are traced from the approved artwork; minor contour differences are possible.

## Website setup

Copy web/ contents into your public/ folder, then add:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

No background or theme colour is specified in the manifest. Mobile platform tooling may require an opaque final launcher/store icon; apply your chosen background in your project when exporting that version. No corners are baked into these source assets.
