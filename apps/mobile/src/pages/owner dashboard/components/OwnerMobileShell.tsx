import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Line } from 'react-native-svg';

import {
  OWNER_BOTTOM_NAV_ITEMS,
  OWNER_DRAWER_NAV_ITEMS,
  OwnerNavId,
} from '../data/ownerDashboardData';
import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  LogoutIcon,
  MenuHamburgerIcon,
  MoonIcon,
  OwnerNavIcon,
  SunIcon,
} from './OwnerIcons';
import { OwnerProfileModal } from './OwnerHomeModals';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(296, Math.round(SCREEN_WIDTH * 0.82));

interface OwnerMobileShellProps {
  activeNav: OwnerNavId;
  children: React.ReactNode;
}

export function OwnerMobileShell({ activeNav, children }: OwnerMobileShellProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    user,
    palette,
    theme,
    toggleTheme,
    isDemoMode,
    toggleDemoMode,
  } = useOwnerMobile();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const floatOffset = useSharedValue(0);

  useEffect(() => {
    floatOffset.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1250, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1250, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [floatOffset]);

  const diamondFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatOffset.value }],
  }));

  const edgeOpenResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          !isDrawerOpen &&
          gesture.dx > 12 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > 28 || gesture.vx > 0.3) {
            openDrawer();
          }
        },
      }),
    [isDrawerOpen, openDrawer]
  );

  const drawerCloseResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          isDrawerOpen &&
          gesture.dx < -12 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -28 || gesture.vx < -0.3) {
            closeDrawer();
          }
        },
      }),
    [isDrawerOpen, closeDrawer]
  );

  const initials = user.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

  const handleNavigate = (
    href:
      | (typeof OWNER_BOTTOM_NAV_ITEMS)[number]['href']
      | (typeof OWNER_DRAWER_NAV_ITEMS)[number]['href']
  ) => {
    closeDrawer();
    router.navigate(href);
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.canvasBg }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      {/* ── Top App Header Bar ── */}
      <View
        style={[
          styles.topHeader,
          {
            paddingTop: Math.max(insets.top, RNStatusBar.currentHeight ?? 10) + 6,
            backgroundColor: palette.surface,
            borderBottomColor: palette.border,
          },
        ]}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={openDrawer}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            style={[
              styles.iconBtn,
              {
                backgroundColor: palette.surfaceSubtle,
                borderColor: palette.border,
              },
            ]}>
            <MenuHamburgerIcon color={palette.textPrimary} size={19} />
          </Pressable>

          <Pressable
            onPress={() => handleNavigate('/dashboard')}
            style={styles.brandLink}>
            {theme === 'dark' ? (
              <View style={styles.darkBrandRow}>
                <Image
                  source={require('../../../../assets/images/vantaged-v-white.png')}
                  style={styles.darkLogoMark}
                  contentFit="contain"
                />
                <Text style={[styles.darkBrandText, fontStyle('extrabold')]}>Vantaged</Text>
              </View>
            ) : (
              <Image
                source={require('../../../../assets/images/vantaged-measurement-logo.png')}
                style={styles.headerLogo}
                contentFit="contain"
              />
            )}
            <View style={[styles.onlineDot, { backgroundColor: palette.greenAccent }]} />
          </Pressable>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => handleNavigate('/notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={[
              styles.iconBtn,
              {
                backgroundColor: palette.surfaceSubtle,
                borderColor: palette.border,
              },
            ]}>
            <OwnerNavIcon id="notifications" color={palette.textSecondary} size={17} />
            {isDemoMode && (
              <View
                style={[
                  styles.notifDot,
                  {
                    backgroundColor: palette.brandOrange,
                    borderColor: palette.surface,
                  },
                ]}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => setIsProfileOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open owner profile"
            style={[
              styles.avatarCircle,
              {
                backgroundColor: palette.textPrimary,
                borderColor: palette.border,
              },
            ]}>
            <Text style={[styles.avatarText, fontStyle('bold'), { color: palette.surface }]}>
              {initials || 'JR'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ── Main Content Area + Left-Edge Swipe-to-Open Zone ── */}
      <View style={styles.body}>
        {children}
        {!isDrawerOpen && (
          <View
            {...edgeOpenResponder.panHandlers}
            style={styles.leftSwipeZone}
          />
        )}
      </View>

      {/* ── Bottom Navigation Bar (Home, Projects, [+ Find Companies], Transactions, Reps) ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            backgroundColor: palette.surface,
            borderTopColor: palette.border,
          },
        ]}>
        {OWNER_BOTTOM_NAV_ITEMS.slice(0, 2).map((item) => {
          const isActive = activeNav === item.id;
          const iconColor = isActive ? palette.brandOrange : palette.textMuted;
          const badge = item.id === 'projects' && isDemoMode ? 3 : undefined;

          return (
            <Pressable
              key={item.id}
              onPress={() => handleNavigate(item.href)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={styles.bottomTab}>
              <View style={styles.bottomIconWrap}>
                <OwnerNavIcon
                  id={item.id}
                  color={iconColor}
                  size={20}
                  strokeWidth={isActive ? 2.3 : 1.9}
                />
                {badge !== undefined && (
                  <View
                    style={[
                      styles.tabBadge,
                      {
                        backgroundColor: palette.brandOrange,
                        borderColor: palette.surface,
                      },
                    ]}>
                    <Text style={[styles.tabBadgeText, fontStyle('bold')]}>{badge}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.bottomLabel,
                  fontStyle(isActive ? 'bold' : 'semibold'),
                  { color: isActive ? palette.brandOrange : palette.textMuted },
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        {/* Center Diamond Quick-Start Button -> Find Companies */}
        <Animated.View style={[styles.centerDiamondSlot, diamondFloatStyle]}>
          <Pressable
            onPress={() => handleNavigate('/find-companies')}
            accessibilityRole="button"
            accessibilityLabel="Start a new project via Find Companies"
            style={[
              styles.diamondBtn,
              {
                backgroundColor: palette.brandOrange,
                borderColor: palette.surface,
              },
            ]}>
            <View style={styles.diamondInner}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                  stroke="#FFFFFF"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                />
                <Line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  stroke="#FFFFFF"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </Pressable>
        </Animated.View>

        {OWNER_BOTTOM_NAV_ITEMS.slice(2).map((item) => {
          const isActive = activeNav === item.id;
          const iconColor = isActive ? palette.brandOrange : palette.textMuted;

          return (
            <Pressable
              key={item.id}
              onPress={() => handleNavigate(item.href)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={styles.bottomTab}>
              <View style={styles.bottomIconWrap}>
                <OwnerNavIcon
                  id={item.id}
                  color={iconColor}
                  size={20}
                  strokeWidth={isActive ? 2.3 : 1.9}
                />
              </View>
              <Text
                style={[
                  styles.bottomLabel,
                  fontStyle(isActive ? 'bold' : 'semibold'),
                  { color: isActive ? palette.brandOrange : palette.textMuted },
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Left-Side Slide-Out Drawer Menu (Remaining Navigation + Demo Toggle + Account Card) ── */}
      {isDrawerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(180)}
            style={[StyleSheet.absoluteFill, { backgroundColor: palette.drawerBackdrop }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
          </Animated.View>

          <Animated.View
            entering={SlideInLeft.duration(220)}
            exiting={SlideOutLeft.duration(200)}
            {...drawerCloseResponder.panHandlers}
            style={[
              styles.drawerPanel,
              {
                width: DRAWER_WIDTH,
                paddingTop: Math.max(insets.top, 14) + 8,
                paddingBottom: Math.max(insets.bottom, 14) + 6,
                backgroundColor: palette.surface,
                borderRightColor: palette.border,
              },
            ]}>
            {/* Top Group: Logo & Close + Remaining Nav Links */}
            <View style={styles.drawerTop}>
              <View style={[styles.drawerHeader, { borderBottomColor: palette.borderSubtle }]}>
                {theme === 'dark' ? (
                  <View style={styles.darkBrandRow}>
                    <Image
                      source={require('../../../../assets/images/vantaged-v-white.png')}
                      style={styles.darkLogoMark}
                      contentFit="contain"
                    />
                    <Text style={[styles.darkBrandText, fontStyle('extrabold')]}>Vantaged</Text>
                  </View>
                ) : (
                  <Image
                    source={require('../../../../assets/images/vantaged-measurement-logo.png')}
                    style={styles.drawerLogo}
                    contentFit="contain"
                  />
                )}

              <Pressable
                onPress={closeDrawer}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                style={[
                  styles.closeDrawerBtn,
                  {
                    backgroundColor: palette.surfaceSubtle,
                    borderColor: palette.border,
                  },
                ]}>
                <Text style={[styles.closeDrawerText, fontStyle('bold'), { color: palette.textSecondary }]}>
                  ✕
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.drawerSectionLabel, fontStyle('bold'), { color: palette.textMuted }]}>
              MORE WORKSPACE
            </Text>

            <View style={styles.drawerNavList}>
              {OWNER_DRAWER_NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                const badge = item.id === 'notifications' && isDemoMode ? 3 : undefined;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleNavigate(item.href)}
                    style={[
                      styles.drawerNavItem,
                      isActive
                        ? {
                            backgroundColor: palette.brandSoftBg,
                            borderColor: palette.brandSoftBorder,
                          }
                        : {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                          },
                    ]}>
                    <View style={styles.drawerNavLeft}>
                      <OwnerNavIcon
                        id={item.id}
                        color={isActive ? palette.brandOrange : palette.textMuted}
                        size={19}
                      />
                      <Text
                        style={[
                          styles.drawerNavLabel,
                          fontStyle(isActive ? 'bold' : 'semibold'),
                          { color: isActive ? palette.brandSoftText : palette.textSecondary },
                        ]}>
                        {item.label}
                      </Text>
                    </View>
                    {badge !== undefined && (
                      <View
                        style={[
                          styles.drawerBadge,
                          {
                            backgroundColor: isActive ? palette.brandOrange : palette.surfaceSubtle,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.drawerBadgeText,
                            fontStyle('bold'),
                            { color: isActive ? '#FFFFFF' : palette.textSecondary },
                          ]}>
                          {badge}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Bottom Stack: Light/Dark Mode + Demo Data Toggle + User Account Card */}
          <View style={styles.drawerBottom}>
            {/* Light / Dark Mode Switch */}
            <View
              style={[
                styles.demoCard,
                {
                  backgroundColor: palette.surfaceSubtle,
                  borderColor: palette.border,
                },
              ]}>
              <View style={styles.themeLeftRow}>
                {theme === 'light' ? (
                  <SunIcon color={palette.brandOrange} size={17} />
                ) : (
                  <MoonIcon color="#F6803F" size={17} />
                )}
                <View style={styles.demoTextCol}>
                  <Text style={[styles.demoTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                  <Text style={[styles.demoSub, fontStyle('regular'), { color: palette.textMuted }]}>
                    {theme === 'dark' ? 'Deep indigo surface' : 'Clean daylight surface'}
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#CBC8DA', true: palette.brandOrange }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Demo Data Switch */}
            <View
              style={[
                styles.demoCard,
                {
                  backgroundColor: palette.surfaceSubtle,
                  borderColor: palette.border,
                },
              ]}>
              <View style={styles.demoTextCol}>
                <Text style={[styles.demoTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Demo Data
                </Text>
                <Text style={[styles.demoSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  {isDemoMode ? 'Mock projects' : 'Empty state (New user)'}
                </Text>
              </View>
              <Switch
                value={isDemoMode}
                onValueChange={toggleDemoMode}
                trackColor={{ false: '#CBC8DA', true: palette.brandOrange }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Owner Account Card */}
            <View
              style={[
                styles.accountCard,
                {
                  backgroundColor: palette.surfaceSubtle,
                  borderColor: palette.border,
                },
              ]}>
              <Pressable
                onPress={() => {
                  closeDrawer();
                  setIsProfileOpen(true);
                }}
                style={styles.accountLeft}>
                <View style={[styles.accountAvatar, { backgroundColor: palette.textPrimary }]}>
                  <Text style={[styles.accountAvatarText, fontStyle('bold'), { color: palette.surface }]}>
                    {initials || 'JR'}
                  </Text>
                  <View
                    style={[
                      styles.accountOnlineDot,
                      {
                        backgroundColor: palette.greenAccent,
                        borderColor: palette.surface,
                      },
                    ]}
                  />
                </View>
                <View style={styles.accountInfo}>
                  <Text
                    style={[styles.accountName, fontStyle('bold'), { color: palette.textPrimary }]}
                    numberOfLines={1}>
                    {user.fullName}
                  </Text>
                  <Text style={[styles.accountRole, fontStyle('bold'), { color: palette.brandSoftText }]}>
                    {user.role.toUpperCase()}
                  </Text>
                  <Text
                    style={[styles.accountEmail, fontStyle('regular'), { color: palette.textMuted }]}
                    numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  closeDrawer();
                  router.replace('/signin');
                }}
                accessibilityRole="button"
                accessibilityLabel="Sign Out"
                style={styles.logoutBtn}>
                <LogoutIcon color="#E11D48" size={18} />
              </Pressable>
            </View>
          </View>
          </Animated.View>
        </View>
      )}

      {isProfileOpen && (
        <OwnerProfileModal
          visible={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  darkBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  darkLogoMark: {
    width: 24,
    height: 24,
  },
  darkBrandText: {
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: -0.4,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    zIndex: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  brandLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLogo: {
    width: 126,
    height: 28,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  leftSwipeZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 28,
    zIndex: 25,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 6,
    borderTopWidth: 1,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  bottomIconWrap: {
    position: 'relative',
    paddingHorizontal: 6,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  bottomLabel: {
    fontSize: 10.5,
    textAlign: 'center',
  },
  centerDiamondSlot: {
    width: 62,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  diamondBtn: {
    position: 'absolute',
    top: -31,
    width: 46,
    height: 46,
    borderRadius: 13,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#EF5F18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 6,
  },
  diamondInner: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    shadowColor: '#140B3B',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 16,
  },
  drawerTop: {
    gap: 12,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  drawerLogo: {
    width: 145,
    height: 32,
  },
  closeDrawerBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDrawerText: {
    fontSize: 13,
  },
  drawerSectionLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    paddingHorizontal: 6,
  },
  drawerNavList: {
    gap: 6,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  drawerNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerNavLabel: {
    fontSize: 13.5,
  },
  drawerBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  drawerBadgeText: {
    fontSize: 10,
  },
  drawerBottom: {
    gap: 10,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  themeLeftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  demoTitle: {
    fontSize: 12.5,
  },
  demoSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  accountAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  accountAvatarText: {
    fontSize: 12,
  },
  accountOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  accountInfo: {
    flex: 1,
    minWidth: 0,
  },
  accountName: {
    fontSize: 12.5,
  },
  accountRole: {
    fontSize: 9.5,
    letterSpacing: 0.4,
    marginTop: 1,
  },
  accountEmail: {
    fontSize: 10.5,
    marginTop: 1,
  },
  logoutBtn: {
    padding: 6,
  },
});
