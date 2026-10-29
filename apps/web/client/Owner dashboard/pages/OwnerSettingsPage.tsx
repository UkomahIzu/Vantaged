"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { VantagedSelect } from "../components/VantagedSelect";

export type SettingsTab = "profile" | "security" | "escrow" | "notifications";

export function OwnerSettingsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("owner_settings");
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
