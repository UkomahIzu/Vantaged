"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  deleteCompanyLiveNotification,
  markCompanyNotificationsRead,
  readCompanyLiveNotifications,
} from "../../../shared/vantagedSyncBridge";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconClose,
  IconMessage,
  IconReceipt,
  IconShieldCheck,
} from "../../../client/Owner dashboard/pages/projects dashboard/ProjectIcons";

export interface DirectorNotificationItem {
  id: string;
  category: "receipt" | "stage" | "request" | "site";
  projectTitle: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  href: string;
}

const INITIAL_DIRECTOR_NOTIFICATIONS: DirectorNotificationItem[] = [
  {
    id: "dnotif-1",
    category: "receipt",
    projectTitle: "Lekki Phase 1 Five-Bedroom Villa",
    title: "Confirm ₦22,500,000 tranche receipt (Day 2 of 3)",
    description:
      "James Robinson uploaded transfer proof NIP-88492014 for Stage 4 decking. Confirm receipt before the 3-day SLA expires.",
    timestamp: "Today, 09:18",
    isUnread: true,
    href: "/contractor/transactions",
  },
  {
    id: "dnotif-2",
    category: "request",
    projectTitle: "Victoria Island Smart 4-Bed Duplex",
    title: "New client project brief received from Chinedu Okeke",
    description:
      "Estimated budget ₦100M - ₦250M · Plot 12, Adeola Odeku, Victoria Island. Review brief and send a milestone preset.",
    timestamp: "Today, 08:45",
    isUnread: true,
    href: "/contractor/requests",
  },
  {
    id: "dnotif-3",
    category: "stage",
    projectTitle: "Banana Island Terrace Apartments",
    title: "Fix requested on 2 Stage 2 checklist items",
    description:
      "Independent COREN inspector flagged rebar lap length and concrete slump photo on Substructure & Raft Foundation.",
    timestamp: "Yesterday, 16:30",
    isUnread: true,
    href: "/contractor/projects",
  },
  {
    id: "dnotif-4",
    category: "site",
    projectTitle: "Lekki Phase 1 Five-Bedroom Villa",
    title: "14 crew members checked in via GPS geofence",
    description:
      "Engr. Tunde Bakare logged morning site attendance and uploaded 6 slab formwork photos.",
    timestamp: "Yesterday, 08:15",
    isUnread: false,
    href: "/contractor/team",
  },
  {
    id: "dnotif-5",
    category: "stage",
    projectTitle: "Maitama Commercial Complex Annex",
    title: "Stage 3 concrete cube dossier requested (11d clock)",
    description:
      "Upload 28-day compressive cube test certificates to resolve the active stage dispute.",
    timestamp: "Oct 12, 14:20",
    isUnread: false,
    href: "/contractor/projects",
  },
  {
    id: "dnotif-6",
    category: "receipt",
    projectTitle: "Ikoyi Pearl Luxury Apartments",
    title: "Final retention release settled in company NUBAN",
    description:
      "₦18,400,000 final milestone retention confirmed and archived in Contract History.",
    timestamp: "Oct 09, 11:05",
    isUnread: false,
    href: "/contractor/projects?tab=history",
  },
];

const DEMO_STORAGE_KEY = "vantaged_director_notifications";
const PREFS_STORAGE_KEY = "vantaged_director_notif_prefs";

function isLiveCompanyNotifId(id: string): boolean {
  return id.startsWith("comp-notif-") || !INITIAL_DIRECTOR_NOTIFICATIONS.some((d) => d.id === id);
}

