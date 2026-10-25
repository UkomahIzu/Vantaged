"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

interface HeaderBarProps {
  leftSlot?: React.ReactNode;
}

interface SearchItem {
  id: string;
  category: "Project" | "Milestone" | "Representative" | "Builder" | "Payment" | "Page";
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
}

const GLOBAL_SEARCH_ITEMS: SearchItem[] = [
  // ── Projects ──
  {
    id: "proj-lekki",
    category: "Project",
    title: "Lekki Phase 1 Luxury Villa",
    subtitle: "Plot 14, Admiralty Way · 82% completed · Julius Berger Nig.",
    url: "/owner/projects/proj-lekki",
    badge: "Active",
  },
  {
    id: "proj-enclave",
    category: "Project",
    title: "The Enclave Waterfront Resort",
    subtitle: "Epe Waterfront Corridor · 44% completed · Crane & Stone",
    url: "/owner/projects/proj-enclave",
    badge: "Active",
  },
  {
    id: "proj-guzape",
    category: "Project",
    title: "Guzape Hills Residence",
    subtitle: "Asokoro Extension, Abuja · 64% completed · SolidGround Eng.",
    url: "/owner/projects/proj-guzape",
    badge: "Active",
  },
  {
    id: "proj-eko",
    category: "Project",
    title: "Eko Atlantic Sky Tower",
    subtitle: "Marina District, Eko Atlantic · 30% completed · Cappa & D'Alberto",
    url: "/owner/projects/proj-eko",
    badge: "Active",
  },
  {
    id: "proj-banana",
    category: "Project",
    title: "Banana Island Horizon Penthouse",
    subtitle: "Zone C, Banana Island, Ikoyi · 88% completed · Horizon Pro",
    url: "/owner/projects/proj-banana",
    badge: "Active",
  },
  {
    id: "proj-vi",
    category: "Project",
    title: "Victoria Island Commercial Plaza",
    subtitle: "Adeola Odeku St, Victoria Island · 18% completed · Costain West Africa",
    url: "/owner/projects/proj-vi",
    badge: "Active",
  },

  // ── Milestones / Stages ──
  {
    id: "stage-lekki-4",
    category: "Milestone",
    title: "Stage 4: Upper Floor Concrete Pouring",
    subtitle: "Lekki Phase 1 · Ready for sign-off · ₦18,450,000",
    url: "/owner/projects/proj-lekki/stages/4",
    badge: "Needs Review",
  },
  {
    id: "stage-lekki-3",
    category: "Milestone",
    title: "Stage 3: First Floor Suspended Slab Casting",
    subtitle: "Lekki Phase 1 · Completed · ₦29,400,000 released",
    url: "/owner/projects/proj-lekki/stages/3",
    badge: "Completed",
  },
  {
    id: "stage-lekki-2",
    category: "Milestone",
    title: "Stage 2: Foundation & Ground Floor",
    subtitle: "Lekki Phase 1 · Inspected & signed off",
    url: "/owner/projects/proj-lekki/stages/2",
    badge: "Completed",
  },
  {
    id: "stage-enclave-1",
    category: "Milestone",
    title: "Stage 1: Foundation & Deep Underground Piling",
    subtitle: "The Enclave · 24 concrete piles · Marine waterproof mix",
    url: "/owner/projects/proj-enclave/stages/1",
    badge: "In Progress",
  },
  {
    id: "stage-guzape-2",
    category: "Milestone",
    title: "Stage 2: Roof Frame Assembly & Parapet Concrete Pour",
    subtitle: "Guzape Hills · Galvanized steel rafters & waterproof membrane",
    url: "/owner/projects/proj-guzape/stages/2",
    badge: "In Progress",
  },
  {
    id: "stage-eko-2",
    category: "Milestone",
    title: "Stage 2: High-Rise Concrete Pillars & Floor Pouring",
    subtitle: "Eko Atlantic Sky Tower · Level 4 concrete active",
    url: "/owner/projects/proj-eko/stages/2",
    badge: "In Progress",
  },

  // ── Representatives ──
  {
    id: "rep-damilola",
    category: "Representative",
    title: "Arc. Damilola Oladipo",
    subtitle: "Principal Project Architect · Assigned to Lekki Villa",
    url: "/owner/client-reps",
    badge: "Verified",
  },
  {
    id: "rep-tunde",
    category: "Representative",
    title: "Engr. Tunde Bakare",
    subtitle: "Certified Structural Engineer · Assigned to Guzape Hills",
    url: "/owner/client-reps",
    badge: "Verified",
  },
  {
    id: "rep-kelechi",
    category: "Representative",
    title: "Bldr. Kelechi Nwosu",
    subtitle: "Site Quality Inspector · Assigned to The Enclave",
    url: "/owner/client-reps",
    badge: "Verified",
  },
  {
    id: "rep-folake",
    category: "Representative",
    title: "Arc. Folake Davies",
    subtitle: "Senior Site Representative · Assigned to Eko Sky Tower",
    url: "/owner/client-reps",
    badge: "Verified",
  },

  // ── Builders & Contractors ──
  {
    id: "builder-jb",
    category: "Builder",
    title: "Julius Berger Nig. Consortium",
    subtitle: "General Contractor · 14 completed projects · Rating 4.8 ★",
    url: "/owner/find-companies",
  },
  {
    id: "builder-crane",
    category: "Builder",
    title: "Crane & Stone Builders",
    subtitle: "Waterfront & Marine Engineering · Rating 4.9 ★",
    url: "/owner/find-companies",
  },
  {
    id: "builder-solid",
    category: "Builder",
    title: "SolidGround Engineering",
    subtitle: "Civil & Commercial Structural Builders · Rating 4.8 ★",
    url: "/owner/find-companies",
  },
  {
    id: "builder-cappa",
    category: "Builder",
    title: "Cappa & D'Alberto",
    subtitle: "High-Rise Commercial & Residential · Rating 4.9 ★",
    url: "/owner/find-companies",
  },

  // ── Payments & Receipts ──
  {
    id: "pay-97810",
    category: "Payment",
    title: "Receipt PAY-2026-97810",
    subtitle: "₦29,400,000 · Lekki Villa Stage 3 Slab Casting · Received by Builder",
    url: "/owner/transactions?search=PAY-2026-97810",
    badge: "Paid",
  },
  {
    id: "pay-92108",
    category: "Payment",
    title: "Receipt PAY-2026-92108",
    subtitle: "₦17,100,000 · Victoria Island Piling · Received by Builder",
    url: "/owner/transactions?search=PAY-2026-92108",
    badge: "Paid",
  },
  {
    id: "pay-holdback",
    category: "Payment",
    title: "Quality Guarantee Hold (Final 5%)",
    subtitle: "₦41,162,300 held securely until final house handover",
    url: "/owner/transactions",
    badge: "Held Safe",
  },
  {
    id: "pay-escrow",
    category: "Payment",
    title: "Protected Escrow Account",
    subtitle: "₦140,500,000 currently in bank escrow for upcoming work",
    url: "/owner/transactions",
    badge: "Escrow",
  },

  // ── Pages & Navigation ──
  {
    id: "page-projects",
    category: "Page",
    title: "All Projects Dashboard",
    subtitle: "View all 6 active buildings, proposed plans, and history",
    url: "/owner/projects",
  },
  {
    id: "page-transactions",
    category: "Page",
    title: "Payments & Financial History",
    subtitle: "Deposit funds, view receipts, and monitor building costs",
    url: "/owner/transactions",
  },
  {
    id: "page-reps",
    category: "Page",
    title: "My Representatives",
    subtitle: "Manage your architects, structural engineers, and site proxies",
    url: "/owner/client-reps",
  },
  {
    id: "page-companies",
    category: "Page",
    title: "Find Builders & Contractors",
    subtitle: "Browse certified construction companies with escrow protection",
    url: "/owner/find-companies",
  },
  {
    id: "page-changes",
    category: "Page",
    title: "Change Requests & Extra Work",
    subtitle: "Review and approve material upgrades or timeline changes",
    url: "/owner/projects/proj-lekki/change-requests",
  },
  {
    id: "page-notifications",
    category: "Page",
    title: "Notifications & Alerts",
    subtitle: "Inspection reports, payment receipts, and site updates",
    url: "/owner/notifications",
  },
];

