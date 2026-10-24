"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProjectDetail, ProjectDetailData } from "./projects dashboard/projectData";

interface PublicShareLinkPageProps {
  token: string;
}

export function PublicShareLinkPage({ token }: PublicShareLinkPageProps) {
  const [isRevoked, setIsRevoked] = useState(false);
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    // Resolve project from token slug
    let projId = "proj-lekki";
    if (token.includes("banana")) projId = "proj-banana";
    else if (token.includes("enclave") || token.includes("epe")) projId = "proj-enclave";
    else if (token.includes("guzape")) projId = "proj-guzape";
    else if (token.includes("eko")) projId = "proj-eko";

    // Check localStorage for revoked status
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vantaged_active_share_links");
      if (saved) {
        try {
          const links = JSON.parse(saved);
          const matched = links.find((l: any) => l.token === token || token.includes(l.token));
          if (matched && matched.isRevoked) {
            setIsRevoked(true);
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    const data = getProjectDetail(projId);
    setProject(data);
  }, [token]);

  if (isRevoked) {
    return (
      <div
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="min-h-screen w-full bg-[var(--vt-color-background-subtle,#F7F7FA)] flex items-center justify-center p-4 font-sans select-none"
      >
        <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 text-center shadow-lg flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-scarlet-50,#FFF1F2)] text-[var(--vt-color-scarlet-600,#E11D48)] flex items-center justify-center mb-4 border border-[var(--vt-color-scarlet-200,#FECDD3)]">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-[var(--vt-color-indigo-900,#261A66)]">
            Observer Link Revoked or Expired
          </h2>
          <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-2 leading-relaxed">
            This live observer link is no longer active. The project owner may have refreshed security permissions or set an expiration deadline.
          </p>
          <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-4">
            Please contact the property owner or project sponsor to request a fresh link.
          </p>
          <Link
            href="/"
            className="mt-6 px-4 py-2 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold transition-all shadow-xs"
          >
            Go to Vantaged Home
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--vt-color-background-subtle,#F7F7FA)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--vt-color-orange-500,#EF5F18)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentStage =
    project.stages.find((s) => s.status === "Ready for Review") ||
    project.stages[3] ||
    project.stages[0];

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="min-h-screen w-full bg-[var(--vt-color-background-subtle,#F7F7FA)] font-sans text-[var(--vt-color-text-default,#261A66)] select-none flex flex-col"
    >
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[var(--vt-color-border-default,#E2E0EC)] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center group" aria-label="Vantaged home">
            <img
              src="/brand/vantaged-measurement-logo.svg"
              alt="Vantaged"
              className="h-7 w-auto max-w-[140px] object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          <span className="h-4 w-px bg-[var(--vt-color-border-default,#E2E0EC)]" />

          {/* Observer Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#134E2C)] border border-[var(--vt-color-green-200,#BCE5C8)] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2BB259)] animate-pulse" />
            <span>Live Observer View</span>
          </div>
        </div>

        {/* Reassuring Security Pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
          <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Financials & Private Chat Protected</span>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Project Header Hero Card */}
        <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[10.5px] font-bold">
                  {project.category}
                </span>
                <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] font-medium">
                  {project.specs}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mt-1.5">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] mt-1 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span>{project.address}</span>
              </p>
            </div>

            {/* Contractor Badge */}
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] shrink-0 sm:text-right">
              <span className="text-[10px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Verified Builder
              </span>
              <p className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                {project.contractor.name}
              </p>
              <span className="text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)]">
                ✓ CAC Verified · {project.contractor.rating}
              </span>
            </div>
          </div>

          {/* Headline Verified Progress Bar (PRD §7.12) */}
          <div className="pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                Verified Construction Progress
              </span>
              <span className="font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] text-base">
                {project.verifiedProgress}% Completed
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
              <div
                style={{ width: `${project.verifiedProgress}%` }}
                className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full transition-all duration-500"
              />
            </div>

            <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Calculated exclusively from milestone stages physically inspected, geo-verified, and signed off on site.
            </p>
          </div>
        </div>

        {/* Current Active Milestone Card */}
        <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                Active Stage Underway
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                {currentStage.title}
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                {currentStage.description}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shrink-0">
              {currentStage.status}
            </span>
          </div>

          {/* GPS Proof Photos from the Site */}
          <div>
            <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-3">
              GPS Verified Site Proof Photos:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentStage.proofMedia.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActivePhoto(m.url)}
                  className="group rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] bg-white cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--vt-color-neutral-100,#EFEEF5)]">
                    <img
                      src={m.url}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono flex items-center gap-1">
                      <span>📍</span>
                      <span>GPS Verified</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {m.title}
                    </p>
                    <p className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">
                      {m.timestamp} · {m.gpsLocation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist items inspected */}
          <div className="pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
            <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2.5">
              Work Items Inspected on Site:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentStage.checklist.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center gap-2"
                >
                  <span className="text-[var(--vt-color-green-600,#248246)] shrink-0 font-bold">
                    ✓
                  </span>
                  <span className="text-[var(--vt-color-neutral-700,#46425F)]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Milestone Stages Timeline */}
        <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-6 sm:p-7 shadow-xs flex flex-col gap-4">
          <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
            Project Milestone Roadmap
          </h2>
          <div className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
            {project.stages.map((stage) => {
              const isApproved = stage.status === "Approved";
              const isReady = stage.status === "Ready for Review";
              return (
                <div key={stage.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isApproved
                          ? "bg-[var(--vt-color-green-600,#248246)] text-white"
                          : isReady
                          ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                          : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)]"
                      }`}
                    >
                      {isApproved ? "✓" : stage.stageNumber}
                    </span>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                        {stage.title}
                      </p>
                      <p className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        {stage.category} · Weight: {stage.weightPercent}% of build
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      isApproved
                        ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                        : isReady
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)]"
                        : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)]"
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-white border-t border-[var(--vt-color-border-default,#E2E0EC)] px-4 sm:px-8 py-5 text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Live construction intelligence verified by <strong>Vantaged</strong> · Lagos, Nigeria.
        </p>
        <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
          Read-only observer view. Financial ledger and private correspondence are protected.
        </p>
      </footer>

      {/* Lightbox for Full-res Photo Preview */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black">
            <img src={activePhoto} alt="Site proof full view" className="max-h-[85vh] w-auto object-contain" />
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
