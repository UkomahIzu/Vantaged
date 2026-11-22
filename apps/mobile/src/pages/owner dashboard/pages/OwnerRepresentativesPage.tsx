import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { OwnerMobileShell } from '../components/OwnerMobileShell';
import { OwnerNavIcon } from '../components/OwnerIcons';
import { InviteRepresentativeModal } from '../components/OwnerHomeModals';

export function OwnerRepresentativesPage() {
  const { palette, isDemoMode } = useOwnerMobile();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <OwnerMobileShell activeNav="representatives">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.kicker, fontStyle('bold'), { color: palette.brandOrange }]}>
            DELEGATED OVERSIGHT
          </Text>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Client Representatives
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textMuted }]}>
            Assign trusted family proxies or consulting engineers with granular approval permissions.
          </Text>
        </View>

        {isDemoMode ? (
          <View style={styles.list}>
            <View
              style={[
                styles.repCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <Text style={[styles.repName, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Arc. Bamidele Ogunleye
              </Text>
              <Text style={[styles.repRole, fontStyle('medium'), { color: palette.textSecondary }]}>
                Consulting Architect • Villa Victoria, Lekki Phase 1
              </Text>
              <View style={styles.permRow}>
                <View
                  style={[
                    styles.permBadge,
                    { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                  ]}>
                  <Text style={[styles.permText, fontStyle('bold'), { color: palette.greenText }]}>
                    Approve Stages
                  </Text>
                </View>
                <View
                  style={[
                    styles.permBadge,
                    { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                  ]}>
                  <Text style={[styles.permText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                    Site Logs Access
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
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
              <OwnerNavIcon id="representatives" color={palette.brandOrange} size={22} />
            </View>
            <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              No representatives assigned yet
            </Text>
            <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
              Invite a local architect, quantity surveyor, or family proxy to review site submissions on your behalf.
            </Text>
          </View>
        )}

        <Pressable
          onPress={() => setIsInviteOpen(true)}
          style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
          <Text style={[styles.primaryBtnText, fontStyle('bold')]}>+ Invite Representative</Text>
        </Pressable>
      </ScrollView>

      <InviteRepresentativeModal visible={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
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
  list: { gap: 10 },
  repCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  repName: { fontSize: 15.5 },
  repRole: { fontSize: 12 },
  permRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  permBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  permText: { fontSize: 10.5 },
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
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 13.5 },
});

export default OwnerRepresentativesPage;
