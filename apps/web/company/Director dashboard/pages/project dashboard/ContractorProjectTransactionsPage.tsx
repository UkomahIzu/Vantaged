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
  ContractorProjectTranche,
  formatNairaCompact,
  formatNairaFull,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import { syncContractorReceiptConfirmedToOwner } from "../../../../shared/vantagedSyncBridge";

interface ContractorProjectTransactionsPageProps {
  projectId: string;
}

export function ContractorProjectTransactionsPage({ projectId }: ContractorProjectTransactionsPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_tx_${projectId}`);
  const project = useContractorProject(projectId);

  const [tranches, setTranches] = useState<ContractorProjectTranche[]>(project.tranches);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmTarget, setConfirmTarget] = useState<ContractorProjectTranche | null>(null);
  const [bankRefInput, setBankRefInput] = useState("");
  const [confirmFundsReceived, setConfirmFundsReceived] = useState(false);
  const [receiptTarget, setReceiptTarget] = useState<ContractorProjectTranche | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setTranches(loadProjectKey(projectId, "tranches", project.tranches));
    };
    sync();
    window.addEventListener(CONTRACTOR_STORAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONTRACTOR_STORAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [projectId, project.tranches]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const totalConfirmedNet = useMemo(
    () =>
      tranches
        .filter((t) => t.status === "Receipt Confirmed")
        .reduce((sum, t) => sum + t.netPayout, 0),
    [tranches]
  );

  const totalRetainageHeld = useMemo(
    () =>
      tranches
        .filter((t) => t.status === "Receipt Confirmed" || t.status === "Awaiting Your Confirmation")
        .reduce((sum, t) => sum + t.retainageAmount, 0),
    [tranches]
  );

  const totalInEscrow = useMemo(
    () =>
      tranches
        .filter((t) => t.status === "Held in Escrow")
        .reduce((sum, t) => sum + t.grossAmount, 0),
    [tranches]
  );

  const pendingConfirmations = tranches.filter((t) => t.status === "Awaiting Your Confirmation");

  const filteredTranches = useMemo(() => {
    if (statusFilter === "all") return tranches;
    return tranches.filter((t) => t.status === statusFilter);
  }, [tranches, statusFilter]);

  const handleConfirmReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmTarget || !confirmFundsReceived) return;

    const finalRef = bankRefInput.trim() || confirmTarget.bankSessionId || confirmTarget.reference;
    const updated = tranches.map((t) =>
      t.id === confirmTarget.id
        ? {
            ...t,
            status: "Receipt Confirmed" as const,
            bankSessionId: finalRef,
            confirmedAt: "Today",
          }
        : t
    );
    setTranches(updated);
    saveProjectKey(projectId, "tranches", updated);
    syncContractorReceiptConfirmedToOwner({
      projectId,
      stageTitle: confirmTarget.stageTitle,
      bankSessionId: finalRef,
      netPayout: confirmTarget.netPayout,
    });
    showToast(`Receipt confirmed for ${formatNairaFull(confirmTarget.netPayout)}.`);
    setConfirmTarget(null);
    setConfirmFundsReceived(false);
    setBankRefInput("");
  };

  const pillClass = (status: ContractorProjectTranche["status"]) => {
    switch (status) {
      case "Receipt Confirmed":
        return "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]";
      case "Awaiting Your Confirmation":
        return "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]";
      case "Held in Escrow":
        return "bg-indigo-50 text-[var(--vt-color-indigo-900,#261A66)] border-indigo-200";
      default:
        return "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-500,#7C7894)] border-[var(--vt-color-border-default,#E2E0EC)]";
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ContractorProjectSidebarNav projectId={project.id} activeTab="transactions" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <ContractorProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Payments & Receipts"
            />
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Headline */}
        <section className="shrink-0 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Project Payments &amp; Receipts
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Track stage payments, 5% warranty holds, and confirm bank transfers within 3 days.
            </p>
          </div>
          <div className="w-full sm:w-56 shrink-0">
            <VantagedSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Payments" },
                { value: "Awaiting Your Confirmation", label: "Needs Confirmation" },
                { value: "Receipt Confirmed", label: "Confirmed" },
                { value: "Held in Escrow", label: "Held Safely" },
                { value: "Upcoming", label: "Upcoming" },
              ]}
            />
          </div>
        </section>

        {/* 4 Financial KPI Cards */}
        <section className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Money Received
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
              {formatNairaCompact(totalConfirmedNet)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              Paid to your bank account
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
              Needs Confirmation
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
              {pendingConfirmations.length} Payment{pendingConfirmations.length === 1 ? "" : "s"}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              Confirm within 3 days
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              5% Warranty Hold
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
              {formatNairaCompact(totalRetainageHeld)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              Released after warranty period
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Money on Vantaged
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
              {formatNairaCompact(totalInEscrow)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              Held safely for next stage
            </p>
          </div>
        </section>

        {/* Payment Schedule */}
        <section className="shrink-0 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)]/70">
            <h2 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Stage Payment Schedule
            </h2>
          </div>

          <div className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/60">
            {filteredTranches.map((tranche) => (
              <div
                key={tranche.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                      {tranche.reference}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${pillClass(tranche.status)}`}>
                      {tranche.status}
                    </span>
                    {tranche.confirmDeadline && tranche.status === "Awaiting Your Confirmation" && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10.5px] font-bold">
                        {tranche.confirmDeadline}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    {tranche.stageTitle}
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Stage Total: {formatNairaFull(tranche.grossAmount)} · 5% Warranty Hold: -{formatNairaFull(tranche.retainageAmount)}
                    {tranche.disbursedDate ? ` · Sent ${tranche.disbursedDate}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="text-left lg:text-right mr-2">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                      You Receive
                    </span>
                    <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                      {formatNairaFull(tranche.netPayout)}
                    </span>
                  </div>

                  {tranche.status === "Awaiting Your Confirmation" && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmTarget(tranche);
                        setBankRefInput(tranche.bankSessionId || tranche.reference);
                        setConfirmFundsReceived(false);
                      }}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer"
                    >
                      Confirm Receipt
                    </button>
                  )}

                  {tranche.status === "Receipt Confirmed" && (
                    <button
                      type="button"
                      onClick={() => setReceiptTarget(tranche)}
                      className="h-9 px-3.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                    >
                      View Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Confirm Receipt Modal */}
      {confirmTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConfirmTarget(null)}
        >
          <form
            onSubmit={handleConfirmReceipt}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Confirm Incoming Bank Payout
            </h3>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
              Confirm receipt of <strong>{formatNairaFull(confirmTarget.netPayout)}</strong> for{" "}
              <strong>{confirmTarget.stageTitle}</strong>.
            </p>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Bank Session / NIP Reference
              </label>
              <input
                type="text"
                required
                value={bankRefInput}
                onChange={(e) => setBankRefInput(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <VantagedCheckbox
                checked={confirmFundsReceived}
                onChange={setConfirmFundsReceived}
                label="I confirm these funds have cleared in our corporate bank account"
                description="Closes the 3-day receipt confirmation window and issues an official receipt."
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confirmFundsReceived}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold cursor-pointer"
              >
                Confirm Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {receiptTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setReceiptTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-green-700,#1F6B3E)]">
                  ✓ Verified Payout Receipt
                </span>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {receiptTarget.reference}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReceiptTarget(null)}
                className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]">
              <div className="flex justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Project</span>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{project.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Stage</span>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-right max-w-[200px]">
                  {receiptTarget.stageTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Gross Tranche</span>
                <span className="font-bold">{formatNairaFull(receiptTarget.grossAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">5% Warranty Hold</span>
                <span className="font-bold">-{formatNairaFull(receiptTarget.retainageAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">Net Settled</span>
                <span className="font-black text-[var(--vt-color-green-700,#1F6B3E)]">
                  {formatNairaFull(receiptTarget.netPayout)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] pt-1">
                <span>Confirmed Date</span>
                <span>{receiptTarget.confirmedAt || "Confirmed"}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setReceiptTarget(null)}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] text-white font-bold cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
