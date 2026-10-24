"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectStage } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconArrowRight, IconCheck, IconClose } from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { markProjectAsCompleted } from "./projectStore";

interface ProjectStagesPageProps {
  projectId?: string;
}

export function ProjectStagesPage({ projectId = "proj-lekki" }: ProjectStagesPageProps) {
  const router = useRouter();
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_stages_${projectId}`);
  const project = getProjectDetail(projectId);
  const storageKey = `vantaged_stages_${projectId}`;

  const [stages, setStages] = useState<ProjectStage[]>(project.stages);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStages(parsed);
        }
      }
    } catch {}
  }, [storageKey]);

  const persistStages = (updated: ProjectStage[]) => {
    setStages(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event("vantaged_storage_update"));
      } catch {}
    }
  };

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<ProjectStage | null>(null);
  const [isApproveSuccess, setIsApproveSuccess] = useState(false);

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const filteredStages = stages.filter((s) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "approved") return s.status === "Approved";
    if (filterStatus === "review") return s.status === "Ready for Review";
    if (filterStatus === "scheduled") return s.status === "Scheduled";
    return true;
  });

  const approvedCount = stages.filter((s) => s.status === "Approved").length;
  const reviewCount = stages.filter((s) => s.status === "Ready for Review").length;
  const scheduledCount = stages.filter((s) => s.status === "Scheduled").length;
  const isCompleted = approvedCount === stages.length || project.verifiedProgress >= 100 || project.status === "Completed";
  const progressPercent = isCompleted ? 100 : Math.round((approvedCount / stages.length) * 100);

  const handleApproveCurrentStage = () => {
    if (!selectedStage) return;
    const next = stages.map((s) => {
      if (s.id === selectedStage.id) {
        return {
          ...s,
          status: "Approved" as const,
          completedDate: "Today",
          verifiedBy: "Dr. James Arinze (Owner)",
        };
      }
      return s;
    });
    persistStages(next);
    if (next.every((s) => s.status === "Approved")) {
      markProjectAsCompleted(projectId);
    }
    setIsApproveSuccess(true);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="stages" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Building Stages"
            />
          }
        />

        {/* ── Headline Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Building Stages & Work Done
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Work on your building is divided into {project.stages.length} clear steps. The builder only gets paid for each step after you inspect the photos and approve.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-right">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">Stages Finished</span>
              <span className="text-base font-black text-[var(--vt-color-green-700,#1F6B3E)]">{approvedCount} of {project.stages.length}</span>
            </div>
            <div className={`p-3 rounded-xl border text-right ${isCompleted ? "bg-[var(--vt-color-green-50,#E9F6EC)] border-[var(--vt-color-green-200,#A3D9B1)]" : "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-200,#FDCAA9)]"}`}>
              <span className={`text-[10px] font-bold uppercase block ${isCompleted ? "text-[var(--vt-color-green-700,#1F6B3E)]" : "text-[var(--vt-color-orange-700,#B33C08)]"}`}>Completed</span>
              <span className={`text-base font-black ${isCompleted ? "text-[var(--vt-color-green-700,#1F6B3E)]" : "text-[var(--vt-color-orange-600,#D84C0B)]"}`}>{progressPercent}%</span>
            </div>
          </div>
        </section>

        {/* ── 100% Completion Notification Banner ── */}
        {isCompleted && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--vt-color-green-900,#0F331E)] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-green-600,#248246)] text-white flex items-center justify-center shrink-0 shadow-xs">
                <IconCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-sm text-[var(--vt-color-green-950,#061F10)] block">
                  All Construction Stages 100% Approved & Completed
                </span>
                <span className="text-[11.5px] text-[var(--vt-color-green-800,#17512F)]">
                  Every stage milestone has been verified with geo-tagged proof and approved. This project is safely archived in Contract History.
                </span>
              </div>
            </div>
            <Link
              href={`/owner/projects/${project.id}/transactions`}
              className="h-9 px-3.5 rounded-lg bg-white border border-[var(--vt-color-green-300,#81C792)] hover:bg-[var(--vt-color-green-50,#E9F6EC)] text-xs font-bold text-[var(--vt-color-green-800,#17512F)] transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              <span>View Payment Receipts</span>
            </Link>
          </div>
        )}

        {/* Filter Pills */}
        <section className="flex items-center gap-2 text-xs">
          {[
            { id: "all", label: `All Stages (${project.stages.length})` },
            ...(reviewCount > 0 ? [{ id: "review", label: `Ready to Check (${reviewCount})` }] : []),
            { id: "approved", label: `Finished (${approvedCount})` },
            ...(scheduledCount > 0 ? [{ id: "scheduled", label: `Coming Up (${scheduledCount})` }] : []),
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === f.id
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                  : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* ── Stages List ── */}
        <section className="flex flex-col gap-4 pb-8">
          {filteredStages.map((stg) => (
            <div
              key={stg.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col gap-4 transition-all hover:shadow-md ${
                stg.status === "Ready for Review"
                  ? "border-[var(--vt-color-orange-300,#FBA674)] ring-2 ring-[var(--vt-color-orange-400,#FA8747)]/15"
                  : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  onClick={() => router.push(`/owner/projects/${project.id}/stages/${stg.id}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 ${
                      stg.status === "Approved"
                        ? "bg-[var(--vt-color-green-500,#2E9E57)] text-white"
                        : stg.status === "Ready for Review"
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                        : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)]"
                    }`}
                  >
                    {stg.status === "Approved" ? <IconCheck className="w-3.5 h-3.5" /> : stg.stageNumber}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors flex items-center gap-1.5">
                      <span>{stg.title}</span>
                      <IconArrowRight className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:translate-x-0.5 group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-all" />
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      Payment: <strong>{formatNaira(stg.trancheAmount)}</strong> ({stg.weightPercent}% weight)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      stg.status === "Approved"
                        ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                        : stg.status === "Ready for Review"
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                        : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    {stg.status === "Approved" ? "Finished & Paid" : stg.status === "Ready for Review" ? "Ready for Review" : "Coming Up"}
                  </span>
                </div>
              </div>

              {/* Checklist & Photos Preview */}
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Checklist */}
                <div>
                  <h4 className="font-bold text-[var(--vt-color-neutral-500,#7C7894)] mb-2 flex items-center justify-between">
                    <span>Checklist items ({stg.checklist.filter((c) => c.isPassed).length}/{stg.checklist.length} checked):</span>
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {stg.checklist.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between">
                        <span className="text-[var(--vt-color-neutral-700,#46425F)] truncate mr-2">{item.label}</span>
                        {item.isPassed ? (
                          <span className="inline-flex items-center gap-1 text-[var(--vt-color-green-700,#1F6B3E)] font-bold shrink-0">
                            <IconCheck className="w-3 h-3" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h4 className="font-bold text-[var(--vt-color-neutral-500,#7C7894)] mb-2">
                    Photos from the site ({stg.proofMedia.length}):
                  </h4>
                  {stg.proofMedia.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {stg.proofMedia.slice(0, 2).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => router.push(`/owner/projects/${project.id}/stages/${stg.id}`)}
                          className="rounded-lg overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] cursor-pointer group/img"
                        >
                          <img src={m.url} alt={m.title} className="w-full h-24 object-cover group-hover/img:scale-105 transition-transform duration-200" />
                          <div className="p-1.5 bg-white">
                            <p className="font-bold text-[10.5px] text-[var(--vt-color-indigo-900,#261A66)] truncate">{m.title}</p>
                            <p className="text-[9.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">{m.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] text-center text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Photos will be uploaded once this stage begins.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  {stg.completedDate ? `Approved on ${stg.completedDate}` : `Target finish: ${stg.targetEndDate}`}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/owner/projects/${project.id}/stages/${stg.id}`}
                    className="h-9 px-3.5 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>View Inspection & Photos</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {stg.status === "Ready for Review" && (
                    <button
                      type="button"
                      onClick={() => setSelectedStage(stg)}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Approve & Release Payment</span>
                      <IconCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Review Modal */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!isApproveSuccess ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Approve Stage</h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">{selectedStage.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStage(null)}
                    title="Close"
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-orange-800,#8F320D)] block">Payment to release</span>
                    <span className="text-lg font-black text-[var(--vt-color-orange-900,#722306)]">{formatNaira(selectedStage.trancheAmount)}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--vt-color-orange-700,#B33C08)]">Paid to builder</span>
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Checklist:</span>
                  {selectedStage.checklist.map((c) => (
                    <div key={c.id} className="p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center gap-2">
                      <span className="text-[var(--vt-color-green-600,#248246)] flex items-center shrink-0">
                        <IconCheck className="w-3.5 h-3.5" />
                      </span>
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStage(null);
                      router.push(`/owner/projects/${project.id}/disputes`);
                    }}
                    className="text-xs font-bold text-[var(--vt-color-rose-600,#E11D48)] hover:underline cursor-pointer"
                  >
                    Report an issue
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStage(null)}
                      className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApproveCurrentStage}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                    >
                      Approve & Pay Builder
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-600,#248246)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Stage Approved!</h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  {formatNaira(selectedStage.trancheAmount)} has been released to {project.contractor.name}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsApproveSuccess(false);
                    setSelectedStage(null);
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
