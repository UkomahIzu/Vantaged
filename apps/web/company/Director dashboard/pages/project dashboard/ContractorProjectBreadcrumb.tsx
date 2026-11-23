"use client";

import React from "react";
import Link from "next/link";

interface ContractorProjectBreadcrumbProps {
  projectId: string;
  projectTitle: string;
  currentPageTitle?: string;
  subPageTitle?: string;
  subPageParentHref?: string;
}

export function ContractorProjectBreadcrumb({
  projectId,
  projectTitle,
  currentPageTitle,
  subPageTitle,
  subPageParentHref,
}: ContractorProjectBreadcrumbProps) {
  const backHref = subPageTitle && subPageParentHref
    ? subPageParentHref
    : currentPageTitle
    ? `/contractor/projects/${projectId}`
    : "/contractor/projects";

  const backTitle = subPageTitle
    ? `Back to ${currentPageTitle}`
    : currentPageTitle
    ? "Back to Project Overview"
    : "Back to All Projects";

  return (
    <div
      className="flex items-center gap-2 min-w-0 font-sans"
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
    >
      <Link
        href={backHref}
        title={backTitle}
        className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </Link>

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--vt-color-neutral-500,#7C7894)] min-w-0"
      >
        <Link
          href="/contractor/projects"
          className="hover:underline font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors shrink-0"
        >
          Projects
        </Link>

        <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0 select-none">/</span>

        {currentPageTitle ? (
          <>
            <Link
              href={`/contractor/projects/${projectId}`}
              title={projectTitle}
              className="hover:underline font-medium text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] truncate max-w-[110px] sm:max-w-[170px] md:max-w-[210px] transition-colors"
            >
              {projectTitle}
            </Link>

            <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0 select-none">/</span>

            {subPageTitle && subPageParentHref ? (
              <>
                <Link
                  href={subPageParentHref}
                  className="hover:underline font-medium text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] shrink-0 transition-colors"
                >
                  {currentPageTitle}
                </Link>
                <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0 select-none">/</span>
                <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)] truncate max-w-[120px] sm:max-w-[180px]">
                  {subPageTitle}
                </span>
              </>
            ) : (
              <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)] truncate max-w-[120px] sm:max-w-[170px]">
                {currentPageTitle}
              </span>
            )}
          </>
        ) : (
          <span
            title={projectTitle}
            className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate max-w-[160px] sm:max-w-[260px] md:max-w-[340px]"
          >
            {projectTitle}
          </span>
        )}
      </nav>
    </div>
  );
}
