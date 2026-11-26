"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import {
  DEMO_DIRECTOR_PROJECTS,
  DEMO_WAITING_ACTIONS,
  DirectorProjectSummary,
  WaitingActionItem,
} from "../data/directorData";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  readCompanyLiveNotifications,
} from "../../../shared/vantagedSyncBridge";
import { readScopedCompanyAcceptedProjects } from "../../../shared/vantagedAuth";

type PortfolioTab = "ALL" | "CONTRACTOR_TURN" | "CLIENT_TURN";

export function DirectorPortfolioAndQueue() {
  const { isDemoMode } = useDirectorDemoMode();
  const [tab, setTab] = useState<PortfolioTab>("ALL");
  const [liveProjects, setLiveProjects] = useState<DirectorProjectSummary[]>([]);
  const [liveWaiting, setLiveWaiting] = useState<WaitingActionItem[]>([]);

  useEffect(() => {
    const sync = () => {
      const parsed = readScopedCompanyAcceptedProjects();
      setLiveProjects(
        parsed.map((p: any) => ({
          id: p.id,
          name: p.title,
          clientName: p.contractor?.assignedRep || "Property Owner",
          location: p.location || "Nigeria",
          currentStage: p.stageSubtitle || "Stage 1: Mobilization",
          verifiedPercent: p.progressPercent || 0,
          reportedPercent: p.progressPercent || 0,
          status: "ACTIVE" as const,
          ballInCourt: "CONTRACTOR" as const,
          contractValue: p.escrowAmount || "₦0",
          escrowReceived: "₦0",
          assignedCrewCount: 1,
        }))
      );

      const notifs = readCompanyLiveNotifications().filter((n) => n.isUnread);
      setLiveWaiting(
        notifs.slice(0, 5).map((n) => ({
          id: n.id,
          category:
            n.category === "receipt"
              ? "RECEIPT_CONFIRM"
              : n.category === "stage"
              ? "STAGE_REWORK"
              : "PROJECT_REQUEST",
          roleOwner: n.category === "receipt" ? "Office Coord. / Director" : "Director",
          title: n.title,
          subtitle: n.description,
          urgencyLabel: n.timestamp,
          urgencyTone: n.category === "receipt" ? "green" : "orange",
          href: n.href,
        }))
      );
    };
    sync();
    window.addEventListener("vantaged_company_projects_update", sync);
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vantaged_company_projects_update", sync);
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const projects = isDemoMode
    ? [...liveProjects, ...DEMO_DIRECTOR_PROJECTS]
    : liveProjects;
  const waitingItems = isDemoMode
    ? [...liveWaiting, ...DEMO_WAITING_ACTIONS]
    : liveWaiting;

  const yourTurnCount = projects.filter((p) => p.ballInCourt === "CONTRACTOR").length;
  const clientTurnCount = projects.filter((p) => p.ballInCourt === "CLIENT").length;

  const filteredProjects = projects.filter((prj) => {
    if (tab === "CONTRACTOR_TURN") return prj.ballInCourt === "CONTRACTOR";
    if (tab === "CLIENT_TURN") return prj.ballInCourt === "CLIENT";
    return true;
  });

  const activeDisputeProject = projects.find((p) => p.status === "ON_HOLD_DISPUTE");

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans">
      {/* Contextual Dispute Banner (no standalone Disputes sidebar tab) */}
      {isDemoMode && activeDisputeProject && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 sm:mt-0 shrink-0 animate-pulse" />
            <p className="text-xs font-semibold text-rose-800 leading-snug">
              <strong>{activeDisputeProject.name}:</strong> {activeDisputeProject.currentStage} is on hold due to an active stage dispute (11 days remaining on 14-day resolution window).
            </p>
          </div>
          <Link
            href={`/contractor/projects/${activeDisputeProject.id}/disputes`}
            className="h-8 px-3.5 rounded-md bg-white border border-rose-200 hover:border-rose-300 text-xs font-bold text-rose-700 transition-colors flex items-center justify-center shrink-0 whitespace-nowrap"
          >
            Review Evidence →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-stretch">
        {/* Left: Clean Company Projects & Progress Card */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between min-h-[360px]">
          {/* Clean Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] uppercase block">
                PORTFOLIO OVERVIEW
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mt-0.5">
                Company Projects &amp; Progress
              </h2>
            </div>

            {projects.length > 0 ? (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] self-start sm:self-auto">
                {(
                  [
                    { id: "ALL", label: `All Sites (${projects.length})` },
                    { id: "CONTRACTOR_TURN", label: `Your Turn (${yourTurnCount})` },
                    { id: "CLIENT_TURN", label: `With Client (${clientTurnCount})` },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap tabular-nums ${
                      tab === item.id
                        ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-2xs border border-[var(--vt-color-border-default,#E2E0EC)]"
                        : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <Link
                href="/contractor/projects"
                className="text-xs font-bold text-[var(--vt-color-orange-700,#B33C08)] hover:underline self-start sm:self-auto"
              >
                All Projects →
              </Link>
            )}
          </div>

          {projects.length === 0 ? (
            /* Production Empty State (structured like Owner ActiveProjectProgressCard) */
            <div className="flex-1 flex flex-col justify-between pt-5 gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    STARTER BUILDER · 1 FREE PROJECT SLOT READY
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                    First Build Free Up to 12 Months
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  Ready to launch your first construction project?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] max-w-2xl leading-relaxed">
                  Accept an incoming client brief or build a project plan from a verified stage preset to track client-verified milestones, crew tasks, and payment confirmations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] block mb-1">
                    1. Presets &amp; Plans
                  </span>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-relaxed">
                    Load milestone weights (100%) and attach your payment splits before sending to clients.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] block mb-1">
                    2. Field Proof &amp; Crew
                  </span>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-relaxed">
                    Site Managers and Crew submit timestamped GPS photos, videos, and checklist sign-offs.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] block mb-1">
                    3. Receipt Protection
                  </span>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-relaxed">
                    Confirm bank transfer receipts within 3 days with CAC-matched NUBAN account safety.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link
                  href="/contractor/projects"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white flex items-center transition-all shadow-[0_2px_8px_rgba(179,60,8,0.28)]"
                >
                  + Create First Project
                </Link>
                <Link
                  href="/contractor/requests"
                  className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center transition-all shadow-2xs"
                >
                  View Project Requests
                </Link>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Filtered Empty State (when a specific tab has 0 matches) */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 max-w-sm mx-auto">
              <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-400,#A3A0B8)] flex items-center justify-center mb-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                No projects match this filter
              </h3>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                Switch back to view all {projects.length} active company construction sites.
              </p>
              <button
                type="button"
                onClick={() => setTab("ALL")}
                className="mt-4 h-9 px-4 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(179,60,8,0.28)] cursor-pointer"
              >
                Show All Sites
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between pt-2">
              <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                {filteredProjects.map((project) => {
                  const statusMeta =
                    project.status === "ON_HOLD_DISPUTE"
                      ? {
                          dot: "bg-rose-500",
                          text: "text-rose-700",
                          label: "On Hold · Dispute",
                        }
                      : project.ballInCourt === "CONTRACTOR"
                      ? {
                          dot: "bg-[var(--vt-color-orange-500,#EF5F18)]",
                          text: "text-[var(--vt-color-orange-700,#B33C08)]",
                          label: project.delayFlag || "Action Needed",
                        }
                      : {
                          dot: "bg-[var(--vt-color-green-500,#2E9E57)]",
                          text: "text-[var(--vt-color-green-700,#1F6B3E)]",
                          label: "With Client Review",
                        };

                  return (
                    <Link
                      key={project.id}
                      href={`/contractor/projects/${project.id}`}
                      className="py-4 px-2 -mx-2 rounded-lg hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/70 transition-colors group flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors truncate">
                            {project.name}
                          </h3>
                          <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                            {project.currentStage} · {project.clientName}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            style={{ fontFeatureSettings: "'tnum' 1" }}
                            className="text-xs sm:text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tabular-nums"
                          >
                            {project.escrowReceived}
                          </div>
                          <div
                            style={{ fontFeatureSettings: "'tnum' 1" }}
                            className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] tabular-nums"
                          >
                            of {project.contractValue}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="relative h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                          <div
                            style={{ width: `${project.reportedPercent}%` }}
                            className="absolute inset-y-0 left-0 rounded-full bg-[var(--vt-color-orange-200,#FDCAA9)] transition-all"
                          />
                          <div
                            style={{ width: `${project.verifiedPercent}%` }}
                            className="absolute inset-y-0 left-0 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] transition-all"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 text-[11px]">
                          <div className="flex items-center gap-3 tabular-nums">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                              <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                              {project.verifiedPercent}% Verified
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[var(--vt-color-neutral-500,#7C7894)]">
                              <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-300,#FBA674)]" />
                              {project.reportedPercent}% Reported
                            </span>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 font-semibold truncate ${statusMeta.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusMeta.dot}`} />
                            <span className="truncate">{statusMeta.label}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 mt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)] tabular-nums">
                  Showing {filteredProjects.length} of {projects.length} active sites
                </span>
                <Link
                  href="/contractor/projects"
                  className="font-bold text-[var(--vt-color-orange-700,#B33C08)] hover:underline"
                >
                  Open All Projects →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Waiting on You Cross-Role Queue */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between min-h-[360px]">
          <div className="border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-4 mb-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-wider text-[var(--vt-color-indigo-700,#43379A)] uppercase block">
                ACTION QUEUE
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight truncate mt-0.5">
                Waiting on You
              </h2>
            </div>

            {waitingItems.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] shrink-0 tabular-nums">
                {waitingItems.length} Open
              </span>
            )}
          </div>

          {waitingItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
              <div className="w-11 h-11 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-400,#A3A0B8)] flex items-center justify-center mb-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                All caught up
              </h3>
              <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-xs leading-relaxed">
                Incoming client project requests, 3-day payment confirmation tasks, and site fix requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)] flex-1 overflow-y-auto scrollbar-thin pr-1">
              {waitingItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1.5 group hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      {item.roleOwner}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.urgencyTone === "rose"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : item.urgencyTone === "orange"
                          ? "bg-amber-100 text-[var(--vt-color-indigo-950,#170F42)] border-amber-300"
                          : "bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border-[var(--vt-color-indigo-200,#D7D3F3)]"
                      }`}
                    >
                      {item.urgencyLabel}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-snug">
                    {item.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
