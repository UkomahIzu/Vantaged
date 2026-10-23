"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectChangeRequestItem } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconCheck } from "./ProjectIcons";

interface ProjectChangeRequestsPageProps {
  projectId?: string;
}

export function ProjectChangeRequestsPage({ projectId = "proj-lekki" }: ProjectChangeRequestsPageProps) {
  const project = getProjectDetail(projectId);
  const [selectedCR, setSelectedCR] = useState<ProjectChangeRequestItem | null>(project.changeRequests[0] || null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const totalApproved = project.changeRequests
    .filter((c) => c.status === "Approved")
    .reduce((acc, c) => acc + c.costImpact, 0);

  const pendingCount = project.changeRequests.filter((c) => c.status === "Waiting for Your Approval").length;

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="change-requests" />

      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Extra Work & Changes"
            />
          }
        />

        {/* ── Headline Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Extra Work
              </span>
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
            {pendingCount > 0 && (
              <div className="p-3 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-right">
                <span className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase block">Waiting on You</span>
                <span className="text-base font-black text-[var(--vt-color-orange-600,#D84C0B)]">{pendingCount} Request</span>
              </div>
            )}
          </div>
        </section>

        {/* ── List & Details ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
          {/* Left Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] tracking-wider px-1">
              Work Requests ({project.changeRequests.length})
            </span>

            {project.changeRequests.map((cr) => (
              <div
                key={cr.id}
                onClick={() => setSelectedCR(cr)}
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
            ))}
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
                  {selectedCR.breakdown.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--vt-color-indigo-900,#261A66)]">{item.item}</span>
                      <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">{formatNaira(item.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCR.status === "Waiting for Your Approval" && (
                <div className="pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                  <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                    Choose whether to accept or decline this extra work.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActionDone("Declined")}
                      className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionDone("Approved")}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                    >
                      {actionDone ? (
                        <span className="inline-flex items-center gap-1.5">
                          <IconCheck className="w-3.5 h-3.5" />
                          <span>{actionDone}</span>
                        </span>
                      ) : (
                        "Approve Extra Work"
                      )}
                    </button>
                  </div>
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
    </div>
  );
}
