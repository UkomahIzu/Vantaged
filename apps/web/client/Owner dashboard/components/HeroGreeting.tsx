"use client";

import React from "react";

export function HeroGreeting() {
  return (
    <div className="flex flex-col justify-center select-none py-1 font-sans">
      {/* Top greeting with user status indicator */}
      <div className="flex items-center gap-2 mb-1.5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
          Hi, James!
        </h1>
        {/* User status avatar pill token: rounded-full, indigo-100 & green-500 */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-indigo-100,#EAE8F9)] text-[var(--vt-color-indigo-800,#342982)] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
          <span>Active</span>
        </div>
      </div>

      {/* Main question headline matching reference */}
      <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight mb-2.5">
        What are your <span className="text-[var(--vt-color-orange-500,#EF5F18)]">plans</span> for today?
      </h2>

      {/* Subtitle with design token neutral */}
      <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm sm:max-w-md leading-relaxed font-normal">
        This platform is designed to revolutionize the way you organize and access your notes, verified milestones, and live site telemetry.
      </p>
    </div>
  );
}

