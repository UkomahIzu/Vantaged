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
import { useRouter } from 'expo-router';
import Svg, { Line, Path, Polyline } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { OwnerNavIcon } from '../components/OwnerIcons';

export interface OwnerMobileNotification {
  id: string;
  category: 'inspection' | 'escrow' | 'site';
  projectTitle: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
}

const INITIAL_NOTIFICATIONS: OwnerMobileNotification[] = [
  {
    id: 'notif-1',
    category: 'inspection',
    projectTitle: 'Lekki Phase 1 Luxury Villa',
    title: 'Stage 2 first floor decking is ready for review',
    description:
      'Julius B. Consortium submitted photos for the first floor decking. Engr. Adeleke confirmed concrete strength test passed.',
    timestamp: 'Today, 08:40',
    isUnread: true,
  },
  {
    id: 'notif-2',
    category: 'escrow',
    projectTitle: 'The Enclave Waterfront Resort',
    title: 'Escrow deposit confirmed for Shoreline Piling',
    description:
      '₦48,500,000 safely deposited in escrow for Stage 2. Your money stays protected until you approve the inspection.',
    timestamp: 'Today, 09:12',
    isUnread: true,
  },
  {
    id: 'notif-3',
    category: 'site',
    projectTitle: 'Banana Island Horizon Penthouse',
    title: 'Drone photos & site walkthrough uploaded',
    description:
      'Site cameras and drone uploaded clear new photos and a video walkthrough of your building.',
    timestamp: 'Today, 09:40',
    isUnread: true,
  },
  {
    id: 'notif-4',
    category: 'inspection',
    projectTitle: 'Guzape Hills Residence',
    title: 'Plumbing pipes water test passed',
    description:
      'Engr. Emeka Uche tested all underfloor plumbing pipes for 24 hours with zero leaks.',
    timestamp: 'Yesterday, 16:40',
    isUnread: false,
  },
  {
    id: 'notif-5',
    category: 'site',
    projectTitle: 'Lekki Phase 1 Luxury Villa',
    title: 'Site delivery confirmed: 600 Bags of Dangote Cement',
    description: 'Gate pass #WP-2092 confirmed. Delivery slip and receipt signed on site.',
    timestamp: 'Oct 10, 14:15',
    isUnread: false,
  },
  {
    id: 'notif-6',
    category: 'escrow',
    projectTitle: 'Lekki Phase 1 Luxury Villa',
    title: 'Foundation milestone payment sent to builder',
    description:
      '₦32,800,000 released to builder after you approved the foundation inspection. Receipt generated.',
    timestamp: 'Oct 09, 11:30',
    isUnread: false,
  },
  {
    id: 'notif-7',
    category: 'inspection',
    projectTitle: 'Banana Island Horizon Penthouse',
    title: 'Terrace soundproofing inspection passed',
    description:
      'Arc. Amina Yusuf inspected soundproofing insulation across upper bedroom terraces.',
    timestamp: 'Oct 07, 15:20',
    isUnread: false,
  },
  {
    id: 'notif-8',
    category: 'escrow',
    projectTitle: 'Guzape Hills Residence',
    title: 'Building plan adjustment reviewed',
    description:
      'Quantity surveyor Femi Oladipo approved builder request for upgraded anti-crack wall mesh (+₦1.2M).',
    timestamp: 'Oct 05, 13:10',
    isUnread: false,
  },
];

