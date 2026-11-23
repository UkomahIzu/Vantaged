"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth, PRESET_ADMINS } from "../context/AdminAuthContext";
import { useDemoMode } from "../hooks/useDemoMode";
import { AdminRole } from "../types/admin";
import {
  IconHome,
  IconVerification,
  IconContractors,
  IconDisputes,
  IconSubscriptions,
  IconPresets,
  IconAudit,
  IconLogout,
  IconShield,
} from "./AdminIcons";

export function AdminSidebar({
  onMobileClose,
  isMobile = false,
}: {
  onMobileClose?: () => void;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const { user, logout, switchRole } = useAdminAuth();
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [counts, setCounts] = useState<{
    verifications: string;
    contractors: string;
    presets: string;
    disputes?: string;
  }>({
    verifications: "0",
    contractors: "0",
    presets: "9",
    disputes: undefined,
  });

  useEffect(() => {
    fetch("/api/presets")
      .then((r) => r.json())
      .then((d) => {
        const customCount = d?.success && Array.isArray(d.data) ? d.data.length : 0;
        setCounts((prev) => ({ ...prev, presets: String(9 + customCount) }));
      })
      .catch(() => {});

    fetch("/api/verifications")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.data)) {
          const pending = d.data.filter(
            (s: any) => s.status === "PENDING_REVIEW"
          ).length;
          const verified = d.data.filter(
            (s: any) => s.status === "VERIFIED"
          ).length;
          setCounts((prev) => ({
            ...prev,
            verifications: String(pending),
            contractors: isDemoMode ? prev.contractors : String(verified),
          }));
        }
      })
      .catch(() => {});

    if (!isDemoMode) {
      setCounts((prev) => ({
        ...prev,
        disputes: undefined,
      }));
      return;
    }

    fetch("/api/contractors")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.data)) {
          setCounts((prev) => ({ ...prev, contractors: String(d.data.length) }));
        }
      })
      .catch(() => {});

    fetch("/api/disputes")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.data)) {
          const active = d.data.filter((disp: any) => disp.status !== "RESOLVED").length;
          setCounts((prev) => ({ ...prev, disputes: active > 0 ? String(active) : undefined }));
        }
      })
      .catch(() => {});
  }, [pathname, isDemoMode]);

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: IconHome,
      badge: undefined,
    },
    {
      name: "Verification Queue",
      href: "/verifications",
      icon: IconVerification,
      badge: Number(counts.verifications) > 0 ? counts.verifications : undefined,
    },
    {
      name: "Contractor Directory",
      href: "/contractors",
      icon: IconContractors,
      badge: Number(counts.contractors) > 0 ? counts.contractors : undefined,
    },
    {
      name: "Disputes & Risk Radar",
      href: "/disputes",
      icon: IconDisputes,
      badge: isDemoMode ? counts.disputes : undefined,
    },
    {
      name: "Subscriptions & Tiers",
      href: "/subscriptions",
      icon: IconSubscriptions,
      badge: undefined,
    },
    {
      name: "Stage Preset Library",
      href: "/presets",
      icon: IconPresets,
      badge: counts.presets,
    },
    {
      name: "Platform Audit Trail",
      href: "/audit",
      icon: IconAudit,
      badge: undefined,
    },
  ];

  return (
    <aside
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className={`${
        isMobile ? "w-full" : "hidden md:flex md:w-60 lg:w-64"
      } h-full shrink-0 bg-white border-r border-[var(--vt-color-border-default,#E2E0EC)] flex-col justify-between py-5 px-3 z-20 select-none font-sans shadow-[2px_0_12px_rgba(38,26,102,0.03)]`}
    >
      {/* Top Group: Brand Logo & Navigation Links */}
      <div className="flex flex-col gap-4 w-full">
        {/* Brand Logo with measurement lines matching the Owner Dashboard */}
        <div className="px-3 pt-1 pb-3 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src="/brand/vantaged-measurement-logo.svg"
              alt="Vantaged"
              className="h-8 w-auto max-w-[155px] object-contain transition-opacity group-hover:opacity-90 dark:hidden"
            />
            <img
              src="/brand/vantaged-measurement-logo-dark.svg"
              alt="Vantaged"
              className="hidden dark:block h-8 w-auto max-w-[155px] object-contain transition-opacity group-hover:opacity-90"
            />
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
              ADMIN
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isMobile && onMobileClose && (
              <button
                type="button"
                onClick={onMobileClose}
                className="w-7 h-7 rounded-md hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="flex flex-col gap-1 w-full px-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]/70 shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-[var(--vt-color-orange-500,#EF5F18)]"
                        : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-sans transition-colors ${
                      isActive
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                        : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Stack: Demo Data Toggle + Admin Profile & Role Switcher */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Demo Data / Empty State Mode Toggle (Just above User Account) */}
        <div className="pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1">
          <div className="p-2.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                Demo Data
              </span>
              <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate font-sans">
                {isDemoMode ? "Mock platform data" : "Live state (Real data)"}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleDemoMode}
              role="switch"
              aria-checked={isDemoMode}
              title={isDemoMode ? "Switch to Empty State" : "Switch to Demo Data"}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDemoMode ? "bg-[var(--vt-color-orange-500,#EF5F18)]" : "bg-[var(--vt-color-neutral-300,#CBC8DA)]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDemoMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Base: Admin Profile & Role Switcher */}
        <div className="pt-2.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1 relative">
        {/* Role Switcher Popover */}
        {roleSwitcherOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setRoleSwitcherOpen(false)}
            />
            <div className="absolute bottom-16 left-1 right-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-[0_12px_36px_rgba(38,26,102,0.18)] p-1.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase font-semibold">
                Simulate Admin Role
              </div>
              {(Object.keys(PRESET_ADMINS) as AdminRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    switchRole(r);
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex flex-col ${
                    user?.role === r
                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold"
                      : "text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                  }`}
                >
                  <span className="font-bold">{PRESET_ADMINS[r].name}</span>
                  <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-normal">
                    {PRESET_ADMINS[r].roleTitle.split("·")[0]}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Profile Card matching Owner Dashboard format */}
        {user && (
          <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] transition-colors">
            <button
              type="button"
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
              title="Click to switch role"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white font-black text-xs flex items-center justify-center shrink-0">
                {user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-[var(--vt-color-orange-600,#D84C0B)] font-bold uppercase truncate">
                  {user.securityLevel.split("·")[0].trim()}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={logout}
              title="Sign Out of Console"
              className="p-1.5 rounded-lg text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <IconLogout className="w-4 h-4" />
            </button>
          </div>
        )}
        </div>
      </div>
    </aside>
  );
}
