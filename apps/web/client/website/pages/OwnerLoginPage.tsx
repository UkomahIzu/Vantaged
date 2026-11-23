"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInOwner, signInOwnerWithGoogle } from "../../../shared/vantagedAuth";

export function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("Uko@gmail.com");
  const [password, setPassword] = useState("123456789$$");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await signInOwner(email, password);
    if (!res.ok) {
      setIsSubmitting(false);
      setErrorMsg(res.error);
      return;
    }

    router.push("/owner/dashboard");
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await signInOwnerWithGoogle(email);
    if (!res.ok) {
      setIsSubmitting(false);
      setErrorMsg(res.error);
      return;
    }

    router.push("/owner/dashboard");
  };

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[var(--vt-color-text-default)] select-none"
    >
      {/* ── Left Column: Brand Gradient Panel (Matching OwnerSignupPage) ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #261A66 0%, #4D1E7B 28%, #932463 52%, #D53F21 76%, #EF5F18 100%)",
        }}
        className="vt-gradient-brand w-full lg:w-1/2 h-full max-h-screen p-6 sm:p-8 lg:p-10 xl:p-14 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden text-white shrink-0 font-sans"
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
              className="h-7 sm:h-8 w-auto max-w-[180px] object-contain brightness-0 invert"
            />
          </a>
        </div>

        {/* Center Message */}
        <div className="relative z-10 my-auto py-4 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] font-bold tracking-wide uppercase">
            Property Owner Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white font-sans">
            Welcome back to your build.
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed font-normal font-sans">
            Sign in to verify site stage proofs, approve milestone releases, and communicate directly with your construction company.
          </p>
        </div>

        {/* Bottom Trust Strip */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80">
          <span>Verified milestone tracking &amp; protected stage payments</span>
        </div>
      </div>

      {/* ── Right Column: Clean Owner Login Form ── */}
      <div className="w-full lg:w-1/2 h-full max-h-screen overflow-y-auto bg-white font-sans flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto p-6 sm:p-8 lg:p-10 my-auto">
          <form onSubmit={handleLogin} className="flex flex-col gap-4 font-sans">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                Owner Sign In
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)] mb-1 font-sans">
                Log in to Vantaged
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-sans leading-relaxed">
                Enter your registered email and password to access your Owner Dashboard.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                Email Address <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
              </label>
              <div className="group h-11 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                <svg
                  className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                Password <span className="text-[var(--vt-color-orange-500,#EF5F18)]">*</span>
              </label>
              <div className="group h-11 px-3.5 bg-[#F7F8FA] border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F2F3F7] focus-within:border-[var(--vt-color-orange-500,#EF5F18)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md flex items-center transition-all shadow-2xs">
                <svg
                  className="h-4 w-4 text-[#A3A0B8] group-focus-within:text-[var(--vt-color-orange-500,#EF5F18)] transition-colors shrink-0 mr-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-full bg-transparent text-xs sm:text-sm font-medium text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[#A3A0B8] outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-bold text-[#7C7894] hover:text-[var(--vt-color-indigo-900,#261A66)] ml-2 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-11 w-full rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-50 text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(239,95,24,0.28)] cursor-pointer"
            >
              {isSubmitting ? "Signing in..." : "Log In"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[#E2E0EC]" />
              <span className="shrink mx-3 text-[11px] font-semibold text-[#7C7894]">
                or
              </span>
              <div className="flex-grow border-t border-[#E2E0EC]" />
            </div>

            {/* Login with Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="h-11 w-full rounded-md bg-white border border-[#E2E0EC] hover:border-[#CBC8DA] hover:bg-[#F7F8FA] text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Log in with Google</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] pt-2">
              New to Vantaged?{" "}
              <Link
                href="/signup"
                className="font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
