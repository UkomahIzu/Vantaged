"use client";

/**
 * Shared cross-portal synchronization bridge between Owner Dashboard and Company Dashboard.
 * Ensures canonical project IDs, unified localStorage keys, and live cross-tab events.
 */

import {
  getContractorScopedKey,
  getContractorSession,
  getOwnerScopedKey,
  getOwnerSession,
  readRegisteredOwners,
} from "./vantagedAuth";

export function pushProjectStateToBackend(entries: Record<string, any>): void {
  if (typeof window === "undefined") return;
  fetch("/api/project-state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  }).catch(() => {});
}

export const DEMO_PROJECT_ID_SET = new Set([
  "proj-lekki",
  "proj-enclave",
  "proj-guzape",
  "proj-eko",
  "proj-banana",
  "proj-vi",
  "hist-ikoyi",
  "hist-ikoyi-99",
  "hist-vi-tech",
  "hist-chevron",
  "hist-epe-cold",
  "hist-maitama",
  "hist-asokoro",
]);

export function isDemoProjectId(projectId: string): boolean {
  const canonical = normalizeCanonicalProjectId(projectId);
  return DEMO_PROJECT_ID_SET.has(canonical) || canonical.startsWith("hist-");
}

/**
 * Initializes a brand-new project workspace from ZERO on BOTH the Owner Project Dashboard
 * and Company Project Dashboard (0% progress, ₦0 paid, ₦0 in escrow, 0 disputes, 0 change requests,
 * 0 proof photos, exact agreed stages, and empty shared conversation) and persists it to `/api/project-state`.
 */
export function initializeFreshProjectWorkspace(params: {
  projectId: string;
  title: string;
  location: string;
  category: string;
  contractValue: number;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerId?: string;
  companyId?: string;
  companyName: string;
  directorName: string;
  directorEmail?: string;
  typicalDuration?: string;
  stages?: Array<{ order: number; title: string; evidence: string; weightPercent?: number }>;
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);

  const rawStages =
    params.stages && params.stages.length > 0
      ? params.stages
      : [
          {
            order: 1,
            title: "Site Mobilization & Substructure",
            evidence: "Survey setting-out pegs, excavation log, blinding & rebar photos",
          },
          {
            order: 2,
            title: "Superstructure Frame & Blockwork",
            evidence: "Column formwork, lintels, concrete cube strength test certificates",
          },
          {
            order: 3,
            title: "Roofing, MEP Rough-in & Plastering",
            evidence: "Roof watertightness check, plumbing pressure test, wall screeding",
          },
          {
            order: 4,
            title: "Architectural Finishes & Handover",
            evidence: "Tiling inspection, fixtures check, client snagging sign-off",
          },
        ];

  const count = rawStages.length;
  const baseWeight = Math.floor(100 / count);
  const remainder = 100 - baseWeight * count;
  const baseBps = Math.floor(10000 / count);
  const remainderBps = 10000 - baseBps * count;

  // 1. Clean Owner Stages (0% approved, 0 proof photos, all checklists unchecked)
  const ownerStages = rawStages.map((stg, idx) => {
    const order = stg.order || idx + 1;
    const weightPercent =
      typeof stg.weightPercent === "number" && stg.weightPercent > 0
        ? stg.weightPercent
        : idx === count - 1
        ? baseWeight + remainder
        : baseWeight;
    const trancheAmount = Math.round((params.contractValue * weightPercent) / 100);
    const cleanTitle = stg.title.replace(/^Stage\s+\d+:\s*/i, "");
    return {
      id: `stg-${order}`,
      stageNumber: order,
      title: cleanTitle,
      category: params.category || "Construction",
      description: stg.evidence || "Geofenced site photos and inspection checklist.",
      weightPercent,
      trancheAmount,
      status: idx === 0 ? "In Progress" : "Scheduled",
      ballInCourt: idx === 0 ? "Contractor" : "Scheduled",
      startDate: idx === 0 ? "Ready to begin" : `Stage ${order}`,
      targetEndDate: params.typicalDuration || "Per Schedule",
      checklist: [
        {
          id: `chk-${order}-1`,
          label: stg.evidence || `Complete ${cleanTitle} and upload verified site proof`,
          isPassed: false,
        },
      ],
      proofMedia: [],
      comments: [],
      activityLog: [],
      issues: [],
    };
  });

  // 2. Clean Contractor Stages (1:1 mirror of Owner Stages)
  const contractorStages = ownerStages.map((os, idx) => {
    const weightBps = idx === count - 1 ? baseBps + remainderBps : baseBps;
    return {
      id: os.id,
      order: os.stageNumber,
      title: `Stage ${os.stageNumber}: ${os.title}`,
      summary: os.description,
      weightBps,
      trancheAmount: os.trancheAmount,
      status: idx === 0 ? "In Progress" : "Scheduled",
      dueDate: os.targetEndDate,
      checklist: os.checklist.map((c) => ({
        id: c.id,
        label: c.label,
        requiredProof: "Min 3 GPS Photos",
        isCompleted: false,
      })),
      proofItems: [],
      comments: [],
    };
  });

  // 3. Clean Owner Tranches (all Scheduled — ₦0 paid, ₦0 in escrow until Owner deposits)
  const ownerTranches = [
    ...ownerStages.map((os) => ({
      id: `trx-${os.stageNumber}`,
      trancheNumber: os.stageNumber,
      title: `Stage ${os.stageNumber}: ${os.title}`,
      stageLinked: `Stage ${os.stageNumber}: ${os.title}`,
      amount: os.trancheAmount,
      status: "Scheduled",
      dueDate: `Due upon approval of Stage ${os.stageNumber}`,
      paymentMethod: "Vantaged Secure Escrow",
      contractorConfirmed: false,
      notes: "Scheduled milestone payment — released only after you inspect and approve this stage.",
    })),
    {
      id: `trx-retention`,
      trancheNumber: ownerStages.length + 1,
      title: "5% Final Quality Guarantee Hold",
      stageLinked: "Final Handover",
      amount: Math.round(params.contractValue * 0.05),
      status: "Scheduled",
      dueDate: "Held until final handover warranty passes",
      paymentMethod: "Vantaged Secure Escrow",
      contractorConfirmed: false,
      notes: "5% retention protection held safely until handover defects check.",
    },
  ];

  // 4. Clean Contractor Tranches (all Upcoming — ₦0 confirmed, ₦0 awaiting confirmation)
  const contractorTranches = contractorStages.map((cs) => {
    const retainageAmount = Math.round(cs.trancheAmount * 0.05);
    return {
      id: `ctr-${cs.order}`,
      reference: `ESC-${canonicalId.slice(-4).toUpperCase()}-0${cs.order}`,
      stageTitle: cs.title,
      grossAmount: cs.trancheAmount,
      retainageAmount,
      netPayout: cs.trancheAmount - retainageAmount,
      status: "Upcoming",
    };
  });

  // 5. Clean Initial Site Team (just the real Company Director — zero fake demo crew)
  const initialTeam = [
    {
      id: `crew-dir-${Date.now()}`,
      name: params.directorName || "Project Director",
      role: "Director",
      phone: "Verified Company Director",
      email: params.directorEmail || "director@vantaged.ng",
      location: params.location || "Lagos, Nigeria",
      assigned: true,
      points: 0,
    },
  ];

  const entries: Record<string, any> = {
    [`vantaged_stages_${canonicalId}`]: ownerStages,
    [`vantaged_cproj_stages_${canonicalId}`]: contractorStages,
    [`vantaged_tranches_${canonicalId}`]: ownerTranches,
    [`vantaged_cproj_tranches_${canonicalId}`]: contractorTranches,
    [`vantaged_disputes_${canonicalId}`]: [],
    [`vantaged_cproj_issues_${canonicalId}`]: [],
    [`vantaged_cr_${canonicalId}`]: [],
    [`vantaged_cproj_variations_${canonicalId}`]: [],
    [`vantaged_cproj_team_${canonicalId}`]: initialTeam,
    [`vantaged_team_${canonicalId}`]: initialTeam,
  };

  try {
    for (const [key, val] of Object.entries(entries)) {
      localStorage.setItem(key, JSON.stringify(val));
    }
    pushProjectStateToBackend(entries);
    broadcastPortalSync();
  } catch {}
}

export const SHARED_SYNC_EVENT = "vantaged_storage_update";
export const CONTRACTOR_SYNC_EVENT = "vantaged_contractor_project_update";

const LEGACY_PROJECT_ID_ALIASES: Record<string, string> = {
  "prj-lekki-01": "proj-lekki",
  "prj-ikoyi-02": "proj-banana",
  "prj-abuja-03": "proj-guzape",
};

export function normalizeCanonicalProjectId(projectId: string): string {
  return LEGACY_PROJECT_ID_ALIASES[projectId] || projectId;
}

export function getCanonicalStorageKey(
  projectId: string,
  section: "stages" | "disputes" | "cr" | "tranches" | "chat" | "team"
): string {
  const id = normalizeCanonicalProjectId(projectId);
  return `vantaged_${section}_${id}`;
}

export function broadcastPortalSync(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
  window.dispatchEvent(new Event(CONTRACTOR_SYNC_EVENT));
}

export function readSharedJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeSharedJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    broadcastPortalSync();
  } catch {
    // ignore quota errors
  }
}

