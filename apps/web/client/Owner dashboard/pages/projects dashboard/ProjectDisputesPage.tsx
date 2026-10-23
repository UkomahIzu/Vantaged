"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectDisputeItem } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconCheck, IconClose, IconPlus, IconAlertTriangle } from "./ProjectIcons";

interface ProjectDisputesPageProps {
  projectId?: string;
}

export function ProjectDisputesPage({ projectId = "proj-lekki" }: ProjectDisputesPageProps) {
  const project = getProjectDetail(projectId);
  const [selectedDispute, setSelectedDispute] = useState<ProjectDisputeItem | null>(project.disputes[0] || null);
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [newDisputeStage, setNewDisputeStage] = useState(project.stages[3]?.title || project.stages[0]?.title);
  const [newDisputeReason, setNewDisputeReason] = useState("");
  const [raiseSuccess, setRaiseSuccess] = useState(false);

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const activeDisputes = project.disputes.filter((d) => d.status === "Active Dispute");
  const resolvedDisputes = project.disputes.filter((d) => d.status === "Resolved");

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="disputes" />

      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Issues & Disputes"
            />
          }
        />

        {/* ── Headline Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Quality Protection
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Issues & Disputes
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              If you notice poor work or a mistake on site that the builder refuses to fix, you can pause the payment here until it is sorted out.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRaiseModalOpen(true)}
            className="h-10 px-4 rounded-md bg-[var(--vt-color-rose-600,#E11D48)] hover:bg-[var(--vt-color-rose-700,#BE123C)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <IconPlus className="w-4 h-4" />
            <span>Report a Problem</span>
          </button>
        </section>

        {/* ── List of Issues & Details ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
          {/* Left Column: List */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] tracking-wider px-1">
              Reported Issues ({project.disputes.length})
            </span>

            {project.disputes.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDispute(d)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col gap-2 ${
                  selectedDispute?.id === d.id
                    ? "bg-white border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-400,#FA8747)]/15"
                    : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">{d.disputeCode}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === "Resolved"
                        ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                        : "bg-[var(--vt-color-rose-50,#FFF1F2)] text-[var(--vt-color-rose-700,#BE123C)] border border-[var(--vt-color-rose-200,#FECDD3)]"
                    }`}
                  >
                    {d.status === "Resolved" ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCheck className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      "Active"
                    )}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] line-clamp-2">
                  {d.title}
                </h4>

                <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  <span>{d.category}</span>
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(d.linkedTrancheAmount)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right 2 Columns: Selected Issue Details */}
          {selectedDispute ? (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">{selectedDispute.disputeCode}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedDispute.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    {selectedDispute.title}
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Stage: <strong>{selectedDispute.linkedStage}</strong> • Payment on hold: <strong>{formatNaira(selectedDispute.linkedTrancheAmount)}</strong>
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] self-start sm:self-auto inline-flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>{selectedDispute.status}</span>
                </span>
              </div>

              {/* What Happened vs Builder's Reply */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--vt-color-rose-50,#FFF1F2)]/60 border border-[var(--vt-color-rose-200,#FECDD3)] flex flex-col gap-2">
                  <span className="font-extrabold text-[var(--vt-color-rose-700,#BE123C)] uppercase text-[10px]">What was reported</span>
                  <p className="text-[var(--vt-color-neutral-800,#2B283A)] leading-relaxed font-medium">
                    {selectedDispute.whatHappened}
                  </p>
                  <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">Reported by {selectedDispute.raisedBy} on {selectedDispute.openedDate}</p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 flex flex-col gap-2">
                  <span className="font-extrabold text-blue-800 uppercase text-[10px]">Builder's reply</span>
                  <p className="text-[var(--vt-color-neutral-800,#2B283A)] leading-relaxed font-medium">
                    {selectedDispute.builderReply}
                  </p>
                  <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">From Julius B. Consortium</p>
                </div>
              </div>

              {/* How it was fixed */}
              <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-1 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  How it was sorted out
                </span>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-relaxed">
                  {selectedDispute.howItWasFixed}
                </p>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Select an issue from the list to see the details.
            </div>
          )}
        </section>
      </main>

      {/* Report Modal */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!raiseSuccess ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-rose-700,#BE123C)]">Report a Problem on Site</h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">{project.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRaiseModalOpen(false)}
                    title="Close"
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Which stage has the problem?</label>
                    <select
                      value={newDisputeStage}
                      onChange={(e) => setNewDisputeStage(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]"
                    >
                      {project.stages.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">What went wrong?</label>
                    <textarea
                      rows={3}
                      value={newDisputeReason}
                      onChange={(e) => setNewDisputeReason(e.target.value)}
                      placeholder="Explain what the builder did wrong or what needs fixing..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsRaiseModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setRaiseSuccess(true)}
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-rose-600,#E11D48)] hover:bg-[var(--vt-color-rose-700,#BE123C)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-rose-50,#FFF1F2)] text-[var(--vt-color-rose-600,#E11D48)] border border-[var(--vt-color-rose-200,#FECDD3)] flex items-center justify-center">
                  <IconAlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Problem Reported</h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  The stage payment has been paused and notice has been sent to the builder to respond and fix it.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRaiseSuccess(false);
                    setIsRaiseModalOpen(false);
                    setNewDisputeReason("");
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
