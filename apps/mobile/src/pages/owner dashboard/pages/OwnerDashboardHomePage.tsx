import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { SiteWeatherModal } from '../components/OwnerHomeModals';
import {
  OwnerActiveProgressSection,
  OwnerHeroGreetingSection,
  OwnerHistoryAndNotificationsSection,
  OwnerQuickActionsGrid,
  OwnerSearchBar,
  OwnerStatsSummarySection,
} from '../components/OwnerHomeSections';

export function OwnerDashboardHomePage() {
  const { isDemoMode, palette } = useOwnerMobile();
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Global Search Bar */}
        <OwnerSearchBar />

        {/* Top Section: Hero Greeting & 4 Squircle Quick Action Cards */}
        <OwnerHeroGreetingSection />
        <OwnerQuickActionsGrid />

        {/* Summary Stat Cards */}
        <OwnerStatsSummarySection />

        {/* Live Construction Milestone Progress Card (Swipeable) */}
        <OwnerActiveProgressSection />

        {/* Contract History & Notifications */}
        <OwnerHistoryAndNotificationsSection />

        {/* Site Governance & Field Operations (shown when Demo Mode is active) */}
        {isDemoMode && (
          <View
            style={[
              styles.fieldCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={[styles.fieldHeader, { borderBottomColor: palette.borderSubtle }]}>
              <Text style={[styles.fieldKicker, fontStyle('bold'), { color: palette.brandOrange }]}>
                SITE FIELD OPERATIONS
              </Text>
              <Text style={[styles.fieldTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Attendance, Weather & Compliance
              </Text>
            </View>
            <View style={styles.fieldRow}>
              <Pressable
                onPress={() => setIsWeatherOpen(true)}
                style={[
                  styles.fieldMiniBox,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <Text style={[styles.fieldMiniVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  29°C · Dry
                </Text>
                <Text style={[styles.fieldMiniSub, fontStyle('medium'), { color: palette.textMuted }]}>
                  Lekki Site Weather · Tap
                </Text>
              </Pressable>
              <View
                style={[
                  styles.fieldMiniBox,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <Text style={[styles.fieldMiniVal, fontStyle('extrabold'), { color: palette.greenText }]}>
                  14 Checked In
                </Text>
                <Text style={[styles.fieldMiniSub, fontStyle('medium'), { color: palette.textMuted }]}>
                  GPS Geofence Active
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {isWeatherOpen && (
        <SiteWeatherModal visible={isWeatherOpen} onClose={() => setIsWeatherOpen(false)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  fieldCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  fieldHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  fieldKicker: {
    fontSize: 10,
    letterSpacing: 0.6,
  },
  fieldTitle: {
    fontSize: 15,
    marginTop: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldMiniBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  fieldMiniVal: {
    fontSize: 15,
  },
  fieldMiniSub: {
    fontSize: 11,
    marginTop: 2,
  },
});

export default OwnerDashboardHomePage;
