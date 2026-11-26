import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  DEMO_OWNER_CLIENT_REPS,
  DEMO_OWNER_FOLDER_PROJECTS,
  type OwnerMobileClientRepItem,
} from '../data/ownerDashboardData';
import { OwnerNavIcon } from '../components/OwnerIcons';

const DISCIPLINES: Array<'All' | OwnerMobileClientRepItem['discipline']> = [
  'All',
  'Structural & Civil',
  'Architecture',
  'Quantity Surveying',
  'MEP Engineering',
  'Owner Proxy',
];

const STATES = ['All States', 'Lagos', 'Abuja FCT'] as const;

export function OwnerRepresentativesPage() {
  const { palette, isDemoMode } = useOwnerMobile();

  const [reps, setReps] = useState<OwnerMobileClientRepItem[]>(
    isDemoMode ? DEMO_OWNER_CLIENT_REPS : []
  );

  useEffect(() => {
    setReps(isDemoMode ? DEMO_OWNER_CLIENT_REPS : []);
    setSelectedRep(null);
    setManagingPermissionsRep(null);
  }, [isDemoMode]);

  // Filter states
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Detail & Permissions states
  const [selectedRep, setSelectedRep] = useState<OwnerMobileClientRepItem | null>(null);
  const [managingPermissionsRep, setManagingPermissionsRep] =
    useState<OwnerMobileClientRepItem | null>(null);

  const [permViewProgress, setPermViewProgress] = useState(true);
  const [permApproveStages, setPermApproveStages] = useState(true);
  const [permManagePayments, setPermManagePayments] = useState(true);
  const [permChangeRequests, setPermChangeRequests] = useState(true);
  const [permMessageContractor, setPermMessageContractor] = useState(true);
  const [permManageShareLinks, setPermManageShareLinks] = useState(false);
  const [permInvitePeople, setPermInvitePeople] = useState(false);
  const [escrowLimit, setEscrowLimit] = useState(25);
  const [changeLimit, setChangeLimit] = useState(10);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteDiscipline, setInviteDiscipline] =
    useState<OwnerMobileClientRepItem['discipline']>('Structural & Civil');
  const [inviteProject, setInviteProject] = useState(
    DEMO_OWNER_FOLDER_PROJECTS[0]?.title || 'Lekki Phase 1 Luxury Villa'
  );
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState(false);

  const ownerProjectTitles = useMemo(
    () =>
      isDemoMode
        ? DEMO_OWNER_FOLDER_PROJECTS.map((p) => p.title)
        : ['No active projects yet'],
    [isDemoMode]
  );

  const isFilterActive =
    selectedDiscipline !== 'All' ||
    selectedState !== 'All States' ||
    onlyVerified ||
    onlyFavorites;

  const filteredReps = useMemo(() => {
    return reps.filter((r) => {
      if (selectedDiscipline !== 'All' && r.discipline !== selectedDiscipline) return false;
      if (selectedState !== 'All States' && r.state !== selectedState) return false;
      if (onlyVerified && !r.isVerified) return false;
      if (onlyFavorites && !r.isFavorite) return false;
      return true;
    });
  }, [reps, selectedDiscipline, selectedState, onlyVerified, onlyFavorites]);

  const activePermissionsCount = useMemo(() => {
    let count = 0;
    if (permViewProgress) count++;
    if (permApproveStages) count++;
    if (permManagePayments) count++;
    if (permChangeRequests) count++;
    if (permMessageContractor) count++;
    if (permManageShareLinks) count++;
    if (permInvitePeople) count++;
    return count;
  }, [
    permViewProgress,
    permApproveStages,
    permManagePayments,
    permChangeRequests,
    permMessageContractor,
    permManageShareLinks,
    permInvitePeople,
  ]);

  const activePercentage = Math.round((activePermissionsCount / 7) * 100);

  const handleToggleFavorite = (repId: string) => {
    setReps((prev) =>
      prev.map((r) => (r.id === repId ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const openPermissionsPage = (rep: OwnerMobileClientRepItem) => {
    setManagingPermissionsRep(rep);
    setSelectedRep(null);
    setPermViewProgress(rep.permissions.viewProgress);
    setPermApproveStages(rep.permissions.approveStages);
    setPermManagePayments(rep.permissions.managePayments);
    setPermChangeRequests(rep.permissions.changeRequests);
    setPermMessageContractor(rep.permissions.messageContractor);
    setPermManageShareLinks(rep.permissions.manageShareLinks);
    setPermInvitePeople(rep.permissions.invitePeople);
    setEscrowLimit(rep.permissions.maxEscrowLimit ?? 25);
    setChangeLimit(rep.permissions.maxChangeLimit ?? 10);
    setSaveSuccessNotice(false);
  };

  const handleSavePermissions = () => {
    if (!managingPermissionsRep) return;
    setReps((prev) =>
      prev.map((r) =>
        r.id === managingPermissionsRep.id
          ? {
              ...r,
              permissions: {
                viewProgress: permViewProgress,
                approveStages: permApproveStages,
                managePayments: permManagePayments,
                changeRequests: permChangeRequests,
                messageContractor: permMessageContractor,
                manageShareLinks: permManageShareLinks,
                invitePeople: permInvitePeople,
                maxEscrowLimit: escrowLimit,
                maxChangeLimit: changeLimit,
              },
            }
          : r
      )
    );
    setSaveSuccessNotice(true);
  };

  const handleSendInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const newRep: OwnerMobileClientRepItem = {
      id: `rep-${Date.now()}`,
      name: inviteName.trim(),
      title: inviteTitle.trim() || 'Independent Client Representative',
      discipline: inviteDiscipline,
      location: 'Lekki, Lagos',
      state: 'Lagos',
      stagesVerifiedCount: 0,
      licenseNumber: 'Accreditation Verification Pending',
      isVerified: false,
      isFavorite: false,
      isFeatured: false,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face',
      email: inviteEmail.trim(),
      phone: '+234 800 000 0000',
      status: 'Pending Invitation',
      mandateSummary: `Authorized client representative appointed to oversee milestones and quality assurance for ${inviteProject}.`,
      assignedProjects: [
        {
          id: `proj-${Date.now()}`,
          title: inviteProject,
          roleOnProject: inviteTitle.trim() || 'Client Representative',
          progressPercent: 50,
          status: 'Active Construction',
        },
      ],
      permissions: {
        viewProgress: true,
        approveStages: true,
        managePayments: false,
        changeRequests: true,
        messageContractor: true,
        manageShareLinks: false,
        invitePeople: false,
      },
    };

    setReps((prev) => [newRep, ...prev]);
    setInviteSuccessNotice(true);
    setTimeout(() => {
      setInviteSuccessNotice(false);
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInviteTitle('');
    }, 1000);
  };

  const resetFilters = () => {
    setSelectedDiscipline('All');
    setSelectedState('All States');
    setOnlyVerified(false);
    setOnlyFavorites(false);
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {managingPermissionsRep ? (
          /* ── REPRESENTATIVE PERMISSIONS VIEW (Matching Web PRD §5.2) ── */
          <View style={{ gap: 14 }}>
            <Pressable
              onPress={() => setManagingPermissionsRep(null)}
              style={[
                styles.backBtn,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <Text style={[styles.backBtnText, fontStyle('bold'), { color: palette.textPrimary }]}>
                ← Back to Representatives
              </Text>
            </Pressable>

            {saveSuccessNotice && (
              <View
                style={[
                  styles.noticeBanner,
                  {
                    backgroundColor: palette.brandSoftBg,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.noticeText,
                    fontStyle('bold'),
                    { color: palette.brandSoftText },
                  ]}>
                  ✓ Permissions updated for {managingPermissionsRep.name}. Active immediately.
                </Text>
              </View>
            )}

            {/* Programme Health Card */}
            <View
              style={[
                styles.healthCard,
                { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
              ]}>
              <Text style={[styles.healthKicker, fontStyle('extrabold'), { color: palette.greenText }]}>
                PROGRAMME HEALTH
              </Text>
              <Text style={[styles.healthPct, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                {activePercentage}%
              </Text>
              <Text style={[styles.healthDesc, fontStyle('regular'), { color: palette.textSecondary }]}>
                {activePermissionsCount} of 7 governance modules authorized.{' '}
                {managingPermissionsRep.stagesVerifiedCount} milestone sign-offs verified this month.
              </Text>
            </View>

            {/* Rep Identity Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={styles.identityRow}>
                <Image
                  source={{ uri: managingPermissionsRep.avatar }}
                  style={styles.identityAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.identityName, fontStyle('bold'), { color: palette.textPrimary }]}>
                    {managingPermissionsRep.name}
                  </Text>
                  <Text
                    style={[
                      styles.identityTitle,
                      fontStyle('semibold'),
                      { color: palette.textMuted },
                    ]}>
                    {managingPermissionsRep.title}
                  </Text>
                  <Text
                    style={[
                      styles.identityLicense,
                      fontStyle('medium'),
                      { color: palette.textMuted },
                    ]}>
                    {managingPermissionsRep.licenseNumber}
                  </Text>
                </View>
              </View>
            </View>

            {/* Granular Permissions Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <Text style={[styles.permTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Representative permissions
              </Text>
              <Text style={[styles.permSub, fontStyle('regular'), { color: palette.textSecondary }]}>
                Turn any module off and the representative dashboard hides it entirely across assigned projects.
              </Text>

              {[
                {
                  title: 'View progress',
                  tag: 'VIEW_PROGRESS',
                  desc: 'See project dashboard, stage milestones, proof photos, and timeline.',
                  value: permViewProgress,
                  onChange: setPermViewProgress,
                },
                {
                  title: 'Approve / reject stages',
                  tag: 'REVIEW_STAGES',
                  desc: 'Inspect stages marked ready for review and approve or flag issues.',
                  value: permApproveStages,
                  onChange: setPermApproveStages,
                },
                {
                  title: 'Payments & escrow',
                  tag: 'PAYMENTS',
                  desc: 'See payments due, upload receipts, and authorize escrow disbursements.',
                  value: permManagePayments,
                  onChange: setPermManagePayments,
                  stepper: {
                    label: `₦${escrowLimit}M max`,
                    onDec: () => setEscrowLimit((p) => Math.max(5, p - 5)),
                    onInc: () => setEscrowLimit((p) => Math.min(200, p + 5)),
                  },
                },
                {
                  title: 'Change requests (Variations)',
                  tag: 'CHANGE_REQUESTS',
                  desc: 'Raise change requests and approve or reject scope variation claims.',
                  value: permChangeRequests,
                  onChange: setPermChangeRequests,
                  stepper: {
                    label: `₦${changeLimit}M cap`,
                    onDec: () => setChangeLimit((p) => Math.max(2, p - 2)),
                    onInc: () => setChangeLimit((p) => Math.min(100, p + 2)),
                  },
                },
                {
                  title: 'Message the contractor',
                  tag: 'MESSAGE_CONTRACTOR',
                  desc: 'Use direct project chat with the contractor team on assigned sites.',
                  value: permMessageContractor,
                  onChange: setPermMessageContractor,
                },
                {
                  title: 'Manage share links',
                  tag: 'SHARE_LINKS',
                  desc: 'Create and revoke read-only observer share links.',
                  value: permManageShareLinks,
                  onChange: setPermManageShareLinks,
                },
                {
                  title: 'Invite people',
                  tag: 'INVITE_PEOPLE',
                  desc: 'Invite contractors and onboard additional representatives.',
                  value: permInvitePeople,
                  onChange: setPermInvitePeople,
                },
              ].map((row, idx) => (
                <View
                  key={row.tag}
                  style={[
                    styles.permItemRow,
                    idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                  ]}>
                  <View style={styles.permItemTop}>
                    <View style={{ flex: 1, gap: 3 }}>
                      <View style={styles.permTagRow}>
                        <Text
                          style={[
                            styles.permItemName,
                            fontStyle('bold'),
                            { color: palette.textPrimary },
                          ]}>
                          {row.title}
                        </Text>
                        <View
                          style={[styles.tagPill, { backgroundColor: palette.surfaceSubtle }]}>
                          <Text
                            style={[
                              styles.tagPillText,
                              fontStyle('extrabold'),
                              { color: palette.textMuted },
                            ]}>
                            {row.tag}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.permItemDesc,
                          fontStyle('regular'),
                          { color: palette.textSecondary },
                        ]}>
                        {row.desc}
                      </Text>
                    </View>
                    <Switch
                      value={row.value}
                      onValueChange={row.onChange}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {row.stepper && (
                    <View
                      style={[
                        styles.stepperRow,
                        {
                          backgroundColor: palette.surfaceSubtle,
                          borderColor: palette.border,
                        },
                      ]}>
                      <Pressable onPress={row.stepper.onDec} style={styles.stepperBtn}>
                        <Text style={[styles.stepperSign, { color: palette.textPrimary }]}>−</Text>
                      </Pressable>
                      <Text
                        style={[
                          styles.stepperVal,
                          fontStyle('bold'),
                          { color: palette.textPrimary },
                        ]}>
                        {row.stepper.label}
                      </Text>
                      <Pressable onPress={row.stepper.onInc} style={styles.stepperBtn}>
                        <Text style={[styles.stepperSign, { color: palette.textPrimary }]}>+</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}

              <Pressable
                onPress={handleSavePermissions}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                  Save representative permissions
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* ── DIRECTORY VIEW (Matching Web OwnerClientRepsPage) ── */
          <>
            {/* Header & Toolbar */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  Representatives
                </Text>
                <Text style={[styles.subtitle, fontStyle('medium'), { color: palette.textMuted }]}>
                  Your trusted team members, engineers, or family who visit the site and confirm work before payments are made
                </Text>
              </View>

              <View style={styles.toolbar}>
                <Pressable
                  onPress={() => setIsFilterModalOpen(true)}
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor: isFilterActive ? palette.brandSoftBg : palette.surface,
                      borderColor: isFilterActive ? palette.brandSoftBorder : palette.border,
                    },
                  ]}>
                  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                    <Polygon
                      points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
                      stroke={palette.brandOrange}
                      strokeWidth={2.5}
                    />
                  </Svg>
                  <Text
                    style={[
                      styles.filterBtnText,
                      fontStyle('bold'),
                      { color: isFilterActive ? palette.brandSoftText : palette.textPrimary },
                    ]}>
                    Filter
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setIsInviteModalOpen(true)}
                  style={[
                    styles.plusBtn,
                    { backgroundColor: palette.surface, borderColor: palette.border },
                  ]}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Line x1="12" y1="5" x2="12" y2="19" stroke={palette.brandOrange} strokeWidth={2.5} />
                    <Line x1="5" y1="12" x2="19" y2="12" stroke={palette.brandOrange} strokeWidth={2.5} />
                  </Svg>
                </Pressable>
              </View>
            </View>

            {/* Active Filter Pills */}
            {isFilterActive && (
              <View style={styles.activeFiltersRow}>
                {selectedDiscipline !== 'All' && (
                  <Pressable
                    onPress={() => setSelectedDiscipline('All')}
                    style={[
                      styles.activePill,
                      { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                    ]}>
                    <Text style={[styles.activePillText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                      {selectedDiscipline} ×
                    </Text>
                  </Pressable>
                )}
                {selectedState !== 'All States' && (
                  <Pressable
                    onPress={() => setSelectedState('All States')}
                    style={[
                      styles.activePill,
                      { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                    ]}>
                    <Text style={[styles.activePillText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                      {selectedState} ×
                    </Text>
                  </Pressable>
                )}
                {onlyVerified && (
                  <Pressable
                    onPress={() => setOnlyVerified(false)}
                    style={[
                      styles.activePill,
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.activePillText, fontStyle('bold'), { color: palette.textPrimary }]}>
                      Verified Only ×
                    </Text>
                  </Pressable>
                )}
                {onlyFavorites && (
                  <Pressable
                    onPress={() => setOnlyFavorites(false)}
                    style={[
                      styles.activePill,
                      { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                    ]}>
                    <Text style={[styles.activePillText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                      ♥ Bookmarked ×
                    </Text>
                  </Pressable>
                )}
                <Pressable onPress={resetFilters}>
                  <Text style={[styles.clearAllText, fontStyle('bold'), { color: palette.textMuted }]}>
                    Clear all
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Section Header */}
            <View style={styles.sectionMeta}>
              <Text style={[styles.sectionKicker, fontStyle('extrabold'), { color: palette.textMuted }]}>
                AUTHORIZED REPRESENTATIVES ({filteredReps.length})
              </Text>
              <Text style={[styles.sectionHint, fontStyle('semibold'), { color: palette.textMuted }]}>
                Tap any card to view profile, credentials & permissions
              </Text>
            </View>

            {/* Empty or Cards List */}
            {filteredReps.length === 0 ? (
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
                  <OwnerNavIcon id="representatives" color={palette.brandOrange} size={24} />
                </View>
                <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  {reps.length === 0
                    ? 'No Appointed Representatives Yet'
                    : 'No Representatives Match Filters'}
                </Text>
                <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                  {reps.length === 0
                    ? 'Invite a registered civil engineer, clerk of works, or trusted family proxy to oversee site operations and approve milestone progress.'
                    : 'Try resetting your discipline or state filters to display your authorized representatives.'}
                </Text>
                <Pressable
                  onPress={() =>
                    reps.length === 0 ? setIsInviteModalOpen(true) : resetFilters()
                  }
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, marginTop: 8 }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    {reps.length === 0 ? '+ Invite a Representative' : 'Reset Filters'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.cardsGrid}>
                {filteredReps.map((rep) => {
                  const isFeatured = !!rep.isFeatured;
                  const shortLocation = rep.location
                    ? rep.location.split(',')[0]
                    : rep.state || 'Nigeria';

                  return (
                    <Pressable
                      key={rep.id}
                      onPress={() => setSelectedRep(rep)}
                      style={[
                        styles.repCard,
                        isFeatured
                          ? {
                              backgroundColor: palette.brandOrange,
                              borderColor: '#D84C0B',
                              borderWidth: 2,
                            }
                          : {
                              backgroundColor: palette.surface,
                              borderColor: palette.border,
                              borderWidth: 1,
                            },
                      ]}>
                      {/* Top Header: Bookmark Heart + Profile Button */}
                      <View style={styles.cardTopRow}>
                        <Pressable
                          onPress={() => handleToggleFavorite(rep.id)}
                          style={[
                            styles.circleIconBtn,
                            {
                              backgroundColor: isFeatured
                                ? 'rgba(255,255,255,0.2)'
                                : rep.isFavorite
                                ? palette.brandSoftBg
                                : palette.surfaceSubtle,
                            },
                          ]}>
                          <Svg width={15} height={15} viewBox="0 0 24 24">
                            <Path
                              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                              fill={
                                rep.isFavorite
                                  ? isFeatured
                                    ? '#FFFFFF'
                                    : palette.brandOrange
                                  : 'none'
                              }
                              stroke={
                                isFeatured
                                  ? '#FFFFFF'
                                  : rep.isFavorite
                                  ? palette.brandOrange
                                  : palette.textMuted
                              }
                              strokeWidth={2}
                            />
                          </Svg>
                        </Pressable>

                        <Pressable
                          onPress={() => setSelectedRep(rep)}
                          style={[
                            styles.circleIconBtn,
                            isFeatured
                              ? { backgroundColor: '#FFFFFF' }
                              : {
                                  backgroundColor: palette.brandSoftBg,
                                  borderWidth: 1,
                                  borderColor: palette.brandSoftBorder,
                                },
                          ]}>
                          <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                              stroke={palette.brandOrange}
                              strokeWidth={2.5}
                            />
                            <Circle cx="12" cy="7" r="4" stroke={palette.brandOrange} strokeWidth={2.5} />
                          </Svg>
                        </Pressable>
                      </View>

                      {/* Center Photo & Identity */}
                      <View style={styles.cardCenter}>
                        <View style={styles.avatarWrap}>
                          <Image
                            source={{ uri: rep.avatar }}
                            style={[
                              styles.avatar,
                              {
                                borderColor: isFeatured
                                  ? 'rgba(255,255,255,0.65)'
                                  : 'rgba(239,95,24,0.45)',
                              },
                            ]}
                          />
                          {rep.isVerified && (
                            <View style={styles.verifiedBadge}>
                              <Text style={[styles.verifiedCheck, fontStyle('bold')]}>✓</Text>
                            </View>
                          )}
                        </View>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.repName,
                            fontStyle('extrabold'),
                            { color: isFeatured ? '#FFFFFF' : palette.textPrimary },
                          ]}>
                          {rep.name}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.repRole,
                            fontStyle('semibold'),
                            {
                              color: isFeatured
                                ? 'rgba(255,255,255,0.86)'
                                : palette.textMuted,
                            },
                          ]}>
                          {rep.discipline} • {shortLocation}
                        </Text>
                      </View>

                      {/* Bottom Footer Row */}
                      <View
                        style={[
                          styles.cardFooter,
                          {
                            borderTopColor: isFeatured
                              ? 'rgba(255,255,255,0.22)'
                              : palette.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.footerStages,
                            fontStyle('bold'),
                            {
                              color: isFeatured
                                ? 'rgba(255,255,255,0.86)'
                                : palette.textMuted,
                            },
                          ]}>
                          {rep.stagesVerifiedCount}{' '}
                          {rep.stagesVerifiedCount === 1 ? 'Stage' : 'Stages'} Verified
                        </Text>

                        <View
                          style={[
                            styles.siteCountPill,
                            {
                              backgroundColor: isFeatured
                                ? 'rgba(255,255,255,0.22)'
                                : palette.surfaceSubtle,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.siteCountText,
                              fontStyle('bold'),
                              {
                                color: isFeatured ? '#FFFFFF' : palette.textSecondary,
                              },
                            ]}>
                            {rep.assignedProjects.length}{' '}
                            {rep.assignedProjects.length === 1 ? 'Site' : 'Sites'}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Profile Detail Modal */}
      {!!selectedRep && (
      <Modal
        visible={!!selectedRep}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedRep(null)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            {selectedRep && (
              <>
                <View style={styles.detailHeader}>
                  <View style={styles.detailHeaderLeft}>
                    <View style={styles.avatarWrap}>
                      <Image source={{ uri: selectedRep.avatar }} style={styles.detailAvatar} />
                      {selectedRep.isVerified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={[styles.verifiedCheck, fontStyle('bold')]}>✓</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailName, fontStyle('extrabold')]}>
                        {selectedRep.name}
                      </Text>
                      <Text style={[styles.detailTitle, fontStyle('medium')]}>
                        {selectedRep.title}
                      </Text>
                      <Text style={[styles.detailLicense, fontStyle('regular')]}>
                        {selectedRep.licenseNumber}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setSelectedRep(null)} style={styles.detailCloseBtn}>
                    <Text style={{ color: '#FFFFFF', fontSize: 15 }}>✕</Text>
                  </Pressable>
                </View>

                <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={styles.detailBody}>
                  <View
                    style={[
                      styles.contactBox,
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.contactText, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      {selectedRep.email} · {selectedRep.phone}
                    </Text>
                    <View
                      style={[
                        styles.statusChip,
                        { backgroundColor: palette.surface, borderColor: palette.border },
                      ]}>
                      <Text style={[styles.statusChipText, fontStyle('bold'), { color: palette.textPrimary }]}>
                        {selectedRep.status}
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 4 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      OVERSIGHT SCOPE
                    </Text>
                    <Text style={[styles.mandateText, fontStyle('regular'), { color: palette.textSecondary }]}>
                      {selectedRep.mandateSummary}
                    </Text>
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      ASSIGNED SITES ({selectedRep.assignedProjects.length})
                    </Text>
                    {selectedRep.assignedProjects.map((p) => (
                      <View
                        key={p.id}
                        style={[
                          styles.siteRow,
                          { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                        ]}>
                        <Text style={[styles.siteName, fontStyle('bold'), { color: palette.textPrimary }]}>
                          {p.title}
                        </Text>
                        <Text style={[styles.siteRole, fontStyle('semibold'), { color: palette.textMuted }]}>
                          {p.roleOnProject}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      ACTIVE DELEGATED PERMISSIONS
                    </Text>
                    <View style={styles.permBadgesWrap}>
                      {selectedRep.permissions.viewProgress && (
                        <View
                          style={[
                            styles.permChip,
                            { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                          ]}>
                          <Text style={[styles.permChipText, fontStyle('bold'), { color: palette.textSecondary }]}>
                            ✓ View Progress
                          </Text>
                        </View>
                      )}
                      {selectedRep.permissions.approveStages && (
                        <View
                          style={[
                            styles.permChip,
                            { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                          ]}>
                          <Text style={[styles.permChipText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                            ✓ Stage Sign-Off
                          </Text>
                        </View>
                      )}
                      {selectedRep.permissions.managePayments && (
                        <View
                          style={[
                            styles.permChip,
                            { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                          ]}>
                          <Text style={[styles.permChipText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                            ✓ Payments & Escrow
                          </Text>
                        </View>
                      )}
                      {selectedRep.permissions.changeRequests && (
                        <View
                          style={[
                            styles.permChip,
                            { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                          ]}>
                          <Text style={[styles.permChipText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                            ✓ Change Requests
                          </Text>
                        </View>
                      )}
                      {selectedRep.permissions.messageContractor && (
                        <View
                          style={[
                            styles.permChip,
                            { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                          ]}>
                          <Text style={[styles.permChipText, fontStyle('bold'), { color: palette.textSecondary }]}>
                            ✓ Direct Site Chat
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>

                <View
                  style={[
                    styles.detailFooter,
                    { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border },
                  ]}>
                  <Pressable
                    onPress={() => setSelectedRep(null)}
                    style={[
                      styles.secondaryBtn,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                      Close
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openPermissionsPage(selectedRep)}
                    style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                    <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                      Manage Permissions →
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      )}

      {/* Filter Modal */}
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
              <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Filter Representatives
              </Text>
              <Pressable onPress={() => setIsFilterModalOpen(false)}>
                <Text style={{ color: palette.textMuted, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>

            <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
              PROFESSIONAL DISCIPLINE
            </Text>
            <View style={styles.chipGrid}>
              {DISCIPLINES.map((disc) => {
                const active = selectedDiscipline === disc;
                return (
                  <Pressable
                    key={disc}
                    onPress={() => setSelectedDiscipline(disc)}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor: active ? palette.brandSoftBg : palette.surfaceSubtle,
                        borderColor: active ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionChipText,
                        fontStyle('bold'),
                        { color: active ? palette.brandSoftText : palette.textSecondary },
                      ]}>
                      {disc}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
              LOCATION / STATE
            </Text>
            <View style={styles.chipGrid}>
              {STATES.map((st) => {
                const active = selectedState === st;
                return (
                  <Pressable
                    key={st}
                    onPress={() => setSelectedState(st)}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor: active ? palette.brandSoftBg : palette.surfaceSubtle,
                        borderColor: active ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionChipText,
                        fontStyle('bold'),
                        { color: active ? palette.brandSoftText : palette.textSecondary },
                      ]}>
                      {st}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                Verified Practitioners Only
              </Text>
              <Switch
                value={onlyVerified}
                onValueChange={setOnlyVerified}
                trackColor={{ false: palette.border, true: palette.brandOrange }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                Bookmarked Reps Only
              </Text>
              <Switch
                value={onlyFavorites}
                onValueChange={setOnlyFavorites}
                trackColor={{ false: palette.border, true: palette.brandOrange }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.modalFooter}>
              <Pressable onPress={resetFilters}>
                <Text style={[styles.clearAllText, fontStyle('bold'), { color: palette.textMuted }]}>
                  Reset Filters
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsFilterModalOpen(false)}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      )}

      {/* Invite Representative Modal */}
      {isInviteModalOpen && (
      <Modal
        visible={isInviteModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsSiteDropdownOpen(false);
          setIsInviteModalOpen(false);
        }}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailName, fontStyle('extrabold')]}>
                  Invite Representative
                </Text>
                <Text style={[styles.detailTitle, fontStyle('medium')]}>
                  Dispatch onboarding invite code with delegated inspection rights
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setIsSiteDropdownOpen(false);
                  setIsInviteModalOpen(false);
                }}
                style={styles.detailCloseBtn}>
                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>✕</Text>
              </Pressable>
            </View>

            {inviteSuccessNotice ? (
              <View style={{ padding: 20 }}>
                <View
                  style={[
                    styles.noticeBanner,
                    { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                  ]}>
                  <Text style={[styles.noticeText, fontStyle('bold'), { color: palette.greenText }]}>
                    ✓ Invitation dispatched to {inviteEmail}. Added to your representatives list.
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView
                style={{ maxHeight: 480 }}
                contentContainerStyle={styles.inviteFormBody}
                keyboardShouldPersistTaps="handled">
                <View style={{ gap: 4 }}>
                  <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                    REPRESENTATIVE NAME *
                  </Text>
                  <TextInput
                    value={inviteName}
                    onChangeText={setInviteName}
                    placeholder="e.g. Engr. Kayode Adeleke"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                        color: palette.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                    EMAIL ADDRESS *
                  </Text>
                  <TextInput
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="kayode.adeleke@engineers.ng"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                        color: palette.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View style={{ gap: 6 }}>
                  <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                    PROFESSIONAL DISCIPLINE
                  </Text>
                  <View style={styles.chipGrid}>
                    {(
                      [
                        'Structural & Civil',
                        'Architecture',
                        'Quantity Surveying',
                        'MEP Engineering',
                        'Owner Proxy',
                      ] as const
                    ).map((d) => {
                      const active = inviteDiscipline === d;
                      return (
                        <Pressable
                          key={d}
                          onPress={() => setInviteDiscipline(d)}
                          style={[
                            styles.optionChip,
                            {
                              backgroundColor: active ? palette.brandSoftBg : palette.surfaceSubtle,
                              borderColor: active ? palette.brandOrange : palette.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.optionChipText,
                              fontStyle('bold'),
                              { color: active ? palette.brandSoftText : palette.textSecondary },
                            ]}>
                            {d}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                    ASSIGN SITE
                  </Text>
                  <Pressable
                    onPress={() => setIsSiteDropdownOpen((prev) => !prev)}
                    style={[
                      styles.dropdownTrigger,
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: isSiteDropdownOpen ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.dropdownValue,
                        fontStyle('semibold'),
                        { color: palette.textPrimary },
                      ]}>
                      {inviteProject}
                    </Text>
                    <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                      {isSiteDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </Pressable>

                  {isSiteDropdownOpen && (
                    <View
                      style={[
                        styles.dropdownMenu,
                        {
                          backgroundColor: palette.surface,
                          borderColor: palette.border,
                        },
                      ]}>
                      {ownerProjectTitles.map((projectTitle, idx) => {
                        const selected = inviteProject === projectTitle;
                        return (
                          <Pressable
                            key={projectTitle}
                            onPress={() => {
                              setInviteProject(projectTitle);
                              setIsSiteDropdownOpen(false);
                            }}
                            style={[
                              styles.dropdownOption,
                              idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                              selected && { backgroundColor: palette.brandSoftBg },
                            ]}>
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                fontStyle(selected ? 'bold' : 'medium'),
                                {
                                  color: selected ? palette.brandSoftText : palette.textPrimary,
                                },
                              ]}>
                              {projectTitle}
                            </Text>
                            {selected && (
                              <Text style={{ color: palette.brandOrange, fontSize: 12 }}>✓</Text>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                    ROLE DESCRIPTION / TITLE
                  </Text>
                  <TextInput
                    value={inviteTitle}
                    onChangeText={setInviteTitle}
                    placeholder="e.g. Lead Project Structural Auditor"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                        color: palette.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View style={styles.modalFooter}>
                  <Pressable
                    onPress={() => {
                      setIsSiteDropdownOpen(false);
                      setIsInviteModalOpen(false);
                    }}
                    style={[
                      styles.secondaryBtn,
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSendInvite}
                    style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                    <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                      Send Invitation Link →
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 28, gap: 14 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: { fontSize: 22, letterSpacing: -0.4 },
  subtitle: { fontSize: 12, lineHeight: 17 },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 2 },
  filterBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterBtnText: { fontSize: 12 },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  activePillText: { fontSize: 11 },
  clearAllText: { fontSize: 11.5, textDecorationLine: 'underline', marginLeft: 4 },
  sectionMeta: { gap: 2 },
  sectionKicker: { fontSize: 10.5, letterSpacing: 0.6 },
  sectionHint: { fontSize: 11.5 },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  repCard: {
    width: '48.5%',
    minHeight: 225,
    borderRadius: 20,
    padding: 13,
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCenter: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 15,
    borderWidth: 2,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2E9E57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: { color: '#FFFFFF', fontSize: 9.5 },
  repName: { fontSize: 13.5, textAlign: 'center' },
  repRole: { fontSize: 10.5, marginTop: 2, textAlign: 'center' },
  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  footerStages: { fontSize: 10, flexShrink: 1 },
  siteCountPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
  },
  siteCountText: { fontSize: 9.5 },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
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
    marginBottom: 10,
  },
  primaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 13 },
  secondaryBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 13 },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  backBtnText: { fontSize: 12 },
  noticeBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  noticeText: { fontSize: 12, lineHeight: 17 },
  healthCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 4,
  },
  healthKicker: { fontSize: 10.5, letterSpacing: 0.7 },
  healthPct: { fontSize: 36, letterSpacing: -1 },
  healthDesc: { fontSize: 12, lineHeight: 17 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  identityAvatar: { width: 48, height: 48, borderRadius: 12 },
  identityName: { fontSize: 14.5 },
  identityTitle: { fontSize: 11.5, marginTop: 1 },
  identityLicense: { fontSize: 10.5, marginTop: 2 },
  permTitle: { fontSize: 17 },
  permSub: { fontSize: 12, lineHeight: 17 },
  permItemRow: { paddingTop: 12, gap: 10 },
  permItemTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  permTagRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  permItemName: { fontSize: 13.5 },
  tagPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagPillText: { fontSize: 9.5 },
  permItemDesc: { fontSize: 11.5, lineHeight: 16 },
  stepperRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
  },
  stepperBtn: { paddingHorizontal: 10, height: '100%', justifyContent: 'center' },
  stepperSign: { fontSize: 15, fontWeight: '700' },
  stepperVal: { fontSize: 11.5, paddingHorizontal: 8 },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 18 },
  detailModalCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailHeader: {
    backgroundColor: '#261A66',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  detailAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  detailName: { color: '#FFFFFF', fontSize: 16 },
  detailTitle: { color: '#D5D2EF', fontSize: 11.5, marginTop: 1 },
  detailLicense: { color: 'rgba(255,255,255,0.7)', fontSize: 10.5, marginTop: 2 },
  detailCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBody: { padding: 16, gap: 14 },
  contactBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  contactText: { fontSize: 11.5 },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusChipText: { fontSize: 10.5 },
  sectionLabel: { fontSize: 10.5, letterSpacing: 0.6 },
  mandateText: { fontSize: 12, lineHeight: 18 },
  siteRow: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  siteName: { fontSize: 12, flex: 1 },
  siteRole: { fontSize: 11 },
  permBadgesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  permChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  permChipText: { fontSize: 11 },
  detailFooter: {
    padding: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 16 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionChipText: { fontSize: 11.5 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: { fontSize: 12.5 },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  inviteFormBody: {
    padding: 16,
    gap: 12,
  },
  dropdownTrigger: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownValue: {
    fontSize: 13,
    flex: 1,
  },
  dropdownMenu: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownOptionText: {
    fontSize: 12.5,
    flex: 1,
  },
});

export default OwnerRepresentativesPage;
