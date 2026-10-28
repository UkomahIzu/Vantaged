import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Colors } from '@/constants/theme';

const FADE_DURATION = 400;

export function AnimatedSplashOverlay() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      opacity: 1,
    },
    40: {
      opacity: 1,
    },
    100: {
      opacity: 0,
    },
  });

  const logoImage = (
    <Image
      style={styles.logo}
      source={require('@/assets/images/vantaged-logo-orange.png')}
      contentFit="contain"
      priority="high"
    />
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(FADE_DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={[styles.splashOverlay, { backgroundColor: colors.background }]}>
      {logoImage}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={[styles.splashOverlay, { backgroundColor: colors.background }]}>
      {logoImage}
    </View>
  );
}

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Image
        style={styles.logo}
        source={require('@/assets/images/vantaged-logo-orange.png')}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 140,
    height: 105,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 105,
  },
});
