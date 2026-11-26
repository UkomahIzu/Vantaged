"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { useDemoMode } from "../hooks/useDemoMode";
import { useOwnerSubscription } from "../hooks/useOwnerSubscription";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  deleteOwnerLiveNotification,
  markOwnerNotificationsRead,
  readOwnerLiveNotifications,
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
} from "./projects dashboard/ProjectIcons";

export interface OwnerNotification {
  id: string;
  category: "inspection" | "escrow" | "site";
  projectTitle: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: OwnerNotification[] = [
  {
    id: "notif-1",
    category: "inspection",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    title: "Stage 2 first floor decking is ready for review",
    description:
      "Julius B. Consortium submitted photos for the first floor decking. Engr. Adeleke confirmed concrete strength test passed.",
    timestamp: "Today, 08:40",
    isUnread: true,
    linkUrl: "/owner/projects/proj-lekki/stages",
  },
  {
    id: "notif-2",
    category: "escrow",
    projectTitle: "The Enclave Waterfront Resort",
    title: "Escrow deposit confirmed for Shoreline Piling",
    description:
      "₦48,500,000 safely deposited in escrow for Stage 2. Your money stays protected until you approve the inspection.",
    timestamp: "Today, 09:12",
    isUnread: true,
    linkUrl: "/owner/projects/proj-enclave/transactions",
  },
  {
    id: "notif-3",
    category: "site",
    projectTitle: "Banana Island Horizon Penthouse",
    title: "Drone photos & site walkthrough uploaded",
    description:
      "Site cameras and drone uploaded clear new photos and a video walkthrough of your building.",
    timestamp: "Today, 09:40",
    isUnread: true,
    linkUrl: "/owner/projects/proj-banana/stages",
  },
  {
    id: "notif-4",
    category: "inspection",
    projectTitle: "Guzape Hills Residence",
    title: "Plumbing pipes water test passed",
    description:
      "Engr. Emeka Uche tested all underfloor plumbing pipes for 24 hours with zero leaks.",
    timestamp: "Yesterday, 16:40",
    isUnread: false,
    linkUrl: "/owner/projects/proj-guzape/stages",
  },
  {
    id: "notif-5",
    category: "site",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    title: "Site delivery confirmed: 600 Bags of Dangote Cement",
    description: "Gate pass #WP-2092 confirmed. Delivery slip and receipt signed on site.",
    timestamp: "Oct 10, 14:15",
    isUnread: false,
    linkUrl: "/owner/projects/proj-lekki",
  },
  {
    id: "notif-6",
    category: "escrow",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    title: "Foundation milestone payment sent to builder",
    description:
      "₦32,800,000 released to builder after you approved the foundation inspection. Receipt generated.",
    timestamp: "Oct 09, 11:30",
    isUnread: false,
    linkUrl: "/owner/projects/proj-lekki/transactions",
  },
  {
    id: "notif-7",
    category: "inspection",
    projectTitle: "Banana Island Horizon Penthouse",
    title: "Terrace soundproofing inspection passed",
    description:
      "Arc. Amina Yusuf inspected soundproofing insulation across upper bedroom terraces.",
    timestamp: "Oct 07, 15:20",
    isUnread: false,
    linkUrl: "/owner/projects/proj-banana/stages",
  },
  {
    id: "notif-8",
    category: "escrow",
    projectTitle: "Guzape Hills Residence",
    title: "Building plan adjustment reviewed",
    description:
      "Quantity surveyor Femi Oladipo approved builder request for upgraded anti-crack wall mesh (+₦1.2M).",
    timestamp: "Oct 05, 13:10",
    isUnread: false,
    linkUrl: "/owner/projects/proj-guzape/change-requests",
  },
];

const DEMO_STORAGE_KEY = "vantaged_owner_notifications";
const PREFS_STORAGE_KEY = "vantaged_owner_notif_prefs";

function isLiveOwnerNotifId(id: string): boolean {
  return id.startsWith("live-notif-") || id.startsWith("notif-live-") || !INITIAL_NOTIFICATIONS.some((d) => d.id === id);
}

export function OwnerNotificationsPage() {
  const router = useRouter();
  const scrollRef = useScrollRestoration<HTMLElement>("owner_notifications");
  const { isDemoMode } = useDemoMode();
  const subscription = useOwnerSubscription();

  const [filterTab, setFilterTab] = useState<"all" | "unread" | "inspection" | "escrow" | "site">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getSourceNotifications = useCallback((): OwnerNotification[] => {
    const liveNotifs = readOwnerLiveNotifications() as OwnerNotification[];
    if (!isDemoMode) return liveNotifs;
    let base: OwnerNotification[] = INITIAL_NOTIFICATIONS;
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          base = parsed;
        }
      }
    } catch {}
    const filteredBase =
      subscription.tierId === "owner-private"
        ? base.filter((n: OwnerNotification) => n.projectTitle === "Lekki Phase 1 Luxury Villa")
        : base;
    const seen = new Set(liveNotifs.map((n) => n.id));
    return [...liveNotifs, ...filteredBase.filter((n) => !seen.has(n.id))];
  }, [isDemoMode, subscription.tierId]);

  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);

  useEffect(() => {
    const sync = () => {
      setNotifications(getSourceNotifications());
    };
    sync();
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, sync);
    window.addEventListener("vantaged_demo_toggle", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, sync);
      window.removeEventListener("vantaged_demo_toggle", sync);
      window.removeEventListener("storage", sync);
    };
  }, [getSourceNotifications]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Settings State (persisted to localStorage)
  const [settings, setSettings] = useState({
    pushMilestones: true,
    emailMilestones: true,
    smsMilestones: false,
    pushEscrow: true,
    emailEscrow: true,
    smsEscrow: true,
    dailyDigest: true,
    quietHours: true,
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

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterTab === "unread") return n.isUnread;
      if (filterTab === "inspection") return n.category === "inspection";
      if (filterTab === "escrow") return n.category === "escrow";
      if (filterTab === "site") return n.category === "site";
      return true;
    });
  }, [notifications, filterTab]);

  // Mark all as read (persists to live store + backend API + demo store)
  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isUnread: false }));
    setNotifications(updated);
    markOwnerNotificationsRead();
    if (typeof window !== "undefined") {
      try {
        const demoOnly = updated.filter((n) => !isLiveOwnerNotifId(n.id));
        if (isDemoMode) {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoOnly));
        }
        window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
      } catch {}
    }
    showToast("All notifications marked as read.");
  };

  // Mark single notification as read (persists to live store + backend API + demo store)
  const handleMarkSingleAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isUnread: false } : n));
    setNotifications(updated);
    if (isLiveOwnerNotifId(id)) {
      markOwnerNotificationsRead([id]);
    } else if (typeof window !== "undefined") {
      try {
        const demoOnly = updated.filter((n) => !isLiveOwnerNotifId(n.id));
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoOnly));
        window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
      } catch {}
    }
  };

  // Open notification target route & mark as read
  const handleOpenNotification = (item: OwnerNotification) => {
    if (item.isUnread) {
      handleMarkSingleAsRead(item.id);
    }
    if (item.linkUrl) {
      router.push(item.linkUrl);
    } else if (item.category === "escrow") {
      router.push("/owner/transactions");
    } else if (item.category === "inspection") {
      router.push("/owner/projects");
    } else {
      router.push("/owner/projects");
    }
  };

  // Delete / dismiss notification permanently
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    if (isLiveOwnerNotifId(id)) {
      deleteOwnerLiveNotification(id);
    } else if (typeof window !== "undefined") {
      try {
        const demoOnly = updated.filter((n) => !isLiveOwnerNotifId(n.id));
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoOnly));
        window.dispatchEvent(new Event(SHARED_SYNC_EVENT));
      } catch {}
    }
  };

  const renderCategoryIcon = (item: OwnerNotification) => {
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
    if (item.category === "escrow") {
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
    if (item.category === "inspection") {
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
      {/* Left Sidebar Navigation */}
      <SidebarNav currentActiveItem="notifications" />

      {/* Main Workspace */}
      <main
        ref={scrollRef}
        className="flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5"
      >
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
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
                Real-time alerts across your building plans, price negotiations, milestone inspections, and escrow vaults.
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
                { id: "inspection", label: "Inspections & Stages" },
                { id: "escrow", label: "Escrow & Payments" },
                { id: "site", label: "Plans, Site & Chat" },
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
                  When a contractor sends a building plan, replies in your price negotiation chat, submits stage proof, or confirms a bank receipt, real-time alerts will appear here.
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
                    href="/owner/dashboard"
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
                          <span>{item.projectTitle || "View Details"}</span>
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

      {/* NOTIFICATION PREFERENCES MODAL */}
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
                  Choose which alerts to receive across Push, Email, and SMS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs">
                    Stage Reviews &amp; Proof
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Contractor milestone readiness &amp; negotiations
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushMilestones}
                      onChange={(e) => setSettings({ ...settings, pushMilestones: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailMilestones}
                      onChange={(e) => setSettings({ ...settings, emailMilestones: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                    />
                    Email
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs">
                    Escrow Deposits &amp; Payouts
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Tranche movements &amp; receipt confirmations
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-semibold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushEscrow}
                      onChange={(e) => setSettings({ ...settings, pushEscrow: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailEscrow}
                      onChange={(e) => setSettings({ ...settings, emailEscrow: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsEscrow}
                      onChange={(e) => setSettings({ ...settings, smsEscrow: e.target.checked })}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                    />
                    SMS
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs">
                    Daily Site Progress Digest
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Consolidated 6:00 PM portfolio brief
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyDigest}
                  onChange={(e) => setSettings({ ...settings, dailyDigest: e.target.checked })}
                  className="accent-[var(--vt-color-orange-500,#EF5F18)] w-4 h-4 cursor-pointer rounded"
                />
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs">
                    Quiet Hours (10:00 PM – 7:00 AM)
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Mute non-urgent notifications at night
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.quietHours}
                  onChange={(e) => setSettings({ ...settings, quietHours: e.target.checked })}
                  className="accent-[var(--vt-color-orange-500,#EF5F18)] w-4 h-4 cursor-pointer rounded"
                />
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2">
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
                className="h-8 px-3.5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
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