export function DirectorNotificationsPage() {
  const router = useRouter();
  const scrollRef = useScrollRestoration<HTMLElement>("director_notifications");
  const { isDemoMode } = useDirectorDemoMode();

  const [filterTab, setFilterTab] = useState<"all" | "unread" | "request" | "receipt" | "stage" | "site">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getSourceNotifications = useCallback((): DirectorNotificationItem[] => {
    const liveItems: DirectorNotificationItem[] = readCompanyLiveNotifications();
    if (!isDemoMode) return liveItems;
    let base: DirectorNotificationItem[] = INITIAL_DIRECTOR_NOTIFICATIONS;
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) base = parsed;
      }
    } catch {}
    const liveIds = new Set(liveItems.map((l) => l.id));
    return [...liveItems, ...base.filter((b) => !liveIds.has(b.id))];
  }, [isDemoMode]);

  const [notifications, setNotifications] = useState<DirectorNotificationItem[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    pushReceipts: true,
    emailReceipts: true,
    pushStages: true,
    emailStages: true,
    pushRequests: true,
    emailRequests: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {}
  }, []);

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(settings));
    } catch {}
    setIsSettingsModalOpen(false);
    showToast("Notification preferences saved.");
  };

  useEffect(() => {
    const sync = () => setNotifications(getSourceNotifications());
    sync();
    window.addEventListener("vantaged_director_demo_toggle", sync);
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vantaged_director_demo_toggle", sync);
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [getSourceNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterTab === "unread") return n.isUnread;
      if (filterTab === "request") return n.category === "request";
      if (filterTab === "receipt") return n.category === "receipt";
      if (filterTab === "stage") return n.category === "stage";
      if (filterTab === "site") return n.category === "site";
      return true;
    });
  }, [notifications, filterTab]);

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isUnread: false }));
    setNotifications(updated);
    markCompanyNotificationsRead();
    if (typeof window !== "undefined") {
      try {
        const demoOnly = updated.filter((u) => !isLiveCompanyNotifId(u.id));
        if (isDemoMode) {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoOnly));
        }
        window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
      } catch {}
    }
    showToast("All notifications marked as read.");
  };

  const handleMarkSingleAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isUnread: false } : n));
    setNotifications(updated);
    if (isLiveCompanyNotifId(id)) {
      markCompanyNotificationsRead([id]);
    } else if (typeof window !== "undefined") {
      try {
        const demoOnly = updated.filter((u) => !isLiveCompanyNotifId(u.id));
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoOnly));
        window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
      } catch {}
    }
  };

  const handleOpenNotification = (item: DirectorNotificationItem) => {
    if (item.isUnread) {
      handleMarkSingleAsRead(item.id);
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    if (isLiveCompanyNotifId(id)) {
      deleteCompanyLiveNotification(id);
    } else if (typeof window !== "undefined") {
      try {
        const demoOnly = updated.filter((u) => !isLiveCompanyNotifId(u.id));
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoOnly));
        window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
      } catch {}
    }
  };

  const renderCategoryIcon = (item: DirectorNotificationItem) => {
    const isNegotiationOrChat =
      item.title.toLowerCase().includes("message") ||
      item.title.toLowerCase().includes("negotiation");

    if (isNegotiationOrChat) {
      return (
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            item.isUnread
              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border-[var(--vt-color-orange-200,#FDCAA9)]"
              : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] border-[var(--vt-color-border-default,#E2E0EC)]"
          }`}
        >
          <IconMessage className="w-4 h-4" />
        </div>
      );
    }
    if (item.category === "receipt") {
      return (
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            item.isUnread
              ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]"
              : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] border-[var(--vt-color-border-default,#E2E0EC)]"
          }`}
        >
          <IconReceipt className="w-4 h-4" />
        </div>
      );
    }
    if (item.category === "stage") {
      return (
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            item.isUnread
              ? "bg-indigo-50 text-[var(--vt-color-indigo-900,#261A66)] border-indigo-200"
              : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] border-[var(--vt-color-border-default,#E2E0EC)]"
          }`}
        >
          <IconShieldCheck className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
          item.isUnread
            ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border-[var(--vt-color-orange-200,#FDCAA9)]"
            : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] border-[var(--vt-color-border-default,#E2E0EC)]"
        }`}
      >
        <IconCheckCircle className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none"
    >
      <DirectorSidebarNav currentActiveItem="notifications" />

      <main
        ref={scrollRef}
        className="flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5"
      >
        <DirectorHeaderBar
          leftSlot={
            <Link
              href="/contractor/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <IconArrowLeft className="w-4 h-4" />
            </Link>
          }
        />

        <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 pt-2 pb-16">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                    <span>{unreadCount} Unread</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 font-normal">
                Real-time alerts across your project requests, price negotiations, construction stages, and payment receipts.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-1">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="h-8 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] font-semibold transition-colors cursor-pointer"
              >
                Preferences
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-100,#FFE6D5)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(
              [
                { id: "all", label: `All (${notifications.length})` },
                { id: "unread", label: `Unread (${unreadCount})` },
                { id: "request", label: "Requests & Negotiations" },
                { id: "receipt", label: "Receipts & Escrow" },
                { id: "stage", label: "Stages & Fixes" },
                { id: "site", label: "Site & Chat" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  filterTab === tab.id
                    ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white border-[var(--vt-color-indigo-900,#261A66)] shadow-2xs"
                    : "bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Unified Notification Feed */}
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-xs">
                  <IconCheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {filterTab === "unread" ? "All Caught Up!" : "No Notifications Here Yet"}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-1.5 leading-relaxed">
                  When a property owner sends a project brief, replies in price negotiation, approves a stage, or releases a payment, real-time alerts will appear here.
                </p>
                <div className="mt-5 flex items-center gap-2.5">
                  {filterTab !== "all" && (
                    <button
                      type="button"
                      onClick={() => setFilterTab("all")}
                      className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                    >
                      Show All
                    </button>
                  )}
                  <Link
                    href="/contractor/dashboard"
                    className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenNotification(item)}
                  className={`px-5 sm:px-6 py-4.5 flex items-start justify-between gap-4 transition-colors cursor-pointer group border-l-3 ${
                    item.isUnread
                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/30 hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/60 border-l-[var(--vt-color-orange-500,#EF5F18)]"
                      : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {renderCategoryIcon(item)}

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        {item.isUnread && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9.5px] font-black uppercase bg-[var(--vt-color-orange-500,#EF5F18)] text-white shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] group-hover:underline">
                          <span>{item.projectTitle || "Open"}</span>
                          <IconArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                    <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-medium whitespace-nowrap inline-flex items-center gap-1">
                      <IconClock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Dismiss notification"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md hover:bg-rose-50 flex items-center justify-center text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-rose-600 cursor-pointer"
                    >
                      <IconClose className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Notification Preferences Modal */}
      {isSettingsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsSettingsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="px-5 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Notification Preferences
                </h3>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Choose which alerts to receive across Push and Email.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Payment Receipt Confirmations
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    3-day SLA tranche confirmation alerts
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushReceipts}
                      onChange={(e) => setSettings({ ...settings, pushReceipts: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailReceipts}
                      onChange={(e) => setSettings({ ...settings, emailReceipts: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Email
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Client Project Requests &amp; Negotiations
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Incoming briefs, price chat &amp; plan approvals
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushRequests}
                      onChange={(e) => setSettings({ ...settings, pushRequests: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailRequests}
                      onChange={(e) => setSettings({ ...settings, emailRequests: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Email
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Stage Inspections &amp; Disputes
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Punch lists, stage approvals &amp; cure clocks
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushStages}
                      onChange={(e) => setSettings({ ...settings, pushStages: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailStages}
                      onChange={(e) => setSettings({ ...settings, emailStages: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Email
                  </label>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="h-8 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="h-8 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <IconCheckCircle className="w-4 h-4 text-[var(--vt-color-green-400,#4ADE80)]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
