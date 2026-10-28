import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Radius, Tokens, Spacing } from '@/constants/theme';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing[4],
          paddingBottom: Math.max(insets.bottom, Spacing[4]),
        },
      ]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vantaged Workspace</Text>
        <Text style={styles.subtitle}>Active projects and site intelligence</Text>
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Real-Time Oversight</Text>
        </View>
        <Text style={styles.cardTitle}>Verified Engineering Portal</Text>
        <Text style={styles.cardBody}>
          Connect with registered COREN engineers, oversee construction milestones, and manage escrow disbursements.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.push('/')}>
          <Text style={styles.backButtonText}>← Back to Welcome Page</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FA',
    paddingHorizontal: Spacing[6],
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: Spacing[4],
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#261A66',
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 13,
    color: '#7C7894',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg, // 14px
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: '#E2E0EC',
    shadowColor: '#261A66',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4EE',
    borderColor: '#FDCAA9',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: 12,
  },
  badgeText: {
    color: '#B33C08',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#261A66',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5E5A7D',
    fontFamily: Platform.select({
      ios: 'Outfit',
      android: 'Outfit',
      default: 'Outfit, sans-serif',
    }),
  },
  footer: {
    paddingBottom: Spacing[4],
  },
  backButton: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0EC',
    borderRadius: Radius.md, // 10px
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: '#EFEEF5',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#261A66',
    fontFamily: Platform.select({
      ios: 'Outfit-Bold',
      android: 'Outfit-Bold',
      default: 'Outfit, sans-serif',
    }),
  },
});
