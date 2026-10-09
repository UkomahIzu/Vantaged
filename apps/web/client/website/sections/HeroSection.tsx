import React from "react";
import { Navbar } from "./Navbar";

export function HeroSection() {
  return (
    <section className="relative h-screen w-screen max-h-screen max-w-full overflow-hidden flex flex-col justify-between bg-white select-none px-6 sm:px-10 lg:px-14 py-6 sm:py-8 lg:py-10">
      {/* ── Subtle Technical Drafting Grid (Clean 60% White/Neutral surface) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #CBC8DA 1px, transparent 1px), linear-gradient(to bottom, #CBC8DA 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* ── Top Header Navigation Bar ── */}
      <Navbar />

      {/* ── Left Edge Slider / Dots (Orange 30% Active Indicator) ── */}
      <div className="pointer-events-none absolute left-6 sm:left-10 lg:left-14 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-3 ring-[var(--vt-color-orange-100,#FFE6D5)]" />
        <span className="h-1 w-1 rounded-full bg-[var(--vt-color-neutral-300,#CBC8DA)]" />
      </div>

      {/* ── Main Content Area (Refined, smaller headline) ── */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="max-w-2xl flex flex-col justify-center">
          {/* Kicker (30% Brand Orange) */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              Tracking like you never left
            </span>
          </div>

          {/* Refined Headline (Scaled down for editorial balance) */}
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-[54px] xl:text-[62px] tracking-[-0.03em] leading-[1.02] uppercase">
            <span className="text-[var(--vt-color-indigo-900,#261A66)]">
              MONITOR EVERY STAGE,
            </span>
            <br />
            <span className="text-[var(--vt-color-orange-500,#EF5F18)] drop-shadow-[0_2px_14px_rgba(239,95,24,0.16)]">
              PROVE THE BUILD.
            </span>
          </h1>
        </div>

        {/* ── Right Column (Subtle Glyph) ── */}
        <div className="pointer-events-none hidden lg:flex flex-col items-center pr-2">
          <span className="font-sans text-base text-[var(--vt-color-orange-500,#EF5F18)]">
            ⁘
          </span>
        </div>
      </div>

      {/* ── Bottom Spacer (maintains vertical balance) ── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto h-4 shrink-0" />
    </section>
  );
}
