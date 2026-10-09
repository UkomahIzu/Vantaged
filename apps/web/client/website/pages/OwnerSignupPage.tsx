"use client";

import React, { useState, useRef, useEffect } from "react";

export type OwnerRoleType = "OWNER_ADMIN" | "ORGANIZATION" | "OWNER_REP";

interface RoleCardData {
  id: OwnerRoleType;
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
}

const roleCards: RoleCardData[] = [
  {
    id: "OWNER_ADMIN",
    stepNumber: 1,
    title: "Owner Admin",
    tagline: "Primary Site Owner",
    description: "You are the main owner of the site funding and controlling the build.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <circle cx="12" cy="11" r="2.5" />
        <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
      </svg>
    ),
  },
  {
    id: "ORGANIZATION",
    stepNumber: 2,
    title: "Organization",
    tagline: "Institutions & Developers",
    description: "Corporates, ministries & developers managing one or multiple builds under early access.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16" />
        <path d="M6 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18" />
        <path d="M14 22V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v13" />
        <path d="M9 6h2" />
        <path d="M9 10h2" />
        <path d="M9 14h2" />
      </svg>
    ),
  },
  {
    id: "OWNER_REP",
    stepNumber: 3,
    title: "Owner Representative",
    tagline: "Client Rep & Trusted Proxy",
    description: "Oversee and verify builds on the owner's behalf (diaspora family proxy, project manager, or clerk of works).",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    ),
  },
];

const countryList = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria (+234)" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom (+44)" },
  { code: "+1", flag: "🇺🇸", name: "United States / Canada (+1)" },
  { code: "+233", flag: "🇬🇭", name: "Ghana (+233)" },
  { code: "+49", flag: "🇩🇪", name: "Germany (+49)" },
  { code: "+33", flag: "🇫🇷", name: "France (+33)" },
  { code: "+27", flag: "🇿🇦", name: "South Africa (+27)" },
];

