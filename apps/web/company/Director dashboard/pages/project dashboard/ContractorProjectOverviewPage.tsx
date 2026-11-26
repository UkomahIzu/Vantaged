"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DirectorHeaderBar } from "../../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../../client/Owner dashboard/hooks/useScrollRestoration";
import { ContractorProjectSidebarNav } from "./ContractorProjectSidebarNav";
import { ContractorProjectBreadcrumb } from "./ContractorProjectBreadcrumb";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorProjectIssue,
  ContractorProjectStage,
  ContractorProjectTranche,
  ContractorSiteMember,
  ContractorVariationRequest,
  computeProjectMetrics,
  formatNairaCompact,
  formatNairaFull,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import {
  SHARED_SYNC_EVENT,
  appendSharedMessage,
  ensureProjectConversation,
  isDemoProjectId,
  normalizeCanonicalProjectId,
  readSharedConversations,
} from "../../../../shared/vantagedSyncBridge";
import { getContractorSession } from "../../../../shared/vantagedAuth";

interface ContractorProjectOverviewPageProps {
  projectId: string;
}

interface ProjectMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  isCompany: boolean;
}

export function ContractorProjectOverviewPage({ projectId }: ContractorProjectOverviewPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_overview_${projectId}`);
  const project = useContractorProject(projectId);

  const [stages, setStages] = useState<ContractorProjectStage[]>(project.stages);
  const [tranches, setTranches] = useState<ContractorProjectTranche[]>(project.tranches);
  const [issues, setIssues] = useState<ContractorProjectIssue[]>(project.issues);
  const [variations, setVariations] = useState<ContractorVariationRequest[]>(project.variations);
  const [team, setTeam] = useState<ContractorSiteMember[]>(project.siteTeam);

  // Project chat modal (connected 2-way to Owner's DraggableChatWindow & Messages)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ProjectMessage[]>(() =>
    isDemoProjectId(projectId)
      ? [
          {
            id: "m-1",
            sender: project.client.name,
            role: "Property Owner",
            text: "Hello team, please let me know once the latest stage proof photos are uploaded.",
            time: "Yesterday · 16:10",
            isCompany: false,
          },
          {
            id: "m-2",
            sender: "Engr. Tunde Bakare",
            role: "Site Manager (You)",
            text: "Will do! Our site engineer is completing the checklist photos and lab report upload now.",
            time: "Today · 09:05",
            isCompany: true,
          },
        ]
      : []
  );

  useEffect(() => {
    const canonicalId = normalizeCanonicalProjectId(projectId);
    const convId = `conv-${canonicalId}`;

    const sync = () => {
      setStages(loadProjectKey(projectId, "stages", project.stages));
      setTranches(loadProjectKey(projectId, "tranches", project.tranches));
      setIssues(loadProjectKey(projectId, "issues", project.issues));
      setVariations(loadProjectKey(projectId, "variations", project.variations));
      setTeam(loadProjectKey(projectId, "team", project.siteTeam));

      // Load shared 2-way conversation with Owner
      const threads = readSharedConversations(false);
      const thread = threads.find(
        (t) => t.id === convId || normalizeCanonicalProjectId(t.projectId) === canonicalId
      );
      if (thread) {
        setMessages(
          thread.messages.map((m) => ({
            id: m.id,
            sender: m.senderName,
            role: m.sender === "contractor" ? "Company (You)" : "Property Owner",
            text: m.text,
            time: m.timestamp,
            isCompany: m.sender === "contractor",
          }))
        );
      } else if (!isDemoProjectId(projectId)) {
        setMessages([]);
      }
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
  }, [projectId, project]);

  const metrics = computeProjectMetrics(stages);
  const confirmedPayouts = tranches
    .filter((t) => t.status === "Receipt Confirmed")
    .reduce((sum, t) => sum + t.netPayout, 0);
  const pendingReceipt = tranches.find((t) => t.status === "Awaiting Your Confirmation");
  const openIssues = issues.filter((i) => i.status !== "Resolved");
  const pendingVariations = variations.filter((v) => v.status === "Awaiting Owner Approval");
  const assignedCrew = team.filter((m) => m.assigned);

  const totalRetainage = tranches
    .filter((t) => t.status === "Receipt Confirmed" || t.status === "Awaiting Your Confirmation")
    .reduce((sum, t) => sum + t.retainageAmount, 0);

  const remainingEscrow = Math.max(
    0,
    project.contractValue -
      tranches
        .filter((t) => t.status === "Receipt Confirmed" || t.status === "Awaiting Your Confirmation")
        .reduce((sum, t) => sum + t.grossAmount, 0)
  );

  const activeStage =
    stages.find((s) => s.status === "Fix Requested" || s.status === "Disputed") ||
    stages.find((s) => s.status === "Ready for Review" || s.status === "In Progress") ||
    stages.find((s) => s.status !== "Approved") ||
    stages[stages.length - 1];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const session = getContractorSession();
    const senderName = session?.fullName || "Project Director";
    const companyName = session?.companyName || "Building Company";
    const thread = ensureProjectConversation({
      projectId,
      projectTitle: project.title,
      ownerName: project.client.name,
      companyId: session?.userId,
      contractorName: senderName,
      contractorCompany: companyName,
    });
    appendSharedMessage({
      conversationId: thread.id,
      sender: "contractor",
      senderName,
      text: chatInput.trim(),
    });
    setChatInput("");
  };

  const statusPillStyle = (status: ContractorProjectStage["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]";
      case "Ready for Review":
        return "bg-indigo-50 text-[var(--vt-color-indigo-900,#261A66)] border-indigo-200";
      case "Fix Requested":
        return "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]";
      case "Disputed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "In Progress":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-500,#7C7894)] border-[var(--vt-color-border-default,#E2E0EC)]";
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      {/* Decorative subtle curves */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path d="M-100 200 C 400 100, 800 450, 1600 150" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1.2" fill="none" />
          <path d="M-50 750 C 500 650, 900 850, 1650 600" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1.2" fill="none" />
          <circle cx="1250" cy="350" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.5" />
        </svg>
      </div>

      <ContractorProjectSidebarNav projectId={project.id} activeTab="overview" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <ContractorProjectBreadcrumb projectId={project.id} projectTitle={project.title} />
          }
        />

        {/* Contextual Action Alert (3-day receipt confirmation OR Open Fix/Dispute) */}
        {pendingReceipt && (
          <div className="p-4 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0 font-black text-sm">
                ₦
              </span>
              <div>
                <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Please Confirm You Received Payment ({pendingReceipt.confirmDeadline || "3-Day Window"})
                </p>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
                  {formatNairaFull(pendingReceipt.netPayout)} was sent for{" "}
                  <strong>{pendingReceipt.stageTitle}</strong> · Ref {pendingReceipt.bankSessionId}.
                </p>
              </div>
            </div>
            <Link
              href={`/contractor/projects/${project.id}/transactions`}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(239,95,24,0.28)]"
            >
              Confirm Payment →
            </Link>
          </div>
        )}

        {!pendingReceipt && openIssues.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-black text-sm">
                !
              </span>
              <div>
                <p className="text-xs font-extrabold text-rose-900">
                  {openIssues[0].kind}: {openIssues[0].title}
                </p>
                <p className="text-xs text-rose-800/90 mt-0.5">
                  {openIssues[0].stageTitle} · {openIssues[0].deadlineLabel}
                </p>
              </div>
            </div>
            <Link
              href={`/contractor/projects/${project.id}/disputes`}
              className="h-9 px-4 rounded-md bg-white border border-rose-200 hover:border-rose-300 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0"
            >
              Respond &amp; Upload Proof →
            </Link>
          </div>
        )}

        {/* Top Project Header Card */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  {project.jobId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  {project.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                    metrics.verifiedPercent >= 100
                      ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]"
                      : project.status === "On Hold (Dispute)"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-indigo-50 text-[var(--vt-color-indigo-900,#261A66)] border-indigo-200"
                  }`}
                >
                  {metrics.verifiedPercent >= 100 ? "Completed & Handed Over" : project.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                {project.title}
              </h1>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                {project.address} • {project.specs}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-[var(--vt-color-border-default,#E2E0EC)] lg:pl-5 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">
                  Total Agreed Price
                </span>
                <span className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  {formatNairaCompact(project.contractValue)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="h-9 px-3.5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Message Owner</span>
              </button>
            </div>
          </div>

          {/* Verified vs Reported Progress Bar */}
          <div className="pt-3.5 border-t border-[var(--vt-color-border-default,#E2E0EC)] space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[var(--vt-color-indigo-900,#261A66)]">
                  Owner-Verified:{" "}
                  <strong className="text-[var(--vt-color-green-700,#1F6B3E)]">
                    {metrics.verifiedPercent}%
                  </strong>
                </span>
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">
                  Submitted / Reported:{" "}
                  <strong className="text-[var(--vt-color-orange-600,#D84C0B)]">
                    {metrics.reportedPercent}%
                  </strong>
                </span>
              </div>
              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                Target handover: {project.targetEndDate}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden relative">
              <div
                style={{ width: `${metrics.reportedPercent}%` }}
                className="h-full bg-[var(--vt-color-orange-300,#FBA674)] rounded-full absolute inset-y-0 left-0 transition-all duration-300"
              />
              <div
                style={{ width: `${metrics.verifiedPercent}%` }}
                className={`h-full rounded-full absolute inset-y-0 left-0 transition-all duration-300 ${
                  metrics.verifiedPercent >= 100
                    ? "bg-[var(--vt-color-green-600,#248246)]"
                    : "bg-[var(--vt-color-orange-500,#EF5F18)]"
                }`}
              />
            </div>
          </div>
        </section>

        {/* 4 Summary KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Confirmed Payouts
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
                {formatNairaCompact(confirmedPayouts)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">
                5% Hold: {formatNairaCompact(totalRetainage)}
              </span>
              <Link
                href={`/contractor/projects/${project.id}/transactions`}
                className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
              >
                Receipts →
              </Link>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                Remaining Contract Value
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
                {formatNairaCompact(remainingEscrow)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">
                {metrics.approvedCount} of {metrics.totalCount} stages paid
              </span>
              <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">Escrow backed</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Current Focus Stage
              </span>
              <div className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1 line-clamp-1">
                {activeStage?.title || "All Stages Done"}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                {activeStage?.status}
              </span>
              {activeStage && (
                <Link
                  href={`/contractor/projects/${project.id}/stages/${activeStage.id}`}
                  className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
                >
                  Open Proof →
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Fixes &amp; Extra Work
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
                {openIssues.length} Open · {pendingVariations.length} Extra
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <Link
                href={`/contractor/projects/${project.id}/disputes`}
                className="font-bold text-rose-700 hover:underline"
              >
                Fixes ({openIssues.length})
              </Link>
              <Link
                href={`/contractor/projects/${project.id}/change-requests`}
                className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
              >
                Extra Work →
              </Link>
            </div>
          </div>
        </section>

        {/* Main 2-Column Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Stage Execution Tracker */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Milestone Stages &amp; Submission Status
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  Select any stage to check off items, upload geo-tagged proof, or submit for review.
                </p>
              </div>
              <Link
                href={`/contractor/projects/${project.id}/stages`}
                className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline shrink-0"
              >
                Manage All →
              </Link>
            </div>

            <div className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/60">
              {stages.map((stage) => {
                const doneChecks = stage.checklist.filter((c) => c.isCompleted).length;
                return (
                  <Link
                    key={stage.id}
                    href={`/contractor/projects/${project.id}/stages/${stage.id}`}
                    className="p-4 hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                          {stage.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusPillStyle(stage.status)}`}>
                          {stage.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                        {(stage.weightBps / 100).toFixed(0)}% weight · {doneChecks}/{stage.checklist.length} checklist items · {stage.proofItems.length} proof file{stage.proofItems.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          {formatNairaCompact(stage.trancheAmount)}
                        </p>
                        <p className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          Due {stage.dueDate}
                        </p>
                      </div>
                      <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] group-hover:bg-[var(--vt-color-orange-500,#EF5F18)] group-hover:text-white text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center text-xs font-bold transition-colors">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Client & Crew Snapshot + Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Client &amp; Site Crew
                </h3>
                <Link
                  href={`/contractor/projects/${project.id}/team`}
                  className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline"
                >
                  Manage Crew →
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                    Property Owner
                  </span>
                  <span className="text-[10px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                    ✓ {project.client.verifiedBadge}
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {project.client.name}
                </p>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  {project.client.email} · {project.client.phone}
                </p>
                {project.client.repName && (
                  <p className="text-[11px] text-[var(--vt-color-indigo-900,#261A66)] pt-1">
                    <strong>Rep:</strong> {project.client.repName} ({project.client.repRole})
                  </p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] mb-2">
                  Assigned Company Crew ({assignedCrew.length})
                </p>
                <div className="space-y-2">
                  {assignedCrew.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-2 text-xs p-2.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/80 bg-white"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          {member.role} · {member.location}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[10px] font-bold shrink-0">
                        {member.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                Quick Project Actions
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <Link
                  href={`/contractor/projects/${project.id}/stages/${activeStage?.id || "stg-1"}`}
                  className="p-3 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-100,#FFE6D5)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[var(--vt-color-orange-700,#B33C08)] transition-colors"
                >
                  + Upload Stage Proof
                </Link>
                <Link
                  href={`/contractor/projects/${project.id}/change-requests`}
                  className="p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-colors"
                >
                  + Request Extra Work
                </Link>
                <Link
                  href={`/contractor/projects/${project.id}/transactions`}
                  className="p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-colors"
                >
                  Confirm Payment
                </Link>
                <Link
                  href="/contractor/dashboard"
                  className="p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-colors"
                >
                  ← Main Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Project Chat Drawer Modal */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-end p-4"
          onClick={() => setIsChatOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-[85vh] bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] to-[var(--vt-color-orange-50,#FFF4EE)]/40 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Project Chat · {project.client.name}
                </h3>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  {project.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${msg.isCompany ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <span className="text-[10px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] mb-1">
                    {msg.sender} · {msg.time}
                  </span>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isCompany
                        ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white rounded-br-sm"
                        : "bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Write a message to the owner or rep..."
                className="flex-1 h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