export function OwnerNotificationsPage() {
  const router = useRouter();
  const { palette, isDemoMode } = useOwnerMobile();

  const [notifications, setNotifications] = useState<OwnerMobileNotification[]>(
    isDemoMode ? INITIAL_NOTIFICATIONS : []
  );

  useEffect(() => {
    setNotifications(isDemoMode ? INITIAL_NOTIFICATIONS : []);
    setSelectedProofPreview(null);
  }, [isDemoMode]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedProofPreview, setSelectedProofPreview] =
    useState<OwnerMobileNotification | null>(null);

  const [settings, setSettings] = useState({
    pushMilestones: true,
    emailMilestones: true,
    pushEscrow: true,
    emailEscrow: true,
    smsEscrow: true,
    dailyDigest: true,
    quietHours: true,
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleMarkSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header Row (Matching Web OwnerNotificationsPage) */}
        <View style={styles.headerBlock}>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Notifications
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textSecondary }]}>
            Everything across your projects, milestone inspections, and escrow vaults, in one place.
          </Text>

          <View style={styles.headerActions}>
            <Pressable onPress={() => setIsSettingsModalOpen(true)}>
              <Text style={[styles.prefLink, fontStyle('semibold'), { color: palette.textMuted }]}>
                Preferences
              </Text>
            </Pressable>

            {unreadCount > 0 && (
              <Pressable onPress={handleMarkAllAsRead}>
                <Text style={[styles.markAllLink, fontStyle('bold'), { color: palette.brandOrange }]}>
                  Mark all as read
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Unified Notification Card */}
        <View
          style={[
            styles.unifiedCard,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          {notifications.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                ]}>
                <OwnerNavIcon id="notifications" color={palette.brandOrange} size={24} />
              </View>
              <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                All Caught Up!
              </Text>
              <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                You have no unread notifications. When your contractor requests a milestone sign-off, uploads concrete test results, or releases escrow payments, you will receive real-time alerts here.
              </Text>
              <Pressable
                onPress={() => router.replace('/dashboard')}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, marginTop: 14 }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                  Return to Dashboard
                </Text>
              </Pressable>
            </View>
          ) : (
            notifications.map((item, idx) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (item.category === 'inspection') {
                    setSelectedProofPreview(item);
                  }
                  if (item.isUnread) {
                    handleMarkSingleAsRead(item.id);
                  }
                }}
                style={[
                  styles.notifRow,
                  idx > 0 && { borderTopWidth: 1, borderTopColor: palette.border },
                  !item.isUnread && { opacity: 0.92 },
                ]}>
                {/* Left: Document Outline Icon */}
                <View style={styles.docIconWrap}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      stroke={item.isUnread ? palette.brandOrange : palette.textMuted}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Polyline
                      points="14 2 14 8 20 8"
                      stroke={item.isUnread ? palette.brandOrange : palette.textMuted}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Line
                      x1="16"
                      y1="13"
                      x2="8"
                      y2="13"
                      stroke={item.isUnread ? palette.brandOrange : palette.textMuted}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                    <Line
                      x1="16"
                      y1="17"
                      x2="8"
                      y2="17"
                      stroke={item.isUnread ? palette.brandOrange : palette.textMuted}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>

                {/* Middle: Title & Description */}
                <View style={styles.notifBody}>
                  <Text
                    style={[
                      styles.notifTitle,
                      fontStyle('bold'),
                      { color: palette.textPrimary },
                    ]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.notifDesc,
                      fontStyle('regular'),
                      { color: palette.textSecondary },
                    ]}>
                    {item.description}
                  </Text>
                  <View style={styles.notifMetaRow}>
                    <Text
                      style={[
                        styles.notifTime,
                        fontStyle('medium'),
                        { color: palette.textMuted },
                      ]}>
                      {item.timestamp}
                    </Text>
                    {item.isUnread && (
                      <View
                        style={[
                          styles.unreadDot,
                          { backgroundColor: palette.brandOrange },
                        ]}
                      />
                    )}
                  </View>
                </View>

                {/* Right: Dismiss Button */}
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  hitSlop={8}
                  style={styles.dismissBtn}>
                  <Text style={{ color: palette.textMuted, fontSize: 13 }}>✕</Text>
                </Pressable>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Notification Preferences Modal */}
      {isSettingsModalOpen && (
      <Modal
        visible={isSettingsModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSettingsModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={[styles.modalHeader, { borderBottomColor: palette.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  Notification Preferences
                </Text>
                <Text style={[styles.modalSub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Choose which alerts to receive across Push, Email, and SMS.
                </Text>
              </View>
              <Pressable onPress={() => setIsSettingsModalOpen(false)}>
                <Text style={{ color: palette.textMuted, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View
                style={[
                  styles.prefBox,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <View style={styles.prefHeader}>
                  <Text style={[styles.prefName, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Stage Reviews & Proof
                  </Text>
                  <Text style={[styles.prefHint, fontStyle('regular'), { color: palette.textMuted }]}>
                    Contractor milestone readiness
                  </Text>
                </View>
                <View style={styles.prefToggles}>
                  <View style={styles.toggleItem}>
                    <Text style={[styles.toggleLabel, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      Push
                    </Text>
                    <Switch
                      value={settings.pushMilestones}
                      onValueChange={(v) => setSettings({ ...settings, pushMilestones: v })}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.toggleItem}>
                    <Text style={[styles.toggleLabel, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      Email
                    </Text>
                    <Switch
                      value={settings.emailMilestones}
                      onValueChange={(v) => setSettings({ ...settings, emailMilestones: v })}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.prefBox,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <View style={styles.prefHeader}>
                  <Text style={[styles.prefName, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Escrow Deposits & Payouts
                  </Text>
                  <Text style={[styles.prefHint, fontStyle('regular'), { color: palette.textMuted }]}>
                    Tranche movements & releases
                  </Text>
                </View>
                <View style={styles.prefToggles}>
                  <View style={styles.toggleItem}>
                    <Text style={[styles.toggleLabel, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      Push
                    </Text>
                    <Switch
                      value={settings.pushEscrow}
                      onValueChange={(v) => setSettings({ ...settings, pushEscrow: v })}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.toggleItem}>
                    <Text style={[styles.toggleLabel, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      Email
                    </Text>
                    <Switch
                      value={settings.emailEscrow}
                      onValueChange={(v) => setSettings({ ...settings, emailEscrow: v })}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.toggleItem}>
                    <Text style={[styles.toggleLabel, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      SMS
                    </Text>
                    <Switch
                      value={settings.smsEscrow}
                      onValueChange={(v) => setSettings({ ...settings, smsEscrow: v })}
                      trackColor={{ false: palette.border, true: palette.brandOrange }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.prefSwitchRow,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.prefName, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Daily Site Progress Digest
                  </Text>
                  <Text style={[styles.prefHint, fontStyle('regular'), { color: palette.textMuted }]}>
                    Consolidated 6:00 PM portfolio brief
                  </Text>
                </View>
                <Switch
                  value={settings.dailyDigest}
                  onValueChange={(v) => setSettings({ ...settings, dailyDigest: v })}
                  trackColor={{ false: palette.border, true: palette.brandOrange }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View
                style={[
                  styles.prefSwitchRow,
                  { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                ]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.prefName, fontStyle('bold'), { color: palette.textPrimary }]}>
                    Quiet Hours (10:00 PM – 7:00 AM)
                  </Text>
                  <Text style={[styles.prefHint, fontStyle('regular'), { color: palette.textMuted }]}>
                    Mute non-urgent notifications at night
                  </Text>
                </View>
                <Switch
                  value={settings.quietHours}
                  onValueChange={(v) => setSettings({ ...settings, quietHours: v })}
                  trackColor={{ false: palette.border, true: palette.brandOrange }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View
              style={[
                styles.modalFooter,
                { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border },
              ]}>
              <Pressable
                onPress={() => setIsSettingsModalOpen(false)}
                style={[
                  styles.secondaryBtn,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}>
                <Text style={[styles.secondaryBtnText, fontStyle('semibold'), { color: palette.textSecondary }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsSettingsModalOpen(false)}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                  Save Preferences
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      )}

      {/* Proof Preview Modal (for Inspection notifications) */}
      {!!selectedProofPreview && (
      <Modal
        visible={!!selectedProofPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProofPreview(null)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            {selectedProofPreview && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: palette.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.proofKicker, fontStyle('bold'), { color: palette.brandOrange }]}>
                      {selectedProofPreview.projectTitle}
                    </Text>
                    <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                      {selectedProofPreview.title}
                    </Text>
                  </View>
                  <Pressable onPress={() => setSelectedProofPreview(null)}>
                    <Text style={{ color: palette.textMuted, fontSize: 16 }}>✕</Text>
                  </Pressable>
                </View>

                <View style={styles.modalBody}>
                  <Text style={[styles.notifDesc, fontStyle('regular'), { color: palette.textSecondary }]}>
                    {selectedProofPreview.description}
                  </Text>

                  <View style={[styles.proofImageWrap, { borderColor: palette.border }]}>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=600&h=350&fit=crop',
                      }}
                      style={styles.proofImage}
                    />
                    <View style={styles.proofBadge}>
                      <Text style={[styles.proofBadgeText, fontStyle('bold')]}>
                        Inspection Proof • Verified by Lead Rep
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.modalFooter,
                    { backgroundColor: palette.surfaceSubtle, borderTopColor: palette.border },
                  ]}>
                  <Pressable
                    onPress={() => setSelectedProofPreview(null)}
                    style={[
                      styles.secondaryBtn,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    <Text style={[styles.secondaryBtnText, fontStyle('semibold'), { color: palette.textSecondary }]}>
                      Close
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setSelectedProofPreview(null);
                      router.replace('/projects');
                    }}
                    style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                    <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                      Open Project Stage →
                    </Text>
                  </Pressable>
                </View>
              </>
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
  headerBlock: { gap: 4 },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, lineHeight: 18 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  prefLink: { fontSize: 12 },
  markAllLink: { fontSize: 13 },
  unifiedCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  emptyWrap: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 17, textAlign: 'center' },
  emptyDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
  notifRow: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  docIconWrap: {
    paddingTop: 2,
  },
  notifBody: {
    flex: 1,
    gap: 4,
  },
  notifTitle: { fontSize: 14, lineHeight: 19 },
  notifDesc: { fontSize: 12, lineHeight: 17 },
  notifMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  notifTime: { fontSize: 11 },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dismissBtn: {
    padding: 4,
  },
  primaryBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 12.5 },
  secondaryBtn: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 12.5 },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 18 },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalTitle: { fontSize: 15 },
  modalSub: { fontSize: 11, marginTop: 2 },
  proofKicker: { fontSize: 11, marginBottom: 2 },
  modalBody: { padding: 16, gap: 10 },
  prefBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  prefHeader: { gap: 1 },
  prefName: { fontSize: 12.5 },
  prefHint: { fontSize: 11 },
  prefToggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleLabel: { fontSize: 11.5 },
  prefSwitchRow: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  proofImageWrap: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  proofImage: { width: '100%', height: '100%' },
  proofBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  proofBadgeText: { color: '#FFFFFF', fontSize: 10 },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default OwnerNotificationsPage;