export function HeaderBar({ leftSlot }: HeaderBarProps = {}) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items based on query
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Return top quick suggestions when search bar is focused but empty
      return GLOBAL_SEARCH_ITEMS.filter((item) =>
        ["proj-lekki", "stage-lekki-4", "page-transactions", "rep-damilola", "page-projects"].includes(item.id)
      );
    }
    return GLOBAL_SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectResult = (item: SearchItem) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    router.push(item.url);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleSelectResult(searchResults[0]);
      } else if (searchQuery.trim()) {
        setIsDropdownOpen(false);
        router.push(`/owner/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="w-full flex items-center justify-between gap-2.5 pt-1 pb-2 font-sans select-none"
    >
      {/* Left: Custom left action (e.g. Back arrow on Projects page, breadcrumbs) or spacer */}
      {leftSlot ? (
        <div className="shrink-0 flex items-center justify-start min-w-0 max-w-[45%] md:max-w-md lg:max-w-lg">
          {leftSlot}
        </div>
      ) : null}

      {/* Center: Always-Working Global Search Bar */}
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
          placeholder="Search projects, milestones, payments..."
          className="w-full h-9 pl-9 pr-8 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none transition-all shadow-2xs font-sans"
        />

        {/* Clear Button (✕) */}
        {searchQuery.trim() && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] hover:bg-[var(--vt-color-neutral-300,#CBC8DA)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center text-[10px] cursor-pointer transition-colors"
            title="Clear search"
          >
            ✕
          </button>
        )}

        {/* Live Search Results Dropdown Popover */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 font-sans max-h-96 flex flex-col">
            <div className="px-3.5 py-2 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
              <span>{searchQuery.trim() ? `Search results (${searchResults.length})` : "Quick suggestions"}</span>
              <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">Press Enter to choose</span>
            </div>

            <div className="overflow-y-auto divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">No matching results found</p>
                  <p>Try searching for a project name, milestone, representative, or payment receipt.</p>
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
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-0.5">{item.subtitle}</p>
                    </div>

                    {/* Separator line and standalone category text on the right */}
                    <div className="shrink-0 pl-3.5 border-l border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end">
                      <span className="text-xs font-medium text-[var(--vt-color-neutral-500,#7C7894)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors whitespace-nowrap">
                        {item.category}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {searchQuery.trim() && (
              <div className="p-2.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push(`/owner/projects?search=${encodeURIComponent(searchQuery.trim())}`);
                  }}
                  className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                >
                  See all project matches for &ldquo;{searchQuery}&rdquo; &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Single Toggle Button, Notifications, and Start Project Button (hidden on mobile, visible on desktop md+) */}
      <div className="hidden md:flex items-center justify-end gap-2.5 shrink-0 md:w-auto">
        {/* Single Light/Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className="h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs font-sans"
        >
          {theme === "light" ? (
            <>
              <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-400,#F6803F)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={() => router.push("/owner/notifications")}
          title="Notifications"
          className="w-9 h-9 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-center text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors cursor-pointer shadow-2xs relative"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-1.5 ring-white" />
        </button>

        {/* Start Project Primary Button - Links to /owner/find-companies */}
        <Link
          href="/owner/find-companies"
          className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Start project</span>
        </Link>
      </div>
    </header>
  );
}
