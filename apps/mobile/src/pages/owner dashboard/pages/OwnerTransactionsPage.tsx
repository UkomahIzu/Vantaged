import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { OwnerMobileShell } from '../components/OwnerMobileShell';
import { EscrowShieldIcon, OwnerNavIcon } from '../components/OwnerIcons';

export function OwnerTransactionsPage() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();

  return (
    <OwnerMobileShell activeNav="transactions">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.kicker, fontStyle('bold'), { color: palette.brandOrange }]}>
            ESCROW & LEDGER
          </Text>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Transactions
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textMuted }]}>
            Review milestone disbursements, escrow deposits, and bank transfer receipts.
          </Text>
        </View>

        <View
          style={[
            styles.balanceCard,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={styles.balanceTop}>
            <View
              style={[
                styles.shieldPill,
                { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
              ]}>
              <EscrowShieldIcon color={palette.greenText} size={14} />
              <Text style={[styles.shieldText, fontStyle('bold'), { color: palette.greenText }]}>
                Bank Escrow Protected
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.balanceValue,
              fontStyle('extrabold'),
              { color: palette.textPrimary, fontVariant: ['tabular-nums'] },
            ]}>
            {isDemoMode ? '₦701,746,000' : '₦0'}
          </Text>
          <Text style={[styles.balanceSub, fontStyle('medium'), { color: palette.textMuted }]}>
            Total Milestone Capital Tracked
          </Text>
        </View>

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
            <OwnerNavIcon id="transactions" color={palette.brandOrange} size={22} />
          </View>
          <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            {isDemoMode ? '3 Verified Milestone Transfers' : 'No escrow transactions yet'}
          </Text>
          <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
            {isDemoMode
              ? 'Substructure, Ground Floor Slab, and Superstructure milestone releases are reconciled and receipt-audited.'
              : 'Once a project schedule is initialized, milestone funding tranches and transfer receipts will appear here.'}
          </Text>
          <Pressable
            onPress={() => router.replace('/dashboard')}
            style={[styles.secondaryBtn, { borderColor: palette.border, backgroundColor: palette.surfaceSubtle }]}>
            <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textPrimary }]}>
              Back to Dashboard Home
            </Text>
          </Pressable>
        </View>
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
  balanceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  balanceTop: { flexDirection: 'row' },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  shieldText: { fontSize: 11 },
  balanceValue: { fontSize: 28, letterSpacing: -0.6 },
  balanceSub: { fontSize: 12 },
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
  emptyDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  secondaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 12.5 },
});

export default OwnerTransactionsPage;
