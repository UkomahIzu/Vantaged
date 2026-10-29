"use client";

import React, { useState, useEffect } from "react";

export interface TradeSignupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const TRADE_CATEGORIES = [
  "Plumbing & Pipefitting",
  "Electrical Installation & Wiring",
  "Masons, Brickwork & Plastering",
  "Carpentry, Joinery & Roofing",
  "Tiling & Floor Finishes",
  "Painting & POP Ceiling",
  "Welding & Metal Fabrication",
  "Aluminum Windows & Glazing",
  "General Minor Renovations & Handyman",
];

const NIGERIAN_BANKS = [
  "Zenith Bank",
  "Access Bank",
  "Guaranty Trust Bank (GTBank)",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Stanbic IBTC Bank",
  "Fidelity Bank",
  "Sterling Bank",
  "Union Bank",
  "FCMB",
  "Wema Bank",
  "Ecobank Nigeria",
];

export function openTradeSignupModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vantaged:open-trade-signup"));
  }
}

export function TradeSignupModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: TradeSignupModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    tradeName: "",
    tradeCategory: TRADE_CATEGORIES[0],
    email: "",
    phone: "",
    state: "Lagos",
    idType: "NIN" as "NIN" | "VOTERS_CARD" | "DRIVERS_LICENSE",
    idNumber: "",
    bankName: NIGERIAN_BANKS[0],
    accountNumber: "",
    accountName: "",
    agreedToTerms: false,
  });

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    const handleOpen = () => {
      setInternalIsOpen(true);
      setStep(1);
      setErrorMsg(null);
      setSuccessData(null);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("vantaged:open-trade-signup", handleOpen);
      return () => window.removeEventListener("vantaged:open-trade-signup", handleOpen);
    }
  }, []);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.accountNumber) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMsg("Please accept the single-project limit and ₦10M cap agreement.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contractors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isTradeTier: true,
          companyName: formData.tradeName.trim() || `${formData.fullName.trim()} (Independent Artisan)`,
          directorName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          state: formData.state,
          category: formData.tradeCategory,
          idType: formData.idType,
          idNumber: formData.idNumber.trim(),
          bankName: formData.bankName,
          accountNumber: formData.accountNumber.trim(),
          accountName: formData.accountName.trim() || formData.fullName.trim(),
          selectedPlan: "trade",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit trade registration");
      }

      setSuccessData(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white dark:bg-[#1C1642] rounded-2xl border border-[#E2E0EC] dark:border-[#2C2460] shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E0EC] dark:border-[#2C2460] flex items-start justify-between bg-[#F7F7FA] dark:bg-[#150F33]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF4EE] dark:bg-[#3D1E10] text-[#D84C0B] dark:text-[#FDCAA9] border border-[#FDCAA9] dark:border-[#8E320A]">
                Independent Trade Tier
              </span>
              <span className="text-[11px] text-[#7C7894] dark:text-[#918ADA]">
                No Corporate CAC / COREN Required
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-[#261A66] dark:text-white tracking-tight">
              Artisan &amp; Trade Contractor Signup
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7C7894] hover:text-[#261A66] dark:hover:text-white hover:bg-[#E2E0EC] dark:hover:bg-[#2C2460] transition-colors cursor-pointer font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          {successData ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center text-2xl font-bold">
                ✓
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#261A66] dark:text-white">
                  Trade Registration Successful!
                </h3>
                <p className="text-xs text-[#5E5A7D] dark:text-[#B8B1E9] mt-1 max-w-sm mx-auto">
                  Your profile has been created under the <strong>Independent Trade Tier</strong>. You are authorized to accept 1 active construction contract at a time capped under ₦10,000,000.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F7FA] dark:bg-[#150F33] border border-[#E2E0EC] dark:border-[#2C2460] text-left space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#7C7894]">Reference No:</span>
                  <span className="font-bold text-[#261A66] dark:text-white">{successData.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C7894]">Capacity Limit:</span>
                  <span className="font-bold text-[#D84C0B]">1 Active Project (Max ₦10M)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C7894]">Status:</span>
                  <span className="font-bold text-emerald-600">Active Trade Member</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/contractor/login"
                  className="w-full h-10 rounded-lg bg-[#261A66] dark:bg-[#EF5F18] hover:bg-[#EF5F18] dark:hover:bg-[#D84C0B] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Go to Contractor Terminal</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          ) : (
            /* Form Steps */
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-3.5">
                  <div className="pb-2 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#7C7894] dark:text-[#918ADA]">
                      Step 1 of 2 · Trade &amp; Personal Info
                    </span>
                    <p className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9]">
                      Tell us about your trade specialty and contact details.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                      Full Name (Lead Artisan) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Adebayo Emmanuel Olawale"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none focus:border-[#EF5F18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                      Trade / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.tradeName}
                      onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                      placeholder="e.g. Olawale Plumbing &amp; Sanitary Works"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none focus:border-[#EF5F18]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        Primary Trade Category *
                      </label>
                      <select
                        value={formData.tradeCategory}
                        onChange={(e) => setFormData({ ...formData, tradeCategory: e.target.value })}
                        className="w-full h-9 px-2.5 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none focus:border-[#EF5F18]"
                      >
                        {TRADE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        Operating State *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Lagos, Abuja, Rivers"
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none focus:border-[#EF5F18]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 803 000 0000"
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.fullName || !formData.email || !formData.phone) {
                          setErrorMsg("Please fill in your name, email, and phone number.");
                          return;
                        }
                        setErrorMsg(null);
                        setStep(2);
                      }}
                      className="h-9 px-5 rounded-lg bg-[#261A66] hover:bg-[#EF5F18] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                    >
                      <span>Continue to Escrow Payout Bank</span>
                      <span> &rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3.5">
                  <div className="pb-2 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#7C7894] dark:text-[#918ADA]">
                      Step 2 of 2 · Payout Account &amp; Identity
                    </span>
                    <p className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9]">
                      Bank account where milestone escrow funds will be disbursed automatically upon client approval.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        Personal ID Type
                      </label>
                      <select
                        value={formData.idType}
                        onChange={(e) => setFormData({ ...formData, idType: e.target.value as any })}
                        className="w-full h-9 px-2.5 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none"
                      >
                        <option value="NIN">National Identity (NIN)</option>
                        <option value="VOTERS_CARD">Voter's Card</option>
                        <option value="DRIVERS_LICENSE">Driver's License</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        ID Number (e.g. 11-digit NIN)
                      </label>
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        placeholder="e.g. 19283746501"
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        Settlement Bank *
                      </label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full h-9 px-2.5 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none"
                      >
                        {NIGERIAN_BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                        NUBAN Account Number (10 digits) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        placeholder="0123456789"
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs font-mono font-bold text-[#261A66] dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A66] dark:text-white mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      placeholder="Name as registered on your bank account"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs text-[#261A66] dark:text-white outline-none"
                    />
                  </div>

                  {/* Operational Terms */}
                  <div className="p-3 rounded-lg bg-[#FFF4EE] dark:bg-[#3D1E10] border border-[#FDCAA9] dark:border-[#8E320A] text-[#932F04] dark:text-[#FDCAA9] text-[11px] leading-relaxed">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                        className="mt-0.5"
                      />
                      <span>
                        I understand this Trade Tier is strictly capped at <strong>1 active project at a time</strong> for contracts under <strong>₦10,000,000</strong>. Full corporate CAC Limited and COREN certifications are required to unlock multiple build slots and larger contracts.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-9 px-4 rounded-lg border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#150F33] text-xs font-bold text-[#5E5A7D] hover:bg-[#F7F7FA] transition-all cursor-pointer"
                    >
                      &larr; Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-9 px-5 rounded-lg bg-[#EF5F18] hover:bg-[#D84C0B] text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Registering..." : "Complete Trade Registration ✓"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

