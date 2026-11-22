"use client";

import React from "react";
import { useContractorUser } from "../hooks/useContractorUser";

export function DirectorHeroGreeting() {
  const { firstName, companyName } = useContractorUser();

  return (
    <div
      className="flex flex-col justify-center select-none py-1 font-sans"
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
    >
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
          {companyName}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
        Hi, {firstName}!
      </h1>

      <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight mt-0.5 mb-2.5">
        What are your <span className="text-[var(--vt-color-orange-500,#EF5F18)]">operations</span> priorities today?
      </h2>

      <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm sm:max-w-md leading-relaxed font-normal">
        Build milestone plans, oversee site proof and crew tasks, confirm client transfer receipts within 3 days, and manage company compliance.
      </p>
    </div>
  );
}