export interface CompanySentOwnerRequest {
  id: string;
  companyId?: string;
  companyName: string;
  directorName: string;
  ownerIdentifier: string;
  identifierType: "email" | "phone";
  title: string;
  location: string;
  category: string;
  budget: string;
  notes: string;
  status: "Pending Owner Review" | "Accepted" | "Declined";
  emailNoticeSent: boolean;
  sentAt: string;
  projectId?: string;
}

export interface OwnerLiveNotification {
  id: string;
  category: "inspection" | "escrow" | "site";
  projectTitle: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  linkUrl?: string;
}

export interface CompanyLiveNotification {
  id: string;
  category: "receipt" | "stage" | "request" | "site";
  projectTitle: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  href: string;
}

export interface SharedChatMessage {
  id: string;
  sender: "owner" | "contractor";
  senderName: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface SharedConversationThread {
  id: string;
  projectId: string;
  projectTitle: string;
  ownerId?: string;
  companyId?: string;
  ownerName: string;
  ownerPhone: string;
  contractorName: string;
  contractorRole: string;
  contractorCompany: string;
  contractorPhone: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  ownerUnreadCount: number;
  contractorUnreadCount: number;
  messages: SharedChatMessage[];
}

export const KEY_COMPANY_SENT_REQUESTS = "vantaged_company_sent_owner_requests";
export const KEY_OWNER_LIVE_NOTIFICATIONS = "vantaged_owner_live_notifications";
export const KEY_COMPANY_LIVE_NOTIFICATIONS = "vantaged_company_live_notifications";
export const KEY_SHARED_CONVERSATIONS = "vantaged_shared_conversations";

export const DEFAULT_SHARED_CONVERSATIONS: SharedConversationThread[] = [
  {
    id: "conv-lekki",
    projectId: "proj-lekki",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    ownerName: "Dr. James Arinze",
    ownerPhone: "+234 802 551 8890",
    contractorName: "Engr. Kenneth Adeleke",
    contractorRole: "Lead Site Engineer",
    contractorCompany: "Julius B. Consortium",
    contractorPhone: "+234 803 219 0042",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    isOnline: true,
    lastMessage:
      "Good day sir, the concrete slump test reports for the first floor deck have been uploaded.",
    lastMessageTime: "09:42 AM",
    ownerUnreadCount: 1,
    contractorUnreadCount: 0,
    messages: [
      {
        id: "msg-1",
        sender: "contractor",
        senderName: "Engr. Kenneth Adeleke",
        text: "Good morning Dr. Arinze. We commenced the rebar placement for the cantilever beams at 07:30 WAT.",
        timestamp: "08:15 AM",
        status: "read",
      },
      {
        id: "msg-2",
        sender: "owner",
        senderName: "Dr. James Arinze",
        text: "Good morning Engr. Adeleke. Please confirm the batch of Dangote 42.5R cement delivery was verified at the gate.",
        timestamp: "08:22 AM",
        status: "read",
      },
      {
        id: "msg-3",
        sender: "contractor",
        senderName: "Engr. Kenneth Adeleke",
        text: "Yes, verified 100%. Gate pass #WP-2092 logged by security. All 600 bags are stacked off-ground in the dry shed.",
        timestamp: "08:35 AM",
        status: "read",
      },
      {
        id: "msg-4",
        sender: "contractor",
        senderName: "Engr. Kenneth Adeleke",
        text: "Good day sir, the concrete slump test reports for the first floor deck have been uploaded.",
        timestamp: "09:42 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-banana",
    projectId: "proj-banana",
    projectTitle: "Banana Island Horizon Penthouse",
    ownerName: "Adanna Okafor",
    ownerPhone: "+234 809 331 4401",
    contractorName: "Engr. Kenneth Adeleke",
    contractorRole: "Managing Director",
    contractorCompany: "Julius B. Consortium",
    contractorPhone: "+234 803 219 0042",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    isOnline: false,
    lastMessage: "We are mobilizing the MEP conduit team for Stage 3 tomorrow morning.",
    lastMessageTime: "Yesterday",
    ownerUnreadCount: 0,
    contractorUnreadCount: 1,
    messages: [
      {
        id: "msg-201",
        sender: "owner",
        senderName: "Adanna Okafor",
        text: "Hi Kenneth, please confirm when the acoustic glazing samples will be ready on site.",
        timestamp: "Yesterday, 02:15 PM",
        status: "read",
      },
      {
        id: "msg-202",
        sender: "contractor",
        senderName: "Engr. Kenneth Adeleke",
        text: "We are mobilizing the MEP conduit team for Stage 3 tomorrow morning.",
        timestamp: "Yesterday, 04:45 PM",
        status: "read",
      },
    ],
  },
];

export function readCompanySentRequests(): CompanySentOwnerRequest[] {
  return readSharedJSON<CompanySentOwnerRequest[]>(KEY_COMPANY_SENT_REQUESTS, []);
}

export function saveCompanySentRequests(requests: CompanySentOwnerRequest[]): void {
  writeSharedJSON(KEY_COMPANY_SENT_REQUESTS, requests);
}

export function readOwnerLiveNotifications(): OwnerLiveNotification[] {
  return readSharedJSON<OwnerLiveNotification[]>(
    getOwnerScopedKey(KEY_OWNER_LIVE_NOTIFICATIONS),
    []
  );
}

export function saveOwnerLiveNotifications(items: OwnerLiveNotification[]): void {
  writeSharedJSON(getOwnerScopedKey(KEY_OWNER_LIVE_NOTIFICATIONS), items);
}

/**
 * Resolves owner & company participant identifiers for a projectId from local caches
 * so cross-browser notifications always route to the right recipient even when called
 * from the counterparty's browser.
 */
function resolveProjectParticipants(projectId?: string): {
  ownerId?: string;
  ownerEmail?: string;
  companyId?: string;
  companyName?: string;
} {
  if (!projectId || typeof window === "undefined") return {};
  const canonical = normalizeCanonicalProjectId(projectId);
  const result: {
    ownerId?: string;
    ownerEmail?: string;
    companyId?: string;
    companyName?: string;
  } = {};

  try {
    const dynRaw =
      localStorage.getItem(`vantaged_dynamic_plan_${canonical}`) ||
      localStorage.getItem(`vantaged_dynamic_plan_prop-${canonical.replace(/^proj-/, "")}`);
    if (dynRaw) {
      const dyn = JSON.parse(dynRaw);
      if (dyn?.ownerId) result.ownerId = dyn.ownerId;
      if (dyn?.ownerEmail || dyn?.ownerIdentifier) {
        result.ownerEmail = dyn.ownerEmail || dyn.ownerIdentifier;
      }
      if (dyn?.companyId) result.companyId = dyn.companyId;
      if (dyn?.companyName) result.companyName = dyn.companyName;
    }

    const keys = [
      "vantaged_company_accepted_projects",
      "vantaged_active_projects",
      getOwnerScopedKey("vantaged_active_projects"),
      KEY_SHARED_CONVERSATIONS,
    ];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) continue;
      const match = list.find(
        (item: any) =>
          normalizeCanonicalProjectId(item?.projectId || item?.id || "") === canonical
      );
      if (match) {
        if (!result.ownerId && match.ownerId) result.ownerId = match.ownerId;
        if (!result.ownerEmail && (match.ownerEmail || match.ownerIdentifier)) {
          result.ownerEmail = match.ownerEmail || match.ownerIdentifier;
        }
        if (!result.companyId && match.companyId) result.companyId = match.companyId;
        if (!result.companyName && (match.companyName || match.contractorCompany || match.contractor?.name)) {
          result.companyName =
            match.companyName || match.contractorCompany || match.contractor?.name;
        }
      }
    }
  } catch {}

  return result;
}

export function pushOwnerLiveNotification(
  notif: Omit<OwnerLiveNotification, "id" | "timestamp" | "isUnread"> & {
    targetOwnerIdentifier?: string;
    targetOwnerId?: string;
    projectId?: string;
  }
): OwnerLiveNotification {
  const { targetOwnerIdentifier, targetOwnerId, projectId, ...rest } = notif;
  const participants = resolveProjectParticipants(projectId);
  const created: OwnerLiveNotification = {
    ...rest,
    id: `live-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: "Just now",
    isUnread: true,
  };

  const resolvedEmail =
    targetOwnerIdentifier || participants.ownerEmail || getOwnerSession()?.email;
  let resolvedOwnerId =
    targetOwnerId || participants.ownerId || getOwnerSession()?.userId;
  let targetKey = resolvedOwnerId
    ? `${KEY_OWNER_LIVE_NOTIFICATIONS}__${resolvedOwnerId}`
    : getOwnerScopedKey(KEY_OWNER_LIVE_NOTIFICATIONS);

  if (resolvedEmail) {
    const cleanTarget = resolvedEmail.trim().toLowerCase();
    const matchedOwner = readRegisteredOwners().find(
      (o) =>
        o.email.trim().toLowerCase() === cleanTarget ||
        o.phone.replace(/\s+/g, "") === cleanTarget.replace(/\s+/g, "")
    );
    if (matchedOwner) {
      targetKey = `${KEY_OWNER_LIVE_NOTIFICATIONS}__${matchedOwner.id}`;
      resolvedOwnerId = matchedOwner.id;
    }
  }

  const existing = readSharedJSON<OwnerLiveNotification[]>(targetKey, []);
  writeSharedJSON(targetKey, [created, ...existing]);

  // Persist to backend notifications table
  if (typeof window !== "undefined") {
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...created,
        recipientType: "owner",
        recipientId: resolvedOwnerId,
        recipientEmail: resolvedEmail,
      }),
    }).catch(() => {});
  }

  return created;
}

export function markOwnerNotificationsRead(ids?: string[]): void {
  if (typeof window === "undefined") return;
  const current = readOwnerLiveNotifications();
  const idSet = ids && ids.length > 0 ? new Set(ids) : null;
  const updated = current.map((n) =>
    !idSet || idSet.has(n.id) ? { ...n, isUnread: false } : n
  );
  saveOwnerLiveNotifications(updated);

  const session = getOwnerSession();
  fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientType: "owner",
      recipientId: session?.userId,
      recipientEmail: session?.email,
      ...(idSet ? { ids } : { markAllRead: true }),
    }),
  }).catch(() => {});
}

export function deleteOwnerLiveNotification(id: string): void {
  if (typeof window === "undefined") return;
  const current = readOwnerLiveNotifications();
  saveOwnerLiveNotifications(current.filter((n) => n.id !== id));

  fetch(`/api/notifications?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  }).catch(() => {});
}

