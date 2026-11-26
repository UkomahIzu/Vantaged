import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';

type SettingsTab = 'profile' | 'subscription' | 'security' | 'escrow' | 'notifications';
type TierId = 'owner-private' | 'owner-portfolio' | 'owner-estate';

const TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: 'profile', label: 'Profile & Account' },
  { id: 'subscription', label: 'Subscription & Capacity' },
  { id: 'security', label: 'Security & Password' },
  { id: 'escrow', label: 'Escrow & Banking' },
  { id: 'notifications', label: 'Notifications & Alerts' },
];

const PRICING_TIERS: Array<{
  id: TierId;
  name: string;
  kicker: string;
  capacitySlots: number;
  priceMonthlyNGN: string;
  priceYearlyNGN: string;
  subtext: string;
  features: string[];
}> = [
  {
    id: 'owner-private',
    name: 'Private Owner',
    kicker: 'Single-Home Builder',
    capacitySlots: 1,
    priceMonthlyNGN: '₦0',
    priceYearlyNGN: '₦0',
    subtext:
      'For private individuals building a personal home, duplex, or single residential villa.',
    features: [
      '1 active construction site slot',
      'Escrow vault & milestone approvals',
      'Geofenced photo & video logs',
    ],
  },
  {
    id: 'owner-portfolio',
    name: 'Portfolio Investor',
    kicker: 'Multi-Build Portfolio',
    capacitySlots: 3,
    priceMonthlyNGN: '₦65,000',
    priceYearlyNGN: '₦650,000',
    subtext:
      'For investors building multiple residences, rentals, or family portfolios simultaneously.',
    features: [
      '3 concurrent construction site slots',
      'Client representative delegation',
      'Priority COREN inspector dispatch',
    ],
  },
  {
    id: 'owner-estate',
    name: 'Estate Developer',
    kicker: 'Large-Scale Portfolios',
    capacitySlots: 10,
    priceMonthlyNGN: '₦200,000',
    priceYearlyNGN: '₦2,000,000',
    subtext:
      'For estate developers, institutional syndicates, and high-volume residential communities.',
    features: [
      '10 concurrent construction site slots',
      'Multi-tier permissions & site dispatch',
      'Dedicated commercial QS audit trail',
    ],
  },
];

const REGIONS = [
  'Lagos State, Nigeria',
  'Abuja FCT, Nigeria',
  'Rivers State (Port Harcourt), Nigeria',
  'Oyo State (Ibadan), Nigeria',
] as const;

const BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank Plc',
  'Access Bank Plc',
  'United Bank for Africa (UBA)',
  'First Bank of Nigeria',
] as const;

