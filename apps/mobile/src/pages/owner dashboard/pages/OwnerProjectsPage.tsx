import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Line, Path, Polygon } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  DEMO_OWNER_CONTRACT_HISTORY,
  DEMO_OWNER_FOLDER_PROJECTS,
  DEMO_OWNER_PROPOSED_PLANS,
  type OwnerFolderProjectItem,
} from '../data/ownerDashboardData';
import { ProjectFolderCard } from '../components/ProjectFolderCard';
import { OwnerNavIcon } from '../components/OwnerIcons';

type ViewMode = 'active' | 'plans' | 'history';
type SortKey =
  | 'recent'
  | 'progress-desc'
  | 'progress-asc'
  | 'budget-desc'
  | 'budget-asc'
  | 'name-asc';

export function OwnerProjectsPage() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();

  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterContractor, setFilterContractor] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortKey>('recent');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);

  const totalSlots = isDemoMode ? 3 : 1;
  const tierName = isDemoMode ? 'Portfolio Investor' : 'Private Owner';

  const activeProjects: OwnerFolderProjectItem[] = isDemoMode
    ? DEMO_OWNER_FOLDER_PROJECTS
    : [];
  const proposedPlans: OwnerFolderProjectItem[] = isDemoMode
    ? DEMO_OWNER_PROPOSED_PLANS
    : [];
  const contractHistory: OwnerFolderProjectItem[] = isDemoMode
    ? DEMO_OWNER_CONTRACT_HISTORY
    : [];

  const canAddProject = activeProjects.length < totalSlots;

  const currentList =
    viewMode === 'active'
      ? activeProjects
      : viewMode === 'plans'
      ? proposedPlans
      : contractHistory;

  const availableContractors = useMemo(
    () => Array.from(new Set(currentList.map((p) => p.contractor.name))).sort(),
    [currentList]
  );

  const handleResetFilters = () => {
    setFilterCategory('all');
    setFilterContractor('all');
    setFilterStage('all');
    setSortBy('recent');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSelectedProjectId(null);
    setFilterContractor('all');
    setFilterStage('all');
  };

  const handleAddBuildingClick = () => {
    if (viewMode === 'active' && !canAddProject) {
      setIsCapacityModalOpen(true);
    } else {
      router.push('/find-companies');
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let list = [...currentList];

    if (filterCategory !== 'all') {
      list = list.filter(
        (p) => p.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }
    if (filterContractor !== 'all') {
      list = list.filter((p) => p.contractor.name === filterContractor);
    }
    if (filterStage !== 'all') {
      if (filterStage === 'early') list = list.filter((p) => p.progressPercent < 30);
      else if (filterStage === 'mid')
        list = list.filter((p) => p.progressPercent >= 30 && p.progressPercent <= 70);
      else if (filterStage === 'finishing')
        list = list.filter((p) => p.progressPercent > 70);
    }

    list.sort((a, b) => {
      if (sortBy === 'progress-desc') return b.progressPercent - a.progressPercent;
      if (sortBy === 'progress-asc') return a.progressPercent - b.progressPercent;
      if (sortBy === 'budget-desc' || sortBy === 'budget-asc') {
        const valA = parseFloat(a.escrowAmount.replace(/[^0-9.]/g, '')) || 0;
        const valB = parseFloat(b.escrowAmount.replace(/[^0-9.]/g, '')) || 0;
        return sortBy === 'budget-desc' ? valB - valA : valA - valB;
      }
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [currentList, filterCategory, filterContractor, filterStage, sortBy]);

  const activeFilterCount =
    (filterCategory !== 'all' ? 1 : 0) +
    (filterContractor !== 'all' ? 1 : 0) +
    (filterStage !== 'all' ? 1 : 0) +
    (sortBy !== 'recent' ? 1 : 0);

  const selectedProject = useMemo(
    () =>
      filteredAndSortedProjects.find((p) => p.id === selectedProjectId) || null,
    [filteredAndSortedProjects, selectedProjectId]
  );

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 1. Title & Capacity Pill */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                fontStyle('extrabold'),
                { color: palette.textPrimary },
              ]}>
              {viewMode === 'active'
                ? 'Active Projects'
                : viewMode === 'plans'
                ? 'Plan & Contract'
                : 'Contract History'}
            </Text>

            {viewMode === 'active' && (
              <View
                style={[
                  styles.capacityPill,
                  {
                    backgroundColor: !canAddProject
                      ? '#FFFBEB'
                      : palette.brandSoftBg,
                    borderColor: !canAddProject
                      ? '#FDE68A'
                      : palette.brandSoftBorder,
                  },
                ]}>
                <View
                  style={[
                    styles.capacityDot,
                    {
                      backgroundColor: !canAddProject
                        ? '#F59E0B'
                        : palette.brandOrange,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.capacityText,
                    fontStyle('bold'),
                    {
                      color: !canAddProject
                        ? '#92400E'
                        : palette.brandSoftText,
                    },
                  ]}>
                  Capacity: {activeProjects.length} / {totalSlots} Slots ({tierName})
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.subtitle,
              fontStyle('regular'),
              { color: palette.textMuted },
            ]}>
            {viewMode === 'active'
              ? 'Live building sites and ongoing milestone construction.'
              : viewMode === 'plans'
              ? 'Milestone plans and payment terms awaiting your agreement.'
              : 'Finished projects and handed-over buildings.'}
          </Text>
        </View>

        {/* 2. 3-Way Segmented Switch */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.switchBar,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          {(
            [
              { id: 'active', label: 'Active projects', count: activeProjects.length },
              { id: 'plans', label: 'Plan & contract', count: proposedPlans.length },
              { id: 'history', label: 'Contract history', count: contractHistory.length },
            ] as const
          ).map((item) => {
            const isActive = viewMode === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleViewModeChange(item.id)}
                style={[
                  styles.switchTab,
                  isActive && { backgroundColor: palette.brandOrange },
                ]}>
                <Text
                  style={[
                    styles.switchTabText,
                    fontStyle('bold'),
                    { color: isActive ? '#FFFFFF' : palette.textSecondary },
                  ]}>
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.switchBadge,
                    {
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.22)'
                        : item.id === 'plans'
                        ? palette.brandSoftBg
                        : palette.surfaceSubtle,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.switchBadgeText,
                      fontStyle('bold'),
                      {
                        color: isActive
                          ? '#FFFFFF'
                          : item.id === 'plans'
                          ? palette.brandSoftText
                          : palette.textSecondary,
                      },
                    ]}>
                    {item.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 3. Action Row: Add Building + Filter & Sort */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleAddBuildingClick}
            style={[
              styles.addBtn,
              {
                backgroundColor:
                  viewMode === 'active' && !canAddProject
                    ? '#D97706'
                    : palette.brandOrange,
              },
            ]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <Line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={[styles.addBtnText, fontStyle('bold')]}>
              Add Building
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setIsFilterModalOpen(true)}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  activeFilterCount > 0 ? palette.brandSoftBg : palette.surface,
                borderColor:
                  activeFilterCount > 0 ? palette.brandSoftBorder : palette.border,
              },
            ]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Polygon
                points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
                stroke={
                  activeFilterCount > 0
                    ? palette.brandSoftText
                    : palette.textPrimary
                }
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={[
                styles.filterBtnText,
                fontStyle('bold'),
                {
                  color:
                    activeFilterCount > 0
                      ? palette.brandSoftText
                      : palette.textPrimary,
                },
              ]}>
              Filter & Sort
            </Text>
            {activeFilterCount > 0 && (
              <View
                style={[
                  styles.filterCountPill,
                  { backgroundColor: palette.brandOrange },
                ]}>
                <Text style={[styles.filterCountText, fontStyle('bold')]}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <View style={styles.chipsRow}>
            {filterCategory !== 'all' && (
              <Pressable
                onPress={() => setFilterCategory('all')}
                style={[
                  styles.chip,
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    fontStyle('semibold'),
                    { color: palette.brandSoftText },
                  ]}>
                  Category: {filterCategory} ✕
                </Text>
              </Pressable>
            )}
            {filterContractor !== 'all' && (
              <Pressable
                onPress={() => setFilterContractor('all')}
                style={[
                  styles.chip,
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    fontStyle('semibold'),
                    { color: palette.brandSoftText },
                  ]}>
                  Contractor: {filterContractor} ✕
                </Text>
              </Pressable>
            )}
            {filterStage !== 'all' && (
              <Pressable
                onPress={() => setFilterStage('all')}
                style={[
                  styles.chip,
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    fontStyle('semibold'),
                    { color: palette.brandSoftText },
                  ]}>
                  Stage: {filterStage} ✕
                </Text>
              </Pressable>
            )}
            <Pressable onPress={handleResetFilters}>
              <Text
                style={[
                  styles.clearAllText,
                  fontStyle('bold'),
                  { color: palette.brandOrange },
                ]}>
                Clear all
              </Text>
            </Pressable>
          </View>
        )}

        {/* Selected Folder Summary Strip (since project dashboard isn't created yet) */}
        {selectedProject && (
          <View
            style={[
              styles.selectedBanner,
              {
                backgroundColor: palette.surface,
                borderColor: palette.brandSoftBorder,
              },
            ]}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.selectedKicker,
                  fontStyle('bold'),
                  { color: palette.brandOrange },
                ]}>
                SELECTED PROJECT · {selectedProject.jobId}
              </Text>
              <Text
                style={[
                  styles.selectedTitle,
                  fontStyle('extrabold'),
                  { color: palette.textPrimary },
                ]}>
                {selectedProject.title}
              </Text>
              <Text
                style={[
                  styles.selectedMeta,
                  fontStyle('regular'),
                  { color: palette.textSecondary },
                ]}>
                {selectedProject.location} · {selectedProject.contractor.name}
              </Text>
            </View>
            <Pressable
              onPress={() => setSelectedProjectId(null)}
              style={[
                styles.dismissBtn,
                { backgroundColor: palette.surfaceSubtle },
              ]}>
              <Text
                style={[
                  styles.dismissBtnText,
                  fontStyle('bold'),
                  { color: palette.textSecondary },
                ]}>
                ✕
              </Text>
            </Pressable>
          </View>
        )}

        {/* 4. Folder Cards List or Empty State */}
        {filteredAndSortedProjects.length === 0 ? (
          activeFilterCount > 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <Text
                style={[
                  styles.emptyTitle,
                  fontStyle('bold'),
                  { color: palette.textPrimary },
                ]}>
                No projects match your filter criteria
              </Text>
              <Text
                style={[
                  styles.emptyDesc,
                  fontStyle('regular'),
                  { color: palette.textMuted },
                ]}>
                Try selecting different categories, contractors, or stages to view projects.
              </Text>
              <Pressable
                onPress={handleResetFilters}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                  Reset all filters
                </Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={[
                styles.emptyCard,
                styles.emptyDashed,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: palette.brandSoftBg,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <OwnerNavIcon id="projects" color={palette.brandOrange} size={24} />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  fontStyle('extrabold'),
                  { color: palette.textPrimary },
                ]}>
                {viewMode === 'active'
                  ? 'No Active Building Projects Yet'
                  : viewMode === 'plans'
                  ? 'No Proposed Plans Awaiting Agreement'
                  : 'No Past Completed Contracts'}
              </Text>
              <Text
                style={[
                  styles.emptyDesc,
                  fontStyle('regular'),
                  { color: palette.textMuted },
                ]}>
                {viewMode === 'active'
                  ? "You haven't started any building projects yet. Connect with verified construction firms in Nigeria and kick off your milestone-protected project."
                  : viewMode === 'plans'
                  ? 'When a contractor prepares and shares a milestone construction plan, it will be listed here for your review and agreement.'
                  : 'Completed buildings and handed-over contracts with structural warranties will be archived here.'}
              </Text>
              {viewMode === 'active' && (
                <Pressable
                  onPress={handleAddBuildingClick}
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: palette.brandOrange },
                  ]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    + Start Your First Project
                  </Text>
                </Pressable>
              )}
            </View>
          )
        ) : (
          <View style={styles.foldersGrid}>
            {filteredAndSortedProjects.map((project) => (
              <ProjectFolderCard
                key={project.id}
                project={project}
                variant={viewMode === 'active' ? 'orange' : 'white'}
                isSelected={selectedProjectId === project.id}
                hideProgress={viewMode === 'plans'}
                onSelect={(p) =>
                  setSelectedProjectId((prev) => (prev === p.id ? null : p.id))
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter & Sort Modal */}
      {isFilterModalOpen && (
      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  fontStyle('extrabold'),
                  { color: palette.textPrimary },
                ]}>
                Filter & Sort Projects
              </Text>
              <Pressable onPress={() => setIsFilterModalOpen(false)}>
                <Text style={[styles.closeX, { color: palette.textMuted }]}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ gap: 14 }}>
              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Category
                </Text>
                <View style={styles.optionChips}>
                  {['all', 'Residential', 'Commercial', 'Waterfront', 'Hospitality'].map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setFilterCategory(cat)}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor:
                            filterCategory === cat ? palette.brandOrange : palette.surfaceSubtle,
                          borderColor:
                            filterCategory === cat ? palette.brandOrange : palette.border,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionChipText,
                          fontStyle('bold'),
                          { color: filterCategory === cat ? '#FFFFFF' : palette.textPrimary },
                        ]}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {availableContractors.length > 0 && (
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Contractor
                  </Text>
                  <View style={styles.optionChips}>
                    {['all', ...availableContractors].map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => setFilterContractor(c)}
                        style={[
                          styles.optionChip,
                          {
                            backgroundColor:
                              filterContractor === c ? palette.brandOrange : palette.surfaceSubtle,
                            borderColor:
                              filterContractor === c ? palette.brandOrange : palette.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.optionChipText,
                            fontStyle('bold'),
                            { color: filterContractor === c ? '#FFFFFF' : palette.textPrimary },
                          ]}>
                          {c === 'all' ? 'All Builders' : c}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Sort By
                </Text>
                <View style={styles.optionChips}>
                  {(
                    [
                      { id: 'recent', label: 'Recent' },
                      { id: 'progress-desc', label: 'Progress (High-Low)' },
                      { id: 'budget-desc', label: 'Budget (Highest)' },
                      { id: 'name-asc', label: 'Name (A-Z)' },
                    ] as const
                  ).map((opt) => (
                    <Pressable
                      key={opt.id}
                      onPress={() => setSortBy(opt.id)}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor:
                            sortBy === opt.id ? palette.brandOrange : palette.surfaceSubtle,
                          borderColor:
                            sortBy === opt.id ? palette.brandOrange : palette.border,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionChipText,
                          fontStyle('bold'),
                          { color: sortBy === opt.id ? '#FFFFFF' : palette.textPrimary },
                        ]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                onPress={handleResetFilters}
                style={[styles.secondaryBtn, { borderColor: palette.border }]}>
                <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                  Reset
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsFilterModalOpen(false)}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      )}

      {/* Capacity Limit Modal */}
      {isCapacityModalOpen && (
      <Modal
        visible={isCapacityModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCapacityModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  fontStyle('extrabold'),
                  { color: palette.textPrimary },
                ]}>
                Project Capacity Limit Reached
              </Text>
              <Pressable onPress={() => setIsCapacityModalOpen(false)}>
                <Text style={[styles.closeX, { color: palette.textMuted }]}>✕</Text>
              </Pressable>
            </View>
            <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textSecondary, textAlign: 'left' }]}>
              Your {tierName} plan supports {totalSlots} concurrent active project{totalSlots === 1 ? '' : 's'}. Upgrade your plan or purchase extra slots in Settings to add more sites.
            </Text>
            <View style={styles.modalFooter}>
              <Pressable
                onPress={() => setIsCapacityModalOpen(false)}
                style={[styles.secondaryBtn, { borderColor: palette.border }]}>
                <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                  Close
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsCapacityModalOpen(false);
                  router.push('/settings');
                }}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                  Upgrade in Settings
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 32, gap: 14 },
  headerSection: { gap: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, lineHeight: 18 },
  capacityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  capacityDot: { width: 6, height: 6, borderRadius: 999 },
  capacityText: { fontSize: 10.5 },
  switchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  switchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
  },
  switchTabText: { fontSize: 12 },
  switchBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  switchBadgeText: { fontSize: 10 },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 9,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 12.5 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 9,
    borderWidth: 1,
  },
  filterBtnText: { fontSize: 12.5 },
  filterCountPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  filterCountText: { color: '#FFFFFF', fontSize: 10 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 11 },
  clearAllText: { fontSize: 11.5, marginLeft: 4 },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedKicker: { fontSize: 10, letterSpacing: 0.4 },
  selectedTitle: { fontSize: 14.5, marginTop: 1 },
  selectedMeta: { fontSize: 11.5, marginTop: 2 },
  dismissBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnText: { fontSize: 12 },
  foldersGrid: {
    gap: 22,
    paddingTop: 10,
    paddingBottom: 12,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 26,
    alignItems: 'center',
  },
  emptyDashed: {
    borderStyle: 'dashed',
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 17, textAlign: 'center' },
  emptyDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  primaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 12.5 },
  secondaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 12.5 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 16 },
  closeX: { fontSize: 16, padding: 4 },
  filterGroup: { gap: 8 },
  filterLabel: { fontSize: 12 },
  optionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionChipText: { fontSize: 11.5 },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 4,
  },
});

export default OwnerProjectsPage;
