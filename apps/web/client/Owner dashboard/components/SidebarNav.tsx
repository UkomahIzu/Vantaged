"use client";

import React, { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  badge?: string | number;
  icon: (isActive: boolean) => React.ReactNode;
}

export function SidebarNav() {
  const [activeItem, setActiveItem] = useState<string>("home");

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "projects",
      label: "Projects",
      badge: "4",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      id: "messages",
      label: "Messages",
      badge: "2",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      ),
    },
    {
      id: "find-companies",
      label: "Find companies",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      id: "client-reps",
      label: "Client Reps",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-60 lg:w-64 h-full shrink-0 bg-white border-r border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col justify-between py-5 px-3 z-20 select-none font-sans shadow-[2px_0_12px_rgba(38,26,102,0.03)]">
      {/* Top Group: Brand Logo & Navigation Links */}
      <div className="flex flex-col gap-4 w-full">
        {/* Brand Logo with Drive Storage style lower-case dot */}
        <div className="px-3 pt-1 pb-2 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)]/60">
          <div className="flex items-center gap-1">
            <span className="text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight font-sans">
              vantaged
            </span>
            <span className="text-xl font-extrabold text-[var(--vt-color-orange-500,#EF5F18)] -ml-0.5">
              .
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" title="System online" />
        </div>

        {/* Navigation Items List: Home -> Projects -> Transactions -> Messages -> Find companies -> Client Reps -> Disputes -> Settings */}
        <nav className="flex flex-col gap-1 w-full px-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]/70 shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.icon(isActive)}
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-sans transition-colors ${
                      isActive
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                        : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Base: Owner Profile Card */}
      <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1">
        <div className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] hover:bg-white flex items-center justify-between transition-all cursor-pointer group shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Circular Profile Picture with Live Status */}
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                alt="James Robinson"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] ring-2 ring-white" />
            </div>

            {/* Profile Info */}
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                James Robinson
              </h4>
              <p className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] uppercase tracking-wider truncate">
                Owner Admin
              </p>
              <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate font-sans">
                james@vantaged.io
              </p>
            </div>
          </div>

          {/* Options / Action Chevron Button */}
          <button
            type="button"
            title="Account Options"
            className="text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] p-1 rounded-sm shrink-0"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
