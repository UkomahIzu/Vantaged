"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DirectorHeaderBar } from "../../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../../client/Owner dashboard/components/VantagedSelect";
import { ContractorProjectSidebarNav } from "./ContractorProjectSidebarNav";
import { ContractorProjectBreadcrumb } from "./ContractorProjectBreadcrumb";
import { VantagedCheckbox } from "./VantagedCheckbox";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorVariationRequest,
  formatNairaCompact,
  formatNairaFull,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import {
  SHARED_SYNC_EVENT,
  syncContractorVariationToOwner,
} from "../../../../shared/vantagedSyncBridge";

interface ContractorProjectChangeRequestsPageProps {
  projectId: string;
}

export function ContractorProjectChangeRequestsPage({ projectId }: ContractorProjectChangeRequestsPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_cr_${projectId}`);
  const project = useContractorProject(projectId);

  const [variations, setVariations] = useState<ContractorVariationRequest[]>(project.variations);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Builder Quote Modal State (for Owner-initiated "Needs Builder Quote" requests)
  const [quoteTarget, setQuoteTarget] = useState<ContractorVariationRequest | null>(null);
  const [quoteCostInput, setQuoteCostInput] = useState("");
  const [quoteDaysInput, setQuoteDaysInput] = useState("3");
  const [quoteBoqInput, setQuoteBoqInput] = useState("");

  // New Variation Form State
  const [title, setTitle] = useState("");
  const [linkedStage, setLinkedStage] = useState(project.stages[0]?.title || "Stage 1");
  const [category, setCategory] = useState<ContractorVariationRequest["category"]>("Scope Addition");
  const [costImpactInput, setCostImpactInput] = useState("2500000");
  const [timelineDaysInput, setTimelineDaysInput] = useState("3");
  const [reason, setReason] = useState("");
  const [boqBreakdown, setBoqBreakdown] = useState("");
  const [confirmWaitApproval, setConfirmWaitApproval] = useState(false);

  useEffect(() => {
    if (project.stages[0]?.title) {
      setLinkedStage((prev) =>
        project.stages.some((s) => s.title === prev) ? prev : project.stages[0]!.title
      );
    }
  }, [project.stages]);

  useEffect(() => {
    const sync = () => {
      setVariations(loadProjectKey(projectId, "variations", project.variations));
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
  }, [projectId, project.variations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const filteredVariations = useMemo(() => {
    if (statusFilter === "all") return variations;
    return variations.filter((v) => v.status === statusFilter);
  }, [variations, statusFilter]);

  const approvedTotal = variations
    .filter((v) => v.status === "Approved")
    .reduce((sum, v) => sum + v.costImpact, 0);
  const pendingTotal = variations
    .filter((v) => v.status === "Awaiting Owner Approval")
    .reduce((sum, v) => sum + v.costImpact, 0);

  const handleSubmitVariation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !confirmWaitApproval) return;

    const parsedCost = parseInt(costImpactInput.replace(/[^0-9-]/g, ""), 10) || 0;
    const parsedDays = parseInt(timelineDaysInput, 10) || 0;

    const newVO: ContractorVariationRequest = {
      id: `var-${Date.now()}`,
      code: `VO-2026-0${variations.length + 1}`,
      title: title.trim(),
      linkedStage,
      category,
      costImpact: parsedCost,
      timelineDays: parsedDays,
      status: "Awaiting Owner Approval",
      submittedAt: "Just now",
      reason: reason.trim() || "Proposed scope variation submitted by contractor.",
      boqBreakdown: boqBreakdown.trim() || "Detailed BOQ pricing attached.",
    };

    const next = [newVO, ...variations];
    setVariations(next);
    saveProjectKey(projectId, "variations", next);
    syncContractorVariationToOwner({
      projectId,
      id: newVO.id,
      code: newVO.code,
      title: newVO.title,
      linkedStage: newVO.linkedStage,
      costImpact: newVO.costImpact,
      timelineDays: newVO.timelineDays,
      reason: newVO.reason,
      boqBreakdown: newVO.boqBreakdown,
      requestedBy: "Contractor",
    });

    setTitle("");
    setReason("");
    setBoqBreakdown("");
    setConfirmWaitApproval(false);
    setIsNewModalOpen(false);
    showToast(`Variation ${newVO.code} sent to ${project.client.name} for approval.`);
  };

  const openQuoteModal = (vo: ContractorVariationRequest) => {
    setQuoteTarget(vo);
    setQuoteCostInput(vo.costImpact > 0 ? String(vo.costImpact) : "");
    setQuoteDaysInput(String(vo.timelineDays || 3));
    setQuoteBoqInput(vo.boqBreakdown || "");
  };

  const handleSubmitBuilderQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteTarget) return;
    const parsedCost = parseInt(quoteCostInput.replace(/[^0-9-]/g, ""), 10) || 0;
    const parsedDays = Math.max(0, parseInt(quoteDaysInput, 10) || 0);
    const quoted: ContractorVariationRequest = {
      ...quoteTarget,
      status: "Awaiting Owner Approval",
      costImpact: parsedCost,
      timelineDays: parsedDays,
      boqBreakdown:
        quoteBoqInput.trim() ||
        quoteTarget.boqBreakdown ||
        "Detailed contractor pricing & materials breakdown attached.",
    };
    const next = variations.map((item) => (item.id === quoteTarget.id ? quoted : item));
    setVariations(next);
    saveProjectKey(projectId, "variations", next);
    syncContractorVariationToOwner({
      projectId,
      id: quoted.id,
      code: quoted.code,
      title: quoted.title,
      linkedStage: quoted.linkedStage,
      costImpact: quoted.costImpact,
      timelineDays: quoted.timelineDays,
      reason: quoted.reason,
      boqBreakdown: quoted.boqBreakdown,
      requestedBy: "Owner",
    });
    setQuoteTarget(null);
    showToast(`Sent quote (${formatNairaFull(parsedCost)}, +${parsedDays}d) to ${project.client.name}.`);
  };

  const statusPill = (status: ContractorVariationRequest["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]";
      case "Declined":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]";
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ContractorProjectSidebarNav projectId={project.id} activeTab="change-requests" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <ContractorProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Change Requests"
            />
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Headline */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Extra Work &amp; Cost Changes
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Request approval for extra work, material upgrades, or timeline adjustments before starting them.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setConfirmWaitApproval(false);
              setIsNewModalOpen(true);
            }}
            className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer shrink-0"
          >
            + Request Extra Work
          </button>
        </section>

        {/* Summary Strip & Filter */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Adjusted Contract Total
            </span>
            <p className="text-xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
              {formatNairaCompact(project.contractValue + approvedTotal)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Includes +{formatNairaCompact(approvedTotal)} approved extra work
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-orange-600,#D84C0B)]">
              Pending Owner Approval
            </span>
            <p className="text-xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
              +{formatNairaCompact(pendingTotal)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex items-center">
            <VantagedSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: `Filter: All (${variations.length})` },
                { value: "Needs Builder Quote", label: "Owner Requests (Quote Needed)" },
                { value: "Awaiting Owner Approval", label: "Awaiting Owner Approval" },
                { value: "Approved", label: "Approved" },
                { value: "Declined", label: "Declined" },
              ]}
            />
          </div>
        </section>

        {/* Variations Cards */}
        <section className="space-y-4">
          {filteredVariations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-10 text-center">
              <p className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                No change requests recorded yet
              </p>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                Submit a variation order anytime scope, materials, or site conditions change.
              </p>
            </div>
          ) : (
            filteredVariations.map((vo) => (
              <div
                key={vo.id}
                className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {vo.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {vo.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${statusPill(vo.status)}`}>
                        {vo.status}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      {vo.title}
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      Linked Stage: <strong>{vo.linkedStage}</strong> · Submitted {vo.submittedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="px-3.5 py-2 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-right">
                      <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                        Cost Impact
                      </span>
                      <span className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                        {vo.costImpact >= 0 ? "+" : ""}
                        {formatNairaFull(vo.costImpact)}
                      </span>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-right">
                      <span className="text-[10px] font-bold uppercase text-[var(--vt-color-orange-700,#B33C08)] block">
                        Schedule
                      </span>
                      <span className="text-sm font-black text-[var(--vt-color-orange-600,#D84C0B)]">
                        +{vo.timelineDays} days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                  <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-0.5">
                      Reason / Scope Note
                    </span>
                    <p className="text-[var(--vt-color-neutral-700,#443E63)]">{vo.reason}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-0.5">
                      Cost Breakdown
                    </span>
                    <p className="text-[var(--vt-color-neutral-700,#443E63)]">{vo.boqBreakdown}</p>
                  </div>
                </div>

                {vo.ownerNote && (
                  <p className="text-xs font-semibold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] rounded-xl px-3.5 py-2">
                    Owner Note: {vo.ownerNote}
                  </p>
                )}

                {vo.status === "Needs Builder Quote" && (
                  <div className="flex justify-end pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                    <button
                      type="button"
                      onClick={() => openQuoteModal(vo)}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer"
                    >
                      Enter Quote &amp; Send to Owner
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      {/* Builder Quote Modal for Owner-Initiated Change Requests */}
      {quoteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuoteTarget(null)}
        >
          <form
            onSubmit={handleSubmitBuilderQuote}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--vt-color-orange-600,#D84C0B)]">
                  {quoteTarget.code} · Owner Request
                </span>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  Submit Contractor Quote
                </h3>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Enter your price, schedule impact, and cost breakdown for &ldquo;{quoteTarget.title}&rdquo;.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuoteTarget(null)}
                className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Quoted Cost Impact (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={quoteCostInput}
                  onChange={(e) => setQuoteCostInput(e.target.value)}
                  placeholder="e.g. 3500000"
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Extra Days Needed *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={quoteDaysInput}
                  onChange={(e) => setQuoteDaysInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                BOQ / Materials &amp; Labor Breakdown *
              </label>
              <textarea
                rows={3}
                required
                value={quoteBoqInput}
                onChange={(e) => setQuoteBoqInput(e.target.value)}
                placeholder="Break down materials, labor, and equipment costs for the property owner..."
                className="w-full p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setQuoteTarget(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer"
              >
                Send Quote to Owner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Variation Modal */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewModalOpen(false)}
        >
          <form
            onSubmit={handleSubmitVariation}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Propose Scope / BOQ Variation
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Send a formal variation order to {project.client.name} with clear pricing and schedule impact.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Variation Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Upgrade Ground-Floor Windows to Double-Glazed Aluminum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Affected Stage
                </label>
                <VantagedSelect
                  value={linkedStage}
                  onChange={setLinkedStage}
                  options={project.stages.map((s) => s.title)}
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Variation Type
                </label>
                <VantagedSelect
                  value={category}
                  onChange={(val) => setCategory(val as ContractorVariationRequest["category"])}
                  options={["Scope Addition", "Material Upgrade", "Site Condition", "Design Revision"]}
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Cost Impact (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={costImpactInput}
                  onChange={(e) => setCostImpactInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Extra Timeline Days
                </label>
                <input
                  type="number"
                  min={0}
                  max={90}
                  value={timelineDaysInput}
                  onChange={(e) => setTimelineDaysInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                BOQ Materials &amp; Labor Breakdown *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Itemize material rates, quantities, and labor cost..."
                value={boqBreakdown}
                onChange={(e) => setBoqBreakdown(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Justification
              </label>
              <textarea
                rows={2}
                placeholder="Explain why this change is recommended or requested..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <VantagedCheckbox
                checked={confirmWaitApproval}
                onChange={setConfirmWaitApproval}
                label="We will wait for written owner approval before executing extra-cost work"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confirmWaitApproval}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold cursor-pointer"
              >
                Send to Owner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