interface CustomDropdownOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  options: CustomDropdownOption[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

function CustomSelect({ label, value, options, onChange, icon }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="flex flex-col gap-1.5 relative font-sans" ref={containerRef}>
      <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
        {label} <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`group h-12 sm:h-13 px-3.5 bg-[#F7F8FA] border rounded-md flex items-center justify-between text-left transition-all cursor-pointer font-sans shadow-2xs ${
          open
            ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-white ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15 shadow-xs"
            : "border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7]"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && (
            <span className={`shrink-0 transition-colors ${open ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[#A3A0B8] group-hover:text-[#7C7894]"}`}>
              {icon}
            </span>
          )}
          <span className="text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] truncate font-sans">
            {selectedOption?.label || value}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-[#7C7894] shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-[var(--vt-color-orange-500,#EF5F18)]" : "group-hover:text-[var(--vt-color-indigo-900,#261A66)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E0EC] rounded-md shadow-[0_16px_36px_-6px_rgba(38,26,102,0.16)] p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isCurrent = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md text-left flex items-center justify-between transition-colors cursor-pointer font-sans ${
                  isCurrent
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] font-semibold"
                    : "text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[#F7F7FA] font-medium"
                }`}
              >
                <span>{opt.label}</span>
                {isCurrent && (
                  <svg className="h-4 w-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OwnerSignupPage() {
  const [selectedRole, setSelectedRole] = useState<OwnerRoleType>("OWNER_ADMIN");
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Role-specific fields
  // Owner Admin specific (ID verification only):
  const [idMethod, setIdMethod] = useState<"NIN" | "PASSPORT">("NIN");
  const [idNumber, setIdNumber] = useState("");

  const handleIdMethodChange = (method: "NIN" | "PASSPORT") => {
    setIdMethod(method);
    setIdNumber("");
  };

  // Organization specific:
  const [orgName, setOrgName] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [orgType, setOrgType] = useState("Private Real Estate Developer");
  const [projectVolume, setProjectVolume] = useState("1 - 3 Active Projects");

  // Owner Representative specific (Link Code only):
  const [ownerInviteCode, setOwnerInviteCode] = useState("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const currentRoleInfo = roleCards.find((r) => r.id === selectedRole) || roleCards[0];
  const selectedCountry = countryList.find((c) => c.code === countryCode) || countryList[0];

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[var(--vt-color-text-default)] select-none"
    >
      {/* ── Left Column: Vibrant Blue-to-Orange Gradient (No Grid, No Gray Dead Zone) ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #261A66 0%, #4D1E7B 28%, #932463 52%, #D53F21 76%, #EF5F18 100%)",
        }}
        className="vt-gradient-brand w-full lg:w-1/2 h-full max-h-screen p-6 sm:p-8 lg:p-10 xl:p-14 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden text-white shrink-0 font-sans"
      >
        {/* Top-Left: Logo & Home Link */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <a
            href="/"
            className="group flex items-baseline font-bold text-2xl tracking-tight text-white transition-opacity hover:opacity-90 font-sans"
            title="Return to Vantaged Home"
          >
            <span>vantaged</span>
            <span className="text-[var(--vt-color-orange-500,#EF5F18)] text-2xl font-black transition-transform duration-300 group-hover:scale-125">
              .
            </span>
            <span className="text-[9px] font-normal align-top ml-0.5 text-white/60">
              ®
            </span>
          </a>
        </div>

        {/* Mid Section: Tagline & Dynamic Title */}
        <div className="relative z-10 my-auto py-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 border border-white/20 text-xs font-medium text-white mb-3 backdrop-blur-sm shadow-xs font-sans">
            <span>Owner Portal</span>
            <span>·</span>
            <span className="text-[var(--vt-color-orange-300,#FBA674)] font-semibold">Verified Escrow</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-2.5 font-sans">
            Select your role as an owner
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-md leading-relaxed font-normal font-sans">
            Choose your administrative tier to configure inspection rights, tamper-proof milestone telemetry, and stage payment approvals.
          </p>
        </div>

        {/* Bottom Section: 3 Square Interactive Role Cards (Matching Landing Page rounded-md) */}
        <div className="relative z-10 pt-2 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roleCards.map((card) => {
              const isSelected = selectedRole === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedRole(card.id)}
                  className={`relative p-3.5 sm:p-4 rounded-md text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] sm:min-h-[140px] font-sans ${
                    isSelected
                      ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-[0_12px_28px_rgba(0,0,0,0.28)] scale-[1.02] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]"
                      : "bg-white/10 text-white hover:bg-white/15 hover:border-white/30 border border-white/20 backdrop-blur-md opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Top Row: Number badge + Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold font-sans ${
                        isSelected
                          ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {card.stepNumber}
                    </span>
                    <span className={isSelected ? "text-[var(--vt-color-orange-600,#D84C0B)]" : "text-white/80"}>
                      {card.icon}
                    </span>
                  </div>

                  {/* Bottom: Title & Short Description */}
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold tracking-tight mb-1 font-sans ${
                        isSelected ? "text-[var(--vt-color-indigo-900,#261A66)]" : "text-white"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`text-[10px] leading-tight line-clamp-3 font-sans ${
                        isSelected ? "text-[var(--vt-color-neutral-600,#5E5A7D)]" : "text-white/70"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Active Indicator dot */}
                  {isSelected && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right Column: Dynamic Form Fields (Scroll-Safe Centering, Top Never Clipped) ── */}
      <div className="w-full lg:w-1/2 h-full max-h-screen overflow-y-auto bg-white font-sans">
        <div className="min-h-full w-full flex flex-col justify-start items-center px-6 sm:px-10 lg:px-12 pt-12 sm:pt-16 pb-12 sm:pb-16">
          <div className="w-full max-w-lg my-auto">
            {isSubmitted ? (
              <div className="my-auto py-12 text-center max-w-md mx-auto font-sans">
                <div className="h-16 w-16 mx-auto mb-4 rounded-md bg-[var(--vt-color-green-100,#CBEBD3)] text-[var(--vt-color-green-700,#1F6B3E)] flex items-center justify-center">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-2 font-sans">
                  Verification Code Sent
                </h2>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mb-6 leading-relaxed font-sans">
                  We sent a one-time OTP code to <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{countryCode} {phoneNumber}</strong> and <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{email}</strong> to verify your <strong className="text-[var(--vt-color-orange-600,#D84C0B)]">{currentRoleInfo.title}</strong> account.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/owner/dashboard"
                    className="w-full sm:w-auto h-11 px-6 text-xs font-bold rounded-md text-white bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] transition-all cursor-pointer font-sans shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Owner Dashboard</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full sm:w-auto h-11 px-6 text-xs font-semibold rounded-md text-[var(--vt-color-indigo-900,#261A66)] bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] transition-colors cursor-pointer font-sans"
                  >
                    ← Back to Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-4.5 font-sans">
                {/* Header with Generous Breathing Room */}
                <div className="mb-2 sm:mb-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)] mb-1.5 font-sans">
                    Join Us
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] font-sans leading-relaxed">
                    Enter your credentials and specific role parameters to initialize project access.
                  </p>
                </div>

                {/* 1. Full Name Input Bar (Swapped to Top Full-Width Position) */}
                <div className="flex flex-col gap-1.5 mt-3 sm:mt-5">
                  <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                    Full Name <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                  </label>
                  <div className="group h-12 sm:h-13 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                    <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      required
                      value={fullName}
                      maxLength={50}
                      onChange={(e) => {
                        // Strict validation: letters, spaces, hyphens and apostrophes only, max 50 chars
                        const sanitized = e.target.value.replace(/[^a-zA-Z\s\-']/g, "").slice(0, 50);
                        setFullName(sanitized);
                      }}
                      placeholder="e.g. Adaeze Okonkwo"
                      className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                    />
                  </div>
                </div>

                {/* 2. Phone Number & Email Address (Two-Column Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* Phone Number with Custom Country Picker (Strict Digits Only, Max 11) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                      Phone number <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                    </label>
                    <div className="group h-12 sm:h-13 px-3 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs relative">
                      {/* Custom Country Dropdown Trigger */}
                      <div className="relative shrink-0" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-black/5 transition-colors cursor-pointer text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
                          <span>{selectedCountry.code}</span>
                          <svg
                            className={`h-3 w-3 text-[#7C7894] transition-transform duration-200 ${countryDropdownOpen ? "rotate-180 text-[var(--vt-color-orange-500,#EF5F18)]" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>

                        {/* Floating Country List Popover */}
                        {countryDropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E2E0EC] rounded-md shadow-[0_16px_36px_-6px_rgba(38,26,102,0.16)] p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans max-h-60 overflow-y-auto">
                            {countryList.map((c) => {
                              const isCurrent = c.code === countryCode;
                              return (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setCountryCode(c.code);
                                    setCountryDropdownOpen(false);
                                  }}
                                  className={`w-full px-2.5 py-2 text-xs font-medium rounded-md text-left flex items-center justify-between transition-colors cursor-pointer font-sans ${
                                    isCurrent
                                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] font-semibold"
                                      : "text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[#F7F7FA]"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-base">{c.flag}</span>
                                    <span>{c.name}</span>
                                  </span>
                                  {isCurrent && (
                                    <svg className="h-3.5 w-3.5 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Subtle Divider */}
                      <div className="h-6 w-px bg-[#E2E0EC] mx-2 shrink-0" />

                      {/* Phone Input - Digits Only, Max 11 digits */}
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        value={phoneNumber}
                        maxLength={11}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/\D/g, "").slice(0, 11);
                          setPhoneNumber(sanitized);
                        }}
                        placeholder="801 234 5678"
                        className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                      Email Address <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                    </label>
                    <div className="group h-12 sm:h-13 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center justify-between gap-2 transition-all shadow-2xs">
                      <div className="flex items-center min-w-0 w-full mr-2">
                        <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value.trim())}
                          placeholder="ada@example.com"
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                        />
                      </div>
                      {email.includes("@") && email.includes(".") && (
                        <span className="text-[#2E9E57] shrink-0" title="Valid email format">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Password Input Bar (with lock icon & toggle) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                    Password <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                  </label>
                  <div className="group h-12 sm:h-13 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center justify-between gap-2 transition-all shadow-2xs">
                    <div className="flex items-center min-w-0 w-full mr-2">
                      <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#7C7894] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors p-1 cursor-pointer shrink-0"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#7C7894] leading-tight font-sans mt-0.5">
                    At least 12 characters. Uppercase letters, lowercase letters, numbers, and symbols.
                  </p>
                </div>

                {/* ── 4. DYNAMIC ROLE-SPECIFIC FIELDS (Clean, Custom Segmented Control & Dropdowns) ── */}
                <div className="p-4 rounded-md bg-[#F7F8FA] border border-[#E2E0EC] flex flex-col gap-3.5 transition-all duration-200 font-sans shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#E2E0EC] pb-2">
                    <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                      {selectedRole === "OWNER_ADMIN" && "Identity Verification"}
                      {selectedRole === "ORGANIZATION" && "Organization Details"}
                      {selectedRole === "OWNER_REP" && "Client Rep Link Code"}
                    </span>
                  </div>

                  {/* ROLE 1: OWNER ADMIN (Segmented Control + Strict NIN / Passport Validation) */}
                  {selectedRole === "OWNER_ADMIN" && (
                    <div className="flex flex-col gap-3.5 font-sans">
                      {/* Premium Segmented Pill Control */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                          Verification Document Type <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                        </label>
                        <div className="p-1 bg-[#EEF0F5] border border-[#E2E0EC] rounded-md grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            onClick={() => handleIdMethodChange("NIN")}
                            className={`h-10 text-xs font-semibold rounded-md transition-all cursor-pointer font-sans flex items-center justify-center gap-2 ${
                              idMethod === "NIN"
                                ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                                : "text-[var(--vt-color-neutral-700,#46425F)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-white/60"
                            }`}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="18" height="13" x="3" y="6" rx="2" />
                              <circle cx="8" cy="12" r="2" />
                              <path d="M13 11h4M13 14h2" />
                            </svg>
                            <span>NIN (11 Digits)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIdMethodChange("PASSPORT")}
                            className={`h-10 text-xs font-semibold rounded-md transition-all cursor-pointer font-sans flex items-center justify-center gap-2 ${
                              idMethod === "PASSPORT"
                                ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                                : "text-[var(--vt-color-neutral-700,#46425F)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-white/60"
                            }`}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4" />
                              <circle cx="12" cy="11" r="3" />
                              <path d="m8 18 8-2" />
                            </svg>
                            <span>Int'l Passport</span>
                          </button>
                        </div>
                      </div>

                      {/* ID Number Bar with Strict Character & Length Constraints */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                            {idMethod === "NIN" ? "NIN Number" : "Passport Document Number"} <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                          </label>
                          <span className="text-[11px] font-medium text-[#7C7894] font-sans">
                            {idMethod === "NIN" ? `${idNumber.length}/11 digits` : `${idNumber.length}/9 characters`}
                          </span>
                        </div>
                        <div className="group h-12 sm:h-13 px-3.5 bg-white border border-[#E2E0EC] hover:border-[#CBC8DA] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                          <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                            <circle cx="6" cy="14" r="1" />
                          </svg>
                          <input
                            type="text"
                            inputMode={idMethod === "NIN" ? "numeric" : "text"}
                            required
                            value={idNumber}
                            maxLength={idMethod === "NIN" ? 11 : 9}
                            onChange={(e) => {
                              if (idMethod === "NIN") {
                                // Strictly numeric digits only, capped at exactly 11 characters
                                const sanitized = e.target.value.replace(/\D/g, "").slice(0, 11);
                                setIdNumber(sanitized);
                              } else {
                                // Strictly 9 alphanumeric uppercase characters for Passport
                                const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 9);
                                setIdNumber(sanitized);
                              }
                            }}
                            placeholder={idMethod === "NIN" ? "11-digit NIN (e.g. 12345678901)" : "e.g. A12345678"}
                            className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans tracking-wider"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROLE 2: ORGANIZATION (Custom Dropdowns + Styled Bars) */}
                  {selectedRole === "ORGANIZATION" && (
                    <div className="flex flex-col gap-3.5 font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                            Entity Registered Name <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                          </label>
                          <div className="group h-12 sm:h-13 px-3.5 bg-white border border-[#E2E0EC] hover:border-[#CBC8DA] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                            <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="16" height="20" x="4" y="2" rx="2" />
                              <path d="M9 22v-4h6v4" />
                              <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
                            </svg>
                            <input
                              type="text"
                              required
                              value={orgName}
                              maxLength={80}
                              onChange={(e) => setOrgName(e.target.value.slice(0, 80))}
                              placeholder="e.g. Haven Developments Ltd"
                              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                            CAC / RC Number <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                          </label>
                          <div className="group h-12 sm:h-13 px-3.5 bg-white border border-[#E2E0EC] hover:border-[#CBC8DA] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                            <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="4" x2="20" y1="9" y2="9" />
                              <line x1="4" x2="20" y1="15" y2="15" />
                              <line x1="10" x2="8" y1="3" y2="21" />
                              <line x1="16" x2="14" y1="3" y2="21" />
                            </svg>
                            <input
                              type="text"
                              required
                              value={rcNumber}
                              maxLength={14}
                              onChange={(e) => {
                                // Uppercase alphanumeric and hyphen only, max 14
                                const sanitized = e.target.value.replace(/[^a-zA-Z0-9\-]/g, "").toUpperCase().slice(0, 14);
                                setRcNumber(sanitized);
                              }}
                              placeholder="RC-1234567"
                              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans tracking-wider"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                        {/* Custom Organization Type Dropdown */}
                        <CustomSelect
                          label="Organization Type"
                          value={orgType}
                          onChange={setOrgType}
                          options={[
                            { value: "Private Real Estate Developer", label: "Private Real Estate Developer" },
                            { value: "Government Ministry / Agency", label: "Government Ministry / Agency" },
                            { value: "Commercial Infrastructure Firm", label: "Commercial Infrastructure Firm" },
                            { value: "Family Office / Institutional Trust", label: "Family Office / Institutional Trust" },
                          ]}
                          icon={
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 21h18" />
                              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                            </svg>
                          }
                        />

                        {/* Custom Portfolio Volume Dropdown */}
                        <CustomSelect
                          label="Portfolio Volume"
                          value={projectVolume}
                          onChange={setProjectVolume}
                          options={[
                            { value: "1 - 3 Active Projects", label: "1 - 3 Projects (Early Access)" },
                            { value: "4 - 10 Multi-Site Projects", label: "4 - 10 Multi-Site Projects" },
                            { value: "10+ Enterprise Scale Builds", label: "10+ Enterprise Scale Builds" },
                          ]}
                          icon={
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* ROLE 3: OWNER REPRESENTATIVE (Client Rep Link Code Only) */}
                  {selectedRole === "OWNER_REP" && (
                    <div className="flex flex-col gap-3 font-sans">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                          Link Code <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                        </label>
                        <div className="group h-12 sm:h-13 px-3.5 bg-white border border-[#E2E0EC] hover:border-[#CBC8DA] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                          <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
                          </svg>
                          <input
                            type="text"
                            required
                            value={ownerInviteCode}
                            maxLength={20}
                            onChange={(e) => {
                              // Alphanumeric uppercase and hyphen, max 20
                              const sanitized = e.target.value.replace(/[^a-zA-Z0-9\-]/g, "").toUpperCase().slice(0, 20);
                              setOwnerInviteCode(sanitized);
                            }}
                            placeholder="e.g. REP-8924-XK"
                            className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans tracking-wider"
                          />
                        </div>
                        <p className="text-[11px] text-[#7C7894] font-sans">
                          Client Reps can only join with a link code from their Client Admin. Ask your site owner for your link code.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button (Longer/Taller height matching reference, rounded-md matching landing page) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-13 py-3.5 px-6 rounded-md font-bold text-sm sm:text-base text-white bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] shadow-[0_4px_16px_rgba(239,95,24,0.28)] hover:shadow-[0_6px_22px_rgba(239,95,24,0.38)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center tracking-tight disabled:opacity-50 mt-1 font-sans"
                >
                  {isSubmitting ? "Creating Account..." : `Continue as ${currentRoleInfo.title}`}
                </button>

                {/* Already have an account */}
                <div className="text-center text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] font-sans">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] underline"
                  >
                    Log in
                  </a>
                </div>

                {/* Divider Or */}
                <div className="relative flex items-center justify-center my-0.5">
                  <span className="absolute inset-x-0 h-px bg-[var(--vt-color-neutral-200,#E2E0EC)]" />
                  <span className="relative bg-white px-3 text-xs font-medium text-[var(--vt-color-neutral-400,#A3A0B8)] font-sans">
                    Or
                  </span>
                </div>

                {/* Google SSO Button (Longer/Taller height, rounded-md matching landing page) */}
                <button
                  type="button"
                  className="w-full h-12 sm:h-13 py-3.5 px-6 rounded-md border border-[var(--vt-color-neutral-200,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] font-semibold text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs font-sans"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                {/* Disclaimer */}
                <p className="text-[10px] text-center text-[var(--vt-color-neutral-400,#A3A0B8)] leading-normal mt-0.5 font-sans">
                  By signing up, I confirm that I have read and agree to Vantaged's{" "}
                  <a href="#terms" className="underline hover:text-[var(--vt-color-indigo-900,#261A66)]">
                    Privacy Policy and Terms of Service
                  </a>
                  . Protected under NDPA data privacy standards.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
