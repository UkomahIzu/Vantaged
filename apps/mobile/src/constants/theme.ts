/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import '@/global.css';

import { native as vt } from '@vantaged/config';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: vt.semantic.color.text.default,
    background: vt.semantic.color.background.default,
    backgroundElement: vt.semantic.color.background.subtle,
    backgroundSelected: vt.semantic.color.background.muted,
    textSecondary: vt.semantic.color.text.muted,
    primary: vt.semantic.color.primary.default,
    brand: vt.semantic.color.background.brand,
  },
  dark: {
    text: vt.dark.color.text.default,
    background: vt.dark.color.background.default,
    backgroundElement: vt.dark.color.background.subtle,
    backgroundSelected: vt.dark.color.background.muted,
    textSecondary: vt.dark.color.text.muted,
    primary: vt.dark.color.primary.default,
    brand: vt.dark.color.background.brand,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Radius = vt.radius;
export const Tokens = vt;

export const Fonts = Platform.select({
  ios: {
    sans: 'Outfit',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Outfit',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display, Outfit, sans-serif)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  ...vt.space,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
