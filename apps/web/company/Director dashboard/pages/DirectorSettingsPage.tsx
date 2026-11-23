"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useTheme } from "../../../client/context/ThemeContext";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { useContractorUser } from "../hooks/useContractorUser";
import { readLocalData, writeLocalData } from "../utils/localPersistence";

type CompanySettingsTab =
  | "profile"
  | "bank"
  | "plan"
  | "notifications"
  | "security";

interface CompanyProfileData {
  companyName: string;
  rcNumber: string;
  corenLicense: string;
  tinNumber: string;
  officeAddress: string;
  email: string;
  phone: string;
  bio: string;
}

interface BankAccountData {
  bankName: string;
  accountNumber: string;
  accountName: string;
  lastUpdated: string;
}

interface NotificationPrefsData {
  pushRequests: boolean;
  emailRequests: boolean;
  pushReceipts: boolean;
  emailReceipts: boolean;
  pushStages: boolean;
  emailStages: boolean;
  twoFactorEnabled: boolean;
}

const DEFAULT_PROFILE: CompanyProfileData = {
  companyName: "Apex Structure & Civil Ltd",
  rcNumber: "RC-1482903",
  corenLicense: "COREN #F-28410",
  tinNumber: "24098112-0001",
  officeAddress: "Plot 42, Adeola Odeku Street, Victoria Island, Lagos",
  email: "projects@apexstructure.ng",
  phone: "+234 803 411 9021",
  bio: "Licensed civil & structural engineering firm delivering milestone-verified residential and commercial builds across Lagos and Abuja.",
};

const DEFAULT_BANK: BankAccountData = {
  bankName: "Zenith Bank Plc",
  accountNumber: "1014829304",
  accountName: "APEX STRUCTURE & CIVIL LTD",
  lastUpdated: "Verified · Active",
};

const DEFAULT_NOTIFS: NotificationPrefsData = {
  pushRequests: true,
  emailRequests: true,
  pushReceipts: true,
  emailReceipts: true,
  pushStages: true,
  emailStages: true,
  twoFactorEnabled: true,
};

interface ContractorPricingTier {
  id: "contractor-starter" | "contractor-verified" | "contractor-prime";
  kicker: string;
  name: string;
  capacitySlots: number;
  priceMonthlyUSD: string;
  priceYearlyUSD: string;
  priceMonthlyNGN: string;
  priceYearlyNGN: string;
  periodMonthly: string;
  periodYearly: string;
  subtext: string;
  features: string[];
}

