import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { OwnerMobileShell } from '../components/OwnerMobileShell';
import { OwnerProfileModal } from '../components/OwnerHomeModals';

export function OwnerSettingsPage() {
  const { user, palette, theme, toggleTheme, isDemoMode, toggleDemoMode } = useOwnerMobile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <OwnerMobileShell activeNav="settings">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.kicker, fontStyle('bold'), { color: palette.brandOrange }]}>
            ACCOUNT & PREFERENCES
          </Text>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textMuted }]}>
            Manage your Owner profile, NIN verification details, and workspace preferences.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: palette.brandOrange }]}>
              <Text style={[styles.avatarText, fontStyle('extrabold')]}>
                {user.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileCol}>
              <Text style={[styles.profileName, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                {user.fullName}
              </Text>
              <Text style={[styles.profileSub, fontStyle('medium'), { color: palette.textMuted }]}>
                {user.email}
              </Text>
              <Text style={[styles.profileSub, fontStyle('medium'), { color: palette.textMuted }]}>
                {user.role}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setIsProfileOpen(true)}
            style={[
              styles.editBtn,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <Text style={[styles.editBtnText, fontStyle('bold'), { color: palette.brandSoftText }]}>
              Edit Profile & Contact Details
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                Dark Mode
              </Text>
              <Text style={[styles.toggleSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Switch between Vantaged Light and Deep Indigo Dark themes
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: palette.border, true: palette.brandOrange }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: palette.borderSubtle }]} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                Demo Data Mode
              </Text>
              <Text style={[styles.toggleSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Preview sample Nigerian builds, escrow ledger, and milestone alerts
              </Text>
            </View>
            <Switch
              value={isDemoMode}
              onValueChange={toggleDemoMode}
              trackColor={{ false: palette.border, true: palette.brandOrange }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>

      <OwnerProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </OwnerMobileShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 24, gap: 14 },
  headerBlock: { gap: 3 },
  kicker: { fontSize: 10.5, letterSpacing: 0.6 },
  title: { fontSize: 22, letterSpacing: -0.4 },
  subtitle: { fontSize: 12.5, lineHeight: 18 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 18 },
  profileCol: { flex: 1, gap: 2 },
  profileName: { fontSize: 16 },
  profileSub: { fontSize: 12 },
  editBtn: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: { fontSize: 12.5 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextCol: { flex: 1, gap: 2 },
  toggleTitle: { fontSize: 13.5 },
  toggleSub: { fontSize: 11.5, lineHeight: 16 },
  divider: { height: 1 },
});

export default OwnerSettingsPage;
