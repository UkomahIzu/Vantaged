"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  region: string;
}

export const supportedLanguages: LanguageOption[] = [
  { code: "EN", name: "English", nativeName: "English", region: "Global / International" },
  { code: "FR", name: "French", nativeName: "Français", region: "France & West Africa" },
  { code: "SW", name: "Swahili", nativeName: "Kiswahili", region: "East Africa" },
  { code: "YO", name: "Yoruba", nativeName: "Èdè Yorùbá", region: "West Africa / Nigeria" },
  { code: "IG", name: "Igbo", nativeName: "Asụsụ Igbo", region: "West Africa / Nigeria" },
  { code: "HA", name: "Hausa", nativeName: "Harshen Hausa", region: "West & Central Africa" },
  { code: "AR", name: "Arabic", nativeName: "العربية", region: "North Africa & Middle East" },
  { code: "PT", name: "Portuguese", nativeName: "Português", region: "Lusophone & Angola/Mozambique" },
  { code: "ES", name: "Spanish", nativeName: "Español", region: "Spain & Latin America" },
  { code: "DE", name: "German", nativeName: "Deutsch", region: "Germany & Central Europe" },
  { code: "ZH", name: "Chinese", nativeName: "中文 (简体)", region: "East Asia & Global Commerce" },
];

export interface LanguageDropdownProps {
  currentLanguage?: string;
  onSelectLanguage?: (lang: LanguageOption) => void;
}

export function LanguageDropdown({
  currentLanguage = "EN",
  onSelectLanguage,
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState(currentLanguage);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Focus the search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Filter languages by search query
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return supportedLanguages;
    return supportedLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelect = (lang: LanguageOption) => {
    setSelectedCode(lang.code);
    setIsOpen(false);
    setSearchQuery("");
    onSelectLanguage?.(lang);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Globe Button (Square with slight border radius) */}
      <button
        id="nav-global-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`h-8 w-8 rounded-md flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vt-color-orange-500,#EF5F18)] ${
          isOpen
            ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
            : "bg-[var(--vt-color-indigo-900,#261A66)] text-white hover:bg-[var(--vt-color-orange-500,#EF5F18)]"
        }`}
        title="Select Region & Language"
        aria-label="Select global region and language"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          role="dialog"
          aria-label="Language selection"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[var(--vt-color-neutral-200,#E2E0EC)] rounded-md shadow-[0_16px_36px_-6px_rgba(38,26,102,0.18)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="px-3.5 pt-3 pb-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-[var(--vt-color-neutral-500,#7C7894)]">
              Language & Region
            </span>
            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] font-semibold">
              {selectedCode}
            </span>
          </div>

          {/* Search Bar */}
          <div className="p-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
            <div className="relative flex items-center">
              <svg
                className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language or region..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-[var(--vt-color-neutral-200,#E2E0EC)] rounded-md text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-1 focus:ring-[var(--vt-color-orange-500,#EF5F18)] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]/50">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === selectedCode;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                        : "text-[var(--vt-color-neutral-700,#46425F)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isSelected
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                            : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                        }`}
                      >
                        {lang.code}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">{lang.name}</span>
                        <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                          {lang.nativeName} · {lang.region}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <svg
                        className="h-4 w-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 ml-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                No matching languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
