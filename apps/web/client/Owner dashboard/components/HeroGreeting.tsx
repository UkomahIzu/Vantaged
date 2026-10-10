"use client";

import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function HeroGreeting() {
  const { firstName } = useCurrentUser();

  return (
    <div className="flex flex-col justify-center select-none py-1 font-sans">
      {/* Top greeting without the active badge */}
      <div className="flex items-center gap-2 mb-1.5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
          Hi, {firstName}!
        </h1>
      </div>

      {/* Main question headline matching reference */}
      <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight mb-2.5">
        What are your <span className="text-[var(--vt-color-orange-500,#EF5F18)]">plans</span> for today?
      </h2>

      {/* Subtitle tailored authentically to Vantaged */}
      <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm sm:max-w-md leading-relaxed font-normal">
        Track verified milestone stages, inspect time-stamped site proofs, and manage escrow disbursements with complete transparency.
      </p>
    </div>
  );
}
