"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import AdminLoginPage from "../app/login/page";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on explicit login route, show login page directly
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="h-screen w-screen flex items-center justify-center bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)]"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--vt-color-orange-500,#EF5F18)] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">Loading Operations Console...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show the login terminal
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Subtle decorative background vector waves matching the Owner Dashboard reference */}
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

      {/* ── Desktop Left Sidebar Navigation Bar (Drive Storage reference style) ── */}
      <AdminSidebar />

      {/* ── Mobile Sidebar Drawer (< md) ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[var(--vt-color-indigo-950,#140B3B)]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] z-50 flex">
            <AdminSidebar onMobileClose={() => setMobileSidebarOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* ── Main Dashboard Workspace ── */}
      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 sm:gap-6 pb-24 md:pb-6 scrollbar-thin">
        {/* Mobile Header Bar (< md) */}
        <div className="md:hidden flex items-center justify-between pb-2 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="w-9 h-9 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center text-[var(--vt-color-indigo-900,#261A66)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <img
            src="/brand/vantaged-measurement-logo.svg"
            alt="Vantaged"
            className="h-7 w-auto max-w-[150px] object-contain"
          />
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
            ADMIN
          </span>
        </div>

        {/* Top Header Bar */}
        <AdminHeader />

        {/* Page Content */}
        <div className="w-full flex-1 flex flex-col gap-5 sm:gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
