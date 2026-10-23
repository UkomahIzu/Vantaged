"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { DraggableChatWindow } from "../../components/DraggableChatWindow";
import { ShareLinkModal } from "../../components/ShareLinkModal";
import { getProjectDetail, ProjectStage } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconArrowRight, IconCheck, IconClose } from "./ProjectIcons";

interface ProjectOverviewPageProps {
  projectId?: string;
}

export function ProjectOverviewPage({ projectId = "proj-lekki" }: ProjectOverviewPageProps) {
  const router = useRouter();
  const project = getProjectDetail(projectId);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [reviewingStage, setReviewingStage] = useState<ProjectStage | null>(null);
  const [approvalStep, setApprovalStep] = useState<"review" | "success">("review");

  const currentStage = project.stages.find((s) => s.status === "Ready for Review") || project.stages[3] || project.stages[0];

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const totalPaid = project.transactions
    .filter((t) => t.status === "Paid to Builder")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalInEscrow = project.transactions
    .filter((t) => t.status === "Held on Vantaged" || t.status === "Ready for Your Approval")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      {/* Decorative background line */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path d="M-100 200 C 400 100, 800 450, 1600 150" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1.2" fill="none" />
          <path d="M-50 750 C 500 650, 900 850, 1650 600" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1.2" fill="none" />
          <circle cx="1250" cy="350" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Left Sidebar */}
      <ProjectSidebarNav projectId={project.id} activeTab="overview" />

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        {/* Header Bar */}
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
            />
          }
        />

        {/* ── Top Project Header Card ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                {project.title}
              </h1>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                {project.address} • {project.specs}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:border-l sm:border-[var(--vt-color-border-default,#E2E0EC)] sm:pl-5 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">Total Agreed Price</span>
                <span className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(project.contractValue)}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="h-9 px-3 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-100,#FFE6D5)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0 ml-2"
                title="Create a view-only share link for family or lenders"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Share link</span>
              </button>
            </div>
          </div>

          {/* Simple Progress Bar */}
          <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[var(--vt-color-indigo-900,#261A66)]">
                Work completed and approved: <strong className="text-[var(--vt-color-orange-600,#D84C0B)]">{project.verifiedProgress}%</strong>
              </span>
              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                Target finish date: {project.targetEndDate}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
              <div style={{ width: `${project.verifiedProgress}%` }} className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
            </div>
          </div>
        </section>

        {/* ── 4 Plain Summary Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Money Paid Out */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Money Paid Out
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
                {formatNaira(totalPaid)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">3 stages finished</span>
              <Link href={`/owner/projects/${project.id}/transactions`} className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:underline inline-flex items-center gap-1">
                <span>View receipts</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Safe on Vantaged */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                Safe on Vantaged
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
                {formatNaira(totalInEscrow)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">In escrow</span>
              <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">Ready for stages</span>
            </div>
          </div>

          {/* Card 3: Current Stage */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Current Stage
              </span>
              <div className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1 line-clamp-1">
                {currentStage.title}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">Ready to review</span>
              <button
                type="button"
                onClick={() => setReviewingStage(currentStage)}
                className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Check work</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Waiting for you */}
          <div className="bg-[var(--vt-color-orange-50,#FFF4EE)] p-4.5 rounded-2xl border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-800,#8F320D)]">
                Waiting for You
              </span>
              <div className="text-sm font-black text-[var(--vt-color-orange-900,#722306)] mt-1">
                1 Stage Ready for Review
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-orange-200,#FDCAA9)]/80 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-orange-800,#8F320D)] font-medium">Review photos</span>
              <button
                type="button"
                onClick={() => setReviewingStage(currentStage)}
                className="font-black text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Review now</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Main Two Column Grid ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
          {/* Left 2 Cols: Current Stage Work & All Stages */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Current Stage in Progress Card */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[var(--vt-color-orange-600,#D84C0B)]">
                    Work Submitted for Your Approval
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Amount to be released when approved: <strong>{formatNaira(currentStage.trancheAmount)}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReviewingStage(currentStage)}
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
                >
                  Check Work & Approve
                </button>
              </div>

              {/* Photos from the building site */}
              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
                  Photos from the site:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStage.proofMedia.map((m) => (
                    <div key={m.id} className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)]">
                      <img src={m.url} alt={m.title} className="w-full h-44 object-cover" />
                      <div className="p-3 bg-white">
                        <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">{m.title}</p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">{m.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] block mb-2">
                  Things checked on site:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentStage.checklist.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center gap-2">
                      <span className="text-[var(--vt-color-green-600,#248246)] flex items-center shrink-0">
                        <IconCheck className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[var(--vt-color-neutral-700,#46425F)]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stages Roadmap */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    All Building Stages ({project.stages.length})
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Step-by-step progress from start to finish
                  </p>
                </div>
                <Link
                  href={`/owner/projects/${project.id}/stages`}
                  className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline inline-flex items-center gap-1"
                >
                  <span>View details</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                {project.stages.map((stg) => (
                  <div
                    key={stg.id}
                    onClick={() => router.push(`/owner/projects/${project.id}/stages/${stg.id}`)}
                    className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          stg.status === "Approved"
                            ? "bg-[var(--vt-color-green-500,#2E9E57)] text-white"
                            : stg.status === "Ready for Review"
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white animate-pulse"
                            : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)]"
                        }`}
                      >
                        {stg.status === "Approved" ? <IconCheck className="w-3.5 h-3.5" /> : stg.stageNumber}
                      </div>

                      <div>
                        <h5 className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors flex items-center gap-1">
                          <span>{stg.title}</span>
                          <IconArrowRight className="w-3 h-3 text-[var(--vt-color-neutral-400,#A3A0B8)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </h5>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          {formatNaira(stg.trancheAmount)}
                          {stg.verifiedBy && ` • Approved by ${stg.verifiedBy}`}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        stg.status === "Approved"
                          ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                          : stg.status === "Ready for Review"
                          ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                          : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)]"
                      }`}
                    >
                      {stg.status === "Approved" ? "Done" : stg.status === "Ready for Review" ? "Ready to Check" : "Coming next"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Builder & Actions */}
          <div className="flex flex-col gap-5">
            {/* The Builder */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                The Building Company
              </span>

              <div>
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  {project.contractor.name}
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Rating: <strong className="text-[var(--vt-color-orange-600,#D84C0B)]">{project.contractor.rating}</strong> ({project.contractor.projectsCompleted} completed builds)
                </p>
              </div>

              {/* Site Manager */}
              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-3">
                <img src={project.siteManager.avatar} alt={project.siteManager.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                    {project.siteManager.name}
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                    Head Site Engineer
                  </p>
                  <p className="text-[10.5px] text-[var(--vt-color-green-700,#1F6B3E)] font-medium mt-0.5">
                    ● {project.siteManager.lastSeen}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="w-full h-9 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer mt-1"
              >
                Send Message to Site Engineer
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                More on this building
              </span>

              <Link
                href={`/owner/projects/${project.id}/transactions`}
                className="group p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all"
              >
                <span>Money & Payment Receipts</span>
                <IconArrowRight className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href={`/owner/projects/${project.id}/disputes`}
                className="group p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all"
              >
                <span>Report an Issue or Dispute</span>
                <IconArrowRight className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href={`/owner/projects/${project.id}/change-requests`}
                className="group p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all"
              >
                <span>Extra Work Added Later</span>
                <IconArrowRight className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href={`/owner/projects/${project.id}/team`}
                className="group p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all"
              >
                <span>Your Assigned Representatives</span>
                <IconArrowRight className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="group p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span>Share Live Progress Link</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[10px] font-bold">
                    View-only
                  </span>
                </div>
                <IconArrowRight className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Check Work & Approve Modal (Plain English) ── */}
      {reviewingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {approvalStep === "review" ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Check & Approve Stage</h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">{reviewingStage.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewingStage(null)}
                    title="Close"
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-orange-800,#8F320D)] block">Payment to release</span>
                    <span className="text-lg font-black text-[var(--vt-color-orange-900,#722306)]">{formatNaira(reviewingStage.trancheAmount)}</span>
                  </div>
                  <span className="text-[11px] text-[var(--vt-color-orange-700,#B33C08)] font-semibold">Money goes to builder</span>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Confirm work items passed:</span>
                  {reviewingStage.checklist.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2">
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
                      setReviewingStage(null);
                      router.push(`/owner/projects/${project.id}/disputes`);
                    }}
                    className="text-xs font-bold text-[var(--vt-color-rose-600,#E11D48)] hover:underline cursor-pointer"
                  >
                    Report a problem
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewingStage(null)}
                      className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setApprovalStep("success")}
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
                  {formatNaira(reviewingStage.trancheAmount)} has been released to {project.contractor.name}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReviewingStage(null);
                    setApprovalStep("review");
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

      <DraggableChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        projectName={project.title}
      />

      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        defaultProjectId={project.id}
      />
    </div>
  );
}
