import React from "react";

export function ProblemSection() {
  const problems = [
    {
      number: "01",
      title: "Unverified Progress & Stalled Builds",
      description:
        "Clients depend on occasional photos and the contractor's word. Projects get abandoned after funds are disbursed, leaving diaspora owners with half-finished structures stuck at lintel level.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "WhatsApp is Not a System of Record",
      description:
        "Site updates, variation approvals, and receipts live in casual chat threads. Messages get deleted, phones get lost, and staff leave taking the build history with them. Nothing is structured or verifiable.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="13" y2="13" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Money Disconnected From Proof",
      description:
        "Large sums are transferred on trust without verified proof of materials or stage completion. There is no shared record of what was paid, against which milestone, and whether funds were properly allocated.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="6" y1="16" x2="10" y2="16" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Good Builders Can't Prove Quality",
      description:
        "Honest, registered construction firms have no verifiable digital portfolio or tamper-proof track record to win high-value remote and diaspora clients, while fly-by-night operators make unchecked claims.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative bg-[var(--vt-color-neutral-50,#F7F7FA)] py-20 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              The Reality of Remote Construction
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight">
            Building from afar shouldn&apos;t rely on blind faith.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            Every year, billions in capital are lost to unverified progress claims, abandoned foundations, and unverified chat messages. Vantaged establishes an accountable standard where work is only counted when verified.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((prob) => (
            <div
              key={prob.number}
              className="bg-white p-7 sm:p-8 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-xs flex flex-col justify-between transition-all hover:border-[var(--vt-color-orange-300,#FBA674)]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center">
                    {prob.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    {prob.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2.5">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  {prob.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

