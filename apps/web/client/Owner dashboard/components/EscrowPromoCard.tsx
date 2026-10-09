"use client";

import React from "react";

export function EscrowPromoCard() {
  return (
    <div className="bg-gradient-to-br from-[var(--vt-color-orange-500,#EF5F18)] via-[var(--vt-color-orange-600,#D84C0B)] to-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-400,#F6803F)] text-white rounded-xl p-5 sm:p-6 shadow-[0_16px_36px_-6px_rgba(239,95,24,0.35)] flex flex-col items-center justify-between text-center select-none min-h-[310px] relative overflow-hidden group font-sans">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      {/* Vector Illustration of Gift Box / Hands */}
      <div className="h-24 w-28 flex items-center justify-center my-1 relative">
        <svg className="w-24 h-24 text-white" viewBox="0 0 100 100" fill="none">
          {/* Confetti particles */}
          <circle cx="20" cy="25" r="2.5" fill="var(--vt-color-amber-300,#F6C447)" />
          <circle cx="80" cy="20" r="2.5" fill="#FFF" />
          <circle cx="15" cy="50" r="2" fill="var(--vt-color-orange-200,#FDCAA9)" />
          <circle cx="85" cy="45" r="2" fill="var(--vt-color-amber-300,#F6C447)" />
          <path d="M28 15L32 18" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M72 12L68 16" stroke="var(--vt-color-orange-200,#FDCAA9)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Hands holding gift box */}
          <path d="M18 70C24 64 32 66 38 72L42 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M82 70C76 64 68 66 62 72L58 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Gift Box Body */}
          <rect x="32" y="44" width="36" height="30" rx="4" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="2.5" />
          {/* Gift Box Lid */}
          <rect x="28" y="38" width="44" height="9" rx="3" fill="#FFFFFF" />
          {/* Vertical Ribbon in Scarlet Bikini Indigo (10% brand anchor) */}
          <rect x="47" y="38" width="6" height="36" fill="var(--vt-color-indigo-950,#170F42)" />
          {/* Bow loop left */}
          <path d="M50 38C44 32 38 34 44 40C48 40 50 39 50 38Z" fill="var(--vt-color-indigo-950,#170F42)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Bow loop right */}
          <path d="M50 38C56 32 62 34 56 40C52 40 50 39 50 38Z" fill="var(--vt-color-indigo-950,#170F42)" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Title & Description */}
      <div className="my-auto px-2">
        <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white mb-1.5">
          Go premium!
        </h3>
        <p className="text-[11px] text-white/90 leading-relaxed max-w-[210px] mx-auto font-normal">
          Gain access to a range of benefits designed to enhance your user experience
        </p>
      </div>

      {/* Dark Scarlet Bikini Anchor Button */}
      <button
        type="button"
        className="w-full mt-3 h-10 px-5 rounded-md bg-[var(--vt-color-indigo-950,#170F42)] hover:bg-[var(--vt-color-indigo-900,#261A66)] active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
      >
        Find out more
      </button>
    </div>
  );
}
