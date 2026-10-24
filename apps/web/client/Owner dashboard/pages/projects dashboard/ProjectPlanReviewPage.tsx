"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav } from "../../components/SidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail } from "./projectData";
import {
  IconCheck,
  IconClose,
  IconLock,
  IconShieldCheck,
  IconArrowRight,
  IconAlertTriangle,
  IconDownload,
  IconPrinter,
} from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";

import { acceptProposedPlan } from "./projectStore";

interface ProjectPlanReviewPageProps {
  projectId?: string;
}

export function ProjectPlanReviewPage({ projectId = "proj-lekki" }: ProjectPlanReviewPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_plan_review_${projectId}`);
  const router = useRouter();
  const project = getProjectDetail(projectId);

  const storageKey = `vantaged_plan_status_${projectId}`;
  const feedbackKey = `vantaged_plan_feedback_${projectId}`;

  const [planStatus, setPlanStatus] = useState<"PROPOSED" | "ACCEPTED" | "CHANGES_REQUESTED">("PROPOSED");
  const [changeFeedback, setChangeFeedback] = useState<string>("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && (saved === "PROPOSED" || saved === "ACCEPTED" || saved === "CHANGES_REQUESTED")) {
        setPlanStatus(saved);
      }
      const savedFb = localStorage.getItem(feedbackKey);
      if (savedFb) {
        setChangeFeedback(savedFb);
      }
    } catch {}
  }, [storageKey, feedbackKey]);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  const formatNaira = (val: number) => {
    if (val >= 1000000000) {
      return `₦${(val / 1000000000).toFixed(2)}B`;
    }
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const depositAmount = project.contractValue * 0.1; // 10% mobilization deposit
  const retentionAmount = project.contractValue * 0.05; // 5% retention
  const stageWeightsTotal = project.stages.reduce((acc, s) => acc + s.weightPercent, 0);

  const handleAcceptPlan = () => {
    setPlanStatus("ACCEPTED");
    acceptProposedPlan(projectId);
  };

  const handleRequestChanges = () => {
    if (!changeFeedback.trim()) return;
    setPlanStatus("CHANGES_REQUESTED");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, "CHANGES_REQUESTED");
        localStorage.setItem(feedbackKey, changeFeedback.trim());
      } catch {}
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <SidebarNav currentActiveItem="projects" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <div className="flex items-center gap-2.5">
              <Link
                href="/owner/projects"
                title="Back to Projects"
                className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </Link>
              <div className="flex items-center gap-1.5 text-xs">
                <Link href="/owner/projects" className="text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] font-semibold transition-colors">
                  Projects
                </Link>
                <span className="text-[var(--vt-color-neutral-300,#CBC8DA)] font-medium">/</span>
                <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-semibold">Plan & Contract</span>
                <span className="text-[var(--vt-color-neutral-300,#CBC8DA)] font-medium">/</span>
                <span className="text-[var(--vt-color-indigo-900,#261A66)] font-bold truncate max-w-[220px]">
                  {project.title}
                </span>
              </div>
            </div>
          }
        />

        {/* ── Top Proposal Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Pre-Construction Agreement
              </span>
              <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">•</span>
              <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                Proposed by {project.contractor.name}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Building Plan & Payment Agreement
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 max-w-2xl leading-relaxed">
              Review the building stages, dates, and payment breakdown sent by your builder before construction begins. When you accept, the agreement locks safely and work starts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-10 px-3.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <IconPrinter className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>

            {planStatus === "PROPOSED" && (
              <>
                <button
                  type="button"
                  onClick={() => setIsChangeModalOpen(true)}
                  className="h-10 px-3.5 rounded-lg bg-white border border-[var(--vt-color-orange-300,#FBA674)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-xs font-bold text-[var(--vt-color-orange-800,#8F320D)] transition-colors cursor-pointer"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsAcceptModalOpen(true)}
                  className="h-10 px-4 rounded-lg bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Accept Plan & Lock</span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* ── Status Banner ── */}
        {planStatus === "ACCEPTED" ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--vt-color-green-900,#0F331E)] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-green-600,#248246)] text-white flex items-center justify-center shrink-0 shadow-xs">
                <IconCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-sm text-[var(--vt-color-green-950,#061F10)] block">
                  Plan Accepted & Agreement Locked (Version 1.0)
                </span>
                <span className="text-[11.5px] text-[var(--vt-color-green-800,#17512F)]">
                  The building plan is now active. This project has moved into your <strong>Active Projects</strong> section.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Link
                href="/owner/projects?tab=active"
                className="h-9 px-3.5 rounded-lg bg-white border border-[var(--vt-color-green-300,#81C792)] hover:bg-[var(--vt-color-green-50,#E9F6EC)] text-xs font-bold text-[var(--vt-color-green-800,#17512F)] transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Active Projects</span>
              </Link>
              <Link
                href={`/owner/projects/${project.id}`}
                className="h-9 px-4 rounded-lg bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>Open Project Dashboard</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : planStatus === "CHANGES_REQUESTED" ? (
          <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center gap-2 text-xs text-[var(--vt-color-orange-900,#722306)]">
            <IconAlertTriangle className="w-5 h-5 text-[var(--vt-color-orange-600,#D84C0B)] shrink-0" />
            <span>
              <strong>Changes Requested:</strong> Your feedback has been sent to {project.contractor.name}. The builder is revising the stages and will send an updated proposal.
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0">
                <IconShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] block">
                  Proposal Submitted by {project.contractor.name}
                </span>
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Director: {project.contractor.directorName} • Sent on 15 Jan 2026
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">Review Status</span>
              <span className="font-bold text-[var(--vt-color-orange-700,#B33C08)]">Awaiting Your Acceptance</span>
            </div>
          </div>
        )}

        {/* ── Key Contract Numbers ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Total Contract Price
            </span>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
              {formatNaira(project.contractValue)}
            </div>
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 block">
              100% of building budget
            </span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Mobilisation Deposit (10%)
            </span>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
              {formatNaira(depositAmount)}
            </div>
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 block">
              Due when plan is accepted
            </span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Total Stages & Weights
            </span>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
              {project.stages.length} Stages ({stageWeightsTotal}%)
            </div>
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 block">
              All 6 milestones mapped (100%)
            </span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Retention Holdback (5%)
            </span>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
              {formatNaira(retentionAmount)}
            </div>
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 block">
              Held until final handover
            </span>
          </div>
        </section>

        {/* ── Proposed Stages Review Table ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden flex flex-col pb-6">
          <div className="p-5 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                Proposed Stages & Checklists
              </h3>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                Every stage must have clear target dates, inspection criteria, and minimum proof requirements before locking.
              </p>
            </div>
            <span className="text-xs font-bold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] px-3 py-1 rounded-full border border-[var(--vt-color-green-200,#A3D9B1)] self-start sm:self-auto">
              Total Weight: 100%
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[780px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                  <th className="py-3 px-4">Stage # & Description</th>
                  <th className="py-3 px-4 text-center">Weight</th>
                  <th className="py-3 px-4 text-right">Tranche Amount</th>
                  <th className="py-3 px-4">Planned Timeline</th>
                  <th className="py-3 px-4">Checklist Items</th>
                  <th className="py-3 px-4">Proof Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                {project.stages.map((stg) => {
                  const isExpanded = expandedStageId === stg.id;
                  return (
                    <React.Fragment key={stg.id}>
                      <tr
                        onClick={() => setExpandedStageId(isExpanded ? null : stg.id)}
                        className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold text-xs flex items-center justify-center text-[var(--vt-color-indigo-900,#261A66)] shrink-0 mt-0.5">
                              {stg.stageNumber}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors block">
                                {stg.title}
                              </span>
                              {stg.description && (
                                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] line-clamp-1 max-w-sm mt-0.5">
                                  {stg.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                          {stg.weightPercent}%
                        </td>

                        <td className="py-3.5 px-4 text-right font-black text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                          {formatNaira(stg.trancheAmount)}
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span>{stg.startDate}</span>
                          <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] mx-1">→</span>
                          <span>{stg.targetEndDate}</span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px]">
                          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1">
                            <span>{stg.checklist.length} checklist items</span>
                            <span className="text-[10px] text-[var(--vt-color-orange-600,#D84C0B)] font-medium">
                              {isExpanded ? "(Hide)" : "(View)"}
                            </span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span className="inline-flex items-center gap-1 text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                            <IconCheck className="w-3 h-3" />
                            <span>Min 3 GPS Photos</span>
                          </span>
                        </td>
                      </tr>

                      {/* Expandable Checklist Details Row */}
                      {isExpanded && (
                        <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 animate-in fade-in duration-150">
                          <td colSpan={6} className="py-3.5 px-6">
                            <div className="flex flex-col gap-2">
                              <span className="font-bold text-[11px] text-[var(--vt-color-indigo-900,#261A66)] uppercase tracking-wider">
                                Required Inspection Checklist for Stage {stg.stageNumber}:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {stg.checklist.map((item, idx) => (
                                  <div
                                    key={item.id || idx}
                                    className="p-2.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] flex items-start gap-2"
                                  >
                                    <span className="w-4 h-4 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span className="text-xs text-[var(--vt-color-neutral-700,#484564)] font-medium">
                                      {item.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Agreed Payment Structure Breakdown ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4 pb-8">
          <div className="border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-3">
            <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
              Agreed Payment Structure Breakdown
            </h3>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              A secure escrow structure combining upfront mobilization, milestone disbursements, and a 5% quality hold.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col justify-between">
              <div>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] block">
                  1. Mobilisation Deposit (10%)
                </span>
                <p className="text-[11.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                  Due upfront before Stage 1 starts. Enables contractor to mobilize plant, iron rods, and site crew.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] text-right">
                <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(depositAmount)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col justify-between">
              <div>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] block">
                  2. Stage Tranche Releases (85%)
                </span>
                <p className="text-[11.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                  Distributed across 6 stages. Each payment is released only after you verify the completed work.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] text-right">
                <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(project.contractValue * 0.85)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col justify-between">
              <div>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] block">
                  3. Retention Hold (5%)
                </span>
                <p className="text-[11.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                  Withheld safely in escrow during construction. Released at final key handover after defects check.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] text-right">
                <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(retentionAmount)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── ACCEPT PLAN MODAL ── */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Accept Building Plan
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Confirm plan lock and mobilize construction
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              By accepting, the proposed {project.stages.length} stages, dates, weights, and payment structure will <strong>lock together</strong> into Official Agreement Version 1.0. Future changes will require a formal Change Request.
            </p>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-xs text-[var(--vt-color-green-900,#0F331E)]">
              <span className="font-bold block">Next step after acceptance:</span>
              <span>The 10% mobilization deposit ({formatNaira(depositAmount)}) will fall due into your project escrow vault so the builder can start Stage 1.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAcceptPlan();
                  setIsAcceptModalOpen(false);
                }}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors inline-flex items-center gap-1.5"
              >
                <IconCheck className="w-4 h-4" />
                <span>Confirm & Lock Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUEST CHANGES MODAL ── */}
      {isChangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-orange-900,#722306)]">
                  Request Plan Changes
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Send comments back to {project.contractor.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsChangeModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label htmlFor="plan-feedback" className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                What changes are needed?
              </label>
              <textarea
                id="plan-feedback"
                rows={4}
                value={changeFeedback}
                onChange={(e) => setChangeFeedback(e.target.value)}
                placeholder="E.g., Please adjust the mobilization deposit to 5% and extend Stage 2 finish date by 10 days..."
                className="w-full p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-900,#191530)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/20"
              />
              <span className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                The contractor will be notified to adjust dates/payments and send an updated proposal.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsChangeModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRequestChanges();
                  setIsChangeModalOpen(false);
                }}
                disabled={!changeFeedback.trim()}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
              >
                Send Feedback to Builder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
