"use client";

import React from "react";

export function AppDownloadSection() {
  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-white dark:bg-[var(--vt-color-background-default,#110C30)] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ── Left Column: Short Text About the App ── */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                Mobile Field App
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
              Track Your Build in the Palm of Your Hand
            </h2>

            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
              Review live site evidence, verify engineer checklists, and release milestone funds with a single tap. Complete oversight wherever you are in the world.
            </p>

            <div className="space-y-3.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
              <div className="flex items-start gap-3">
                <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm mt-0.5">✓</span>
                <span><strong>Instant Stage Notifications:</strong> Get real-time alerts the moment a contractor submits milestone evidence.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm mt-0.5">✓</span>
                <span><strong>One-Tap Escrow Sign-Off:</strong> Approve stage completion securely using biometric authorization.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm mt-0.5">✓</span>
                <span><strong>Offline-First Field Capture:</strong> Contractors can document progress on remote sites with automatic cloud sync.</span>
              </div>
            </div>
          </div>

          {/* ── Center Column: iPhone 17 Phone Mockup (Showing First Welcome Page) ── */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center py-6">
            {/* Ambient Floating Wrapper (Continuous Float Animation) */}
            <div className="animate-phone-float relative flex flex-col items-center">
              {/* Interactive Phone Mockup with side hardware buttons & dynamic mouse hover reaction */}
              <div className="relative group transition-all duration-500 ease-out hover:scale-[1.035] hover:-translate-y-2 hover:rotate-[-0.8deg] cursor-pointer">
                {/* Left Side Buttons: Action Button & Volume */}
                <div className="absolute -left-[5px] top-[108px] w-[5px] h-[28px] bg-[#2E2A3E] rounded-l-[3px] border-l border-y border-white/20 shadow-xs" />
                <div className="absolute -left-[5px] top-[148px] w-[5px] h-[48px] bg-[#2E2A3E] rounded-l-[3px] border-l border-y border-white/20 shadow-xs" />
                <div className="absolute -left-[5px] top-[206px] w-[5px] h-[48px] bg-[#2E2A3E] rounded-l-[3px] border-l border-y border-white/20 shadow-xs" />

                {/* Right Side Buttons: Power & Camera Control */}
                <div className="absolute -right-[5px] top-[138px] w-[5px] h-[64px] bg-[#2E2A3E] rounded-r-[3px] border-r border-y border-white/20 shadow-xs" />
                <div className="absolute -right-[4px] top-[235px] w-[4px] h-[44px] bg-[#242032] rounded-r-[2px] border-r border-y border-white/10" />

                {/* iPhone 17 Titanium Chassis with dynamic shadow bloom on hover */}
                <div
                  className="relative w-[285px] sm:w-[305px] h-[615px] rounded-[52px] p-[5px] select-none shadow-[0_30px_70px_-15px_rgba(18,16,31,0.55),0_10px_25px_-5px_rgba(0,0,0,0.4)] group-hover:shadow-[0_45px_100px_-15px_rgba(239,95,24,0.32),0_25px_50px_-10px_rgba(18,16,31,0.7)] transition-shadow duration-500"
                  style={{
                    background:
                      "linear-gradient(145deg, #443F59 0%, #201C2E 22%, #38334C 45%, #181424 70%, #403B55 100%)",
                  }}
                >
                  {/* Micro-Bezel Antenna Accents */}
                  <span className="absolute left-[34px] -top-[1px] w-[2px] h-[6px] bg-[#1C1828]/80 rounded-full" />
                  <span className="absolute right-[34px] -top-[1px] w-[2px] h-[6px] bg-[#1C1828]/80 rounded-full" />
                  <span className="absolute left-[34px] -bottom-[1px] w-[2px] h-[6px] bg-[#1C1828]/80 rounded-full" />
                  <span className="absolute right-[34px] -bottom-[1px] w-[2px] h-[6px] bg-[#1C1828]/80 rounded-full" />

                  {/* Inner Bezel & OLED Glass Screen Display */}
                  <div className="relative w-full h-full rounded-[47px] bg-[#12101F] overflow-hidden flex flex-col justify-between border border-black/80">
                    {/* Subtle Diagonal Glass Screen Reflection Overlay */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-30 opacity-30 group-hover:opacity-45 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 50%, transparent 100%)",
                      }}
                    />

                    {/* iPhone 17 Dynamic Island with subtle hover expansion */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[98px] group-hover:w-[108px] h-[26px] bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-300">
                      {/* Front Camera Lens with subtle reflection */}
                      <div className="w-3 h-3 rounded-full bg-[#0A0A10] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#181830] inline-block shadow-inner" />
                      </div>
                      {/* FaceID / Sensor Dot */}
                      <span className="w-2 h-2 rounded-full bg-[#0E0E18] inline-block" />
                    </div>

                    {/* Status Bar */}
                    <div className="relative z-30 pt-3 px-6 flex items-center justify-between text-white text-[11px] font-semibold tracking-tight">
                      <span className="font-mono text-[11px]">9:41</span>
                      <div className="flex items-center gap-1.5">
                        {/* Signal bars */}
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="2" y="16" width="3" height="6" rx="1" />
                          <rect x="7" y="12" width="3" height="10" rx="1" />
                          <rect x="12" y="8" width="3" height="14" rx="1" />
                          <rect x="17" y="4" width="3" height="18" rx="1" />
                        </svg>
                        {/* 5G */}
                        <span className="text-[9px] font-mono font-bold tracking-tighter">5G</span>
                        {/* Battery Indicator with charge level */}
                        <div className="w-[18px] h-[9px] rounded-[3px] border border-white/90 p-[1px] flex items-center">
                          <div className="w-full h-full bg-white rounded-[1.5px]" />
                        </div>
                      </div>
                    </div>

                    {/* Screen Content: Background Image of Welcome Slide 1 */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src="/images/welcome-slide-1.jpg"
                        alt="Track your construction from anywhere"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Cinematic Gradient Scrim (Exact match to WelcomePage.tsx) */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.12) 25%, rgba(18, 16, 31, 0.6) 58%, rgba(18, 16, 31, 0.92) 82%, #12101F 100%)",
                        }}
                      />
                    </div>

                    {/* Top Bar: Skip Button (Top Right) */}
                    <div className="relative z-20 px-6 pt-2 flex justify-end">
                      <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-2xs">
                        Skip
                      </span>
                    </div>

                    {/* Welcome Page Slide Content: Headline */}
                    <div className="relative z-20 px-6 text-center mt-auto mb-6">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-[1.18] tracking-tight">
                        Track Your Construction<br />From Anywhere
                      </h3>
                    </div>

                    {/* Bottom Controls: 4 Pagination Dots + Next Button + Home Bar */}
                    <div className="relative z-20 px-6 pb-4 flex flex-col gap-3.5">
                      {/* 4 Pagination Indicator Dots (Dot 1 active orange pill) */}
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="w-6 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] shadow-[0_0_8px_rgba(239,95,24,0.6)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      </div>

                      {/* Primary Action Button: 'Next' (10px rounded corners matching owner tokens) */}
                      <div className="w-full h-11 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] group-hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold flex items-center justify-center shadow-[0_3px_12px_rgba(239,95,24,0.4)] group-hover:shadow-[0_4px_16px_rgba(239,95,24,0.6)] transition-all duration-200">
                        Next
                      </div>

                      {/* iOS Home Indicator Bar */}
                      <div className="w-32 h-1 bg-white/45 rounded-full mx-auto mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambient Floor Shadow (breathes in sync with floating elevation) */}
              <div className="w-[190px] sm:w-[210px] h-[18px] bg-black/25 dark:bg-black/60 rounded-[100%] blur-md mt-4 animate-phone-shadow pointer-events-none" />
            </div>
          </div>

          {/* ── Right Column: Two Download Buttons (Orange Store Buttons) ── */}
          <div className="lg:col-span-4 flex flex-col justify-center lg:pl-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
              Available Everywhere
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
              Download the Vantaged App
            </h3>

            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
              Available globally for iOS and Android devices. Seamlessly connects to your desktop workspace with real-time cloud synchronization.
            </p>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5">
              {/* Android Download Button (Google Play - Brand Orange) */}
              <a
                href="#download-android"
                className="group h-14 px-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center gap-4 shadow-[0_4px_16px_rgba(239,95,24,0.35)] hover:shadow-[0_6px_22px_rgba(239,95,24,0.5)] border border-[var(--vt-color-orange-400,#F17C42)]/50 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              >
                {/* Google Play Vector Icon */}
                <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M3.6 1.8L14.2 12.4L3.6 23C3.2 22.5 3 21.8 3 21V3C3 2.2 3.2 1.5 3.6 1.8Z" fill="#2196F3" />
                    <path d="M17.8 8.8L14.2 12.4L3.6 1.8C4 1.3 4.8 1.1 5.6 1.5L17.8 8.8Z" fill="#4CAF50" />
                    <path d="M17.8 15.9L5.6 23.2C4.8 23.6 4 23.4 3.6 23L14.2 12.4L17.8 15.9Z" fill="#F44336" />
                    <path d="M21.5 10.9L17.8 8.8L14.2 12.4L17.8 15.9L21.5 13.8C22.6 13.2 22.6 11.5 21.5 10.9Z" fill="#FFEB3B" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-wider text-white/85 font-bold leading-none mb-1">
                    GET IT ON
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white leading-none">
                    Google Play
                  </span>
                </div>
              </a>

              {/* iOS Download Button (App Store - Brand Orange) */}
              <a
                href="#download-ios"
                className="group h-14 px-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center gap-4 shadow-[0_4px_16px_rgba(239,95,24,0.35)] hover:shadow-[0_6px_22px_rgba(239,95,24,0.5)] border border-[var(--vt-color-orange-400,#F17C42)]/50 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              >
                {/* Apple Vector Icon */}
                <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5 fill-current text-[var(--vt-color-neutral-900,#1D1A33)]" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.94 1.07.08 2.15-.55 2.81-1.28z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-white/85 font-bold leading-none mb-1">
                    Download on the
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white leading-none">
                    App Store
                  </span>
                </div>
              </a>
            </div>

            <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-4 leading-relaxed">
              Requires iOS 15.0+ or Android 10.0+. Free for all project owners and builders worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
