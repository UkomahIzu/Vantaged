"use client";

import React, { useState, useEffect } from "react";
import {
  IconSubscriptions,
  IconHome,
  IconBuilding,
  IconSpecialist,
  IconEdit,
  IconCheck,
  IconCheckCircle,
} from "../../components/AdminIcons";

type RoleKey = "owner" | "contractor" | "specialist";
type Currency = "NGN" | "USD";

interface PricingTier {
  id: string;
  name: string;
  kicker: string;
  capacitySlots: number; // Integer field
  priceMonthlyUSD: string;
  priceYearlyUSD: string;
  priceMonthlyNGN: string;
  priceYearlyNGN: string;
  periodMonthly: string;
  periodYearly: string;
  subtext: string;
  features: string[];
}

interface ExtraSlotNotice {
  usd: string;
  ngn: string;
  desc: string;
}

interface RoleConfig {
  key: RoleKey;
  label: string;
  shortRole: string;
  heroHeadline: string;
  summary: string;
  extraSlotNotice?: ExtraSlotNotice;
  tiers: PricingTier[];
}

const DEFAULT_ROLES_DATA: Record<RoleKey, RoleConfig> = {
  owner: {
    key: "owner",
    label: "Property Owners",
    shortRole: "Property Owner",
    heroHeadline: "100% Full Feature Access · Pay Only for Project Slots",
    summary:
      "Every property owner gets 100% of platform capabilities: bank escrow custody, daily visual telemetry, and unlimited client reps. Single-home builders are free forever; subscription only applies to managing multiple concurrent builds.",
    extraSlotNotice: {
      usd: "+$19.99 / month per extra slot",
      ngn: "+₦25,000 / month per extra slot",
      desc: "Building an auxiliary guest house, boundary wall, or 11th site? Add single construction slots anytime.",
    },
    tiers: [
      {
        id: "owner-private",
        name: "Private Owner",
        kicker: "Single-Home Builder",
        capacitySlots: 1,
        priceMonthlyUSD: "$0",
        priceYearlyUSD: "$0",
        priceMonthlyNGN: "₦0",
        priceYearlyNGN: "₦0",
        periodMonthly: "Free Forever",
        periodYearly: "Free Forever",
        subtext: "For individual home builders and private clients building a single property.",
        features: [
          "1 Free Active Project Slot Forever",
          "100% Bank Escrow Milestone Protection",
          "Daily Visual Photo & Telemetry Logs",
          "Unlimited Family & Representative Invites",
        ],
      },
      {
        id: "owner-portfolio",
        name: "Portfolio Investor",
        kicker: "Multi-Build Portfolio",
        capacitySlots: 3,
        priceMonthlyUSD: "$49.99",
        priceYearlyUSD: "$499.99",
        priceMonthlyNGN: "₦65,000",
        priceYearlyNGN: "₦650,000",
        periodMonthly: "per month",
        periodYearly: "per year (2 months free)",
        subtext: "For owners building multiple properties or rental investments simultaneously.",
        features: [
          "3 Concurrent Active Project Dashboards",
          "Priority Milestone Escrow Disbursements",
          "Independent QA/QC Site Inspector Dispatch",
          "Dedicated Financial Ledger Reports",
        ],
      },
      {
        id: "owner-estate",
        name: "Estate Developer",
        kicker: "Large-Scale Portfolios",
        capacitySlots: 10,
        priceMonthlyUSD: "$149.99",
        priceYearlyUSD: "$1,499.99",
        priceMonthlyNGN: "₦200,000",
        priceYearlyNGN: "₦2,000,000",
        periodMonthly: "per month",
        periodYearly: "per year (2 months free)",
        subtext: "For estate developers, family syndicates, and high-volume residential portfolios.",
        features: [
          "10 Simultaneous Active Construction Slots",
          "Custom Multi-Stage Approval Workflows",
          "Direct BPP & Regulatory Document Archive",
          "Institutional Bank Audit Trail",
        ],
      },
    ],
  },
  contractor: {
    key: "contractor",
    label: "General Contractors",
    shortRole: "General Contractor",
    heroHeadline: "Commercial Company Tiers · Unlimited Crew & 1st Project Free",
    summary:
      "Commercial company pricing scales strictly by active concurrent construction contracts. Every plan includes unlimited site crew, field photo uploads, and directory verification with zero per-seat penalties. First project is free.",
    extraSlotNotice: {
      usd: "+$49.99 / month per extra job slot",
      ngn: "+₦65,000 / month per extra job slot",
      desc: "Won an unexpected extra tender? Add single job slots anytime without jumping to the next tier.",
    },
    tiers: [
      {
        id: "contractor-starter",
        name: "Starter Contractor",
        kicker: "New Construction Company",
        capacitySlots: 1,
        priceMonthlyUSD: "1st Build Free",
        priceYearlyUSD: "$799.99",
        priceMonthlyNGN: "1st Build Free",
        priceYearlyNGN: "₦1,000,000",
        periodMonthly: "then $79.99/mo (₦100,000/mo)",
        periodYearly: "per year after first build",
        subtext: "Complete your entire first client project with zero platform commission or setup fees.",
        features: [
          "1 Active Project Slot (Free for 1st Build)",
          "Automated CAC & NUBAN Identity Check",
          "Guaranteed Escrow Stage Payouts",
          "Direct Site & Owner Messaging",
        ],
      },
      {
        id: "contractor-verified",
        name: "Verified Builder",
        kicker: "Commercial Builders",
        capacitySlots: 3,
        priceMonthlyUSD: "$199.99",
        priceYearlyUSD: "$1,999.99",
        priceMonthlyNGN: "₦260,000",
        priceYearlyNGN: "₦2,600,000",
        periodMonthly: "per month",
        periodYearly: "per year (2 months free)",
        subtext: "For licensed construction firms managing active client sites with steady tender bids.",
        features: [
          "Up to 3 Concurrent Active Build Slots",
          "COREN / CORBON Verified Partner Seal",
          "Unlimited Client Representatives & Foremen",
          "24-Hour Stage Escrow Release Routing",
        ],
      },
      {
        id: "contractor-prime",
        name: "Prime Consortium",
        kicker: "Tier-1 Construction Firms",
        capacitySlots: 8,
        priceMonthlyUSD: "$449.99",
        priceYearlyUSD: "$4,499.99",
        priceMonthlyNGN: "₦600,000",
        priceYearlyNGN: "₦6,000,000",
        periodMonthly: "per month",
        periodYearly: "per year (2 months free)",
        subtext: "For large construction companies handling multiple commercial developments.",
        features: [
          "Up to 8 Concurrent Active Project Slots",
          "BPP Federal Tender Priority Badge",
          "Dedicated Platform Account Manager",
          "Priority Multi-Bank Escrow Fast-Tracking",
        ],
      },
    ],
  },
  specialist: {
    key: "specialist",
    label: "Quality Specialists & Engineers",
    shortRole: "Quality Specialist",
    heroHeadline: "Independent Quality Auditing & Engineering Governance",
    summary:
      "Get dispatched for paid milestone audits on verified construction sites, or equip your engineering consultancy with digital QA/QC checklists, cube test reports, and tamper-evident audit stamps.",
    extraSlotNotice: {
      usd: "+$29.99 / month per extra audit slot",
      ngn: "+₦40,000 / month per extra audit slot",
      desc: "Expanding your engineering consultancy? Add active audit slots as your field engineer team grows.",
    },
    tiers: [
      {
        id: "specialist-network",
        name: "Inspector Network Member",
        kicker: "Independent Auditor",
        capacitySlots: 1,
        priceMonthlyUSD: "Free to Join",
        priceYearlyUSD: "Free to Join",
        priceMonthlyNGN: "Free to Join",
        priceYearlyNGN: "Free to Join",
        periodMonthly: "100% audit fee kept",
        periodYearly: "100% audit fee kept",
        subtext: "For accredited structural, civil, or MEP engineers conducting site audits.",
        features: [
          "On-Demand Site Audit Dispatch Requests",
          "Direct Escrow Fee Disbursement",
          "Mobile Structural Inspection Checklist",
          "Digital COREN Stamp Certification",
        ],
      },
      {
        id: "specialist-practice",
        name: "Consulting Engineering Practice",
        kicker: "Engineering Firms",
        capacitySlots: 10,
        priceMonthlyUSD: "$99.99",
        priceYearlyUSD: "$999.99",
        priceMonthlyNGN: "₦130,000",
        priceYearlyNGN: "₦1,300,000",
        periodMonthly: "per month",
        periodYearly: "per year (2 months free)",
        subtext: "For structural & civil engineering consultancies auditing private client projects.",
        features: [
          "10 Simultaneous Site Audit Slots",
          "Multi-Engineer Dispatch Management",
          "Structural Defect & Cube Test Logging",
          "Tamper-Proof Audit Sign-Off Certificates",
        ],
      },
      {
        id: "specialist-lab",
        name: "Accredited Testing Laboratory",
        kicker: "Materials Testing Labs",
        capacitySlots: 999,
        priceMonthlyUSD: "Custom",
        priceYearlyUSD: "Custom",
        priceMonthlyNGN: "Custom",
        priceYearlyNGN: "Custom",
        periodMonthly: "Partner Integration",
        periodYearly: "Partner Integration",
        subtext: "For materials testing laboratories verifying concrete, rebar, and soil compaction.",
        features: [
          "Unlimited Batch Test Validations",
          "Digital Concrete Cube Crush Certificates",
          "Soil Compaction & Steel Tensile Dossiers",
          "Direct API Webhook to Lab Instruments",
        ],
      },
    ],
  },
};

