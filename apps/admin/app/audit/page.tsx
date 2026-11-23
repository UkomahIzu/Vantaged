"use client";

import React, { useState, useEffect } from "react";
import { IconAudit, IconSearch } from "../../components/AdminIcons";
import { useDemoMode } from "../../hooks/useDemoMode";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  actionLabel: string;
  target: string;
  details: string;
  ipAddress: string;
  level: string;
}

export default function AuditTrailPage() {
  const { isDemoMode } = useDemoMode();
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setLogs(data.data);
        } else {
          setLogs([]);
        }
      })
      .catch(() => setLogs([]));
  }, [isDemoMode]);

  const handleExportJSON = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(JSON.stringify(logs, null, 2));
      showToast("Audit trail JSON copied to clipboard!");
    }
  };

  const filtered = logs.filter((l) => {
    const matchesFilter = filterType === "ALL" ? true : l.action.includes(filterType);
    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      l.id.toLowerCase().includes(q) ||
      l.actionLabel.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans pb-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <IconAudit className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Compliance & Transparency
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">Platform Audit Trail</h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
            Cryptographically immutable activity logs recording every administrator verification, approval, rejection, and credential dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {toastMessage && (
            <div className="animate-in fade-in px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center gap-1.5">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Trail (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <IconSearch className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, target company, administrator..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white"
          />
        </div>

        {/* Filter Chips matching Owner Dashboard */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "BADGE", "AUTH", "CAC", "STAGE", "CREDENTIAL", "CONTRACTOR", "DISPUTE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === type
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                  : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              }`}
            >
              {type === "ALL" ? "All Events" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
        {filtered.length === 0 ? (
          <div className="py-14 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            {logs.length === 0 ? (
              <>
                <div className="w-11 h-11 rounded-xl bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center mb-3">
                  <IconAudit className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                  No audit events logged yet
                </p>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 leading-relaxed">
                  Compliance verifications, contractor approvals, credential dispatches, and dispute rulings will appear here automatically.
                </p>
              </>
            ) : (
              <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                No audit records match your search criteria.
              </span>
            )}
          </div>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">{log.actionLabel}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    {log.id}
                  </span>
                  {log.level === "WARNING" && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      WARNING
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">{log.timestamp}</span>
              </div>

              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed mb-2.5">
                {log.details}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">
                <div>
                  <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-semibold">Actor: </span>
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{log.actor}</span>
                </div>
                <div>
                  <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-semibold">Target: </span>
                  <span className="text-[var(--vt-color-neutral-600,#5E5A7D)]">{log.target}</span>
                </div>
                <div>
                  <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-semibold">Origin IP: </span>
                  <span>{log.ipAddress}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
