# Frontend Engineering Standards & React/Next.js Best Practices

## 1. Next.js App Router Architecture
* **Server Components by Default (RSC)**: Every component is a React Server Component unless it explicitly requires interactivity (`useState`, `useEffect`, event handlers, browser APIs).
* **Push `'use client'` to the Leaves**: Never mark an entire page or large layout section as `'use client'`. Extract only the specific interactive widgets (e.g., interactive comparison toggle, modal, mobile drawer, dropdown) into leaf client components.
* **Component Organization & Hierarchy (`apps/web/client/website`)**:
  * `components/`: Reusable, atomic UI primitives and display components (buttons, badges, cards, dialogs, icons).
  * `sections/`: High-level page blocks that compose the layout (e.g., `HeroSection`, `VerifiedVsReportedSection`, `FeatureGridSection`, `PresetShowcaseSection`, `CTASection`, `Navbar`, `Footer`).
  * `data/`: Structured content, static copy, navigation links, feature lists, and FAQs kept strictly separated from presentation logic.
  * `types/`: Domain and component TypeScript interfaces.

## 2. Component Design & Clean Code
* **Single Responsibility**: Each component should do one thing well. If a component exceeds ~150 lines, evaluate splitting it into sub-components.
* **Strict TypeScript**:
  * No `any` or loose types.
  * Always define explicit prop types: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }`.
  * Pass read-only immutable data models from `@vantaged/contracts`.
* **Zero Prop Drilling**: Use React Server Component composition (`children`) or focused context providers where appropriate.
* **No Hardcoded Content in JSX**: Text copy, feature descriptions, and menu lists must be defined in `data/*.ts` files to keep markup clean and maintainable.

## 3. Design System & Token Adherence
* **60 / 30 / 10 Principle**:
  * 60% White / Light Neutral surfaces (`--vt-color-background-default`, `--vt-color-surface-default`).
  * 30% Brand Orange (`--vt-color-background-brand` `#EF5F18`) for accents, key illustrations, highlights.
  * 10% Scarlet Bikini Indigo (`--vt-color-text-default` `#261A66`) for contrast, headings, depth.
* **Semantic Tokens First**: Use `--vt-*` CSS variables and utility classes. Never invent arbitrary one-off hex colors.
* **Primary Button Contrast**: Always use `primary.default` (`--vt-color-primary-default` `#B33C08`) on white text for guaranteed WCAG AA contrast (>= 4.5:1).
* **Tinted Shadows**: Use `--vt-shadow-*` which are tinted with Scarlet Bikini indigo, never harsh black.
* **Typography**: Plus Jakarta Sans with tabular numbers (`font-feature-settings: 'tnum' 1`) when displaying monetary figures (`₦`).

## 4. Performance & Core Web Vitals
* **Image Optimization**: Always use `next/image` with responsive `sizes`, explicit dimensions or `fill`, proper aspect ratios, and `priority` on above-the-fold hero images. Never use raw `<img>` tags.
* **Zero Layout Shift (CLS)**: Reserve dimensions for dynamic or async elements, skeleton states, and images.
* **Semantic HTML**: Proper heading hierarchy (single `<h1>` per page, sequential `<h2>` and `<h3>`), semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`).
* **Accessibility (a11y)**: High contrast, descriptive `aria-label`s on icon-only buttons, keyboard focus rings (`focus-visible:outline-none focus-visible:ring-2`).
