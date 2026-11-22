import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { DEMO_OWNER_NOTIFICATIONS } from '../data/ownerDashboardData';
import { OwnerMobileShell } from '../components/OwnerMobileShell';
import { OwnerNavIcon } from '../components/OwnerIcons';

export function OwnerNotificationsPage() {
  const { palette, isDemoMode } = useOwnerMobile();
  const notifications = isDemoMode ? DEMO_OWNER_NOTIFICATIONS : [];

  return (
    <OwnerMobileShell activeNav="notifications">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.kicker, fontStyle('bold'), { color: palette.brandOrange }]}>
            ALERTS & UPDATES
          </Text>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Notifications
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textMuted }]}>
            Milestone review prompts, receipt confirmations, and independent inspection alerts.
          </Text>
        </View>

        {notifications.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
              ]}>
              <OwnerNavIcon id="notifications" color={palette.brandOrange} size={22} />
            </View>
            <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              All caught up!
            </Text>
            <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
              You have no pending stage approvals or escrow alerts right now.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.notifCard,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}>
                <Text style={[styles.notifTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.notifSub, fontStyle('regular'), { color: palette.textSecondary }]}>
                  {item.subtitle}
                </Text>
                <Text style={[styles.notifTime, fontStyle('medium'), { color: palette.textMuted }]}>
                  {item.timestamp}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, textAlign: 'center' },
  emptyDesc: { fontSize: 12.5, textAlign: 'center', lineHeight: 18, marginTop: 6 },
  list: { gap: 10 },
  notifCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 15,
    gap: 4,
  },
  notifTitle: { fontSize: 13.5 },
  notifSub: { fontSize: 12, lineHeight: 17 },
  notifTime: { fontSize: 10.5, marginTop: 2 },
});

export default OwnerNotificationsPage;
