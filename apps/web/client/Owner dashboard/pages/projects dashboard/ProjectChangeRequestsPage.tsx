"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectChangeRequestItem } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconCheck, IconClose, IconPlus, IconShieldCheck } from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";

interface ProjectChangeRequestsPageProps {
  projectId?: string;
}

export function ProjectChangeRequestsPage({ projectId = "proj-lekki" }: ProjectChangeRequestsPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_cr_${projectId}`);
  const project = getProjectDetail(projectId);
  const storageKey = `vantaged_cr_${projectId}`;

  // Persistent Change Requests State
  const [changeRequests, setChangeRequests] = useState<ProjectChangeRequestItem[]>(project.changeRequests);
  const [selectedCRId, setSelectedCRId] = useState<string>(project.changeRequests[0]?.id || "");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChangeRequests(parsed);
          setSelectedCRId((prev) => {
            if (prev && parsed.some((c: ProjectChangeRequestItem) => c.id === prev)) return prev;
            return parsed[0].id;
          });
        }
      }
    } catch {}
  }, [storageKey]);

  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Request Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCRTitle, setNewCRTitle] = useState("");
  const [newCRReason, setNewCRReason] = useState("");
  const [newCRCost, setNewCRCost] = useState("2500000");
  const [newCRDays, setNewCRDays] = useState("4");
  const [newCRSuccess, setNewCRSuccess] = useState(false);

  const persistCR = (updated: ProjectChangeRequestItem[]) => {
    setChangeRequests(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event("vantaged_storage_update"));
      } catch {}
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const selectedCR = changeRequests.find((c) => c.id === selectedCRId) || changeRequests[0] || null;

  const totalApproved = changeRequests
    .filter((c) => c.status === "Approved")
    .reduce((acc, c) => acc + c.costImpact, 0);

  const pendingRequests = changeRequests.filter((c) => c.status === "Waiting for Your Approval");
  const approvedRequests = changeRequests.filter((c) => c.status === "Approved");

  const displayedCRs = changeRequests.filter((c) => {
    if (filterTab === "pending") return c.status === "Waiting for Your Approval";
    if (filterTab === "approved") return c.status === "Approved";
    return true;
  });

  // Approve Change Request
  const handleApprove = (id: string) => {
    const next = changeRequests.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: "Approved" as const,
        };
      }
      return c;
    });
    persistCR(next);
    showToast("Extra work approved! Updated project budget and timeline.");
  };

  // Decline Change Request
  const handleDecline = (id: string) => {
    const next = changeRequests.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: "Declined" as const,
        };
      }
      return c;
    });
    persistCR(next);
    showToast("Extra work request declined.");
  };

  // Create New Change Request
  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCRTitle.trim() || !newCRReason.trim()) return;

    const rawCost = parseInt(newCRCost.replace(/[^0-9]/g, ""), 10) || 1500000;
    const rawDays = parseInt(newCRDays, 10) || 3;
    const codeNum = changeRequests.length + 1;

    const newCR: ProjectChangeRequestItem = {
      id: `cr-${Date.now()}`,
      requestCode: `CR-2026-00${codeNum}`,
      title: newCRTitle.trim(),
      requestedBy: "Owner",
      requesterName: "Dr. James Arinze (Owner)",
      date: "Today, Just now",
      costImpact: rawCost,
      timeExtensionDays: rawDays,
      status: "Waiting for Your Approval",
      reason: newCRReason.trim(),
      breakdown: [
        { item: `${newCRTitle.trim()} - Materials & Procurement`, cost: Math.round(rawCost * 0.7) },
        { item: "Specialist Installation & Site Labor", cost: Math.round(rawCost * 0.3) },
      ],
    };

    const next = [newCR, ...changeRequests];
    persistCR(next);
    setSelectedCRId(newCR.id);
    setFilterTab("all");
    setNewCRSuccess(true);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="change-requests" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Extra Work & Changes"
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
                Extra Work
              </span>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  {pendingRequests.length} Needs Review
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Extra Work & Plan Changes
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Any added work or adjustments that increase or decrease the price or finish date.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-right">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">Approved Extra Work</span>
              <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">+{formatNaira(totalApproved)}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewCRSuccess(false);
                setNewCRTitle("");
                setNewCRReason("");
                setIsNewModalOpen(true);
              }}
              className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <IconPlus className="w-4 h-4" />
              <span>Request a Change</span>
            </button>
          </div>
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
            All Requests ({changeRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("pending")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "pending"
                ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                : "text-[var(--vt-color-orange-700,#B33C08)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)]"
            }`}
          >
            Waiting for Your Review ({pendingRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("approved")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "approved"
                ? "bg-[var(--vt-color-green-700,#1F6B3E)] text-white"
                : "text-[var(--vt-color-green-700,#1F6B3E)] hover:bg-[var(--vt-color-green-50,#E9F6EC)]"
            }`}
          >
            Approved ({approvedRequests.length})
          </button>
        </div>

        {/* ── List & Details ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
          {/* Left Column: Requests List */}
          <div className="flex flex-col gap-3">
            {displayedCRs.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                No requests match this filter.
              </div>
            ) : (
              displayedCRs.map((cr) => (
                <div
                  key={cr.id}
                  onClick={() => setSelectedCRId(cr.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col gap-2 ${
                    selectedCR?.id === cr.id
                      ? "bg-white border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-400,#FA8747)]/15"
                      : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">{cr.requestCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cr.status === "Approved"
                          ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                          : cr.status === "Declined"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                      }`}
                    >
                      {cr.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] line-clamp-2">
                    {cr.title}
                  </h4>

                  <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-[11px]">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">From {cr.requestedBy}</span>
                    <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">+{formatNaira(cr.costImpact)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right 2 Columns: Details */}
          {selectedCR ? (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">{selectedCR.requestCode}</span>
                  <h2 className="text-lg font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {selectedCR.title}
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Requested by <strong>{selectedCR.requesterName}</strong> on {selectedCR.date}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-[var(--vt-color-orange-600,#D84C0B)]">
                    +{formatNaira(selectedCR.costImpact)}
                  </span>
                  <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] block mt-0.5">
                    +{selectedCR.timeExtensionDays} extra days
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider mb-1.5">
                  Why this work is needed:
                </h4>
                <p className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-700,#46425F)] leading-relaxed">
                  {selectedCR.reason}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider mb-2">
                  Cost Breakdown:
                </h4>
                <div className="flex flex-col gap-2">
                  {(selectedCR.breakdown || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--vt-color-indigo-900,#261A66)]">{item.item}</span>
                      <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">{formatNaira(item.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Actions */}
              {selectedCR.status === "Waiting for Your Approval" ? (
                <div className="pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                    Choose whether to accept or decline this extra work.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecline(selectedCR.id)}
                      className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedCR.id)}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      <span>Approve Extra Work</span>
                    </button>
                  </div>
                </div>
              ) : selectedCR.status === "Approved" ? (
                <div className="pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2 text-xs text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                  <IconShieldCheck className="w-4 h-4" />
                  <span>This change request has been approved and incorporated into the contract schedule.</span>
                </div>
              ) : (
                <div className="pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-rose-600 font-bold">
                  This change request was declined and will not be carried out.
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Select an item to see its details.
            </div>
          )}
        </section>
      </main>

      {/* ── Working Request Change Modal ── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!newCRSuccess ? (
              <form onSubmit={handleCreateCR} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Propose Extra Work</h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">{project.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    title="Close"
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">What would you like to change?</label>
                    <input
                      type="text"
                      required
                      value={newCRTitle}
                      onChange={(e) => setNewCRTitle(e.target.value)}
                      placeholder="e.g. Upgrade master bathroom to Italian Calacatta marble"
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Estimated Cost (₦)</label>
                      <input
                        type="number"
                        min={50000}
                        step={50000}
                        required
                        value={newCRCost}
                        onChange={(e) => setNewCRCost(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Estimated Extra Days</label>
                      <input
                        type="number"
                        min={0}
                        max={60}
                        required
                        value={newCRDays}
                        onChange={(e) => setNewCRDays(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">Reason / Specification Details</label>
                    <textarea
                      rows={3}
                      required
                      value={newCRReason}
                      onChange={(e) => setNewCRReason(e.target.value)}
                      placeholder="Specify material grades, brand, thickness, or contractor installation details..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                  >
                    Submit Change Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#EF5F18)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Change Request Logged</h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  Your proposed change has been added to the project ledger. You can review, approve, or adjust quotes at any time.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewCRSuccess(false);
                    setIsNewModalOpen(false);
                    setNewCRTitle("");
                    setNewCRReason("");
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  View Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
