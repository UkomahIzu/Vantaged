import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import { DEMO_OWNER_PROJECTS } from '../data/ownerDashboardData';
import { EscrowShieldIcon, OwnerNavIcon } from './OwnerIcons';

let localIdSeq = 1;
function createLocalId(prefix: string): string {
  localIdSeq += 1;
  return `${prefix}-${localIdSeq}`;
}

/* ──────────────────────────────────────────────────────────────────────────
 * 1. SHARE LINK MODAL (Matches Web ShareLinkModal)
 * ────────────────────────────────────────────────────────────────────────── */
interface MobileShareLink {
  id: string;
  projectTitle: string;
  url: string;
  expiryLabel: string;
  recipientEmail?: string;
  views: number;
  revoked: boolean;
}

const INITIAL_SHARE_LINKS: MobileShareLink[] = [
  {
    id: 'sh-1',
    projectTitle: 'Lekki Phase 1 Luxury 5-Bed Villa',
    url: 'https://vantaged.app/s/vnt-lekki-4821a',
    expiryLabel: 'Expires in 30 days',
    recipientEmail: 'emeka.okonkwo@gmail.com',
    views: 8,
    revoked: false,
  },
  {
    id: 'sh-2',
    projectTitle: 'Victoria Island Commercial Annex',
    url: 'https://vantaged.app/s/vnt-vi-7311b',
    expiryLabel: 'Expires in 14 days',
    recipientEmail: 'auditor@diasporainvest.com',
    views: 3,
    revoked: false,
  },
];