export function readCompanyLiveNotifications(): CompanyLiveNotification[] {
  return readSharedJSON<CompanyLiveNotification[]>(
    getContractorScopedKey(KEY_COMPANY_LIVE_NOTIFICATIONS),
    []
  );
}

export function pushCompanyLiveNotification(
  notif: Omit<CompanyLiveNotification, "id" | "timestamp" | "isUnread"> & {
    targetCompanyId?: string;
    targetCompanyEmail?: string;
    targetCompanyName?: string;
    projectId?: string;
  }
): CompanyLiveNotification {
  const {
    targetCompanyId,
    targetCompanyEmail,
    targetCompanyName,
    projectId,
    ...rest
  } = notif;
  const participants = resolveProjectParticipants(projectId);
  const created: CompanyLiveNotification = {
    ...rest,
    id: `comp-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: "Just now",
    isUnread: true,
  };
  const resolvedCompanyId =
    targetCompanyId || participants.companyId || getContractorSession()?.userId;
  const resolvedCompanyName =
    targetCompanyName || participants.companyName || getContractorSession()?.companyName;
  const resolvedCompanyEmail =
    targetCompanyEmail || getContractorSession()?.email;

  const scopedKey = resolvedCompanyId
    ? `${KEY_COMPANY_LIVE_NOTIFICATIONS}__${resolvedCompanyId}`
    : getContractorScopedKey(KEY_COMPANY_LIVE_NOTIFICATIONS);
  const existing = readSharedJSON<CompanyLiveNotification[]>(scopedKey, []);
  writeSharedJSON(scopedKey, [created, ...existing]);

  // Persist to backend notifications table
  if (typeof window !== "undefined") {
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...created,
        recipientType: "company",
        recipientId: resolvedCompanyId,
        recipientEmail: resolvedCompanyEmail,
        recipientCompanyName: resolvedCompanyName,
      }),
    }).catch(() => {});
  }

  return created;
}

export function saveCompanyLiveNotifications(items: CompanyLiveNotification[]): void {
  writeSharedJSON(getContractorScopedKey(KEY_COMPANY_LIVE_NOTIFICATIONS), items);
}

export function markCompanyNotificationsRead(ids?: string[]): void {
  if (typeof window === "undefined") return;
  const current = readCompanyLiveNotifications();
  const idSet = ids && ids.length > 0 ? new Set(ids) : null;
  const updated = current.map((n) =>
    !idSet || idSet.has(n.id) ? { ...n, isUnread: false } : n
  );
  saveCompanyLiveNotifications(updated);

  const session = getContractorSession();
  fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientType: "company",
      recipientId: session?.userId,
      recipientEmail: session?.email,
      recipientCompanyName: session?.companyName,
      ...(idSet ? { ids } : { markAllRead: true }),
    }),
  }).catch(() => {});
}

export function deleteCompanyLiveNotification(id: string): void {
  if (typeof window === "undefined") return;
  const current = readCompanyLiveNotifications();
  saveCompanyLiveNotifications(current.filter((n) => n.id !== id));

  fetch(`/api/notifications?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  }).catch(() => {});
}

const DEMO_CONVERSATION_IDS = new Set(DEFAULT_SHARED_CONVERSATIONS.map((c) => c.id));

export function readSharedConversations(includeDemoFallback = true): SharedConversationThread[] {
  const stored = readSharedJSON<SharedConversationThread[] | null>(
    KEY_SHARED_CONVERSATIONS,
    null
  );
  if (Array.isArray(stored) && stored.length > 0) {
    return includeDemoFallback
      ? stored
      : stored.filter((c) => !DEMO_CONVERSATION_IDS.has(c.id));
  }
  return includeDemoFallback ? DEFAULT_SHARED_CONVERSATIONS : [];
}

export function ensureProjectConversation(params: {
  projectId: string;
  projectTitle: string;
  ownerName: string;
  ownerId?: string;
  companyId?: string;
  contractorName: string;
  contractorCompany: string;
}): SharedConversationThread {
  const existing = readSharedConversations(false);
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const found = existing.find((t) => t.projectId === canonicalId);
  if (found) return found;

  const created: SharedConversationThread = {
    id: `conv-${canonicalId}`,
    projectId: canonicalId,
    projectTitle: params.projectTitle,
    ownerId: params.ownerId,
    companyId: params.companyId,
    ownerName: params.ownerName,
    ownerPhone: "Verified Owner",
    contractorName: params.contractorName,
    contractorRole: "Project Director",
    contractorCompany: params.contractorCompany,
    contractorPhone: "Verified Builder",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    isOnline: true,
    lastMessage: "Project conversation opened. Send your first message.",
    lastMessageTime: "Just now",
    ownerUnreadCount: 0,
    contractorUnreadCount: 0,
    messages: [],
  };
  saveSharedConversations([created, ...existing]);
  if (typeof window !== "undefined") {
    fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(created),
    }).catch(() => {});
  }
  return created;
}

export function saveSharedConversations(threads: SharedConversationThread[]): void {
  writeSharedJSON(KEY_SHARED_CONVERSATIONS, threads);
}

export function appendSharedMessage(params: {
  conversationId: string;
  sender: "owner" | "contractor";
  senderName: string;
  text: string;
}): SharedConversationThread[] {
  const threads = readSharedConversations();
  const newMsg: SharedChatMessage = {
    id: `msg-${Date.now()}`,
    sender: params.sender,
    senderName: params.senderName,
    text: params.text.trim(),
    timestamp: "Just now",
    status: "delivered",
  };

  let targetThread: SharedConversationThread | null = null;
  const updated = threads.map((t) => {
    if (t.id !== params.conversationId) return t;
    targetThread = t;
    return {
      ...t,
      lastMessage: newMsg.text,
      lastMessageTime: "Just now",
      ownerUnreadCount:
        params.sender === "contractor" ? t.ownerUnreadCount + 1 : 0,
      contractorUnreadCount:
        params.sender === "owner" ? t.contractorUnreadCount + 1 : 0,
      messages: [...t.messages, newMsg],
    };
  });

  saveSharedConversations(updated);

  if (typeof window !== "undefined") {
    fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "append_message",
        conversationId: params.conversationId,
        sender: params.sender,
        senderName: params.senderName,
        text: params.text.trim(),
      }),
    }).catch(() => {});
  }

  if (targetThread) {
    const t = targetThread as SharedConversationThread;
    if (params.sender === "owner") {
      pushCompanyLiveNotification({
        targetCompanyId: t.companyId,
        category: "site",
        projectTitle: t.projectTitle,
        title: `New message from ${params.senderName}`,
        description: newMsg.text.slice(0, 110),
        href: `/contractor/messages?conv=${t.id}`,
      });
    } else {
      pushOwnerLiveNotification({
        targetOwnerId: t.ownerId,
        category: "site",
        projectTitle: t.projectTitle,
        title: `New message from ${params.senderName}`,
        description: newMsg.text.slice(0, 110),
        linkUrl: `/owner/messages`,
      });
    }
  }

  return updated;
}

export function markConversationRead(
  conversationId: string,
  viewer: "owner" | "contractor"
): SharedConversationThread[] {
  const threads = readSharedConversations();
  const updated = threads.map((t) => {
    if (t.id !== conversationId) return t;
    return viewer === "owner"
      ? { ...t, ownerUnreadCount: 0 }
      : { ...t, contractorUnreadCount: 0 };
  });
  saveSharedConversations(updated);
  if (typeof window !== "undefined") {
    fetch("/api/conversations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, viewer }),
    }).catch(() => {});
  }
  return updated;
}

