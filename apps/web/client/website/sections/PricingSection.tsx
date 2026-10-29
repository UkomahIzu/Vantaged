import React from "react";

export function PricingSection() {
  const tiers = [
    {
      name: "Property Owners & Clients",
      price: "Free",
      period: "forever",
      description:
        "Everything individual property owners and diaspora clients need to fund and track their builds with complete verification.",
      features: [
        "Unlimited project creations",
        "Full milestone approval authority",
        "GPS and timestamped inspection photo/video reviews",
        "Designate Client Representatives with custom permissions",
        "Tamper-proof financial payment ledger",
        "Public read-only share links for family & banks",
        "Direct chat & voice notes tied to stages",
      ],
      ctaText: "Start as an Owner",
      ctaHref: "/signup/owner",
      primary: false,
    },
    {
      name: "Verified Construction Firms",
      price: "Free First Build",
      period: "then transparent subscription",
      description:
        "Full operating system for registered builders. First project is completely free for up to 12 months with unlimited crew.",
      features: [
        "Corporate & regulatory verified builder credential",
        "Unlimited crew members and field check-ins",
        "Offline site photo and video capture",
        "Predefined universal structural stage templates",
        "Dual-lock change request management",
        "Automated milestone completion notifications",
        "Permanent verified portfolio to win global client briefs",
      ],
      ctaText: "Register Company",
      ctaHref: "/signup/contractor",
      primary: true,
    },
    {
      name: "Institutional & Enterprise",
      price: "Custom",
      period: "per developer volume",
      description:
        "For multi-site real estate developers, diaspora investment consortia, and government infrastructure agencies.",
      features: [
        "Multi-project portfolio dashboard",
        "Dedicated compliance & verification desk",
        "Custom stage presets & engineering audit rules",
        "API integration with corporate ERP & banking rails",
        "SLA-backed priority engineer dispatch",
        "Multi-organization permission hierarchies",
      ],
      ctaText: "Contact Enterprise Desk",
      ctaHref: "mailto:enterprise@vantaged.app",
      primary: false,
    },
  ];

  return (
    <section id="pricing" className="relative bg-white py-24 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              Fair &amp; Transparent Model
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight">
            Free for property owners. Built to scale with builders.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            As defined in our product roadmap: property owners never pay to inspect or track their builds. Contractors receive their first project free.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-8 rounded-2xl flex flex-col justify-between border transition-all ${
                tier.primary
                  ? "bg-white border-2 border-[var(--vt-color-orange-500,#EF5F18)] shadow-lg shadow-[rgba(239,95,24,0.06)]"
                  : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] shadow-xs hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium ml-2">
                    {tier.period}
                  </span>
                </div>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed mb-6">
                  {tier.description}
                </p>

                <div className="border-t border-[var(--vt-color-border-default,#E2E0EC)] pt-6 mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-3.5 font-mono">
                    WHAT IS INCLUDED
                  </span>
                  <ul className="space-y-3">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-[var(--vt-color-indigo-900,#261A66)] font-medium">
                        <span className="text-[var(--vt-color-orange-500,#EF5F18)] font-bold mt-0.5">&#x2713;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <a
                  href={tier.ctaHref}
                  className={`w-full h-11 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    tier.primary
                      ? "bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white"
                      : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)]"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

