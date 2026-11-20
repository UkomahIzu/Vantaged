"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useOwnerSubscription } from "../hooks/useOwnerSubscription";

interface OwnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectsCount?: number;
}

export function OwnerProfileModal({
  isOpen,
  onClose,
  activeProjectsCount = 0,
}: OwnerProfileModalProps) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const subscription = useOwnerSubscription(activeProjectsCount);

  // Form states
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("+234 803 456 7890");
  const [stateRegion, setStateRegion] = useState("Lagos State (Ikoyi / Lekki Corridor)");
  const [entityName, setEntityName] = useState("Robinson Prime Holdings Ltd");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("vantaged_user_name") || localStorage.getItem("vantaged_fullName");
      const storedEmail = localStorage.getItem("vantaged_user_email") || localStorage.getItem("vantaged_email");
      const storedPhone = localStorage.getItem("vantaged_user_phone");
      const storedState = localStorage.getItem("vantaged_owner_state");
      const storedEntity = localStorage.getItem("vantaged_owner_entity");

      if (storedName) setFullName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
      if (storedState) setStateRegion(storedState);
      if (storedEntity) setEntityName(storedEntity);
    }
  }, [isOpen, currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_user_name", fullName);
      localStorage.setItem("vantaged_fullName", fullName);
      localStorage.setItem("vantaged_user_email", email);
      localStorage.setItem("vantaged_email", email);
      localStorage.setItem("vantaged_user_phone", phone);
      localStorage.setItem("vantaged_owner_state", stateRegion);
      localStorage.setItem("vantaged_owner_entity", entityName);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("vantaged_storage_update"));
    }
    setIsEditing(false);
    showToast("Profile details updated successfully!");
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs font-sans select-none animate-in fade-in-50 duration-150"
    >
      <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-60 bg-[var(--vt-color-indigo-900,#261A66)] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-[var(--vt-color-indigo-700,#43379A)] flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start justify-between gap-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"
                alt={fullName}
                className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] ring-2 ring-white"
                title="Active Session"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  PROPERTY OWNER
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  NIN Verified
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                {fullName}
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
                {email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-[var(--vt-color-text-default,#261A66)]">
          {/* Subscription & Capacity Card */}
          <div className="p-4 rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] bg-[var(--vt-color-orange-50,#FFF4EE)]/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                  Subscription & Capacity
                </span>
                <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {subscription.tierName}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] shadow-2xs">
                {subscription.priceMonthlyUSD === "$0" ? "Free Forever" : `${subscription.priceMonthlyUSD} / mo`}
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                <span>Active Project Slots:</span>
                <span className="font-mono text-[var(--vt-color-orange-600,#D84C0B)]">
                  {activeProjectsCount} of {subscription.totalSlots} Slots Used
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white border border-[var(--vt-color-orange-200,#FDCAA9)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activeProjectsCount >= subscription.totalSlots
                      ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(100, subscription.totalSlots > 0 ? (activeProjectsCount / subscription.totalSlots) * 100 : 0)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                {subscription.tierId === "owner-private" ? (
                  <>
                    The <strong>Private Owner</strong> starter tier includes <strong>1 active project</strong> at a time with 100% bank escrow custody and daily site visual telemetry.
                  </>
                ) : (
                  <>
                    Your <strong>{subscription.tierName}</strong> plan supports up to <strong>{subscription.totalSlots} concurrent active projects</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--vt-color-orange-200,#FDCAA9)]/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--vt-color-orange-800,#8F320D)]">
                {activeProjectsCount >= subscription.totalSlots
                  ? "At slot capacity limit"
                  : `${subscription.totalSlots - activeProjectsCount} slot available to start new build`}
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/owner/settings?tab=subscription");
                }}
                className="px-3 py-1.5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>Upgrade / Add Slots</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Profile Details (View or Edit mode) */}
          <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-[var(--vt-color-indigo-900,#261A66)]">
                Owner Identity & Contact
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
              >
                {isEditing ? "Cancel" : "Edit Details"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] outline-none text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] outline-none text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] outline-none text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] mb-1">
                      Primary Location / State
                    </label>
                    <input
                      type="text"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] outline-none text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-mono">
                    Full Name
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {fullName}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-mono">
                    Email Address
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 truncate">
                    {email}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-mono">
                    Phone / WhatsApp
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {phone}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-mono">
                    State / Region
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {stateRegion}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Escrow Settlement Banking */}
          <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-[var(--vt-color-indigo-900,#261A66)] border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-2">
              Escrow Custody & Banking
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-mono">
                  Settlement Bank
                </span>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  Guaranty Trust Bank (GTBank)
                </p>
                <p className="font-mono text-[11px] text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                  •••• •••• 4912
                </p>
              </div>
              <div>
                <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-mono">
                  Sign-Off Security
                </span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <span>✓ 2FA Biometric &amp; SMS Pin Active</span>
                </p>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Funds released only upon explicit milestone sign-off
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3">
          <Link
            href="/owner/settings"
            onClick={onClose}
            className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Open Full Settings</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

