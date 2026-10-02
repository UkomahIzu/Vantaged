# Vantaged Public Website Architecture

This folder contains all presentation, layout, and data assets for the **Vantaged** public marketing website.

## Directory Structure

```
apps/web/client/website/
├── components/   # Atomic, reusable UI primitives (Buttons, Badges, Cards, Icons, Containers)
├── sections/     # High-level page sections (Hero, VerifiedVsReported, Features, FAQ, Navbar, Footer)
├── data/         # Structured static content, copy, feature matrices, navigation links
├── types/        # TypeScript interfaces for website props and content models
└── ARCHITECTURE.md
```

## Guiding Principles
1. **Server Components by Default**: Pages and sections render on the server; only interactive micro-widgets use `'use client'`.
2. **Design Tokens**: All styles adhere strictly to Vantaged design tokens (60% White/Neutral, 30% Brand Orange `#EF5F18`, 10% Scarlet Bikini `#261A66`).
3. **Data Separation**: Text copy and list structures stay in `data/`, keeping JSX clean and declarative.
4. **Performance & SEO**: Semantic HTML, Next.js image optimization, responsive mobile-first layouts, and zero cumulative layout shift.
