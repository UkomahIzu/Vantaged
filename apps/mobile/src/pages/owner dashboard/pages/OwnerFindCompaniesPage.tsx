import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { OwnerMobileShell } from '../components/OwnerMobileShell';
import { OwnerNavIcon } from '../components/OwnerIcons';

export function OwnerFindCompaniesPage() {
  const router = useRouter();
  const { palette } = useOwnerMobile();

  return (
    <OwnerMobileShell activeNav="find-companies">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.kicker, fontStyle('bold'), { color: palette.brandOrange }]}>
            VERIFIED DIRECTORY
          </Text>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Find Companies
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textMuted }]}>
            Browse CAC & COREN accredited construction firms, review portfolios, and issue project briefs.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <OwnerNavIcon id="find-companies" color={palette.brandOrange} size={22} />
          </View>
          <Text style={[styles.cardTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Vetted Builders Marketplace
          </Text>
          <Text style={[styles.cardDesc, fontStyle('regular'), { color: palette.textMuted }]}>
            Filter contractors by Lagos, Abuja, or Port Harcourt corridors, COREN tier, and escrow track record.
          </Text>
          <Pressable
            onPress={() => router.replace('/dashboard')}
            style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
            <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Back to Dashboard Home</Text>
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
  card: {
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
  cardTitle: { fontSize: 16, textAlign: 'center' },
  cardDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  primaryBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 13 },
});

export default OwnerFindCompaniesPage;
