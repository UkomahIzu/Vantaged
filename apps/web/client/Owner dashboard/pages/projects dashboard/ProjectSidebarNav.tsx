"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getProjectDetail } from "./projectData";

interface ProjectNavItem {
  id: "overview" | "stages" | "transactions" | "disputes" | "change-requests" | "team";
  label: string;
  badge?: string | number;
  icon: (isActive: boolean) => React.ReactNode;
}

interface ProjectSidebarNavProps {
  projectId: string;
  activeTab: "overview" | "stages" | "transactions" | "disputes" | "change-requests" | "team";
}

export function ProjectSidebarNav({
  projectId,
  activeTab,
}: ProjectSidebarNavProps) {
  const router = useRouter();
  const { fullName, email, role } = useCurrentUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const project = getProjectDetail(projectId);

  const [stagesBadge, setStagesBadge] = useState<string>(
    `${project.stages.filter((s) => s.status === "Approved").length}/${project.stages.length}`
  );
  const [disputesBadge, setDisputesBadge] = useState<number | undefined>(
    project.disputes.filter((d) => d.status === "Active Dispute").length || undefined
  );
  const [crBadge, setCrBadge] = useState<number | undefined>(
    project.changeRequests.filter((c) => c.status === "Waiting for Your Approval").length || undefined
  );

  useEffect(() => {
    const syncBadges = () => {
      try {
        const savedStages = localStorage.getItem(`vantaged_stages_${projectId}`);
        if (savedStages) {
          const parsed = JSON.parse(savedStages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const approved = parsed.filter((s: any) => s.status === "Approved").length;
            setStagesBadge(`${approved}/${parsed.length}`);
          }
        }
        const savedDisputes = localStorage.getItem(`vantaged_disputes_${projectId}`);
        if (savedDisputes) {
          const parsed = JSON.parse(savedDisputes);
          if (Array.isArray(parsed)) {
            const active = parsed.filter((d: any) => d.status === "Active Dispute").length;
            setDisputesBadge(active || undefined);
          }
        }
        const savedCR = localStorage.getItem(`vantaged_cr_${projectId}`);
        if (savedCR) {
          const parsed = JSON.parse(savedCR);
          if (Array.isArray(parsed)) {
            const pending = parsed.filter((c: any) => c.status === "Waiting for Your Approval").length;
            setCrBadge(pending || undefined);
          }
        }
      } catch {}
    };

    syncBadges();
    window.addEventListener("vantaged_storage_update", syncBadges);
    window.addEventListener("storage", syncBadges);
    return () => {
      window.removeEventListener("vantaged_storage_update", syncBadges);
      window.removeEventListener("storage", syncBadges);
    };
  }, [projectId]);

  const handleNavClick = (tabId: "overview" | "stages" | "transactions" | "disputes" | "change-requests" | "team") => {
    const subpath = tabId === "overview" ? "" : `/${tabId}`;
    router.push(`/owner/projects/${projectId}${subpath}`);
  };

  const navItems: ProjectNavItem[] = [
    {
      id: "overview",
      label: "Overview",
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
      id: "stages",
      label: "Stages",
      badge: stagesBadge,
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
      badge: "Escrow",
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
      id: "disputes",
      label: "Disputes",
      badge: disputesBadge,
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
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      id: "change-requests",
      label: "Extra Work",
      badge: crBadge,
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: "team",
      label: "Site & Team",
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
  ];

  return (
    <aside
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="w-60 lg:w-64 h-full shrink-0 bg-white border-r border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col justify-between py-5 px-3 z-20 select-none font-sans shadow-[2px_0_12px_rgba(38,26,102,0.03)]"
    >
      {/* Top Group */}
      <div className="flex flex-col gap-4 w-full">
        {/* Brand Logo with approved measurement lines */}
        <div className="px-3 pt-1 pb-2 flex items-center justify-between border-b border-[var(--vt-color-neutral-100,#EFEEF5)]/60">
          <Link
            href="/owner/dashboard"
            aria-label="Vantaged home"
            className="flex items-center group"
          >
            <img
              src="/brand/vantaged-measurement-logo.svg"
              alt="Vantaged"
              className="h-6 w-auto max-w-[130px] object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          <Link
            href="/owner/projects"
            title="Leave project and go back to all buildings"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back</span>
          </Link>
        </div>

        {/* Current Project Card (Simple, clean, unobtrusive) */}
        <div className="mx-1 p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
              {project.category}
            </span>
            <span className="text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
              {project.verifiedProgress}% done
            </span>
          </div>

          <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-snug line-clamp-1">
            {project.title}
          </h3>

          <div className="w-full h-1.5 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] overflow-hidden mt-0.5">
            <div
              style={{ width: `${project.verifiedProgress}%` }}
              className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full"
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

      {/* Base: Profile Card identical to SidebarNav */}
      <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] px-1 relative">
        {isProfileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsProfileMenuOpen(false)}
            />
            <div
              style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
              className="absolute bottom-16 left-1 right-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-xl p-1.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              <Link
                href="/owner/dashboard"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer text-left"
              >
                <span>Main Dashboard</span>
              </Link>
              <Link
                href="/owner/settings"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] cursor-pointer text-left"
              >
                <span>Account Settings</span>
              </Link>
            </div>
          </>
        )}

        <div
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white transition-all cursor-pointer flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt={fullName}
              className="w-9 h-9 rounded-full object-cover border border-white shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                {fullName}
              </h4>
              <p className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] uppercase tracking-wider truncate">
                {role}
              </p>
            </div>
          </div>
          <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
