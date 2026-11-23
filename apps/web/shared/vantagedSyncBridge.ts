"use client";

/**
 * Shared cross-portal synchronization bridge between Owner Dashboard and Company Dashboard.
 * Ensures canonical project IDs, unified localStorage keys, and live cross-tab events.
 */

import { getOwnerScopedKey } from "./vantagedAuth";

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

export function pushOwnerLiveNotification(
  notif: Omit<OwnerLiveNotification, "id" | "timestamp" | "isUnread">
): OwnerLiveNotification {
  const created: OwnerLiveNotification = {
    ...notif,
    id: `live-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: "Just now",
    isUnread: true,
  };
  const scopedKey = getOwnerScopedKey(KEY_OWNER_LIVE_NOTIFICATIONS);
  const existing = readSharedJSON<OwnerLiveNotification[]>(scopedKey, []);
  writeSharedJSON(scopedKey, [created, ...existing]);
  return created;
}

export function readCompanyLiveNotifications(): CompanyLiveNotification[] {
  return readSharedJSON<CompanyLiveNotification[]>(KEY_COMPANY_LIVE_NOTIFICATIONS, []);
}

export function pushCompanyLiveNotification(
  notif: Omit<CompanyLiveNotification, "id" | "timestamp" | "isUnread">
): CompanyLiveNotification {
  const created: CompanyLiveNotification = {
    ...notif,
    id: `comp-notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: "Just now",
    isUnread: true,
  };
  const existing = readCompanyLiveNotifications();
  writeSharedJSON(KEY_COMPANY_LIVE_NOTIFICATIONS, [created, ...existing]);
  return created;
}

export function saveCompanyLiveNotifications(items: CompanyLiveNotification[]): void {
  writeSharedJSON(KEY_COMPANY_LIVE_NOTIFICATIONS, items);
}

export function readSharedConversations(includeDemoFallback = true): SharedConversationThread[] {
  const stored = readSharedJSON<SharedConversationThread[] | null>(
    KEY_SHARED_CONVERSATIONS,
    null
  );
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return includeDemoFallback ? DEFAULT_SHARED_CONVERSATIONS : [];
}

