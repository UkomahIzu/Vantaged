import React from "react";

export function ComparisonSection() {
  const rows = [
    {
      feature: "Client Approval Authority",
      whatsapp: "Informal chat agreement; zero binding record",
      enterprise: "Client treated as a guest; builder controls progress %",
      vantaged: "Full approval authority; progress only counts verified stages",
    },
    {
      feature: "Evidence Integrity",
      whatsapp: "Random forwardable photos without timestamps",
      enterprise: "Expensive 3D cameras or complex BIM modeling",
      vantaged: "Cryptographic GPS, atomic timestamp & mandatory photo quotas",
    },
    {
      feature: "Regulatory & Identity Checks",
      whatsapp: "None; anyone with a phone number can operate",
      enterprise: "Rigid corporate licensing frameworks",
      vantaged: "Mandatory corporate registration, tax ID, director ID & bank verification",
    },
    {
      feature: "Standard Structural Workflow",
      whatsapp: "Unstructured chat messages",
      enterprise: "Generic templates with no milestone escrow gates",
      vantaged: "Standardized structural presets (Substructure, Slabs, Framing, Roof, MEP)",
    },
    {
      feature: "Payment & Account Security",
      whatsapp: "Wired upfront on trust; vulnerable to account diversion",
      enterprise: "External enterprise ERP; no client milestone hold",
      vantaged: "Payments locked to approved proof; 48-hour bank freeze guard",
    },
    {
      feature: "Offline Site Capture",
      whatsapp: "Fails without active 4G network signal",
      enterprise: "Heavy bandwidth footprint; struggles on remote jobsites",
      vantaged: "Full offline capture; automatically syncs when signal returns",
    },
  ];

  return (
    <section className="relative bg-[var(--vt-color-neutral-50,#F7F7FA)] py-24 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              Built Different
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight">
            Why Vantaged replaces WhatsApp and outclasses generic software.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            Comparing everyday work practices with international tools and Vantaged&apos;s tailored infrastructure.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-mono w-1/4">
                  Feature / Capability
                </th>
                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-mono w-1/4">
                  WhatsApp &amp; Phone Calls
                </th>
                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-mono w-1/4">
                  US/Global Software
                </th>
                <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF4EE)]/50 font-mono w-1/4">
                  Vantaged Platform
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]">
              {rows.map((row) => (
                <tr key={row.feature} className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 transition-colors">
                  <td className="py-5 px-6 text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    {row.feature}
                  </td>
                  <td className="py-5 px-6 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                    {row.whatsapp}
                  </td>
                  <td className="py-5 px-6 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                    {row.enterprise}
                  </td>
                  <td className="py-5 px-6 text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] bg-[var(--vt-color-orange-50,#FFF4EE)]/30">
                    <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold mr-1.5">&#x2713;</span>
                    {row.vantaged}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

