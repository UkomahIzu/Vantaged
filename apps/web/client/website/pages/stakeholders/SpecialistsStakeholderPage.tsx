"use client";

import React from "react";
import { Navbar } from "../../sections/Navbar";
import { FooterSection } from "../../sections/FooterSection";

export function SpecialistsStakeholderPage() {
  const services = [
    {
      num: "01",
      title: "Standardized Digital Inspection Protocols",
      desc: "Structured stage checklists from soil geotechnical prep and footing excavation through to concrete core curing and MEP commissioning.",
    },
    {
      num: "02",
      title: "Material Test & Lab Slump Verifications",
      desc: "Upload and verify certified laboratory test results, concrete cylinder crush reports, and steel rebar tensile specifications directly against project tolerances.",
    },
    {
      num: "03",
      title: "Digital Snagging & Remedial Tracking",
      desc: "Identify physical site non-conformances, issue formal rectification notices, and track contractor remediation steps before granting milestone sign-off.",
    },
    {
      num: "04",
      title: "Professional Liability Documentation",
      desc: "Every inspection observation, photo timestamp, and sign-off is permanently cryptographically locked, creating an audit-proof defense of your professional integrity.",
    },
    {
      num: "05",
      title: "Accredited Inspector Dispatch Network",
      desc: "Accredited structural engineers, architects, and technical site representatives receive direct inspection assignments on active residential and commercial projects.",
    },
    {
      num: "06",
      title: "Design-to-Field Compliance Alignment",
      desc: "Ensure that actual site construction adheres strictly to structural blueprints, MEP load calculations, and municipal building codes.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 sm:py-8 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
        <Navbar activeLinkId="nav-stakeholders" />
      </div>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                For Engineers, Architects &amp; Inspectors
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.08] mb-6">
              INDEPENDENT GOVERNANCE AND TECHNICAL EXCELLENCE
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed">
              Empowering certified structural engineers, architects, and technical inspectors with standardized digital audit tools, liability protection, and structured stage verification.
            </p>
          </div>
        </section>

        {/* ── Overview & Visual Section ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                The Inspector Standard
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                Maintain Structural Integrity with Tamper-Proof Audit Trails
              </h2>
              <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                Prevent catastrophic structural defects before concrete cures or framing is sealed. Vantaged gives consultants the standardized framework required to enforce strict building standards.
              </p>
              <div className="space-y-3 mb-8 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Objective stage verification based on pre-agreed technical criteria.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Cryptographic log protects professional indemnity against contractor error.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Direct engagement through the Vantaged accredited inspector network.</span>
                </div>
              </div>
              <div>
                <a
                  href="/support"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Apply to Inspector Network</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-lg aspect-[4/3] relative">
                <img
                  src="/images/engineer-tablet.jpg"
                  alt="Site representative verifying milestone on tablet"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 Core Services for Specialists ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Technical Governance
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Services Vantaged Provides for Specialists &amp; Inspectors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s) => (
                <div
                  key={s.num}
                  className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-mono font-bold text-sm mb-6">
                      {s.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Call To Action ── */}
        <section className="py-20 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4">
              Bring Independent Verification to Global Construction
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
              Are you an accredited structural engineer or certified quality inspector? Connect with our technical network.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="/support"
                className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Contact Inspector Desk</span>
                <span>&rarr;</span>
              </a>
              <a
                href="/the-advantage"
                className="h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore The Vantaged Protocol</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <FooterSection />
    </div>
  );
}

