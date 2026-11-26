"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../client/context/ThemeContext";
import { useContractorUser } from "../hooks/useContractorUser";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { DIRECTOR_SEARCH_ITEMS, DirectorSearchItem } from "../data/directorData";
import { DirectorProfileModal } from "./DirectorProfileModal";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  readCompanyLiveNotifications,
} from "../../../shared/vantagedSyncBridge";

export function DirectorHeaderBar({
  leftSlot,
}: {
  leftSlot?: React.ReactNode;
} = {}) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const user = useContractorUser();
  const { isDemoMode } = useDirectorDemoMode();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUnread = () => {
      const liveUnread = readCompanyLiveNotifications().filter((n) => n.isUnread).length;
      let demoUnread = 0;
      if (isDemoMode) {
        try {
          const saved = localStorage.getItem("vantaged_director_notifications");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              demoUnread = parsed.filter((n: any) => n?.isUnread).length;
            }
          } else {
            demoUnread = 3;
          }
        } catch {
          demoUnread = 3;
        }
      }
      setUnreadNotifCount(liveUnread + demoUnread);
    };
    syncUnread();
    window.addEventListener(SHARED_SYNC_EVENT, syncUnread);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, syncUnread);
    window.addEventListener("vantaged_director_demo_toggle", syncUnread);
    window.addEventListener("storage", syncUnread);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, syncUnread);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, syncUnread);
      window.removeEventListener("vantaged_director_demo_toggle", syncUnread);
      window.removeEventListener("storage", syncUnread);
    };
  }, [isDemoMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    const pool = DIRECTOR_SEARCH_ITEMS.filter((item) => isDemoMode || !item.demoOnly);
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return pool.slice(0, 5);
    }
    return pool.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, isDemoMode]);

  const handleSelectResult = (item: DirectorSearchItem) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    router.push(item.url);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleSelectResult(searchResults[0]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const initials = user.fullName
    .replace(/^(Engr\.|Arch\.|QS|Chief)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <>
      <header className="w-full flex items-center justify-between gap-2.5 pt-1 pb-2 font-sans select-none">
        {leftSlot ? (
          <div className="shrink-0 flex items-center justify-start min-w-0 max-w-[45%] md:max-w-md lg:max-w-lg">
            {leftSlot}
          </div>
        ) : null}

        {/* Global Search Bar */}
        <div ref={containerRef} className="relative flex-1 max-w-lg min-w-0">
          <svg
            className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
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

          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search projects, requests, receipts, crew..."
            className="w-full h-9 pl-9 pr-8 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none transition-all shadow-2xs font-sans"
          />

          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] hover:bg-[var(--vt-color-neutral-300,#CBC8DA)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-[10px] cursor-pointer"
            >
              ✕
            </button>
          )}

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-[0_12px_36px_rgba(38,26,102,0.14)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-96 flex flex-col">
              <div className="px-3.5 py-2 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                <span>
                  {searchQuery.trim()
                    ? `Search results (${searchResults.length})`
                    : "Quick navigation"}
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Press Enter to select
                </span>
              </div>

              <div className="overflow-y-auto divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                    <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                      No matching items found
                    </p>
                    <p>Try searching for projects, requests, receipts, presets, or crew.</p>
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      className="w-full text-left p-3 hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="shrink-0 pl-3.5 border-l border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end">
                        <span className="text-xs font-medium text-[var(--vt-color-neutral-500,#7C7894)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Controls (Desktop md+) */}
        <div className="hidden md:flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs font-sans"
          >
            {theme === "light" ? (
              <>
                <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-400,#F6803F)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>

          <Link
            href="/contractor/notifications"
            aria-label="Notifications"
            title="Notifications"
            className="w-9 h-9 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-center text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors relative shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[9.5px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
              </span>
            )}
          </Link>

          <Link
            href="/contractor/projects"
            className="h-9 px-3.5 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(179,60,8,0.28)] flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>+ New Project</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            aria-label="Open Director Profile"
            title={`${user.fullName} (${user.companyName})`}
            className="w-9 h-9 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white font-extrabold text-xs flex items-center justify-center border border-[var(--vt-color-border-default,#E2E0EC)] hover:ring-2 hover:ring-[var(--vt-color-orange-500,#EF5F18)]/30 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            {initials || "BA"}
          </button>
        </div>
      </header>

      <DirectorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
