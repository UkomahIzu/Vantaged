"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface DirectorQuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  illustration: React.ReactNode;
}

export const ALL_DIRECTOR_QUICK_ACTIONS: DirectorQuickActionItem[] = [
  {
    id: "create-project",
    title: "Create project & plan",
    subtitle: "Draft milestones & payment splits from a preset",
    href: "/contractor/projects",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="10" y="12" width="34" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M18 22H36M18 29H32M18 36H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="36" r="10" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" />
        <path d="M44 31.5V40.5M39.5 36H48.5" stroke="var(--vt-color-orange-700,#B33C08)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "confirm-receipts",
    title: "Confirm payment receipts",
    subtitle: "Verify client transfers within 3-day window",
    href: "/contractor/transactions",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="8" y="14" width="38" height="26" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M8 22H46" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="29" width="14" height="4" rx="1.5" fill="var(--vt-color-neutral-200,#E2E0EC)" />
        <circle cx="45" cy="36" r="9" fill="var(--vt-color-green-50,#E9F6EC)" stroke="var(--vt-color-green-500,#2E9E57)" strokeWidth="2" />
        <path d="M41.5 36L44 38.5L48.5 33.5" stroke="var(--vt-color-green-700,#1F6B3E)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "submit-proof",
    title: "Submit stage proof",
    subtitle: "Upload geofenced photos, videos & checklist sign-offs",
    href: "/contractor/projects",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="10" y="16" width="36" height="26" rx="5" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M21 16L24 11H32L35 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="28" cy="29" r="6.5" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <circle cx="45" cy="18" r="7" fill="var(--vt-color-orange-500,#EF5F18)" />
        <path d="M45 14.5V21.5M42 17.5L45 14.5L48 17.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "invite-staff",
    title: "Invite staff & crew",
    subtitle: "Assign Site Managers, Office Coord. & Crew roles",
    href: "/contractor/team",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="14" y="12" width="32" height="34" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <circle cx="30" cy="24" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 38C21 33.8 25 31.5 30 31.5C35 31.5 39 33.8 39 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="45" cy="36" r="8" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" />
        <path d="M45 32.5V39.5M41.5 36H48.5" stroke="var(--vt-color-orange-700,#B33C08)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "stage-presets",
    title: "Company stage presets",
    subtitle: "Customize stage templates & payment splits",
    href: "/contractor/presets",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <polygon points="32,10 52,20 32,30 12,20" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <polyline points="12,28 32,38 52,28" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <polyline points="12,36 32,46 52,36" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "bank-details",
    title: "Corporate bank & KYC",
    subtitle: "Manage CAC-matched NUBAN & 48h safety lock",
    href: "/contractor/settings",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <path d="M12 22L32 11L52 22H12Z" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" strokeLinejoin="round" />
        <path d="M18 22V39M28 22V39M36 22V39M46 22V39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="39" width="44" height="6" rx="2" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" />
      </svg>
    ),
  },
];

const STORAGE_KEY_QUICK_SLOTS = "vantaged_director_quick_slots";

export function DirectorQuickActions() {
  const router = useRouter();
  const [slots, setSlots] = useState<(string | null)[]>([
    "create-project",
    "confirm-receipts",
    "submit-proof",
    "invite-staff",
  ]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY_QUICK_SLOTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          const validated = parsed.map((id) =>
            id && ALL_DIRECTOR_QUICK_ACTIONS.some((a) => a.id === id) ? id : null
          );
          setSlots(validated);
        }
      } catch {
        // Ignore malformed cache
      }
    }
  }, []);

  const persistSlots = (nextSlots: (string | null)[]) => {
    setSlots(nextSlots);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUICK_SLOTS, JSON.stringify(nextSlots));
    }
  };

  const handleRemoveSlot = (index: number) => {
    const next = [...slots];
    next[index] = null;
    persistSlots(next);
  };

  const handleSelectAction = (actionId: string) => {
    if (activeSlotIndex !== null) {
      const next = [...slots];
      next[activeSlotIndex] = actionId;
      persistSlots(next);
    }
    setIsModalOpen(false);
    setActiveSlotIndex(null);
  };

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none font-sans"
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      >
        {slots.map((actionId, index) => {
          const action = actionId
            ? ALL_DIRECTOR_QUICK_ACTIONS.find((a) => a.id === actionId)
            : null;

          if (!action) {
            return (
              <div
                key={`empty-slot-${index}`}
                onClick={() => {
                  setActiveSlotIndex(index);
                  setIsModalOpen(true);
                }}
                className="w-full min-h-[150px] sm:min-h-[162px] h-[162px] bg-[var(--vt-color-orange-50,#FFF4EE)]/50 hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-dashed border-[var(--vt-color-orange-300,#FBA674)] hover:border-[var(--vt-color-orange-500,#EF5F18)] rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] group-hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-[0_4px_12px_rgba(179,60,8,0.28)]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="mt-2.5 text-xs font-bold text-[var(--vt-color-orange-700,#B33C08)] tracking-tight">
                  Add quick action
                </span>
              </div>
            );
          }

          return (
            <div
              key={`${action.id}-${index}`}
              onClick={() => router.push(action.href)}
              className="relative w-full min-h-[150px] sm:min-h-[162px] h-[162px] bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-4 sm:p-4.5 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)]"
            >
              <button
                type="button"
                title="Customize shortcut slot"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSlot(index);
                }}
                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center text-[10px] font-bold transition-opacity cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-2.5 transition-transform duration-200 group-hover:scale-105">
                {action.illustration}
              </div>

              <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-700,#B33C08)] tracking-tight leading-snug">
                {action.title}
              </h3>
              <p className="mt-0.5 text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] line-clamp-2 leading-tight px-1">
                {action.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Picker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-[0_20px_50px_rgba(38,26,102,0.22)] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Choose Quick Action
                </h3>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Pin a Director, Site Manager, or Office Coordinator workflow
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {ALL_DIRECTOR_QUICK_ACTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectAction(item.id)}
                  className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 text-left flex items-center gap-3 transition-all cursor-pointer"
                >
                  <div className="shrink-0 scale-75">{item.illustration}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] line-clamp-2 mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