/**
 * Pulls latest projects, incoming company requests, notifications, conversations,
 * and shared project state from backend APIs into the Owner's live view.
 */
export async function hydrateOwnerPortalFromBackend(): Promise<void> {
  if (typeof window === "undefined") return;
  const session = getOwnerSession();
  if (!session?.userId) return;

  try {
    const [projRes, reqRes, notifRes, convRes, stateRes] = await Promise.all([
      fetch(`/api/projects?ownerId=${encodeURIComponent(session.userId)}`, { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null),
      fetch(
        `/api/project-requests?direction=company_to_owner&ownerIdentifier=${encodeURIComponent(
          session.email
        )}`,
        { cache: "no-store" }
      )
        .then((r) => r.json())
        .catch(() => null),
      fetch(
        `/api/notifications?recipientType=owner&recipientId=${encodeURIComponent(
          session.userId
        )}&recipientEmail=${encodeURIComponent(session.email)}`,
        { cache: "no-store" }
      )
        .then((r) => r.json())
        .catch(() => null),
      fetch(`/api/conversations?ownerId=${encodeURIComponent(session.userId)}`, {
        cache: "no-store",
      })
        .then((r) => r.json())
        .catch(() => null),
      fetch("/api/project-state", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null),
    ]);

    let changed = false;
    const syncKey = (key: string, nextValue: any) => {
      const nextStr = JSON.stringify(nextValue);
      if (localStorage.getItem(key) !== nextStr) {
        localStorage.setItem(key, nextStr);
        changed = true;
      }
    };

    const mergeByIdKey = (key: string, remoteItems: any[]) => {
      if (!Array.isArray(remoteItems) || remoteItems.length === 0) return;
      let localItems: any[] = [];
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localItems = parsed;
        }
      } catch {}
      const map = new Map<string, any>();
      for (const item of localItems) if (item?.id) map.set(item.id, item);
      for (const item of remoteItems) {
        if (!item?.id) continue;
        const prev = map.get(item.id);
        map.set(item.id, prev ? { ...prev, ...item } : item);
      }
      syncKey(key, Array.from(map.values()));
    };

    if (projRes?.success && Array.isArray(projRes.data)) {
      mergeByIdKey(getOwnerScopedKey("vantaged_active_projects"), projRes.data);
    }
    if (reqRes?.success && Array.isArray(reqRes.data) && reqRes.data.length > 0) {
      syncKey(KEY_COMPANY_SENT_REQUESTS, reqRes.data);
    }
    if (notifRes?.success && Array.isArray(notifRes.data)) {
      // Authoritative server sync for notifications so read/deleted states persist cleanly
      syncKey(getOwnerScopedKey(KEY_OWNER_LIVE_NOTIFICATIONS), notifRes.data);
    }
    if (convRes?.success && Array.isArray(convRes.data)) {
      mergeByIdKey(KEY_SHARED_CONVERSATIONS, convRes.data);
    }
    if (stateRes?.success && stateRes.data && typeof stateRes.data === "object") {
      for (const [k, v] of Object.entries(stateRes.data)) {
        syncKey(k, v);
      }
    }

    if (changed) {
      broadcastPortalSync();
    }
  } catch {
    // ignore transient fetch errors
  }
}

/**
 * Pulls latest projects, owner briefs, notifications, conversations,
 * and shared project state from backend APIs into the Company's live view.
 */
export async function hydrateContractorPortalFromBackend(): Promise<void> {
  if (typeof window === "undefined") return;
  const session = getContractorSession();
  if (!session?.userId) return;

  try {
    const [projRes, briefRes, notifRes, convRes, stateRes] = await Promise.all([
      fetch(
        `/api/projects?companyId=${encodeURIComponent(
          session.userId
        )}&companyName=${encodeURIComponent(session.companyName || "")}`,
        {
          cache: "no-store",
        }
      )
        .then((r) => r.json())
        .catch(() => null),
      fetch(
        `/api/project-requests?direction=owner_to_company&companyId=${encodeURIComponent(
          session.userId
        )}&companyName=${encodeURIComponent(session.companyName)}`,
        { cache: "no-store" }
      )
        .then((r) => r.json())
        .catch(() => null),
      fetch(
        `/api/notifications?recipientType=company&recipientId=${encodeURIComponent(
          session.userId
        )}&recipientEmail=${encodeURIComponent(
          session.email
        )}&recipientCompanyName=${encodeURIComponent(session.companyName || "")}`,
        { cache: "no-store" }
      )
        .then((r) => r.json())
        .catch(() => null),
      fetch(`/api/conversations?companyId=${encodeURIComponent(session.userId)}`, {
        cache: "no-store",
      })
        .then((r) => r.json())
        .catch(() => null),
      fetch("/api/project-state", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null),
    ]);

    let changed = false;
    const syncKey = (key: string, nextValue: any) => {
      const nextStr = JSON.stringify(nextValue);
      if (localStorage.getItem(key) !== nextStr) {
        localStorage.setItem(key, nextStr);
        changed = true;
      }
    };

    const mergeByIdKey = (key: string, remoteItems: any[]) => {
      if (!Array.isArray(remoteItems) || remoteItems.length === 0) return;
      let localItems: any[] = [];
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localItems = parsed;
        }
      } catch {}
      const map = new Map<string, any>();
      for (const item of localItems) if (item?.id) map.set(item.id, item);
      for (const item of remoteItems) {
        if (!item?.id) continue;
        const prev = map.get(item.id);
        map.set(item.id, prev ? { ...prev, ...item } : item);
      }
      syncKey(key, Array.from(map.values()));
    };

    if (projRes?.success && Array.isArray(projRes.data)) {
      mergeByIdKey("vantaged_company_accepted_projects", projRes.data);
    }
    if (briefRes?.success && Array.isArray(briefRes.data) && briefRes.data.length > 0) {
      syncKey("vantaged_project_briefs", briefRes.data);
    }
    if (notifRes?.success && Array.isArray(notifRes.data)) {
      // Authoritative server sync for notifications so read/deleted states persist cleanly
      syncKey(getContractorScopedKey(KEY_COMPANY_LIVE_NOTIFICATIONS), notifRes.data);
    }
    if (convRes?.success && Array.isArray(convRes.data)) {
      mergeByIdKey(KEY_SHARED_CONVERSATIONS, convRes.data);
    }
    if (stateRes?.success && stateRes.data && typeof stateRes.data === "object") {
      for (const [k, v] of Object.entries(stateRes.data)) {
        syncKey(k, v);
      }
    }

    if (changed) {
      window.dispatchEvent(new Event("vantaged_company_projects_update"));
      broadcastPortalSync();
    }
  } catch {
    // ignore transient fetch errors
  }
}

/**
 * Syncs Company-updated stages (checklist, proof uploads, Ready for Review)
 * into Owner's `vantaged_stages_${canonicalId}` store.
 */
