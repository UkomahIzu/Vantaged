"use client";

import React from "react";

export interface ProjectItem {
  id: string;
  jobId: string;
  title: string;
  category: "Residential" | "Commercial" | "Waterfront" | "Hospitality";
  location: string;
  specs: string;
  status: "In progress" | "Inspection pending" | "Final sign-off" | "Substructure" | "Completed";
  milestonesCount: number;
  milestonesTotal: number;
  progressPercent: number;
  escrowAmount: string;
  storageProofs?: string;
  contractor: {
    name: string;
    rating: string;
    assignedRep: string;
  };
  currentScope: string;
  stageSubtitle: string;
  snippetLines: string[];
  lastUpdated: string;
}

interface ProjectFolderCardProps {
  project: ProjectItem;
  variant?: "orange" | "white";
  isSelected?: boolean;
  onSelect?: (project: ProjectItem) => void;
}

export function ProjectFolderCard({
  project,
  variant = "white",
  isSelected = false,
  onSelect,
}: ProjectFolderCardProps) {
  const isOrange = variant === "orange";

  return (
    <div
      onClick={() => onSelect?.(project)}
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className={`group relative w-full h-[265px] sm:h-[280px] cursor-pointer select-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.96] focus:outline-none ${
        isSelected
          ? "-translate-y-3.5 sm:-translate-y-4 z-30"
          : "hover:-translate-y-1.5 z-10"
      }`}
    >
      {/* ── 1. Back Folder Flap (Asymmetrical Tab on Top-Left) ── */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        {/* Top Tab on Left (curves smoothly into right back edge) */}
        <div className="flex items-end">
          <div
            className={`w-[45%] h-7 rounded-t-2xl transition-colors duration-200 border-t border-l border-r ${
              isOrange
                ? isSelected
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] border-white/60"
                  : "bg-[var(--vt-color-orange-500,#EF5F18)] border-[var(--vt-color-orange-600,#D84C0B)]"
                : isSelected
                  ? "bg-[var(--vt-color-neutral-100,#E4E2EE)] border-[var(--vt-color-orange-300,#FBA674)]"
                  : "bg-[var(--vt-color-neutral-100,#EAE8F2)] group-hover:bg-[var(--vt-color-neutral-200,#E2E0EE)] border-[var(--vt-color-border-subtle,#DBD7E7)]"
            }`}
          />
          {/* Subtle bridge transition to back plate */}
          <div
            className={`w-4 h-3.5 -mb-[1px] border-b ${
              isOrange
                ? isSelected
                  ? "border-white/60"
                  : "border-[var(--vt-color-orange-600,#D84C0B)]"
                : isSelected
                  ? "border-[var(--vt-color-orange-300,#FBA674)]"
                  : "border-[var(--vt-color-border-subtle,#DBD7E7)]"
            }`}
          />
        </div>

        {/* Main Back Plate Body */}
        <div
          className={`flex-1 rounded-2xl rounded-tl-none transition-all duration-200 border shadow-2xs ${
            isOrange
              ? isSelected
                ? "bg-[var(--vt-color-orange-500,#EF5F18)] border-white/40"
                : "bg-[var(--vt-color-orange-500,#EF5F18)] border-[var(--vt-color-orange-600,#D84C0B)]"
              : isSelected
                ? "bg-[var(--vt-color-background-subtle,#F0EEF7)] border-[var(--vt-color-orange-200,#FDCAA9)]"
                : "bg-[var(--vt-color-neutral-50,#F5F4FA)] group-hover:bg-[var(--vt-color-background-subtle,#F0EEF7)] border-[var(--vt-color-border-default,#DFDCEB)]"
          }`}
        />
      </div>

      {/* ── 2. Inserted White Paper Sheet (Springs up on click & hover) ── */}
      <div
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className={`absolute left-3.5 right-3.5 top-2 h-38 bg-white rounded-2xl border p-3.5 sm:p-4 z-10 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col justify-between overflow-hidden pointer-events-none ${
          isSelected
            ? "-translate-y-8 sm:-translate-y-9 shadow-[0_16px_36px_rgba(38,26,102,0.14)] border-[var(--vt-color-orange-400,#F78241)] ring-1 ring-[var(--vt-color-orange-300,#FBA674)]"
            : "shadow-[0_4px_16px_rgba(38,26,102,0.06)] border-[var(--vt-color-border-default,#E4E2EE)] group-hover:-translate-y-3.5"
        }`}
      >
        {/* Top: Snippet line 1 + Selected/Active pill badge */}
        <div className="flex items-center justify-between gap-1.5">
          <p
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate pr-1"
          >
            {project.snippetLines[0] || ""}
          </p>
          {isSelected ? (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[9px] font-bold shadow-2xs animate-in fade-in zoom-in-90 duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Selected
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)]">
              {project.category}
            </span>
          )}
        </div>

        {/* Middle: Snippet lines 2 and 3 */}
        <div className="flex-1 flex flex-col justify-center py-1">
          <p
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="text-[#6C6882] text-[11px] truncate font-medium"
          >
            {project.snippetLines[1] || ""}
          </p>
          <p
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="text-[#8E8B9E] text-[10.5px] truncate mt-0.5"
          >
            {project.snippetLines[2] || ""}
          </p>
        </div>

        {/* Bottom of paper (revealed when popped up): Progress bar */}
        <div className={`transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
          <div className="flex items-center justify-between text-[9px] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1">
            <span>Progress: {project.progressPercent}%</span>
            <span>{project.milestonesCount}/{project.milestonesTotal} Milestones</span>
          </div>
          <div className="w-full h-1 bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Front Folder Pocket (Matching Reference Asymmetrical Shelf Contour) ── */}
      <div className="absolute left-0 right-0 bottom-0 h-[66%] z-20 flex flex-col">
        {/* SVG Contour for Front Flap */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className={`w-full h-full transition-all duration-300 ${
              isSelected
                ? isOrange
                  ? "drop-shadow-[0_16px_36px_rgba(239,95,24,0.35)]"
                  : "drop-shadow-[0_16px_36px_rgba(38,26,102,0.16)]"
                : "drop-shadow-[0_8px_24px_rgba(38,26,102,0.07)]"
            }`}
            viewBox="0 0 320 180"
            fill="none"
            preserveAspectRatio="none"
          >
            {isOrange ? (
              <>
                <defs>
                  <linearGradient id={`grad-orange-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF5F18" />
                    <stop offset="100%" stopColor="#D84C0B" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,36 C 40,36, 60,30, 95,16 C 125,4, 145,0, 180,0 L 304,0 Q 320,0, 320,16 L 320,164 Q 320,180, 304,180 L 16,180 Q 0,180, 0,164 Z"
                  fill={`url(#grad-orange-${project.id})`}
                  stroke={isSelected ? "#FFFFFF" : "#C74307"}
                  strokeWidth={isSelected ? "1.8" : "1.2"}
                />
              </>
            ) : (
              <path
                d="M 0,36 C 40,36, 60,30, 95,16 C 125,4, 145,0, 180,0 L 304,0 Q 320,0, 320,16 L 320,164 Q 320,180, 304,180 L 16,180 Q 0,180, 0,164 Z"
                fill="var(--vt-color-surface-raised, #FFFFFF)"
                stroke={isSelected ? "var(--vt-color-orange-500,#EF5F18)" : "var(--vt-color-border-default,#E2E0EC)"}
                strokeWidth={isSelected ? "1.8" : "1.2"}
                className="group-hover:stroke-[var(--vt-color-orange-300,#FBA674)] transition-colors"
              />
            )}
          </svg>
        </div>

        {/* Front Flap Content: Uncluttered, bold Title, construction stage subtitle, and value at bottom */}
        <div
          style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
          className={`relative z-10 flex-1 p-5 sm:p-5.5 flex flex-col justify-between transition-all duration-300 ${
            isOrange ? "text-white" : "text-[var(--vt-color-indigo-900,#261A66)]"
          }`}
        >
          {/* Middle: Title & Project Stage Subtitle (brought down cleanly into comfortable center) */}
          <div className="pt-5 sm:pt-6">
            <h3
              style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
              className={`text-base sm:text-[17px] font-extrabold tracking-tight leading-snug truncate transition-colors ${
                isOrange
                  ? "text-white"
                  : "text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)]"
              }`}
            >
              {project.title}
            </h3>

            {/* Construction stage subtitle (e.g. Stage 3: First floor suspended slab) */}
            <p
              style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
              className={`text-xs mt-1 font-medium leading-none ${
                isOrange ? "text-white/80" : "text-[var(--vt-color-neutral-500,#7C7894)]"
              }`}
            >
              {project.stageSubtitle}
            </p>
          </div>

          {/* Bottom Left: Value (without any GB numbers) */}
          <div className="pb-1">
            <span
              style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
              className={`text-xs font-semibold tracking-tight ${
                isOrange
                  ? "text-white/90 font-mono"
                  : "text-[var(--vt-color-neutral-400,#9490A8)] font-mono"
              }`}
            >
              {project.escrowAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