export function ShareLinkModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { palette, isDemoMode } = useOwnerMobile();
  const [tab, setTab] = useState<'create' | 'manage'>('create');
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);
  const [expiryDays, setExpiryDays] = useState<number | null>(30);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [links, setLinks] = useState<MobileShareLink[]>(INITIAL_SHARE_LINKS);
  const [createdBanner, setCreatedBanner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async (id: string, url: string) => {
    await Clipboard.setStringAsync(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const visibleLinks = isDemoMode
    ? links.filter((l) => !l.revoked)
    : links.filter((l) => !l.revoked && l.id.startsWith('sh-new-'));

  const handleGenerate = () => {
    const project = DEMO_OWNER_PROJECTS[selectedProjectIdx] ?? DEMO_OWNER_PROJECTS[0];
    const token = `vnt-${Math.random().toString(36).slice(2, 8)}`;
    const newItem: MobileShareLink = {
      id: createLocalId('sh-new'),
      projectTitle: isDemoMode ? project.title : 'My Construction Project',
      url: `https://vantaged.app/s/${token}`,
      expiryLabel: expiryDays ? `Expires in ${expiryDays} days` : 'Never expires',
      recipientEmail: recipientEmail.trim() || undefined,
      views: 0,
      revoked: false,
    };
    setLinks((prev) => [newItem, ...prev]);
    setRecipientEmail('');
    setCreatedBanner(newItem.url);
    setTab('manage');
  };

  const handleNativeShare = async (url: string, title: string) => {
    try {
      await Share.share({
        message: `Track live verified construction progress for ${title} on Vantaged: ${url}`,
        url,
      });
    } catch {
      // Dismissed
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { backgroundColor: palette.drawerBackdrop }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: palette.borderSubtle }]}>
            <View style={styles.headerTextCol}>
              <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Read-Only Share Links
              </Text>
              <Text style={[styles.sub, fontStyle('regular'), { color: palette.textMuted }]}>
                Share live progress without exposing payments, bank details, or chat
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeTxt, fontStyle('bold'), { color: palette.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View
            style={[
              styles.segmentRow,
              { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
            ]}>
            <Pressable
              onPress={() => setTab('create')}
              style={[
                styles.segmentBtn,
                tab === 'create' && {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}>
              <Text
                style={[
                  styles.segmentTxt,
                  fontStyle('bold'),
                  { color: tab === 'create' ? palette.textPrimary : palette.textMuted },
                ]}>
                Create Link
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('manage')}
              style={[
                styles.segmentBtn,
                tab === 'manage' && {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}>
              <Text
                style={[
                  styles.segmentTxt,
                  fontStyle('bold'),
                  { color: tab === 'manage' ? palette.textPrimary : palette.textMuted },
                ]}>
                Active Links ({visibleLinks.length})
              </Text>
            </Pressable>
          </View>

          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            {tab === 'create' ? (
              <View style={styles.formGap}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  SELECT PROJECT
                </Text>
                <View style={styles.chipWrap}>
                  {DEMO_OWNER_PROJECTS.map((p, idx) => {
                    const selected = selectedProjectIdx === idx;
                    return (
                      <Pressable
                        key={p.id}
                        onPress={() => setSelectedProjectIdx(idx)}
                        style={[
                          styles.choiceChip,
                          {
                            backgroundColor: selected ? palette.brandSoftBg : palette.surfaceSubtle,
                            borderColor: selected ? palette.brandOrange : palette.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.choiceTxt,
                            fontStyle('semibold'),
                            { color: selected ? palette.brandSoftText : palette.textSecondary },
                          ]}>
                          {p.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  LINK EXPIRY
                </Text>
                <View style={styles.chipRow}>
                  {[
                    { label: '7 Days', val: 7 },
                    { label: '30 Days', val: 30 },
                    { label: '90 Days', val: 90 },
                    { label: 'Never', val: null },
                  ].map((opt) => {
                    const active = expiryDays === opt.val;
                    return (
                      <Pressable
                        key={opt.label}
                        onPress={() => setExpiryDays(opt.val)}
                        style={[
                          styles.smallChip,
                          {
                            backgroundColor: active ? palette.brandOrange : palette.surfaceSubtle,
                            borderColor: active ? palette.brandOrange : palette.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.smallChipTxt,
                            fontStyle('bold'),
                            { color: active ? '#FFFFFF' : palette.textSecondary },
                          ]}>
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  RECIPIENT EMAIL (OPTIONAL)
                </Text>
                <TextInput
                  value={recipientEmail}
                  onChangeText={setRecipientEmail}
                  placeholder="e.g. family@example.com or bank-auditor@..."
                  placeholderTextColor={palette.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    fontStyle('regular'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />

                <Pressable
                  onPress={handleGenerate}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
                  <Text style={[styles.primaryBtnTxt, fontStyle('bold')]}>
                    Generate Read-Only Link
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formGap}>
                {createdBanner && (
                  <View
                    style={[
                      styles.noticeBanner,
                      { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                    ]}>
                    <Text style={[styles.noticeTxt, fontStyle('bold'), { color: palette.greenText }]}>
                      ✓ Link generated: {createdBanner}
                    </Text>
                  </View>
                )}

                {visibleLinks.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={[styles.emptyTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                      No active share links yet
                    </Text>
                    <Text style={[styles.emptySub, fontStyle('regular'), { color: palette.textMuted }]}>
                      Create a secure read-only link for family, lenders, or co-investors.
                    </Text>
                  </View>
                ) : (
                  visibleLinks.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.linkItemCard,
                        { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                      ]}>
                      <Text style={[styles.linkProj, fontStyle('bold'), { color: palette.textPrimary }]}>
                        {item.projectTitle}
                      </Text>
                      <View
                        style={[
                          styles.linkUrlRow,
                          { backgroundColor: palette.surface, borderColor: palette.border },
                        ]}>
                        <Text
                          style={[styles.linkUrl, fontStyle('medium'), { color: palette.brandSoftText }]}
                          numberOfLines={1}
                          ellipsizeMode="middle">
                          {item.url}
                        </Text>
                        <Pressable
                          onPress={() => handleCopyLink(item.id, item.url)}
                          style={[
                            styles.copyChipBtn,
                            {
                              backgroundColor:
                                copiedId === item.id ? palette.greenBg : palette.brandSoftBg,
                              borderColor:
                                copiedId === item.id ? palette.greenBorder : palette.brandSoftBorder,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.copyChipTxt,
                              fontStyle('bold'),
                              {
                                color:
                                  copiedId === item.id ? palette.greenText : palette.brandSoftText,
                              },
                            ]}>
                            {copiedId === item.id ? '✓ Copied' : 'Copy'}
                          </Text>
                        </Pressable>
                      </View>
                      <Text style={[styles.linkMeta, fontStyle('regular'), { color: palette.textMuted }]}>
                        {item.expiryLabel} · {item.views} views
                        {item.recipientEmail ? ` · ${item.recipientEmail}` : ''}
                      </Text>
                      <View style={styles.linkActions}>
                        <Pressable
                          onPress={() => handleNativeShare(item.url, item.projectTitle)}
                          style={[styles.miniBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
                          <Text style={[styles.miniBtnTxtWhite, fontStyle('bold')]}>Share Link</Text>
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            setLinks((prev) =>
                              prev.map((l) => (l.id === item.id ? { ...l, revoked: true } : l))
                            )
                          }
                          style={[
                            styles.miniBtnOutline,
                            { borderColor: palette.border, backgroundColor: palette.surface },
                          ]}>
                          <Text style={[styles.miniBtnTxtDanger, fontStyle('bold')]}>Revoke</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 2. CONTRACTOR / REP CHAT MODAL (Mobile DraggableChatWindow Counterpart)
 * ────────────────────────────────────────────────────────────────────────── */
interface MobileChatMessage {
  id: string;
  sender: 'contractor' | 'owner';
  senderName: string;
  text: string;
  timestamp: string;
}

const DEMO_CHAT_MESSAGES: MobileChatMessage[] = [
  {
    id: 'm-1',
    sender: 'contractor',
    senderName: 'Engr. Chidi Okafor',
    text: 'Good afternoon. 4 concrete mixer trucks have arrived on site for the 1st-floor suspended slab pour. Cube slump test is underway.',
    timestamp: '11:32 AM',
  },
  {
    id: 'm-2',
    sender: 'owner',
    senderName: 'You',
    text: 'Thanks Chidi. Please ensure the GPS-stamped rebar spacing photos are uploaded to Stage 4 before casting starts.',
    timestamp: '11:36 AM',
  },
  {
    id: 'm-3',
    sender: 'contractor',
    senderName: 'Engr. Chidi Okafor',
    text: 'Confirmed — 6 photos and a 35s walkthrough clip have been submitted under Stage 4 for your approval.',
    timestamp: '11:41 AM',
  },
];

export function ContractorChatModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { palette, isDemoMode } = useOwnerMobile();
  const [messages, setMessages] = useState<MobileChatMessage[]>(DEMO_CHAT_MESSAGES);
  const [customMessages, setCustomMessages] = useState<MobileChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const chatScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const displayed = isDemoMode ? messages : customMessages;

  const sendMessage = (textInput?: string) => {
    const content = (textInput ?? draft).trim();
    if (!content) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const outgoing: MobileChatMessage = {
      id: createLocalId('msg'),
      sender: 'owner',
      senderName: 'You',
      text: content,
      timestamp: now,
    };

    if (isDemoMode) {
      setMessages((prev) => [...prev, outgoing]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: createLocalId('reply'),
            sender: 'contractor',
            senderName: 'Engr. Chidi Okafor',
            text: 'Received loud and clear. I will update the Stage 4 site log shortly.',
            timestamp: 'Just now',
          },
        ]);
      }, 750);
    } else {
      setCustomMessages((prev) => [...prev, outgoing]);
    }
    setDraft('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlayBottom, { backgroundColor: palette.drawerBackdrop }]}>
        <View
          style={[
            styles.chatSheet,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          {/* Polished Contractor Header */}
          <View style={[styles.chatHeader, { borderBottomColor: palette.borderSubtle }]}>
            <View style={styles.chatHeaderLeft}>
              <View style={[styles.chatAvatar, { backgroundColor: palette.textPrimary }]}>
                <Text style={[styles.chatAvatarTxt, fontStyle('extrabold'), { color: palette.surface }]}>
                  CO
                </Text>
                <View
                  style={[
                    styles.chatOnlineDot,
                    { backgroundColor: palette.greenAccent, borderColor: palette.surface },
                  ]}
                />
              </View>
              <View style={styles.chatHeaderInfo}>
                <Text
                  style={[styles.chatTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}
                  numberOfLines={1}>
                  {isDemoMode ? 'Engr. Chidi Okafor' : 'Site Contractor Thread'}
                </Text>
                <Text
                  style={[styles.chatSub, fontStyle('medium'), { color: palette.greenText }]}
                  numberOfLines={1}>
                  ● {isDemoMode ? 'Apex Structure Ltd · Villa Victoria' : 'Verified project channel'}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.chatCloseBtn,
                { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
              ]}>
              <Text style={[styles.closeTxt, fontStyle('bold'), { color: palette.textSecondary }]}>✕</Text>
            </Pressable>
          </View>

          {/* Subtle Tinted Chat Canvas */}
          <ScrollView
            ref={chatScrollRef}
            onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
            style={[styles.chatScroll, { backgroundColor: palette.canvasBg }]}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.chatDatePill,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <Text style={[styles.chatDateTxt, fontStyle('semibold'), { color: palette.textMuted }]}>
                Today · Escrow-Logged Channel
              </Text>
            </View>

            {displayed.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Start a project conversation
                </Text>
                <Text style={[styles.emptySub, fontStyle('regular'), { color: palette.textMuted }]}>
                  Messages stay permanently attached to your project record even if site staff change.
                </Text>
              </View>
            ) : (
              displayed.map((msg) => {
                const isOwner = msg.sender === 'owner';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.bubble,
                      isOwner
                        ? [
                            styles.bubbleOwner,
                            { backgroundColor: palette.brandPrimaryBtn },
                          ]
                        : [
                            styles.bubbleContractor,
                            {
                              backgroundColor: palette.surface,
                              borderColor: palette.border,
                            },
                          ],
                    ]}>
                    {!isOwner && (
                      <Text style={[styles.bubbleSender, fontStyle('bold'), { color: palette.brandSoftText }]}>
                        {msg.senderName}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.bubbleText,
                        fontStyle('regular'),
                        { color: isOwner ? '#FFFFFF' : palette.textPrimary },
                      ]}>
                      {msg.text}
                    </Text>
                    <View style={styles.bubbleFooter}>
                      <Text
                        style={[
                          styles.bubbleTime,
                          fontStyle('medium'),
                          { color: isOwner ? 'rgba(255,255,255,0.78)' : palette.textMuted },
                        ]}>
                        {msg.timestamp}
                      </Text>
                      {isOwner && (
                        <Text style={[styles.bubbleCheck, fontStyle('bold')]}>✓✓</Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Quick Replies Strip */}
          <View style={[styles.quickPromptsWrap, { borderTopColor: palette.borderSubtle }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickPromptsRow}>
              {[
                'Share latest site photos',
                'Confirm cube test results',
                'Schedule QA inspection',
              ].map((prompt) => (
                <Pressable
                  key={prompt}
                  onPress={() => sendMessage(prompt)}
                  style={[
                    styles.promptChip,
                    { backgroundColor: palette.brandSoftBg, borderColor: palette.brandSoftBorder },
                  ]}>
                  <Text style={[styles.promptChipTxt, fontStyle('semibold'), { color: palette.brandSoftText }]}>
                    {prompt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Refined Composer Bar */}
          <View style={[styles.chatComposer, { borderTopColor: palette.borderSubtle }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Write a message to Engr. Chidi..."
              placeholderTextColor={palette.textMuted}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage()}
              style={[
                styles.chatInput,
                fontStyle('regular'),
                {
                  backgroundColor: palette.surfaceSubtle,
                  borderColor: palette.border,
                  color: palette.textPrimary,
                },
              ]}
            />
            <Pressable
              onPress={() => sendMessage()}
              disabled={!draft.trim()}
              style={[
                styles.sendBtn,
                {
                  backgroundColor: draft.trim() ? palette.brandPrimaryBtn : palette.border,
                },
              ]}>
              <Text style={[styles.sendBtnTxt, fontStyle('bold')]}>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 3. INVITE REPRESENTATIVE MODAL (Matches Web InviteRepresentativeModal)
 * ────────────────────────────────────────────────────────────────────────── */
const DISCIPLINES = [
  'Structural & Civil',
  'Architecture',
  'Quantity Surveying',
  'MEP Engineering',
  'Owner Proxy',
] as const;

export function InviteRepresentativeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { palette, isDemoMode } = useOwnerMobile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [projectName, setProjectName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [discipline, setDiscipline] = useState<(typeof DISCIPLINES)[number]>('Structural & Civil');
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const projects = isDemoMode ? DEMO_OWNER_PROJECTS : [];

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !projectName.trim()) return;
    setSubmittedName(name.trim());
  };

  const resetAndClose = () => {
    setSubmittedName(null);
    setName('');
    setEmail('');
    setRoleTitle('');
    setProjectName('');
    setDropdownOpen(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={resetAndClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { backgroundColor: palette.drawerBackdrop }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={[styles.header, { borderBottomColor: palette.borderSubtle }]}>
            <View style={styles.headerTextCol}>
              <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Invite Client Representative
              </Text>
              <Text style={[styles.sub, fontStyle('regular'), { color: palette.textMuted }]}>
                Assign a trusted representative to monitor a specific project
              </Text>
            </View>
            <Pressable onPress={resetAndClose} style={styles.closeBtn}>
              <Text style={[styles.closeTxt, fontStyle('bold'), { color: palette.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            {submittedName ? (
              <View style={styles.successWrap}>
                <View
                  style={[
                    styles.successIcon,
                    { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                  ]}>
                  <EscrowShieldIcon color={palette.greenText} size={24} />
                </View>
                <Text style={[styles.successTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  Invitation Dispatched
                </Text>
                <Text style={[styles.emptySub, fontStyle('regular'), { color: palette.textSecondary }]}>
                  An onboarding link code has been sent to {submittedName} ({email}) as {discipline} for {projectName.trim()}.
                </Text>
                <Pressable
                  onPress={resetAndClose}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn, width: '100%' }]}>
                  <Text style={[styles.primaryBtnTxt, fontStyle('bold')]}>Done</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formGap}>
                <View>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    FULL NAME *
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Engr. Damilola Adebayo"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('regular'),
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                        color: palette.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    EMAIL ADDRESS *
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="engineer@firm.ng"
                    placeholderTextColor={palette.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      fontStyle('regular'),
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                        color: palette.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    PROJECT TO ACCESS *
                  </Text>
                  <Pressable
                    onPress={() => setDropdownOpen((prev) => !prev)}
                    style={[
                      styles.dropdownBtn,
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: dropdownOpen ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dropdownBtnTxt,
                        fontStyle(projectName ? 'semibold' : 'regular'),
                        { color: projectName ? palette.textPrimary : palette.textMuted },
                      ]}
                      numberOfLines={1}>
                      {projectName || 'Select a project...'}
                    </Text>
                    <Text style={[styles.dropdownChevron, { color: palette.textMuted }]}>
                      {dropdownOpen ? '▲' : '▼'}
                    </Text>
                  </Pressable>

                  {dropdownOpen && (
                    <View
                      style={[
                        styles.dropdownMenu,
                        { backgroundColor: palette.surface, borderColor: palette.border },
                      ]}>
                      {projects.length === 0 ? (
                        <Text
                          style={[
                            styles.dropdownEmpty,
                            fontStyle('regular'),
                            { color: palette.textMuted },
                          ]}>
                          No active projects found. Create or enable a project first.
                        </Text>
                      ) : (
                        projects.map((proj, idx) => {
                          const selected = projectName === proj.title;
                          return (
                            <Pressable
                              key={proj.id}
                              onPress={() => {
                                setProjectName(proj.title);
                                setDropdownOpen(false);
                              }}
                              style={[
                                styles.dropdownOption,
                                idx > 0 && {
                                  borderTopWidth: 1,
                                  borderTopColor: palette.borderSubtle,
                                },
                                selected && { backgroundColor: palette.brandSoftBg },
                              ]}>
                              <View style={styles.dropdownOptTextCol}>
                                <Text
                                  style={[
                                    styles.dropdownOptTitle,
                                    fontStyle(selected ? 'bold' : 'semibold'),
                                    {
                                      color: selected ? palette.brandSoftText : palette.textPrimary,
                                    },
                                  ]}
                                  numberOfLines={1}>
                                  {proj.title}
                                </Text>
                                <Text
                                  style={[
                                    styles.dropdownOptSub,
                                    fontStyle('regular'),
                                    { color: palette.textMuted },
                                  ]}
                                  numberOfLines={1}>
                                  {proj.location}
                                </Text>
                              </View>
                              {selected && (
                                <Text
                                  style={[
                                    styles.dropdownCheck,
                                    fontStyle('bold'),
                                    { color: palette.brandOrange },
                                  ]}>
                                  ✓
                                </Text>
                              )}
                            </Pressable>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>

                <View>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    ROLE TITLE
                  </Text>
                  <TextInput
                    value={roleTitle}
                    onChangeText={setRoleTitle}
                    placeholder="e.g. Lead Structural Consultant"
                    placeholderTextColor={palette.textMuted}
                    style={[
                      styles.input,
                      fontStyle('regular'),
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                        color: palette.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                    DISCIPLINE
                  </Text>
                  <View style={styles.chipRow}>
                    {DISCIPLINES.map((d) => {
                      const selected = discipline === d;
                      return (
                        <Pressable
                          key={d}
                          onPress={() => setDiscipline(d)}
                          style={[
                            styles.smallChip,
                            {
                              backgroundColor: selected ? palette.brandOrange : palette.surfaceSubtle,
                              borderColor: selected ? palette.brandOrange : palette.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.smallChipTxt,
                              fontStyle('bold'),
                              { color: selected ? '#FFFFFF' : palette.textSecondary },
                            ]}>
                            {d}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <Pressable
                  onPress={handleSubmit}
                  style={[
                    styles.primaryBtn,
                    {
                      backgroundColor:
                        name.trim() && email.trim() && projectName.trim()
                          ? palette.brandPrimaryBtn
                          : '#CBC8DA',
                    },
                  ]}>
                  <Text style={[styles.primaryBtnTxt, fontStyle('bold')]}>
                    Send Representative Invite
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 4. SITE WEATHER MODAL (Matches Web SiteWeatherModal)
 * ────────────────────────────────────────────────────────────────────────── */
const WEATHER_SITES = [
  {
    id: 'lekki',
    name: 'Villa Victoria',
    location: 'Lekki Phase 1, Lagos',
    temp: 31,
    condition: 'Partly Cloudy',
    high: 33,
    low: 26,
    humidity: 74,
    wind: '14 km/h',
    rainChance: 12,
    status: 'Work ongoing · No rain delays recorded',
    isDelay: false,
    forecast: [
      { time: '12 PM', temp: '31°' },
      { time: '02 PM', temp: '32°' },
      { time: '04 PM', temp: '30°' },
      { time: '06 PM', temp: '28°' },
    ],
  },
  {
    id: 'epe',
    name: 'The Enclave Resort',
    location: 'Epe, Lagos',
    temp: 28,
    condition: 'Light Rain',
    high: 29,
    low: 24,
    humidity: 88,
    wind: '18 km/h',
    rainChance: 70,
    status: 'Rain delay logged · Outdoor casting paused',
    isDelay: true,
    forecast: [
      { time: '12 PM', temp: '28°' },
      { time: '02 PM', temp: '27°' },
      { time: '04 PM', temp: '28°' },
      { time: '06 PM', temp: '26°' },
    ],
  },
  {
    id: 'abuja',
    name: 'Guzape Hills Residence',
    location: 'Guzape, Abuja',
    temp: 34,
    condition: 'Sunny & Dry',
    high: 36,
    low: 22,
    humidity: 38,
    wind: '11 km/h',
    rainChance: 0,
    status: 'Optimal dry weather · Work on schedule',
    isDelay: false,
    forecast: [
      { time: '12 PM', temp: '34°' },
      { time: '02 PM', temp: '36°' },
      { time: '04 PM', temp: '33°' },
      { time: '06 PM', temp: '29°' },
    ],
  },
];

export function SiteWeatherModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { palette } = useOwnerMobile();
  const [selectedId, setSelectedId] = useState(WEATHER_SITES[0].id);
  const site = WEATHER_SITES.find((s) => s.id === selectedId) ?? WEATHER_SITES[0];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: palette.drawerBackdrop }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={[styles.header, { borderBottomColor: palette.borderSubtle }]}>
            <View style={styles.headerTextCol}>
              <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Live Site Weather &amp; Radar
              </Text>
              <Text style={[styles.sub, fontStyle('regular'), { color: palette.textMuted }]}>
                Monitor precipitation &amp; concrete curing conditions
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeTxt, fontStyle('bold'), { color: palette.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {WEATHER_SITES.map((item) => {
                const active = item.id === selectedId;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedId(item.id)}
                    style={[
                      styles.smallChip,
                      {
                        backgroundColor: active ? palette.brandOrange : palette.surfaceSubtle,
                        borderColor: active ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.smallChipTxt,
                        fontStyle('bold'),
                        { color: active ? '#FFFFFF' : palette.textSecondary },
                      ]}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View
              style={[
                styles.weatherHero,
                { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
              ]}>
              <View>
                <Text style={[styles.weatherLoc, fontStyle('bold'), { color: palette.textMuted }]}>
                  {site.location}
                </Text>
                <Text
                  style={[
                    styles.weatherTemp,
                    fontStyle('extrabold'),
                    { color: palette.textPrimary, fontVariant: ['tabular-nums'] },
                  ]}>
                  {site.temp}°C
                </Text>
                <Text style={[styles.weatherCond, fontStyle('semibold'), { color: palette.textSecondary }]}>
                  {site.condition} · H:{site.high}° L:{site.low}°
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.noticeBanner,
                site.isDelay
                  ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
                  : { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
              ]}>
              <Text
                style={[
                  styles.noticeTxt,
                  fontStyle('bold'),
                  { color: site.isDelay ? '#170F42' : palette.greenText },
                ]}>
                {site.status}
              </Text>
            </View>

            <View style={styles.metricsTriple}>
              <View style={[styles.metricBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <Text style={[styles.metricVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  {site.humidity}%
                </Text>
                <Text style={[styles.metricLbl, fontStyle('medium'), { color: palette.textMuted }]}>
                  Humidity
                </Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <Text style={[styles.metricVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  {site.wind}
                </Text>
                <Text style={[styles.metricLbl, fontStyle('medium'), { color: palette.textMuted }]}>
                  Wind
                </Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: palette.surfaceSubtle, borderColor: palette.border }]}>
                <Text style={[styles.metricVal, fontStyle('extrabold'), { color: palette.brandOrange }]}>
                  {site.rainChance}%
                </Text>
                <Text style={[styles.metricLbl, fontStyle('medium'), { color: palette.textMuted }]}>
                  Rain Chance
                </Text>
              </View>
            </View>

            <View style={styles.forecastRow}>
              {site.forecast.map((f) => (
                <View
                  key={f.time}
                  style={[
                    styles.forecastPill,
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                  ]}>
                  <Text style={[styles.forecastTime, fontStyle('medium'), { color: palette.textMuted }]}>
                    {f.time}
                  </Text>
                  <Text style={[styles.forecastTemp, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                    {f.temp}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 5. STOP-WORK NOTICE MODAL
 * ────────────────────────────────────────────────────────────────────────── */
const STOP_REASONS = [
  'Structural safety concern',
  'Unapproved material substitution',
  'Failed concrete cube test',
  'Pending COREN inspection',
] as const;

export function StopWorkNoticeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { palette } = useOwnerMobile();
  const [reason, setReason] = useState<(typeof STOP_REASONS)[number]>(STOP_REASONS[0]);
  const [notes, setNotes] = useState('');
  const [issued, setIssued] = useState(false);

  const handleClose = () => {
    setIssued(false);
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { backgroundColor: palette.drawerBackdrop }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={[styles.header, { borderBottomColor: palette.borderSubtle }]}>
            <View style={styles.headerTextCol}>
              <Text style={[styles.title, fontStyle('extrabold'), { color: '#E11D48' }]}>
                Issue Stop-Work Notice
              </Text>
              <Text style={[styles.sub, fontStyle('regular'), { color: palette.textMuted }]}>
                Contractual site pause &amp; escrow hold pending clearance
              </Text>
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={[styles.closeTxt, fontStyle('bold'), { color: palette.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            {issued ? (
              <View style={styles.successWrap}>
                <Text style={[styles.successTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  Stop-Work Notice Logged
                </Text>
                <Text style={[styles.emptySub, fontStyle('regular'), { color: palette.textSecondary }]}>
                  Contractor Director and assigned Site Manager have been notified via push, email, and SMS. Escrow disbursements are paused until resolved.
                </Text>
                <Pressable
                  onPress={handleClose}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn, width: '100%' }]}>
                  <Text style={[styles.primaryBtnTxt, fontStyle('bold')]}>Return to Dashboard</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formGap}>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  REASON FOR SITE PAUSE
                </Text>
                <View style={styles.chipWrap}>
                  {STOP_REASONS.map((r) => {
                    const active = reason === r;
                    return (
                      <Pressable
                        key={r}
                        onPress={() => setReason(r)}
                        style={[
                          styles.choiceChip,
                          {
                            backgroundColor: active ? '#FFF1F2' : palette.surfaceSubtle,
                            borderColor: active ? '#E11D48' : palette.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.choiceTxt,
                            fontStyle('semibold'),
                            { color: active ? '#BE123C' : palette.textSecondary },
                          ]}>
                          {r}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  INSPECTION NOTES
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  placeholder="Describe the compliance issue or required remediation..."
                  placeholderTextColor={palette.textMuted}
                  style={[
                    styles.textArea,
                    fontStyle('regular'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />

                <Pressable
                  onPress={() => setIssued(true)}
                  style={[styles.primaryBtn, { backgroundColor: '#E11D48' }]}>
                  <Text style={[styles.primaryBtnTxt, fontStyle('bold')]}>
                    Confirm Stop-Work Notice
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 6. OWNER PROFILE MODAL (Matches Web OwnerProfileModal)
 * ────────────────────────────────────────────────────────────────────────── */
export function OwnerProfileModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { user, setUserProfile, palette, isDemoMode } = useOwnerMobile();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [region, setRegion] = useState('Lagos State (Ikoyi / Lekki)');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setUserProfile({
      fullName: fullName.trim() || user.fullName,
      email: email.trim() || user.email,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { backgroundColor: palette.drawerBackdrop }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={[styles.header, { borderBottomColor: palette.borderSubtle }]}>
            <View style={styles.headerTextCol}>
              <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Owner Profile &amp; Tier
              </Text>
              <Text style={[styles.sub, fontStyle('regular'), { color: palette.textMuted }]}>
                {isDemoMode ? 'Portfolio Investor (3 / 3 Slots)' : 'Private Owner (1 Free Slot Ready)'}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeTxt, fontStyle('bold'), { color: palette.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            {savedNotice && (
              <View
                style={[
                  styles.noticeBanner,
                  { backgroundColor: palette.greenBg, borderColor: palette.greenBorder },
                ]}>
                <Text style={[styles.noticeTxt, fontStyle('bold'), { color: palette.greenText }]}>
                  ✓ Profile updated successfully
                </Text>
              </View>
            )}

            <View
              style={[
                styles.identityCard,
                { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
              ]}>
              <OwnerNavIcon id="settings" color={palette.brandOrange} size={18} />
              <View style={styles.headerTextCol}>
                <Text style={[styles.linkProj, fontStyle('bold'), { color: palette.textPrimary }]}>
                  NIN Identity Verification
                </Text>
                <Text style={[styles.linkMeta, fontStyle('regular'), { color: palette.greenText }]}>
                  Verified · NDPA 2023 Compliant
                </Text>
              </View>
            </View>

            <View style={styles.formGap}>
              <View>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  FULL NAME
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  style={[
                    styles.input,
                    fontStyle('regular'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />
              </View>
              <View>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  EMAIL ADDRESS
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    fontStyle('regular'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />
              </View>
              <View>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  PHONE NUMBER
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    fontStyle('regular'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />
              </View>
              <View>
                <Text style={[styles.fieldLabel, fontStyle('bold'), { color: palette.textPrimary }]}>
                  STATE / CORRIDOR
                </Text>
                <TextInput
                  value={region}
                  onChangeText={setRegion}
                  style={[
                    styles.input,
                    fontStyle('regular'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />
              </View>

              <Pressable
                onPress={handleSave}
                style={[styles.primaryBtn, { backgroundColor: palette.brandPrimaryBtn }]}>
                <Text style={[styles.primaryBtnTxt, fontStyle('bold')]}>Save Profile Changes</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  overlayBottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderRadius: 18,
    borderWidth: 1,
    maxHeight: '84%',
    overflow: 'hidden',
  },
  chatSheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    height: '86%',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  sub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  closeTxt: {
    fontSize: 15,
  },
  segmentRow: {
    flexDirection: 'row',
    margin: 14,
    marginBottom: 4,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  segmentTxt: {
    fontSize: 12,
  },
  bodyScroll: {
    flexGrow: 0,
  },
  bodyContent: {
    padding: 16,
    gap: 14,
  },
  formGap: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 10.5,
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13.5,
  },
  dropdownBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownBtnTxt: {
    flex: 1,
    fontSize: 13.5,
  },
  dropdownChevron: {
    fontSize: 10,
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownOptTextCol: {
    flex: 1,
  },
  dropdownOptTitle: {
    fontSize: 13,
  },
  dropdownOptSub: {
    fontSize: 11,
    marginTop: 1,
  },
  dropdownCheck: {
    fontSize: 13,
  },
  dropdownEmpty: {
    padding: 12,
    fontSize: 12,
  },
  textArea: {
    minHeight: 82,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  chipWrap: {
    gap: 8,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  choiceTxt: {
    fontSize: 12.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  smallChipTxt: {
    fontSize: 11.5,
  },
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  primaryBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13.5,
  },
  noticeBanner: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  noticeTxt: {
    fontSize: 12,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontSize: 14,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
  },
  linkItemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  linkProj: {
    fontSize: 13,
  },
  linkUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 2,
  },
  linkUrl: {
    flex: 1,
    fontSize: 11.5,
  },
  copyChipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
  },
  copyChipTxt: {
    fontSize: 11,
  },
  linkMeta: {
    fontSize: 11,
  },
  linkActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  miniBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBtnTxtWhite: {
    color: '#FFFFFF',
    fontSize: 11.5,
  },
  miniBtnOutline: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBtnTxtDanger: {
    color: '#E11D48',
    fontSize: 11.5,
  },
  chatHeader: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
    minWidth: 0,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatAvatarTxt: {
    fontSize: 13,
  },
  chatOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
  },
  chatHeaderInfo: {
    flex: 1,
    minWidth: 0,
  },
  chatTitle: {
    fontSize: 15.5,
  },
  chatSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  chatCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 14,
    gap: 10,
  },
  chatDatePill: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    marginBottom: 4,
  },
  chatDateTxt: {
    fontSize: 10.5,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleOwner: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  bubbleContractor: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleSender: {
    fontSize: 10.5,
    marginBottom: 3,
  },
  bubbleText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 9.5,
  },
  bubbleCheck: {
    fontSize: 9.5,
    color: 'rgba(255,255,255,0.85)',
  },
  quickPromptsWrap: {
    borderTopWidth: 1,
  },
  quickPromptsRow: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  promptChipTxt: {
    fontSize: 11,
  },
  chatComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 13,
  },
  sendBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  successWrap: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 17,
  },
  weatherHero: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  weatherLoc: {
    fontSize: 11.5,
  },
  weatherTemp: {
    fontSize: 38,
    marginVertical: 2,
  },
  weatherCond: {
    fontSize: 13,
  },
  metricsTriple: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
  },
  metricLbl: {
    fontSize: 10.5,
    marginTop: 2,
  },
  forecastRow: {
    flexDirection: 'row',
    gap: 8,
  },
  forecastPill: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  forecastTime: {
    fontSize: 10.5,
  },
  forecastTemp: {
    fontSize: 14,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
