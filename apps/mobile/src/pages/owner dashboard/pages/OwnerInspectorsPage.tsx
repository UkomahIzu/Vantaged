import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  DEMO_OWNER_FOLDER_PROJECTS,
  DEMO_OWNER_INSPECTORS,
  DEMO_OWNER_INSPECTION_TICKETS,
  type OwnerMobileInspectionTicket,
  type OwnerMobileInspectorItem,
} from '../data/ownerDashboardData';
import { OwnerNavIcon } from '../components/OwnerIcons';

const DISCIPLINES: Array<'All' | OwnerMobileInspectorItem['discipline']> = [
  'All',
  'Structural & Civil',
  'MEP & Electrical',
  'Quantity Surveying',
  'Waterproofing & Roofing',
];

const STATES = ['All', 'Lagos', 'Abuja FCT', 'Rivers / PH', 'Oyo'] as const;

const STAGE_OPTIONS = [
  'Stage 3: First Floor Slab & Columns',
  'Stage 4: Roof Truss & Covering',
  'Defect Re-Inspection: Column C4 Spalling',
] as const;

function IconBolt({ color = '#FFFFFF', size = 15 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </Svg>
  );
}

function IconRadar({ color = '#D97706', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19.07 4.93a10 10 0 0 0-14.14 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M16.24 7.76a6 6 0 0 0-8.48 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M13.41 10.59a2 2 0 0 0-2.82 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}

export function OwnerInspectorsPage() {
  const { palette, isDemoMode } = useOwnerMobile();

  const [inspectors, setInspectors] = useState<OwnerMobileInspectorItem[]>(
    isDemoMode ? DEMO_OWNER_INSPECTORS : []
  );
  const [tickets, setTickets] = useState<OwnerMobileInspectionTicket[]>(
    isDemoMode ? DEMO_OWNER_INSPECTION_TICKETS : []
  );

  useEffect(() => {
    setInspectors(isDemoMode ? DEMO_OWNER_INSPECTORS : []);
    setTickets(isDemoMode ? DEMO_OWNER_INSPECTION_TICKETS : []);
    setSelectedInspector(null);
  }, [isDemoMode]);

  const [activeTab, setActiveTab] = useState<'directory' | 'tickets'>('directory');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Dossier & Request modals
  const [selectedInspector, setSelectedInspector] =
    useState<OwnerMobileInspectorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetInspector, setTargetInspector] =
    useState<OwnerMobileInspectorItem | null>(null);

  const projectOptions = useMemo(
    () =>
      isDemoMode
        ? DEMO_OWNER_FOLDER_PROJECTS.map((p) => p.title)
        : ['No active projects yet'],
    [isDemoMode]
  );

  const [selectedProject, setSelectedProject] = useState(
    DEMO_OWNER_FOLDER_PROJECTS[0]?.title || 'Lekki Phase 1 Luxury Villa'
  );
  const [selectedStage, setSelectedStage] = useState<string>(STAGE_OPTIONS[0]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const formatNaira = (amt: number) => `₦${amt.toLocaleString('en-NG')}`;

  const isFilterActive =
    selectedDiscipline !== 'All' ||
    selectedState !== 'All' ||
    onlyVerified ||
    onlyFavorites;

  const filteredInspectors = useMemo(() => {
    return inspectors.filter((item) => {
      if (selectedDiscipline !== 'All' && item.discipline !== selectedDiscipline)
        return false;
      if (selectedState !== 'All' && item.state !== selectedState) return false;
      if (onlyVerified && !item.isVerified) return false;
      if (onlyFavorites && !item.isFavorite) return false;
      return true;
    });
  }, [inspectors, selectedDiscipline, selectedState, onlyVerified, onlyFavorites]);

  const handleToggleFavorite = (id: string) => {
    setInspectors((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleRequestInspection = () => {
    const newId = `TICK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fee = targetInspector ? targetInspector.perVisitFee : 45000;
    const newTicket: OwnerMobileInspectionTicket = {
      id: newId,
      projectTitle: selectedProject,
      stageTitle: selectedStage,
      fee,
      requestedAt: 'Just now',
      status: 'Broadcasting',
      inspectorId: targetInspector?.id,
    };

    setTickets((prev) => [newTicket, ...prev]);
    setIsModalOpen(false);
    setSelectedInspector(null);
    setActiveTab('tickets');
    showToast(`Ticket ${newId} dispatched! Broadcasting to nearby COREN engineers...`);

    setTimeout(() => {
      const acceptedInspector = targetInspector || DEMO_OWNER_INSPECTORS[0];
      setTickets((prev) =>
        prev.map((t) =>
          t.id === newId
            ? {
                ...t,
                status: 'Accepted',
                inspectorId: acceptedInspector.id,
                inspectorName: acceptedInspector.name,
                inspectorLicense: acceptedInspector.licenseNumber,
                inspectorAvatar: acceptedInspector.avatar,
                scheduledTime: 'Tomorrow, 10:30 AM',
              }
            : t
        )
      );
      showToast(`⚡ ${acceptedInspector.name} accepted your inspection ticket!`);
    }, 3800);
  };

  const handleManualAcceptTicket = (ticketId: string) => {
    const engineer = DEMO_OWNER_INSPECTORS[0];
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Accepted',
              inspectorId: engineer.id,
              inspectorName: engineer.name,
              inspectorLicense: engineer.licenseNumber,
              inspectorAvatar: engineer.avatar,
              scheduledTime: 'Tomorrow, 10:30 AM',
            }
          : t
      )
    );
    showToast(`Ticket accepted by ${engineer.name}!`);
  };

  const handleCancelTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showToast('Inspection ticket cancelled.');
  };

  const handleTicketCardClick = (ticket: OwnerMobileInspectionTicket) => {
    if (ticket.status === 'Accepted') {
      const found =
        inspectors.find((i) => i.id === ticket.inspectorId) ||
        DEMO_OWNER_INSPECTORS[0];
      setSelectedInspector(found);
    } else {
      showToast(
        `Ticket ${ticket.id} is broadcasting. Tap 'Accept' to simulate acceptance.`
      );
    }
  };

  const resetFilters = () => {
    setSelectedDiscipline('All');
    setSelectedState('All');
    setOnlyVerified(false);
    setOnlyFavorites(false);
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Toast */}
        {toastMessage && (
          <View style={styles.toastBanner}>
            <View style={styles.toastDot} />
            <Text style={[styles.toastText, fontStyle('bold')]}>{toastMessage}</Text>
          </View>
        )}

        {/* Header & Toolbar */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              {activeTab === 'directory' ? 'Site Inspectors' : 'Active Inspection Requests'}
            </Text>
            <Text style={[styles.subtitle, fontStyle('medium'), { color: palette.textMuted }]}>
              {activeTab === 'directory'
                ? 'Licensed COREN and NIQS engineers available on-demand for milestone audits and defect verifications.'
                : 'Active site inspection tickets dispatched to certified engineers. Tap any card to view profile.'}
            </Text>
          </View>

          <View style={styles.toolbar}>
            {activeTab === 'directory' && (
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
            )}

            <Pressable
              onPress={() => {
                setTargetInspector(null);
                setIsModalOpen(true);
              }}
              style={[
                styles.plusBtn,
                { backgroundColor: palette.brandOrange, borderColor: palette.brandOrange },
              ]}>
              <IconBolt color="#FFFFFF" size={16} />
            </Pressable>
          </View>
        </View>

        {/* View Switcher Tabs */}
        <View
          style={[
            styles.tabBar,
            { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
          ]}>
          <Pressable
            onPress={() => setActiveTab('directory')}
            style={[
              styles.tabBtn,
              activeTab === 'directory' && { backgroundColor: palette.brandOrange },
            ]}>
            <Text
              style={[
                styles.tabText,
                fontStyle('bold'),
                { color: activeTab === 'directory' ? '#FFFFFF' : palette.textSecondary },
              ]}>
              Inspectors ({inspectors.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('tickets')}
            style={[
              styles.tabBtn,
              activeTab === 'tickets' && { backgroundColor: palette.brandOrange },
            ]}>
            <Text
              style={[
                styles.tabText,
                fontStyle('bold'),
                { color: activeTab === 'tickets' ? '#FFFFFF' : palette.textSecondary },
              ]}>
              Active Tickets ({tickets.length})
            </Text>
          </Pressable>
        </View>

        {/* Active Filter Pills */}
        {isFilterActive && activeTab === 'directory' && (
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
            {selectedState !== 'All' && (
              <Pressable
                onPress={() => setSelectedState('All')}
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
                  { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                ]}>
                <Text style={[styles.activePillText, fontStyle('bold'), { color: palette.greenText }]}>
                  Verified ×
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
                  ♥ Favourited ×
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

        {activeTab === 'directory' ? (
          /* ── DIRECTORY TAB (2-Column Portrait Rectangle Cards) ── */
          <>
            <View style={styles.sectionMeta}>
              <Text style={[styles.sectionKicker, fontStyle('extrabold'), { color: palette.textMuted }]}>
                REGISTERED ENGINEERS ({filteredInspectors.length})
              </Text>
              <Text style={[styles.sectionHint, fontStyle('semibold'), { color: palette.textMuted }]}>
                Tap any card to view license, bio & audit track record
              </Text>
            </View>

            {filteredInspectors.length === 0 ? (
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
                  <OwnerNavIcon id="inspectors" color={palette.brandOrange} size={24} />
                </View>
                <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  {inspectors.length === 0
                    ? 'No Registered Inspectors Loaded'
                    : 'No Inspectors Match Filters'}
                </Text>
                <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                  {inspectors.length === 0
                    ? 'Switch on Demo Mode to browse sample COREN & NIQS accredited engineers, or dispatch a nearest-engineer ticket.'
                    : 'Try resetting your discipline or state filters to display available engineers.'}
                </Text>
                <Pressable
                  onPress={() =>
                    inspectors.length === 0
                      ? (() => {
                          setTargetInspector(null);
                          setIsModalOpen(true);
                        })()
                      : resetFilters()
                  }
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, marginTop: 8 }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    {inspectors.length === 0 ? '⚡ Request Nearest Inspector' : 'Reset Filters'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.cardsGrid}>
                {filteredInspectors.map((inspector) => {
                  const isFeatured = !!inspector.isFeatured;
                  const shortLocation = inspector.location
                    ? inspector.location.split(',')[0]
                    : inspector.state;
                  const shortState = inspector.state
                    ? inspector.state.split(' ')[0]
                    : 'Nigeria';

                  return (
                    <Pressable
                      key={inspector.id}
                      onPress={() => setSelectedInspector(inspector)}
                      style={[
                        styles.gridCard,
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
                      {/* Top Header: Bookmark Heart + Quick Request (+) */}
                      <View style={styles.cardTopRow}>
                        <Pressable
                          onPress={() => handleToggleFavorite(inspector.id)}
                          style={[
                            styles.circleIconBtn,
                            {
                              backgroundColor: isFeatured
                                ? 'rgba(255,255,255,0.2)'
                                : inspector.isFavorite
                                ? palette.brandSoftBg
                                : palette.surfaceSubtle,
                            },
                          ]}>
                          <Svg width={14} height={14} viewBox="0 0 24 24">
                            <Path
                              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                              fill={
                                inspector.isFavorite
                                  ? isFeatured
                                    ? '#FFFFFF'
                                    : palette.brandOrange
                                  : 'none'
                              }
                              stroke={
                                isFeatured
                                  ? '#FFFFFF'
                                  : inspector.isFavorite
                                  ? palette.brandOrange
                                  : palette.textMuted
                              }
                              strokeWidth={2}
                            />
                          </Svg>
                        </Pressable>

                        <Pressable
                          onPress={() => {
                            setTargetInspector(inspector);
                            setIsModalOpen(true);
                          }}
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
                          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                            <Line
                              x1="12"
                              y1="5"
                              x2="12"
                              y2="19"
                              stroke={palette.brandOrange}
                              strokeWidth={2.5}
                            />
                            <Line
                              x1="5"
                              y1="12"
                              x2="19"
                              y2="12"
                              stroke={palette.brandOrange}
                              strokeWidth={2.5}
                            />
                          </Svg>
                        </Pressable>
                      </View>

                      {/* Center Photo & Title */}
                      <View style={styles.cardCenter}>
                        <Image
                          source={{ uri: inspector.avatar }}
                          style={[
                            styles.avatar,
                            {
                              borderColor: isFeatured
                                ? '#FFFFFF'
                                : palette.border,
                            },
                          ]}
                        />

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cardName,
                            fontStyle('extrabold'),
                            { color: isFeatured ? '#FFFFFF' : palette.textPrimary },
                          ]}>
                          {inspector.name}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cardSub,
                            fontStyle('semibold'),
                            {
                              color: isFeatured
                                ? 'rgba(255,255,255,0.85)'
                                : palette.textMuted,
                            },
                          ]}>
                          {inspector.discipline} • {shortLocation}
                        </Text>
                      </View>

                      {/* Audits Track Record Bar */}
                      <View style={{ gap: 4 }}>
                        <View style={styles.trackRow}>
                          <Text
                            style={[
                              styles.trackLabel,
                              fontStyle('bold'),
                              {
                                color: isFeatured
                                  ? 'rgba(255,255,255,0.82)'
                                  : palette.textMuted,
                              },
                            ]}>
                            Audit Fee
                          </Text>
                          <Text
                            style={[
                              styles.trackValue,
                              fontStyle('extrabold'),
                              { color: isFeatured ? '#FFFFFF' : palette.brandOrange },
                            ]}>
                            {formatNaira(inspector.perVisitFee)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.trackBarBg,
                            {
                              backgroundColor: isFeatured
                                ? 'rgba(255,255,255,0.25)'
                                : palette.surfaceSubtle,
                            },
                          ]}>
                          <View
                            style={[
                              styles.trackBarFill,
                              {
                                width: `${inspector.reliabilityRate}%`,
                                backgroundColor: isFeatured ? '#FFFFFF' : palette.brandOrange,
                              },
                            ]}
                          />
                        </View>
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
                        <View style={styles.ratingRow}>
                          <Text style={{ color: '#FBBF24', fontSize: 11 }}>★</Text>
                          <Text
                            style={[
                              styles.ratingText,
                              fontStyle('bold'),
                              { color: isFeatured ? '#FFFFFF' : palette.textPrimary },
                            ]}>
                            {inspector.rating}
                          </Text>
                          <Text
                            style={[
                              styles.ratingCount,
                              fontStyle('semibold'),
                              {
                                color: isFeatured
                                  ? 'rgba(255,255,255,0.75)'
                                  : palette.textMuted,
                              },
                            ]}>
                            ({inspector.auditsCompleted})
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.statePill,
                            {
                              backgroundColor: isFeatured
                                ? 'rgba(255,255,255,0.22)'
                                : palette.surfaceSubtle,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.statePillText,
                              fontStyle('bold'),
                              { color: isFeatured ? '#FFFFFF' : palette.textSecondary },
                            ]}>
                            {shortState}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        ) : (
          /* ── ACTIVE TICKETS TAB (2-Column Portrait Rectangle Cards) ── */
          <>
            <View style={styles.sectionMeta}>
              <Text style={[styles.sectionKicker, fontStyle('extrabold'), { color: palette.textMuted }]}>
                ACTIVE INSPECTION TICKETS ({tickets.length})
              </Text>
              <Text style={[styles.sectionHint, fontStyle('semibold'), { color: palette.textMuted }]}>
                Tap an accepted card to open the engineer&apos;s credentials
              </Text>
            </View>

            {tickets.length === 0 ? (
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
                  <IconBolt color={palette.brandOrange} size={22} />
                </View>
                <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  No Active Inspection Tickets
                </Text>
                <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                  When you request an inspection on any milestone or defect, your live ticket will appear here with real-time status.
                </Text>
                <Pressable
                  onPress={() => {
                    setTargetInspector(null);
                    setIsModalOpen(true);
                  }}
                  style={[
                    styles.primaryBtn,
                    {
                      backgroundColor: palette.brandOrange,
                      marginTop: 8,
                      flexDirection: 'row',
                      gap: 6,
                    },
                  ]}>
                  <IconBolt color="#FFFFFF" size={14} />
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    Request an Inspector
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.cardsGrid}>
                {tickets.map((t) => {
                  const isBroadcasting = t.status === 'Broadcasting';
                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => handleTicketCardClick(t)}
                      style={[
                        styles.gridCard,
                        isBroadcasting
                          ? {
                              backgroundColor: '#FFFBEB',
                              borderColor: '#FCD34D',
                              borderWidth: 1.5,
                              borderStyle: 'dashed',
                            }
                          : {
                              backgroundColor: palette.surface,
                              borderColor: palette.border,
                              borderWidth: 1,
                            },
                      ]}>
                      {/* Top Status & Cancel */}
                      <View style={styles.cardTopRow}>
                        <View
                          style={[
                            styles.ticketStatusPill,
                            isBroadcasting
                              ? { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }
                              : { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                          ]}>
                          <Text
                            style={[
                              styles.ticketStatusText,
                              fontStyle('extrabold'),
                              { color: isBroadcasting ? '#92400E' : palette.greenText },
                            ]}>
                            {isBroadcasting ? 'Broadcasting' : '✓ Accepted'}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => handleCancelTicket(t.id)}
                          style={[
                            styles.circleIconBtn,
                            { backgroundColor: palette.surfaceSubtle },
                          ]}>
                          <Text style={{ color: palette.textMuted, fontSize: 12 }}>✕</Text>
                        </Pressable>
                      </View>

                      {/* Center Radar / Inspector Avatar */}
                      <View style={styles.cardCenter}>
                        {isBroadcasting ? (
                          <View style={styles.radarBox}>
                            <IconRadar color="#D97706" size={26} />
                          </View>
                        ) : (
                          <Image
                            source={{ uri: t.inspectorAvatar }}
                            style={[styles.avatar, { borderColor: palette.greenBorder }]}
                          />
                        )}

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cardName,
                            fontStyle('extrabold'),
                            { color: isBroadcasting ? '#261A66' : palette.textPrimary },
                          ]}>
                          {isBroadcasting ? 'Finding Engineer...' : t.inspectorName}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cardSub,
                            fontStyle('semibold'),
                            { color: isBroadcasting ? '#6B7280' : palette.textMuted },
                          ]}>
                          {t.stageTitle}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.ticketProj,
                            fontStyle('medium'),
                            { color: isBroadcasting ? '#9CA3AF' : palette.textMuted },
                          ]}>
                          {t.projectTitle}
                        </Text>
                      </View>

                      {/* Fee Bar */}
                      <View style={{ gap: 4 }}>
                        <View style={styles.trackRow}>
                          <Text
                            style={[
                              styles.trackLabel,
                              fontStyle('bold'),
                              { color: isBroadcasting ? '#6B7280' : palette.textMuted },
                            ]}>
                            {isBroadcasting ? 'Live Radar' : 'Escrow Safe'}
                          </Text>
                          <Text
                            style={[
                              styles.trackValue,
                              fontStyle('extrabold'),
                              { color: palette.brandOrange },
                            ]}>
                            {formatNaira(t.fee)}
                          </Text>
                        </View>
                        <View style={[styles.trackBarBg, { backgroundColor: palette.surfaceSubtle }]}>
                          <View
                            style={[
                              styles.trackBarFill,
                              {
                                width: isBroadcasting ? '72%' : '100%',
                                backgroundColor: isBroadcasting ? '#F59E0B' : '#2E9E57',
                              },
                            ]}
                          />
                        </View>
                      </View>

                      {/* Footer */}
                      <View style={[styles.cardFooter, { borderTopColor: palette.border }]}>
                        {isBroadcasting ? (
                          <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <IconBolt color="#D97706" size={11} />
                              <Text style={[styles.ratingCount, fontStyle('bold'), { color: '#B45309' }]}>
                                Dispatching
                              </Text>
                            </View>
                            <Pressable
                              onPress={() => handleManualAcceptTicket(t.id)}
                              style={styles.acceptMiniBtn}>
                              <Text style={[styles.acceptMiniText, fontStyle('bold')]}>
                                ✓ Accept
                              </Text>
                            </Pressable>
                          </>
                        ) : (
                          <>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.ratingCount,
                                fontStyle('bold'),
                                { color: palette.greenText, flex: 1 },
                              ]}>
                              {t.scheduledTime}
                            </Text>
                            <View
                              style={[
                                styles.statePill,
                                { backgroundColor: palette.greenBg },
                              ]}>
                              <Text style={[styles.statePillText, fontStyle('bold'), { color: palette.greenText }]}>
                                Confirmed
                              </Text>
                            </View>
                          </>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Inspector Dossier Modal */}
      {!!selectedInspector && (
      <Modal
        visible={!!selectedInspector}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedInspector(null)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            {selectedInspector && (
              <>
                <View style={styles.detailHeader}>
                  <View style={styles.detailHeaderLeft}>
                    <Image
                      source={{ uri: selectedInspector.avatar }}
                      style={styles.detailAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailName, fontStyle('extrabold')]}>
                        {selectedInspector.name}
                      </Text>
                      <Text style={[styles.detailLicense, fontStyle('medium')]}>
                        {selectedInspector.licenseNumber}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => setSelectedInspector(null)}
                    style={styles.detailCloseBtn}>
                    <Text style={{ color: '#FFFFFF', fontSize: 15 }}>✕</Text>
                  </Pressable>
                </View>

                <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={styles.detailBody}>
                  <View
                    style={[
                      styles.statsBar,
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                    ]}>
                    <View style={styles.statCell}>
                      <Text style={[styles.statLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                        AUDIT FEE
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                        {formatNaira(selectedInspector.perVisitFee)}
                      </Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={[styles.statLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                        COMPLETED
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        {selectedInspector.auditsCompleted} Audits
                      </Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={[styles.statLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                        RATING
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        ★ {selectedInspector.rating}
                      </Text>
                    </View>
                  </View>

                  {tickets.some(
                    (t) =>
                      t.inspectorId === selectedInspector.id && t.status === 'Accepted'
                  ) && (
                    <View
                      style={[
                        styles.activeAssignBanner,
                        { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                      ]}>
                      <Text style={[styles.activeAssignText, fontStyle('bold'), { color: palette.greenText }]}>
                        ● Active Assignment: Scheduled for{' '}
                        {
                          tickets.find(
                            (t) =>
                              t.inspectorId === selectedInspector.id &&
                              t.status === 'Accepted'
                          )?.scheduledTime
                        }
                      </Text>
                    </View>
                  )}

                  <View style={{ gap: 6 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      PROFESSIONAL CREDENTIALS & SCOPE
                    </Text>
                    <Text style={[styles.overviewText, fontStyle('regular'), { color: palette.textSecondary }]}>
                      {selectedInspector.title} practicing across {selectedInspector.location}. Fully licensed for site audits, defect diagnosis, and independent escrow sign-offs.
                    </Text>
                    <View style={styles.chipGrid}>
                      {selectedInspector.specialties.map((s) => (
                        <View
                          key={s}
                          style={[
                            styles.specChip,
                            { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                          ]}>
                          <Text style={[styles.specChipText, fontStyle('bold'), { color: palette.textSecondary }]}>
                            {s}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      VERIFIED SITE AUDIT TRACK RECORD
                    </Text>
                    {selectedInspector.recentAudits.map((a, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.auditRow,
                          { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                        ]}>
                        <Text style={[styles.auditTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                          {a.title}
                        </Text>
                        <Text style={[styles.auditMeta, fontStyle('medium'), { color: palette.textMuted }]}>
                          {a.project} • {a.stage} ({a.date})
                        </Text>
                        <View
                          style={[
                            styles.outcomeChip,
                            { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                          ]}>
                          <Text style={[styles.outcomeText, fontStyle('extrabold'), { color: palette.greenText }]}>
                            {a.outcome}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <View
                  style={[
                    styles.detailFooter,
                    { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border },
                  ]}>
                  <Pressable
                    onPress={() => setSelectedInspector(null)}
                    style={[
                      styles.secondaryBtn,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                      Close
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const insp = selectedInspector;
                      setSelectedInspector(null);
                      setTargetInspector(insp);
                      setIsModalOpen(true);
                    }}
                    style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                    <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                      Dispatch Ticket →
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      )}

      {/* 1-Step Request / Dispatch Modal */}
      {isModalOpen && (
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsProjectDropdownOpen(false);
          setIsStageDropdownOpen(false);
          setIsModalOpen(false);
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
                  {targetInspector
                    ? `Request ${targetInspector.name}`
                    : 'Request Nearest Inspector'}
                </Text>
                <Text style={[styles.detailLicense, fontStyle('medium')]}>
                  On-demand certified site inspection ticket
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setIsProjectDropdownOpen(false);
                  setIsStageDropdownOpen(false);
                  setIsModalOpen(false);
                }}
                style={styles.detailCloseBtn}>
                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 450 }} contentContainerStyle={styles.detailBody}>
              {/* Project Dropdown */}
              <View style={{ gap: 4 }}>
                <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                  PROJECT
                </Text>
                <Pressable
                  onPress={() => {
                    setIsStageDropdownOpen(false);
                    setIsProjectDropdownOpen((p) => !p);
                  }}
                  style={[
                    styles.dropdownTrigger,
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: isProjectDropdownOpen ? palette.brandOrange : palette.border,
                    },
                  ]}>
                  <Text
                    numberOfLines={1}
                    style={[styles.dropdownValue, fontStyle('semibold'), { color: palette.textPrimary }]}>
                    {selectedProject}
                  </Text>
                  <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                    {isProjectDropdownOpen ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {isProjectDropdownOpen && (
                  <View
                    style={[
                      styles.dropdownMenu,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    {projectOptions.map((proj, idx) => {
                      const active = selectedProject === proj;
                      return (
                        <Pressable
                          key={proj}
                          onPress={() => {
                            setSelectedProject(proj);
                            setIsProjectDropdownOpen(false);
                          }}
                          style={[
                            styles.dropdownOption,
                            idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                            active && { backgroundColor: palette.brandSoftBg },
                          ]}>
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              fontStyle(active ? 'bold' : 'medium'),
                              { color: active ? palette.brandSoftText : palette.textPrimary },
                            ]}>
                            {proj}
                          </Text>
                          {active && (
                            <Text style={{ color: palette.brandOrange, fontSize: 12 }}>✓</Text>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Stage Dropdown */}
              <View style={{ gap: 4 }}>
                <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                  MILESTONE STAGE / DEFECT SNAG
                </Text>
                <Pressable
                  onPress={() => {
                    setIsProjectDropdownOpen(false);
                    setIsStageDropdownOpen((p) => !p);
                  }}
                  style={[
                    styles.dropdownTrigger,
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: isStageDropdownOpen ? palette.brandOrange : palette.border,
                    },
                  ]}>
                  <Text
                    numberOfLines={1}
                    style={[styles.dropdownValue, fontStyle('semibold'), { color: palette.textPrimary }]}>
                    {selectedStage}
                  </Text>
                  <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                    {isStageDropdownOpen ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {isStageDropdownOpen && (
                  <View
                    style={[
                      styles.dropdownMenu,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    {STAGE_OPTIONS.map((stg, idx) => {
                      const active = selectedStage === stg;
                      return (
                        <Pressable
                          key={stg}
                          onPress={() => {
                            setSelectedStage(stg);
                            setIsStageDropdownOpen(false);
                          }}
                          style={[
                            styles.dropdownOption,
                            idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                            active && { backgroundColor: palette.brandSoftBg },
                          ]}>
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              fontStyle(active ? 'bold' : 'medium'),
                              { color: active ? palette.brandSoftText : palette.textPrimary },
                            ]}>
                            {stg}
                          </Text>
                          {active && (
                            <Text style={{ color: palette.brandOrange, fontSize: 12 }}>✓</Text>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Escrow Protected Fee Banner */}
              <View
                style={[
                  styles.feeBanner,
                  { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                ]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feeTitle, fontStyle('bold'), { color: palette.brandSoftText }]}>
                    Escrow Protected Fee
                  </Text>
                  <Text style={[styles.feeHint, fontStyle('regular'), { color: palette.brandSoftText }]}>
                    Deducted from contractor if defect snag is verified
                  </Text>
                </View>
                <Text style={[styles.feeVal, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                  {formatNaira(targetInspector ? targetInspector.perVisitFee : 45000)}
                </Text>
              </View>

              <View style={styles.modalFooter}>
                <Pressable
                  onPress={() => setIsModalOpen(false)}
                  style={[
                    styles.secondaryBtn,
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                  ]}>
                  <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleRequestInspection}
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: palette.brandOrange, flexDirection: 'row', gap: 6 },
                  ]}>
                  <IconBolt color="#FFFFFF" size={14} />
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    Send Ticket to Inspector
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
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
                Filter Inspectors
              </Text>
              <Pressable onPress={() => setIsFilterModalOpen(false)}>
                <Text style={{ color: palette.textMuted, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>

            <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
              DISCIPLINE
            </Text>
            <View style={styles.chipGrid}>
              {DISCIPLINES.map((d) => {
                const active = selectedDiscipline === d;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setSelectedDiscipline(d)}
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

            <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
              REGION / STATE
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
                Verified Only
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
                Favourited Engineers Only
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
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 28, gap: 14 },
  toastBanner: {
    backgroundColor: '#261A66',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  toastText: { color: '#FFFFFF', fontSize: 12, flex: 1 },
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
  tabBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 7,
    alignItems: 'center',
  },
  tabText: { fontSize: 12 },
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
  gridCard: {
    width: '48.5%',
    minHeight: 245,
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
    paddingVertical: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 8,
  },
  radarBox: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardName: { fontSize: 13.5, textAlign: 'center' },
  cardSub: { fontSize: 10.5, marginTop: 2, textAlign: 'center' },
  ticketProj: { fontSize: 10, marginTop: 1, textAlign: 'center' },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackLabel: { fontSize: 10 },
  trackValue: { fontSize: 10.5 },
  trackBarBg: {
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  trackBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: { fontSize: 11 },
  ratingCount: { fontSize: 10 },
  statePill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statePillText: { fontSize: 9.5 },
  ticketStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  ticketStatusText: { fontSize: 9.5 },
  acceptMiniBtn: {
    backgroundColor: '#248246',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  acceptMiniText: { color: '#FFFFFF', fontSize: 10 },
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
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  detailName: { color: '#FFFFFF', fontSize: 16 },
  detailLicense: { color: '#D5D2EF', fontSize: 11, marginTop: 2 },
  detailCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBody: { padding: 16, gap: 14 },
  statsBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 2 },
  statLabel: { fontSize: 9.5, letterSpacing: 0.4 },
  statVal: { fontSize: 13 },
  activeAssignBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  activeAssignText: { fontSize: 11.5 },
  sectionLabel: { fontSize: 10.5, letterSpacing: 0.6 },
  overviewText: { fontSize: 12, lineHeight: 18 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  specChipText: { fontSize: 11 },
  auditRow: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  auditTitle: { fontSize: 12 },
  auditMeta: { fontSize: 10.5 },
  outcomeChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 2,
  },
  outcomeText: { fontSize: 10.5 },
  detailFooter: {
    padding: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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
  dropdownValue: { fontSize: 13, flex: 1 },
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
  dropdownOptionText: { fontSize: 12.5, flex: 1 },
  feeBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  feeTitle: { fontSize: 12 },
  feeHint: { fontSize: 10, marginTop: 1 },
  feeVal: { fontSize: 14 },
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
});

export default OwnerInspectorsPage;
