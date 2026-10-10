"use client";

import React, { useState, useEffect } from "react";

export interface ActionCardItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  illustration: React.ReactNode;
}

export const ALL_QUICK_ACTIONS: ActionCardItem[] = [
  {
    id: "share-link",
    title: "Generate share link",
    subtitle: "Read-only live progress link for family & reps",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="8" y="16" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M8 22H44" stroke="currentColor" strokeWidth="1.8" />
        <rect x="26" y="24" width="28" height="22" rx="4" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <path d="M35 35L45 35" stroke="var(--vt-color-orange-600,#D84C0B)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 30L45 35L40 40" stroke="var(--vt-color-orange-600,#D84C0B)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "message-contractor",
    title: "Message contractor / rep",
    subtitle: "Direct contextual chat with site engineer & director",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="10" y="12" width="34" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M18 36L14 42L24 36" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" strokeLinejoin="round" />
        <line x1="18" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="26" x2="28" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="28" y="22" width="28" height="20" rx="5" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <path d="M48 42L52 46L46 42" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <circle cx="36" cy="32" r="1.5" fill="var(--vt-color-orange-500,#EF5F18)" />
        <circle cx="42" cy="32" r="1.5" fill="var(--vt-color-orange-500,#EF5F18)" />
        <circle cx="48" cy="32" r="1.5" fill="var(--vt-color-orange-500,#EF5F18)" />
      </svg>
    ),
  },
  {
    id: "assign-rep",
    title: "Assign client rep",
    subtitle: "Invite a trusted proxy or independent clerk of works",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <path d="M22 6L32 16L42 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="16" y="14" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <rect x="26" y="10" width="12" height="4" rx="1.5" fill="var(--vt-color-orange-500,#EF5F18)" />
        <circle cx="32" cy="27" r="6" stroke="currentColor" strokeWidth="1.8" />
        <path d="M22 42C22 37 26 35 32 35C38 35 42 37 42 42" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="42" cy="38" r="6" fill="var(--vt-color-orange-500,#EF5F18)" />
        <path d="M39.5 38L41.5 40L44.5 36" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "stop-work",
    title: "Issue stop-work notice",
    subtitle: "Contractual pause on site pending inspection",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <polygon
          points="32,7 52,18 52,38 32,49 12,38 12,18"
          stroke="var(--vt-color-scarlet-500,#F43F5E)"
          strokeWidth="2"
          fill="var(--vt-color-scarlet-50,#FFF1F2)"
        />
        <rect x="26" y="21" width="4" height="14" rx="2" fill="var(--vt-color-scarlet-600,#E11D48)" />
        <rect x="34" y="21" width="4" height="14" rx="2" fill="var(--vt-color-scarlet-600,#E11D48)" />
      </svg>
    ),
  },
];

export function QuickActionCards() {
  // Slots: exactly 4 spots on the dashboard. Starts with 3 chosen actions + 1 'Add new' empty slot.
  const [slots, setSlots] = useState<(string | null)[]>([
    "share-link",
    "message-contractor",
    "assign-rep",
    null,
  ]);

  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load persisted slots from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vantaged_owner_quick_slots");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 4) {
            const validated = parsed.map((id) =>
              id && ALL_QUICK_ACTIONS.some((a) => a.id === id) ? id : null
            );
            setSlots(validated);
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const persistSlots = (newSlots: (string | null)[]) => {
    setSlots(newSlots);
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_owner_quick_slots", JSON.stringify(newSlots));
    }
  };

  // Removing an action puts 'Add new' into that exact slot
  const handleRemoveSlot = (index: number) => {
    const next = [...slots];
    next[index] = null;
    persistSlots(next);
  };

  // Clicking 'Add new' opens modal targeting this specific slot
  const handleOpenAddModal = (index: number) => {
    setActiveSlotIndex(index);
    setIsModalOpen(true);
  };

  // Selecting an action from the modal populates the slot
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
      {/* ── Dashboard Quick Actions 4-Column Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none font-sans">
        {slots.map((actionId, index) => {
          const action = actionId ? ALL_QUICK_ACTIONS.find((a) => a.id === actionId) : null;
          if (!action) {
            // Empty State: 'Add new' Card (Exact Shape & Size)
            return (
              <div
                key={`empty-slot-${index}`}
                onClick={() => handleOpenAddModal(index)}
                className="w-full min-h-[150px] sm:min-h-[162px] h-[162px] bg-[var(--vt-color-orange-50,#FFF4EE)]/50 hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-dashed border-[var(--vt-color-orange-300,#FBA674)] hover:border-[var(--vt-color-orange-500,#EF5F18)] rounded-xl p-4 sm:p-4.5 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-2xs"
              >
                <button
                  type="button"
                  title="Add quick action"
                  className="w-10 h-10 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-[0_4px_12px_rgba(239,95,24,0.35)] cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="text-[11px] font-bold text-[var(--vt-color-orange-700,#B33C08)] mt-2.5 group-hover:text-[var(--vt-color-orange-800,#8F320D)] transition-colors">
                  Add new
                </span>
              </div>
            );
          }

          return (
            <div
              key={`action-slot-${action.id}-${index}`}
              className="w-full min-h-[150px] sm:min-h-[162px] h-[162px] bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/30 border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] rounded-xl p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_4px_12px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.08)] transition-all cursor-pointer group relative"
            >
              {/* '-' Button at Top Right to Remove Quick Action */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSlot(index);
                }}
                title="Remove quick action"
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] flex items-center justify-center transition-all cursor-pointer z-10 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Action Graphic / Illustration */}
              <div className="h-14 flex items-center justify-center relative">
                {action.illustration}
              </div>

              {/* Action Title & Subtitle */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors leading-tight mb-1">
                  {action.title}
                </h3>
                <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight line-clamp-2">
                  {action.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Action Selection Modal (Centered, More Length Than Width, 2-Column Grid Retaining Exact Card Shape & Size) ── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none font-sans"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Container: More Length Than Width (Taller than wide, e.g. w-[410px] by h-[640px]) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[410px] max-h-[85vh] h-[640px] bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  Add Quick Action
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Select an action to pin to your quick dashboard
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                title="Close"
                className="w-8 h-8 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body: 2-Column Grid Where Each Card Retains Its Exact Squircle Shape and Size from Dashboard */}
            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--vt-color-neutral-300,#CBC8DA)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <div className="grid grid-cols-2 gap-3.5 justify-items-center">
                {ALL_QUICK_ACTIONS.map((action) => {
                  const isAlreadyPinned = slots.includes(action.id);

                  return (
                    <div
                      key={action.id}
                      onClick={() => handleSelectAction(action.id)}
                      className={`w-full max-w-[172px] min-h-[150px] sm:min-h-[162px] h-[162px] bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/30 border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_4px_12px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all cursor-pointer group relative ${
                        isAlreadyPinned ? "ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/40" : ""
                      }`}
                    >
                      {isAlreadyPinned && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[8px] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]">
                          Pinned
                        </span>
                      )}

                      {/* Action Graphic / Illustration (Exact Same Size) */}
                      <div className="h-14 flex items-center justify-center relative">
                        {action.illustration}
                      </div>

                      {/* Action Title & Subtitle (Exact Same Sizing & Typography) */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors leading-tight mb-1">
                          {action.title}
                        </h3>
                        <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight line-clamp-2">
                          {action.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
