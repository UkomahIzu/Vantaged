import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

export type OwnerThemeMode = 'light' | 'dark';

export interface OwnerMobileUser {
  fullName: string;
  firstName: string;
  email: string;
  role: string;
}

export interface OwnerThemePalette {
  mode: OwnerThemeMode;
  canvasBg: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  brandOrange: string;
  brandPrimaryBtn: string;
  brandSoftBg: string;
  brandSoftBorder: string;
  brandSoftText: string;
  greenBg: string;
  greenBorder: string;
  greenText: string;
  greenAccent: string;
  indigoSoftBg: string;
  indigoSoftBorder: string;
  indigoSoftText: string;
  drawerBackdrop: string;
}

export const LIGHT_PALETTE: OwnerThemePalette = {
  mode: 'light',
  canvasBg: '#F7F7FA',
  surface: '#FFFFFF',
  surfaceSubtle: '#F7F7FA',
  border: '#E2E0EC',
  borderSubtle: '#EFEEF5',
  textPrimary: '#261A66',
  textSecondary: '#5E5A7D',
  textMuted: '#7C7894',
  brandOrange: '#EF5F18',
  brandPrimaryBtn: '#B33C08',
  brandSoftBg: '#FFF4EE',
  brandSoftBorder: '#FDCAA9',
  brandSoftText: '#B33C08',
  greenBg: '#E9F6EC',
  greenBorder: '#A3D9B1',
  greenText: '#1F6B3E',
  greenAccent: '#2E9E57',
  indigoSoftBg: '#F4F3FC',
  indigoSoftBorder: '#D7D3F3',
  indigoSoftText: '#43379A',
  drawerBackdrop: 'rgba(20, 11, 59, 0.50)',
};

export const DARK_PALETTE: OwnerThemePalette = {
  mode: 'dark',
  canvasBg: '#12101F',
  surface: '#18123F',
  surfaceSubtle: '#211A4D',
  border: '#2C2460',
  borderSubtle: '#261E56',
  textPrimary: '#F4F3FC',
  textSecondary: '#B8B1E9',
  textMuted: '#918ADA',
  brandOrange: '#EF5F18',
  brandPrimaryBtn: '#D84C0B',
  brandSoftBg: 'rgba(239, 95, 24, 0.16)',
  brandSoftBorder: 'rgba(239, 95, 24, 0.38)',
  brandSoftText: '#F6803F',
  greenBg: 'rgba(46, 158, 87, 0.16)',
  greenBorder: 'rgba(82, 184, 116, 0.35)',
  greenText: '#6ED494',
  greenAccent: '#2E9E57',
  indigoSoftBg: 'rgba(145, 138, 218, 0.15)',
  indigoSoftBorder: 'rgba(145, 138, 218, 0.35)',
  indigoSoftText: '#C9C4F5',
  drawerBackdrop: 'rgba(8, 5, 24, 0.70)',
};

export function fontStyle(
  weight: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' = 'regular'
) {
  const familyMap = {
    regular: Platform.select({ ios: 'Outfit-Regular', android: 'Outfit-Regular', default: 'Outfit, sans-serif' }),
    medium: Platform.select({ ios: 'Outfit-Medium', android: 'Outfit-Medium', default: 'Outfit, sans-serif' }),
    semibold: Platform.select({ ios: 'Outfit-SemiBold', android: 'Outfit-SemiBold', default: 'Outfit, sans-serif' }),
    bold: Platform.select({ ios: 'Outfit-Bold', android: 'Outfit-Bold', default: 'Outfit, sans-serif' }),
    extrabold: Platform.select({ ios: 'Outfit-ExtraBold', android: 'Outfit-ExtraBold', default: 'Outfit, sans-serif' }),
  } as const;

  const webWeightMap = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  } as const;

  return {
    fontFamily: familyMap[weight],
    ...(Platform.OS === 'web' ? { fontWeight: webWeightMap[weight] } : {}),
    includeFontPadding: false,
  };
}

interface OwnerMobileContextValue {
  user: OwnerMobileUser;
  setUserProfile: (partial: Partial<OwnerMobileUser>) => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (val: boolean) => void;
  theme: OwnerThemeMode;
  palette: OwnerThemePalette;
  toggleTheme: () => void;
}

const DEFAULT_USER: OwnerMobileUser = {
  fullName: 'James Robinson',
  firstName: 'James',
  email: 'james@vantaged.io',
  role: 'Owner Admin',
};

const OwnerMobileContext = createContext<OwnerMobileContextValue | null>(null);

export function OwnerMobileProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [user, setUser] = useState<OwnerMobileUser>(DEFAULT_USER);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [themeOverride, setThemeOverride] = useState<OwnerThemeMode | null>('light');

  const theme: OwnerThemeMode =
    themeOverride ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const palette = theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

  const setUserProfile = useCallback((partial: Partial<OwnerMobileUser>) => {
    setUser((prev) => {
      const nextName = partial.fullName?.trim() || prev.fullName;
      const firstName =
        partial.firstName?.trim() || nextName.split(/\s+/)[0] || prev.firstName;
      return {
        ...prev,
        ...partial,
        fullName: nextName,
        firstName,
      };
    });
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeOverride((prev) => {
      const current = prev ?? (systemScheme === 'dark' ? 'dark' : 'light');
      return current === 'light' ? 'dark' : 'light';
    });
  }, [systemScheme]);

  const value = useMemo<OwnerMobileContextValue>(
    () => ({
      user,
      setUserProfile,
      isDemoMode,
      toggleDemoMode,
      setDemoMode: setIsDemoMode,
      theme,
      palette,
      toggleTheme,
    }),
    [user, setUserProfile, isDemoMode, toggleDemoMode, theme, palette, toggleTheme]
  );

  return (
    <OwnerMobileContext.Provider value={value}>
      {children}
    </OwnerMobileContext.Provider>
  );
}

export function useOwnerMobile() {
  const ctx = useContext(OwnerMobileContext);
  if (!ctx) {
    throw new Error('useOwnerMobile must be used within an OwnerMobileProvider');
  }
  return ctx;
}
