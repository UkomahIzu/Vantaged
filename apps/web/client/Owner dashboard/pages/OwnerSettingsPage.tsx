"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { VantagedSelect } from "../components/VantagedSelect";

export type SettingsTab = "profile" | "subscription" | "security" | "escrow" | "notifications";

export function OwnerSettingsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("owner_settings");
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscription & Capacity State
  const [currentTier, setCurrentTier] = useState<"owner-private" | "owner-portfolio" | "owner-estate">("owner-private");
  const [extraSlotsCount, setExtraSlotsCount] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [buySlotsInput, setBuySlotsInput] = useState<number>(1);

  // Load saved subscription state from localStorage or URL query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTier = localStorage.getItem("vantaged_owner_tier") as "owner-private" | "owner-portfolio" | "owner-estate" | null;
      if (savedTier && ["owner-private", "owner-portfolio", "owner-estate"].includes(savedTier)) {
        setCurrentTier(savedTier);
      }
      const savedExtra = localStorage.getItem("vantaged_owner_extra_slots");
      if (savedExtra !== null) {
        const parsed = parseInt(savedExtra, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setExtraSlotsCount(parsed);
        }
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "subscription" || tabParam === "capacity" || tabParam === "pricing") {
        setActiveTab("subscription");
      }
    }
  }, []);

  // Capacity calculations
  const baseSlots = currentTier === "owner-private" ? 1 : currentTier === "owner-portfolio" ? 3 : 10;
  const totalSlots = baseSlots + extraSlotsCount;
  const usedSlots = 1; // Current active project in demo: Lekki Phase 1 Luxury Villa
  const remainingSlots = Math.max(0, totalSlots - usedSlots);

  const tierNames: Record<"owner-private" | "owner-portfolio" | "owner-estate", string> = {
    "owner-private": "Private Owner",
    "owner-portfolio": "Portfolio Investor",
    "owner-estate": "Estate Developer",
  };

  const handleUpgradeTier = (tierId: "owner-private" | "owner-portfolio" | "owner-estate") => {
    setCurrentTier(tierId);
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_owner_tier", tierId);
      window.dispatchEvent(new Event("storage"));
    }
    showToast(`Upgraded to ${tierNames[tierId]} tier successfully.`);
  };

  const handleBuyProjectSlots = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Math.min(50, Math.floor(buySlotsInput || 1)));
    const updatedExtra = extraSlotsCount + count;
    setExtraSlotsCount(updatedExtra);
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_owner_extra_slots", updatedExtra.toString());
      window.dispatchEvent(new Event("storage"));
    }
    setBuySlotsInput(1);
    showToast(`Purchased ${count} project slot${count > 1 ? "s" : ""}! Total capacity: ${baseSlots + updatedExtra} concurrent projects.`);
  };

  const handleRemoveExtraSlot = () => {
    if (extraSlotsCount <= 0) return;
    const updatedExtra = extraSlotsCount - 1;
    setExtraSlotsCount(updatedExtra);
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_owner_extra_slots", updatedExtra.toString());
      window.dispatchEvent(new Event("storage"));
    }
    showToast(`Released 1 extra project slot. Total capacity: ${baseSlots + updatedExtra} projects.`);
  };

  // Profile Form State
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("+234 803 456 7890");
  const [entityName, setEntityName] = useState("Robinson Prime Holdings Ltd");
  const [stateRegion, setStateRegion] = useState("Lagos State");
  const [currency, setCurrency] = useState("NGN");

  // Sync with currentUser when loaded
  useEffect(() => {
    if (currentUser.fullName) {
      setFullName(currentUser.fullName);
    }
    if (currentUser.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Escrow Banking State
  const [bankName, setBankName] = useState("Guaranty Trust Bank (GTBank)");
  const [accountNumber, setAccountNumber] = useState("0123456789");
  const [accountName, setAccountName] = useState("Robinson Prime Holdings Ltd");
  const [escrowPin, setEscrowPin] = useState("••••");
  const [isBankVerified, setIsBankVerified] = useState(true);

  // Notification Preferences State (PRD §7.18)
  const [notifyMilestonesPush, setNotifyMilestonesPush] = useState(true);
  const [notifyMilestonesEmail, setNotifyMilestonesEmail] = useState(true);
  const [notifyEscrowPush, setNotifyEscrowPush] = useState(true);
  const [notifyEscrowEmail, setNotifyEscrowEmail] = useState(true);
  const [notifyEscrowSms, setNotifyEscrowSms] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);
  const [notifyQuietHours, setNotifyQuietHours] = useState(true);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_user_name", fullName);
      localStorage.setItem("vantaged_fullName", fullName);
      localStorage.setItem("vantaged_user_email", email);
      localStorage.setItem("vantaged_email", email);
      window.dispatchEvent(new Event("storage"));
    }
    showToast("Profile details updated successfully.");
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Security and password settings saved.");
  };

  const handleSaveEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Escrow settlement bank account saved.");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Notification channel preferences updated.");
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none"
    >
      {/* ── Left Sidebar Navigation ── */}
      <SidebarNav currentActiveItem="settings" />

      {/* ── Main Workspace ── */}
      <main ref={scrollRef} className="flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5">
        {/* Top Header Bar */}
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
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

        {/* ── Simplified Settings Layout (Matching user reference) ── */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-2 pb-16">
          {/* Header row: Title + Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Settings
              </h1>
              <p className="text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1.5 font-normal">
                Manage your personal profile, security credentials, escrow banking, and alert preferences.
              </p>
            </div>

            {/* Quick Live Toast */}
            {toastMessage && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{toastMessage}</span>
              </div>
            )}
          </div>

          {/* Minimalist Tab Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]/70">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`pb-2.5 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "profile"
                  ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] font-bold"
                  : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Profile & Account
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("subscription")}
              className={`pb-2.5 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "subscription"
                  ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] font-bold"
                  : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              <span>Subscription & Capacity</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                {tierNames[currentTier]}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`pb-2.5 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "security"
                  ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] font-bold"
                  : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Security & Password
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("escrow")}
              className={`pb-2.5 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "escrow"
                  ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] font-bold"
                  : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Escrow & Banking
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`pb-2.5 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "notifications"
                  ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] font-bold"
                  : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Notifications & Alerts
            </button>
          </div>

          {/* ── TAB 1: PROFILE & ACCOUNT ── */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              {/* Card 1: Personal Details */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="px-6 py-4.5 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                  <h2 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Personal Information
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Your name and contact details across project correspondence and site manifests.
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  {/* Photo & Role Banner */}
                  <div className="flex items-center gap-4 pb-2">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
                      {(fullName || "OA")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "OA"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {fullName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[10px] font-bold">
                          {currentUser.role}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Verified Project Sponsor Account
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                        Primary Region / State
                      </label>
                      <VantagedSelect
                        value={stateRegion}
                        onChange={(val) => setStateRegion(val)}
                        className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] font-medium"
                        options={[
                          { value: "Lagos State", label: "Lagos State, Nigeria" },
                          { value: "Abuja FCT", label: "Abuja FCT, Nigeria" },
                          { value: "Rivers State", label: "Rivers State (Port Harcourt), Nigeria" },
                          { value: "Oyo State", label: "Oyo State (Ibadan), Nigeria" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Entity & Organization */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="px-6 py-4.5 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                  <h2 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Entity & Currency
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Corporate entity name and valuation currency for bills of quantities and escrow statements.
                  </p>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Entity / Holding Name
                    </label>
                    <input
                      type="text"
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Portfolio Currency
                    </label>
                    <VantagedSelect
                      value={currency}
                      onChange={(val) => setCurrency(val)}
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] font-medium"
                      options={[
                        { value: "NGN", label: "Nigerian Naira (₦ - NGN)" },
                        { value: "USD", label: "US Dollar ($ - USD)" },
                      ]}
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]/40 flex items-center justify-end">
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── TAB: SUBSCRIPTION & CAPACITY ── */}
          {activeTab === "subscription" && (
            <div className="flex flex-col gap-6">
              {/* 1. Header Overview & Slot Utilization Card */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/30 border-b border-[var(--vt-color-border-default,#E2E0EC)]/70">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          Active Subscription & Project Capacity
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{tierNames[currentTier]}</span>
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1">
                        Monitor active construction site slots, manage tier allocation, and expand capacity anytime.
                      </p>
                    </div>

                    {/* Monthly / Yearly Switcher */}
                    <div className="inline-flex items-center p-1 rounded-xl bg-[var(--vt-color-neutral-100,#ECEBF3)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold shrink-0">
                      <button
                        type="button"
                        onClick={() => setBillingCycle("monthly")}
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
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          billingCycle === "yearly"
                            ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] font-bold shadow-2xs"
                            : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                        }`}
                      >
                        <span>Yearly</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-700,#B33C08)]">
                          Save 17%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Capacity KPI Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div className="p-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                        Current Active Tier
                      </p>
                      <p className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        {tierNames[currentTier]}
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-orange-600,#D84C0B)] font-semibold mt-0.5">
                        {currentTier === "owner-private"
                          ? "₦0 Free Forever"
                          : currentTier === "owner-portfolio"
                          ? billingCycle === "monthly"
                            ? "₦65,000 / month"
                            : "₦650,000 / year"
                          : billingCycle === "monthly"
                          ? "₦200,000 / month"
                          : "₦2,000,000 / year"}
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
                        {baseSlots} plan slot{baseSlots > 1 ? "s" : ""} + {extraSlotsCount} à la carte slot{extraSlotsCount === 1 ? "" : "s"}
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
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                        <span>Active project: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Lekki Phase 1 Luxury Villa</strong> (Plot 14, Admiralty Way)</span>
                      </span>
                      <span>{Math.round((usedSlots / totalSlots) * 100)}% Capacity Utilized</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-200,#DDDCE6)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(10, (usedSlots / totalSlots) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Clear Call-to-Action to Upgrade to the Next Tier */}
              {currentTier === "owner-private" && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--vt-color-orange-50,#FFF4EE)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/50 border-2 border-[var(--vt-color-orange-400,#FBA674)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                          Recommended Next Step
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                          +2 Project Slots
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        Upgrade to Portfolio Investor Tier
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 max-w-xl">
                        Manage up to 3 active construction sites simultaneously, unlock cross-site consolidated financial rollups, and receive priority milestone escrow queue processing.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpgradeTier("owner-portfolio")}
                    className="w-full md:w-auto shrink-0 h-10 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Upgrade to Portfolio Tier (₦65,000/mo)</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              )}

              {currentTier === "owner-portfolio" && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--vt-color-orange-50,#FFF4EE)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/50 border-2 border-[var(--vt-color-orange-400,#FBA674)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                          Enterprise Scale
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                          +7 Project Slots
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                        Upgrade to Estate Developer Tier
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 max-w-xl">
                        Manage up to 10 active sites at once, assign dedicated escrow settlement managers, unlock unlimited CAD/BIM vault storage, and multi-team site dispatch.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpgradeTier("owner-estate")}
                    className="w-full md:w-auto shrink-0 h-10 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Upgrade to Estate Tier (₦200,000/mo)</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              )}

              {currentTier === "owner-estate" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Enterprise Tier Active: Estate Developer
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
                        You have 10 concurrent active project slots included. Need more? Add à la carte slots below anytime.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    10 Slots Active
                  </span>
                </div>
              )}

              {/* 3. Tiers Comparison Grid (Highlighting current tier in ORANGE) */}
              <div>
                <div className="mb-3.5">
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Subscription Tier Plans
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Your current active tier is highlighted in orange. Choose any tier to upgrade or adjust capacity.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Tier 1: Private Owner */}
                  <div
                    className={`rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                      currentTier === "owner-private"
                        ? "border-2 border-[var(--vt-color-orange-500,#EF5F18)] ring-4 ring-[var(--vt-color-orange-500,#EF5F18)]/15 bg-white shadow-md relative"
                        : "border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:border-[var(--vt-color-neutral-300,#CAC7D8)] shadow-2xs"
                    }`}
                  >
                    {/* Orange Badge Pill for Current Tier */}
                    {currentTier === "owner-private" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Current Active Tier</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                          Single-Home Builder
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-indigo-900,#261A66)]">
                          1 Project Slot
                        </span>
                      </div>

                      <h4 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-2">
                        Private Owner
                      </h4>

                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          ₦0
                        </span>
                        <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                          · Free Forever
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                        For private individuals building a personal home, duplex, or single residential villa.
                      </p>

                      <div className="w-full h-px bg-[var(--vt-color-border-default,#E2E0EC)]/70 my-4" />

                      {/* Included Features */}
                      <ul className="flex flex-col gap-2.5 text-xs text-[var(--vt-color-neutral-700,#443E63)]">
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span><strong>1 active project</strong> at a time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Bank-grade milestone escrow custody</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Daily drone & site visual telemetry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Unlimited client reps & family invites</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Verified contractor & artisan directory</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 pt-0">
                      {currentTier === "owner-private" ? (
                        <div className="w-full h-10 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-default">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-600,#D84C0B)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Current Active Plan</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpgradeTier("owner-private")}
                          className="w-full h-10 rounded-xl bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-all cursor-pointer"
                        >
                          Switch to Private Tier
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tier 2: Portfolio Investor */}
                  <div
                    className={`rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                      currentTier === "owner-portfolio"
                        ? "border-2 border-[var(--vt-color-orange-500,#EF5F18)] ring-4 ring-[var(--vt-color-orange-500,#EF5F18)]/15 bg-white shadow-md relative"
                        : "border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:border-[var(--vt-color-neutral-300,#CAC7D8)] shadow-2xs"
                    }`}
                  >
                    {/* Orange Badge Pill for Current Tier */}
                    {currentTier === "owner-portfolio" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Current Active Tier</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                          Multi-Build Portfolio
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                          3 Project Slots
                        </span>
                      </div>

                      <h4 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-2">
                        Portfolio Investor
                      </h4>

                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          {billingCycle === "monthly" ? "₦65,000" : "₦650,000"}
                        </span>
                        <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                          {billingCycle === "monthly" ? "/ month" : "/ year (2 mo free)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                        For investors building multiple residences, rentals, or family portfolios simultaneously.
                      </p>

                      <div className="w-full h-px bg-[var(--vt-color-border-default,#E2E0EC)]/70 my-4" />

                      {/* Included Features */}
                      <ul className="flex flex-col gap-2.5 text-xs text-[var(--vt-color-neutral-700,#443E63)]">
                        <li className="flex items-start gap-2 font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span><strong>Up to 3 active projects</strong> concurrently</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Everything in Private Owner</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Multi-site consolidated financial rollups</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Priority milestone escrow stage settlement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Cross-project timeline & delay alerts</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 pt-0">
                      {currentTier === "owner-portfolio" ? (
                        <div className="w-full h-10 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-default">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-600,#D84C0B)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Current Active Plan</span>
                        </div>
                      ) : currentTier === "owner-private" ? (
                        <button
                          type="button"
                          onClick={() => handleUpgradeTier("owner-portfolio")}
                          className="w-full h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span>Upgrade to Portfolio Tier</span>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpgradeTier("owner-portfolio")}
                          className="w-full h-10 rounded-xl bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-all cursor-pointer"
                        >
                          Switch to Portfolio Tier
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tier 3: Estate Developer */}
                  <div
                    className={`rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                      currentTier === "owner-estate"
                        ? "border-2 border-[var(--vt-color-orange-500,#EF5F18)] ring-4 ring-[var(--vt-color-orange-500,#EF5F18)]/15 bg-white shadow-md relative"
                        : "border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:border-[var(--vt-color-neutral-300,#CAC7D8)] shadow-2xs"
                    }`}
                  >
                    {/* Orange Badge Pill for Current Tier */}
                    {currentTier === "owner-estate" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Current Active Tier</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                          Large-Scale Portfolios
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-indigo-100,#E8E6F5)] text-[var(--vt-color-indigo-900,#261A66)]">
                          10 Project Slots
                        </span>
                      </div>

                      <h4 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-2">
                        Estate Developer
                      </h4>

                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          {billingCycle === "monthly" ? "₦200,000" : "₦2,000,000"}
                        </span>
                        <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                          {billingCycle === "monthly" ? "/ month" : "/ year (2 mo free)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                        For estate developers, institutional syndicates, and high-volume residential communities.
                      </p>

                      <div className="w-full h-px bg-[var(--vt-color-border-default,#E2E0EC)]/70 my-4" />

                      {/* Included Features */}
                      <ul className="flex flex-col gap-2.5 text-xs text-[var(--vt-color-neutral-700,#443E63)]">
                        <li className="flex items-start gap-2 font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span><strong>Up to 10 active projects</strong> concurrently</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Everything in Portfolio Investor</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Dedicated enterprise escrow officer</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Unlimited CAD/BIM vault document storage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Multi-tier permissions & site dispatch</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 pt-0">
                      {currentTier === "owner-estate" ? (
                        <div className="w-full h-10 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-default">
                          <svg className="w-4 h-4 text-[var(--vt-color-orange-600,#D84C0B)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Current Active Plan</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpgradeTier("owner-estate")}
                          className="w-full h-10 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#1B1248)] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span>Upgrade to Estate Developer</span>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. "BUY A PROJECT" SECTION (À La Carte Capacity) */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/25">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
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
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                            Buy Extra Project Slots (À La Carte Capacity)
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                            Add-on
                          </span>
                        </div>
                        <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 max-w-2xl">
                          Need an auxiliary construction slot without jumping to a higher subscription tier? Buy single project slots anytime for guest houses, gatehouse development, boundary walls, or additional properties.
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-[var(--vt-color-neutral-100,#ECEBF3)] text-right shrink-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        Add-on Pricing
                      </p>
                      <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        +₦25,000 <span className="text-[10px] font-normal text-[var(--vt-color-neutral-500,#7C7894)]">/ mo ($19.99)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form to Purchase Project Slots */}
                <form onSubmit={handleBuyProjectSlots} className="p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    {/* Quantity Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                        Number of Project Slots to Buy
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBuySlotsInput((prev) => Math.max(1, prev - 1))}
                          disabled={buySlotsInput <= 1}
                          className="w-10 h-10 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] disabled:opacity-40 disabled:hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-indigo-900,#261A66)] font-bold flex items-center justify-center transition-colors cursor-pointer"
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
                          className="w-20 h-10 text-center font-extrabold text-base rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] outline-none shadow-2xs"
                        />

                        <button
                          type="button"
                          onClick={() => setBuySlotsInput((prev) => Math.min(50, prev + 1))}
                          className="w-10 h-10 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-indigo-900,#261A66)] font-bold flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>

                        <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                          slot{buySlotsInput > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Summary Calculation */}
                    <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                      <div className="flex items-center justify-between text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                        <span>New Total Capacity:</span>
                        <strong className="text-[var(--vt-color-indigo-900,#261A66)] font-extrabold">
                          {totalSlots + buySlotsInput} concurrent projects
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1.5 pt-1.5 border-t border-[var(--vt-color-border-default,#E2E0EC)]/60">
                        <span>Monthly Add-on Rate:</span>
                        <strong className="text-[var(--vt-color-orange-600,#D84C0B)] font-extrabold">
                          +₦{(buySlotsInput * 25000).toLocaleString()} / mo
                        </strong>
                      </div>
                    </div>

                    {/* Submit Purchase Button */}
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full h-10 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        <span>
                          Buy {buySlotsInput} Project Slot{buySlotsInput > 1 ? "s" : ""}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Purchased Slots Status (if any) */}
                  {extraSlotsCount > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)]/50 border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            {extraSlotsCount} À La Carte Project Slot{extraSlotsCount > 1 ? "s" : ""} Currently Active
                          </p>
                          <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                            Billed at +₦{(extraSlotsCount * 25000).toLocaleString()} / month · Renews monthly with your subscription
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveExtraSlot}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        Release 1 Slot
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* ── TAB 2: SECURITY & PASSWORD (SH-09) ── */}
          {activeTab === "security" && (
            <form onSubmit={handleSaveSecurity} className="flex flex-col gap-5">
              {/* Card 1: Change Password */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="px-6 py-4.5 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                  <h2 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Change Password
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Ensure your account is protected with a strong, distinct password.
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]/40 flex items-center justify-end">
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Card 2: Two-Factor Authentication */}
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="p-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                      Two-Factor Authentication (2FA)
                    </h2>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 leading-relaxed max-w-xl">
                      Require an SMS OTP code or authenticator app token before escrow tranche disbursements and sensitive permission modifications.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={is2FAEnabled}
                      onChange={(e) => setIs2FAEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                      {is2FAEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>
            </form>
          )}

          {/* ── TAB 3: ESCROW & BANKING ── */}
          {activeTab === "escrow" && (
            <form onSubmit={handleSaveEscrow} className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="px-6 py-4.5 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Settlement & Refund Bank Account
                      </h2>
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Verified NUBAN commercial bank account for unspent escrow disbursements and dispute refunds.
                      </p>
                    </div>
                    {isBankVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[11px] font-bold">
                        ✓ NUBAN Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Bank Name
                    </label>
                    <VantagedSelect
                      value={bankName}
                      onChange={(val) => setBankName(val)}
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] font-medium"
                      options={[
                        { value: "Guaranty Trust Bank (GTBank)", label: "Guaranty Trust Bank (GTBank)" },
                        { value: "Zenith Bank Plc", label: "Zenith Bank Plc" },
                        { value: "Access Bank Plc", label: "Access Bank Plc" },
                        { value: "United Bank for Africa (UBA)", label: "United Bank for Africa (UBA)" },
                        { value: "First Bank of Nigeria", label: "First Bank of Nigeria" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      NUBAN Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      maxLength={10}
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Account Beneficiary Name
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]/40 flex items-center justify-end">
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Save Settlement Account
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── TAB 4: NOTIFICATIONS & ALERTS (PRD §7.18) ── */}
          {activeTab === "notifications" && (
            <form onSubmit={handleSaveNotifications} className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70 overflow-hidden">
                <div className="px-6 py-4.5 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                  <h2 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Notification Channels
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Select your preferred alert channels and notification frequency.
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-4 text-xs">
                  {/* Event 1: Milestone Reviews */}
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs sm:text-sm">
                        Stage Inspections & Proof Uploads
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Triggered whenever a contractor marks a stage ready for client sign-off.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-semibold text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyMilestonesPush}
                          onChange={(e) => setNotifyMilestonesPush(e.target.checked)}
                          className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                        />
                        Push
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyMilestonesEmail}
                          onChange={(e) => setNotifyMilestonesEmail(e.target.checked)}
                          className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                        />
                        Email
                      </label>
                    </div>
                  </div>

                  {/* Event 2: Escrow Movements */}
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs sm:text-sm">
                        Escrow Vault Deposits & Releases
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Tranche locks, contract sign-offs, and verified payouts.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-semibold text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyEscrowPush}
                          onChange={(e) => setNotifyEscrowPush(e.target.checked)}
                          className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                        />
                        Push
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyEscrowEmail}
                          onChange={(e) => setNotifyEscrowEmail(e.target.checked)}
                          className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                        />
                        Email
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifyEscrowSms}
                          onChange={(e) => setNotifyEscrowSms(e.target.checked)}
                          className="accent-[var(--vt-color-orange-500,#EF5F18)] rounded"
                        />
                        SMS
                      </label>
                    </div>
                  </div>

                  {/* Event 3: Daily Progress Digest */}
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs sm:text-sm">
                        Daily Portfolio Summary Digest
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Consolidated evening brief of all daily telemetry and site waybills.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyDailyDigest}
                      onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                      className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] rounded cursor-pointer"
                    />
                  </div>

                  {/* Event 4: Quiet Hours */}
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs sm:text-sm">
                        Quiet Hours (10:00 PM – 7:00 AM)
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Mute non-critical audio push notifications during the night.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyQuietHours}
                      onChange={(e) => setNotifyQuietHours(e.target.checked)}
                      className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]/40 flex items-center justify-end">
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
