import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { DEMO_OWNER_PROJECTS } from '../data/ownerDashboardData';
import { OwnerMobileShell } from '../components/OwnerMobileShell';
import { OwnerNavIcon } from '../components/OwnerIcons';

export function OwnerProjectsPage() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();
  const projects = isDemoMode ? DEMO_OWNER_PROJECTS : [];

  return (
    <OwnerMobileShell activeNav="projects">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.kicker, fontStyle('bold'), { color: palette.brandOrange }]}>
            PROJECTS DIRECTORY
          </Text>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Your Construction Sites
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textMuted }]}>
            Track verified vs. reported milestone progress, site logs, and COREN sign-offs.
          </Text>
        </View>

        {projects.length === 0 ? (
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
              <OwnerNavIcon id="projects" color={palette.brandOrange} size={22} />
            </View>
            <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              No active construction sites yet
            </Text>
            <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
              Browse vetted CAC & COREN construction firms to initialize your first escrow-protected project.
            </Text>
            <Pressable
              onPress={() => router.push('/find-companies')}
              style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
              <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Find Verified Builders</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {projects.map((project) => (
              <View
                key={project.id}
                style={[
                  styles.projectCard,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}>
                <View style={styles.projectTop}>
                  <Text style={[styles.projectTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                    {project.title}
                  </Text>
                  <View
                    style={[
                      styles.percentBadge,
                      { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                    ]}>
                    <Text style={[styles.percentText, fontStyle('bold'), { color: palette.greenText }]}>
                      {project.verifiedPercent}% Verified
                    </Text>
                  </View>
                </View>
                <Text style={[styles.projectMeta, fontStyle('regular'), { color: palette.textMuted }]}>
                  {project.location} • {project.specs}
                </Text>
                <View
                  style={[
                    styles.stageBox,
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                  ]}>
                  <Text style={[styles.stageKicker, fontStyle('bold'), { color: palette.brandSoftText }]}>
                    ACTIVE STAGE
                  </Text>
                  <Text style={[styles.stageTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                    {project.scopeTitle}
                  </Text>
                </View>
                <Text style={[styles.builderMeta, fontStyle('medium'), { color: palette.textSecondary }]}>
                  Contractor: {project.contractorName} ({project.contractorRating})
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
  emptyDesc: {
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
  list: { gap: 12 },
  projectCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  projectTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  projectTitle: { fontSize: 15.5, flex: 1 },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  percentText: { fontSize: 10.5 },
  projectMeta: { fontSize: 11.5 },
  stageBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 2,
  },
  stageKicker: { fontSize: 9.5, letterSpacing: 0.5 },
  stageTitle: { fontSize: 12.5 },
  builderMeta: { fontSize: 11.5 },
});

export default OwnerProjectsPage;
