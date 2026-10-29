import React from "react";

export function StakeholdersSection() {
  return (
    <section id="stakeholders" className="relative bg-[var(--vt-color-neutral-50,#F7F7FA)] py-24 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">
        {/* Section Title */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              Two-Sided Platform
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight">
            Built for those who fund the build, and the professionals who execute it.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            Unlike legacy software that treats property owners as passive viewers, Vantaged balances real approval authority with powerful jobsite tooling.
          </p>
        </div>

        {/* Stakeholder 1: For Property Owners & Diaspora Clients */}
        <div id="stakeholders-owners" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[var(--vt-color-orange-500,#EF5F18)] uppercase tracking-wider block mb-2 font-mono">
                FOR CLIENTS &amp; PROPERTY OWNERS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
                Complete remote control from anywhere in the world.
              </h3>
            </div>
            <p className="text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              Whether you are funding a residential build from London, Houston, or Abuja, Vantaged ensures your money is protected and progress is authenticated.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Real-Time Spending &amp; Budget Tracker
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Track every dollar or naira spent against your Bill of Quantities with live escrow balance and burn-down reports.
                </p>
              </div>
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  True Progress Calculation
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Completion percentage only advances when you sign off on verified proof, not on contractor estimates.
                </p>
              </div>
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Client Representative Access
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Delegate trusted local family proxies or clerks-of-work with customized inspection and payment permissions.
                </p>
              </div>
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Audit-Ready Statements &amp; Live Links
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Export certified PDF payment summaries and generate secure read-only live viewing links for lenders or family.
                </p>
              </div>
            </div>
            <div>
              <a
                href="/signup/owner"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Register as an Owner</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] shadow-lg aspect-[4/3]">
              <img
                src="/images/engineer-tablet.jpg"
                alt="Civil engineer performing digital inspection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--vt-color-neutral-950,#12101F)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)] mb-1">
                  Digital Inspection Telemetry
                </p>
                <p className="text-sm font-bold">
                  On-site inspections verified with location coordinates and time markers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder 2: For Construction Companies & Contractors */}
        <div id="stakeholders-contractors" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] shadow-lg aspect-[4/3]">
              <img
                src="/images/site-inspection.jpg"
                alt="Site director and engineer reviewing building progress"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--vt-color-neutral-950,#12101F)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)] mb-1">
                  Registered Builder Network
                </p>
                <p className="text-sm font-bold">
                  Verified contractors win client trust with transparent digital records
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[var(--vt-color-orange-500,#EF5F18)] uppercase tracking-wider block mb-2 font-mono">
                FOR BUILDERS &amp; CONTRACTORS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
                The modern operating system for verified construction firms.
              </h3>
            </div>
            <p className="text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              Eliminate payment disputes, manage site crews, and prove your track record to clients with an institutional standard of work.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Prompt Milestone Payments
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Approved stages trigger formal payment deadlines with clear confirmation windows.
                </p>
              </div>
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Offline Field Capture
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Site crews can photograph tasks in remote areas with zero network signal; proofs sync automatically.
                </p>
              </div>
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Stage Presets &amp; Templates
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Bungalows, duplexes, multi-story commercial buildings, and civil road works built with local presets.
                </p>
              </div>
              <div className="p-4.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)]">
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Verified Builder Portfolio
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-normal">
                  Every completed project builds your permanent public profile to win lucrative diaspora briefs.
                </p>
              </div>
            </div>
            <div>
              <a
                href="/signup/contractor"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#170F42)] text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Register as a Contractor</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

