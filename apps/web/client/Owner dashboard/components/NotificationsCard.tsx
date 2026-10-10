"use client";

import React, { useState } from "react";

interface NotificationItem {
  id: string;
  type: "inspection" | "escrow" | "message";
  title: string;
  subtitle: string;
  timestamp: string;
  urgent?: boolean;
}

const initialOwnerNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "inspection",
    title: "Stage 2 First Floor Slab Inspection",
    subtitle: "Joint inspection scheduled with Engr. Chidi O. & Lead Contractor",
    timestamp: "Today, 11:00 AM – 11:45 AM",
    urgent: true,
  },
  {
    id: "notif-2",
    type: "escrow",
    title: "Milestone Tranche Escrow Secured",
    subtitle: "₦18,450,000 locked in verified escrow for Lekki Villa Phase 1",
    timestamp: "Today, 09:12 AM",
  },
  {
    id: "notif-3",
    type: "message",
    title: "Lead Rep Field Report Uploaded",
    subtitle: "Engr. Chidi O.: “Rebar tying tensile test passed. Pour ready.”",
    timestamp: "Yesterday, 17:40 PM",
  },
];

export function NotificationsCard() {
  const [notifications, setNotifications] = useState(initialOwnerNotifications);

  const handleClear = () => {
    setNotifications([]);
  };

  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.05)] flex flex-col h-[420px] sm:h-[440px] font-sans select-none">
      {/* 1. Header */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Notifications
            </h2>
            {notifications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[10px] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]">
                {notifications.length} New
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors cursor-pointer flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* 2. Notification List (Scrollable container so card doesn't grow) */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--vt-color-neutral-300,#CBC8DA)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-[var(--vt-color-neutral-500,#7C7894)]">
            <div className="w-10 h-10 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-center mb-2.5 text-[var(--vt-color-neutral-400,#A3A0B8)]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]">All caught up!</p>
            <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">No pending alerts for your projects.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                item.urgent
                  ? "bg-white border-[var(--vt-color-orange-300,#FBA674)] border-l-4 border-l-[var(--vt-color-orange-500,#EF5F18)] shadow-[0_4px_14px_rgba(239,95,24,0.08)]"
                  : "bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-white hover:shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  {item.type === "inspection" && (
                    <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                  )}
                  {item.type === "escrow" && (
                    <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                  )}
                  {item.type === "message" && (
                    <span className="w-2 h-2 rounded-full bg-[var(--vt-color-indigo-600,#5547B0)]" />
                  )}
                  <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    {item.title}
                  </h4>
                </div>
                {item.urgent && (
                  <span className="text-[9px] font-bold text-[var(--vt-color-orange-700,#B33C08)] bg-[var(--vt-color-orange-50,#FFF4EE)] px-1.5 py-0.5 rounded uppercase">
                    Urgent
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed mb-2">
                {item.subtitle}
              </p>

              <div className="flex items-center justify-between text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] pt-1.5 border-t border-[var(--vt-color-neutral-200,#E2E0EC)]/60">
                <span className="flex items-center gap-1 font-medium text-[var(--vt-color-neutral-500,#7C7894)]">
                  <svg className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{item.timestamp}</span>
                </span>
                <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                  View &rarr;
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Footer link */}
      <div className="shrink-0 mt-3 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
          Real-time webhook sync active
        </span>
        <button
          type="button"
          className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer"
        >
          Notification Settings
        </button>
      </div>
    </div>
  );
}
