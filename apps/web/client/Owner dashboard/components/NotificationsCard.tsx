"use client";

import React, { useState } from "react";

interface NotificationItem {
  id: string;
  type: "inspection" | "escrow" | "message" | "delivery" | "video";
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
    subtitle: "Engr. Chidi · Ready for joint inspection",
    timestamp: "Today, 11:00 AM",
    urgent: true,
  },
  {
    id: "notif-2",
    type: "escrow",
    title: "Milestone Tranche Escrow Secured",
    subtitle: "Lekki Villa · ₦18,450,000 locked in escrow",
    timestamp: "Today, 09:12 AM",
  },
  {
    id: "notif-3",
    type: "message",
    title: "Lead Rep Field Report Uploaded",
    subtitle: "Engr. Chidi · Rebar tensile test verified",
    timestamp: "Yesterday, 5:40 PM",
  },
  {
    id: "notif-4",
    type: "delivery",
    title: "Material Delivery Confirmed",
    subtitle: "Gate Log · 600 bags cement received",
    timestamp: "2 days ago",
  },
  {
    id: "notif-5",
    type: "video",
    title: "Weekly Drone Aerial Scan Uploaded",
    subtitle: "Survey Team · 4K video ready for review",
    timestamp: "3 days ago",
  },
  {
    id: "notif-6",
    type: "inspection",
    title: "Plumbing First-Fix Pressure Test",
    subtitle: "Engr. Tunde · Pipe pressure test passed",
    timestamp: "4 days ago",
  },
  {
    id: "notif-7",
    type: "escrow",
    title: "Foundation Milestone Disbursed",
    subtitle: "SolidGround Ltd · ₦24,500,000 released",
    timestamp: "1 week ago",
  },
];

export function NotificationsCard() {
  const [notifications, setNotifications] = useState(initialOwnerNotifications);

  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.05)] flex flex-col justify-between font-sans select-none h-full min-h-[360px] lg:min-h-0">
      {/* 1. Header Bar matching Contract History Card */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Notifications
            </h2>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Site milestone alerts, inspection requests, and payment updates
            </p>
          </div>
        </div>
      </div>

      {/* 2. Notifications List: Flat clean list with internal scroll */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0 divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--vt-color-neutral-300,#CBC8DA)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-[var(--vt-color-neutral-500,#7C7894)]">
            <div className="w-10 h-10 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-center mb-2 text-[var(--vt-color-neutral-400,#A3A0B8)]">
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
              className="py-3 sm:py-3.5 flex items-center justify-between gap-4 group hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 px-2 rounded-lg transition-colors cursor-pointer"
            >
              {/* Left: Notification Title & Subtitle */}
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>

              {/* Right: Status Tag & Time */}
              <div className="text-right shrink-0">
                <span
                  className={`text-xs sm:text-sm font-extrabold block leading-tight ${
                    item.urgent
                      ? "text-[var(--vt-color-orange-600,#D84C0B)]"
                      : item.type === "escrow"
                      ? "text-[var(--vt-color-green-700,#1F6B3E)]"
                      : "text-[var(--vt-color-indigo-900,#261A66)]"
                  }`}
                >
                  {item.urgent ? "Urgent" : item.type === "escrow" ? "Escrow" : "Update"}
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5 block">
                  {item.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Bottom Summary Strip matching Contract History Card */}
      <div className="shrink-0 mt-3 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between gap-3 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
        <span>
          Pending alerts: <strong className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">{notifications.length} unread</strong>
        </span>

        <button
          type="button"
          className="h-8 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5 font-sans"
        >
          <span>See all</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
