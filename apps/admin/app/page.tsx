"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  IconVerification,
  IconContractors,
  IconUsers,
  IconDisputes,
  IconSubscriptions,
  IconPresets,
  IconAudit,
  IconExternalLink,
} from "../components/AdminIcons";

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      {/* ── Top Hero Greeting (matching Owner Dashboard HeroGreeting) ── */}
      <section className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-6 sm:p-7 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-col justify-center select-none py-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              OPERATIONS CONSOLE
            </span>
            <span className="text-xs font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)]">
              {user?.securityLevel}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
            Hi, {user?.name?.split(" ")[0] || "Administrator"}!
          </h1>

          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mt-1">
            What are your <span className="text-[var(--vt-color-orange-500,#EF5F18)]">operations</span> priorities today?
          </h2>

          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-xl leading-relaxed font-normal mt-1.5">
            Review contractor submissions, inspect live CAC & banking automated checks, and manage platform quotas with full regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/contractors"
            className="h-10 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs"
          >
            <span>Contractors</span>
          </Link>

          <Link
            href="/verifications"
            className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-2"
          >
            <span>Review Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25 font-bold">2</span>
          </Link>
        </div>
      </section>

      {/* ── 4 Top Summary Stat Cards (matching OwnerStatsSummaryCards) ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {/* Card 1: Verification Queue */}
        <Link
          href="/verifications"
          className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
              <IconVerification className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] flex items-center gap-1 group-hover:underline">
              <span>Review now</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] tracking-tight mb-1">
              02
            </div>
            <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
              Pending verifications
            </h3>
          </div>
        </Link>

        {/* Card 2: Active Contractors */}
        <Link
          href="/contractors"
          className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-green-400,#52B874)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(46,158,87,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center shrink-0">
              <IconContractors className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-green-700,#1F6B3E)] flex items-center gap-1 transition-colors">
              <span>Directory</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1">
              14
            </div>
            <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
              Verified contractors
            </h3>
          </div>
        </Link>

        {/* Card 3: Platform Projects */}
        <Link
          href="/projects"
          className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center shrink-0">
              <IconUsers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1 transition-colors">
              <span>Active sites</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1">
              38
            </div>
            <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
              Ongoing builds
            </h3>
          </div>
        </Link>

        {/* Card 4: Escrow & Risk Radar */}
        <Link
          href="/disputes"
          className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-green-400,#52B874)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(46,158,87,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center shrink-0">
              <IconDisputes className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>Normal</span>
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1">
              00
            </div>
            <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
              Escrow holds & disputes
            </h3>
          </div>
        </Link>
      </section>

      {/* ── Regulatory & Verification Pipelines Status Card ── */}
      <section className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Regulatory Verification Integrations
            </h2>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Live automated connectivity to Nigerian corporate, tax, and banking registries
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
            <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] animate-pulse" />
            All Pipelines Nominal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">CAC Corporate</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
              Automated RC-number status check & directors lookup
            </p>
            <div className="mt-2 text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">Latency: 142ms · 99.9%</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">NUBAN Name Match</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
              Direct bank account verification vs corporate name
            </p>
            <div className="mt-2 text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">Latency: 88ms · 99.8%</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">FIRS TIN Registry</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
              Tax Identification Number & withholding validation
            </p>
            <div className="mt-2 text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">Latency: 210ms · 99.5%</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">NIN / Director ID</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
              Managing director biometric & identity verification
            </p>
            <div className="mt-2 text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">Latency: 195ms · 99.7%</div>
          </div>
        </div>
      </section>

      {/* ── Operational Modules Grid (matching Owner QuickActionCards) ── */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
          Platform Operations Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Module 1: Verification Queue */}
          <Link
            href="/verifications"
            className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <IconVerification className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
                  2 Pending
                </span>
              </div>
              <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                Contractor Verification Queue
              </h3>
              <p className="mt-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Review corporate packets, automated CAC/TIN flags, approve firms, assign COREN/CORBON badges, and issue login credentials.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
              <span>Review Submissions</span>
              <span>→</span>
            </div>
          </Link>

          {/* Module 2: Contractor Directory */}
          <Link
            href="/contractors"
            className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center shrink-0">
                  <IconContractors className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  14 Active
                </span>
              </div>
              <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                Contractor Directory & Tiers
              </h3>
              <p className="mt-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Manage licensed building companies, inspect active project slot limits (Starter free-slot, Verified, Prime), and manage credentials.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)]">
              <span>View Directory</span>
              <span>→</span>
            </div>
          </Link>

          {/* Module 3: Stage Preset Library */}
          <Link
            href="/presets"
            className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center shrink-0">
                  <IconPresets className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  5 Presets
                </span>
              </div>
              <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                Stage Preset Library
              </h3>
              <p className="mt-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Standard Nigerian building milestones: 4-Bedroom Duplex, Commercial Multi-Storey, Warehouses, and MEP packages.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)]">
              <span>Inspect Presets</span>
              <span>→</span>
            </div>
          </Link>

          {/* Module 4: Disputes & Risk Radar */}
          <Link
            href="/disputes"
            className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center shrink-0">
                  <IconDisputes className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                  0 Holds
                </span>
              </div>
              <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                Disputes & Risk Radar
              </h3>
              <p className="mt-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Monitors unconfirmed bank transfers ("Paid - Not Confirmed"), repeated milestone rejections, and sudden contractor bank detail edits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)]">
              <span>Inspect Risk Radar</span>
              <span>→</span>
            </div>
          </Link>

          {/* Module 5: Platform Audit Trail */}
          <Link
            href="/audit"
            className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center shrink-0">
                  <IconAudit className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  Immutable
                </span>
              </div>
              <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                Platform Audit Trail
              </h3>
              <p className="mt-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Cryptographically timestamped record of every approval, credential issuance, dispute ruling, and administrative action.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)]">
              <span>View Audit Trail</span>
              <span>→</span>
            </div>
          </Link>

          {/* Module 6: Subscriptions & Quotas */}
          <Link
            href="/subscriptions"
            className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <IconSubscriptions className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  Tiers
                </span>
              </div>
              <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                Subscriptions & Billing Quotas
              </h3>
              <p className="mt-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Track contractor tier enrollment, free-project slot usage, and active build quotas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)]">
              <span>Configure Quotas</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
