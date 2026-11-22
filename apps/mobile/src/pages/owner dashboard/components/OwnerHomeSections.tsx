import React, { useMemo, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  ALL_OWNER_QUICK_ACTIONS,
  DEMO_OWNER_NOTIFICATIONS,
  DEMO_OWNER_PROJECTS,
  DEMO_PAST_CONTRACTS,
  OWNER_SEARCH_ITEMS,
} from '../data/ownerDashboardData';
import {
  CameraLogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentCheckIcon,
  DocumentListIcon,
  EscrowShieldIcon,
  OwnerNavIcon,
  PlusIcon,
  QuickActionIllustration,
  SearchIcon,
} from './OwnerIcons';
import {
  ContractorChatModal,
  InviteRepresentativeModal,
  ShareLinkModal,
  SiteWeatherModal,
  StopWorkNoticeModal,
} from './OwnerHomeModals';

export function OwnerSearchBar() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const pool = OWNER_SEARCH_ITEMS.filter((item) => isDemoMode || !item.demoOnly);
    const q = query.trim().toLowerCase();
    if (!q) return pool.slice(0, 4);
    return pool.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [query, isDemoMode]);

  return (
    <View style={styles.searchSection}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: palette.surface,
            borderColor: focused ? palette.brandOrange : palette.border,
          },
        ]}>
        <SearchIcon color={palette.textMuted} size={16} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          placeholder="Search projects, milestones, payments..."
          placeholderTextColor={palette.textMuted}
          style={[styles.searchInput, fontStyle('medium'), { color: palette.textPrimary }]}
        />
        {query.trim().length > 0 && (
          <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={[styles.clearText, { color: palette.textMuted }]}>✕</Text>
          </Pressable>
        )}
      </View>

      {focused && results.length > 0 && (
        <View
          style={[
            styles.searchDropdown,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          {results.map((item, idx) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setFocused(false);
                setQuery('');
                router.push(item.href);
              }}
              style={[
                styles.searchRow,
                idx > 0 && { borderTopWidth: 1, borderTopColor: palette.borderSubtle },
              ]}>
              <View style={styles.searchRowMain}>
                <Text style={[styles.searchRowTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.searchRowSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  {item.subtitle}
                </Text>
              </View>
              <Text style={[styles.searchCat, fontStyle('semibold'), { color: palette.textMuted }]}>
                {item.category}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function OwnerHeroGreetingSection() {
  const { user, palette } = useOwnerMobile();

  return (
    <View style={styles.heroWrap}>
      <Text style={[styles.heroHi, fontStyle('extrabold'), { color: palette.textPrimary }]}>
        Hi, {user.firstName}!
      </Text>
      <Text style={[styles.heroHeadline, fontStyle('extrabold'), { color: palette.textPrimary }]}>
        What are your <Text style={{ color: palette.brandOrange }}>plans</Text> for today?
      </Text>
      <Text style={[styles.heroSubtitle, fontStyle('regular'), { color: palette.textMuted }]}>
        Track verified milestone stages, inspect time-stamped site proofs, and manage escrow disbursements with complete transparency.
      </Text>
    </View>
  );
}

export function OwnerQuickActionsGrid() {
  const { palette } = useOwnerMobile();
  const [slots, setSlots] = useState<(string | null)[]>([
    'share-link',
    'message-contractor',
    'assign-rep',
    'site-weather',
  ]);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInviteRepOpen, setIsInviteRepOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isStopWorkOpen, setIsStopWorkOpen] = useState(false);

  const handleActionPress = (action: (typeof ALL_OWNER_QUICK_ACTIONS)[number]) => {
    if (action.id === 'share-link') {
      setIsShareOpen(true);
    } else if (action.id === 'message-contractor') {
      setIsChatOpen(true);
    } else if (action.id === 'assign-rep') {
      setIsInviteRepOpen(true);
    } else if (action.id === 'site-weather') {
      setIsWeatherOpen(true);
    } else if (action.id === 'stop-work') {
      setIsStopWorkOpen(true);
    }
  };

  return (
    <>
      <View style={styles.quickGrid}>
        {slots.map((slotId, index) => {
          const action = slotId
            ? ALL_OWNER_QUICK_ACTIONS.find((a) => a.id === slotId)
            : null;

          if (!action) {
            return (
              <Pressable
                key={`empty-${index}`}
                onPress={() => setPickerSlotIndex(index)}
                style={[
                  styles.quickCardEmpty,
                  {
                    backgroundColor: palette.brandSoftBg,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <View style={[styles.addCircleBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
                  <PlusIcon color="#FFFFFF" size={18} />
                </View>
                <Text style={[styles.quickEmptyLabel, fontStyle('bold'), { color: palette.brandSoftText }]}>
                  Add new
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={`${action.id}-${index}`}
              onPress={() => handleActionPress(action)}
              style={[
                styles.quickCard,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}>
              <Pressable
                onPress={() => {
                  const next = [...slots];
                  next[index] = null;
                  setSlots(next);
                }}
                hitSlop={8}
                style={[styles.quickRemoveBtn, { backgroundColor: palette.surfaceSubtle }]}>
                <Text style={[styles.quickRemoveText, { color: palette.textMuted }]}>✕</Text>
              </Pressable>

              <View style={styles.quickIllustration}>
                <QuickActionIllustration
                  id={action.id}
                  indigoColor={palette.textPrimary}
                  surfaceColor={palette.surface}
                />
              </View>
              <Text style={[styles.quickTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                {action.title}
              </Text>
              <Text
                style={[styles.quickSub, fontStyle('regular'), { color: palette.textMuted }]}
                numberOfLines={2}>
                {action.subtitle}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Slot Picker Modal */}
      <Modal
        visible={pickerSlotIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerSlotIndex(null)}>
        <View style={[styles.modalOverlay, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={[styles.modalHeader, { borderBottomColor: palette.borderSubtle }]}>
              <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Add Quick Action
              </Text>
              <Pressable onPress={() => setPickerSlotIndex(null)}>
                <Text style={[styles.modalClose, { color: palette.textMuted }]}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll}>
              {ALL_OWNER_QUICK_ACTIONS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    if (pickerSlotIndex !== null) {
                      const next = [...slots];
                      next[pickerSlotIndex] = item.id;
                      setSlots(next);
                    }
                    setPickerSlotIndex(null);
                  }}
                  style={[
                    styles.pickerRow,
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                    },
                  ]}>
                  <View style={styles.pickerTextCol}>
                    <Text style={[styles.pickerTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.pickerSub, fontStyle('regular'), { color: palette.textMuted }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <ChevronRightIcon color={palette.brandOrange} size={15} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Functional Web-Matched Quick Action Popups */}
      <ShareLinkModal visible={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <ContractorChatModal visible={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <InviteRepresentativeModal
        visible={isInviteRepOpen}
        onClose={() => setIsInviteRepOpen(false)}
      />
      <SiteWeatherModal visible={isWeatherOpen} onClose={() => setIsWeatherOpen(false)} />
      <StopWorkNoticeModal visible={isStopWorkOpen} onClose={() => setIsStopWorkOpen(false)} />
    </>
  );
}

export function OwnerStatsSummarySection() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();

  const activeProjectsDisplay = isDemoMode
    ? DEMO_OWNER_PROJECTS.length.toString().padStart(2, '0')
    : '00';
  const awaitingApprovalDisplay = isDemoMode ? '01' : '00';
  const totalEscrowDisplay = isDemoMode ? '₦701,746,000' : '₦0';

  return (
    <View style={styles.statsRow}>
      {/* Active projects */}
      <Pressable
        onPress={() => router.push('/projects')}
        style={[
          styles.statSquareCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}>
        <View style={styles.statTopRow}>
          <View
            style={[
              styles.statIconBox,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <OwnerNavIcon id="projects" color={palette.brandSoftText} size={15} />
          </View>
          <ChevronRightIcon color={palette.textMuted} size={12} />
        </View>
        <View style={styles.statSquareBottom}>
          <Text
            style={[
              styles.statNumber,
              fontStyle('extrabold'),
              { color: palette.textPrimary, fontVariant: ['tabular-nums'] },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {activeProjectsDisplay}
          </Text>
          <Text
            style={[styles.statLabel, fontStyle('semibold'), { color: palette.textSecondary }]}
            numberOfLines={2}>
            Active projects
          </Text>
        </View>
      </Pressable>

      {/* Awaiting approval */}
      <Pressable
        onPress={() => router.push('/projects')}
        style={[
          styles.statSquareCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}>
        <View style={styles.statTopRow}>
          <View
            style={[
              styles.statIconBox,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <DocumentCheckIcon color={palette.brandSoftText} size={15} />
          </View>
          <ChevronRightIcon color={palette.brandOrange} size={12} />
        </View>
        <View style={styles.statSquareBottom}>
          <Text
            style={[
              styles.statNumber,
              fontStyle('extrabold'),
              { color: palette.brandOrange, fontVariant: ['tabular-nums'] },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {awaitingApprovalDisplay}
          </Text>
          <Text
            style={[styles.statLabel, fontStyle('semibold'), { color: palette.textSecondary }]}
            numberOfLines={2}>
            Awaiting approval
          </Text>
        </View>
      </Pressable>

      {/* Escrow invested */}
      <Pressable
        onPress={() => router.push('/transactions')}
        style={[
          styles.statSquareCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}>
        <View style={styles.statTopRow}>
          <View
            style={[
              styles.statIconBox,
              { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
            ]}>
            <OwnerNavIcon id="transactions" color={palette.greenText} size={15} />
          </View>
          <ChevronRightIcon color={palette.textMuted} size={12} />
        </View>
        <View style={styles.statSquareBottom}>
          <Text
            style={[
              styles.statNumberCurrency,
              fontStyle('extrabold'),
              { color: palette.textPrimary, fontVariant: ['tabular-nums'] },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {totalEscrowDisplay}
          </Text>
          <Text
            style={[styles.statLabel, fontStyle('semibold'), { color: palette.textSecondary }]}
            numberOfLines={2}>
            Escrow invested
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export function OwnerActiveProgressSection() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();
  const [projectIndex, setProjectIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const carouselRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const projects = isDemoMode ? DEMO_OWNER_PROJECTS : [];

  const goToSlide = (nextIdx: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, nextIdx));
    setProjectIndex(clamped);
    if (slideWidth > 0) {
      carouselRef.current?.scrollTo({ x: clamped * slideWidth, animated: true });
    }
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (slideWidth <= 0) return;
    const idx = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    if (idx >= 0 && idx < projects.length && idx !== projectIndex) {
      setProjectIndex(idx);
    }
  };

  if (!isDemoMode || projects.length === 0) {
    return (
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.kickerPill,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <Text style={[styles.kickerPillText, fontStyle('bold'), { color: palette.brandSoftText }]}>
              PRIVATE OWNER · 1 PROJECT SLOT READY
            </Text>
          </View>
          <View style={styles.escrowInline}>
            <View style={[styles.greenDot, { backgroundColor: palette.greenAccent }]} />
            <Text style={[styles.escrowInlineText, fontStyle('bold'), { color: palette.greenText }]}>
              100% Escrow Protection Active
            </Text>
          </View>
        </View>

        <Text style={[styles.emptyHeroTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
          Ready to break ground on your first construction site?
        </Text>
        <Text style={[styles.emptyHeroDesc, fontStyle('regular'), { color: palette.textSecondary }]}>
          Your platform account includes 1 active project slot with bank escrow custody, daily visual site photos, and independent COREN milestone inspection audits.
        </Text>

        <View style={styles.featureTiles}>
          <View
            style={[
              styles.featureTile,
              { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
            ]}>
            <EscrowShieldIcon color={palette.greenText} size={17} />
            <View style={styles.featureTileTextCol}>
              <Text style={[styles.featureTileTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                Bank Escrow Custody
              </Text>
              <Text style={[styles.featureTileSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Funds released strictly upon your explicit sign-off
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.featureTile,
              { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
            ]}>
            <CameraLogIcon color={palette.brandOrange} size={17} />
            <View style={styles.featureTileTextCol}>
              <Text style={[styles.featureTileTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                Daily Visual Logs
              </Text>
              <Text style={[styles.featureTileSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Time-stamped photo evidence before any concrete casting
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.featureTile,
              { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
            ]}>
            <OwnerNavIcon id="inspectors" color={palette.indigoSoftText} size={17} />
            <View style={styles.featureTileTextCol}>
              <Text style={[styles.featureTileTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                COREN Inspection
              </Text>
              <Text style={[styles.featureTileSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Accredited engineers audit rebar and soil quality
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable
            onPress={() => router.push('/find-companies')}
            style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn, flex: 1 }]}>
            <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Find Verified Builders</Text>
          </Pressable>
          <Pressable
            onPress={() => setIsInviteOpen(true)}
            style={[
              styles.secondaryBtn,
              { backgroundColor: palette.surface, borderColor: palette.border, flex: 1 },
            ]}>
            <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textPrimary }]}>
              Invite Rep
            </Text>
          </Pressable>
        </View>
        <InviteRepresentativeModal
          visible={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: palette.surface, borderColor: palette.border },
      ]}>
      {/* Carousel Controls */}
      <View style={[styles.carouselTop, { borderBottomColor: palette.borderSubtle }]}>
        <View style={styles.carouselLeft}>
          <Text style={[styles.activeTag, fontStyle('bold'), { color: palette.brandOrange }]}>
            ACTIVE PROJECTS
          </Text>
          <View
            style={[
              styles.counterBadge,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <Text style={[styles.counterBadgeText, fontStyle('extrabold'), { color: palette.brandSoftText }]}>
              {projectIndex + 1}/{projects.length}
            </Text>
          </View>
        </View>

        <View style={styles.arrowPair}>
          <Pressable
            disabled={projectIndex === 0}
            onPress={() => goToSlide(projectIndex - 1)}
            style={[
              styles.arrowBtn,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                opacity: projectIndex === 0 ? 0.35 : 1,
              },
            ]}>
            <ChevronLeftIcon color={palette.textPrimary} size={14} />
          </Pressable>
          <Pressable
            disabled={projectIndex === projects.length - 1}
            onPress={() => goToSlide(projectIndex + 1)}
            style={[
              styles.arrowBtn,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                opacity: projectIndex === projects.length - 1 ? 0.35 : 1,
              },
            ]}>
            <ChevronRightIcon color={palette.textPrimary} size={14} />
          </Pressable>
        </View>
      </View>

      {/* Horizontal Swipeable Project Track */}
      <View
        onLayout={(e) => {
          const w = Math.floor(e.nativeEvent.layout.width);
          if (w > 0 && w !== slideWidth) setSlideWidth(w);
        }}
        style={styles.carouselViewport}>
        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}>
          {projects.map((proj) => (
            <View
              key={proj.id}
              style={slideWidth > 0 ? { width: slideWidth } : styles.slideFallback}>
              <Text style={[styles.projTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                {proj.title}
              </Text>
              <Text style={[styles.projSub, fontStyle('regular'), { color: palette.textMuted }]}>
                {proj.location} • {proj.specs}
              </Text>

              <View
                style={[
                  styles.scopeBox,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <Text style={[styles.scopeKicker, fontStyle('bold'), { color: palette.brandSoftText }]}>
                  CURRENT STAGE SCOPE
                </Text>
                <Text style={[styles.scopeTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  {proj.scopeTitle}
                </Text>
                <Text style={[styles.scopeDesc, fontStyle('regular'), { color: palette.textSecondary }]}>
                  {proj.scopeDescription}
                </Text>
              </View>

              <Text style={[styles.contractorMeta, fontStyle('regular'), { color: palette.textSecondary }]}>
                Contractor:{' '}
                <Text style={[fontStyle('bold'), { color: palette.textPrimary }]}>
                  {proj.contractorName}
                </Text>{' '}
                ({proj.contractorRating}) · Rep:{' '}
                <Text style={[fontStyle('bold'), { color: palette.textPrimary }]}>
                  {proj.assignedRep}
                </Text>
              </Text>

              <View style={styles.stepsGrid}>
                {proj.steps.map((step, i) => {
                  const barColor =
                    step.status === 'Completed'
                      ? palette.greenAccent
                      : step.status === 'Awaiting approval' || step.status === 'Active'
                      ? palette.brandOrange
                      : palette.border;
                  return (
                    <View key={i} style={styles.stepItem}>
                      <Text
                        style={[styles.stepLabel, fontStyle('semibold'), { color: palette.textSecondary }]}
                        numberOfLines={1}>
                        {step.label}
                      </Text>
                      <View style={[styles.stepTrack, { backgroundColor: palette.borderSubtle }]}>
                        <View
                          style={[
                            styles.stepFill,
                            { width: `${step.progress}%`, backgroundColor: barColor },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.dualRow}>
                <Text style={[styles.dualMeta, fontStyle('bold'), { color: palette.greenText }]}>
                  {proj.verifiedPercent}% Verified Progress
                </Text>
                <Text style={[styles.dualMeta, fontStyle('semibold'), { color: palette.brandSoftText }]}>
                  {proj.reportedPercent}% Reported Est.
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Interactive Swipe Pagination Dots */}
      <View style={styles.carouselDots}>
        {projects.map((p, idx) => {
          const active = idx === projectIndex;
          return (
            <Pressable
              key={p.id}
              onPress={() => goToSlide(idx)}
              hitSlop={8}
              style={[
                styles.carouselDot,
                {
                  width: active ? 20 : 6,
                  backgroundColor: active ? palette.brandOrange : palette.border,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

export function OwnerHistoryAndNotificationsSection() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();

  const contracts = isDemoMode ? DEMO_PAST_CONTRACTS : [];
  const notifications = isDemoMode ? DEMO_OWNER_NOTIFICATIONS : [];

  return (
    <View style={styles.bottomStack}>
      {/* Contract History Card */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}>
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.cardIconBox,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <DocumentListIcon color={palette.brandSoftText} size={17} />
          </View>
          <View style={styles.cardHeaderTextCol}>
            <Text style={[styles.cardTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              Contract History
            </Text>
            <Text style={[styles.cardSub, fontStyle('regular'), { color: palette.textMuted }]}>
              Past construction projects completed and audited through Vantaged
            </Text>
          </View>
        </View>

        {contracts.length === 0 ? (
          <View style={styles.miniEmpty}>
            <Text style={[styles.miniEmptyTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
              No completed projects yet
            </Text>
            <Text style={[styles.miniEmptySub, fontStyle('regular'), { color: palette.textMuted }]}>
              As your active construction milestones reach 100% sign-off, completed building archives will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.listDivide}>
            {contracts.map((item, idx) => (
              <Pressable
                key={item.id}
                onPress={() => router.push('/projects')}
                style={[
                  styles.contractRow,
                  idx > 0 && { borderTopWidth: 1, borderTopColor: palette.borderSubtle },
                ]}>
                <View style={styles.contractLeft}>
                  <Text style={[styles.contractTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.contractMeta, fontStyle('regular'), { color: palette.textMuted }]}>
                    {item.contractor} · {item.location}
                  </Text>
                </View>
                <View style={styles.contractRight}>
                  <Text
                    style={[
                      styles.contractAmount,
                      fontStyle('extrabold'),
                      { color: palette.textPrimary, fontVariant: ['tabular-nums'] },
                    ]}>
                    {item.totalValue}
                  </Text>
                  <Text style={[styles.contractDate, fontStyle('medium'), { color: palette.textMuted }]}>
                    {item.completedDate}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Notifications Card */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}>
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.cardIconBox,
              { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
            ]}>
            <OwnerNavIcon id="notifications" color={palette.brandSoftText} size={17} />
          </View>
          <View style={styles.cardHeaderTextCol}>
            <Text style={[styles.cardTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              Notifications
            </Text>
            <Text style={[styles.cardSub, fontStyle('regular'), { color: palette.textMuted }]}>
              Site milestone alerts, inspection requests & payment updates
            </Text>
          </View>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.miniEmpty}>
            <Text style={[styles.miniEmptyTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
              All caught up!
            </Text>
            <Text style={[styles.miniEmptySub, fontStyle('regular'), { color: palette.textMuted }]}>
              No pending alerts for your projects.
            </Text>
          </View>
        ) : (
          <View style={styles.listDivide}>
            {notifications.map((item, idx) => (
              <Pressable
                key={item.id}
                onPress={() => router.push('/notifications')}
                style={[
                  styles.notifRow,
                  idx > 0 && { borderTopWidth: 1, borderTopColor: palette.borderSubtle },
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
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    position: 'relative',
    zIndex: 15,
  },
  searchBox: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 12,
  },
  searchDropdown: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  searchRowMain: {
    flex: 1,
  },
  searchRowTitle: {
    fontSize: 12.5,
  },
  searchRowSub: {
    fontSize: 11,
    marginTop: 2,
  },
  searchCat: {
    fontSize: 10.5,
  },
  heroWrap: {
    paddingTop: 2,
  },
  heroHi: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  heroHeadline: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
    marginTop: 2,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '48.4%',
    minHeight: 138,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  quickCardEmpty: {
    width: '48.4%',
    minHeight: 138,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickEmptyLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  quickRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRemoveText: {
    fontSize: 10,
  },
  quickIllustration: {
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  quickSub: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statSquareCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 11,
    justifyContent: 'space-between',
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statSquareBottom: {
    gap: 2,
  },
  statNumber: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  statNumberCurrency: {
    fontSize: 16,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 10.5,
    lineHeight: 13,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  kickerPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  kickerPillText: {
    fontSize: 10,
    letterSpacing: 0.4,
  },
  escrowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  escrowInlineText: {
    fontSize: 11,
  },
  emptyHeroTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 6,
  },
  emptyHeroDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  featureTiles: {
    gap: 8,
    marginBottom: 14,
  },
  featureTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureTileTextCol: {
    flex: 1,
  },
  featureTileTitle: {
    fontSize: 12.5,
  },
  featureTileSub: {
    fontSize: 11,
    marginTop: 2,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
  },
  secondaryBtn: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryBtnText: {
    fontSize: 12.5,
  },
  carouselTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  carouselLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeTag: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  counterBadgeText: {
    fontSize: 10.5,
  },
  arrowPair: {
    flexDirection: 'row',
    gap: 6,
  },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselViewport: {
    width: '100%',
    overflow: 'hidden',
  },
  slideFallback: {
    width: '100%',
  },
  carouselDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  carouselDot: {
    height: 6,
    borderRadius: 3,
  },
  projTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  projSub: {
    fontSize: 11.5,
    marginTop: 3,
    marginBottom: 12,
  },
  scopeBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  scopeKicker: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  scopeTitle: {
    fontSize: 13.5,
    marginTop: 2,
  },
  scopeDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 3,
  },
  contractorMeta: {
    fontSize: 11.5,
    marginBottom: 12,
    lineHeight: 16,
  },
  stepsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  stepItem: {
    flex: 1,
    gap: 4,
  },
  stepLabel: {
    fontSize: 9.5,
  },
  stepTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  stepFill: {
    height: '100%',
    borderRadius: 3,
  },
  dualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dualMeta: {
    fontSize: 11.5,
  },
  bottomStack: {
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cardIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15.5,
  },
  cardSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  miniEmpty: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  miniEmptyTitle: {
    fontSize: 13,
  },
  miniEmptySub: {
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    maxWidth: 280,
  },
  listDivide: {},
  contractRow: {
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  contractLeft: {
    flex: 1,
  },
  contractTitle: {
    fontSize: 12.5,
  },
  contractMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  contractRight: {
    alignItems: 'flex-end',
  },
  contractAmount: {
    fontSize: 12.5,
  },
  contractDate: {
    fontSize: 10.5,
    marginTop: 2,
  },
  notifRow: {
    paddingVertical: 10,
  },
  notifTitle: {
    fontSize: 12.5,
  },
  notifSub: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  notifTime: {
    fontSize: 10,
    marginTop: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '75%',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 16,
  },
  modalClose: {
    fontSize: 15,
    padding: 4,
  },
  modalScroll: {
    padding: 14,
  },
  pickerRow: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  pickerTextCol: {
    flex: 1,
  },
  pickerTitle: {
    fontSize: 13,
  },
  pickerSub: {
    fontSize: 11,
    marginTop: 2,
  },
});
