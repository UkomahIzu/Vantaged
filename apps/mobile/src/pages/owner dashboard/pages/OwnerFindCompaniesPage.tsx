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
import Svg, { Line, Path, Polygon } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  DEMO_OWNER_COMPANIES,
  DEMO_OWNER_INCOMING_REQUESTS,
  DEMO_OWNER_PROJECT_BRIEFS,
  type OwnerMobileCompanyItem,
  type OwnerMobileIncomingCompanyRequest,
  type OwnerMobileProjectBrief,
} from '../data/ownerDashboardData';
import { OwnerNavIcon } from '../components/OwnerIcons';

const CATEGORIES: Array<'All' | OwnerMobileCompanyItem['category']> = [
  'All',
  'General Contractor',
  'Structural & Civil',
  'MEP Engineering',
  'Architecture',
  'Marine & Geotech',
];

const STATES = ['All States', 'Lagos', 'Abuja FCT', 'Rivers / PH'] as const;

const BRIEF_CATEGORIES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Marine & Waterfront',
  'Architecture & Design',
] as const;

const BRIEF_BUDGETS = [
  '₦50M - ₦100M',
  '₦100M - ₦250M',
  '₦250M - ₦500M',
  '₦500M+',
] as const;

export function OwnerFindCompaniesPage() {
  const { palette, isDemoMode } = useOwnerMobile();

  const [companies, setCompanies] = useState<OwnerMobileCompanyItem[]>(
    isDemoMode ? DEMO_OWNER_COMPANIES : []
  );
  const [projectBriefs, setProjectBriefs] = useState<OwnerMobileProjectBrief[]>(
    isDemoMode ? DEMO_OWNER_PROJECT_BRIEFS : []
  );
  const [incomingRequests, setIncomingRequests] = useState<
    OwnerMobileIncomingCompanyRequest[]
  >(isDemoMode ? DEMO_OWNER_INCOMING_REQUESTS : []);

  useEffect(() => {
    setCompanies(isDemoMode ? DEMO_OWNER_COMPANIES : []);
    setProjectBriefs(isDemoMode ? DEMO_OWNER_PROJECT_BRIEFS : []);
    setIncomingRequests(isDemoMode ? DEMO_OWNER_INCOMING_REQUESTS : []);
    setSelectedCompany(null);
  }, [isDemoMode]);

  const [activeTab, setActiveTab] = useState<'directory' | 'my-briefs' | 'incoming'>(
    'directory'
  );
  const [incomingToast, setIncomingToast] = useState<string | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modals
  const [selectedCompany, setSelectedCompany] = useState<OwnerMobileCompanyItem | null>(
    null
  );
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [briefTargetCompany, setBriefTargetCompany] =
    useState<OwnerMobileCompanyItem | null>(null);
  const [viewingBrief, setViewingBrief] = useState<OwnerMobileProjectBrief | null>(null);

  const [briefTitle, setBriefTitle] = useState('');
  const [briefCategory, setBriefCategory] = useState('Residential');
  const [briefBudget, setBriefBudget] = useState('₦100M - ₦250M');
  const [briefLocation, setBriefLocation] = useState('');
  const [briefDescription, setBriefDescription] = useState('');

  // Invite a Company modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCompanyName, setInviteCompanyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState(false);

  const isFilterActive =
    selectedCategory !== 'All' ||
    selectedState !== 'All States' ||
    onlyVerified ||
    onlyFavorites;

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedState !== 'All States' && c.state !== selectedState) return false;
      if (onlyVerified && !c.isVerified) return false;
      if (onlyFavorites && !c.isFavorite) return false;
      return true;
    });
  }, [companies, selectedCategory, selectedState, onlyVerified, onlyFavorites]);

  const pendingIncomingCount = useMemo(
    () => incomingRequests.filter((r) => r.status === 'Pending Owner Review').length,
    [incomingRequests]
  );

  const handleToggleFavorite = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleOpenBriefModal = (company: OwnerMobileCompanyItem) => {
    setBriefTargetCompany(company);
    setBriefTitle('');
    setBriefCategory(company.category === 'Architecture' ? 'Architecture & Design' : 'Residential');
    setBriefBudget('₦100M - ₦250M');
    setBriefLocation(
      company.state === 'Abuja FCT' ? 'Guzape, Abuja' : 'Lekki Phase 1, Lagos'
    );
    setBriefDescription('');
    setIsBriefModalOpen(true);
  };

  const handleSubmitBrief = () => {
    if (!briefTargetCompany || !briefTitle.trim()) return;
    const newBrief: OwnerMobileProjectBrief = {
      id: `brf-${Date.now()}`,
      companyId: briefTargetCompany.id,
      companyName: briefTargetCompany.name,
      title: briefTitle.trim(),
      category: briefCategory,
      estimatedBudget: briefBudget,
      location: briefLocation.trim() || briefTargetCompany.location,
      status: 'Under Contractor Review',
      dateSubmitted: 'Just now',
      description:
        briefDescription.trim() || 'Project specifications submitted for milestone scoping.',
    };
    setProjectBriefs((prev) => [newBrief, ...prev]);
    setIsBriefModalOpen(false);
    setActiveTab('my-briefs');
  };

  const handleRespondToIncoming = (
    req: OwnerMobileIncomingCompanyRequest,
    decision: 'Accepted' | 'Declined'
  ) => {
    setIncomingRequests((prev) =>
      prev.map((item) => (item.id === req.id ? { ...item, status: decision } : item))
    );
    setIncomingToast(
      decision === 'Accepted'
        ? `Accepted "${req.title}" from ${req.companyName}. Added to Active Projects!`
        : `Declined project request "${req.title}".`
    );
    setTimeout(() => setIncomingToast(null), 3500);
  };

  const handleSendInvite = () => {
    if (!inviteCompanyName.trim() || !inviteEmail.trim()) return;
    setInviteSuccessNotice(true);
    setTimeout(() => {
      setInviteSuccessNotice(false);
      setIsInviteModalOpen(false);
      setInviteCompanyName('');
      setInviteEmail('');
    }, 1200);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
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
        {/* Header & Toolbar */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              {activeTab === 'directory' ? 'Find Companies' : 'My Active Project Requests'}
            </Text>
            <Text style={[styles.subtitle, fontStyle('medium'), { color: palette.textMuted }]}>
              {activeTab === 'directory'
                ? 'Find verified construction companies, architects, and builders with proven track records.'
                : activeTab === 'my-briefs'
                ? 'Builders currently reviewing your project requests. Compare offers and timelines.'
                : 'Project requests sent to you by verified construction companies via Vantaged.'}
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

        {/* View Switcher Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                Companies ({companies.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('my-briefs')}
              style={[
                styles.tabBtn,
                activeTab === 'my-briefs' && { backgroundColor: palette.brandOrange },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  fontStyle('bold'),
                  { color: activeTab === 'my-briefs' ? '#FFFFFF' : palette.textSecondary },
                ]}>
                My Briefs ({projectBriefs.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('incoming')}
              style={[
                styles.tabBtn,
                activeTab === 'incoming' && { backgroundColor: palette.brandOrange },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  fontStyle('bold'),
                  { color: activeTab === 'incoming' ? '#FFFFFF' : palette.textSecondary },
                ]}>
                Company Requests ({pendingIncomingCount})
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Active Filter Pills */}
        {isFilterActive && activeTab === 'directory' && (
          <View style={styles.activeFiltersRow}>
            {selectedCategory !== 'All' && (
              <Pressable
                onPress={() => setSelectedCategory('All')}
                style={[
                  styles.activePill,
                  { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                ]}>
                <Text style={[styles.activePillText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                  {selectedCategory} ×
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

        {activeTab === 'directory' ? (
          /* ── DIRECTORY TAB (2-Column Portrait Rectangle Cards) ── */
          <>
            <View style={styles.sectionMeta}>
              <Text style={[styles.sectionKicker, fontStyle('extrabold'), { color: palette.textMuted }]}>
                REGISTERED COMPANIES ({filteredCompanies.length})
              </Text>
              <Text style={[styles.sectionHint, fontStyle('semibold'), { color: palette.textMuted }]}>
                Tap any card to view profile, licenses & past delivery
              </Text>
            </View>

            {filteredCompanies.length === 0 ? (
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
                  <OwnerNavIcon id="find-companies" color={palette.brandOrange} size={24} />
                </View>
                <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  {companies.length === 0
                    ? 'No Verified Companies Loaded'
                    : 'No Companies Match Filters'}
                </Text>
                <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                  {companies.length === 0
                    ? 'Invite your external contractor to onboard on Vantaged, or switch on Demo Mode to browse sample verified firms.'
                    : 'Try resetting your category or state filters to view registered companies.'}
                </Text>
                <Pressable
                  onPress={() =>
                    companies.length === 0 ? setIsInviteModalOpen(true) : resetFilters()
                  }
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, marginTop: 8 }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    {companies.length === 0 ? '+ Invite a Company' : 'Reset Filters'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.cardsGrid}>
                {filteredCompanies.map((company) => {
                  const isFeatured = !!company.isFeatured;
                  const shortLocation = company.location
                    ? company.location.split(',')[0]
                    : company.state || 'Nigeria';
                  const shortState = company.state
                    ? company.state.split(' ')[0]
                    : 'Nigeria';

                  return (
                    <Pressable
                      key={company.id}
                      onPress={() => setSelectedCompany(company)}
                      style={[
                        styles.companyCard,
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
                      {/* Top Header: Bookmark Heart + Quick Brief (+) */}
                      <View style={styles.cardTopRow}>
                        <Pressable
                          onPress={() => handleToggleFavorite(company.id)}
                          style={[
                            styles.circleIconBtn,
                            {
                              backgroundColor: isFeatured
                                ? 'rgba(255,255,255,0.2)'
                                : company.isFavorite
                                ? palette.brandSoftBg
                                : palette.surfaceSubtle,
                            },
                          ]}>
                          <Svg width={14} height={14} viewBox="0 0 24 24">
                            <Path
                              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                              fill={
                                company.isFavorite
                                  ? isFeatured
                                    ? '#FFFFFF'
                                    : palette.brandOrange
                                  : 'none'
                              }
                              stroke={
                                isFeatured
                                  ? '#FFFFFF'
                                  : company.isFavorite
                                  ? palette.brandOrange
                                  : palette.textMuted
                              }
                              strokeWidth={2}
                            />
                          </Svg>
                        </Pressable>

                        <Pressable
                          onPress={() => handleOpenBriefModal(company)}
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

                      {/* Center Logo Badge & Identity */}
                      <View style={styles.cardCenter}>
                        <View
                          style={[
                            styles.logoBadge,
                            {
                              backgroundColor: isFeatured ? '#FFFFFF' : company.logoBgHex,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.logoInitials,
                              fontStyle('extrabold'),
                              { color: isFeatured ? '#D84C0B' : '#FFFFFF' },
                            ]}>
                            {company.logoInitials}
                          </Text>
                        </View>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.companyName,
                            fontStyle('extrabold'),
                            { color: isFeatured ? '#FFFFFF' : palette.textPrimary },
                          ]}>
                          {company.name}
                        </Text>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.companyCategory,
                            fontStyle('semibold'),
                            {
                              color: isFeatured
                                ? 'rgba(255,255,255,0.85)'
                                : palette.textMuted,
                            },
                          ]}>
                          {company.category} • {shortLocation}
                        </Text>
                      </View>

                      {/* Escrow Track Record Bar */}
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
                            Escrow Track
                          </Text>
                          <Text
                            style={[
                              styles.trackValue,
                              fontStyle('extrabold'),
                              { color: isFeatured ? '#FFFFFF' : palette.brandOrange },
                            ]}>
                            {company.escrowDelivered}
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
                                width: `${company.reliabilityRate}%`,
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
                            {company.rating}
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
                            ({company.completedProjectsCount})
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
        ) : activeTab === 'my-briefs' ? (
          /* ── MY BRIEFS TAB ── */
          <View style={{ gap: 10 }}>
            {projectBriefs.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}>
                <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  No Project Briefs Sent Yet
                </Text>
                <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                  Tap the + button on any verified company card to send a project brief.
                </Text>
              </View>
            ) : (
              projectBriefs.map((brief) => (
                <Pressable
                  key={brief.id}
                  onPress={() => setViewingBrief(brief)}
                  style={[
                    styles.listCard,
                    { backgroundColor: palette.surface, borderColor: palette.border },
                  ]}>
                  <View style={styles.listCardTop}>
                    <Text
                      numberOfLines={1}
                      style={[styles.listCardTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                      {brief.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            brief.status === 'Proposal Ready'
                              ? palette.greenBg
                              : palette.brandSoftBg,
                          borderColor:
                            brief.status === 'Proposal Ready'
                              ? palette.greenBorder
                              : palette.brandSoftBorder,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          fontStyle('bold'),
                          {
                            color:
                              brief.status === 'Proposal Ready'
                                ? palette.greenText
                                : palette.brandSoftText,
                          },
                        ]}>
                        {brief.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.listCardSub, fontStyle('semibold'), { color: palette.textSecondary }]}>
                    {brief.companyName} · {brief.estimatedBudget}
                  </Text>
                  <Text style={[styles.listCardMeta, fontStyle('medium'), { color: palette.textMuted }]}>
                    {brief.location} · Submitted {brief.dateSubmitted}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        ) : (
          /* ── COMPANY REQUESTS TAB ── */
          <View style={{ gap: 10 }}>
            {incomingToast && (
              <View
                style={[
                  styles.noticeBanner,
                  { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                ]}>
                <Text style={[styles.noticeText, fontStyle('bold'), { color: palette.greenText }]}>
                  ✓ {incomingToast}
                </Text>
              </View>
            )}

            {incomingRequests.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}>
                <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  No Incoming Company Requests Yet
                </Text>
                <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                  When a verified construction company sends you a project request, it will appear here for review.
                </Text>
              </View>
            ) : (
              incomingRequests.map((req) => (
                <View
                  key={req.id}
                  style={[
                    styles.listCard,
                    { backgroundColor: palette.surface, borderColor: palette.border },
                  ]}>
                  <View style={styles.listCardTop}>
                    <Text
                      style={[styles.listCardMeta, fontStyle('bold'), { color: palette.textMuted }]}>
                      {req.id} · {req.category}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            req.status === 'Accepted'
                              ? palette.greenBg
                              : palette.brandSoftBg,
                          borderColor:
                            req.status === 'Accepted'
                              ? palette.greenBorder
                              : palette.brandSoftBorder,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          fontStyle('bold'),
                          {
                            color:
                              req.status === 'Accepted'
                                ? palette.greenText
                                : palette.brandSoftText,
                          },
                        ]}>
                        {req.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.listCardTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                    {req.title}
                  </Text>
                  <Text style={[styles.listCardSub, fontStyle('semibold'), { color: palette.textSecondary }]}>
                    From {req.companyName} ({req.directorName}) · {req.budget}
                  </Text>
                  {!!req.notes && (
                    <Text style={[styles.listCardMeta, fontStyle('regular'), { color: palette.textMuted }]}>
                      {req.notes}
                    </Text>
                  )}

                  {req.status === 'Pending Owner Review' && (
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handleRespondToIncoming(req, 'Declined')}
                        style={[
                          styles.secondaryBtn,
                          { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, flex: 1 },
                        ]}>
                        <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                          Decline
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleRespondToIncoming(req, 'Accepted')}
                        style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, flex: 2 }]}>
                        <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                          Accept & Start Project
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Company Profile Detail Modal */}
      {!!selectedCompany && (
      <Modal
        visible={!!selectedCompany}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCompany(null)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            {selectedCompany && (
              <>
                <View style={styles.detailHeader}>
                  <View style={styles.detailHeaderLeft}>
                    <View
                      style={[
                        styles.detailLogo,
                        { backgroundColor: selectedCompany.logoBgHex },
                      ]}>
                      <Text style={[styles.detailLogoText, fontStyle('extrabold')]}>
                        {selectedCompany.logoInitials}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailName, fontStyle('extrabold')]}>
                        {selectedCompany.name}
                      </Text>
                      <Text style={[styles.detailLicense, fontStyle('medium')]}>
                        {selectedCompany.licenseNumber}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setSelectedCompany(null)} style={styles.detailCloseBtn}>
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
                        ESCROW TRACK
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                        {selectedCompany.escrowDelivered}
                      </Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={[styles.statLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                        COMPLETED
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        {selectedCompany.completedProjectsCount} Projects
                      </Text>
                    </View>
                    <View style={styles.statCell}>
                      <Text style={[styles.statLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                        RATING
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        ★ {selectedCompany.rating}
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      COMPANY OVERVIEW
                    </Text>
                    <Text style={[styles.overviewText, fontStyle('regular'), { color: palette.textSecondary }]}>
                      {selectedCompany.tagline}. Licensed with registered structural, geotech and MEP practitioners delivering milestone-verified infrastructure.
                    </Text>
                    <View style={styles.chipGrid}>
                      {selectedCompany.specialties.map((s) => (
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

                  <View
                    style={[
                      styles.directorCard,
                      { borderColor: palette.border },
                    ]}>
                    <Image
                      source={{ uri: selectedCompany.leadDirector.avatar }}
                      style={styles.directorAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.directorName, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        {selectedCompany.leadDirector.name}
                      </Text>
                      <Text style={[styles.directorRole, fontStyle('medium'), { color: palette.textMuted }]}>
                        {selectedCompany.leadDirector.role}
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 6 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      VERIFIED PROJECTS TRACK RECORD
                    </Text>
                    {selectedCompany.recentProjects.map((p, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.recentProjRow,
                          { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                        ]}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.recentProjTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                            {p.title}
                          </Text>
                          <Text style={[styles.recentProjMeta, fontStyle('medium'), { color: palette.textMuted }]}>
                            {p.category} • Completed {p.year}
                          </Text>
                        </View>
                        <Text style={[styles.recentProjAmt, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                          {p.escrowAmount}
                        </Text>
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
                    onPress={() => setSelectedCompany(null)}
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
                      const target = selectedCompany;
                      setSelectedCompany(null);
                      handleOpenBriefModal(target);
                    }}
                    style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                    <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                      Send Project Request →
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      )}

      {/* Send Project Request (Brief) Modal */}
      {isBriefModalOpen && (
      <Modal
        visible={isBriefModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsBriefModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailName, fontStyle('extrabold')]}>
                  Send Project Request
                </Text>
                <Text style={[styles.detailTitle, fontStyle('medium')]}>
                  To: {briefTargetCompany?.name}
                </Text>
              </View>
              <Pressable
                onPress={() => setIsBriefModalOpen(false)}
                style={styles.detailCloseBtn}>
                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={styles.detailBody}>
              <View style={{ gap: 4 }}>
                <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                  PROJECT TITLE *
                </Text>
                <TextInput
                  value={briefTitle}
                  onChangeText={setBriefTitle}
                  placeholder="e.g. 5-Bedroom Waterfront Villa"
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
                  CATEGORY
                </Text>
                <View style={styles.chipGrid}>
                  {BRIEF_CATEGORIES.map((cat) => {
                    const active = briefCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setBriefCategory(cat)}
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
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={{ gap: 6 }}>
                <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                  ESTIMATED BUDGET
                </Text>
                <View style={styles.chipGrid}>
                  {BRIEF_BUDGETS.map((b) => {
                    const active = briefBudget === b;
                    return (
                      <Pressable
                        key={b}
                        onPress={() => setBriefBudget(b)}
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
                          {b}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={{ gap: 4 }}>
                <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                  SITE LOCATION
                </Text>
                <TextInput
                  value={briefLocation}
                  onChangeText={setBriefLocation}
                  placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1"
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
                  BRIEF SCOPE DESCRIPTION
                </Text>
                <TextInput
                  value={briefDescription}
                  onChangeText={setBriefDescription}
                  multiline
                  numberOfLines={3}
                  placeholder="Summarize core requirements, drawing status, or milestone expectations..."
                  placeholderTextColor={palette.textMuted}
                  style={[
                    styles.textArea,
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
                  onPress={() => setIsBriefModalOpen(false)}
                  style={[
                    styles.secondaryBtn,
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                  ]}>
                  <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmitBrief}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    Submit Project Brief →
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      )}

      {/* Brief Detail Modal (Matching Web View Project Brief Details Modal) */}
      {!!viewingBrief && (
      <Modal
        visible={!!viewingBrief}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingBrief(null)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            {viewingBrief && (
              <>
                <View style={styles.detailHeader}>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={[styles.detailName, fontStyle('extrabold')]}>
                      {viewingBrief.title}
                    </Text>
                    <Text style={[styles.detailTitle, fontStyle('medium')]}>
                      Submitted to {viewingBrief.companyName} • {viewingBrief.dateSubmitted}
                    </Text>
                  </View>
                  <Pressable onPress={() => setViewingBrief(null)} style={styles.detailCloseBtn}>
                    <Text style={{ color: '#FFFFFF', fontSize: 15 }}>✕</Text>
                  </Pressable>
                </View>

                <View style={styles.detailBody}>
                  <View
                    style={[
                      styles.statsBar,
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                    ]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.statLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                        ESTIMATED BUDGET
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                        {viewingBrief.estimatedBudget}
                      </Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.statLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                        CURRENT STATUS
                      </Text>
                      <Text style={[styles.statVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        {viewingBrief.status}
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 4 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      SITE LOCATION
                    </Text>
                    <Text style={[styles.directorName, fontStyle('semibold'), { color: palette.textPrimary }]}>
                      {viewingBrief.location}
                    </Text>
                  </View>

                  <View style={{ gap: 4 }}>
                    <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                      SCOPE OF WORK DESCRIPTION
                    </Text>
                    <View
                      style={[
                        styles.recentProjRow,
                        { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                      ]}>
                      <Text style={[styles.overviewText, fontStyle('regular'), { color: palette.textSecondary }]}>
                        {viewingBrief.description}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.detailFooter,
                    { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border },
                  ]}>
                  <Pressable
                    onPress={() => setViewingBrief(null)}
                    style={[
                      styles.secondaryBtn,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                      Close
                    </Text>
                  </Pressable>
                  {viewingBrief.status === 'Proposal Ready' && (
                    <Pressable
                      onPress={() => setViewingBrief(null)}
                      style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                      <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                        Review Plan & Contract →
                      </Text>
                    </Pressable>
                  )}
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
                Filter Companies
              </Text>
              <Pressable onPress={() => setIsFilterModalOpen(false)}>
                <Text style={{ color: palette.textMuted, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>

            <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
              SPECIALTY CATEGORY
            </Text>
            <View style={styles.chipGrid}>
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
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
                      {cat}
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
                Verified Firms Only
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
                Bookmarked Firms Only
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

      {/* Invite a Company Modal */}
      {isInviteModalOpen && (
      <Modal
        visible={isInviteModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsInviteModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.detailModalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailName, fontStyle('extrabold')]}>
                  Invite a Company
                </Text>
                <Text style={[styles.detailTitle, fontStyle('medium')]}>
                  Invite your external contractor to onboard on Vantaged
                </Text>
              </View>
              <Pressable
                onPress={() => setIsInviteModalOpen(false)}
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
                    ✓ Onboarding invite sent to {inviteCompanyName} ({inviteEmail}).
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.detailBody}>
                <View style={{ gap: 4 }}>
                  <Text style={[styles.sectionLabel, fontStyle('extrabold'), { color: palette.textMuted }]}>
                    COMPANY NAME *
                  </Text>
                  <TextInput
                    value={inviteCompanyName}
                    onChangeText={setInviteCompanyName}
                    placeholder="e.g. Apex Structural Builders Ltd"
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
                    DIRECTOR / CONTACT EMAIL *
                  </Text>
                  <TextInput
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="director@contractor.ng"
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
                    onPress={() => setIsInviteModalOpen(false)}
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
                      Send Onboarding Invite →
                    </Text>
                  </Pressable>
                </View>
              </View>
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
  tabBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
  },
  tabText: { fontSize: 11.5 },
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
  companyCard: {
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
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoInitials: { fontSize: 17 },
  companyName: { fontSize: 13.5, textAlign: 'center' },
  companyCategory: { fontSize: 10.5, marginTop: 2, textAlign: 'center' },
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
  listCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  listCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  listCardTitle: { fontSize: 14.5, flex: 1 },
  listCardSub: { fontSize: 12 },
  listCardMeta: { fontSize: 11, lineHeight: 16 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusBadgeText: { fontSize: 10 },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  noticeBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  noticeText: { fontSize: 12, lineHeight: 17 },
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
  detailLogo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLogoText: { color: '#FFFFFF', fontSize: 16 },
  detailName: { color: '#FFFFFF', fontSize: 16 },
  detailTitle: { color: '#D5D2EF', fontSize: 11.5, marginTop: 1 },
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
  directorCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  directorAvatar: { width: 42, height: 42, borderRadius: 21 },
  directorName: { fontSize: 13 },
  directorRole: { fontSize: 11, marginTop: 1 },
  recentProjRow: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  recentProjTitle: { fontSize: 12 },
  recentProjMeta: { fontSize: 10.5, marginTop: 1 },
  recentProjAmt: { fontSize: 11.5 },
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
  modalTitle: { fontSize: 16, flex: 1 },
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
  textArea: {
    minHeight: 78,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
});

export default OwnerFindCompaniesPage;
