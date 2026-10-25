"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useTheme } from "../../context/ThemeContext";

interface NavItem {
  id: string;
  label: string;
  badge?: string | number;
  icon: (isActive: boolean) => React.ReactNode;
}

export function SidebarNav({ currentActiveItem }: { currentActiveItem?: string } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>(currentActiveItem || "home");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { fullName, email, role } = useCurrentUser();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (currentActiveItem) {
      setActiveItem(currentActiveItem);
    } else if (pathname?.includes("/transactions")) {
      setActiveItem("transactions");
    } else if (pathname?.includes("/settings")) {
      setActiveItem("settings");
    } else if (pathname?.includes("/notifications")) {
      setActiveItem("notifications");
    } else if (pathname?.includes("/client-reps")) {
      setActiveItem("client-reps");
    } else if (pathname?.includes("/find-companies")) {
      setActiveItem("find-companies");
    } else if (pathname?.includes("/projects")) {
      setActiveItem("projects");
    } else if (pathname?.includes("/dashboard")) {
      setActiveItem("home");
    }
  }, [currentActiveItem, pathname]);

  const handleNavClick = (id: string) => {
    setActiveItem(id);
    if (id === "home") {
      router.push("/owner/dashboard");
    } else if (id === "projects") {
      router.push("/owner/projects");
    } else if (id === "transactions") {
      router.push("/owner/transactions");
    } else if (id === "find-companies") {
      router.push("/owner/find-companies");
    } else if (id === "client-reps") {
      router.push("/owner/client-reps");
    } else if (id === "notifications") {
      router.push("/owner/notifications");
    } else if (id === "settings") {
      router.push("/owner/settings");
    }
  };

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "projects",
      label: "Projects",
      badge: 6,
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      id: "find-companies",
      label: "Find companies",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      id: "client-reps",
      label: "Representatives",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      badge: 3,
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (isActive) => (
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ── Mobile Top App Bar (< md only) ── */}
      <header
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="md:hidden w-full h-14 bg-white/95 backdrop-blur-md border-b border-[var(--vt-color-border-default,#E2E0EC)] px-3.5 flex items-center justify-between shrink-0 z-30 select-none shadow-2xs"
      >
        {/* Left: Mobile Drawer Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="w-9 h-9 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center cursor-pointer transition-colors active:scale-95 shadow-2xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Center: Brand Logo with live dot */}
        <Link href="/owner/dashboard" className="flex items-center gap-1.5 cursor-pointer">
          <img
            src="/brand/vantaged-measurement-logo.svg"
            alt="Vantaged"
            className="h-7.5 w-auto max-w-[160px] object-contain"
          />
          <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] shrink-0" title="System online" />
        </Link>

        {/* Right: Theme Toggle & Notifications Bell */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[var(--vt-color-orange-400,#F6803F)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("notifications")}
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center relative cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-1.5 ring-white" />
          </button>
        </div>
      </header>

      {/* ── Mobile Slide-Out Drawer Menu (< md only) ── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[var(--vt-color-indigo-950,#140B3B)]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col justify-between py-5 px-3 animate-in slide-in-from-left duration-200 border-r border-[var(--vt-color-border-default,#E2E0EC)]"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="px-3 pt-1 pb-3 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                <img
                  src="/brand/vantaged-measurement-logo.svg"
                  alt="Vantaged"
                  className="h-8 w-auto max-w-[170px] object-contain"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-1 w-full px-1 overflow-y-auto max-h-[calc(100vh-230px)]">
                {navItems.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        handleNavClick(item.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]"
                          : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon(isActive)}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                              : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Profile in Drawer */}
            <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1">
              <div
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  router.push("/owner/settings");
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white font-black text-xs flex items-center justify-center shrink-0">
                  {fullName.charAt(0) || "J"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">{fullName}</p>
                  <p className="text-[10px] text-[var(--vt-color-orange-600,#D84C0B)] font-bold uppercase">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop Left Sidebar Navigation Bar (Drive Storage reference style) ── */}
      <aside
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="hidden md:flex md:w-60 lg:w-64 h-full shrink-0 bg-white border-r border-[var(--vt-color-border-default,#E2E0EC)] flex-col justify-between py-5 px-3 z-20 select-none font-sans shadow-[2px_0_12px_rgba(38,26,102,0.03)]"
      >
        {/* Top Group: Brand Logo & Navigation Links */}
        <div className="flex flex-col gap-4 w-full">
          {/* Brand Logo with approved measurement lines */}
          <div className="px-3 pt-1 pb-2.5 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)]/60">
            <button
              type="button"
              onClick={() => handleNavClick("home")}
              aria-label="Vantaged home"
              className="flex items-center text-left cursor-pointer group"
            >
              <img
                src="/brand/vantaged-measurement-logo.svg"
                alt="Vantaged"
                className="h-8 w-auto max-w-[175px] object-contain transition-opacity group-hover:opacity-90"
              />
            </button>
            <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" title="System online" />
          </div>

          {/* Navigation Items List */}
          <nav className="flex flex-col gap-1 w-full px-1">
            {navItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]/70 shadow-2xs"
                      : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.icon(isActive)}
                    <span className="truncate">{item.label}</span>
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Base: Owner Profile Card with Dropdown */}
        <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1 relative">
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div
                style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                className="absolute bottom-16 left-1 right-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-[0_12px_36px_rgba(38,26,102,0.18)] p-1.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    router.push("/owner/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="leading-tight font-bold">Profile</p>
                    <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-normal">Account & credentials</p>
                  </div>
                </button>

                <div className="my-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]" />

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (confirm("Are you sure you want to log out of Vantaged?")) {
                      router.push("/signup");
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <p className="leading-tight font-bold">Logout</p>
                    <p className="text-[10px] text-rose-400 font-normal">Sign out of session</p>
                  </div>
                </button>
              </div>
            </>
          )}

          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer group shadow-2xs ${
              isProfileMenuOpen
                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-400,#F78241)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/20"
                : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] hover:bg-white"
            } flex items-center justify-between`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                  alt={fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] ring-2 ring-white" />
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                  {fullName}
                </h4>
                <p className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] uppercase tracking-wider truncate">
                  {role}
                </p>
                <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate font-sans">
                  {email}
                </p>
              </div>
            </div>

            <div
              className={`text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] p-1 rounded-sm shrink-0 transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-90 text-[var(--vt-color-orange-600,#D84C0B)]" : ""
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation Dock Bar (< md only) ── */}
      <nav
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--vt-color-border-default,#E2E0EC)] px-2 py-1 flex items-center justify-around shadow-[0_-4px_20px_rgba(38,26,102,0.06)]"
      >
        <button
          type="button"
          onClick={() => handleNavClick("home")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeItem === "home"
              ? "text-[var(--vt-color-orange-600,#D84C0B)] font-bold"
              : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeItem === "home" ? "2.4" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick("projects")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors cursor-pointer relative ${
            activeItem === "projects"
              ? "text-[var(--vt-color-orange-600,#D84C0B)] font-bold"
              : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeItem === "projects" ? "2.4" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span className="text-[10px] tracking-tight">Projects</span>
          <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
        </button>

        <button
          type="button"
          onClick={() => handleNavClick("transactions")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeItem === "transactions"
              ? "text-[var(--vt-color-orange-600,#D84C0B)] font-bold"
              : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeItem === "transactions" ? "2.4" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <span className="text-[10px] tracking-tight">Payments</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick("find-companies")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeItem === "find-companies"
              ? "text-[var(--vt-color-orange-600,#D84C0B)] font-bold"
              : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeItem === "find-companies" ? "2.4" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[10px] tracking-tight">Companies</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
}
