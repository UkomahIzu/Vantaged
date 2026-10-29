"use client";

import React, { useState } from "react";
import {
  ContractorRoleType,
  contractorRoleCards,
} from "./contractorRolesData";

export function ContractorLoginPage() {
  const [selectedRole, setSelectedRole] = useState<ContractorRoleType>("DIRECTOR");
  const [email, setEmail] = useState("b.adeleke@apexstructure.ng");
  const [password, setPassword] = useState("Vantaged2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const currentRoleInfo =
    contractorRoleCards.find((r) => r.id === selectedRole) || contractorRoleCards[0];

  const handleRoleChange = (role: ContractorRoleType) => {
    setSelectedRole(role);
    const roleData = contractorRoleCards.find((r) => r.id === role);
    if (roleData) {
      setEmail(roleData.defaultEmail);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_contractor_user_email", email);
      localStorage.setItem("vantaged_contractor_user_role", currentRoleInfo.title);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsLoggedIn(true);
    }, 700);
  };

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[var(--vt-color-text-default)] select-none"
    >
      {/* ── Left Column: Vibrant Blue-to-Orange Gradient (Matching Owner Signup) ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #261A66 0%, #4D1E7B 28%, #932463 52%, #D53F21 76%, #EF5F18 100%)",
        }}
        className="vt-gradient-brand w-full lg:w-1/2 h-full max-h-screen p-5 sm:p-7 lg:p-8 xl:p-12 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden text-white shrink-0 font-sans"
      >
        {/* Top-Left: Logo & Home Link */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <a
            href="/"
            className="group flex items-center transition-opacity hover:opacity-90 font-sans"
            title="Return to Vantaged Home"
            aria-label="Vantaged home"
          >
            <img
              src="/brand/vantaged-measurement-logo.svg"
              alt="Vantaged"
              className="h-7 sm:h-8 w-auto max-w-[170px] object-contain brightness-0 invert"
            />
          </a>
        </div>

        {/* Mid Section: Dynamic Title */}
        <div className="relative z-10 my-auto py-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-2 font-sans">
            Select your role to sign in
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-lg leading-relaxed font-normal font-sans">
            Each role carries tailored site telemetry, payment authorization, and task submission permissions for verified construction builds.
          </p>
        </div>

        {/* Bottom Section: 4 Interactive Role Cards (2x2 Grid) */}
        <div className="relative z-10 pt-2 mt-3 sm:mt-4">
          <div className="grid grid-cols-2 gap-2.5">
            {contractorRoleCards.map((card) => {
              const isSelected = selectedRole === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleRoleChange(card.id)}
                  className={`relative p-3 rounded-md text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] sm:min-h-[120px] font-sans ${
                    isSelected
                      ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-[0_12px_28px_rgba(0,0,0,0.28)] scale-[1.01] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]"
                      : "bg-white/10 text-white hover:bg-white/15 hover:border-white/30 border border-white/20 backdrop-blur-md opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Top Row: Number badge + Icon */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-[11px] font-bold font-sans ${
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

                  {/* Bottom: Title & Short Tagline */}
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold tracking-tight mb-0.5 font-sans ${
                        isSelected ? "text-[var(--vt-color-indigo-900,#261A66)]" : "text-white"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`text-[10px] leading-tight line-clamp-2 font-sans ${
                        isSelected ? "text-[var(--vt-color-neutral-600,#5E5A7D)]" : "text-white/70"
                      }`}
                    >
                      {card.tagline}
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

      {/* ── Right Column: Clean & Simple Login Form (Only Email & Password) ── */}
      <div className="w-full lg:w-1/2 h-full max-h-screen overflow-y-auto bg-white font-sans flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto p-6 sm:p-8 lg:p-10 my-auto">
          {/* Form Content / Success Confirmation */}
          {isLoggedIn ? (
            <div className="p-6 rounded-xl bg-[#E9F6EC] border border-[#A3D9B1] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1F6B3E] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1F6B3E]">
                  Welcome back, {currentRoleInfo.title}
                </h3>
                <p className="text-xs text-[#2E7D4E] mt-1">
                  Authenticated as <strong>{email}</strong>. Initializing workspace...
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="h-10 px-5 text-xs font-bold rounded-md bg-[#1F6B3E] hover:bg-[#185330] text-white transition-all cursor-pointer shadow-sm"
                >
                  Return to Login Screen
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 font-sans">
              {/* Header */}
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                  Role: {currentRoleInfo.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)] mb-1 font-sans">
                  Sign In
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-sans leading-relaxed">
                  Enter your credentials to access your {currentRoleInfo.tagline.toLowerCase()} terminal.
                </p>
              </div>

              {/* 1. Email Input */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                  Email <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                </label>
                <div className="group h-11 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                  <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                  />
                </div>
              </div>

              {/* 2. Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                  Password <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
                </label>
                <div className="group h-11 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                  <svg className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#A3A0B8] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 py-2.5 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white font-bold text-xs tracking-tight shadow-[0_2px_8px_rgba(239,95,24,0.25)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.35)] active:scale-[0.99] transition-all duration-150 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? `Signing In as ${currentRoleInfo.title}...` : `Sign In as ${currentRoleInfo.title} →`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
