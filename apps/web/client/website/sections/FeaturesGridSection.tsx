import React from "react";

export function FeaturesGridSection() {
  const capabilities = [
    {
      title: "Tamper-Proof Geotagging",
      subtitle: "GPS Coordinates & Atomic Timestamps",
      description:
        "Every progress photo and inspection video captured through the mobile app embeds cryptographic metadata, confirming the exact physical coordinates and time on site.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      title: "Standard Structural Presets",
      subtitle: "Tailored to Milestone Workflows",
      description:
        "Built with predefined structural milestones: Substructure, Framing, Floor Slabs, Roofing, and MEP Finishings.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      title: "Dual-Key Change Orders",
      subtitle: "Zero Unilateral Scope Creep",
      description:
        "Variations in materials, cost adjustments, or timeline shifts require explicit digital signoff from both the client and contractor before the locked plan updates.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "Contextual Threaded Messaging",
      subtitle: "Project-Tied Communication",
      description:
        "WhatsApp-style chat and voice notes pinned directly to specific milestones and defect inspection tickets, preserving a permanent legal audit trail.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      title: "14-Day Dispute Arbitration Shield",
      subtitle: "Balanced Structural Accountability",
      description:
        "If a disagreement arises over milestone execution or payment receipts, both parties upload evidence into a structured resolution chamber before escalation.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Read-Only Public Share Links",
      subtitle: "Transparent Stakeholder Visibility",
      description:
        "Generate secure, read-only live progress links for family members, diaspora relatives, mortgage bankers, or co-investors without requiring an app account.",
      icon: (
        <svg className="w-6 h-6 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative bg-white py-24 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              Engineered for Integrity
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight">
            Features built specifically for real-world construction realities.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            From offline network resilience to automated bank freezes, every feature addresses the structural vulnerabilities of construction management.
          </p>
        </div>

        {/* 6 Capabilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((item) => (
            <div
              key={item.title}
              className="p-7 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all hover:border-[var(--vt-color-orange-300,#FBA674)] flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  {item.title}
                </h3>
                <p className="font-mono text-[11px] font-semibold text-[var(--vt-color-orange-600,#D84C0B)] uppercase tracking-wider mb-2.5">
                  {item.subtitle}
                </p>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