export function OwnerSettingsPage() {
  const { user, palette, theme, toggleTheme, isDemoMode, toggleDemoMode } =
    useOwnerMobile();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile State
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [stateRegion, setStateRegion] = useState<string>(REGIONS[0]);
  const [entityName, setEntityName] = useState('Robinson Prime Holdings Ltd');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  // Subscription & Capacity State
  const [currentTier, setCurrentTier] = useState<TierId>('owner-private');
  const [extraSlotsCount, setExtraSlotsCount] = useState(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [buySlotsInput, setBuySlotsInput] = useState(1);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Escrow & Banking State
  const [bankName, setBankName] = useState<string>(BANKS[0]);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('Robinson Prime Holdings Ltd');

  // Notifications State
  const [notifyMilestonesPush, setNotifyMilestonesPush] = useState(true);
  const [notifyMilestonesEmail, setNotifyMilestonesEmail] = useState(true);
  const [notifyEscrowPush, setNotifyEscrowPush] = useState(true);
  const [notifyEscrowEmail, setNotifyEscrowEmail] = useState(true);
  const [notifyEscrowSms, setNotifyEscrowSms] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);
  const [notifyQuietHours, setNotifyQuietHours] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const baseSlots =
    currentTier === 'owner-private' ? 1 : currentTier === 'owner-portfolio' ? 3 : 10;
  const totalSlots = baseSlots + extraSlotsCount;
  const usedSlots = isDemoMode ? 3 : 0;
  const remainingSlots = Math.max(0, totalSlots - usedSlots);

  const activeTierObj = useMemo(
    () => PRICING_TIERS.find((t) => t.id === currentTier) || PRICING_TIERS[0],
    [currentTier]
  );

  const initials = useMemo(() => {
    const parts = (fullName || 'OA').trim().split(/\s+/);
    return parts
      .map((n) => n[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [fullName]);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textSecondary }]}>
            Manage your personal profile, security credentials, escrow banking, and alert preferences.
          </Text>

          {toastMessage && (
            <View
              style={[
                styles.toastBanner,
                { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
              ]}>
              <Text style={[styles.toastText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                ✓ {toastMessage}
              </Text>
            </View>
          )}
        </View>

        {/* Horizontal Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabRow, { borderBottomColor: palette.border }]}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tabItem,
                  {
                    borderBottomColor: active ? palette.brandOrange : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.tabText,
                    fontStyle(active ? 'bold' : 'semibold'),
                    { color: active ? palette.textPrimary : palette.textMuted },
                  ]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── TAB 1: PROFILE & ACCOUNT ── */}
        {activeTab === 'profile' && (
          <View style={{ gap: 14 }}>
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={[styles.cardHead, { backgroundColor: palette.surfaceSubtle, borderBottomColor: palette.border }]}>
                <Text style={[styles.cardHeadTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Personal Information
                </Text>
                <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Your name and contact details across project correspondence and site manifests.
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.avatarRow}>
                  <View style={styles.indigoAvatar}>
                    <Text style={[styles.indigoAvatarText, fontStyle('extrabold')]}>
                      {initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={styles.nameBadgeRow}>
                      <Text style={[styles.profileName, fontStyle('bold'), { color: palette.textPrimary }]}>
                        {fullName}
                      </Text>
                      <View
                        style={[
                          styles.rolePill,
                          { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                        ]}>
                        <Text style={[styles.rolePillText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                          {user.role}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                      Verified Project Sponsor Account
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Full Name
                  </Text>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Email Address
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Phone Number
                  </Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Primary Region / State
                  </Text>
                  <Pressable
                    onPress={() => setIsRegionOpen((p) => !p)}
                    style={[
                      styles.dropdownTrigger,
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.dropdownText, fontStyle('medium'), { color: palette.textPrimary }]}>
                      {stateRegion}
                    </Text>
                    <Text style={{ color: palette.textMuted, fontSize: 11 }}>
                      {isRegionOpen ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {isRegionOpen && (
                    <View style={[styles.dropdownMenu, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                      {REGIONS.map((reg, idx) => (
                        <Pressable
                          key={reg}
                          onPress={() => {
                            setStateRegion(reg);
                            setIsRegionOpen(false);
                          }}
                          style={[
                            styles.dropdownOption,
                            idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                            stateRegion === reg && { backgroundColor: palette.brandSoftBg },
                          ]}>
                          <Text style={[styles.dropdownText, fontStyle('medium'), { color: palette.textPrimary }]}>
                            {reg}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Entity & Currency */}
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={[styles.cardHead, { backgroundColor: palette.surfaceSubtle, borderBottomColor: palette.border }]}>
                <Text style={[styles.cardHeadTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Entity & Currency
                </Text>
                <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Corporate entity name and valuation currency for BOQs and escrow statements.
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Entity / Holding Name
                  </Text>
                  <TextInput
                    value={entityName}
                    onChangeText={setEntityName}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>

                <View style={{ gap: 6 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Portfolio Currency
                  </Text>
                  <View style={styles.currencyRow}>
                    {(['NGN', 'USD'] as const).map((c) => {
                      const active = currency === c;
                      return (
                        <Pressable
                          key={c}
                          onPress={() => setCurrency(c)}
                          style={[
                            styles.currencyChip,
                            {
                              backgroundColor: active ? palette.brandSoftBg : palette.surfaceSubtle,
                              borderColor: active ? palette.brandOrange : palette.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.currencyText,
                              fontStyle('bold'),
                              { color: active ? palette.brandSoftText : palette.textSecondary },
                            ]}>
                            {c === 'NGN' ? 'Nigerian Naira (₦ - NGN)' : 'US Dollar ($ - USD)'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>

              <View style={[styles.cardFoot, { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border }]}>
                <Pressable
                  onPress={() => showToast('Profile details updated successfully.')}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Save Changes</Text>
                </Pressable>
              </View>
            </View>

            {/* Mobile Workspace Toggles */}
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={styles.cardBody}>
                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                      Dark Mode
                    </Text>
                    <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                      Switch between Vantaged Light and Deep Indigo Dark themes
                    </Text>
                  </View>
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: palette.border, true: palette.brandOrange }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: palette.border }]} />

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                      Demo Data Mode
                    </Text>
                    <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                      Preview sample Nigerian builds, escrow ledger, and milestone alerts
                    </Text>
                  </View>
                  <Switch
                    value={isDemoMode}
                    onValueChange={toggleDemoMode}
                    trackColor={{ false: palette.border, true: palette.brandOrange }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 2: SUBSCRIPTION & CAPACITY ── */}
        {activeTab === 'subscription' && (
          <View style={{ gap: 14 }}>
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={styles.cardBody}>
                <View style={styles.subTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardHeadTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                      Active Subscription & Capacity
                    </Text>
                    <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                      Monitor active construction site slots and expand capacity anytime.
                    </Text>
                  </View>
                </View>

                {/* Billing Switcher */}
                <View style={[styles.billingSwitch, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                  {(['monthly', 'yearly'] as const).map((cycle) => {
                    const active = billingCycle === cycle;
                    return (
                      <Pressable
                        key={cycle}
                        onPress={() => setBillingCycle(cycle)}
                        style={[
                          styles.billingBtn,
                          active && { backgroundColor: palette.surface },
                        ]}>
                        <Text
                          style={[
                            styles.billingText,
                            fontStyle(active ? 'bold' : 'semibold'),
                            { color: active ? palette.textPrimary : palette.textMuted },
                          ]}>
                          {cycle === 'monthly' ? 'Monthly' : 'Yearly (Save 17%)'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Capacity KPIs */}
                <View style={styles.kpiRow}>
                  <View style={[styles.kpiBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                    <Text style={[styles.kpiLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                      ACTIVE TIER
                    </Text>
                    <Text style={[styles.kpiVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                      {activeTierObj.name}
                    </Text>
                    <Text style={[styles.kpiSub, fontStyle('semibold'), { color: palette.brandOrange }]}>
                      {billingCycle === 'monthly'
                        ? activeTierObj.priceMonthlyNGN
                        : activeTierObj.priceYearlyNGN}
                    </Text>
                  </View>

                  <View style={[styles.kpiBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                    <Text style={[styles.kpiLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                      CAPACITY
                    </Text>
                    <Text style={[styles.kpiVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                      {totalSlots} Sites
                    </Text>
                    <Text style={[styles.kpiSub, fontStyle('medium'), { color: palette.textMuted }]}>
                      {remainingSlots} free
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Pricing Tiers */}
            {PRICING_TIERS.map((tier) => {
              const isCurrent = currentTier === tier.id;
              return (
                <View
                  key={tier.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: palette.surface,
                      borderColor: isCurrent ? palette.brandOrange : palette.border,
                      borderWidth: isCurrent ? 2 : 1,
                    },
                  ]}>
                  <View style={styles.cardBody}>
                    <View style={styles.tierHeader}>
                      <View>
                        <Text style={[styles.tierKicker, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                          {tier.kicker.toUpperCase()}
                        </Text>
                        <Text style={[styles.tierName, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                          {tier.name}
                        </Text>
                      </View>
                      <Text style={[styles.tierPrice, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                        {billingCycle === 'monthly' ? tier.priceMonthlyNGN : tier.priceYearlyNGN}
                      </Text>
                    </View>

                    <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textSecondary }]}>
                      {tier.subtext}
                    </Text>

                    <View style={{ gap: 4 }}>
                      {tier.features.map((f) => (
                        <Text key={f} style={[styles.featureItem, fontStyle('semibold'), { color: palette.textPrimary }]}>
                          ✓ {f}
                        </Text>
                      ))}
                    </View>

                    {isCurrent ? (
                      <View
                        style={[
                          styles.activePlanBadge,
                          { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                        ]}>
                        <Text style={[styles.activePlanText, fontStyle('bold'), { color: palette.brandSoftText }]}>
                          ✓ Current Active Plan
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => {
                          setCurrentTier(tier.id);
                          showToast(`Switched to ${tier.name} plan.`);
                        }}
                        style={[styles.primaryBtn, { backgroundColor: '#261A66' }]}>
                        <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                          Switch to {tier.name} →
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Buy Extra Project Slots */}
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={[styles.cardHead, { backgroundColor: palette.surfaceSubtle, borderBottomColor: palette.border }]}>
                <Text style={[styles.cardHeadTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  Buy Extra Project Slots (À La Carte)
                </Text>
                <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  +₦25,000 / month per extra slot without jumping tiers.
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.slotStepperRow}>
                  <Pressable
                    onPress={() => setBuySlotsInput((p) => Math.max(1, p - 1))}
                    style={[styles.stepBtn, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                    <Text style={[styles.stepSign, { color: palette.textPrimary }]}>−</Text>
                  </Pressable>
                  <Text style={[styles.stepVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                    {buySlotsInput} slot{buySlotsInput > 1 ? 's' : ''}
                  </Text>
                  <Pressable
                    onPress={() => setBuySlotsInput((p) => Math.min(50, p + 1))}
                    style={[styles.stepBtn, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                    <Text style={[styles.stepSign, { color: palette.textPrimary }]}>+</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => {
                    setExtraSlotsCount((p) => p + buySlotsInput);
                    showToast(`Added ${buySlotsInput} extra project slot(s).`);
                  }}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                    Buy {buySlotsInput} Project Slot{buySlotsInput > 1 ? 's' : ''} (₦
                    {(buySlotsInput * 25000).toLocaleString('en-NG')})
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 3: SECURITY & PASSWORD ── */}
        {activeTab === 'security' && (
          <View style={{ gap: 14 }}>
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={[styles.cardHead, { backgroundColor: palette.surfaceSubtle, borderBottomColor: palette.border }]}>
                <Text style={[styles.cardHeadTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Change Password
                </Text>
                <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Ensure your account is protected with a strong, distinct password.
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Current Password
                  </Text>
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    placeholder="••••••••••••"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    New Password
                  </Text>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder="At least 8 characters"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Confirm New Password
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Repeat new password"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('medium'),
                      { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.cardFoot, { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border }]}>
                <Pressable
                  onPress={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    showToast('Security and password settings saved.');
                  }}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Update Password</Text>
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={styles.cardBody}>
                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                      Two-Factor Authentication (2FA)
                    </Text>
                    <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                      Require an SMS OTP code or authenticator token before escrow disbursements.
                    </Text>
                  </View>
                  <Switch
                    value={is2FAEnabled}
                    onValueChange={setIs2FAEnabled}
                    trackColor={{ false: palette.border, true: palette.brandOrange }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 4: ESCROW & BANKING ── */}
        {activeTab === 'escrow' && (
          <View
            style={[
              styles.card,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={[styles.cardHead, { backgroundColor: palette.surfaceSubtle, borderBottomColor: palette.border }]}>
              <View style={styles.bankHeadRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardHeadTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Settlement & Refund Bank Account
                  </Text>
                  <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                    Verified NUBAN commercial bank account for unspent escrow refunds.
                  </Text>
                </View>
                <View style={[styles.verifiedChip, { backgroundColor: palette.greenBg }]}>
                  <Text style={[styles.verifiedChipText, fontStyle('bold'), { color: palette.greenText }]}>
                    ✓ NUBAN Verified
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={{ gap: 4 }}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Bank Name
                </Text>
                <Pressable
                  onPress={() => setIsBankOpen((p) => !p)}
                  style={[
                    styles.dropdownTrigger,
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                  ]}>
                  <Text style={[styles.dropdownText, fontStyle('medium'), { color: palette.textPrimary }]}>
                    {bankName}
                  </Text>
                  <Text style={{ color: palette.textMuted, fontSize: 11 }}>
                    {isBankOpen ? '▲' : '▼'}
                  </Text>
                </Pressable>
                {isBankOpen && (
                  <View style={[styles.dropdownMenu, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                    {BANKS.map((b, idx) => (
                      <Pressable
                        key={b}
                        onPress={() => {
                          setBankName(b);
                          setIsBankOpen(false);
                        }}
                        style={[
                          styles.dropdownOption,
                          idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                          bankName === b && { backgroundColor: palette.brandSoftBg },
                        ]}>
                        <Text style={[styles.dropdownText, fontStyle('medium'), { color: palette.textPrimary }]}>
                          {b}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={{ gap: 4 }}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  NUBAN Account Number
                </Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  maxLength={10}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    fontStyle('bold'),
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                  ]}
                />
              </View>

              <View style={{ gap: 4 }}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Account Beneficiary Name
                </Text>
                <TextInput
                  value={accountName}
                  onChangeText={setAccountName}
                  style={[
                    styles.input,
                    fontStyle('medium'),
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border, color: palette.textPrimary },
                  ]}
                />
              </View>
            </View>

            <View style={[styles.cardFoot, { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border }]}>
              <Pressable
                onPress={() => showToast('Escrow settlement bank account saved.')}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                  Save Settlement Account
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── TAB 5: NOTIFICATIONS & ALERTS ── */}
        {activeTab === 'notifications' && (
          <View
            style={[
              styles.card,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={[styles.cardHead, { backgroundColor: palette.surfaceSubtle, borderBottomColor: palette.border }]}>
              <Text style={[styles.cardHeadTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                Notification Channels
              </Text>
              <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Select your preferred alert channels and notification frequency.
              </Text>
            </View>

            <View style={styles.cardBody}>
              <View style={[styles.prefBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Stage Inspections & Proof Uploads
                </Text>
                <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Triggered whenever a contractor marks a stage ready for client sign-off.
                </Text>
                <View style={styles.channelRow}>
                  <View style={styles.channelItem}>
                    <Text style={[styles.channelText, fontStyle('semibold'), { color: palette.textSecondary }]}>Push</Text>
                    <Switch
                      value={notifyMilestonesPush}
                      onValueChange={setNotifyMilestonesPush}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.channelItem}>
                    <Text style={[styles.channelText, fontStyle('semibold'), { color: palette.textSecondary }]}>Email</Text>
                    <Switch
                      value={notifyMilestonesEmail}
                      onValueChange={setNotifyMilestonesEmail}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.prefBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Escrow Vault Deposits & Releases
                </Text>
                <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Tranche locks, contract sign-offs, and verified payouts.
                </Text>
                <View style={styles.channelRow}>
                  <View style={styles.channelItem}>
                    <Text style={[styles.channelText, fontStyle('semibold'), { color: palette.textSecondary }]}>Push</Text>
                    <Switch
                      value={notifyEscrowPush}
                      onValueChange={setNotifyEscrowPush}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.channelItem}>
                    <Text style={[styles.channelText, fontStyle('semibold'), { color: palette.textSecondary }]}>Email</Text>
                    <Switch
                      value={notifyEscrowEmail}
                      onValueChange={setNotifyEscrowEmail}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.channelItem}>
                    <Text style={[styles.channelText, fontStyle('semibold'), { color: palette.textSecondary }]}>SMS</Text>
                    <Switch
                      value={notifyEscrowSms}
                      onValueChange={setNotifyEscrowSms}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.prefSwitchCard, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Daily Portfolio Summary Digest
                  </Text>
                  <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                    Consolidated evening brief of all daily telemetry and site waybills.
                  </Text>
                </View>
                <Switch
                  value={notifyDailyDigest}
                  onValueChange={setNotifyDailyDigest}
                  trackColor={{ false: palette.border, true: palette.brandOrange }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.prefSwitchCard, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Quiet Hours (10:00 PM – 7:00 AM)
                  </Text>
                  <Text style={[styles.cardHeadSub, fontStyle('regular'), { color: palette.textMuted }]}>
                    Mute non-critical audio push notifications during the night.
                  </Text>
                </View>
                <Switch
                  value={notifyQuietHours}
                  onValueChange={setNotifyQuietHours}
                  trackColor={{ false: palette.border, true: palette.brandOrange }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={[styles.cardFoot, { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border }]}>
              <Pressable
                onPress={() => showToast('Notification channel preferences updated.')}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Save Preferences</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 28, gap: 14 },
  headerBlock: { gap: 4 },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, lineHeight: 18 },
  toastBanner: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  toastText: { fontSize: 12 },
  tabRow: {
    gap: 18,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  tabItem: {
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  tabText: { fontSize: 13 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHead: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 2,
  },
  cardHeadTitle: { fontSize: 14.5 },
  cardHeadSub: { fontSize: 11.5, lineHeight: 16 },
  cardBody: { padding: 16, gap: 14 },
  cardFoot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  indigoAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#261A66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indigoAvatarText: { color: '#FFFFFF', fontSize: 17 },
  nameBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  profileName: { fontSize: 14.5 },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  rolePillText: { fontSize: 10 },
  fieldLabel: { fontSize: 12.5 },
  input: {
    height: 40,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  dropdownTrigger: {
    height: 40,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: { fontSize: 12.5 },
  dropdownMenu: {
    borderRadius: 9,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownOption: { paddingHorizontal: 12, paddingVertical: 10 },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  currencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
  },
  currencyText: { fontSize: 11.5 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  divider: { height: 1 },
  primaryBtn: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 12.5 },
  subTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  billingSwitch: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  billingBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 7,
    alignItems: 'center',
  },
  billingText: { fontSize: 12 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 2,
  },
  kpiLabel: { fontSize: 9.5, letterSpacing: 0.5 },
  kpiVal: { fontSize: 15 },
  kpiSub: { fontSize: 11 },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  tierKicker: { fontSize: 10, letterSpacing: 0.5 },
  tierName: { fontSize: 16 },
  tierPrice: { fontSize: 17 },
  featureItem: { fontSize: 12 },
  activePlanBadge: {
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePlanText: { fontSize: 12.5 },
  slotStepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSign: { fontSize: 16, fontWeight: '700' },
  stepVal: { fontSize: 14 },
  bankHeadRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  verifiedChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  verifiedChipText: { fontSize: 10.5 },
  prefBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  channelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 4 },
  channelItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  channelText: { fontSize: 11.5 },
  prefSwitchCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default OwnerSettingsPage;