export function syncContractorStagesToOwner(
  projectId: string,
  contractorStages: Array<{
    id: string;
    order: number;
    title: string;
    summary: string;
    weightBps: number;
    trancheAmount: number;
    status: string;
    dueDate: string;
    checklist: Array<{
      id: string;
      label: string;
      isCompleted: boolean;
      ownerNote?: string;
    }>;
    proofItems: Array<{
      id: string;
      type: "photo" | "video" | "lab_report";
      title: string;
      caption: string;
      uploadedAt: string;
      uploadedBy: string;
      gpsCoords: string;
      checklistItemId?: string;
      thumbnailUrl?: string;
    }>;
    comments: Array<{
      id: string;
      authorName: string;
      authorRole: string;
      text: string;
      timestamp: string;
      isCompany: boolean;
    }>;
  }>
): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(projectId);
  const ownerKey = `vantaged_stages_${canonicalId}`;

  try {
    const existingRaw = localStorage.getItem(ownerKey);
    const existingOwnerStages: any[] = existingRaw ? JSON.parse(existingRaw) : [];

    const mapped = contractorStages.map((cs) => {
      const prevOwner =
        existingOwnerStages.find(
          (os: any) => os.stageNumber === cs.order || os.id === cs.id
        ) || null;

      const ownerStatus =
        cs.status === "Fix Requested" ? "In Progress" : cs.status;

      return {
        ...(prevOwner || {}),
        id: prevOwner?.id || cs.id,
        stageNumber: cs.order,
        title: cs.title.replace(/^Stage\s+\d+:\s*/i, ""),
        category: prevOwner?.category || "Construction",
        description: cs.summary,
        weightPercent: Math.round(cs.weightBps / 100),
        trancheAmount: cs.trancheAmount,
        status: ownerStatus,
        ballInCourt:
          cs.status === "Ready for Review"
            ? "Owner Review Required"
            : cs.status === "Fix Requested"
            ? "Contractor (Fixing Issues)"
            : cs.status === "Approved"
            ? "Completed"
            : "Contractor",
        startDate: prevOwner?.startDate || "In schedule",
        targetEndDate: cs.dueDate,
        checklist: cs.checklist.map((item) => ({
          id: item.id,
          label: item.label,
          isPassed: item.isCompleted,
          notes: item.ownerNote,
        })),
        proofMedia: cs.proofItems.map((p) => ({
          id: p.id,
          type: p.type === "video" ? "video" : "photo",
          title: p.title,
          url:
            p.thumbnailUrl ||
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
          gpsLocation: p.gpsCoords,
          gpsCoordinates: p.gpsCoords,
          withinSite: true,
          timestamp: p.uploadedAt,
          uploadedBy: p.uploadedBy,
          checklistItemId: p.checklistItemId,
        })),
        comments: cs.comments.map((cm) => ({
          id: cm.id,
          authorName: cm.authorName,
          authorRole: cm.authorRole,
          text: cm.text,
          timestamp: cm.timestamp,
          isClient: !cm.isCompany,
        })),
      };
    });

    localStorage.setItem(ownerKey, JSON.stringify(mapped));
    pushProjectStateToBackend({ [ownerKey]: mapped });

    // Notify owner if any stage newly transitioned to Ready for Review
    const newlyReady = contractorStages.find((cs) => {
      if (cs.status !== "Ready for Review") return false;
      const prevOwner = existingOwnerStages.find(
        (os: any) => os.stageNumber === cs.order || os.id === cs.id
      );
      return prevOwner && prevOwner.status !== "Ready for Review";
    });

    if (newlyReady) {
      pushOwnerLiveNotification({
        projectId: canonicalId,
        category: "inspection",
        projectTitle: newlyReady.title,
        title: `${newlyReady.title} is Ready for Your Review`,
        description: `The contractor uploaded proof and submitted this stage for your inspection and approval.`,
        linkUrl: `/owner/projects/${canonicalId}/stages`,
      });
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Syncs Owner's stage comment directly into both `vantaged_stages_${canonicalId}`
 * and Company's `vantaged_cproj_stages_${canonicalId}` + backend `/api/project-state`.
 */
export function syncOwnerStageCommentToContractor(params: {
  projectId: string;
  stageId: string;
  stageNumber?: number;
  authorName: string;
  text: string;
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const companyStagesKey = `vantaged_cproj_stages_${canonicalId}`;
  const ownerStagesKey = `vantaged_stages_${canonicalId}`;
  const commentId = `cm-owner-${Date.now()}`;

  try {
    const entries: Record<string, any> = {};

    const cRaw = localStorage.getItem(companyStagesKey);
    if (cRaw) {
      const stages = JSON.parse(cRaw);
      if (Array.isArray(stages)) {
        const updated = stages.map((s: any) => {
          const isMatch =
            s.id === params.stageId ||
            (params.stageNumber !== undefined && s.order === params.stageNumber);
          if (!isMatch) return s;
          return {
            ...s,
            comments: [
              ...(Array.isArray(s.comments) ? s.comments : []),
              {
                id: commentId,
                authorName: params.authorName,
                authorRole: "Property Owner",
                text: params.text,
                timestamp: "Just now",
                isCompany: false,
              },
            ],
          };
        });
        localStorage.setItem(companyStagesKey, JSON.stringify(updated));
        entries[companyStagesKey] = updated;
      }
    }

    const oRaw = localStorage.getItem(ownerStagesKey);
    if (oRaw) {
      const stages = JSON.parse(oRaw);
      if (Array.isArray(stages)) {
        const updated = stages.map((s: any) => {
          const isMatch =
            s.id === params.stageId ||
            (params.stageNumber !== undefined && s.stageNumber === params.stageNumber);
          if (!isMatch) return s;
          return {
            ...s,
            comments: [
              ...(Array.isArray(s.comments) ? s.comments : []),
              {
                id: commentId,
                authorName: params.authorName,
                authorRole: "Building Owner (You)",
                text: params.text,
                timestamp: "Just now",
                isClient: true,
              },
            ],
          };
        });
        localStorage.setItem(ownerStagesKey, JSON.stringify(updated));
        entries[ownerStagesKey] = updated;
      }
    }

    if (Object.keys(entries).length > 0) {
      pushProjectStateToBackend(entries);
    }

    pushCompanyLiveNotification({
      projectId: canonicalId,
      category: "stage",
      projectTitle: `Stage ${params.stageNumber || ""}`.trim() || "Site Update",
      title: `New Stage Comment from ${params.authorName}`,
      description: params.text.slice(0, 110),
      href: `/contractor/projects/${canonicalId}/stages/${params.stageId}`,
    });

    broadcastPortalSync();
  } catch {}
}

/**
 * Syncs an Owner Escrow Deposit into Company's tranches (`Upcoming` -> `Held in Escrow`)
 * so both dashboards reflect funded milestone coverage in real time.
 */
export function syncOwnerEscrowDepositToContractor(params: {
  projectId: string;
  projectTitle: string;
  amountNaira: number;
  reference: string;
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const companyTranchesKey = `vantaged_cproj_tranches_${canonicalId}`;

  try {
    const raw = localStorage.getItem(companyTranchesKey);
    if (raw) {
      const tranches = JSON.parse(raw);
      if (Array.isArray(tranches)) {
        let remaining = params.amountNaira;
        const updated = tranches.map((t: any) => {
          if (t.status === "Upcoming" && remaining > 0) {
            remaining -= Number(t.grossAmount || 0);
            return {
              ...t,
              status: "Held in Escrow",
              reference: params.reference || t.reference,
            };
          }
          return t;
        });
        localStorage.setItem(companyTranchesKey, JSON.stringify(updated));
        pushProjectStateToBackend({ [companyTranchesKey]: updated });
      }
    }

    pushCompanyLiveNotification({
      projectId: canonicalId,
      category: "receipt",
      projectTitle: params.projectTitle,
      title: `Owner Funded Escrow: ₦${params.amountNaira.toLocaleString("en-NG")}`,
      description: `Escrow deposit verified (${params.reference}). Milestone funds are now secured for upcoming stages.`,
      href: `/contractor/projects/${canonicalId}/transactions`,
    });

    broadcastPortalSync();
  } catch {}
}

/**
 * Syncs Company's assigned site team into Owner's `vantaged_team_${canonicalId}`
 * so Owner's Site & Team page always displays the real assigned engineers & crew.
 */
export function syncContractorTeamToOwner(
  projectId: string,
  team: Array<any>
): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(projectId);
  const ownerTeamKey = `vantaged_team_${canonicalId}`;
  try {
    localStorage.setItem(ownerTeamKey, JSON.stringify(team));
    pushProjectStateToBackend({ [ownerTeamKey]: team });
  } catch {}
}

/**
 * Syncs Owner's Approve or Request Fix decision directly into Company's
 * `vantaged_cproj_stages_${canonicalId}` (and `vantaged_cproj_issues_${canonicalId}` on fix).
 */
export function syncOwnerStageDecisionToContractor(params: {
  projectId: string;
  stageNumber?: number;
  stageId: string;
  stageTitle: string;
  decision: "APPROVED" | "FIX_REQUESTED";
  failedChecklistIds?: string[];
  fixNote?: string;
  ownerName?: string;
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const companyStagesKey = `vantaged_cproj_stages_${canonicalId}`;
  const ownerStagesKey = `vantaged_stages_${canonicalId}`;

  try {
    const stateBatch: Record<string, any> = {};

    // Helper: advance the first Scheduled stage after an Approved stage to "In Progress"
    const advanceNextStage = (list: any[]) => {
      const hasInProgress = list.some(
        (s) => s.status === "In Progress" || s.status === "Ready for Review" || s.status === "Fix Requested"
      );
      if (hasInProgress) return list;
      let advanced = false;
      return list.map((s) => {
        if (!advanced && s.status === "Scheduled") {
          advanced = true;
          return { ...s, status: "In Progress" };
        }
        return s;
      });
    };

    let approvedCount = 0;
    let totalStagesCount = 0;
    let approvedStageTrancheAmount = 0;

    // 1. Update Owner stages in backend state (and advance next Scheduled stage on approval)
    const ownerRaw = localStorage.getItem(ownerStagesKey);
    if (ownerRaw) {
      const oStages = JSON.parse(ownerRaw);
      if (Array.isArray(oStages)) {
        const nextOwnerStages =
          params.decision === "APPROVED" ? advanceNextStage(oStages) : oStages;
        localStorage.setItem(ownerStagesKey, JSON.stringify(nextOwnerStages));
        stateBatch[ownerStagesKey] = nextOwnerStages;
        approvedCount = nextOwnerStages.filter((s: any) => s.status === "Approved").length;
        totalStagesCount = nextOwnerStages.length;
        const matchedOwnerStage = nextOwnerStages.find(
          (s: any) =>
            s.id === params.stageId ||
            (params.stageNumber !== undefined && s.stageNumber === params.stageNumber)
        );
        if (matchedOwnerStage?.trancheAmount) {
          approvedStageTrancheAmount = Number(matchedOwnerStage.trancheAmount) || 0;
        }
      }
    }

    // 2. Update Company stages
    const raw = localStorage.getItem(companyStagesKey);
    if (raw) {
      const stages = JSON.parse(raw);
      if (Array.isArray(stages)) {
        let updated = stages.map((s: any) => {
          const isMatch =
            s.id === params.stageId ||
            (params.stageNumber !== undefined && s.order === params.stageNumber);
          if (!isMatch) return s;

          if (params.decision === "APPROVED") {
            if (!approvedStageTrancheAmount && s.trancheAmount) {
              approvedStageTrancheAmount = Number(s.trancheAmount) || 0;
            }
            return {
              ...s,
              status: "Approved",
              approvedAt: "Today",
              checklist: Array.isArray(s.checklist)
                ? s.checklist.map((c: any) => ({ ...c, isCompleted: true, ownerFlagged: false }))
                : s.checklist,
            };
          }

          const failedSet = new Set(params.failedChecklistIds || []);
          return {
            ...s,
            status: "Fix Requested",
            checklist: Array.isArray(s.checklist)
              ? s.checklist.map((c: any, idx: number) =>
                  failedSet.has(c.id) || (failedSet.size === 0 && idx === 0)
                    ? {
                        ...c,
                        isCompleted: false,
                        ownerFlagged: true,
                        ownerNote: params.fixNote || "Owner requested a fix on this item.",
                      }
                    : c
                )
              : s.checklist,
          };
        });
        if (params.decision === "APPROVED") {
          updated = advanceNextStage(updated);
          approvedCount = updated.filter((s: any) => s.status === "Approved").length;
          totalStagesCount = updated.length;
        }
        localStorage.setItem(companyStagesKey, JSON.stringify(updated));
        stateBatch[companyStagesKey] = updated;
      }
    }

    // 3. When Owner approves a stage, release its payment into Company's 3-day Confirm Receipt queue
    //    AND update progress % on both Owner & Company Active Project folder cards
    if (params.decision === "APPROVED") {
      const nipRef = `NIP-${Date.now().toString().slice(-8)}`;
      const companyTranchesKey = `vantaged_cproj_tranches_${canonicalId}`;
      const cTranchesRaw = localStorage.getItem(companyTranchesKey);
      if (cTranchesRaw) {
        const cTranches = JSON.parse(cTranchesRaw);
        if (Array.isArray(cTranches)) {
          const updatedCTranches = cTranches.map((t: any, idx: number) => {
            const titleMatch =
              t.stageTitle?.toLowerCase().includes(params.stageTitle.toLowerCase()) ||
              (params.stageNumber !== undefined &&
                (t.stageTitle?.toLowerCase().startsWith(`stage ${params.stageNumber}`) ||
                  idx + 1 === params.stageNumber));
            if (titleMatch && t.status !== "Receipt Confirmed") {
              return {
                ...t,
                reference: nipRef,
                bankSessionId: nipRef,
                status: "Awaiting Your Confirmation",
                disbursedDate: "Today",
                confirmDeadline: "Day 1 of 3 (72h left)",
              };
            }
            return t;
          });
          localStorage.setItem(companyTranchesKey, JSON.stringify(updatedCTranches));
          stateBatch[companyTranchesKey] = updatedCTranches;
        }
      }

      const ownerTranchesKey = `vantaged_tranches_${canonicalId}`;
      const oTranchesRaw = localStorage.getItem(ownerTranchesKey);
      const oTranches: any[] = oTranchesRaw ? JSON.parse(oTranchesRaw) : [];
      if (Array.isArray(oTranches) && oTranches.length > 0) {
        const updatedOTranches = oTranches.map((t: any) => {
          const match =
            t.stageLinked?.toLowerCase().includes(params.stageTitle.toLowerCase()) ||
            t.title?.toLowerCase().includes(params.stageTitle.toLowerCase()) ||
            (params.stageNumber !== undefined && t.trancheNumber === params.stageNumber);
          if (match) {
            return {
              ...t,
              status: "Paid to Builder",
              paidDate: "Today",
              bankSessionId: nipRef,
              contractorConfirmed: false,
            };
          }
          return t;
        });
        localStorage.setItem(ownerTranchesKey, JSON.stringify(updatedOTranches));
        stateBatch[ownerTranchesKey] = updatedOTranches;
      }

      // Sync live verified progress % on Active Project folder cards (Owner + Company + /api/projects)
      if (totalStagesCount > 0) {
        const nextPct = Math.round((approvedCount / totalStagesCount) * 100);
        const updateFolderList = (storageKey: string) => {
          try {
            const listRaw = localStorage.getItem(storageKey);
            if (!listRaw) return;
            const list = JSON.parse(listRaw);
            if (!Array.isArray(list)) return;
            const nextList = list.map((p: any) =>
              normalizeCanonicalProjectId(p.id) === canonicalId
                ? {
                    ...p,
                    milestonesCount: approvedCount,
                    milestonesTotal: totalStagesCount,
                    progressPercent: nextPct,
                    lastUpdated: "Today, Just now",
                  }
                : p
            );
            localStorage.setItem(storageKey, JSON.stringify(nextList));
          } catch {}
        };
        updateFolderList("vantaged_active_projects");
        updateFolderList(getOwnerScopedKey("vantaged_active_projects"));
        updateFolderList("vantaged_company_accepted_projects");
        window.dispatchEvent(new Event("vantaged_company_projects_update"));

        fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: canonicalId,
            milestonesCount: approvedCount,
            milestonesTotal: totalStagesCount,
            progressPercent: nextPct,
          }),
        }).catch(() => {});
      }

      pushCompanyLiveNotification({
        projectId: canonicalId,
        category: "receipt",
        projectTitle: params.stageTitle,
        title: `Owner Approved ${params.stageTitle} — Confirm Payment Receipt (3d)`,
        description: `Payment transfer ${nipRef} has been released via Paystack Escrow. Confirm bank receipt within 3 days.`,
        href: `/contractor/projects/${canonicalId}/transactions`,
      });

      // Trigger backend Paystack stage payout record & transfer
      fetch("/api/paystack/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: canonicalId,
          stageTitle: params.stageTitle,
          amountNaira: approvedStageTrancheAmount || 15000000,
        }),
      }).catch(() => {});
    }

    if (params.decision === "FIX_REQUESTED") {
      const issuesKey = `vantaged_cproj_issues_${canonicalId}`;
      const issuesRaw = localStorage.getItem(issuesKey);
      const existingIssues = issuesRaw ? JSON.parse(issuesRaw) : [];
      const fixCode = `FIX-${Date.now().toString().slice(-4)}`;
      const fixId = `iss-${Date.now()}`;
      const fixTitle = params.fixNote?.trim() || `Fix requested on ${params.stageTitle}`;
      const newIssue = {
        id: fixId,
        code: fixCode,
        kind: "Fix Request",
        title: fixTitle,
        stageTitle: params.stageTitle,
        severity: "Moderate Defect",
        status: "Action Required",
        escalationTier: "Tier 1: Direct Fix",
        responseWindowHours: 48,
        severityMaxAllowedDays: 14,
        raisedBy: params.ownerName || "Property Owner",
        openedDate: "Just now",
        deadlineLabel: "48 hours to send fix plan",
        heldAmount: approvedStageTrancheAmount || 0,
        ownerDescription:
          params.fixNote?.trim() ||
          "Owner flagged checklist items during stage review. Please upload fresh proof and resubmit.",
        counterEvidence: [],
        timeline: [
          {
            id: `tl-${Date.now()}`,
            actor: params.ownerName || "Property Owner",
            action: `Requested fix on ${params.stageTitle}`,
            time: "Just now",
          },
        ],
      };
      const nextIssues = [
        newIssue,
        ...(Array.isArray(existingIssues) ? existingIssues : []),
      ];
      localStorage.setItem(issuesKey, JSON.stringify(nextIssues));
      stateBatch[issuesKey] = nextIssues;

      // Mirror the fix request into Owner's Fixes & Disputes store as well
      const ownerDisputesKey = `vantaged_disputes_${canonicalId}`;
      const oDispRaw = localStorage.getItem(ownerDisputesKey);
      const existingOwnerDisp = oDispRaw ? JSON.parse(oDispRaw) : [];
      const ownerDispRecord = {
        id: fixId,
        disputeCode: fixCode,
        title: fixTitle,
        category: "Quality of Work",
        linkedStage: params.stageTitle,
        linkedTrancheAmount: approvedStageTrancheAmount || 0,
        escrowQuarantineAmount: approvedStageTrancheAmount || 0,
        status: "Active Dispute",
        escalationTier: "Tier 1: Direct Contractor Rectification",
        openedDate: "Just now",
        daysRemaining: 2,
        cureNoticeDeadline: "In 48 Hours",
        raisedBy: params.ownerName || "Property Owner",
        defectSeverity: "Moderate Defect",
        cureStatus: "Awaiting Builder Response",
        responseWindowHoursRemaining: 48,
        whatHappened:
          params.fixNote?.trim() ||
          "Owner flagged checklist items during stage review.",
        builderReply: "Awaiting contractor fix plan.",
        timelineEvents: [
          {
            id: `tl-${Date.now()}`,
            timestamp: "Just now",
            author: params.ownerName || "Property Owner",
            role: "Owner",
            tier: "Tier 1: Direct Contractor Rectification",
            action: `Fix Requested on ${params.stageTitle}`,
            notes: params.fixNote?.trim() || "Checklist items flagged for rectification.",
          },
        ],
      };
      const nextOwnerDisp = [
        ownerDispRecord,
        ...(Array.isArray(existingOwnerDisp) ? existingOwnerDisp : []),
      ];
      localStorage.setItem(ownerDisputesKey, JSON.stringify(nextOwnerDisp));
      stateBatch[ownerDisputesKey] = nextOwnerDisp;

      pushCompanyLiveNotification({
        projectId: canonicalId,
        category: "stage",
        projectTitle: params.stageTitle,
        title: `Fix Requested on ${params.stageTitle}`,
        description:
          params.fixNote?.trim() ||
          "Property Owner flagged checklist items. Reply with a Fix Plan within 48 hours.",
        href: `/contractor/projects/${canonicalId}/disputes`,
      });
    }

    if (Object.keys(stateBatch).length > 0) {
      pushProjectStateToBackend(stateBatch);
    }

    broadcastPortalSync();
  } catch {
    // ignore storage errors
  }
}