export function ensureProjectConversation(params: {
  projectId: string;
  projectTitle: string;
  ownerName: string;
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

  if (targetThread) {
    const t = targetThread as SharedConversationThread;
    if (params.sender === "owner") {
      pushCompanyLiveNotification({
        category: "site",
        projectTitle: t.projectTitle,
        title: `New message from ${params.senderName}`,
        description: newMsg.text.slice(0, 110),
        href: `/contractor/messages?conv=${t.id}`,
      });
    } else {
      pushOwnerLiveNotification({
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
  return updated;
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

  try {
    const raw = localStorage.getItem(companyStagesKey);
    if (raw) {
      const stages = JSON.parse(raw);
      if (Array.isArray(stages)) {
        const updated = stages.map((s: any) => {
          const isMatch =
            s.id === params.stageId ||
            (params.stageNumber !== undefined && s.order === params.stageNumber);
          if (!isMatch) return s;

          if (params.decision === "APPROVED") {
            return {
              ...s,
              status: "Approved",
              approvedAt: "Today",
              checklist: Array.isArray(s.checklist)
                ? s.checklist.map((c: any) => ({ ...c, ownerFlagged: false }))
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
        localStorage.setItem(companyStagesKey, JSON.stringify(updated));
      }
    }

    // When Owner approves a stage, also release its payment into Company's 3-day Confirm Receipt queue
    if (params.decision === "APPROVED") {
      const nipRef = `NIP-${Date.now().toString().slice(-8)}`;
      const companyTranchesKey = `vantaged_cproj_tranches_${canonicalId}`;
      const cTranchesRaw = localStorage.getItem(companyTranchesKey);
      if (cTranchesRaw) {
        const cTranches = JSON.parse(cTranchesRaw);
        if (Array.isArray(cTranches)) {
          const updatedCTranches = cTranches.map((t: any) => {
            const titleMatch =
              t.stageTitle?.toLowerCase().includes(params.stageTitle.toLowerCase()) ||
              (params.stageNumber !== undefined &&
                t.stageTitle?.toLowerCase().startsWith(`stage ${params.stageNumber}`));
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
      }

      pushCompanyLiveNotification({
        category: "receipt",
        projectTitle: params.stageTitle,
        title: `Owner Approved ${params.stageTitle} — Confirm Payment Receipt (3d)`,
        description: `Payment transfer ${nipRef} has been released. Confirm bank receipt within 3 days.`,
        href: `/contractor/projects/${canonicalId}/transactions`,
      });
    }

    if (params.decision === "FIX_REQUESTED") {
      const issuesKey = `vantaged_cproj_issues_${canonicalId}`;
      const issuesRaw = localStorage.getItem(issuesKey);
      const existingIssues = issuesRaw ? JSON.parse(issuesRaw) : [];
      const newIssue = {
        id: `iss-${Date.now()}`,
        code: `FIX-${Date.now().toString().slice(-4)}`,
        kind: "Fix Request",
        title: params.fixNote?.trim() || `Fix requested on ${params.stageTitle}`,
        stageTitle: params.stageTitle,
        severity: "Moderate Defect",
        status: "Action Required",
        escalationTier: "Tier 1: Direct Fix",
        responseWindowHours: 48,
        severityMaxAllowedDays: 14,
        raisedBy: params.ownerName || "Property Owner",
        openedDate: "Just now",
        deadlineLabel: "48 hours to send fix plan",
        heldAmount: 0,
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
      localStorage.setItem(
        issuesKey,
        JSON.stringify([newIssue, ...(Array.isArray(existingIssues) ? existingIssues : [])])
      );

      pushCompanyLiveNotification({
        category: "stage",
        projectTitle: params.stageTitle,
        title: `Fix Requested on ${params.stageTitle}`,
        description:
          params.fixNote?.trim() ||
          "Property Owner flagged checklist items. Reply with a Fix Plan within 48 hours.",
        href: `/contractor/projects/${canonicalId}/disputes`,
      });
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
    }

    pushOwnerLiveNotification({
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
    }

    pushOwnerLiveNotification({
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
      const prevComp =
        existingCompany.find((v) => v.id === cr.id || v.code === cr.voCode) || null;

      const status =
        cr.status === "Approved & Signed" || cr.status === "Approved"
          ? "Approved"
          : cr.status === "Declined" || cr.status === "Rejected"
          ? "Declined"
          : cr.status === "Waiting for Builder Price"
          ? "Needs Builder Quote"
          : "Awaiting Owner Approval";

      return {
        ...(prevComp || {}),
        id: prevComp?.id || cr.id,
        code: cr.voCode || prevComp?.code || "VO-2026-01",
        title: cr.title,
        linkedStage: cr.affectedStage || prevComp?.linkedStage || "Stage 1",
        category: prevComp?.category || "Scope Addition",
        requestedBy: cr.requestedBy === "Owner" ? "Owner" : "Contractor",
        costImpact:
          typeof cr.costImpact === "number"
            ? cr.costImpact
            : prevComp?.costImpact ?? 0,
        timelineDays:
          typeof cr.timeImpactDays === "number"
            ? cr.timeImpactDays
            : prevComp?.timelineDays ?? 0,
        status,
        submittedAt: cr.dateSubmitted || prevComp?.submittedAt || "Recently",
        reason: cr.reason || prevComp?.reason || "",
        boqBreakdown: cr.boqSummary || prevComp?.boqBreakdown || "Itemized pricing pending.",
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

    localStorage.setItem(companyVarKey, JSON.stringify([...mapped, ...extraContractor]));
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
      (c: any) => c.id === params.id || c.voCode === params.code
    );

    const ownerRecord = {
      id: params.id,
      voCode: params.code,
      title: params.title,
      affectedStage: params.linkedStage,
      requestedBy: params.requestedBy || "Contractor",
      costImpact: params.costImpact,
      timeImpactDays: params.timelineDays,
      status: "Waiting for Your Approval",
      dateSubmitted: "Just now",
      reason: params.reason,
      boqSummary: params.boqBreakdown,
    };

    const next =
      matchIndex >= 0
        ? existing.map((c: any, idx: number) =>
            idx === matchIndex ? { ...c, ...ownerRecord } : c
          )
        : [ownerRecord, ...existing];

    localStorage.setItem(ownerCRKey, JSON.stringify(next));

    pushOwnerLiveNotification({
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
