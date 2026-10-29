"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth, PRESET_ADMINS } from "../../context/AdminAuthContext";
import { AdminRole } from "../../types/admin";
import { IconShield, IconExternalLink } from "../../components/AdminIcons";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, quickLoginAs } = useAdminAuth();

  const [selectedRole, setSelectedRole] = useState<AdminRole>("SUPER_ADMIN");
  const [email, setEmail] = useState<string>(PRESET_ADMINS.SUPER_ADMIN.email);
  const [password, setPassword] = useState<string>("VantagedAdmin2026!");
  const [otpCode, setOtpCode] = useState<string>("749 201");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: AdminRole) => {
    setSelectedRole(role);
    setEmail(PRESET_ADMINS[role].email);
    setPassword("VantagedAdmin2026!");
    setOtpCode("749 201");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Authentication failed. Please verify your admin credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevQuickLaunch = (role: AdminRole) => {
    quickLoginAs(role);
    router.push("/");
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="min-h-screen flex flex-col justify-between bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] px-4 py-8 relative overflow-hidden select-none font-sans"
    >
      {/* Decorative background vector waves matching the Owner Dashboard */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 200 C 300 100, 600 450, 1500 100"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M-50 750 C 400 650, 800 850, 1550 650"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="1380" cy="550" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.6" />
          <circle cx="80" cy="650" r="4" fill="var(--vt-color-green-500,#2E9E57)" fillOpacity="0.6" />
        </svg>
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img
            src="/brand/vantaged-measurement-logo.svg"
            alt="Vantaged"
            className="h-8.5 w-auto max-w-[175px] object-contain"
          />
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] shadow-2xs">
            PORT 3001
          </span>
        </div>
      </div>

      {/* Main Authentication Terminal Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <div className="rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-7 sm:p-8 shadow-[0_16px_40px_rgba(38,26,102,0.08)]">
          {/* Card Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-600,#D84C0B)]">
              <IconShield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">Operations Console Login</h1>
            <p className="mt-1 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
              Authorized Vantaged personnel only. All access and audits are recorded.
            </p>
          </div>

          {/* Quick Role Preset Selector */}
          <div className="mb-5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold mb-2">
              Select Admin Role Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PRESET_ADMINS) as AdminRole[]).map((r) => {
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`flex flex-col text-left px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--vt-color-orange-400,#F78241)] bg-[var(--vt-color-orange-50,#FFF4EE)] shadow-2xs ring-1 ring-[var(--vt-color-orange-500,#EF5F18)]"
                        : "border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white"
                    }`}
                  >
                    <span className={`font-bold truncate text-[11px] ${isSelected ? "text-[var(--vt-color-orange-700,#B33C08)]" : "text-[var(--vt-color-indigo-900,#261A66)]"}`}>
                      {r.replace("_", " ")}
                    </span>
                    <span className={`text-[10px] truncate ${isSelected ? "text-[var(--vt-color-orange-600,#D84C0B)]" : "text-[var(--vt-color-neutral-500,#7C7894)]"}`}>
                      {PRESET_ADMINS[r].name.split(" ")[0]} ({PRESET_ADMINS[r].securityLevel.split("·")[0].trim()})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs text-[var(--vt-color-text-default,#261A66)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Security Passcode
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs text-[var(--vt-color-text-default,#261A66)] font-mono focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all shadow-2xs"
              />
            </div>

            {/* 2FA Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Hardware / OTP Token
                </label>
                <span className="text-[10px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">Pre-Verified</span>
              </div>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-mono font-bold tracking-widest text-[var(--vt-color-orange-600,#D84C0B)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <IconShield className="w-4 h-4" />
                  <span>Authenticate & Enter Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Direct Access Buttons */}
          <div className="mt-5 pt-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] text-center">
            <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-semibold">One-Click Developer Bypass:</span>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleDevQuickLaunch("SUPER_ADMIN")}
                className="h-8 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs cursor-pointer"
              >
                Enter as Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleDevQuickLaunch("COMPLIANCE_OFFICER")}
                className="h-8 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs cursor-pointer"
              >
                Enter as Compliance Officer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--vt-color-neutral-500,#7C7894)] z-10 gap-2 border-t border-[var(--vt-color-neutral-200,#E2E0EC)] pt-4">
        <span>© 2026 Vantaged Platform Technologies · Internal Operations</span>
        <div className="flex items-center gap-4 font-semibold">
          <a
            href="http://localhost:3000/contractor/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors flex items-center gap-1"
          >
            <span>Contractor Login (Port 3000)</span>
            <IconExternalLink className="w-3 h-3" />
          </a>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors flex items-center gap-1"
          >
            <span>Public Portal</span>
            <IconExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
