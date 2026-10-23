"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import {
  getStageDetail,
  ProjectStage,
  StageChecklistItem,
  StageProofMedia,
  StageComment,
} from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClose,
  IconShieldCheck,
  IconCamera,
  IconVideo,
  IconMic,
  IconMapPin,
  IconCompare,
  IconMaximize,
  IconSend,
  IconHistory,
  IconAlertTriangle,
  IconPrinter,
  IconEye,
} from "./ProjectIcons";

interface ProjectStageDetailPageProps {
  projectId: string;
  stageId: string;
}

export function ProjectStageDetailPage({
  projectId,
  stageId,
}: ProjectStageDetailPageProps) {
  const router = useRouter();
  const { project, stage: initialStage } = getStageDetail(projectId, stageId);

  const [stage, setStage] = useState<ProjectStage>(initialStage);
  const [activeTab, setActiveTab] = useState<
    "checklist" | "proof" | "beforeAfter" | "comments" | "activity"
  >("proof");
  const [mediaFilter, setMediaFilter] = useState<"all" | "photo" | "video" | "voice">("all");
  const [selectedMedia, setSelectedMedia] = useState<StageProofMedia | null>(null);

  // Approval & Rejection modals
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [failedChecklistIds, setFailedChecklistIds] = useState<string[]>([]);
  const [rejectionComment, setRejectionComment] = useState("");
  const [isRejectSuccess, setIsRejectSuccess] = useState(false);

  // New comment input
  const [newCommentText, setNewCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<StageComment[]>(stage.comments || []);

  // Filter media by checklist item if clicked
  const [selectedChecklistItemId, setSelectedChecklistItemId] = useState<string | null>(null);

  const formatNaira = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const filteredMedia = stage.proofMedia.filter((m) => {
    if (selectedChecklistItemId && m.checklistItemId !== selectedChecklistItemId) {
      return false;
    }
    if (mediaFilter === "all") return true;
    return m.type === mediaFilter;
  });

  const photoCount = stage.proofMedia.filter((m) => m.type === "photo").length;
  const videoCount = stage.proofMedia.filter((m) => m.type === "video").length;
  const voiceCount = stage.proofMedia.filter((m) => m.type === "voice").length;
  const passedChecklistCount = stage.checklist.filter((c) => c.isPassed).length;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: StageComment = {
      id: `com-${Date.now()}`,
      authorName: "Dr. James Arinze",
      authorRole: "Building Owner (You)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      text: newCommentText.trim(),
      timestamp: "Just now",
      isClient: true,
    };

    setCommentsList([...commentsList, newComment]);
    setNewCommentText("");
  };

  const handleApproveStage = () => {
    setIsApprovedSuccess(true);
    setStage((prev) => ({
      ...prev,
      status: "Approved",
      ballInCourt: "Completed",
      completedDate: "Today",
      verifiedBy: "Dr. James Arinze (Owner)",
    }));
  };

  const handleRejectStage = () => {
    setIsRejectSuccess(true);
    setStage((prev) => ({
      ...prev,
      status: "In Progress",
      ballInCourt: "Contractor (Fixing Issues)",
      rejectionCount: (prev.rejectionCount || 0) + 1,
      issues: [
        ...(prev.issues || []),
        {
          id: `iss-${Date.now()}`,
          issueCode: `ISSUE-0${(prev.issues?.length || 0) + 2}`,
          title: rejectionComment || "Checklist rectification requested by client",
          status: "Open",
          assignedTo: project.siteManager.name,
          dateRaised: "Today",
        },
      ],
    }));
  };

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      {/* Decorative background grid subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path d="M-100 250 C 400 150, 800 450, 1600 200" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1" fill="none" />
          <path d="M-50 780 C 500 700, 900 850, 1650 650" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Left Sidebar */}
      <ProjectSidebarNav projectId={project.id} activeTab="stages" />

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        {/* Header Bar */}
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle={`Stage ${stage.stageNumber}: ${stage.title}`}
            />
          }
        />

        {/* Back Link + Top Navigation Bar */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <Link
            href={`/owner/projects/${project.id}/stages`}
            className="inline-flex items-center gap-1.5 font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-white border border-transparent hover:border-[var(--vt-color-border-default,#E2E0EC)]"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stages</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-mono">
              Stage {stage.stageNumber} of {project.stages.length}
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              title="Print Stage Report"
              className="h-8 px-2.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <IconPrinter className="w-3.5 h-3.5" />
              <span>Print Inspection</span>
            </button>
          </div>
        </div>

        {/* ── Main Stage Header Card ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Stage {stage.stageNumber}: {stage.title}
              </h1>

              {stage.description && (
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1.5 max-w-3xl leading-relaxed">
                  {stage.description}
                </p>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:border-[var(--vt-color-border-default,#E2E0EC)] lg:pl-5">
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] min-w-[120px]">
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">
                  Stage Payment
                </span>
                <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)] block">
                  {formatNaira(stage.trancheAmount)}
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  {stage.weightPercent}% of contract
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] min-w-[120px]">
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">
                  Checklist Progress
                </span>
                <span className="text-base font-black text-[var(--vt-color-green-700,#1F6B3E)] block">
                  {passedChecklistCount} of {stage.checklist.length}
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  100% verified
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] min-w-[120px]">
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">
                  Target Finish
                </span>
                <span className="text-xs font-black text-[var(--vt-color-indigo-900,#261A66)] block truncate">
                  {stage.completedDate ? `Done: ${stage.completedDate}` : stage.targetEndDate}
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Started: {stage.startDate}
                </span>
              </div>
            </div>
          </div>

          {/* ── Inspection Action Banner (PRD FR-REV-01, 02, 03) ── */}
          {stage.status === "Ready for Review" && (
            <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <IconShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[var(--vt-color-orange-900,#722306)]">
                    Work has been submitted by the builder for your approval
                  </h3>
                  <p className="text-[11.5px] text-[var(--vt-color-orange-800,#8F320D)] mt-0.5">
                    Review the {stage.proofMedia.length} GPS photos and inspection checklist below. Approving releases{" "}
                    <strong>{formatNaira(stage.trancheAmount)}</strong> to {project.contractor.name}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="h-9 px-3.5 rounded-lg bg-white border border-[var(--vt-color-orange-300,#FBA674)] hover:bg-[var(--vt-color-orange-100,#FEDFD0)] text-xs font-bold text-[var(--vt-color-orange-800,#8F320D)] transition-colors cursor-pointer"
                >
                  Request Fixes
                </button>

                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(true)}
                  className="h-9 px-4 rounded-lg bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Approve & Release Payment</span>
                </button>
              </div>
            </div>
          )}

          {stage.status === "Approved" && (
            <div className="p-3.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[var(--vt-color-green-800,#195230)]">
                <IconCheck className="w-4 h-4 text-[var(--vt-color-green-600,#248246)]" />
                <span>
                  This stage was approved on <strong>{stage.completedDate}</strong> by{" "}
                  <strong>{stage.verifiedBy || "You"}</strong>. Payment of{" "}
                  <strong>{formatNaira(stage.trancheAmount)}</strong> was released.
                </span>
              </div>
              <Link
                href={`/owner/projects/${project.id}/transactions`}
                className="font-bold text-[var(--vt-color-green-700,#1F6B3E)] hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>View receipt</span>
                <IconArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </section>

        {/* ── Tab Bar Navigation (Procore Inspection Navigation) ── */}
        <section className="flex items-center gap-2 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-1 text-xs">
          {[
            {
              id: "proof",
              label: `Site Photos & Video (${stage.proofMedia.length})`,
              icon: IconCamera,
            },
            {
              id: "checklist",
              label: `Checklist Items (${passedChecklistCount}/${stage.checklist.length})`,
              icon: IconCheck,
            },
            ...(stage.beforeAfter
              ? [
                  {
                    id: "beforeAfter",
                    label: "Before / After Comparison",
                    icon: IconCompare,
                  },
                ]
              : []),
            {
              id: "comments",
              label: `Comments & Notes (${commentsList.length})`,
              icon: IconMic,
            },
            {
              id: "activity",
              label: `Activity Log (${stage.activityLog?.length || 0})`,
              icon: IconHistory,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 font-bold transition-all relative cursor-pointer inline-flex items-center gap-1.5 ${
                  isActive
                    ? "text-[var(--vt-color-orange-600,#D84C0B)]"
                    : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--vt-color-orange-500,#EF5F18)] rounded-t-full" />
                )}
              </button>
            );
          })}
        </section>

        {/* ── TAB 1: SITE PHOTOS & VIDEO PROOF ── */}
        {activeTab === "proof" && (
          <section className="flex flex-col gap-4 pb-8">
            {/* Filter pills & Geofence notification */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: `All Media (${stage.proofMedia.length})` },
                  { id: "photo", label: `Photos (${photoCount})` },
                  { id: "video", label: `Videos (${videoCount})` },
                  { id: "voice", label: `Voice Notes (${voiceCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMediaFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      mediaFilter === f.id
                        ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white shadow-2xs"
                        : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                {selectedChecklistItemId && (
                  <button
                    type="button"
                    onClick={() => setSelectedChecklistItemId(null)}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-800,#8F320D)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold inline-flex items-center gap-1"
                  >
                    <span>Clear checklist filter</span>
                    <IconClose className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* GPS Geofence stamp info (PRD FR-PRF-03) */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] px-3 py-1.5 rounded-lg border border-[var(--vt-color-green-200,#A3D9B1)]">
                <IconMapPin className="w-3.5 h-3.5 shrink-0" />
                <span>100% GPS Verified inside site boundary (Lekki Phase 1)</span>
              </div>
            </div>

            {/* Media Grid */}
            {filteredMedia.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMedia.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMedia(m)}
                    className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                      {m.type === "voice" ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--vt-color-indigo-900,#261A66)] text-white p-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                            <IconMic className="w-6 h-6 text-[var(--vt-color-orange-400,#FA8747)]" />
                          </div>
                          <span className="text-xs font-bold">Voice Audio Memo</span>
                          <span className="text-[11px] text-white/70 mt-0.5">{m.duration || "1:15"} min</span>
                        </div>
                      ) : (
                        <img
                          src={m.url}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Tag badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                          {m.type === "photo" ? (
                            <IconCamera className="w-3 h-3" />
                          ) : m.type === "video" ? (
                            <IconVideo className="w-3 h-3 text-[var(--vt-color-orange-400,#FA8747)]" />
                          ) : (
                            <IconMic className="w-3 h-3" />
                          )}
                          <span>{m.type}</span>
                        </span>

                        {m.withinSite && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--vt-color-green-700,#1F6B3E)] text-white flex items-center gap-1">
                            <IconCheck className="w-2.5 h-2.5" />
                            <span>GPS Match</span>
                          </span>
                        )}
                      </div>

                      {/* Enlarge overlay icon */}
                      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-md bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconMaximize className="w-3.5 h-3.5" />
                      </div>

                      {m.duration && m.type === "video" && (
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white">
                          {m.duration}
                        </div>
                      )}
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-3.5 flex flex-col gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] line-clamp-1">
                          {m.title}
                        </h4>
                        {m.checklistItemLabel && (
                          <span className="text-[10px] font-medium text-[var(--vt-color-orange-700,#B33C08)] bg-[var(--vt-color-orange-50,#FFF4EE)] px-1.5 py-0.5 rounded inline-block mt-1 truncate max-w-full">
                            Check: {m.checklistItemLabel}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        <span className="truncate">{m.uploadedBy}</span>
                        <span className="shrink-0">{m.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                No media items match your current filter.
              </div>
            )}
          </section>
        )}

        {/* ── TAB 2: INSPECTION CHECKLIST ── */}
        {activeTab === "checklist" && (
          <section className="flex flex-col gap-4 pb-8">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-3">
                <div>
                  <h3 className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    Quality Inspection Checklist
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Items verified by the Site Engineer on site before submitting this stage for review
                  </p>
                </div>

                <span className="text-xs font-bold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] px-3 py-1 rounded-full border border-[var(--vt-color-green-200,#A3D9B1)]">
                  {passedChecklistCount} of {stage.checklist.length} Passed
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {stage.checklist.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          item.isPassed
                            ? "bg-[var(--vt-color-green-600,#248246)] text-white"
                            : "bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                        }`}
                      >
                        {item.isPassed ? <IconCheck className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs sm:text-sm">
                          {item.label}
                        </h4>
                        {item.notes && (
                          <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1">
                            {item.notes}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          {item.completedBy && <span>Verified by: <strong>{item.completedBy}</strong></span>}
                          {item.completedDate && <span>• Date: {item.completedDate}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChecklistItemId(item.id);
                          setActiveTab("proof");
                        }}
                        className="px-2.5 py-1 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] font-bold text-[var(--vt-color-indigo-900,#261A66)] inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <IconEye className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" />
                        <span>View Proof ({item.proofCount || 2})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TAB 3: BEFORE / AFTER COMPARISON (PRD FR-PRF-08) ── */}
        {activeTab === "beforeAfter" && stage.beforeAfter && (
          <section className="flex flex-col gap-4 pb-8">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-3">
                <div className="mb-1">
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Before vs. After Progress Verification
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Site Transformation for Stage {stage.stageNumber}
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  {stage.beforeAfter.description}
                </p>
              </div>

              {/* Side-by-side inspection cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] overflow-hidden bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <div className="p-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase text-[10.5px]">
                      BEFORE THIS STAGE
                    </span>
                    <span className="font-mono text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      {stage.beforeAfter.beforeDate}
                    </span>
                  </div>
                  <img
                    src={stage.beforeAfter.beforeUrl}
                    alt={stage.beforeAfter.beforeTitle}
                    className="w-full h-64 sm:h-72 object-cover"
                  />
                  <div className="p-3 bg-white">
                    <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                      {stage.beforeAfter.beforeTitle}
                    </p>
                  </div>
                </div>

                {/* AFTER */}
                <div className="rounded-xl border border-[var(--vt-color-green-300,#81C995)] ring-2 ring-[var(--vt-color-green-500,#2E9E57)]/15 overflow-hidden bg-white">
                  <div className="p-3 border-b border-[var(--vt-color-green-200,#A3D9B1)] bg-[var(--vt-color-green-50,#E9F6EC)] flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--vt-color-green-800,#195230)] uppercase text-[10.5px] flex items-center gap-1">
                      <IconCheck className="w-3 h-3 text-[var(--vt-color-green-600,#248246)]" />
                      <span>AFTER WORK COMPLETED</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--vt-color-green-700,#1F6B3E)]">
                      {stage.beforeAfter.afterDate}
                    </span>
                  </div>
                  <img
                    src={stage.beforeAfter.afterUrl}
                    alt={stage.beforeAfter.afterTitle}
                    className="w-full h-64 sm:h-72 object-cover"
                  />
                  <div className="p-3 bg-white">
                    <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                      {stage.beforeAfter.afterTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── TAB 4: COMMENTS & DISCUSSION ── */}
        {activeTab === "comments" && (
          <section className="flex flex-col gap-4 pb-8">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
              <div className="border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-3">
                <h3 className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Inspection Comments & Field Notes
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Direct communication between you, your site representatives, and the contractor regarding this stage
                </p>
              </div>

              {/* Thread list */}
              <div className="flex flex-col gap-4">
                {commentsList.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border text-xs flex flex-col gap-2 ${
                      c.isClient
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/50 border-[var(--vt-color-orange-200,#FDCAA9)] ml-0 sm:ml-6"
                        : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] mr-0 sm:mr-6"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.authorName}
                            className="w-7 h-7 rounded-full object-cover border border-white shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white font-bold flex items-center justify-center text-[10px]">
                            {c.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            {c.authorName}
                          </span>
                          <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] ml-1.5">
                            ({c.authorRole})
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-mono">
                        {c.timestamp}
                      </span>
                    </div>

                    <p className="text-[12px] text-[var(--vt-color-neutral-700,#46425F)] leading-relaxed pl-9">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleSendComment} className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type a note or question for the Site Manager..."
                  className="flex-1 h-10 px-3.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-900,#191530)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/20"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="h-10 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-50 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Send</span>
                  <IconSend className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </section>
        )}

        {/* ── TAB 5: ACTIVITY TIMELINE (PRD FR-PRF-07) ── */}
        {activeTab === "activity" && (
          <section className="flex flex-col gap-4 pb-8">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-3">
                <h3 className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Complete Stage Audit History
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Immutable timeline of all field updates, checklist completions, and reviews (PRD FR-PRF-07)
                </p>
              </div>

              <div className="flex flex-col gap-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--vt-color-border-default,#E2E0EC)]">
                {stage.activityLog?.map((act) => (
                  <div key={act.id} className="relative flex flex-col gap-0.5 text-xs">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-4 ring-white" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {act.action}
                      </span>
                      <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-mono">
                        {act.timestamp}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                      By {act.user} ({act.role})
                    </span>
                    {act.details && (
                      <p className="text-[11.5px] text-[var(--vt-color-neutral-600,#5E5A7D)] bg-[var(--vt-color-neutral-50,#F7F7FA)] p-2 rounded-md mt-1 border border-[var(--vt-color-border-default,#E2E0EC)]/60">
                        {act.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── LIGHTBOX MODAL (Full Photo / Video Viewer) ── */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              title="Close viewer"
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <IconClose className="w-4 h-4" />
            </button>

            {/* Media Canvas */}
            <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
              {selectedMedia.type === "voice" ? (
                <div className="text-white flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] flex items-center justify-center">
                    <IconMic className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base">{selectedMedia.title}</h3>
                  <p className="text-xs text-white/70">Audio note recorded on site by {selectedMedia.uploadedBy}</p>
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="max-h-[500px] w-auto max-w-full object-contain"
                />
              )}
            </div>

            {/* Metadata Sidebar (Procore Style EXIF & Stamping) */}
            <div className="w-full lg:w-80 bg-white p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--vt-color-border-default,#E2E0EC)] text-xs">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Proof Inspection Record
                  </span>
                  <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {selectedMedia.title}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                    <IconMapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>GPS Verified Inside Boundary</span>
                  </div>
                  <div className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    <p>{selectedMedia.gpsLocation}</p>
                    <p className="font-mono text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Coords: {selectedMedia.gpsCoordinates || "6.4474° N, 3.4731° E"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Captured At</span>
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{selectedMedia.timestamp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Uploaded By</span>
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{selectedMedia.uploadedBy}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Role</span>
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{selectedMedia.uploaderRole || "Site Manager"}</span>
                  </div>
                  {selectedMedia.sizeMb && (
                    <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">File Size</span>
                      <span className="font-mono text-[var(--vt-color-neutral-600,#5E5A7D)]">{selectedMedia.sizeMb}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="mt-4 w-full h-9 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVAL CONFIRMATION MODAL (PRD FR-REV-02) ── */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!isApprovedSuccess ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                      Approve Stage & Pay
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      Stage {stage.stageNumber}: {stage.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsApproveModalOpen(false)}
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-green-800,#195230)] block">
                      Amount to release from escrow
                    </span>
                    <span className="text-xl font-black text-[var(--vt-color-green-900,#0F331E)]">
                      {formatNaira(stage.trancheAmount)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--vt-color-green-700,#1F6B3E)]">
                    Paid to {project.contractor.name}
                  </span>
                </div>

                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  By clicking approve, you confirm that you or your representatives have inspected the work and GPS photos. This tranche will be immediately released to the contractor.
                </p>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsApproveModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveStage}
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <IconCheck className="w-3.5 h-3.5" />
                    <span>Confirm & Release {formatNaira(stage.trancheAmount)}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-600,#248246)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Stage Approved Successfully!
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  {formatNaira(stage.trancheAmount)} has been released to {project.contractor.name}. Verified progress updated to 88%.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsApproveModalOpen(false);
                    setIsApprovedSuccess(false);
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

      {/* ── REJECTION & ISSUE GENERATION MODAL (PRD FR-REV-03) ── */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!isRejectSuccess ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-rose-700,#BE123C)]">
                      Request Work Fixes (Reject Stage)
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      Select which items failed inspection (PRD FR-REV-03)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(false)}
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Tick failed checklist items:
                  </span>
                  {stage.checklist.map((c) => {
                    const isFailed = failedChecklistIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (isFailed) {
                            setFailedChecklistIds(failedChecklistIds.filter((id) => id !== c.id));
                          } else {
                            setFailedChecklistIds([...failedChecklistIds, c.id]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                          isFailed
                            ? "bg-[var(--vt-color-rose-50,#FFF1F2)] border-[var(--vt-color-rose-300,#FDA4AF)] text-[var(--vt-color-rose-900,#881337)]"
                            : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-700,#46425F)]"
                        }`}
                      >
                        <span>{c.label}</span>
                        <span className={`text-[11px] font-bold ${isFailed ? "text-[var(--vt-color-rose-600,#E11D48)]" : "text-[var(--vt-color-neutral-400,#A3A0B8)]"}`}>
                          {isFailed ? "Failed" : "Pass"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label htmlFor="rejection-reason" className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Explanation / What needs to be fixed:
                  </label>
                  <textarea
                    id="rejection-reason"
                    rows={3}
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="E.g., Honeycombing on cantilever edge needs patching and re-vibrating..."
                    className="w-full p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-900,#191530)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--vt-color-rose-500,#F43F5E)]/20"
                  />
                  <span className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Each failed checklist item automatically creates a tracked Issue assigned to {project.siteManager.name}.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectStage}
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-rose-600,#E11D48)] hover:bg-[var(--vt-color-rose-700,#BE123C)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                  >
                    Submit Fix Request
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-rose-50,#FFF1F2)] text-[var(--vt-color-rose-600,#E11D48)] border border-[var(--vt-color-rose-200,#FECDD3)] flex items-center justify-center">
                  <IconAlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Issues Dispatched to Contractor
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  The stage has been returned to In Progress. {project.siteManager.name} will rectify the issues and re-submit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setIsRejectSuccess(false);
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
