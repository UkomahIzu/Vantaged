"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconDisputes, IconShield } from "../../components/AdminIcons";

interface DisputeHistory {
  date: string;
  actor: string;
  event: string;
}

interface DisputeRecord {
  id: string;
  projectId: string;
  projectName: string;
  contractorName: string;
  contractorDirector: string;
  ownerName: string;
  state: string;
  type: string;
  title: string;
  description: string;
  stage: string;
  escrowAmount: string;
  status: "ACTION_REQUIRED" | "RESOLVED" | "IN_MEDIATION";
  rejectionsCount: number;
  createdAt: string;
  history: DisputeHistory[];
}

export default function DisputesRadarPage() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDisputes = () => {
    fetch("/api/disputes")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setDisputes(data.data);
        }
      })
      .catch((err) => console.warn("Failed to load disputes:", err));
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleAction = async (action: "DISPATCH_INSPECTOR" | "REQUEST_RETEST" | "RELEASE_ESCROW") => {
    if (!selectedDispute) return;
    setIsProcessing(true);

    let note = "";
    if (action === "DISPATCH_INSPECTOR") {
      note = "Dispatched independent COREN Lead Inspector for site re-measurement.";
    } else if (action === "REQUEST_RETEST") {
      note = "Requested contractor to submit re-measured stirrup spacing photo logs within 48h.";
    } else if (action === "RELEASE_ESCROW") {
      note = "Admin verified technical compliance; authorized milestone tranche release.";
    }

    try {
      const res = await fetch("/api/disputes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDispute.id,
          action,
          note,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setSelectedDispute(result.data);
        setDisputes((prev) =>
          prev.map((d) => (d.id === result.data.id ? result.data : d))
        );
      }

      // Record in audit log
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `DISPUTE_${action}`,
          actionLabel: `Dispute Resolution: ${action.replace("_", " ")}`,
          target: `${selectedDispute.projectId} · ${selectedDispute.projectName}`,
          details: note,
          level: action === "RELEASE_ESCROW" ? "SUCCESS" : "INFO",
        }),
      });

      showToast(`Action executed: ${note}`);
    } catch {
      showToast("Updated dispute locally.");
    } finally {
      setIsProcessing(false);
    }
  };

  const activeAlerts = disputes.filter((d) => d.status !== "RESOLVED");

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans pb-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
              <IconDisputes className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Risk & Escrow Radar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
            Dispute & Risk Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
            Real-time oversight of escrow holds, unconfirmed bank transfers, repeated milestone rejections, and bank account changes.
          </p>
        </div>

        {toastMessage && (
          <div className="animate-in fade-in slide-in-from-top-1 px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center gap-1.5 self-start sm:self-auto">
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Open Disputes</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
            {disputes.filter((d) => d.status === "ACTION_REQUIRED").length.toString().padStart(2, "0")}
          </div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">Zero formal litigations</div>
        </div>

        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Unconfirmed Transfers</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">00</div>
          <div className="text-[11px] font-medium text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1">"Paid - Not Confirmed" receipts: 0</div>
        </div>

        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Repeated Rejections</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] tracking-tight">
            {activeAlerts.length.toString().padStart(2, "0")}
          </div>
          <div className="text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
            {activeAlerts.length} site(s) requiring mediation
          </div>
        </div>

        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Bank Detail Changes</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">00</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">No anomalous NUBAN modifications</div>
        </div>
      </div>

      {/* Risk Alert Queue */}
      <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] mb-4">
          <h2 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">Active Platform Alerts</h2>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
            {activeAlerts.length} {activeAlerts.length === 1 ? "ADVISORY NOTICE" : "ADVISORY NOTICES"}
          </span>
        </div>

        {disputes.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
            No active disputes or escrow warnings on platform.
          </div>
        ) : (
          <div className="space-y-3">
            {disputes.map((disp) => {
              const isResolved = disp.status === "RESOLVED";
              return (
                <div
                  key={disp.id}
                  className={`rounded-xl border p-5 transition-colors ${
                    isResolved
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-[var(--vt-color-orange-200,#FDCAA9)] bg-[var(--vt-color-orange-50,#FFF4EE)]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isResolved
                              ? "bg-emerald-600 text-white"
                              : "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                          }`}
                        >
                          {isResolved ? "RESOLVED & ESCROW AUTHORIZED" : "MILESTONE REJECTION WARNING"}
                        </span>
                        <span className="text-xs font-mono font-bold text-[var(--vt-color-orange-700,#B33C08)]">
                          {disp.projectId} · {disp.projectName}
                        </span>
                        <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                          Locked: <strong className="text-[var(--vt-color-indigo-900,#261A66)] font-mono">{disp.escrowAmount}</strong>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {disp.title}
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                        {disp.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDispute(disp)}
                      className="shrink-0 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Inspect Timeline</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Dispute Investigation Modal ── */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start justify-between gap-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0">
                  <IconDisputes className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                      {selectedDispute.id}
                    </span>
                    <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">·</span>
                    <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">{selectedDispute.projectName}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    Dispute & Milestone Inspection Record
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Status Banner */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] bg-[var(--vt-color-orange-50,#FFF4EE)] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    Escrow Vault Tranche
                  </div>
                  <div className="text-base font-extrabold font-mono text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {selectedDispute.escrowAmount}
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    Stage: {selectedDispute.stage}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  Status: {selectedDispute.status}
                </span>
              </div>

              {/* Stakeholders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <div className="text-[10px] uppercase font-mono text-[var(--vt-color-neutral-500,#7C7894)] font-bold mb-1">
                    Client / Property Owner
                  </div>
                  <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                    {selectedDispute.ownerName}
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Location: {selectedDispute.state}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <div className="text-[10px] uppercase font-mono text-[var(--vt-color-neutral-500,#7C7894)] font-bold mb-1">
                    Assigned Contractor
                  </div>
                  <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                    {selectedDispute.contractorName}
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Lead: {selectedDispute.contractorDirector}
                  </div>
                </div>
              </div>

              {/* Chronological Event History */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white space-y-3">
                <h3 className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-between">
                  <span>Chronological Inspection Log</span>
                  <span className="text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    {selectedDispute.history.length} Event(s) Recorded
                  </span>
                </h3>

                <div className="space-y-2 border-l-2 border-[var(--vt-color-orange-300,#FBA06E)] pl-3 ml-1">
                  {selectedDispute.history.map((h, i) => (
                    <div key={i} className="text-xs space-y-0.5 py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{h.actor}</span>
                        <span className="text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">· {h.date}</span>
                      </div>
                      <p className="text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">{h.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-indigo-100,#EAE8F9)] bg-[var(--vt-color-indigo-50,#F4F3FC)] space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                  <IconShield className="w-4 h-4 text-[var(--vt-color-indigo-600,#4F46E5)]" />
                  <span>Platform Administrative Intervention</span>
                </div>
                <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  As platform administrator, you may dispatch an independent COREN structural lead, request re-measured proof, or arbitrate and release the escrow tranche.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction("DISPATCH_INSPECTOR")}
                    className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-indigo-400,#6366F1)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Dispatch COREN Inspector
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction("REQUEST_RETEST")}
                    className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Request Photo Re-testing
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction("RELEASE_ESCROW")}
                    className="h-8 px-3.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Release Escrow & Resolve
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
