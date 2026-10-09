"use client";

import React, { useState } from "react";

export interface InspectionWidgetProps {
  title: string;
  duration: string;
  gpsCoords: string;
  status: string;
  description: string;
}

export function InspectionWidget({
  title,
  duration,
  gpsCoords,
  status,
  description,
}: InspectionWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <div
        onClick={() => setIsPlaying(!isPlaying)}
        className="group relative flex items-center gap-3.5 rounded-2xl bg-[var(--vt-color-neutral-900,#1E1B30)]/95 p-2.5 pr-4 text-white shadow-[0_12px_28px_-6px_rgba(38,26,102,0.25)] border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--vt-color-neutral-950,#12101F)]"
      >
        {/* Thumbnail with Play Icon */}
        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#261A66] via-[#1E1B30] to-[#EF5F18]/80 border border-white/15 flex items-center justify-center shadow-inner">
          {/* Subtle architectural schematic grid inside thumbnail */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />

          {/* Pulsing Play Button */}
          <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[var(--vt-color-primary-default,#B33C08)] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-200 group-hover:scale-110">
            {isPlaying ? (
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="h-3 w-3 translate-x-0.5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Time Badge */}
          <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.2 text-[9px] font-sans font-medium text-white/90">
            {duration}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E57] animate-pulse" />
            <span className="text-[10px] font-sans tracking-widest text-[#FBA674] uppercase truncate">
              {title}
            </span>
          </div>
          <span className="text-xs font-semibold text-white/95 tracking-tight truncate">
            {status}
          </span>
          <span className="text-[10px] font-sans text-white/60 tracking-wider">
            {gpsCoords}
          </span>
        </div>
      </div>

      {/* Micro-copy directly below matching reference */}
      <p className="text-[11px] font-sans leading-relaxed text-[var(--vt-color-text-subtle,#7C7894)] max-w-xs pl-1">
        {description}
      </p>
    </div>
  );
}
