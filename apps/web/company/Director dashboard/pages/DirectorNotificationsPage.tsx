"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  readCompanyLiveNotifications,
  saveCompanyLiveNotifications,
} from "../../../shared/vantagedSyncBridge";

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

export function DirectorNotificationsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_notifications");
  const storageKey = "vantaged_director_notifications";
  const { isDemoMode } = useDirectorDemoMode();

  const getSourceNotifications = useCallback((): DirectorNotificationItem[] => {
    const liveItems: DirectorNotificationItem[] = readCompanyLiveNotifications();
    if (!isDemoMode) return liveItems;
    let base: DirectorNotificationItem[] = INITIAL_DIRECTOR_NOTIFICATIONS;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) base = parsed;
      }
    } catch {
      // ignore
    }
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

  const persistNotifications = (updated: DirectorNotificationItem[]) => {
    setNotifications(updated);
    if (typeof window !== "undefined") {
      try {
        const liveOnly = updated.filter((u) => u.id.startsWith("comp-notif-"));
        const baseOnly = updated.filter((u) => !u.id.startsWith("comp-notif-"));
        saveCompanyLiveNotifications(liveOnly);
        localStorage.setItem(storageKey, JSON.stringify(baseOnly));
      } catch {
        // ignore
      }
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  const handleMarkAllAsRead = () => {
    persistNotifications(notifications.map((n) => ({ ...n, isUnread: false })));
  };

  const handleMarkSingleAsRead = (id: string) => {
    persistNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    persistNotifications(notifications.filter((n) => n.id !== id));
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
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-2 pb-16">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Notifications
              </h1>
              <p className="text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1.5 font-normal">
                Everything across your construction sites, payment receipts, and client requests, in one place.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 pt-1">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] font-semibold transition-colors cursor-pointer"
              >
                Preferences
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-sm font-semibold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Unified Notification Card */}
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="py-20 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-xs">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  All Caught Up!
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-1.5 leading-relaxed">
                  You have no unread alerts. When a client sends a new project brief, uploads a transfer receipt, or an inspector flags a stage checklist, real-time notifications will appear here.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href="/contractor/dashboard"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-1.5 font-sans cursor-pointer"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.isUnread) handleMarkSingleAsRead(item.id);
                  }}
                  className={`px-6 py-5 flex items-start justify-between gap-4 transition-colors cursor-pointer group ${
                    item.isUnread
                      ? "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                      : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] opacity-90"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="shrink-0 mt-0.5">
                      <svg
                        className={`w-5 h-5 transition-colors ${
                          item.isUnread
                            ? "text-[var(--vt-color-orange-500,#EF5F18)]"
                            : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-bold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        {item.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <Link
                        href={item.href}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline w-fit"
                      >
                        <span>{item.projectTitle} · Open →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-0.5">
                    <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] font-normal whitespace-nowrap">
                      {item.timestamp}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Dismiss"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-rose-600 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
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
                ✕
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
                    Client Project Requests
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Incoming briefs &amp; plan approvals
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
                    Punch lists, COREN audits &amp; clocks
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

            <div className="px-5 py-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="h-8 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
