"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../../../client/context/ThemeContext";
import { useContractorUser } from "../hooks/useContractorUser";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { DIRECTOR_NAV_ITEMS, DirectorNavId } from "../data/directorData";
import { DirectorProfileModal } from "./DirectorProfileModal";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  readCompanyLiveNotifications,
  readSharedConversations,
} from "../../../shared/vantagedSyncBridge";
import { signOutContractor } from "../../../shared/vantagedAuth";

function renderNavIcon(id: DirectorNavId, isActive: boolean) {
  const cls = `w-4 h-4 shrink-0 transition-colors ${
    isActive
      ? "text-[var(--vt-color-orange-600,#D84C0B)]"
      : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
  }`;

  switch (id) {
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "projects":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "requests":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case "messages":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "transactions":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      );
    case "presets":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "team":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "rewards":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "notifications":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "settings":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}

export function DirectorSidebarNav({
  currentActiveItem,
}: {
  currentActiveItem?: DirectorNavId;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const user = useContractorUser();
  const { isDemoMode, toggleDemoMode } = useDirectorDemoMode();

  const [activeItem, setActiveItem] = useState<DirectorNavId>(currentActiveItem || "home");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [liveUnreadMessages, setLiveUnreadMessages] = useState(0);
  const [liveUnreadNotifs, setLiveUnreadNotifs] = useState(0);
  const [liveProjectsCount, setLiveProjectsCount] = useState(0);

  useEffect(() => {
    const syncCounts = () => {
      const threads = readSharedConversations(isDemoMode);
      setLiveUnreadMessages(
        threads.reduce((acc, t) => acc + (t.contractorUnreadCount || 0), 0)
      );
      const liveNotifs = readCompanyLiveNotifications();
      setLiveUnreadNotifs(liveNotifs.filter((n) => n.isUnread).length);
      try {
        const raw = localStorage.getItem("vantaged_company_accepted_projects");
        const parsed = raw ? JSON.parse(raw) : [];
        setLiveProjectsCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setLiveProjectsCount(0);
      }
    };
    syncCounts();
    window.addEventListener(SHARED_SYNC_EVENT, syncCounts);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, syncCounts);
    window.addEventListener("vantaged_company_projects_update", syncCounts);
    window.addEventListener("vantaged_director_demo_toggle", syncCounts);
    window.addEventListener("storage", syncCounts);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, syncCounts);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, syncCounts);
      window.removeEventListener("vantaged_company_projects_update", syncCounts);
      window.removeEventListener("vantaged_director_demo_toggle", syncCounts);
      window.removeEventListener("storage", syncCounts);
    };
  }, [isDemoMode]);

  useEffect(() => {
    if (currentActiveItem) {
      setActiveItem(currentActiveItem);
      return;
    }
    const matched = DIRECTOR_NAV_ITEMS.find((item) =>
      item.id === "home"
        ? pathname === "/contractor/dashboard"
        : pathname?.startsWith(item.href)
    );
    if (matched) setActiveItem(matched.id);
  }, [currentActiveItem, pathname]);

  const getBadge = (id: DirectorNavId): number | undefined => {
    if (id === "messages") {
      return liveUnreadMessages > 0 ? liveUnreadMessages : undefined;
    }
    if (id === "notifications") {
      const total = (isDemoMode ? 4 : 0) + liveUnreadNotifs;
      return total > 0 ? total : undefined;
    }
    if (id === "projects") {
      const total = (isDemoMode ? 3 : 0) + liveProjectsCount;
      return total > 0 ? total : undefined;
    }
    if (!isDemoMode) return undefined;
    if (id === "requests") return 1;
    if (id === "transactions") return 1;
    return undefined;
  };

  const initials = user.fullName
    .replace(/^(Engr\.|Arch\.|QS|Chief)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  const renderDemoToggle = () => (
    <div className="pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1">
      <div className="p-2.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
            Demo Data
          </span>
          <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate font-sans">
            {isDemoMode ? "Mock company builds" : "Live state (Real data)"}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleDemoMode}
          role="switch"
          aria-checked={isDemoMode}
          title={isDemoMode ? "Switch to Empty State" : "Switch to Demo Data"}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isDemoMode
              ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
              : "bg-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isDemoMode ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderUserCard = () => (
    <div className="pt-2.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1 relative">
      {isProfileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsProfileMenuOpen(false)}
          />
          <div className="absolute bottom-16 left-1 right-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-[0_12px_36px_rgba(38,26,102,0.18)] p-1.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p className="leading-tight font-bold">Company & Profile</p>
                <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-normal">
                  CAC, slots & credentials
                </p>
              </div>
            </button>

            <Link
              href="/contractor/login"
              onClick={() => setIsProfileMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              </div>
              <div>
                <p className="leading-tight font-bold">Switch Staff Role</p>
                <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-normal">
                  Director · Site Mgr · Office · Crew
                </p>
              </div>
            </Link>

            <div className="my-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]" />

            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                signOutContractor();
                router.replace("/contractor/login");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div>
                <p className="leading-tight font-bold">Sign Out</p>
                <p className="text-[10px] text-rose-400 font-normal">Return to company login</p>
              </div>
            </button>
          </div>
        </>
      )}

      <div
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className={`p-2.5 rounded-lg border transition-all cursor-pointer group shadow-2xs flex items-center justify-between gap-2 ${
          isProfileMenuOpen
            ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-400,#F78241)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/20"
            : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] hover:bg-white"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {initials || "BA"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
              {user.fullName}
            </h4>
            <p className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] uppercase tracking-wider truncate">
              {user.role}
            </p>
            <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate font-sans">
              {user.email}
            </p>
          </div>
        </div>

        <div
          className={`text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] p-1 rounded-sm shrink-0 transition-transform duration-200 ${
            isProfileMenuOpen ? "rotate-90 text-[var(--vt-color-orange-600,#D84C0B)]" : ""
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderNavLinks = (isMobileDrawer: boolean) => (
    <nav className="flex flex-col gap-1 w-full px-1 overflow-y-auto scrollbar-thin">
      {DIRECTOR_NAV_ITEMS.map((item) => {
        const isActive = activeItem === item.id;
        const badge = getBadge(item.id);
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              setActiveItem(item.id);
              if (isMobileDrawer) setIsMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]/70 shadow-2xs"
                : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {renderNavIcon(item.id, isActive)}
              <span className="truncate">{item.label}</span>
            </div>

            {badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-sans transition-colors tabular-nums ${
                  isActive
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                    : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                }`}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ── Mobile Top App Bar (< md) ── */}
      <header className="md:hidden w-full h-14 bg-white/95 backdrop-blur-md border-b border-[var(--vt-color-border-default,#E2E0EC)] px-3.5 flex items-center justify-between shrink-0 z-30 select-none shadow-2xs">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open company navigation menu"
          className="w-9 h-9 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link href="/contractor/dashboard" className="flex items-center gap-1.5 cursor-pointer">
          <Image
            src="/brand/vantaged-measurement-logo.svg"
            alt="Vantaged"
            width={150}
            height={30}
            unoptimized
            className="h-7 w-auto max-w-[145px] object-contain dark:hidden"
          />
          <Image
            src="/brand/vantaged-measurement-logo-dark.svg"
            alt="Vantaged"
            width={150}
            height={30}
            unoptimized
            className="hidden dark:block h-7 w-auto max-w-[145px] object-contain"
          />
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white tracking-wider uppercase">
            COMPANY
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center cursor-pointer shadow-2xs"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[var(--vt-color-orange-400,#F6803F)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <Link
            href="/contractor/notifications"
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center relative shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {isDemoMode && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-1.5 ring-white" />
            )}
          </Link>
        </div>
      </header>

      {/* ── Mobile Slide-Out Drawer ── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[var(--vt-color-indigo-950,#140B3B)]/50 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <aside className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col justify-between py-5 px-3 animate-in slide-in-from-left duration-200 border-r border-[var(--vt-color-border-default,#E2E0EC)]">
            <div className="flex flex-col gap-4 w-full min-h-0 flex-1">
              <div className="px-3 pt-1 pb-3 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)] shrink-0">
                <Link href="/contractor/dashboard" className="flex items-center gap-2">
                  <Image
                    src="/brand/vantaged-measurement-logo.svg"
                    alt="Vantaged"
                    width={150}
                    height={32}
                    unoptimized
                    className="h-7.5 w-auto max-w-[140px] object-contain dark:hidden"
                  />
                  <Image
                    src="/brand/vantaged-measurement-logo-dark.svg"
                    alt="Vantaged"
                    width={150}
                    height={32}
                    unoptimized
                    className="hidden dark:block h-7.5 w-auto max-w-[140px] object-contain"
                  />
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white uppercase">
                    COMPANY
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
              {renderNavLinks(true)}
            </div>

            <div className="flex flex-col gap-2.5 w-full shrink-0 pt-2">
              {renderDemoToggle()}
              {renderUserCard()}
            </div>
          </aside>
        </div>
      )}

      {/* ── Desktop Sidebar Rail (md+) ── */}
      <aside className="hidden md:flex w-60 lg:w-64 h-full shrink-0 bg-white border-r border-[var(--vt-color-border-default,#E2E0EC)] flex-col justify-between py-5 px-3 z-20 select-none font-sans shadow-[2px_0_12px_rgba(38,26,102,0.03)]">
        <div className="flex flex-col gap-4 w-full min-h-0 flex-1">
          <div className="px-3 pt-1 pb-3 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)] shrink-0">
            <Link href="/contractor/dashboard" className="flex items-center gap-2 cursor-pointer group">
              <Image
                src="/brand/vantaged-measurement-logo.svg"
                alt="Vantaged"
                width={160}
                height={32}
                unoptimized
                className="h-8 w-auto max-w-[148px] object-contain transition-opacity group-hover:opacity-90 dark:hidden"
              />
              <Image
                src="/brand/vantaged-measurement-logo-dark.svg"
                alt="Vantaged"
                width={160}
                height={32}
                unoptimized
                className="hidden dark:block h-8 w-auto max-w-[148px] object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white uppercase tracking-wide">
                COMPANY
              </span>
            </Link>
          </div>

          {renderNavLinks(false)}
        </div>

        <div className="flex flex-col gap-2.5 w-full shrink-0 pt-2">
          {renderDemoToggle()}
          {renderUserCard()}
        </div>
      </aside>

      <DirectorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
