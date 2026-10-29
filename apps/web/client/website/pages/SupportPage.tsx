"use client";

import React, { useState } from "react";
import { Navbar } from "../sections/Navbar";
import { FooterSection } from "../sections/FooterSection";

export function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "owner",
    location: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 sm:py-8 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
        <Navbar activeLinkId="nav-support" />
      </div>

      <main className="flex-1">
        {/* ── Page Header / Hero ── */}
        <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                Direct Assistance
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.08] mb-6">
              HOW CAN WE HELP YOU BUILD?
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed">
              Whether you are managing a residential build from abroad or onboarding your construction team, our support desk is ready to assist.
            </p>
          </div>
        </section>

        {/* ── 3 Support Channels ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Channel 1 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Client Success Desk
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                  Direct support for project setup, milestone invitations, bank escrow funding, and user onboarding across timezones.
                </p>
                <span className="font-mono text-xs font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">
                  support@vantaged.com
                </span>
              </div>

              {/* Channel 2 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Technical &amp; Site Advisory
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                  Assistance with stage structuring, bill of quantities (BoQ) alignment, and accredited structural engineer and site inspector dispatch.
                </p>
                <span className="font-mono text-xs font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">
                  advisory@vantaged.com
                </span>
              </div>

              {/* Channel 3 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Dispute &amp; Escrow Mediation
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                  Impartial technical review and evidence inspection for contested milestones before escrow disbursement.
                </p>
                <span className="font-mono text-xs font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">
                  resolution@vantaged.com
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact & Consultation Form ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Send a Message
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Connect with Our Team
              </h2>
            </div>

            {submitted ? (
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-100,#E6F7EC)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-green-700,#1F6B3E)] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Thank You for Reaching Out
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed max-w-md mx-auto">
                  Our client advisory team has received your inquiry and will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Emeka Okafor"
                      className="w-full h-11 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-xs text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. emeka@example.com"
                      className="w-full h-11 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-xs text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                      I Am A...
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-xs text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    >
                      <option value="owner">Property Owner / Diaspora</option>
                      <option value="contractor">General Contractor / Builder</option>
                      <option value="inspector">Structural Engineer / Inspector</option>
                      <option value="enterprise">Corporate Developer / REIT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                      Project Location / City
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. London, UK / Austin, TX / Global"
                      className="w-full h-11 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-xs text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                    How Can We Assist You?
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your upcoming or active construction project..."
                    className="w-full p-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-xs text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Inquiry</span>
                  <span>&rarr;</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── Operational Presence ── */}
        <section className="py-16 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                Global Operations Hub
              </span>
              <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                Americas &amp; EMEA Coverage
              </h4>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                Engineering Operations &amp; Inspector Dispatch Hub
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                Regional Engineering Center
              </span>
              <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                Metropolitan Projects Desk
              </h4>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                Institutional &amp; Commercial Real Estate Advisory
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                Cross-Border Client Desk
              </span>
              <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                Global Timezones (24/7)
              </h4>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                Dedicated Remote Project Coordinators
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <FooterSection />
    </div>
  );
}

