# Mobile App Architecture & Guidelines (`apps/mobile`)

## Core Technology Stack
- **Framework**: Expo SDK 57 (`~57.0.25`) with React Native `0.86.3` and React `19.2.3`
- **Compiler**: React Compiler enabled (`experiments.reactCompiler: true` in `app.json`)
- **Routing**: Expo Router with typed routes enabled (`experiments.typedRoutes: true`)
- **Animation**: React Native Reanimated `4.5.1` & `react-native-worklets: 0.10.1`
- **Icons & Native UI**: `expo-symbols`, `@expo/ui`, `expo-glass-effect`, `expo-image`
- **Theming**: Custom dynamic theme in `src/constants/theme.ts` with `ThemedText` and `ThemedView` primitives

## Workspace Boundaries & Monorepo Integration
- `apps/mobile` connects to the rest of the monorepo via:
  - `@vantaged/contracts`: Shared types, DTOs, and validation schemas (Zod).
  - `@vantaged/api-client`: API client for network requests to backend endpoints.
  - `@vantaged/config`: Shared configuration constants.
- **CRITICAL**: `apps/mobile` MUST NOT import `@vantaged/db` or any server-only packages. All data persistence flows through API routes or Supabase client.

## Routing & Directory Layout
- `src/app/`: File-based route screens only.
  - `_layout.tsx`: Root layout with `ThemeProvider`, `AnimatedSplashOverlay`, `AppTabs`, `SplashScreen.preventAutoHideAsync()`.
  - `index.tsx`: Home tab (`/`).
  - `explore.tsx`: Explore tab (`/explore`).
- `src/components/`: Reusable UI components (`themed-text`, `themed-view`, `hint-row`, `external-link`, `animated-icon`, `ui/collapsible`).
- `src/constants/theme.ts`: Color palette, spacing (`Spacing.half` to `Spacing.six`), `Fonts`, `BottomTabInset`, `MaxContentWidth`.
- `src/hooks/`: Custom hooks (`use-theme`, `use-color-scheme`).

## Platform Splitting Patterns
- Native vs Web components follow `.tsx` vs `.web.tsx`:
  - `app-tabs.tsx` uses `expo-router/unstable-native-tabs` (`NativeTabs`) on iOS/Android.
  - `app-tabs.web.tsx` uses `expo-router/ui` (`Tabs`, `TabList`, `TabTrigger`) on Web.
  - `animated-icon.tsx` (Reanimated keyframes) vs `animated-icon.web.tsx` (CSS module fallback).
  - `use-color-scheme.ts` vs `use-color-scheme.web.ts` (hydration safety for static web export).

## Rules of Development
1. **Never edit `ios/` or `android/` directly**: Use Continuous Native Generation (CNG) via `app.json` and Expo config plugins.
2. **Package installations**: ALWAYS use `npx expo install <package>` instead of `npm i` for mobile packages to match SDK 57 compatibility.
3. **Validation before completion**: Always run `npx tsc --noEmit` and `npx expo lint` before concluding tasks in `apps/mobile`.
