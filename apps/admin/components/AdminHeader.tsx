"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { IconExternalLink } from "./AdminIcons";
import { ThemeToggle } from "./ThemeToggle";

interface AdminHeaderProps {
  leftSlot?: React.ReactNode;
}

export function AdminHeader({ leftSlot }: AdminHeaderProps = {}) {
  const { user } = useAdminAuth();
  const [lagosTime, setLagosTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLagosTime(
        now.toLocaleTimeString("en-GB", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WAT"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="w-full flex items-center justify-between gap-2.5 pt-1 pb-2 font-sans select-none"
    >
      {/* Left: Optional Left Slot or Subtle Clock */}
      <div className="shrink-0 flex items-center gap-2">
        {leftSlot ? (
          leftSlot
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-neutral-400,#A3A0B8)]" />
            <span>{lagosTime || "12:00:00 WAT"}</span>
          </div>
        )}
      </div>

      {/* Center: Global Search Bar matching Owner Dashboard */}
      <div className="relative flex-1 max-w-md min-w-0">
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
          placeholder="Search CAC RC-number, company, TIN, reference..."
          className="w-full h-9 pl-9 pr-8 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none transition-all shadow-2xs font-sans"
        />
      </div>

      {/* Right: Quick Port Links, Theme Toggle & Alerts */}
      <div className="flex items-center gap-2">
        {/* Shortcut to Port 3000 Contractor Login */}
        <a
          href="http://localhost:3000/contractor/login"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs font-sans"
          title="Open Contractor Login Terminal on Port 3000"
        >
          <span>Contractor Terminal</span>
          <IconExternalLink className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
        </a>

        {/* Shortcut to Port 3000 Public Web */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs font-sans"
          title="Open Public Client Portal on Port 3000"
        >
          <span>Public Portal</span>
          <IconExternalLink className="w-3.5 h-3.5 text-[var(--vt-color-neutral-500,#7C7894)]" />
        </a>

        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Notification Bell matching Owner Dashboard */}
        <button
          type="button"
          aria-label="Verification Notifications"
          className="w-9 h-9 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-center text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors cursor-pointer shadow-2xs relative"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-1.5 ring-white" />
        </button>
      </div>
    </header>
  );
}
