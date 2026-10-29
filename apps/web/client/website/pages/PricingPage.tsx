"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../sections/Navbar";
import { FooterSection } from "../sections/FooterSection";
import { openCompanySignupModal } from "../components/CompanySignupModal";

type RoleKey = "owner" | "contractor" | "specialist";
type Currency = "USD" | "NGN";
type BillingCycle = "monthly" | "yearly";

interface PricingTier {
  id: string;
  name: string;
  kicker: string;
  slotCapacity: string;
  capacityDetails: string;
  activeSlotsRule: string;
  priceMonthlyUSD: string;
  priceYearlyUSD: string;
  priceMonthlyNGN: string;
  priceYearlyNGN: string;
  periodMonthly: string;
  periodYearly: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
  primary: boolean;
  highlightNote?: string;
}

interface RoleConfig {
  key: RoleKey;
  label: string;
  shortRole: string;
  heroHeadline: string;
  summary: string;
  stakeholderHref: string;
  stakeholderLabel: string;
  extraSlotNotice?: {
    usd: string;
    ngn: string;
    desc: string;
  };
  tiers: PricingTier[];
  faqs: { q: string; a: string }[];
  ctaBannerTitle: string;
  ctaBannerSub: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
}

export function PricingPage() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>("owner");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Sync role and modal trigger from URL query param (?role=contractor, ?signup=company, etc.)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      const signupParam = params.get("signup");
      const planParam = params.get("plan");

      if (roleParam === "enterprise") {
        setSelectedRole("owner");
      } else if (
        roleParam &&
        ["owner", "contractor", "specialist"].includes(roleParam)
      ) {
        setSelectedRole(roleParam as RoleKey);
      }

      if (roleParam === "contractor" && (signupParam === "true" || signupParam === "company")) {
        const p = planParam === "verified" || planParam === "prime" || planParam === "starter" ? planParam : "starter";
        openCompanySignupModal(p);
      }
    }
  }, []);

  const roleConfigs: Record<RoleKey, RoleConfig> = {
    owner: {
      key: "owner",
      label: "Property Owners",
      shortRole: "Property Owner",
      heroHeadline: "100% Full Feature Access · Pay Only for Project Slots",
      summary:
        "Every property owner gets 100% of the platform's capabilities from day one: bank escrow custody, daily visual telemetry, and unlimited client reps. Single-home builders are free forever; you only subscribe for capacity slots if managing multiple concurrent builds.",
      stakeholderHref: "/stakeholders/owners",
      stakeholderLabel: "Explore Property Owner Services",
      extraSlotNotice: {
        usd: "+$19.99 / month per extra slot",
        ngn: "+₦25,000 / month per extra slot",
        desc: "Building an auxiliary guest house, boundary wall, or 11th site? Add single construction slots anytime without jumping tiers.",
      },
      tiers: [
        {
          id: "owner-private",
          name: "Private Owner",
          kicker: "Single-Home Builder",
          slotCapacity: "1 Active Project at a Time",
          capacityDetails: "Execute and track 1 active residential construction project from inception to handover.",
          activeSlotsRule: "1 Active Project Slot Included",
          priceMonthlyUSD: "$0",
          priceYearlyUSD: "$0",
          priceMonthlyNGN: "₦0",
          priceYearlyNGN: "₦0",
          periodMonthly: "Free Forever",
          periodYearly: "Free Forever",
          subtext: "For individual home builders and private clients building a single property.",
          ctaText: "Start Free with 1 Project",
          ctaHref: "/signup/owner",
          primary: false,
        },
        {
          id: "owner-portfolio",
          name: "Portfolio Investor",
          kicker: "Multi-Build Portfolio",
          slotCapacity: "Up to 3 Active Projects at Once",
          capacityDetails: "Manage up to 3 simultaneous construction site dashboards concurrently.",
          activeSlotsRule: "3 Active Project Slots Included",
          priceMonthlyUSD: "$49.99",
          priceYearlyUSD: "$499.99",
          priceMonthlyNGN: "₦65,000",
          priceYearlyNGN: "₦650,000",
          periodMonthly: "per month",
          periodYearly: "per year (2 months free)",
          subtext: "For owners building multiple properties or rental investments simultaneously.",
          ctaText: "Get 3 Project Slots",
          ctaHref: "/signup/owner",
          primary: false,
        },
        {
          id: "owner-estate",
          name: "Estate Developer",
          kicker: "Large-Scale Portfolios",
          slotCapacity: "Up to 10 Active Projects at Once",
          capacityDetails: "Govern up to 10 simultaneous building sites across your development portfolio.",
          activeSlotsRule: "10 Active Project Slots Included",
          priceMonthlyUSD: "$149.99",
          priceYearlyUSD: "$1,499.99",
          priceMonthlyNGN: "₦200,000",
          priceYearlyNGN: "₦2,000,000",
          periodMonthly: "per month",
          periodYearly: "per year (2 months free)",
          subtext: "For estate developers, family syndicates, and high-volume residential portfolios.",
          ctaText: "Get 10 Project Slots",
          ctaHref: "/signup/owner",
          primary: false,
        },
      ],
      faqs: [
        {
          q: "Is Vantaged really free for single-home property owners?",
          a: "Yes. In our monetization architecture, individual property owners building a single home never pay a SaaS subscription or software licensing fee. You can invite unlimited family members or client reps completely free. Platform monetization is driven by the milestone escrow protection take-rate when funding stages.",
        },
        {
          q: "How does the milestone escrow protect my funds?",
          a: "When you fund a milestone, the money is held in a segregated, regulated partner bank trust escrow account. The contractor cannot withdraw the funds until you personally verify the milestone deliverables with photo proof and independent engineer sign-off.",
        },
        {
          q: "What happens when a project finishes?",
          a: "Only active, in-progress construction projects count against your slot allowance. Once a project is completed or archived, its slot is immediately freed up for your next build at zero additional charge, while the full history and digital asset dossier remain accessible forever.",
        },
        {
          q: "Can diaspora owners fund projects in foreign currencies?",
          a: "Yes. Vantaged supports multi-currency escrow in USD, GBP, EUR, and local currency rails. Capital deposits are converted transparently at institutional rates when verified stage payouts are disbursed.",
        },
      ],
      ctaBannerTitle: "Protect Your Hard-Earned Capital with Guaranteed Escrow",
      ctaBannerSub: "Stop construction anxiety. Fund your build stage-by-stage and release payouts only when verified steel and concrete are in place.",
      ctaPrimaryText: "Create Free Owner Account",
      ctaPrimaryHref: "/signup/owner",
    },

    contractor: {
      key: "contractor",
      label: "General Contractors",
      shortRole: "General Contractor",
      heroHeadline: "Commercial Company Tiers · Unlimited Crew & 1st Project Free",
      summary:
        "Commercial company pricing scales strictly by active concurrent construction contracts. Every plan includes unlimited site crew, field photo uploads, and directory verification with zero per-seat penalties. Your first project is 100% free.",
      stakeholderHref: "/stakeholders/contractors",
      stakeholderLabel: "Explore Contractor Operating System",
      extraSlotNotice: {
        usd: "+$49.99 / month per extra job slot",
        ngn: "+₦65,000 / month per extra job slot",
        desc: "Won an unexpected extra tender? Add single job slots anytime without having to jump to the next major tier.",
      },
      tiers: [
        {
          id: "contractor-starter",
          name: "Starter Contractor",
          kicker: "New Construction Company",
          slotCapacity: "1 Active Contract at a Time",
          capacityDetails: "Execute 1 active client contract. Entire first build is free of platform fees for up to 12 months.",
          activeSlotsRule: "1 Active Job Slot Included",
          priceMonthlyUSD: "1st Build Free",
          priceYearlyUSD: "$799.99",
          priceMonthlyNGN: "1st Build Free",
          priceYearlyNGN: "₦1,000,000",
          periodMonthly: "then $79.99/mo (₦100,000/mo)",
          periodYearly: "per year after first build",
          subtext: "Complete your entire first client project with zero platform commission or setup fees.",
          ctaText: "Claim Free 1st Project Slot",
          ctaHref: "/signup?role=contractor",
          primary: false,
        },
        {
          id: "contractor-verified",
          name: "Verified Builder",
          kicker: "Commercial Builders",
          slotCapacity: "Up to 3 Active Contracts at Once",
          capacityDetails: "Run up to 3 simultaneous client construction contracts with verified directory prominence.",
          activeSlotsRule: "3 Active Job Slots Included",
          priceMonthlyUSD: "$199.99",
          priceYearlyUSD: "$1,999.99",
          priceMonthlyNGN: "₦260,000",
          priceYearlyNGN: "₦2,600,000",
          periodMonthly: "per month",
          periodYearly: "per year (2 months free)",
          subtext: "For licensed construction firms managing active client sites with steady tender bids.",
          ctaText: "Get 3 Job Slots",
          ctaHref: "/signup?role=contractor",
          primary: false,
        },
        {
          id: "contractor-prime",
          name: "Prime Consortium",
          kicker: "Tier-1 Construction Firms",
          slotCapacity: "Up to 8 Active Contracts at Once",
          capacityDetails: "Execute up to 8 simultaneous commercial or residential construction projects.",
          activeSlotsRule: "8 Active Job Slots Included",
          priceMonthlyUSD: "$449.99",
          priceYearlyUSD: "$4,499.99",
          priceMonthlyNGN: "₦600,000",
          priceYearlyNGN: "₦6,000,000",
          periodMonthly: "per month",
          periodYearly: "per year (2 months free)",
          subtext: "For large construction companies handling multiple commercial developments.",
          ctaText: "Get 8 Job Slots",
          ctaHref: "/signup?role=contractor",
          primary: false,
        },
      ],
      faqs: [
        {
          q: "How does the Contractor First-Project Free trial work?",
          a: "Under PRD rule FR-BIL-04, a contractor's first project on Vantaged is completely free until finished, up to 12 months. This allows you to experience guaranteed stage payouts, mobile proof tools, and build a verified reputation score with zero platform cost.",
        },
        {
          q: "Why does Vantaged charge by job slots instead of per user?",
          a: "Under PRD rule FR-BIL-02, every tier includes unlimited users. Per-seat pricing discourages adding site workers, managers, and subcontractors — who are the exact people capturing daily proof on site. By charging by active concurrent job slots, your whole company can collaborate freely.",
        },
        {
          q: "What if I need one more project slot without jumping to the next tier?",
          a: "You can purchase à la carte single job slots for +$49.99/mo (₦65,000/mo) per slot. When that project finishes, simply cancel the add-on.",
        },
        {
          q: "When are milestone payouts disbursed to my corporate account?",
          a: "Once a milestone is verified and approved by the owner or inspector, escrow funds are transferred directly to your corporate bank account within 24 hours.",
        },
      ],
      ctaBannerTitle: "Never Chase an Unpaid Construction Invoice Again",
      ctaBannerSub: "Experience the certainty of guaranteed milestone payouts locked in escrow before you mobilize site crew and materials.",
      ctaPrimaryText: "Start First Project Free",
      ctaPrimaryHref: "/signup?role=contractor",
    },

    specialist: {
      key: "specialist",
      label: "Quality Specialists & Engineers",
      shortRole: "Quality Specialist",
      heroHeadline: "Independent Quality Auditing & Engineering Governance",
      summary:
        "Get dispatched for paid milestone audits on verified construction sites, or equip your engineering consultancy with digital QA/QC checklists, cube test reports, and tamper-evident audit stamps.",
      stakeholderHref: "/stakeholders/specialists",
      stakeholderLabel: "Explore Specialist & Auditor Network",
      tiers: [
        {
          id: "specialist-network",
          name: "Inspector Network Member",
          kicker: "Independent Auditor",
          slotCapacity: "On-Demand Audit Dispatch",
          capacityDetails: "Receive audit dispatch requests from owners & banks. Keep 100% of agreed inspection fees.",
          activeSlotsRule: "On-Demand Site Dispatches",
          priceMonthlyUSD: "Free to Join",
          priceYearlyUSD: "Free to Join",
          priceMonthlyNGN: "Free to Join",
          priceYearlyNGN: "Free to Join",
          periodMonthly: "100% audit fee kept",
          periodYearly: "100% audit fee kept",
          subtext: "For accredited structural, civil, or MEP engineers conducting site audits.",
          ctaText: "Join Inspector Network",
          ctaHref: "/signup?role=specialist",
          primary: false,
        },
        {
          id: "specialist-practice",
          name: "Consulting Engineering Practice",
          kicker: "Engineering Firms",
          slotCapacity: "Up to 10 Active Audits at Once",
          capacityDetails: "Run up to 10 simultaneous site audit workflows across your team of field engineers.",
          activeSlotsRule: "10 Active Audit Slots Included",
          priceMonthlyUSD: "$99.99",
          priceYearlyUSD: "$999.99",
          priceMonthlyNGN: "₦130,000",
          priceYearlyNGN: "₦1,300,000",
          periodMonthly: "per month",
          periodYearly: "per year (2 months free)",
          subtext: "For structural & civil engineering consultancies auditing private client projects.",
          ctaText: "Get 10 Audit Slots",
          ctaHref: "/signup?role=specialist",
          primary: false,
        },
        {
          id: "specialist-lab",
          name: "Accredited Testing Laboratory",
          kicker: "Materials Testing Labs",
          slotCapacity: "Unlimited Batch Validations",
          capacityDetails: "Issue verified digital test certificates for concrete, steel tensile, and soil compaction.",
          activeSlotsRule: "Unlimited Batch Validations",
          priceMonthlyUSD: "Custom",
          priceYearlyUSD: "Custom",
          priceMonthlyNGN: "Custom",
          priceYearlyNGN: "Custom",
          periodMonthly: "Partner Integration",
          periodYearly: "Partner Integration",
          subtext: "For materials testing laboratories verifying concrete, rebar, and soil compaction.",
          ctaText: "Partner as Testing Lab",
          ctaHref: "/support",
          primary: false,
        },
      ],
      faqs: [
        {
          q: "How do independent engineers get dispatched for milestone audits?",
          a: "When a property owner or contractor requests third-party technical verification for a structural milestone (such as foundation pour or lintel casting), certified engineers registered in that geographic zone receive dispatch notifications with site location, scope, and audit fee.",
        },
        {
          q: "Who determines the audit inspection fee?",
          a: "Inspection fees are standardized and clearly shown upfront prior to accepting a dispatch, or negotiated directly when engineering practices onboard their own private clients onto Vantaged.",
        },
        {
          q: "How does Vantaged protect engineering liability?",
          a: "All inspections captured through the Vantaged app include timestamped geotags, tamper-evident photograph hashing, and clear scope boundaries sealed permanently into the digital property dossier.",
        },
      ],
      ctaBannerTitle: "Elevate Construction Standards with Verified Auditing",
      ctaBannerSub: "Join our global network of accredited structural engineers and testing professionals transforming site quality.",
      ctaPrimaryText: "Join Inspector Network",
      ctaPrimaryHref: "/signup?role=specialist",
    },
  };

  const activeConfig = roleConfigs[selectedRole];

  // Escrow Take-rate schedule data directly from Section 2.2 of monetization plan
  const escrowTakeRateTiers = [
    {
      tier: "Tier I: Standard Build",
      contractSizeUSD: "Under $100,000",
      contractSizeNGN: "Under ₦100,000,000",
      takeRate: "1.50%",
      exampleTrancheUSD: "$15,000 (Foundation Slab)",
      exampleTrancheNGN: "₦20,000,000 (Foundation Slab)",
      exampleFeeUSD: "$225",
      exampleFeeNGN: "₦300,000",
      protection: "Full regulated bank escrow custody, tamper-proof milestone telemetry, and 24h payout settlement.",
    },
    {
      tier: "Tier II: Mid-Scale / Luxury",
      contractSizeUSD: "$100,000 – $500,000",
      contractSizeNGN: "₦100,000,000 – ₦500,000,000",
      takeRate: "1.00%",
      exampleTrancheUSD: "$50,000 (Framing / Decking)",
      exampleTrancheNGN: "₦50,000,000 (Framing / Decking)",
      exampleFeeUSD: "$500",
      exampleFeeNGN: "₦500,000",
      protection: "Dedicated project virtual escrow vault, priority engineer inspection dispatch, and FX hedging.",
    },
    {
      tier: "Tier III: Major Commercial",
      contractSizeUSD: "Over $500,000",
      contractSizeNGN: "Over ₦500,000,000",
      takeRate: "0.75%",
      exampleTrancheUSD: "$150,000 (Curtain Wall / MEP)",
      exampleTrancheNGN: "₦150,000,000 (Curtain Wall / MEP)",
      exampleFeeUSD: "$1,125",
      exampleFeeNGN: "₦1,125,000",
      protection: "Institutional escrow facility, custom retainage withholding, and multi-sig corporate sign-offs.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 sm:py-8 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
        <Navbar activeLinkId="nav-pricing" />
      </div>

      <main className="flex-1">
        {/* ── Page Header / Hero ── */}
        <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                Capacity-Based Construction Pricing
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.08] mb-6">
              PAY ONLY FOR ACTIVE PROJECT CAPACITY
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed mb-8">
              All tools and escrow protections are 100% included on every tier. You only pay for the capacity to run concurrent active projects. Select your role below.
            </p>

            {/* ── Role Selector Segmented Controls ── */}
            <div className="w-full max-w-3xl flex flex-col items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)] mb-3">
                Select Stakeholder Role
              </span>

              <div className="p-1.5 rounded-lg bg-[#EDEBF5] dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full shadow-2xs">
                {(
                  [
                    { key: "owner", label: "Property Owners" },
                    { key: "contractor", label: "General Contractors" },
                    { key: "specialist", label: "Quality Specialists" },
                  ] as const
                ).map((role) => {
                  const isSelected = selectedRole === role.key;
                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.key);
                        setOpenFaq(0);
                      }}
                      className={`h-11 px-4 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center text-center select-none ${
                        isSelected
                          ? "bg-[#261A66] text-white shadow-sm border border-[#261A66] dark:bg-[#EF5F18] dark:border-[#EF5F18] dark:text-white scale-[1.01]"
                          : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460] border border-transparent"
                      }`}
                    >
                      <span>{role.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── Contextual Role Overview Bar ── */}
              <div className="mt-6 w-full p-4 sm:p-5 rounded-lg bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] inline-block" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      {activeConfig.heroHeadline}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    {activeConfig.summary}
                  </p>
                </div>

                <a
                  href={activeConfig.stakeholderHref}
                  className="shrink-0 text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] dark:text-[var(--vt-color-orange-400,#F17C42)] hover:text-[var(--vt-color-orange-700,#BF3E05)] dark:hover:text-[var(--vt-color-orange-300,#FBA674)] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{activeConfig.stakeholderLabel}</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Currency & Billing Cycle Switchers ── */}
        <section className="py-6 px-6 sm:px-10 lg:px-14 bg-white dark:bg-[#110C30] border-b border-[#E2E0EC] dark:border-[#2C2460]">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 flex-wrap">
            {/* Currency Toggle */}
            <div className="flex items-center p-1 rounded-md bg-[#EDEBF5] dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460]">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
                  currency === "USD"
                    ? "bg-[#EF5F18] text-white shadow-xs"
                    : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460]"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("NGN")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
                  currency === "NGN"
                    ? "bg-[#EF5F18] text-white shadow-xs"
                    : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460]"
                }`}
              >
                NGN (₦)
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center p-1 rounded-md bg-[#EDEBF5] dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460]">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#EF5F18] text-white shadow-xs"
                    : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-[#EF5F18] text-white shadow-xs"
                    : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460]"
                }`}
              >
                Annual (2 Mo. Free)
              </button>
            </div>
          </div>
        </section>

        {/* ── Dynamic Pricing Cards (Tailored to Selected Role) ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {activeConfig.tiers.map((tier) => {
                const price =
                  currency === "USD"
                    ? billingCycle === "monthly"
                      ? tier.priceMonthlyUSD
                      : tier.priceYearlyUSD
                    : billingCycle === "monthly"
                    ? tier.priceMonthlyNGN
                    : tier.priceYearlyNGN;

                const period =
                  billingCycle === "monthly" ? tier.periodMonthly : tier.periodYearly;

                return (
                  <div
                    key={tier.id}
                    className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] flex flex-col justify-between transition-all duration-200 relative border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm hover:shadow-md hover:border-[var(--vt-color-indigo-400,#6B5ECD)]/40"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                        {tier.kicker}
                      </span>

                      <h3 className="text-xl font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                        {tier.name}
                      </h3>

                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)] mb-4 leading-relaxed">
                        {tier.subtext}
                      </p>

                      <div className="mb-6 pb-6 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                          {price}
                        </span>
                        <span className="block text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)] mt-1 font-medium">
                          {period}
                        </span>
                      </div>

                      {/* ── Prominent Project Capacity Metric Box (Strictly Focuses on Projects That Can Be Done) ── */}
                      <div className="p-4 rounded-lg bg-[var(--vt-color-neutral-100,#EDEBF5)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] mb-6 text-left">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                          Simultaneous Project Capacity
                        </span>
                        <span className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] block leading-snug">
                          {tier.slotCapacity}
                        </span>
                        <span className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] mt-1.5 block leading-relaxed">
                          {tier.capacityDetails}
                        </span>
                      </div>

                      {/* ── Capacity Guarantees (No fake feature perks) ── */}
                      <div className="space-y-3 mb-8 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                          <span><strong>{tier.activeSlotsRule}</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                          <span><strong>Slot Recycling:</strong> Finished builds free up slots automatically</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                          <span><strong>100% Full Access:</strong> Escrow, telemetry &amp; all tools included</span>
                        </div>
                      </div>
                    </div>

                    {/* ── High-Contrast, Polish-Enhanced CTA Button ── */}
                    {selectedRole === "contractor" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const p = tier.id.includes("prime")
                            ? "prime"
                            : tier.id.includes("verified")
                            ? "verified"
                            : "starter";
                          openCompanySignupModal(p);
                        }}
                        className="w-full h-11 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none bg-[#261A66] hover:bg-[#EF5F18] active:bg-[#D84C0B] text-white dark:bg-[#EF5F18] dark:hover:bg-[#D84C0B] dark:text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-[#261A66] dark:border-[#EF5F18]"
                      >
                        <span>{tier.ctaText}</span>
                        <span>&rarr;</span>
                      </button>
                    ) : (
                      <a
                        href={tier.ctaHref}
                        className="w-full h-11 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none bg-[#261A66] hover:bg-[#EF5F18] active:bg-[#D84C0B] text-white dark:bg-[#EF5F18] dark:hover:bg-[#D84C0B] dark:text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-[#261A66] dark:border-[#EF5F18]"
                      >
                        <span>{tier.ctaText}</span>
                        <span>&rarr;</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── À La Carte Single Slot Add-On Callout (Section 3.4 of Monetization Plan) ── */}
            {activeConfig.extraSlotNotice && (
              <div className="mt-12 p-6 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                    À La Carte Capacity Flexibility · Section 3.4
                  </span>
                  <h4 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                    Need just one extra temporary construction slot?
                  </h4>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed">
                    {activeConfig.extraSlotNotice.desc}
                  </p>
                </div>

                <div className="shrink-0 text-center sm:text-right">
                  <span className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] block">
                    {currency === "USD"
                      ? activeConfig.extraSlotNotice.usd
                      : activeConfig.extraSlotNotice.ngn}
                  </span>
                  <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                    Cancel anytime upon project completion
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Revenue Stream A: Escrow Take-Rate Schedule (Direct from Section 2.2) ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-white dark:bg-[var(--vt-color-background-default,#110C30)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-12">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Primary Revenue Engine · Section 2
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                Escrow Take-Rate &amp; Tranche Protection Schedule
              </h2>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                Platform fees are structured hierarchically based on total contract size. Holding funds in regulated bank trust escrow guarantees that builders get paid upon delivery and owners only release funds for verified work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {escrowTakeRateTiers.map((tranche, tIdx) => (
                <div
                  key={tIdx}
                  className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                      {tranche.tier}
                    </span>
                    <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Contract Size:{" "}
                      {currency === "USD" ? tranche.contractSizeUSD : tranche.contractSizeNGN}
                    </h3>

                    <div className="my-4 py-3 px-4 rounded bg-white dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-orange-500,#EF5F18)] block">
                        {tranche.takeRate}
                      </span>
                      <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                        Platform fee on milestone tranche release
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] mb-4">
                      <div>
                        <strong>Example Milestone:</strong>{" "}
                        {currency === "USD"
                          ? tranche.exampleTrancheUSD
                          : tranche.exampleTrancheNGN}
                      </div>
                      <div>
                        <strong>Vantaged Fee:</strong>{" "}
                        <span className="text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] font-bold">
                          {currency === "USD" ? tranche.exampleFeeUSD : tranche.exampleFeeNGN}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)] pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] leading-relaxed">
                    {tranche.protection}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-[var(--vt-color-neutral-100,#EDEBF5)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] flex items-start gap-2.5">
              <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold">ℹ</span>
              <span>
                <strong>Fee Allocation (Who Pays):</strong> Under Section 2.3 of our architecture, the milestone protection surcharge is paid by the property owner on tranche deposit, ensuring contractors receive 100% of their agreed Bill of Quantities (BOQ) contract value without settlement deductions.
              </span>
            </div>
          </div>
        </section>

        {/* ── Role-Specific Frequently Asked Questions ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Clear Answers
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Frequently Asked Questions for {activeConfig.label}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                Everything you need to know about pricing, escrow protection, capacity slots, and payments for {activeConfig.shortRole.toLowerCase()}s.
              </p>
            </div>

            <div className="space-y-4">
              {activeConfig.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#261A66] dark:text-[#F4F3FC] hover:bg-[#EDEBF5] dark:hover:bg-[#2C2460] transition-colors cursor-pointer select-none"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[var(--vt-color-orange-600,#D84C0B)] text-lg">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed border-t border-[var(--vt-color-neutral-100,#EFEEF5)] dark:border-[var(--vt-color-border-subtle,#221B4F)]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Dynamic Call To Action Banner ── */}
        <section className="py-20 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-400,#F17C42)] mb-2 block">
              {activeConfig.shortRole} Onboarding
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4">
              {activeConfig.ctaBannerTitle}
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
              {activeConfig.ctaBannerSub}
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {selectedRole === "contractor" ? (
                <button
                  type="button"
                  onClick={() => {
                    openCompanySignupModal("starter");
                  }}
                  className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>{activeConfig.ctaPrimaryText}</span>
                  <span>&rarr;</span>
                </button>
              ) : (
                <a
                  href={activeConfig.ctaPrimaryHref}
                  className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>{activeConfig.ctaPrimaryText}</span>
                  <span>&rarr;</span>
                </a>
              )}
              <a
                href={activeConfig.stakeholderHref}
                className="h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/25 hover:border-white/50 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>{activeConfig.stakeholderLabel}</span>
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




