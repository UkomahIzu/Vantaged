"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { DEMO_TEAM_MEMBERS, DirectorTeamSummary } from "../data/directorData";

export function DirectorBottomSummary() {
  const { isDemoMode } = useDirectorDemoMode();
  const [savedTeam, setSavedTeam] = useState<DirectorTeamSummary[]>([]);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("vantaged_director_team");
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) {
          setSavedTeam(
            parsed.map((m: any) => ({
              id: m.id,
              name: m.name,
              role: m.role,
              assignedSites: m.assignedSites ?? 0,
              points: m.points ?? 0,
              status: m.status === "ON_SITE" ? "ON_SITE" : "ACTIVE",
            }))
          );
        }
      } catch {
        setSavedTeam([]);
      }
    };
    sync();
    window.addEventListener("vantaged_storage_update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vantaged_storage_update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const team = isDemoMode ? DEMO_TEAM_MEMBERS : savedTeam;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full select-none font-sans">
      {/* Left: Staff, Crew & Worker Rewards Snapshot (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Team Roles & Crew Rewards
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                Unlimited Site Managers, Office Coordinators, and Crew Members with verified points
              </p>
            </div>
          </div>

          <Link
            href="/contractor/team"
            className="h-9 px-3.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
          >
            Manage Team →
          </Link>
        </div>

        {team.length === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
              No additional staff members added yet
            </h3>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 leading-relaxed">
              Invite your Site Managers, Office Coordinators, and site Crew Members at zero per-seat cost and assign them directly to company projects.
            </p>
            <Link
              href="/contractor/team"
              className="mt-4 h-9 px-4 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white flex items-center transition-all shadow-[0_2px_8px_rgba(179,60,8,0.28)]"
            >
              Invite Staff & Crew
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
            {team.map((member) => (
              <div
                key={member.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs flex items-center justify-center shrink-0">
                    {member.name.replace(/^(Engr\.|Arch\.|QS)\s+/i, "").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                      {member.role} · {member.assignedSites} assigned site(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {member.role !== "Director" && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] tabular-nums">
                      {member.points} pts
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status === "ON_SITE"
                        ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                        : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    {member.status === "ON_SITE" ? "GPS Checked In" : "Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Verification Badges, Bank Safety Lock & Billing Quota (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Company Compliance & Bank
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                Director-only verification, badges & NUBAN lock
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                Verification & Badges
              </div>
              <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                {isDemoMode
                  ? "CAC Active · COREN & BPP verified (Renews Nov 2027)"
                  : "Upload CAC, TIN, Director NIN & optional COREN license"}
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                isDemoMode
                  ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                  : "bg-amber-100 text-[var(--vt-color-indigo-950,#170F42)] border border-amber-300"
              }`}
            >
              {isDemoMode ? "VERIFIED" : "ACTION NEEDED"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                Settlement Bank Account
              </div>
              <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                {isDemoMode
                  ? "Zenith Bank · ****4821 · Matches CAC name (48h Lock)"
                  : "Add corporate NUBAN matching CAC registration"}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)] shrink-0">
              {isDemoMode ? "LOCKED" : "UNSET"}
            </span>
          </div>
        </div>

        <Link
          href="/contractor/settings"
          className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs"
        >
          Open Company Settings & Billing →
        </Link>
      </div>
    </section>
  );
}
