import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import type { OwnerFolderProjectItem } from '../data/ownerDashboardData';

interface ProjectFolderCardProps {
  project: OwnerFolderProjectItem;
  variant?: 'orange' | 'white';
  isSelected?: boolean;
  hideProgress?: boolean;
  onSelect?: (project: OwnerFolderProjectItem) => void;
}

const FOLDER_FRONT_PATH =
  'M 0,36 C 40,36, 60,30, 95,16 C 125,4, 145,0, 180,0 L 304,0 Q 320,0, 320,16 L 320,164 Q 320,180, 304,180 L 16,180 Q 0,180, 0,164 Z';

export function ProjectFolderCard({
  project,
  variant = 'white',
  isSelected = false,
  hideProgress = false,
  onSelect,
}: ProjectFolderCardProps) {
  const { palette } = useOwnerMobile();
  const isOrange = variant === 'orange';
  const clampedProgress = Math.max(0, Math.min(100, project.progressPercent));

  const tabBg = isOrange
    ? '#EF5F18'
    : isSelected
    ? palette.surfaceSubtle
    : palette.borderSubtle;
  const tabBorder = isOrange
    ? isSelected
      ? 'rgba(255,255,255,0.65)'
      : '#D84C0B'
    : isSelected
    ? '#FBA674'
    : palette.border;

  const backPlateBg = isOrange
    ? '#EF5F18'
    : isSelected
    ? palette.surfaceSubtle
    : palette.surfaceSubtle;
  const backPlateBorder = isOrange
    ? isSelected
      ? 'rgba(255,255,255,0.45)'
      : '#D84C0B'
    : isSelected
    ? '#FDCAA9'
    : palette.border;

  return (
    <Pressable
      onPress={() => onSelect?.(project)}
      style={({ pressed }) => [
        styles.wrapper,
        {
          transform: [
            { translateY: isSelected ? -8 : 0 },
            { scale: pressed ? 0.98 : 1 },
          ],
          zIndex: isSelected ? 20 : 1,
        },
      ]}>
      {/* 1. Back Folder Flap (Asymmetrical Top-Left Tab + Back Plate) */}
      <View style={styles.backLayer} pointerEvents="none">
        <View style={styles.tabRow}>
          <View
            style={[
              styles.backTab,
              {
                backgroundColor: tabBg,
                borderColor: tabBorder,
              },
            ]}
          />
          <View
            style={[
              styles.tabBridge,
              { borderBottomColor: tabBorder },
            ]}
          />
        </View>
        <View
          style={[
            styles.backPlate,
            {
              backgroundColor: backPlateBg,
              borderColor: backPlateBorder,
            },
          ]}
        />
      </View>

      {/* 2. Inserted White Paper Sheet (Pops up cleanly when selected) */}
      <View
        pointerEvents="none"
        style={[
          styles.paperSheet,
          {
            backgroundColor: '#FFFFFF',
            borderColor: isSelected ? '#F78241' : palette.border,
            transform: [{ translateY: isSelected ? -18 : 0 }],
            shadowOpacity: isSelected ? 0.16 : 0.06,
            elevation: isSelected ? 6 : 2,
          },
        ]}>
        {/* Top Row: Snippet 1 + Selected pill / Category */}
        <View style={styles.paperTopRow}>
          <Text
            numberOfLines={1}
            style={[styles.snippetPrimary, fontStyle('bold'), { color: '#261A66' }]}>
            {project.snippetLines[0] || ''}
          </Text>
          {isSelected ? (
            <View style={styles.selectedPill}>
              <View style={styles.selectedDot} />
              <Text style={[styles.selectedPillText, fontStyle('bold')]}>Selected</Text>
            </View>
          ) : (
            <Text style={[styles.categoryLabel, fontStyle('semibold')]}>
              {project.category}
            </Text>
          )}
        </View>

        {/* Middle: Snippet lines 2 & 3 */}
        <View style={styles.paperMiddle}>
          <Text
            numberOfLines={1}
            style={[styles.snippetSecondary, fontStyle('medium')]}>
            {project.snippetLines[1] || ''}
          </Text>
          <Text numberOfLines={1} style={[styles.snippetTertiary, fontStyle('regular')]}>
            {project.snippetLines[2] || ''}
          </Text>
        </View>

        {/* Bottom: Progress Bar (revealed when popped up) */}
        {!hideProgress && (
          <View style={[styles.progressWrap, { opacity: isSelected ? 1 : 0.35 }]}>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressText, fontStyle('bold')]}>
                Progress: {clampedProgress}%
              </Text>
              <Text style={[styles.progressText, fontStyle('bold')]}>
                {project.milestonesCount}/{project.milestonesTotal} Milestones
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${clampedProgress}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* 3. Front Folder Pocket (Exact Asymmetrical Curved Shelf Contour) */}
      <View style={styles.frontPocket}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 320 180"
            preserveAspectRatio="none">
            {isOrange ? (
              <>
                <Defs>
                  <LinearGradient
                    id={`grad-orange-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%">
                    <Stop offset="0%" stopColor="#EF5F18" />
                    <Stop offset="100%" stopColor="#D84C0B" />
                  </LinearGradient>
                </Defs>
                <Path
                  d={FOLDER_FRONT_PATH}
                  fill={`url(#grad-orange-${project.id})`}
                  stroke={isSelected ? '#FFFFFF' : '#C74307'}
                  strokeWidth={isSelected ? 2.2 : 1.3}
                />
              </>
            ) : (
              <Path
                d={FOLDER_FRONT_PATH}
                fill={palette.surface}
                stroke={isSelected ? '#EF5F18' : palette.border}
                strokeWidth={isSelected ? 2.2 : 1.3}
              />
            )}
          </Svg>
        </View>

        {/* Front Flap Content */}
        <View style={styles.frontContent}>
          <View style={styles.frontTextBlock}>
            <Text
              numberOfLines={1}
              style={[
                styles.frontTitle,
                fontStyle('extrabold'),
                { color: isOrange ? '#FFFFFF' : palette.textPrimary },
              ]}>
              {project.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.frontSubtitle,
                fontStyle('medium'),
                {
                  color: isOrange
                    ? 'rgba(255,255,255,0.84)'
                    : palette.textMuted,
                },
              ]}>
              {project.stageSubtitle}
            </Text>
          </View>

          <View style={styles.frontFooter}>
            <Text
              style={[
                styles.escrowText,
                fontStyle('semibold'),
                {
                  color: isOrange
                    ? 'rgba(255,255,255,0.92)'
                    : palette.textMuted,
                },
              ]}>
              {project.escrowAmount}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.contractorTag,
                fontStyle('medium'),
                {
                  color: isOrange
                    ? 'rgba(255,255,255,0.78)'
                    : palette.textSecondary,
                },
              ]}>
              {project.contractor.name}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 258,
    position: 'relative',
  },
  backLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  backTab: {
    width: '45%',
    height: 26,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  tabBridge: {
    width: 14,
    height: 12,
    marginBottom: -1,
    borderBottomWidth: 1,
  },
  backPlate: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderWidth: 1,
  },
  paperSheet: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 8,
    height: 138,
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
    zIndex: 10,
    justifyContent: 'space-between',
    shadowColor: '#261A66',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
  },
  paperTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  snippetPrimary: {
    fontSize: 12,
    flex: 1,
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
    backgroundColor: '#EF5F18',
  },
  selectedDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontSize: 9.5,
  },
  categoryLabel: {
    fontSize: 10,
    color: '#A3A0B8',
  },
  paperMiddle: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  snippetSecondary: {
    fontSize: 11,
    color: '#6C6882',
  },
  snippetTertiary: {
    fontSize: 10.5,
    color: '#8E8B9E',
    marginTop: 2,
  },
  progressWrap: {
    gap: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 9.5,
    color: '#5E5A7D',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#EFEEF5',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#EF5F18',
  },
  frontPocket: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '66%',
    zIndex: 20,
    shadowColor: '#261A66',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  frontContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  frontTextBlock: {
    paddingTop: 14,
  },
  frontTitle: {
    fontSize: 17,
    letterSpacing: -0.3,
  },
  frontSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  frontFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  escrowText: {
    fontSize: 12.5,
    letterSpacing: 0.2,
  },
  contractorTag: {
    fontSize: 11,
    maxWidth: '58%',
  },
});
