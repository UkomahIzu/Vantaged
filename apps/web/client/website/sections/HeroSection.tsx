"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { openCompanySignupModal } from "../components/CompanySignupModal";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col justify-between bg-white dark:bg-[var(--vt-color-background-default,#110C30)] select-none px-6 sm:px-10 lg:px-14 py-6 sm:py-8 lg:py-10 transition-colors duration-200 overflow-hidden">
      {/* ── Authentic Technical Architectural Drawing Lines (Faint Blueprint Cad Style) ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full z-0 opacity-[0.16] dark:opacity-[0.07] text-[#7C7894] dark:text-[#A3A0B8]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="technical-drawing-grid"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Major Architectural Datum Lines */}
            <line x1="0" y1="0" x2="160" y2="0" stroke="currentColor" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="0" y2="160" stroke="currentColor" strokeWidth="0.8" />

            {/* ISO Technical Centerline / Projection Guidelines (Long-Short-Long) */}
            <line
              x1="0"
              y1="80"
              x2="160"
              y2="80"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="16 5 3 5"
            />
            <line
              x1="80"
              y1="0"
              x2="80"
              y2="160"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="16 5 3 5"
            />

            {/* Precision CAD Crosshair at Primary Intersection (0,0) */}
            <path
              d="M -7 0 L 7 0 M 0 -7 L 0 7"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            {/* Precision CAD Crosshair at Midpoint (80,80) */}
            <path
              d="M 74 80 L 86 80 M 80 74 L 80 86"
              stroke="currentColor"
              strokeWidth="0.9"
            />

            {/* Architectural 45° Dimension Slashing Ticks */}
            <line x1="-3" y1="3" x2="3" y2="-3" stroke="currentColor" strokeWidth="1.2" />
            <line x1="77" y1="83" x2="83" y2="77" stroke="currentColor" strokeWidth="1" />

            {/* Precision Measurement Sub-Ticks along edges (every 40px) */}
            <line x1="40" y1="-2.5" x2="40" y2="2.5" stroke="currentColor" strokeWidth="0.7" />
            <line x1="120" y1="-2.5" x2="120" y2="2.5" stroke="currentColor" strokeWidth="0.7" />
            <line x1="-2.5" y1="40" x2="2.5" y2="40" stroke="currentColor" strokeWidth="0.7" />
            <line x1="-2.5" y1="120" x2="2.5" y2="120" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* Technical Drawing Pattern Fill */}
        <rect width="100%" height="100%" fill="url(#technical-drawing-grid)" />

        {/* Perimeter Framing Guideline with Corner Datum Reference */}
        <line x1="28" y1="28" x2="28" y2="100%" stroke="currentColor" strokeWidth="0.7" strokeDasharray="6 6" />
        <line x1="28" y1="28" x2="100%" y2="28" stroke="currentColor" strokeWidth="0.7" strokeDasharray="6 6" />
        <circle cx="28" cy="28" r="3" fill="none" stroke="currentColor" strokeWidth="0.9" />
      </svg>

      {/* ── Top Header Navigation Bar ── */}
      <Navbar activeLinkId="nav-home" />

      {/* ── Left Edge Slider / Dots (Orange Active Indicator) ── */}
      <div className="pointer-events-none absolute left-6 sm:left-10 lg:left-14 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-3 ring-[var(--vt-color-orange-100,#FFE6D5)] dark:ring-[var(--vt-color-orange-950,#3A1A0E)]" />
        <span className="h-1 w-1 rounded-full bg-[var(--vt-color-neutral-300,#CBC8DA)] dark:bg-[var(--vt-color-neutral-700,#3D3478)]" />
      </div>

      {/* ── Main Content Area ── */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Kicker, Headline, Value Prop & CTAs */}
        <div className="max-w-2xl flex flex-col justify-center">
          {/* Kicker (Brand Orange) */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              Tracking like you never left
            </span>
          </div>

          {/* Refined Headline (Preserved exactly as approved) */}
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-[54px] xl:text-[62px] tracking-[-0.03em] leading-[1.02] uppercase mb-6">
            <span className="text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
              MONITOR EVERY STAGE,
            </span>
            <br />
            <span className="text-[var(--vt-color-orange-500,#EF5F18)] drop-shadow-[0_2px_14px_rgba(239,95,24,0.16)]">
              PROVE THE BUILD.
            </span>
          </h1>

          {/* Value proposition based directly on the PRD (High-level, anti-scalping) */}
          <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed max-w-xl mb-8">
            The trust-first construction management and verification platform for property owners, diaspora investors, and registered builders. Milestone approvals, transparent progress, and guaranteed escrow peace of mind.
          </p>

          {/* Action Buttons (10px rounded-md tokens, NO badges, NO explore live demo) */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <a
              id="hero-owner-cta"
              href="/signup/owner"
              className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.25)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.35)] flex items-center gap-2 cursor-pointer"
            >
              <span>Start as an Owner</span>
              <span>&rarr;</span>
            </a>
            <button
              id="hero-contractor-cta"
              type="button"
              onClick={() => openCompanySignupModal()}
              className="h-11 px-6 rounded-md bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:hover:bg-[var(--vt-color-surface-hover,#2D2468)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <span>Register Company</span>
            </button>
          </div>
        </div>

        {/* ── Right Column: High-level Trust Summary (Outcome-focused, Procore style) ── */}
        <div className="w-full lg:w-96 flex flex-col gap-3.5">
          <div className="rounded-xl p-5 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                  Milestone Verification
                </h4>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                  Proof-backed stage approvals
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
              Every milestone is inspected and confirmed before completion is signed off. No phantom progress.
            </p>
          </div>

          <div className="rounded-xl p-5 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                  Secured Milestone Escrow
                </h4>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                  Safe capital release mechanism
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
              Funds are protected until verified. Contractors know funds exist; owners pay strictly for verified quality.
            </p>
          </div>

          <div className="rounded-xl p-5 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                  Unified Project Ledger
                </h4>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                  Permanent verifiable record
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
              Every inspection sign-off, invoice, and milestone timestamp is locked on record for complete transparency.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Section Divider ── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-between py-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)] uppercase">
        <span>Licensed &amp; Vetted Builders</span>
        <span className="hidden sm:inline">Milestone-Gated Escrow</span>
        <span>Verified Site Records</span>
      </div>
    </section>
  );
}
