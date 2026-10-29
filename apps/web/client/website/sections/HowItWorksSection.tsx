import React from "react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Corporate & Entity Verification",
      description:
        "Every construction company undergoes mandatory vetting including verified corporate registration, tax identification, director identification, and verified corporate bank account details.",
    },
    {
      step: "02",
      title: "Project Connection",
      description:
        "Property owners select a verified contractor from our curated directory or invite their existing builder using an exclusive secure project code.",
    },
    {
      step: "03",
      title: "Stage Template Planning",
      description:
        "Contracts are built using standardized structural stage templates—from Substructure and Superstructure to Roofing and M&E installations.",
    },
    {
      step: "04",
      title: "Dual-Lock Agreement",
      description:
        "Both parties review and accept the scope, deliverables, and payment triggers. Once accepted, the baseline schedule is locked; any changes require dual-signoff.",
    },
    {
      step: "05",
      title: "Build & Timestamped Proof",
      description:
        "On-site crew members capture in-app progress photos and videos. Every piece of media is cryptographically tagged with precise GPS coordinates and server timestamps.",
    },
    {
      step: "06",
      title: "Stage Inspection & Review",
      description:
        "Clients or their designated site representatives review real-time evidence against the checklist before signing off or requesting remedial corrections.",
    },
    {
      step: "07",
      title: "Payment Records & Release",
      description:
        "Approving a structural stage makes the milestone payment due. Bank transfers, receipts, and confirmations are logged into a permanent, audit-ready financial trail.",
    },
    {
      step: "08",
      title: "Two-Way Portable Reputation",
      description:
        "At project completion, clients rate builders and builders rate clients. Unresolved disputes stay visible, building authentic trust across the industry.",
    },
  ];

  return (
    <section id="the-advantage" className="relative bg-white py-24 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="h-0.5 w-5 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
              The 8-Stage Protocol
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-tight">
            How Vantaged guarantees accountability from groundbreak to handover.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            A structured workflow where progress is proven, payments are protected, and both sides work with clarity.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group p-6 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all hover:border-[var(--vt-color-orange-300,#FBA674)] flex flex-col justify-between"
            >
              <div>
                <span className="block font-mono text-xs font-extrabold text-[var(--vt-color-orange-500,#EF5F18)] mb-3">
                  STAGE {item.step}
                </span>
                <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2.5 group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                  {item.title}
                </h3>
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