/**
 * Syncs Company's 3-day bank receipt confirmation back to Owner's
 * `vantaged_tranches_${canonicalId}` store and sends an in-app Owner notification.
 */
export function syncContractorReceiptConfirmedToOwner(params: {
  projectId: string;
  stageTitle: string;
  bankSessionId: string;
  netPayout: number;
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const ownerTranchesKey = `vantaged_tranches_${canonicalId}`;

  try {
    const raw = localStorage.getItem(ownerTranchesKey);
    const parsed: any[] = raw ? JSON.parse(raw) : [];
    const confirmationRecord = {
      stageTitle: params.stageTitle,
      bankSessionId: params.bankSessionId,
      confirmedAt: "Today",
    };

    // Store confirmation map so even default Owner tranches pick it up
    const mapKey = `vantaged_receipt_confirmations_${canonicalId}`;
    const existingMapRaw = localStorage.getItem(mapKey);
    const existingMap: Record<string, typeof confirmationRecord> = existingMapRaw
      ? JSON.parse(existingMapRaw)
      : {};
    existingMap[params.bankSessionId] = confirmationRecord;
    existingMap[params.stageTitle.toLowerCase()] = confirmationRecord;
    localStorage.setItem(mapKey, JSON.stringify(existingMap));
    pushProjectStateToBackend({ [mapKey]: existingMap });

    if (Array.isArray(parsed) && parsed.length > 0) {
      const updated = parsed.map((t: any) => {
        const match =
          t.bankSessionId === params.bankSessionId ||
          t.stageLinked?.toLowerCase().includes(params.stageTitle.toLowerCase()) ||
          t.title?.toLowerCase().includes(params.stageTitle.toLowerCase());
        if (match) {
          return {
            ...t,
            bankSessionId: params.bankSessionId,
            contractorConfirmed: true,
            contractorConfirmedDate: "Today",
          };
        }
        return t;
      });
      localStorage.setItem(ownerTranchesKey, JSON.stringify(updated));
      pushProjectStateToBackend({ [ownerTranchesKey]: updated });
    }

    pushOwnerLiveNotification({
      projectId: canonicalId,
      category: "escrow",
      projectTitle: params.stageTitle,
      title: `Builder Confirmed Receipt of ₦${params.netPayout.toLocaleString("en-NG")}`,
      description: `Receipt confirmed for ${params.stageTitle} (Ref: ${params.bankSessionId}). Official payout receipt is now finalized.`,
      linkUrl: `/owner/projects/${canonicalId}/transactions`,
    });

    broadcastPortalSync();
  } catch {
    // ignore storage errors
  }
}

/**
 * Syncs Owner dispute changes (newly raised issues, Tier 2/3 escalations,
 * replacement worker backcharges, settlements) into Company's `vantaged_cproj_issues_${canonicalId}`.
 */
export function syncOwnerDisputesToContractor(
  projectId: string,
  ownerDisputes: Array<any>
): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(projectId);
  const companyIssuesKey = `vantaged_cproj_issues_${canonicalId}`;

  try {
    const existingRaw = localStorage.getItem(companyIssuesKey);
    const existingCompany: any[] = existingRaw ? JSON.parse(existingRaw) : [];

    const mapped = ownerDisputes.map((od) => {
      const prevComp =
        existingCompany.find(
          (ci) => ci.id === od.id || ci.code === od.disputeCode
        ) || null;

      const severity =
        od.defectSeverity === "Minor Snag"
          ? "Minor Snag"
          : od.defectSeverity === "Critical Structural Risk"
          ? "Critical Structural"
          : "Moderate Defect";

      const escalationTier = String(od.escalationTier || "").includes("Tier 3")
        ? "Tier 3: Formal Arbitration"
        : String(od.escalationTier || "").includes("Tier 2")
        ? "Tier 2: Independent Inspection"
        : "Tier 1: Direct Fix";

      const status =
        od.status === "Resolved"
          ? "Resolved"
          : prevComp?.curePlan || od.proposedCurePlan?.methodStatement
          ? "Cure Plan Submitted"
          : "Action Required";

      return {
        ...(prevComp || {}),
        id: prevComp?.id || od.id,
        code: od.disputeCode || prevComp?.code || "DISP-001",
        kind: od.escrowQuarantineAmount > 0 ? "Formal Dispute" : "Fix Request",
        title: od.title,
        stageTitle: od.linkedStage || prevComp?.stageTitle || "Stage 1",
        severity,
        status,
        escalationTier,
        responseWindowHours:
          prevComp?.curePlan ? 0 : od.responseWindowHoursRemaining ?? 48,
        severityMaxAllowedDays:
          severity === "Minor Snag" ? 7 : severity === "Critical Structural" ? 28 : 14,
        overdueDays: od.overdueDays ?? 0,
        dailyDelayFineRate: od.dailyDelayFineRate ?? 35000,
        backchargeAmount: od.backchargeOrder?.invoiceAmount ?? 0,
        backchargeNote: od.backchargeOrder?.scopeOfWork,
        raisedBy: od.raisedBy || "Property Owner",
        openedDate: od.openedDate || "Recently",
        deadlineLabel: prevComp?.curePlan
          ? `Fix Plan Submitted · ${prevComp.curePlan.proposedDays}d repair window`
          : od.cureNoticeDeadline || "48 hours to send fix plan",
        heldAmount: od.escrowQuarantineAmount ?? od.linkedTrancheAmount ?? 0,
        ownerDescription: od.whatHappened || prevComp?.ownerDescription || "",
        curePlan: prevComp?.curePlan,
        counterEvidence: prevComp?.counterEvidence || [],
        timeline: Array.isArray(od.timelineEvents)
          ? od.timelineEvents.map((ev: any) => ({
              id: ev.id,
              actor: ev.author,
              action: ev.action + (ev.notes ? ` — ${ev.notes}` : ""),
              time: ev.timestamp,
            }))
          : prevComp?.timeline || [],
      };
    });

    localStorage.setItem(companyIssuesKey, JSON.stringify(mapped));
    pushProjectStateToBackend({ [companyIssuesKey]: mapped });
    broadcastPortalSync();
  } catch {
    // ignore storage errors
  }
}

