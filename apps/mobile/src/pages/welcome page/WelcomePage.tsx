import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Radius, Tokens, Spacing } from '@/constants/theme';

export interface WelcomeSlide {
  id: string;
  title: string;
  image: ImageSource | string | number;
}

export const WELCOME_SLIDES: WelcomeSlide[] = [
  {
    id: 'track-construction',
    title: 'Track Your Construction\nFrom Anywhere',
    image: require('../../../assets/images/welcome-slide-1.jpg'),
  },
  {
    id: 'verified-engineers',
    title: 'Verified & Certified\nCOREN Engineers',
    image: require('../../../assets/images/welcome-slide-2.jpg'),
  },
  {
    id: 'escrow-milestones',
    title: 'Escrow Protection\nFor Every Milestone',
    image: require('../../../assets/images/welcome-slide-3.jpg'),
  },
  {
    id: 'site-intelligence',
    title: 'Live Site Intelligence,\nZero Blind Spots',
    image: require('../../../assets/images/welcome-slide-4.jpg'),
  },
];

export interface WelcomePageProps {
  slides?: WelcomeSlide[];
  onFinish?: () => void;
  onSkip?: () => void;
}

export function WelcomePage({
  slides = WELCOME_SLIDES,
  onFinish,
  onSkip,
}: WelcomePageProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<WelcomeSlide>>(null);

  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (width <= 0) return;
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      if (index >= 0 && index < slides.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [width, slides.length, activeIndex]
  );

  const handleNext = () => {
    if (isLastSlide) {
      if (onFinish) {
        onFinish();
      } else {
        try {
          router.push('/signup');
        } catch {
          router.push('/signin');
        }
      }
    } else {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push('/signin');
    }
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Bar: Skip Button at Top Right */}
      <View
        style={[
          styles.topBar,
          {
            top: insets.top + Spacing[2],
            paddingHorizontal: Spacing[5],
          },
        ]}>
        <View style={styles.topBarSpacer} />

        {!isLastSlide ? (
          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.skipButtonPressed,
            ]}
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip to sign in">
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.skipButtonPlaceholder} />
        )}
      </View>

      {/* Horizontal Slider of 4 Pages */}
      <FlatList
        ref={flatListRef}
        style={styles.slider}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        removeClippedSubviews={false}
        initialNumToRender={slides.length}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width, height }]}>
            {/* Background Photo with Explicit Width & Height for Expo Image / Fabric */}
            <Image
              source={item.image}
              style={[styles.backgroundImage, { width, height }]}
              contentFit="cover"
              contentPosition="center"
              priority="high"
            />

            {/* Cinematic Gradient Scrim */}
            <LinearGradient
              pointerEvents="none"
              colors={[
                'rgba(18, 16, 31, 0.25)',
                'rgba(18, 16, 31, 0.08)',
                'rgba(18, 16, 31, 0.45)',
                'rgba(18, 16, 31, 0.88)',
                Tokens.color.neutral[950],
              ]}
              locations={[0, 0.3, 0.58, 0.82, 1.0]}
              style={[styles.backgroundGradient, { width, height }]}
            />

            {/* Slide Content: Headline centered in lower portion */}
            <View
              style={[
                styles.slideContent,
                {
                  paddingBottom: Math.max(insets.bottom, Spacing[5]) + 150,
                },
              ]}>
              <Text style={styles.headline}>{item.title}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Floating Controls */}
      <View
        style={[
          styles.bottomControls,
          {
            paddingBottom: Math.max(insets.bottom, Spacing[4]) + Spacing[2],
          },
        ]}
        pointerEvents="box-none">
        {/* 4 Pagination Indicator Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <Pressable
                key={index}
                onPress={() => handleDotPress(index)}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Go to slide ${index + 1}`}
              />
            );
          })}
        </View>

        {/* Primary Button */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Sign Up' : 'Next'}>
          <Text style={styles.actionButtonText}>
            {isLastSlide ? 'Sign Up' : 'Next'}
          </Text>
        </Pressable>

        {/* Final Slide Footer */}
        {isLastSlide ? (
          <View style={styles.loginRow}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <Pressable
              onPress={() => router.push('/signin')}
              accessibilityRole="link"
              accessibilityLabel="Log in to existing account">
              <Text style={styles.loginLinkText}>Log In</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyFooterSpace} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.color.neutral[950],
  },
  slider: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 40,
    height: 40,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    transform: [{ scale: 0.97 }],
  },
  skipButtonPlaceholder: {
    width: 60,
    height: 32,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  slide: {
    position: 'relative',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slideContent: {
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
  },
  headline: {
    fontSize: Tokens.font.size['4xl'],
    lineHeight: 44,
    color: Tokens.color.white,
    textAlign: 'center',
    letterSpacing: -0.6,
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '800' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-ExtraBold',
      android: 'Outfit-ExtraBold',
      default: 'Outfit, sans-serif',
    }),
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 35,
    paddingHorizontal: Spacing[6],
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: Tokens.color.orange[500],
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  actionButton: {
    width: '100%',
    backgroundColor: Tokens.color.orange[500],
    height: 52,
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Tokens.color.orange[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  actionButtonText: {
    width: '100%',
    color: Tokens.color.white,
    fontSize: Tokens.font.size.md,
    textAlign: 'center',
    includeFontPadding: false,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    height: 22,
  },
  alreadyText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13.5,
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  loginLinkText: {
    color: Tokens.color.orange[500],
    fontSize: 13.5,
    ...(Platform.OS === 'web' ? { fontWeight: '700' as const } : {}),
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
    textDecorationLine: 'underline',
  },
  emptyFooterSpace: {
    height: 22,
    marginTop: 14,
  },
});

export default WelcomePage;
