"use client";

import React, { useState } from "react";
import { IconAudit } from "../../components/AdminIcons";

export default function AuditTrailPage() {
  const [filterType, setFilterType] = useState<string>("ALL");

  const logs = [
    {
      id: "AUD-948102",
      timestamp: "Today at 09:14 WAT",
      actor: "Engr. Kenneth Adeleke (Super Admin)",
      action: "BADGE_ISSUED",
      actionLabel: "COREN License Verified & Issued",
      target: "Prestige Build & MEP Specialists (RC-1678291)",
      details: "COREN Registration COREN/R/58209 cross-verified against Council database. Granted Verified Builder privileges.",
      ipAddress: "102.89.34.19 (Lagos, NG)",
      level: "SUCCESS",
    },
    {
      id: "AUD-948088",
      timestamp: "Today at 08:31 WAT",
      actor: "Engr. Kenneth Adeleke (Super Admin)",
      action: "AUTH_LOGIN",
      actionLabel: "Admin Console Authentication",
      target: "Session: ses_01hzyq83m",
      details: "Two-Factor hardware token confirmed. Access granted to Port 3001 operations environment.",
      ipAddress: "102.89.34.19 (Lagos, NG)",
      level: "INFO",
    },
    {
      id: "AUD-947921",
      timestamp: "Yesterday at 16:40 WAT",
      actor: "Barrister Amina Bello (Compliance Officer)",
      action: "CAC_VALIDATION",
      actionLabel: "CAC Corporate Inspection Completed",
      target: "Apex Structure & Civil Engineering (RC-1849204)",
      details: "Corporate Affairs Commission status confirmed ACTIVE. TIN 23891048-0001 verified against FIRS database.",
      ipAddress: "197.210.55.82 (Abuja, NG)",
      level: "SUCCESS",
    },
    {
      id: "AUD-947814",
      timestamp: "27 Oct 2026, 14:15 WAT",
      actor: "Femi Oladipo (Disputes Arbitrator)",
      action: "STAGE_OVERRIDE_REVIEW",
      actionLabel: "Milestone Rejection Appeal Monitored",
      target: "PRJ-KN-0193 · Nassarawa Commercial Plaza",
      details: "Reviewed documentation for substructure stirrup placement. Advised contractor to provide rebar density log.",
      ipAddress: "102.88.192.12 (Lagos, NG)",
      level: "WARNING",
    },
    {
      id: "AUD-947602",
      timestamp: "26 Oct 2026, 11:05 WAT",
      actor: "Chioma Okonkwo (Support Specialist)",
      action: "CREDENTIAL_DISPATCH",
      actionLabel: "Contractor Terminal Credentials Dispatched",
      target: "Prestige Build & MEP Specialists",
      details: "Director login link dispatched to operations@prestigebuild.ng for Contractor Portal access.",
      ipAddress: "102.89.34.19 (Lagos, NG)",
      level: "INFO",
    },
  ];

  const filtered = filterType === "ALL" ? logs : logs.filter((l) => l.action.includes(filterType));

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
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

      {/* Filter Chips matching Owner Dashboard */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "BADGE", "AUTH", "CAC", "STAGE", "CREDENTIAL"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer ${
              filterType === type
                ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                : "bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
            }`}
          >
            {type === "ALL" ? "All Audit Events" : type}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
        {filtered.map((log) => (
          <div key={log.id} className="p-4 sm:p-5 hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">{log.actionLabel}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  {log.id}
                </span>
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
        ))}
      </div>
    </div>
  );
}