/**
 * Syncs Company's Fix Plan submission, Verification Proof upload, or Re-Check request
 * into Owner's `vantaged_disputes_${canonicalId}` store and sends an in-app notification.
 */
export function syncContractorIssueUpdateToOwner(params: {
  projectId: string;
  issueCode: string;
  issueTitle: string;
  stageTitle: string;
  eventType: "FIX_PLAN_SUBMITTED" | "PROOF_UPLOADED" | "RECHECK_REQUESTED";
  methodStatement?: string;
  proposedDays?: number;
  proofTitle?: string;
  actorName?: string;
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const ownerDisputesKey = `vantaged_disputes_${canonicalId}`;

  try {
    const raw = localStorage.getItem(ownerDisputesKey);
    const ownerDisputes: any[] = raw ? JSON.parse(raw) : [];

    if (Array.isArray(ownerDisputes) && ownerDisputes.length > 0) {
      const updated = ownerDisputes.map((od: any, idx: number) => {
        const isMatch =
          od.disputeCode === params.issueCode ||
          od.title?.toLowerCase() === params.issueTitle.toLowerCase() ||
          (idx === 0 && !ownerDisputes.some((d: any) => d.disputeCode === params.issueCode));
        if (!isMatch) return od;

        const newEvent = {
          id: `tl-comp-${Date.now()}`,
          timestamp: "Just now",
          author: params.actorName || "Contractor",
          role: "Contractor",
          tier: od.escalationTier || "Tier 1: Direct Contractor Rectification",
          action:
            params.eventType === "FIX_PLAN_SUBMITTED"
              ? `Fix Plan Submitted (${params.proposedDays || 4} days)`
              : params.eventType === "PROOF_UPLOADED"
              ? `Verification Proof Uploaded: ${params.proofTitle}`
              : "Requested Owner Re-Check",
          notes:
            params.eventType === "FIX_PLAN_SUBMITTED"
              ? params.methodStatement || ""
              : params.eventType === "PROOF_UPLOADED"
              ? `Contractor attached "${params.proofTitle}" for review.`
              : "Contractor marked repair complete and requested inspection.",
        };

        return {
          ...od,
          ...(params.eventType === "FIX_PLAN_SUBMITTED"
            ? {
                responseWindowHoursRemaining: 0,
                cureStatus: "Cure Plan Pending Approval",
                proposedCurePlan: {
                  ...(od.proposedCurePlan || {}),
                  methodStatement: params.methodStatement || "",
                  proposedDurationDays: params.proposedDays || 4,
                  proposedCompletionDate: `In ${params.proposedDays || 4} days`,
                  status: "Awaiting Owner Approval",
                },
              }
            : {}),
          ...(params.eventType === "RECHECK_REQUESTED"
            ? { cureStatus: "Cure Complete - Ready for Review" }
            : {}),
          timelineEvents: [...(od.timelineEvents || []), newEvent],
        };
      });

      localStorage.setItem(ownerDisputesKey, JSON.stringify(updated));
      pushProjectStateToBackend({ [ownerDisputesKey]: updated });
    }

    pushOwnerLiveNotification({
      projectId: canonicalId,
      category: "inspection",
      projectTitle: params.stageTitle,
      title:
        params.eventType === "FIX_PLAN_SUBMITTED"
          ? `Fix Plan Submitted: ${params.issueTitle}`
          : params.eventType === "PROOF_UPLOADED"
          ? `Fix Proof Uploaded: ${params.proofTitle}`
          : `Builder Requested Re-Check: ${params.issueTitle}`,
      description:
        params.eventType === "FIX_PLAN_SUBMITTED"
          ? `Builder proposed a ${params.proposedDays || 4}-day repair plan. Review and approve it in Fixes & Disputes.`
          : params.eventType === "PROOF_UPLOADED"
          ? `New verification file "${params.proofTitle}" was attached to ${params.issueCode}.`
          : `Builder marked ${params.issueCode} as fixed and ready for your inspection.`,
      linkUrl: `/owner/projects/${canonicalId}/disputes`,
    });

    broadcastPortalSync();
  } catch {
    // ignore storage errors
  }
}

/**
 * Syncs Owner Change Requests (Owner-initiated requests + Approve/Decline decisions)
 * into Company's `vantaged_cproj_variations_${canonicalId}`.
 */
export function syncOwnerChangeRequestsToContractor(
  projectId: string,
  ownerCRs: Array<any>
): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(projectId);
  const companyVarKey = `vantaged_cproj_variations_${canonicalId}`;

  try {
    const existingRaw = localStorage.getItem(companyVarKey);
    const existingCompany: any[] = existingRaw ? JSON.parse(existingRaw) : [];

    const mapped = ownerCRs.map((cr) => {
      const code = cr.requestCode || cr.voCode || "VO-2026-01";
      const prevComp =
        existingCompany.find((v) => v.id === cr.id || v.code === code) || null;

      const status =
        cr.status === "Approved & Signed" || cr.status === "Approved"
          ? "Approved"
          : cr.status === "Declined" || cr.status === "Rejected"
          ? "Declined"
          : cr.status === "Waiting for Builder Price" ||
            cr.status === "Awaiting Contractor Assessment"
          ? "Needs Builder Quote"
          : "Awaiting Owner Approval";

      return {
        ...(prevComp || {}),
        id: prevComp?.id || cr.id,
        code,
        title: cr.title,
        linkedStage: cr.affectedStage || prevComp?.linkedStage || "Stage 1",
        category: prevComp?.category || "Scope Addition",
        requestedBy: cr.requestedBy === "Owner" ? "Owner" : "Contractor",
        costImpact:
          typeof cr.costImpact === "number"
            ? cr.costImpact
            : prevComp?.costImpact ?? 0,
        timelineDays:
          typeof cr.timeExtensionDays === "number"
            ? cr.timeExtensionDays
            : typeof cr.timeImpactDays === "number"
            ? cr.timeImpactDays
            : prevComp?.timelineDays ?? 0,
        status,
        submittedAt: cr.date || cr.dateSubmitted || prevComp?.submittedAt || "Recently",
        reason: cr.reason || prevComp?.reason || "",
        boqBreakdown:
          cr.boqSummary ||
          (Array.isArray(cr.breakdown)
            ? cr.breakdown
                .map((b: any) => `${b.item}: ₦${Number(b.cost || 0).toLocaleString("en-NG")}`)
                .join("; ")
            : prevComp?.boqBreakdown || "Itemized pricing pending."),
        ownerNote: cr.declineReason || cr.ownerApprovalNote || prevComp?.ownerNote,
      };
    });

    // Keep any contractor-only variations not yet in owner list
    const ownerIds = new Set(mapped.map((m) => m.id));
    const extraContractor = existingCompany.filter((v) => !ownerIds.has(v.id));

    // Notify company if an Owner-initiated request needs a quote or a status changed to Approved/Declined
    const notable = mapped.find((m) => {
      const prev = existingCompany.find((v) => v.id === m.id || v.code === m.code);
      if (!prev && m.status === "Needs Builder Quote") return true;
      if (prev && prev.status !== m.status && (m.status === "Approved" || m.status === "Declined")) {
        return true;
      }
      return false;
    });

    if (notable) {
      pushCompanyLiveNotification({
        projectId: canonicalId,
        category: "request",
        projectTitle: notable.title,
        title:
          notable.status === "Needs Builder Quote"
            ? `Owner Requested Extra Work Quote: ${notable.title}`
            : notable.status === "Approved"
            ? `Extra Work Approved: ${notable.title}`
            : `Extra Work Declined: ${notable.title}`,
        description:
          notable.status === "Needs Builder Quote"
            ? "Owner asked for pricing and extra days. Open Extra Work to send your quote."
            : `Owner updated status to ${notable.status} (${notable.code}).`,
        href: `/contractor/projects/${canonicalId}/change-requests`,
      });
    }

    const nextVariations = [...mapped, ...extraContractor];
    localStorage.setItem(companyVarKey, JSON.stringify(nextVariations));
    pushProjectStateToBackend({ [companyVarKey]: nextVariations });
    broadcastPortalSync();
  } catch {
    // ignore storage errors
  }
}

