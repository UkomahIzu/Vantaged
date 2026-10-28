import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

interface LoadingScreenProps {
  /** Optional custom background color override */
  backgroundColor?: string;
  /** Size scaling for the logo */
  logoWidth?: number;
}

export function LoadingScreen({ backgroundColor, logoWidth = 140 }: LoadingScreenProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const bg = backgroundColor || colors.background;
  const logoHeight = Math.round((logoWidth * 289) / 388); // Vantaged V mark aspect ratio

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Image
        source={require('@/assets/images/vantaged-logo-orange.png')}
        style={{ width: logoWidth, height: logoHeight }}
        contentFit="contain"
        priority="high"
      />
    </View>
  );
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