export default function SubscriptionsTiersPage() {
  const [rolesData, setRolesData] = useState<Record<RoleKey, RoleConfig>>(DEFAULT_ROLES_DATA);
  const [selectedRole, setSelectedRole] = useState<RoleKey>("contractor");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingTier>>({});
  const [editingExtraSlot, setEditingExtraSlot] = useState<boolean>(false);
  const [extraSlotForm, setExtraSlotForm] = useState<ExtraSlotNotice>({ usd: "", ngn: "", desc: "" });
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load live pricing from API on mount
  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (data?.roles) {
          setRolesData(data.roles);
        }
      })
      .catch((err) => {
        console.warn("Using fallback local pricing data:", err);
        if (typeof window !== "undefined") {
          const local = localStorage.getItem("vantaged_platform_pricing");
          if (local) {
            try {
              setRolesData(JSON.parse(local));
            } catch (e) {
              // ignore
            }
          }
        }
      });
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  const handleStartEditTier = (tier: PricingTier) => {
    setEditingTierId(tier.id);
    setEditForm({
      name: tier.name,
      kicker: tier.kicker,
      capacitySlots: tier.capacitySlots ?? 1,
      priceMonthlyNGN: tier.priceMonthlyNGN,
      priceMonthlyUSD: tier.priceMonthlyUSD,
      priceYearlyNGN: tier.priceYearlyNGN,
      priceYearlyUSD: tier.priceYearlyUSD,
      periodMonthly: tier.periodMonthly,
      periodYearly: tier.periodYearly,
      subtext: tier.subtext,
    });
  };

  const handleCancelEditTier = () => {
    setEditingTierId(null);
    setEditForm({});
  };

  const handleSaveTierPricing = async (tierId: string) => {
    setIsSaving(true);
    const updatedRoles = { ...rolesData };
    const currentTiers = updatedRoles[selectedRole].tiers;
    const idx = currentTiers.findIndex((t) => t.id === tierId);

    if (idx !== -1) {
      currentTiers[idx] = {
        ...currentTiers[idx],
        ...editForm,
      };

      setRolesData(updatedRoles);
      if (typeof window !== "undefined") {
        localStorage.setItem("vantaged_platform_pricing", JSON.stringify(updatedRoles));
      }

      try {
        await fetch("/api/pricing", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roleKey: selectedRole,
            tierId,
            updates: editForm,
          }),
        });
        triggerToast(`Updated pricing for ${currentTiers[idx].name}!`);
      } catch (err) {
        console.error("Failed to persist to API:", err);
        triggerToast("Saved changes locally.");
      }
    }

    setEditingTierId(null);
    setEditForm({});
    setIsSaving(false);
  };

  const handleStartEditExtraSlot = () => {
    const current = rolesData[selectedRole].extraSlotNotice;
    if (current) {
      setExtraSlotForm({ ...current });
      setEditingExtraSlot(true);
    }
  };

  const handleSaveExtraSlot = async () => {
    setIsSaving(true);
    const updatedRoles = { ...rolesData };
    updatedRoles[selectedRole].extraSlotNotice = { ...extraSlotForm };
    setRolesData(updatedRoles);

    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_platform_pricing", JSON.stringify(updatedRoles));
    }

    try {
      await fetch("/api/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleKey: selectedRole,
          extraSlotNotice: extraSlotForm,
        }),
      });
      triggerToast(`Updated extra slot pricing for ${rolesData[selectedRole].label}!`);
    } catch (err) {
      console.error(err);
      triggerToast("Saved extra slot pricing locally.");
    }

    setEditingExtraSlot(false);
    setIsSaving(false);
  };

  const handleResetDefaults = async () => {
    if (!confirm("Reset pricing for all 3 stakeholder roles back to default values?")) return;
    setRolesData(DEFAULT_ROLES_DATA);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vantaged_platform_pricing");
    }
    try {
      await fetch("/api/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: DEFAULT_ROLES_DATA }),
      });
      triggerToast("Restored default platform pricing.");
    } catch (err) {
      console.error(err);
    }
  };

  const currentRoleConfig = rolesData[selectedRole];

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--vt-color-indigo-900,#261A66)] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[var(--vt-color-indigo-700,#43379A)] text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <IconCheck className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <IconSubscriptions className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Commercial & Billing
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
            Subscriptions & Tier Pricing
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
            View and edit live commercial tier pricing, active project slot capacities, and à la carte addons across all stakeholder roles.
          </p>
        </div>

        {/* Currency & Actions Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)]">
            <button
              type="button"
              onClick={() => setCurrency("NGN")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                currency === "NGN"
                  ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-xs"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              NGN (₦)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-xs"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              USD ($)
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-all cursor-pointer shadow-2xs"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* 3 Roles Segmented Switcher (Owner, Contractor, Specialist) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
        <div className="grid grid-cols-3 gap-1.5 w-full">
          {[
            {
              key: "owner" as RoleKey,
              label: "Property Owners",
              Icon: IconHome,
              hint: "Single-Home & Portfolios",
            },
            {
              key: "contractor" as RoleKey,
              label: "General Contractors",
              Icon: IconBuilding,
              hint: "Builders & Consortiums",
            },
            {
              key: "specialist" as RoleKey,
              label: "Quality Specialists",
              Icon: IconSpecialist,
              hint: "Engineers & Testing Labs",
            },
          ].map((tab) => {
            const isActive = selectedRole === tab.key;
            const TabIcon = tab.Icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSelectedRole(tab.key);
                  setEditingTierId(null);
                  setEditingExtraSlot(false);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center sm:text-left ${
                  isActive
                    ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white shadow-sm"
                    : "bg-transparent text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--vt-color-orange-400,#F78241)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} />
                <div className="min-w-0">
                  <div className={`text-xs font-extrabold truncate ${isActive ? "text-white" : "text-[var(--vt-color-indigo-900,#261A66)]"}`}>
                    {tab.label}
                  </div>
                  <div className={`text-[10px] hidden sm:block truncate ${isActive ? "text-white/70" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`}>
                    {tab.hint}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Headline & Extra Slot Add-on Notice */}
      <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase text-[var(--vt-color-orange-600,#D84C0B)]">
              {currentRoleConfig.label} Policy
            </span>
            <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">·</span>
            <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
              {currentRoleConfig.heroHeadline}
            </span>
          </div>
          <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
            {currentRoleConfig.summary}
          </p>
        </div>

        {/* Extra Slot Pricing Card */}
        {currentRoleConfig.extraSlotNotice && (
          <div className="p-3 rounded-lg border border-[var(--vt-color-orange-200,#FDCAA9)] bg-[var(--vt-color-orange-50,#FFF4EE)]/50 shrink-0 md:max-w-xs w-full">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--vt-color-orange-700,#B33C08)]">
                Extra Project Slot Fee
              </span>
              {!editingExtraSlot ? (
                <button
                  type="button"
                  onClick={handleStartEditExtraSlot}
                  className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                >
                  Edit Addon
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingExtraSlot(false)}
                  className="text-[10px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {!editingExtraSlot ? (
              <div>
                <div className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {currency === "NGN" ? currentRoleConfig.extraSlotNotice.ngn : currentRoleConfig.extraSlotNotice.usd}
                </div>
                <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 leading-snug">
                  {currency === "NGN" ? currentRoleConfig.extraSlotNotice.usd : currentRoleConfig.extraSlotNotice.ngn}
                </div>
              </div>
            ) : (
              <div className="space-y-2 mt-2 pt-1 border-t border-[var(--vt-color-orange-200,#FDCAA9)]">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] block">NGN Price</label>
                  <input
                    type="text"
                    value={extraSlotForm.ngn}
                    onChange={(e) => setExtraSlotForm((prev) => ({ ...prev, ngn: e.target.value }))}
                    className="w-full h-7 px-2 text-xs rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] block">USD Price</label>
                  <input
                    type="text"
                    value={extraSlotForm.usd}
                    onChange={(e) => setExtraSlotForm((prev) => ({ ...prev, usd: e.target.value }))}
                    className="w-full h-7 px-2 text-xs rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold outline-none"
                  />
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveExtraSlot}
                  className="w-full h-7 rounded bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[11px] font-bold hover:bg-[var(--vt-color-orange-600,#D84C0B)] transition-all cursor-pointer shadow-2xs"
                >
                  Save Addon Fee
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Tier Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentRoleConfig.tiers.map((tier) => {
          const isEditing = editingTierId === tier.id;
          const displayMonthlyPrice = currency === "NGN" ? tier.priceMonthlyNGN : tier.priceMonthlyUSD;
          const displayYearlyPrice = currency === "NGN" ? tier.priceYearlyNGN : tier.priceYearlyUSD;
          const altMonthlyPrice = currency === "NGN" ? tier.priceMonthlyUSD : tier.priceMonthlyNGN;

          return (
            <div
              key={tier.id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between transition-all ${
                isEditing
                  ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
                  : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              }`}
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1">
                      {tier.kicker}
                    </span>
                    <h3 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      {tier.name}
                    </h3>
                  </div>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleStartEditTier(tier)}
                      className="px-2.5 py-1 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                    >
                      <IconEdit className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
                      Editing
                    </span>
                  )}
                </div>

                {/* Pricing & Terms Section */}
                {!isEditing ? (
                  /* VIEW MODE */
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                        {displayMonthlyPrice}
                      </span>
                      <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {tier.periodMonthly}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                      <span>Alt: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{altMonthlyPrice}</strong></span>
                      <span>·</span>
                      <span>Yearly: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{displayYearlyPrice}</strong></span>
                    </div>

                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed pt-1">
                      {tier.subtext}
                    </p>
                  </div>
                ) : (
                  /* EDIT MODE (Simplified UI with Integer Capacity Field) */
                  <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                          Monthly NGN
                        </label>
                        <input
                          type="text"
                          value={editForm.priceMonthlyNGN || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, priceMonthlyNGN: e.target.value }))}
                          placeholder="₦65,000"
                          className="w-full h-8 px-2.5 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                          Monthly USD
                        </label>
                        <input
                          type="text"
                          value={editForm.priceMonthlyUSD || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, priceMonthlyUSD: e.target.value }))}
                          placeholder="$49.99"
                          className="w-full h-8 px-2.5 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                          Yearly NGN
                        </label>
                        <input
                          type="text"
                          value={editForm.priceYearlyNGN || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, priceYearlyNGN: e.target.value }))}
                          placeholder="₦650,000"
                          className="w-full h-8 px-2.5 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                          Yearly USD
                        </label>
                        <input
                          type="text"
                          value={editForm.priceYearlyUSD || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, priceYearlyUSD: e.target.value }))}
                          placeholder="$499.99"
                          className="w-full h-8 px-2.5 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>
                    </div>

                    {/* Integer Field for Capacity */}
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                        Active Project Capacity (Integer)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={999}
                          step={1}
                          value={editForm.capacitySlots ?? 1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setEditForm((prev) => ({
                              ...prev,
                              capacitySlots: isNaN(val) ? 1 : val,
                            }));
                          }}
                          className="w-full h-8 px-2.5 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                        <span className="text-xs font-medium text-[var(--vt-color-neutral-500,#7C7894)] whitespace-nowrap">
                          {(editForm.capacitySlots ?? 1) >= 999 ? "Unlimited" : "Slots"}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-1">
                        Enter number of active concurrent project slots (e.g. 1, 3, 8, 10). Set 999 for unlimited.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveTierPricing(tier.id)}
                        className="flex-1 h-8 rounded-md bg-[var(--vt-color-green-700,#1F6B3E)] hover:bg-[var(--vt-color-green-800,#134427)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <IconCheck className="w-3.5 h-3.5" />
                        <span>{isSaving ? "Saving..." : "Save Pricing"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditTier}
                        className="h-8 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Capacity Limit Box */}
                <div className="rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3 border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div className="text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-semibold">
                    Platform Slot Capacity
                  </div>
                  <div className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {(tier.capacitySlots ?? 1) >= 999
                      ? "Unlimited Active Projects"
                      : `${tier.capacitySlots ?? 1} Active Project${(tier.capacitySlots ?? 1) === 1 ? "" : "s"} at a Time`}
                  </div>
                </div>

                {/* Included Privileges */}
                <div className="space-y-2 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                  <div className="text-[11px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-semibold">
                    Core Entitlements
                  </div>
                  <ul className="space-y-2 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <IconCheckCircle className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="mt-5 pt-3.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                  Active on Pricing Page
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Tier ID: {tier.id.split("-")[1]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Standalone Tier for Uncertified Trade Contractors / Artisans ── */}
      {selectedRole === "contractor" && (
        <div className="mt-4 pt-6 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--vt-color-orange-100,#FDCAA9)] text-[var(--vt-color-orange-800,#932F04)]">
                  Standalone Trade Tier
                </span>
                <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">·</span>
                <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  For Uncertified Artisans &amp; Small Builders
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                Independent Trade &amp; Artisan Contractor Tier
              </h3>
              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                Uncertified contractors register directly from the pricing page into this tier. They are strictly limited to 1 active project under ₦10M.
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)] self-start sm:self-center">
              Active on Pricing Page
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-[var(--vt-color-orange-300,#FBA674)] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {currency === "NGN" ? "₦0 / Free" : "$0 / Free"}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Free Forever
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                    Capacity Restriction
                  </div>
                  <div className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    Strictly 1 Active Project Slot
                  </div>
                  <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Cannot buy extra slots or scale concurrent sites.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div className="text-[10px] font-mono uppercase font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                    Contract Ceiling
                  </div>
                  <div className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    Max ₦10,000,000 ($10,000)
                  </div>
                  <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Limited to minor works, finishes &amp; renovations.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] pt-1">
                <span className="flex items-center gap-1.5">
                  <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NIN &amp; NUBAN Bank verification</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Guaranteed Escrow Payouts</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No CAC or COREN Required</span>
                </span>
              </div>
            </div>

            <div className="shrink-0 p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] max-w-xs text-xs space-y-2">
              <div className="font-bold text-[var(--vt-color-orange-800,#932F04)]">
                Upgrade Requirement Notice:
              </div>
              <p className="text-[11px] text-[var(--vt-color-orange-700,#B33C08)] leading-relaxed">
                Trade contractors who wish to bid on contracts above ₦10M or unlock concurrent project slots must submit their CAC Limited Company registration, Tax Clearance, and COREN license.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