/**
 * Syncs Company-proposed Extra Work (or Builder Quote for an Owner request)
 * into Owner's `vantaged_cr_${canonicalId}` and pushes an in-app Owner notification.
 */
export function syncContractorVariationToOwner(params: {
  projectId: string;
  id: string;
  code: string;
  title: string;
  linkedStage: string;
  costImpact: number;
  timelineDays: number;
  reason: string;
  boqBreakdown: string;
  requestedBy?: "Owner" | "Contractor";
}): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(params.projectId);
  const ownerCRKey = `vantaged_cr_${canonicalId}`;

  try {
    const raw = localStorage.getItem(ownerCRKey);
    const existing: any[] = raw ? JSON.parse(raw) : [];

    const matchIndex = existing.findIndex(
      (c: any) => c.id === params.id || c.requestCode === params.code || c.voCode === params.code
    );

    const ownerRecord = {
      id: params.id,
      requestCode: params.code,
      voCode: params.code,
      title: params.title,
      affectedStage: params.linkedStage,
      requestedBy: params.requestedBy || "Contractor",
      requesterName:
        params.requestedBy === "Owner"
          ? "Property Owner"
          : getContractorSession()?.fullName || "Project Director (Builder)",
      date: "Just now",
      costImpact: params.costImpact,
      timeExtensionDays: params.timelineDays,
      timeImpactDays: params.timelineDays,
      status: "Waiting for Your Approval",
      dateSubmitted: "Just now",
      reason: params.reason,
      boqSummary: params.boqBreakdown,
      contractorAssessmentNote: params.boqBreakdown,
      breakdown: [
        {
          item: params.boqBreakdown || `${params.title} — Materials & Installation`,
          cost: params.costImpact,
        },
      ],
    };

    const next =
      matchIndex >= 0
        ? existing.map((c: any, idx: number) =>
            idx === matchIndex ? { ...c, ...ownerRecord } : c
          )
        : [ownerRecord, ...existing];

    localStorage.setItem(ownerCRKey, JSON.stringify(next));
    pushProjectStateToBackend({ [ownerCRKey]: next });

    pushOwnerLiveNotification({
      projectId: canonicalId,
      category: "escrow",
      projectTitle: params.title,
      title:
        params.requestedBy === "Owner"
          ? `Builder Quoted Your Extra Work: ${params.title}`
          : `New Extra Work Request: ${params.title}`,
      description: `Estimated cost: ${params.costImpact >= 0 ? "+" : ""}₦${params.costImpact.toLocaleString("en-NG")} · +${params.timelineDays} days. Review & approve in Extra Work.`,
      linkUrl: `/owner/projects/${canonicalId}/change-requests`,
    });

    broadcastPortalSync();
  } catch {
    // ignore storage errors
  }
}
