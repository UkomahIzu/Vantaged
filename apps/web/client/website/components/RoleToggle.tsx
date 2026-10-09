"use client";

import React, { useState } from "react";

export function RoleToggle() {
  const [activeRole, setActiveRole] = useState<"CLIENT" | "CONTRACTOR">("CLIENT");

  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-[var(--vt-color-background-subtle,#F7F7FA)] p-1 border border-[var(--vt-color-border-subtle,#EFEEF5)]">
      <button
        type="button"
        onClick={() => setActiveRole("CLIENT")}
        className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
          activeRole === "CLIENT"
            ? "bg-white text-[var(--vt-color-text-default,#261A66)] shadow-[0_1px_4px_rgba(38,26,102,0.08)] border border-[var(--vt-color-border-default,#E2E0EC)]"
            : "text-[var(--vt-color-text-muted,#7C7894)] hover:text-[var(--vt-color-text-default,#261A66)]"
        }`}
      >
        Client
      </button>
      <span className="text-[10px] text-[var(--vt-color-neutral-300,#CBC8DA)] select-none">/</span>
      <button
        type="button"
        onClick={() => setActiveRole("CONTRACTOR")}
        className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
          activeRole === "CONTRACTOR"
            ? "bg-white text-[var(--vt-color-text-default,#261A66)] shadow-[0_1px_4px_rgba(38,26,102,0.08)] border border-[var(--vt-color-border-default,#E2E0EC)]"
            : "text-[var(--vt-color-text-muted,#7C7894)] hover:text-[var(--vt-color-text-default,#261A66)]"
        }`}
      >
        Contractor
      </button>
    </div>
  );
}
