"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";

export interface OwnerNotification {
  id: string;
  category: "inspection" | "escrow" | "site";
  projectTitle: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
}

const INITIAL_NOTIFICATIONS: OwnerNotification[] = [
  {
    id: "notif-1",
    category: "inspection",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    title: "Stage 2 suspended slab is ready for review",
    description: "Julius B. Consortium submitted Level 2 slab reinforcement proof. Engr. Adeleke verified break logs (38.5 MPa).",
    timestamp: "Today, 08:40",
    isUnread: true,
  },
  {
    id: "notif-2",
    category: "escrow",
    projectTitle: "The Enclave Waterfront Resort",
    title: "Escrow vault deposit confirmed for Shoreline Piling",
    description: "₦48,500,000 secured in Vantaged Escrow Vault for Tranche 2. Funds protected until inspection sign-off.",
    timestamp: "Today, 09:12",
    isUnread: true,
  },
  {
    id: "notif-3",
    category: "site",
    projectTitle: "Banana Island Horizon Penthouse",
    title: "4K Drone aerial survey uploaded for Banana Island",
    description: "Automated site camera recorded week 14 facade telemetry and high-resolution orthomosaic scan.",
    timestamp: "Today, 09:40",
    isUnread: true,
  },
  {
    id: "notif-4",
    category: "inspection",
    projectTitle: "Guzape Hills Residence",
    title: "Plumbing hydrostatic pressure test passed",
    description: "Engr. Emeka Uche confirmed underfloor PEX pipes held 8-bar pressure for 24 hours with zero leakage.",
    timestamp: "Yesterday, 16:40",
    isUnread: false,
  },
  {
    id: "notif-5",
    category: "site",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    title: "Gate waybill verified: 600 Bags of Dangote Cement",
    description: "Security gate pass #WP-2092 verified. Digital manifest and supplier weight scale ticket uploaded.",
    timestamp: "Oct 10, 14:15",
    isUnread: false,
  },
  {
    id: "notif-6",
    category: "escrow",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    title: "Substructure milestone payout disbursed to contractor",
    description: "₦32,800,000 released from escrow vault following verified foundation sign-off. VAT tax invoice generated.",
    timestamp: "Oct 09, 11:30",
    isUnread: false,
  },
  {
    id: "notif-7",
    category: "inspection",
    projectTitle: "Banana Island Horizon Penthouse",
    title: "Terrace acoustic insulation clearance issued",
    description: "Arc. Amina Yusuf validated soundproofing membrane installation across upper bedroom terraces.",
    timestamp: "Oct 07, 15:20",
    isUnread: false,
  },
  {
    id: "notif-8",
    category: "escrow",
    projectTitle: "Guzape Hills Residence",
    title: "BOQ Line item variation reviewed by QS",
    description: "QS Femi Oladipo approved contractor variation VR-03 for upgraded anti-crack mesh (+₦1.2M).",
    timestamp: "Oct 05, 13:10",
    isUnread: false,
  },
];

export function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<OwnerNotification[]>(INITIAL_NOTIFICATIONS);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedProofPreview, setSelectedProofPreview] = useState<OwnerNotification | null>(null);

  // Settings State (PRD §7.18 Notification Channels)
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

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  // Delete / dismiss notification
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none"
    >
      {/* ── Left Sidebar Navigation ── */}
      <SidebarNav currentActiveItem="notifications" />

      {/* ── Main Workspace ── */}
      <main className="flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col gap-5">
        {/* Top Header Bar */}
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        {/* ── Simplified Notifications Layout adhering strictly to Vantaged design tokens ── */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-2 pb-16">
          {/* Header row: Title + Subtitle on left, Mark all as read on right */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Notifications
              </h1>
              <p className="text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1.5 font-normal">
                Everything across your projects, milestone inspections, and escrow vaults, in one place.
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
              <div className="py-16 text-center text-sm text-[var(--vt-color-neutral-400,#A3A0B8)]">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.category === "inspection") {
                      setSelectedProofPreview(item);
                    }
                    if (item.isUnread) {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n))
                      );
                    }
                  }}
                  className={`px-6 py-5 flex items-start justify-between gap-4 transition-colors cursor-pointer group ${
                    item.isUnread
                      ? "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                      : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] opacity-95"
                  }`}
                >
                  {/* Left: Document Icon in Brand Orange Token + Title & Description */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* The Document Outline Icon adhering to Vantaged brand tokens */}
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

                    {/* Text Body */}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-[15px] font-bold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Timestamp */}
                  <div className="flex items-center gap-3 shrink-0 pt-0.5">
                    <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] font-normal whitespace-nowrap">
                      {item.timestamp}
                    </span>

                    {/* Subtle dismiss on hover */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Dismiss"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-red-500,#E5483B)] cursor-pointer"
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

      {/* ── NOTIFICATION PREFERENCES MODAL (PRD §7.18) ── */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
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
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-3 text-xs">
              {/* Event 1: Milestone Reviews */}
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs">
                    Stage Reviews & Proof
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Contractor milestone readiness
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

              {/* Event 2: Escrow & Payments */}
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs">
                    Escrow Deposits & Payouts
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Tranche movements & releases
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

              {/* Event 3: Daily Digest */}
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

              {/* Event 4: Quiet Hours */}
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

            {/* Footer */}
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
                onClick={() => setIsSettingsModalOpen(false)}
                className="h-8 px-3.5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROOF PREVIEW MODAL ── */}
      {selectedProofPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                  {selectedProofPreview.projectTitle}
                </span>
                <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {selectedProofPreview.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProofPreview(null)}
                className="w-7 h-7 rounded-lg hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-3 text-xs">
              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                {selectedProofPreview.description}
              </p>

              {/* Sample Evidence Asset */}
              <div className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] relative aspect-video bg-[var(--vt-color-indigo-950,#160F3D)]">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=600&h=350&fit=crop"
                  alt="Stage Proof"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
                  Inspection Proof • Verified by Lead Rep
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedProofPreview(null)}
                className="h-8 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Navigating to project stage approval for ${selectedProofPreview.projectTitle}`);
                  setSelectedProofPreview(null);
                }}
                className="h-8 px-3.5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Open Project Stage →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