const DEFAULT_CONTRACTOR_TIERS: ContractorPricingTier[] = [
  {
    id: "contractor-starter",
    kicker: "New Construction Company",
    name: "Starter Contractor",
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
    kicker: "Commercial Builders",
    name: "Verified Builder",
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
    kicker: "Tier-1 Construction Firms",
    name: "Prime Consortium",
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
];

interface ExtraSlotNotice {
  usd: string;
  ngn: string;
  desc: string;
}

const DEFAULT_EXTRA_SLOT_NOTICE: ExtraSlotNotice = {
  usd: "+$64.99 / month per extra job slot",
  ngn: "+₦85,000 / month per extra job slot",
  desc: "Won an unexpected extra tender? Add single job slots anytime without having to jump to the next major tier.",
};

function normalizePlanId(raw: string): ContractorPricingTier["id"] {
  if (raw === "starter" || raw === "contractor-starter") return "contractor-starter";
  if (raw === "enterprise" || raw === "contractor-prime") return "contractor-prime";
  return "contractor-verified";
}

export function DirectorSettingsPage() {
  const router = useRouter();
  const scrollRef = useScrollRestoration<HTMLElement>("director_settings");
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode, toggleDemoMode } = useDirectorDemoMode();
  const directorUser = useContractorUser();

  const [activeTab, setActiveTab] = useState<CompanySettingsTab>("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState<CompanyProfileData>(() =>
    readLocalData("vantaged_director_company_profile", DEFAULT_PROFILE)
  );
  const [bank, setBank] = useState<BankAccountData>(() =>
    readLocalData("vantaged_director_bank_account", DEFAULT_BANK)
  );
  const [selectedPlanId, setSelectedPlanId] = useState<ContractorPricingTier["id"]>(() =>
    normalizePlanId(readLocalData("vantaged_director_plan_id", "contractor-verified"))
  );
  const [currency, setCurrency] = useState<"NGN" | "USD">(() =>
    readLocalData("vantaged_director_currency", "NGN")
  );
  const [extraSlotsCount, setExtraSlotsCount] = useState<number>(() =>
    readLocalData("vantaged_director_extra_slots", 0)
  );
  const [buySlotsInput, setBuySlotsInput] = useState<number>(1);
  const [contractorTiers, setContractorTiers] = useState<ContractorPricingTier[]>(DEFAULT_CONTRACTOR_TIERS);
  const [extraSlotNotice, setExtraSlotNotice] = useState<ExtraSlotNotice>(DEFAULT_EXTRA_SLOT_NOTICE);

  const fetchPricing = useCallback(async () => {
    try {
      const res = await fetch("/api/pricing");
      if (res.ok) {
        const data = await res.json();
        const contractorData = data?.roles?.contractor;
        if (contractorData?.extraSlotNotice) {
          setExtraSlotNotice(contractorData.extraSlotNotice);
        }
        if (contractorData?.tiers) {
          setContractorTiers((prev) =>
            prev.map((t) => {
              const match = contractorData.tiers.find((dt: Partial<ContractorPricingTier>) => dt.id === t.id);
              return match ? { ...t, ...match } : t;
            })
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch platform pricing in Company Settings:", err);
    }
  }, []);

  const extraSlotUnitPriceNGN = useMemo(() => {
    const digits = (extraSlotNotice.ngn || "").replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : 85000;
  }, [extraSlotNotice.ngn]);

  const extraSlotUnitPriceUSD = useMemo(() => {
    const match = (extraSlotNotice.usd || "").match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 64.99;
  }, [extraSlotNotice.usd]);

  useEffect(() => {
    fetchPricing();
    window.addEventListener("focus", fetchPricing);
    window.addEventListener("storage", fetchPricing);
    window.addEventListener("vantaged_pricing_update", fetchPricing);
    return () => {
      window.removeEventListener("focus", fetchPricing);
      window.removeEventListener("storage", fetchPricing);
      window.removeEventListener("vantaged_pricing_update", fetchPricing);
    };
  }, [fetchPricing]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(() =>
    readLocalData("vantaged_director_billing_cycle", "monthly")
  );
  const [notifs, setNotifs] = useState<NotificationPrefsData>(() =>
    readLocalData("vantaged_director_settings_notifs", DEFAULT_NOTIFS)
  );
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalRequestField, setLegalRequestField] = useState("Company Legal Name");
  const [legalRequestValue, setLegalRequestValue] = useState("");
  const [legalRequestReason, setLegalRequestReason] = useState("");
  const [pendingLegalRequest, setPendingLegalRequest] = useState<{
    field: string;
    requestedValue: string;
    submittedAt: string;
    status?: "PENDING" | "APPROVED" | "DECLINED";
    adminNotes?: string;
  } | null>(() => readLocalData("vantaged_director_legal_update_request", null));

  const syncLegalRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/legal-updates");
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) return;
      const latest = json.data.find((r: any) => r.companyName === profile.companyName) || json.data[0];
      if (!latest) return;

      if (latest.status === "APPROVED") {
        setProfile((prev) => {
          const next = {
            ...prev,
            ...(latest.field === "Company Legal Name" ? { companyName: latest.requestedValue } : {}),
            ...(latest.field === "CAC RC Number" ? { rcNumber: latest.requestedValue } : {}),
            ...(latest.field === "COREN / CORBON License" ? { corenLicense: latest.requestedValue } : {}),
            ...(latest.field === "Tax ID (TIN)" ? { tinNumber: latest.requestedValue } : {}),
          };
          writeLocalData("vantaged_director_company_profile", next);
          return next;
        });
        setPendingLegalRequest(null);
        writeLocalData("vantaged_director_legal_update_request", null);
      } else {
        const nextPending = {
          field: latest.field,
          requestedValue: latest.requestedValue,
          submittedAt: new Date(latest.submittedAt).toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: latest.status,
          adminNotes: latest.adminNotes || "",
        };
        setPendingLegalRequest(nextPending);
        writeLocalData("vantaged_director_legal_update_request", nextPending);
      }
    } catch {
      // Offline / API unavailable fallback uses local state
    }
  }, [profile.companyName]);

  useEffect(() => {
    syncLegalRequests();
    window.addEventListener("focus", syncLegalRequests);
    return () => window.removeEventListener("focus", syncLegalRequests);
  }, [syncLegalRequests]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    writeLocalData("vantaged_director_company_profile", profile);
    setIsEditingContact(false);
    showToast("Contact details saved.");
  };

  const handleCancelContactEdit = () => {
    setProfile(readLocalData("vantaged_director_company_profile", DEFAULT_PROFILE));
    setIsEditingContact(false);
  };

  const handleSubmitLegalUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalRequestValue.trim()) return;
    const currentVal =
      legalRequestField === "Company Legal Name"
        ? profile.companyName
        : legalRequestField === "CAC RC Number"
        ? profile.rcNumber
        : legalRequestField === "COREN / CORBON License"
        ? profile.corenLicense
        : profile.tinNumber;

    const payload = {
      field: legalRequestField,
      requestedValue: legalRequestValue.trim(),
      submittedAt: new Date().toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setPendingLegalRequest(payload);
    writeLocalData("vantaged_director_legal_update_request", payload);

    try {
      await fetch("/api/legal-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: profile.companyName,
          directorName: directorUser.fullName,
          field: legalRequestField,
          currentValue: currentVal,
          requestedValue: legalRequestValue.trim(),
          reason: legalRequestReason.trim(),
        }),
      });
    } catch {
      // Saved locally even if API is unavailable
    }

    setLegalRequestValue("");
    setLegalRequestReason("");
    setShowLegalModal(false);
    showToast("Legal update request sent for Admin verification.");
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...bank, lastUpdated: "Updated · 48h security lock active" };
    setBank(updated);
    writeLocalData("vantaged_director_bank_account", updated);
    showToast("Bank payout details updated.");
  };

  const handleSelectPlan = (planId: ContractorPricingTier["id"], planName: string) => {
    setSelectedPlanId(planId);
    writeLocalData("vantaged_director_plan_id", planId);
    showToast(`Switched company plan to ${planName}.`);
  };

  const handleBillingCycleChange = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
    writeLocalData("vantaged_director_billing_cycle", cycle);
  };

  const handleCurrencyChange = (nextCurrency: "NGN" | "USD") => {
    setCurrency(nextCurrency);
    writeLocalData("vantaged_director_currency", nextCurrency);
  };

  const handleBuyProjectSlots = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Math.min(50, Math.floor(buySlotsInput || 1)));
    const updatedExtra = extraSlotsCount + count;
    setExtraSlotsCount(updatedExtra);
    writeLocalData("vantaged_director_extra_slots", updatedExtra);
    setBuySlotsInput(1);
    showToast(`Added ${count} extra project slot${count > 1 ? "s" : ""}.`);
  };

  const handleRemoveExtraSlot = () => {
    if (extraSlotsCount <= 0) return;
    const updatedExtra = extraSlotsCount - 1;
    setExtraSlotsCount(updatedExtra);
    writeLocalData("vantaged_director_extra_slots", updatedExtra);
    showToast("Released 1 extra project slot.");
  };

  const handleTogglePref = (key: keyof NotificationPrefsData) => {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    writeLocalData("vantaged_director_settings_notifs", next);
    showToast("Preferences saved.");
  };

  const activePlan =
    contractorTiers.find((p) => p.id === selectedPlanId) ?? contractorTiers[1];

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-w-screen max-h-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      <DirectorSidebarNav currentActiveItem="settings" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-10"
      >
        <DirectorHeaderBar
          leftSlot={
            <Link
              href="/contractor/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Header */}
        <section className="pt-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
            Company Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
            Manage your company verification details, bank payout account, plan slots, and alerts.
          </p>
        </section>

        {/* Tab Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {[
            { id: "profile", label: "Company Profile" },
            { id: "bank", label: "Bank & Payouts" },
            { id: "plan", label: "Plan & Project Slots" },
            { id: "notifications", label: "Notifications" },
            { id: "security", label: "Security & Display" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CompanySettingsTab)}
                className={`h-10 px-4 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                  active
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-[var(--vt-color-orange-500,#EF5F18)] shadow-xs"
                    : "bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] border-[var(--vt-color-border-default,#E2E0EC)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Company Profile */}
        {activeTab === "profile" && (
          <div className="space-y-5 max-w-4xl">
            {/* Verified Legal & Registration Details (Locked) */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      {profile.companyName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-700,#1F6B3E)] text-[11px] font-bold">
                      ✓ CAC &amp; COREN Verified
                    </span>
                  </div>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Director: {directorUser.fullName} · Legal details are locked after verification
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLegalModal(true)}
                  className="h-9 px-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-all cursor-pointer shrink-0"
                >
                  Request Legal Update
                </button>
              </div>

              {pendingLegalRequest && (
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs text-[var(--vt-color-orange-800,#8F320D)] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong>Pending Review ({pendingLegalRequest.submittedAt}):</strong> Request to update{" "}
                    <strong>{pendingLegalRequest.field}</strong> to{" "}
                    <span className="font-mono font-bold">{pendingLegalRequest.requestedValue}</span> is awaiting Admin verification.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {[
                  { label: "Company Legal Name", value: profile.companyName, mono: false },
                  { label: "CAC RC Number", value: profile.rcNumber, mono: true },
                  { label: "COREN / CORBON License", value: profile.corenLicense, mono: true },
                  { label: "Tax ID (TIN)", value: profile.tinNumber, mono: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]/80"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {item.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Locked
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] ${
                        item.mono ? "font-mono" : ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Public Overview (Editable only via Edit Contact Info) */}
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    Contact &amp; Public Overview
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Operational contact details shown to property owners on your company profile.
                  </p>
                </div>

                {!isEditingContact && (
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(true)}
                    className="h-9 px-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-all cursor-pointer shrink-0"
                  >
                    Edit Contact Info
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Company Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditingContact}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={`w-full h-9 px-3 rounded-lg border font-semibold outline-none ${
                      isEditingContact
                        ? "border-[var(--vt-color-border-default,#E2E0EC)] bg-white focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        : "border-transparent bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingContact}
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={`w-full h-9 px-3 rounded-lg border font-semibold outline-none ${
                      isEditingContact
                        ? "border-[var(--vt-color-border-default,#E2E0EC)] bg-white focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        : "border-transparent bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Office Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingContact}
                    value={profile.officeAddress}
                    onChange={(e) =>
                      setProfile({ ...profile, officeAddress: e.target.value })
                    }
                    className={`w-full h-9 px-3 rounded-lg border font-semibold outline-none ${
                      isEditingContact
                        ? "border-[var(--vt-color-border-default,#E2E0EC)] bg-white focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        : "border-transparent bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Company Overview
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditingContact}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className={`w-full p-3 rounded-lg border outline-none resize-none ${
                      isEditingContact
                        ? "border-[var(--vt-color-border-default,#E2E0EC)] bg-white focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        : "border-transparent bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-700,#443E63)]"
                    }`}
                  />
                </div>
              </div>

              {isEditingContact && (
                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancelContactEdit}
                    className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
                  >
                    Save Contact Info
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Legal Update Request Modal */}
        {showLegalModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleSubmitLegalUpdate}
              className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    Request Legal Detail Update
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Changes to verified registration details require Vantaged Admin approval.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLegalModal(false)}
                  className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Field to Update
                </label>
                <VantagedSelect
                  value={legalRequestField}
                  onChange={(val) => setLegalRequestField(val)}
                  options={[
                    "Company Legal Name",
                    "CAC RC Number",
                    "COREN / CORBON License",
                    "Tax ID (TIN)",
                  ]}
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  New Registered Value
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter updated legal name or registration number"
                  value={legalRequestValue}
                  onChange={(e) => setLegalRequestValue(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Reason for Change
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g., Renewed COREN license or updated CAC certificate"
                  value={legalRequestReason}
                  onChange={(e) => setLegalRequestReason(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLegalModal(false)}
                  className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Bank & Payouts */}
        {activeTab === "bank" && (
          <form
            onSubmit={handleSaveBank}
            className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-5 max-w-3xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <div>
                <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Company Payout Bank Account (NUBAN)
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  All client stage payments are sent to this verified corporate account.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-700,#B33C08)] text-[11px] font-bold">
                {bank.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Bank Name
                </label>
                <VantagedSelect
                  value={bank.bankName}
                  onChange={(val) => setBank({ ...bank, bankName: val })}
                  options={[
                    "Zenith Bank Plc",
                    "Access Bank Plc",
                    "Guaranty Trust Bank (GTBank)",
                    "First Bank of Nigeria",
                    "Stanbic IBTC Bank",
                    "UBA (United Bank for Africa)",
                  ]}
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  10-Digit Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={bank.accountNumber}
                  onChange={(e) =>
                    setBank({ ...bank, accountNumber: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Corporate Account Name
                </label>
                <input
                  type="text"
                  value={bank.accountName}
                  onChange={(e) => setBank({ ...bank, accountName: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs text-[var(--vt-color-orange-800,#8F320D)]">
              <strong>48-Hour Security Lock:</strong> Changing your company bank account puts a 48-hour hold on new payouts to protect your business from unauthorized changes.
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="h-9 px-5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
              >
                Update Bank Account
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Plan & Project Slots */}
        {activeTab === "plan" && (() => {
          const usedSlots: number = isDemoMode ? 3 : 0;
          const baseSlots = activePlan.capacitySlots;
          const totalSlots = baseSlots + extraSlotsCount;
          const remainingSlots = Math.max(0, totalSlots - usedSlots);
          const utilizationPct = totalSlots > 0 ? Math.min(100, Math.round((usedSlots / totalSlots) * 100)) : 0;
          const nextPlan =
            selectedPlanId === "contractor-starter"
              ? contractorTiers[1]
              : selectedPlanId === "contractor-verified"
              ? contractorTiers[2]
              : null;

          const formatTierPrice = (tier: ContractorPricingTier) =>
            currency === "NGN"
              ? billingCycle === "monthly"
                ? tier.priceMonthlyNGN
                : tier.priceYearlyNGN
              : billingCycle === "monthly"
              ? tier.priceMonthlyUSD
              : tier.priceYearlyUSD;

          const formatAddOnTotal = (count: number) =>
            currency === "NGN"
              ? `+₦${(count * extraSlotUnitPriceNGN).toLocaleString()} / mo`
              : `+$${(count * extraSlotUnitPriceUSD).toFixed(2)} / mo`;

          return (
            <div className="flex flex-col gap-6 max-w-5xl">
              {/* 1. Header Overview & Slot Utilization Card */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/30 border-b border-[var(--vt-color-border-default,#E2E0EC)]/70">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        Active Company Plan & Project Capacity
                      </h2>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1">
                        Track how many construction sites your team is handling and expand your slots anytime.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      {/* NGN / USD Currency Switcher */}
                      <div className="inline-flex items-center p-1 rounded-xl bg-[var(--vt-color-neutral-100,#ECEBF3)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => handleCurrencyChange("NGN")}
                          className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            currency === "NGN"
                              ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold shadow-2xs"
                              : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                          }`}
                        >
                          NGN (₦)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCurrencyChange("USD")}
                          className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            currency === "USD"
                              ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold shadow-2xs"
                              : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                          }`}
                        >
                          USD ($)
                        </button>
                      </div>

                      {/* Monthly / Yearly Switcher */}
                      <div className="inline-flex items-center p-1 rounded-xl bg-[var(--vt-color-neutral-100,#ECEBF3)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => handleBillingCycleChange("monthly")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            billingCycle === "monthly"
                              ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold shadow-2xs"
                              : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBillingCycleChange("yearly")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            billingCycle === "yearly"
                              ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold shadow-2xs"
                              : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                          }`}
                        >
                          Yearly (2 months free)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Capacity KPI Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div className="p-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                        Current Active Plan
                      </p>
                      <p className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        {activePlan.name}
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-orange-600,#D84C0B)] font-semibold mt-0.5">
                        {formatTierPrice(activePlan)} ·{" "}
                        {billingCycle === "monthly" ? activePlan.periodMonthly : activePlan.periodYearly}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                        Total Project Capacity
                      </p>
                      <p className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        {totalSlots} Concurrent Site{totalSlots > 1 ? "s" : ""}
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        {baseSlots} plan slot{baseSlots > 1 ? "s" : ""} + {extraSlotsCount} extra slot{extraSlotsCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                        Slot Utilization
                      </p>
                      <p className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        {usedSlots} of {totalSlots} In Use
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-green-600,#1E7E34)] font-semibold mt-0.5">
                        {remainingSlots} available slot{remainingSlots === 1 ? "" : "s"} remaining
                      </p>
                    </div>
                  </div>

                  {/* Slot Utilization Bar */}
                  <div className="mt-4 pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                        <span>
                          {usedSlots > 0 ? (
                            <>
                              Active sites:{" "}
                              <strong className="text-[var(--vt-color-indigo-900,#261A66)]">
                                {usedSlots} ongoing build{usedSlots === 1 ? "" : "s"}
                              </strong>{" "}
                              assigned to your company
                            </>
                          ) : (
                            "No active sites running right now — ready for new project requests"
                          )}
                        </span>
                      </span>
                      <span>{utilizationPct}% Capacity Utilized</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-200,#DDDCE6)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] transition-all duration-300"
                        style={{
                          width: `${usedSlots > 0 ? Math.min(100, Math.max(8, utilizationPct)) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Clear Call-to-Action to Upgrade to the Next Tier */}
              {nextPlan ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--vt-color-orange-50,#FFF4EE)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/50 border-2 border-[var(--vt-color-orange-400,#FBA674)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                        Recommended Next Step
                      </p>
                      <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        Upgrade to {nextPlan.name} ({nextPlan.capacitySlots} Slots)
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 max-w-xl">
                        {nextPlan.subtext}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(nextPlan.id, nextPlan.name)}
                    className="w-full md:w-auto shrink-0 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 font-sans"
                  >
                    <span>Switch to {nextPlan.name}</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--vt-color-indigo-50,#EEF0FF)] via-white to-[var(--vt-color-indigo-50,#EEF0FF)]/50 border border-[var(--vt-color-indigo-200,#C7C3E6)] flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-indigo-700,#3B2F8F)]">
                      Top Plan Active
                    </p>
                    <p className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      You are on {activePlan.name} with maximum capacity ({activePlan.capacitySlots} active sites).
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Tiers Comparison Grid (Highlighting current tier in ORANGE) */}
              <div>
                <div className="mb-3.5">
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Company Subscription Plans
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Your current active plan is highlighted in orange. Choose any plan to adjust your site capacity.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {contractorTiers.map((plan) => {
                    const isCurrent = plan.id === selectedPlanId;
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                          isCurrent
                            ? "border-2 border-[var(--vt-color-orange-500,#EF5F18)] ring-4 ring-[var(--vt-color-orange-500,#EF5F18)]/15 bg-white shadow-md"
                            : "border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:border-[var(--vt-color-neutral-300,#CAC7D8)] shadow-2xs"
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                                isCurrent
                                  ? "text-[var(--vt-color-orange-600,#D84C0B)]"
                                  : "text-[var(--vt-color-neutral-500,#7C7894)]"
                              }`}
                            >
                              {plan.kicker}
                            </span>
                            <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                              {plan.capacitySlots} Project Slot{plan.capacitySlots > 1 ? "s" : ""}
                            </span>
                          </div>

                          <h4 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-2">
                            {plan.name}
                          </h4>

                          <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                            <span className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                              {formatTierPrice(plan)}
                            </span>
                            <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                              · {billingCycle === "monthly" ? plan.periodMonthly : plan.periodYearly}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                            {plan.subtext}
                          </p>

                          <div className="w-full h-px bg-[var(--vt-color-border-default,#E2E0EC)]/70 my-4" />

                          <ul className="flex flex-col gap-2.5 text-xs text-[var(--vt-color-neutral-700,#443E63)]">
                            {plan.features.map((feat) => (
                              <li key={feat} className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="px-6 pb-6">
                          <button
                            type="button"
                            disabled={isCurrent}
                            onClick={() => handleSelectPlan(plan.id, plan.name)}
                            className={`w-full h-10 rounded-xl text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-300,#FDBB8E)] cursor-default"
                                : "bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white shadow-xs cursor-pointer"
                            }`}
                          >
                            {isCurrent ? "Current Active Plan" : `Switch to ${plan.name}`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Buy Extra Project Slots (À La Carte Monthly Add-on) */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/30 border-b border-[var(--vt-color-border-default,#E2E0EC)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="16" height="20" x="4" y="2" rx="2" />
                        <line x1="9" x2="9.01" y1="6" y2="6" />
                        <line x1="15" x2="15.01" y1="6" y2="6" />
                        <line x1="9" x2="9.01" y1="10" y2="10" />
                        <line x1="15" x2="15.01" y1="10" y2="10" />
                        <path d="M12 14v4" />
                        <path d="M10 16h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        Buy Extra Project Slots
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 max-w-xl">
                        {extraSlotNotice.desc}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex flex-col sm:items-end px-3.5 py-2 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                      Per Extra Slot
                    </span>
                    <span className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                      {currency === "NGN"
                        ? `₦${extraSlotUnitPriceNGN.toLocaleString()} / mo`
                        : `$${extraSlotUnitPriceUSD.toFixed(2)} / mo`}
                    </span>
                  </div>
                </div>

                {/* Body: Left Quantity Controls + Right Order Summary */}
                <form onSubmit={handleBuyProjectSlots} className="p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Quantity & Quick Presets */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
                          How many extra project slots do you want to add?
                        </label>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] p-1">
                            <button
                              type="button"
                              onClick={() => setBuySlotsInput((prev) => Math.max(1, prev - 1))}
                              disabled={buySlotsInput <= 1}
                              className="w-9 h-9 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] disabled:opacity-40 text-[var(--vt-color-indigo-900,#261A66)] font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>

                            <input
                              type="number"
                              min={1}
                              max={50}
                              step={1}
                              value={buySlotsInput}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setBuySlotsInput(isNaN(val) ? 1 : Math.max(1, Math.min(50, val)));
                              }}
                              className="w-16 h-9 text-center font-extrabold text-base bg-transparent text-[var(--vt-color-indigo-900,#261A66)] outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => setBuySlotsInput((prev) => Math.min(50, prev + 1))}
                              className="w-9 h-9 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-indigo-900,#261A66)] font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 5].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setBuySlotsInput(preset)}
                                className={`h-9 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                  buySlotsInput === preset
                                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-400,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)]"
                                    : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:border-[var(--vt-color-neutral-300,#CAC7D8)]"
                                }`}
                              >
                                +{preset} {preset === 1 ? "slot" : "slots"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]/80 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[var(--vt-color-indigo-900,#261A66)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>
                          Extra slots stack on top of your <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{activePlan.name}</strong> plan ({baseSlots} base slot{baseSlots > 1 ? "s" : ""}) and can be removed anytime.
                        </span>
                      </div>
                    </div>

                    {/* Right: Clean Summary & Checkout CTA */}
                    <div className="lg:col-span-5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] p-4 flex flex-col justify-between gap-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span>Current Capacity</span>
                          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            {totalSlots} site{totalSlots > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span>Adding Now</span>
                          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            +{buySlotsInput} extra slot{buySlotsInput > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span>New Total Capacity</span>
                          <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                            {totalSlots + buySlotsInput} concurrent sites
                          </span>
                        </div>

                        <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            Monthly Add-On
                          </span>
                          <span className="text-base font-extrabold text-[var(--vt-color-orange-600,#D84C0B)]">
                            {formatAddOnTotal(buySlotsInput)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-10 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-sans"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        <span>
                          Add {buySlotsInput} Extra Slot{buySlotsInput > 1 ? "s" : ""}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Active Extra Slots Strip */}
                  {extraSlotsCount > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)]/60 border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                            {extraSlotsCount} Extra Project Slot{extraSlotsCount > 1 ? "s" : ""} Active
                          </p>
                          <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                            Billed at {formatAddOnTotal(extraSlotsCount)} · Renews monthly alongside your {activePlan.name} plan
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveExtraSlot}
                        className="h-8 px-3.5 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0 font-sans"
                      >
                        Remove 1 Slot
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          );
        })()}

        {/* Tab 4: Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-3 max-w-3xl text-xs">
            <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
              Alert Preferences
            </h2>

            {[
              {
                title: "New Client Project Requests",
                desc: "Get notified when a property owner sends your company a new brief",
                pushKey: "pushRequests" as const,
                emailKey: "emailRequests" as const,
              },
              {
                title: "Payment & Receipt Alerts",
                desc: "3-day reminders to confirm client bank transfers",
                pushKey: "pushReceipts" as const,
                emailKey: "emailReceipts" as const,
              },
              {
                title: "Stage Checks & Team Updates",
                desc: "Inspection results, fix requests, and site attendance alerts",
                pushKey: "pushStages" as const,
                emailKey: "emailStages" as const,
              },
            ].map((row) => (
              <div
                key={row.title}
                className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    {row.title}
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    {row.desc}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifs[row.pushKey]}
                      onChange={() => handleTogglePref(row.pushKey)}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifs[row.emailKey]}
                      onChange={() => handleTogglePref(row.emailKey)}
                      className="accent-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    Email
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Security & Display */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-4 max-w-3xl text-xs">
            <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Security &amp; Workspace Display
            </h2>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Dark Mode
                </p>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Switch between light and dark theme
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="h-8 px-3.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
              >
                {theme === "dark" ? "Dark (Switch to Light)" : "Light (Switch to Dark)"}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Demo Data Mode
                </p>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Show sample projects, payments, and team members
                </p>
              </div>
              <button
                type="button"
                onClick={toggleDemoMode}
                className={`h-8 px-3.5 rounded-lg font-bold cursor-pointer ${
                  isDemoMode
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                    : "border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                {isDemoMode ? "Demo Mode: ON" : "Demo Mode: OFF"}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Two-Step Login Verification
                </p>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Require a verification code when signing in from a new device
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.twoFactorEnabled}
                onChange={() => handleTogglePref("twoFactorEnabled")}
                className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/contractor/login")}
                className="h-9 px-4 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
              >
                Sign Out of Company Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
