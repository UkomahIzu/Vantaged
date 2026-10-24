"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectDisputeItem } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconCheck, IconClose, IconPlus, IconAlertTriangle, IconSend, IconShieldCheck } from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { VantagedSelect } from "../../components/VantagedSelect";

interface ProjectDisputesPageProps {
  projectId?: string;
}

export function ProjectDisputesPage({ projectId = "proj-lekki" }: ProjectDisputesPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_disputes_${projectId}`);
  const project = getProjectDetail(projectId);
  const storageKey = `vantaged_disputes_${projectId}`;

  // Persistent disputes list in client state
  const [disputes, setDisputes] = useState<ProjectDisputeItem[]>(project.disputes);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(project.disputes[0]?.id || "");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDisputes(parsed);
          setSelectedDisputeId((prev) => {
            if (prev && parsed.some((d: ProjectDisputeItem) => d.id === prev)) return prev;
            return parsed[0].id;
          });
        }
      }
    } catch {}
  }, [storageKey]);

  const [filterTab, setFilterTab] = useState<"all" | "active" | "resolved">("all");

  // Report Modal State
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [newDisputeTitle, setNewDisputeTitle] = useState("");
  const [newDisputeCategory, setNewDisputeCategory] = useState<"Quality of Work" | "Payment Issue" | "Change in Plan">("Quality of Work");
  const [newDisputeStage, setNewDisputeStage] = useState(project.stages[3]?.title || project.stages[0]?.title);
  const [newDisputeReason, setNewDisputeReason] = useState("");
  const [raiseSuccess, setRaiseSuccess] = useState(false);

  // Message input on active dispute
  const [ownerReplyText, setOwnerReplyText] = useState("");
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const persistDisputes = (updated: ProjectDisputeItem[]) => {
    setDisputes(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event("vantaged_storage_update"));
      } catch {}
    }
  };

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const selectedDispute = disputes.find((d) => d.id === selectedDisputeId) || disputes[0] || null;

  const activeDisputes = disputes.filter((d) => d.status === "Active Dispute");
  const resolvedDisputes = disputes.filter((d) => d.status === "Resolved");

  const displayedDisputes = disputes.filter((d) => {
    if (filterTab === "active") return d.status === "Active Dispute";
    if (filterTab === "resolved") return d.status === "Resolved";
    return true;
  });

  // Handle Form Submission for New Problem
  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisputeReason.trim()) return;

    // Estimate linked tranche from selected stage
    const matchedStage = project.stages.find((s) => s.title === newDisputeStage);
    const trancheAmount = matchedStage?.trancheAmount || 18450000;

    const codeNum = disputes.length + 1;
    const newDispute: ProjectDisputeItem = {
      id: `disp-${Date.now()}`,
      disputeCode: `DISP-2026-00${codeNum}`,
      title: newDisputeTitle.trim() || `Problem with ${newDisputeStage}`,
      category: newDisputeCategory,
      linkedStage: newDisputeStage,
      linkedTrancheAmount: trancheAmount,
      status: "Active Dispute",
      openedDate: "Today, Just now",
      daysRemaining: 7,
      raisedBy: "You (Building Owner)",
      whatHappened: newDisputeReason.trim(),
      builderReply: `Notice dispatched to ${project.contractor.name}. Lead engineer requested to inspect site and reply.`,
      howItWasFixed: "Payment held in escrow until rectified and approved by client.",
    };

    const next = [newDispute, ...disputes];
    persistDisputes(next);
    setSelectedDisputeId(newDispute.id);
    setFilterTab("all");
    setRaiseSuccess(true);
  };

  // Resolve Dispute
  const handleResolveDispute = (disputeId: string) => {
    const next = disputes.map((d) => {
      if (d.id === disputeId) {
        return {
          ...d,
          status: "Resolved" as const,
          howItWasFixed: "Defect rectified by contractor and verified on site by building owner. Escrow hold cleared.",
        };
      }
      return d;
    });
    persistDisputes(next);
    setShowResolveConfirm(false);
    showToast("Problem marked as Solved. Escrow payment hold has been cleared!");
  };

  // Append Owner Note
  const handleSendOwnerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerReplyText.trim() || !selectedDispute) return;

    const noteToAdd = `\n\n[Owner Update - Just now]: ${ownerReplyText.trim()}`;
    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          whatHappened: `${d.whatHappened}${noteToAdd}`,
        };
      }
      return d;
    });
    persistDisputes(next);
    setOwnerReplyText("");
    showToast("Update sent to contractor and site engineer!");
  };

  // Withdraw / Delete dispute (if reported by owner)
  const handleDeleteDispute = (disputeId: string) => {
    const next = disputes.filter((d) => d.id !== disputeId);
    persistDisputes(next);
    if (selectedDisputeId === disputeId) {
      setSelectedDisputeId(next[0]?.id || "");
    }
    showToast("Report withdrawn successfully.");
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="disputes" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Issues & Disputes"
            />
          }
        />

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── Headline Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Quality Protection
              </span>
              <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">•</span>
              <span className="text-xs font-bold text-[var(--vt-color-rose-600,#E11D48)]">
                {activeDisputes.length} Active {activeDisputes.length === 1 ? "Issue" : "Issues"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Issues & Disputes
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              If you notice poor work or a mistake on site, report it here to safely hold the stage payment until the contractor rectifies it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setRaiseSuccess(false);
              setNewDisputeTitle("");
              setNewDisputeReason("");
              setIsRaiseModalOpen(true);
            }}
            className="h-10 px-4 rounded-md bg-[var(--vt-color-rose-600,#E11D48)] hover:bg-[var(--vt-color-rose-700,#BE123C)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <IconPlus className="w-4 h-4" />
            <span>Report a Problem</span>
          </button>
        </section>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "all"
                ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)]"
            }`}
          >
            All Issues ({disputes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("active")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "active"
                ? "bg-[var(--vt-color-rose-600,#E11D48)] text-white"
                : "text-[var(--vt-color-rose-700,#BE123C)] hover:bg-[var(--vt-color-rose-50,#FFF1F2)]"
            }`}
          >
            Active Problems ({activeDisputes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("resolved")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "resolved"
                ? "bg-[var(--vt-color-green-700,#1F6B3E)] text-white"
                : "text-[var(--vt-color-green-700,#1F6B3E)] hover:bg-[var(--vt-color-green-50,#E9F6EC)]"
            }`}
          >
            Solved ({resolvedDisputes.length})
          </button>
        </div>

        {/* ── List of Issues & Details ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
          {/* Left Column: List */}
          <div className="flex flex-col gap-3">
            {displayedDisputes.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                No issues match this filter.
              </div>
            ) : (
              displayedDisputes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDisputeId(d.id)}
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
                        "Active Problem"
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
              ))
            )}
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

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      selectedDispute.status === "Resolved"
                        ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                        : "bg-[var(--vt-color-rose-50,#FFF1F2)] text-[var(--vt-color-rose-700,#BE123C)] border border-[var(--vt-color-rose-200,#FECDD3)]"
                    }`}
                  >
                    {selectedDispute.status === "Resolved" ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </>
                    ) : (
                      <>
                        <IconAlertTriangle className="w-3.5 h-3.5" />
                        <span>Payment Paused in Escrow</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* What Happened vs Builder's Reply */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--vt-color-rose-50,#FFF1F2)]/60 border border-[var(--vt-color-rose-200,#FECDD3)] flex flex-col gap-2">
                  <span className="font-extrabold text-[var(--vt-color-rose-700,#BE123C)] uppercase text-[10px]">What was reported</span>
                  <p className="text-[var(--vt-color-neutral-800,#2B283A)] leading-relaxed font-medium whitespace-pre-line">
                    {selectedDispute.whatHappened}
                  </p>
                  <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">Reported by {selectedDispute.raisedBy} on {selectedDispute.openedDate}</p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 flex flex-col gap-2">
                  <span className="font-extrabold text-blue-800 uppercase text-[10px]">Builder's reply</span>
                  <p className="text-[var(--vt-color-neutral-800,#2B283A)] leading-relaxed font-medium whitespace-pre-line">
                    {selectedDispute.builderReply}
                  </p>
                  <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">From {project.contractor.name}</p>
                </div>
              </div>

              {/* How it was fixed / Current status */}
              <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-1 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Resolution Status
                </span>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-relaxed">
                  {selectedDispute.howItWasFixed}
                </p>
              </div>

              {/* ── Working Action Controls ── */}
              {selectedDispute.status === "Active Dispute" ? (
                <div className="flex flex-col gap-3 pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  {/* Message Input form */}
                  <form onSubmit={handleSendOwnerNote} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ownerReplyText}
                      onChange={(e) => setOwnerReplyText(e.target.value)}
                      placeholder="Add an update or instructions for the contractor..."
                      className="flex-1 h-9.5 px-3.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                    <button
                      type="submit"
                      disabled={!ownerReplyText.trim()}
                      className="h-9.5 px-3.5 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
                    >
                      <IconSend className="w-3.5 h-3.5" />
                      <span>Send Note</span>
                    </button>
                  </form>

                  {/* Resolve and withdraw controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteDispute(selectedDispute.id)}
                      className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Withdraw this issue
                    </button>

                    {!showResolveConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowResolveConfirm(true)}
                        className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <IconCheck className="w-4 h-4" />
                        <span>Accept Fix & Mark as Solved</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                        <span className="text-xs font-bold text-[var(--vt-color-green-800,#17512F)]">
                          Unfreeze payment and mark solved?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleResolveDispute(selectedDispute.id)}
                          className="h-7 px-3 rounded bg-[var(--vt-color-green-700,#1F6B3E)] hover:bg-[var(--vt-color-green-800,#17512F)] text-white text-[11px] font-bold cursor-pointer shadow-xs"
                        >
                          Confirm Solved
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResolveConfirm(false)}
                          className="h-7 px-2.5 rounded bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] text-[11px] font-medium hover:bg-neutral-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs text-[var(--vt-color-green-700,#1F6B3E)]">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <IconShieldCheck className="w-4 h-4" />
                    <span>This problem has been solved and the stage payment has been cleared.</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDispute(selectedDispute.id)}
                    className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Archive
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Select an issue from the list to see the details.
            </div>
          )}
        </section>
      </main>

      {/* ── Working Report Problem Modal ── */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!raiseSuccess ? (
              <form onSubmit={handleCreateDispute} className="flex flex-col gap-4">
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
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Problem Title</label>
                    <input
                      type="text"
                      required
                      value={newDisputeTitle}
                      onChange={(e) => setNewDisputeTitle(e.target.value)}
                      placeholder="e.g. Concrete honeycombing on first floor beam"
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-rose-500,#F43F5E)]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Issue Category</label>
                    <VantagedSelect
                      value={newDisputeCategory}
                      onChange={(val) => setNewDisputeCategory(val as any)}
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]"
                      options={[
                        { value: "Quality of Work", label: "Quality of Work / Workmanship" },
                        { value: "Payment Issue", label: "Payment Issue / Milestone Dispute" },
                        { value: "Change in Plan", label: "Change in Plan / Unauthorized Deviation" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Which stage has the problem?</label>
                    <VantagedSelect
                      value={newDisputeStage}
                      onChange={(val) => setNewDisputeStage(val)}
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]"
                      options={project.stages.map((s) => ({
                        value: s.title,
                        label: `${s.title} (${formatNaira(s.trancheAmount)})`,
                      }))}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">What went wrong?</label>
                    <textarea
                      rows={3}
                      required
                      value={newDisputeReason}
                      onChange={(e) => setNewDisputeReason(e.target.value)}
                      placeholder="Explain what the builder did wrong or what needs fixing..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-rose-500,#F43F5E)]"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--vt-color-rose-50,#FFF1F2)] border border-[var(--vt-color-rose-200,#FECDD3)] text-[11px] text-[var(--vt-color-rose-700,#BE123C)]">
                    <strong>Note:</strong> Submitting this pauses the milestone disbursement in escrow until both you and the contractor inspect and resolve it.
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
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-rose-600,#E11D48)] hover:bg-[var(--vt-color-rose-700,#BE123C)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                  >
                    Submit Report & Pause Escrow
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-rose-50,#FFF1F2)] text-[var(--vt-color-rose-600,#E11D48)] border border-[var(--vt-color-rose-200,#FECDD3)] flex items-center justify-center">
                  <IconAlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Problem Reported & Listed</h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  The milestone payment has been held safely in escrow. The problem is now active in your issues list and notice has been sent to the contractor.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRaiseSuccess(false);
                    setIsRaiseModalOpen(false);
                    setNewDisputeTitle("");
                    setNewDisputeReason("");
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  View in Issues List
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
