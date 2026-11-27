"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContractorUser } from "../../hooks/useContractorUser";
import { DirectorProfileModal } from "../../components/DirectorProfileModal";
import {
  CONTRACTOR_STORAGE_EVENT,
  computeProjectMetrics,
  loadProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import { SHARED_SYNC_EVENT } from "../../../../shared/vantagedSyncBridge";

export type ContractorProjectTab =
  | "overview"
  | "stages"
  | "transactions"
  | "disputes"
  | "change-requests"
  | "team";

interface ContractorProjectSidebarNavProps {
  projectId: string;
  activeTab: ContractorProjectTab;
}

export function ContractorProjectSidebarNav({
  projectId,
  activeTab,
}: ContractorProjectSidebarNavProps) {
  const router = useRouter();
  const user = useContractorUser();
  const userInitials = user.fullName
    .replace(/^(Engr\.|Arch\.|QS|Chief|Dr\.)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "BA";
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const project = useContractorProject(projectId);

  const [verifiedProgress, setVerifiedProgress] = useState<number>(() =>
    computeProjectMetrics(project.stages).verifiedPercent
  );
  const [stagesBadge, setStagesBadge] = useState<string>(() => {
    const m = computeProjectMetrics(project.stages);
    return `${m.approvedCount}/${m.totalCount}`;
  });
  const [pendingReceiptsBadge, setPendingReceiptsBadge] = useState<number | undefined>(
    () => project.tranches.filter((t) => t.status === "Awaiting Your Confirmation").length || undefined
  );
  const [issuesBadge, setIssuesBadge] = useState<number | undefined>(
    () => project.issues.filter((i) => i.status !== "Resolved").length || undefined
  );
  const [variationsBadge, setVariationsBadge] = useState<number | undefined>(
    () => project.variations.filter((v) => v.status === "Awaiting Owner Approval").length || undefined
  );

  useEffect(() => {
    const sync = () => {
      const stages = loadProjectKey(projectId, "stages", project.stages);
      const metrics = computeProjectMetrics(stages);
      setVerifiedProgress(metrics.verifiedPercent);
      setStagesBadge(`${metrics.approvedCount}/${metrics.totalCount}`);

      const tranches = loadProjectKey(projectId, "tranches", project.tranches);
      const pendingReceipts = tranches.filter((t) => t.status === "Awaiting Your Confirmation").length;
      setPendingReceiptsBadge(pendingReceipts || undefined);

      const issues = loadProjectKey(projectId, "issues", project.issues);
      const openIssues = issues.filter((i) => i.status !== "Resolved").length;
      setIssuesBadge(openIssues || undefined);

      const variations = loadProjectKey(projectId, "variations", project.variations);
      const pendingVars = variations.filter((v) => v.status === "Awaiting Owner Approval").length;
      setVariationsBadge(pendingVars || undefined);
    };

    sync();
    window.addEventListener(CONTRACTOR_STORAGE_EVENT, sync);
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONTRACTOR_STORAGE_EVENT, sync);
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [projectId, project.stages, project.tranches, project.issues, project.variations]);

  const handleNavClick = (tabId: ContractorProjectTab) => {
    const subpath = tabId === "overview" ? "" : `/${tabId}`;
    router.push(`/contractor/projects/${projectId}${subpath}`);
  };

  const navItems: {
    id: ContractorProjectTab;
    label: string;
    badge?: string | number;
    icon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (isActive) => (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "stages",
      label: "Stages & Proof",
      badge: stagesBadge,
      icon: (isActive) => (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: "transactions",
      label: "Payments & Receipts",
      badge: pendingReceiptsBadge,
      icon: (isActive) => (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      id: "disputes",
      label: "Fixes & Disputes",
      badge: issuesBadge,
      icon: (isActive) => (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      id: "change-requests",
      label: "Extra Work",
      badge: variationsBadge,
      icon: (isActive) => (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: "team",
      label: "Site Crew & Client",
      icon: (isActive) => (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--vt-color-orange-500,#EF5F18)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="md:hidden w-full h-14 bg-white/95 backdrop-blur-md border-b border-[var(--vt-color-border-default,#E2E0EC)] px-3 flex items-center justify-between shrink-0 z-30 select-none shadow-2xs"
      >
        <Link
          href="/contractor/projects"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Projects</span>
        </Link>

        <div className="flex flex-col items-center max-w-[50%] min-w-0">
          <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate w-full text-center">
            {project.title}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
              {project.category}
            </span>
            <span className="text-[10px] font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
              · {verifiedProgress}% verified
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
          aria-label="Open project menu"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {isMobileDrawerOpen && (
      <div
        id="mobile-contractor-project-drawer"
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="md:hidden fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={closeMobileDrawer} />
        <div className="fixed inset-y-0 left-0 w-[82%] max-w-xs bg-white shadow-2xl flex flex-col justify-between p-4 z-10 border-r border-[var(--vt-color-border-default,#E2E0EC)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <Link href="/contractor/dashboard" className="flex items-center">
                <img src="/brand/vantaged-measurement-logo.svg" alt="Vantaged" className="h-7.5 w-auto max-w-[160px] object-contain dark:hidden" />
                <img src="/brand/vantaged-measurement-logo-dark.svg" alt="Vantaged" className="hidden dark:block h-7.5 w-auto max-w-[160px] object-contain" />
              </Link>
              <button
                type="button"
                onClick={closeMobileDrawer}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                  {project.jobId}
                </span>
                <span className="text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  {verifiedProgress}% verified
                </span>
              </div>
              <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-snug line-clamp-2">
                {project.title}
              </h3>
              <div className="w-full h-1.5 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] overflow-hidden mt-0.5">
                <div style={{ width: `${verifiedProgress}%` }} className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      closeMobileDrawer();
                      handleNavClick(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]/70 shadow-2xs"
                        : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.icon(isActive)}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
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

            <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <Link
                href="/contractor/projects"
                onClick={closeMobileDrawer}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
              >
                <span>← All Company Projects</span>
              </Link>
              <Link
                href="/contractor/dashboard"
                onClick={closeMobileDrawer}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
              >
                <span>Company Dashboard Home</span>
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              closeMobileDrawer();
              setIsProfileModalOpen(true);
            }}
            className="w-full text-left pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">{user.fullName}</p>
              <p className="text-[10px] text-[var(--vt-color-orange-600,#D84C0B)] font-bold uppercase truncate">{user.companyName}</p>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="hidden md:flex md:w-60 lg:w-64 h-full shrink-0 bg-white border-r border-[var(--vt-color-border-default,#E2E0EC)] flex-col justify-between py-5 px-3 z-20 select-none font-sans shadow-[2px_0_12px_rgba(38,26,102,0.03)]"
      >
        <div className="flex flex-col gap-4 w-full">
          {/* Logo */}
          <div className="px-3 pt-1 pb-2 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)]/60">
            <Link href="/contractor/dashboard" aria-label="Vantaged Company Home" className="flex items-center group">
              <img src="/brand/vantaged-measurement-logo.svg" alt="Vantaged" className="h-8 w-auto max-w-[165px] object-contain transition-opacity group-hover:opacity-90 dark:hidden" />
              <img src="/brand/vantaged-measurement-logo-dark.svg" alt="Vantaged" className="hidden dark:block h-8 w-auto max-w-[165px] object-contain transition-opacity group-hover:opacity-90" />
            </Link>
          </div>

          {/* Current Project Mini-Card */}
          <div className="mx-1 p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                {project.jobId}
              </span>
              <span className="text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                {verifiedProgress}% verified
              </span>
            </div>

            <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-snug line-clamp-1">
              {project.title}
            </h3>

            <p className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
              Client: {project.client.name}
            </p>

            <div className="w-full h-1.5 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] overflow-hidden mt-0.5">
              <div
                style={{ width: `${verifiedProgress}%` }}
                className={`h-full rounded-full transition-all duration-300 ${
                  verifiedProgress >= 100
                    ? "bg-[var(--vt-color-green-600,#248246)]"
                    : "bg-[var(--vt-color-orange-500,#EF5F18)]"
                }`}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 w-full px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
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

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
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

          {/* Direct Return Shortcut to Main Company Dashboard */}
          <div className="px-1 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
            <Link
              href="/contractor/dashboard"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Company Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Base: Director Profile Card */}
        <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1 relative">
          {isProfileMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsProfileMenuOpen(false)} />
              <div className="absolute bottom-16 left-1 right-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-xl p-1.5 z-40">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:text-[var(--vt-color-orange-700,#B33C08)] cursor-pointer text-left"
                >
                  <span>Company Profile</span>
                </button>
                <Link
                  href="/contractor/dashboard"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer text-left"
                >
                  <span>Main Dashboard</span>
                </Link>
                <Link
                  href="/contractor/settings"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer text-left"
                >
                  <span>Company Settings</span>
                </Link>
              </div>
            </>
          )}

          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white transition-all cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                  {user.fullName}
                </h4>
                <p className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] uppercase tracking-wider truncate">
                  {user.role}
                </p>
              </div>
            </div>
            <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Dock */}
      <nav
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        aria-label="Project Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--vt-color-border-default,#E2E0EC)] px-2 py-1 flex items-center justify-around shadow-[0_-4px_20px_rgba(38,26,102,0.06)]"
      >
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "stages", label: "Stages" },
            { id: "transactions", label: "Payments" },
            { id: "disputes", label: "Fixes" },
          ] as const
        ).map((tab) => {
          const item = navItems.find((n) => n.id === tab.id)!;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-[var(--vt-color-orange-600,#D84C0B)] font-bold"
                  : "text-[var(--vt-color-neutral-500,#7C7894)]"
              }`}
            >
              {item.icon(isActive)}
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            const drawer = document.getElementById("mobile-contractor-project-drawer");
            if (drawer) drawer.classList.remove("hidden");
          }}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg text-[var(--vt-color-neutral-500,#7C7894)] cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      <DirectorProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
}
