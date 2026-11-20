"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconContractors } from "../../components/AdminIcons";

export default function ProjectsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to Contractor Directory where projects are organized per firm
    const timer = setTimeout(() => {
      router.replace("/contractors");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center mb-4 shadow-sm animate-pulse">
        <IconContractors className="w-7 h-7" />
      </div>

      <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
        Projects Have Relocated
      </h1>

      <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] max-w-md mb-6 leading-relaxed">
        Active projects and escrow vaults are now accessed directly per company within the <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Contractor Directory</span>. Redirecting you now...
      </p>

      <Link
        href="/contractors"
        className="inline-flex items-center gap-2 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] cursor-pointer"
      >
        <span>Open Contractor Directory</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}
