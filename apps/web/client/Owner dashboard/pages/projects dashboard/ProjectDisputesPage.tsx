"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import {
  getProjectDetail,
  ProjectDisputeItem,
  DisputeEscalationTier,
  DisputeTimelineEvent,
  DisputeSettlementTerms,
  ProposedCurePlan,
  BackchargeOrder,
  RetentionDlpConfig,
} from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import {
  IconCheck,
  IconClose,
  IconPlus,
  IconAlertTriangle,
  IconSend,
  IconShieldCheck,
  IconLock,
  IconClock,
  IconArrowRight,
  IconDownload,
  IconShare,
} from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";

interface ProjectDisputesPageProps {
  projectId?: string;
}

export function ProjectDisputesPage({ projectId = "proj-lekki" }: ProjectDisputesPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_disputes_${projectId}`);
  const project = getProjectDetail(projectId);
  const storageKey = `vantaged_disputes_${projectId}`;

  // Retention & Defects Liability Period (DLP) configuration state
  const [retentionConfig, setRetentionConfig] = useState<RetentionDlpConfig>(
    project.retentionDlp || {
      retentionRatePercent: 5,
      totalRetentionAmount: 12250000,
      dlpDurationMonths: 12,
      dlpStatus: "Active DLP Warranty",
      handoverDate: "15 Oct 2026",
      targetReleaseDate: "15 Oct 2027",
      daysRemaining: 355,
      activeSnagsCount: 1,
      totalClaimsDeducted: 0,
      escrowBalance: 12250000,
      escrowCustodian: "Vantaged Secure Escrow Trust",
      coveredTrades: [
        "Roof Parapet & Terrace Waterproofing",
        "Structural Settlement & Plaster Cracks",
        "MEP, Conduits & Main Distribution Board",
        "Plumbing Pipework, Drainage & Water Pressure",
        "Window & Sliding Door Weather Seals",
        "Solid Timber Joinery & Cabinetry",
      ],
      termsSummary:
        "5% retention (₦12,250,000) held in segregated Vantaged escrow trust for 12 months following practical handover. Contractor is contractually obliged to remediate latent defects within 14 days of notice, failing which owner can authorize backcharge drawdowns from this retention pool.",
    }
  );

  const [isDlpModalOpen, setIsDlpModalOpen] = useState(false);
  const [negotiatedDlpMonths, setNegotiatedDlpMonths] = useState<6 | 12>(
    project.retentionDlp?.dlpDurationMonths || 12
  );

  // Filter tabs: All, Milestone Holds, Warranty Snags, Resolved
  const [disputeScopeTab, setDisputeScopeTab] = useState<"all" | "milestone" | "dlp" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Persistent disputes list in client state
  const [disputes, setDisputes] = useState<ProjectDisputeItem[]>(project.disputes);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(project.disputes[0]?.id || "");

  // Dossier active sub-tab: Overview & Plan vs Timeline vs Financial/Backcharge
  const [dossierTab, setDossierTab] = useState<"overview" | "timeline" | "financial">("overview");

  // Load from localStorage on mount & listen for storage updates with defensive normalization
  useEffect(() => {
    const loadDisputes = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized: ProjectDisputeItem[] = parsed.map((d: any, idx: number) => ({
              id: d.id || `disp-${idx}`,
              disputeCode: d.disputeCode || `DISP-2026-00${idx + 1}`,
              title: d.title || "Reported Defect",
              category: d.category || "Quality of Work",
              linkedStage: d.linkedStage || project.stages[0]?.title || "Stage 1",
              linkedTrancheAmount: typeof d.linkedTrancheAmount === "number" ? d.linkedTrancheAmount : 18450000,
              escrowQuarantineAmount:
                typeof d.escrowQuarantineAmount === "number"
                  ? d.escrowQuarantineAmount
                  : d.status === "Resolved" || d.isDlpClaim || d.id === "dsp-104"
                  ? 0
                  : d.linkedTrancheAmount || 18450000,
              status: d.status || "Active Dispute",
              escalationTier:
                d.escalationTier ||
                (d.status === "Under Independent Inspection"
                  ? "Tier 2: Independent QS & Structural Inspection"
                  : d.status === "In Formal Arbitration"
                  ? "Tier 3: Formal Vantaged Escrow Arbitration"
                  : "Tier 1: Direct Contractor Rectification"),
              openedDate: d.openedDate || "Recently",
              daysRemaining: typeof d.daysRemaining === "number" ? d.daysRemaining : 2,
              cureNoticeDeadline: d.cureNoticeDeadline || "In 48 Hours",
              raisedBy: d.raisedBy || "Dr. James Arinze (Owner)",
              defectSeverity: d.defectSeverity || "Moderate Defect",
              cureStatus:
                d.cureStatus ||
                (d.status === "Resolved"
                  ? "Cure Complete - Ready for Review"
                  : d.status === "Under Independent Inspection"
                  ? "Cure Defaulted"
                  : "Cure Plan Pending Approval"),
              responseWindowHoursRemaining: typeof d.responseWindowHoursRemaining === "number" ? d.responseWindowHoursRemaining : 42,
              proposedCurePlan:
                d.proposedCurePlan ||
                (d.status === "Resolved"
                  ? undefined
                  : {
                      methodStatement:
                        d.builderReply ||
                        "Mechanical chipping of unsound concrete, steel primer application, and pneumatic placement of Sika structural polymer mortar.",
                      proposedCompletionDate: "3 Nov 2026",
                      proposedDurationDays: 7,
                      severityMaxAllowedDays: d.defectSeverity === "Minor Snag" ? 7 : d.defectSeverity === "Critical Structural Risk" ? 28 : 14,
                      status: "Awaiting Owner Approval",
                      builderNote:
                        "Mortar requires curing prior to load checks. Requesting 7 calendar days total to ensure structural compliance.",
                    }),
              whatHappened: d.whatHappened || "",
              builderReply: d.builderReply || "Notice dispatched to contractor.",
              howItWasFixed: d.howItWasFixed || "Contractor disbursement halted under payout freeze.",
              inspectorName: d.inspectorName,
              inspectionReportSummary: d.inspectionReportSummary,
              overdueDays:
                typeof d.overdueDays === "number"
                  ? d.overdueDays
                  : (d.id === "dsp-102" || d.cureStatus === "Cure Defaulted" ? 2 : 0),
              dailyDelayFineRate:
                typeof d.dailyDelayFineRate === "number" ? d.dailyDelayFineRate : 35000,
              delayFineAccrued:
                typeof d.delayFineAccrued === "number"
                  ? d.delayFineAccrued
                  : ((d.overdueDays ?? (d.id === "dsp-102" || d.cureStatus === "Cure Defaulted" ? 2 : 0)) * (d.dailyDelayFineRate ?? 35000)),
              isDelayFineWaived: typeof d.isDelayFineWaived === "boolean" ? d.isDelayFineWaived : false,
              backchargeOrder:
                d.backchargeOrder ||
                (d.id === "dsp-102"
                  ? {
                      id: "bc-2026-001",
                      createdAt: "Yesterday, 16:30",
                      source: "Off-Platform Artisan",
                      artisanName: "ArcLine Electrical Services (Engr. Tunde Bakare)",
                      artisanContact: "+234 803 555 4912",
                      trade: "Certified MEP & Conduit Specialist",
                      scopeOfWork:
                        "Complete strip-out of 140m uncertified PVC conduits and replacement with Schneider heavy-gauge BS 4607 conduits before roof plastering.",
                      invoiceAmount: 1450000,
                      status: "Work in Progress",
                      invoiceRef: "INV-ARCLINE-8821",
                      viewLinkToken: "vantaged.ng/inspect/token-8821",
                      notes:
                        "Dispatched under Owner-Controlled Backcharge protocol. Deducted directly from Stage 4 milestone funds.",
                    }
                  : undefined),
              settlement: d.settlement,
              isDlpClaim:
                typeof d.isDlpClaim === "boolean"
                  ? d.isDlpClaim
                  : d.id === "dsp-104",
              retentionClaimAmount: d.retentionClaimAmount,
              dlpWarrantyMonth: d.dlpWarrantyMonth,
              timelineEvents: Array.isArray(d.timelineEvents) && d.timelineEvents.length > 0
                ? d.timelineEvents
                : [
                    {
                      id: `tl-${d.id}-1`,
                      timestamp: d.openedDate || "Recently",
                      author: d.raisedBy || "Dr. James Arinze",
                      role: "Owner",
                      tier: d.escalationTier || "Tier 1: Direct Contractor Rectification",
                      action: "Issue Opened & Defect Logged",
                      notes: d.whatHappened || "Defect logged on site.",
                    },
                  ],
            }));

            const savedIds = new Set(parsed.map((p: any) => p.id));
            const missingDefaults = project.disputes.filter((pd) => !savedIds.has(pd.id));
            const fullDisputes = [...normalized, ...missingDefaults];

            setDisputes(fullDisputes);
            setSelectedDisputeId((prev) => {
              if (prev && fullDisputes.some((d: ProjectDisputeItem) => d.id === prev)) return prev;
              return fullDisputes[0]?.id || "";
            });
          }
        }
      } catch {}
    };

    loadDisputes();
    window.addEventListener("vantaged_storage_update", loadDisputes);
    return () => window.removeEventListener("vantaged_storage_update", loadDisputes);
  }, [storageKey, project.stages, project.disputes]);

  // Reply / note input
  const [ownerReplyText, setOwnerReplyText] = useState("");

  // Modals state
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [newDisputeTitle, setNewDisputeTitle] = useState("");
  const [newDisputeCategory, setNewDisputeCategory] = useState<"Quality of Work" | "Payment Issue" | "Change in Plan">("Quality of Work");
  const [newDisputeStage, setNewDisputeStage] = useState(project.stages[3]?.title || project.stages[0]?.title);
  const [newDisputeSeverity, setNewDisputeSeverity] = useState<"Minor Snag" | "Moderate Defect" | "Critical Structural Risk">("Moderate Defect");
  const [newDisputeReason, setNewDisputeReason] = useState("");
  const [isNewDisputeDlp, setIsNewDisputeDlp] = useState(false);
  const [newDisputeDlpClaimAmount, setNewDisputeDlpClaimAmount] = useState<number>(850000);

  // Escalation Modals state
  const [isEscalateTier2Open, setIsEscalateTier2Open] = useState(false);
  const [isEscalateTier3Open, setIsEscalateTier3Open] = useState(false);

  // Settlement Modal state
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settlementChoice, setSettlementChoice] = useState<"Full Rectification & Release" | "Partial Release with Holdback" | "Full Tranche Refund to Owner">("Full Rectification & Release");
  const [partialHoldbackPercent, setPartialHoldbackPercent] = useState<number>(35);
  const [settlementNotes, setSettlementNotes] = useState("");
  const [enforceDelayFine, setEnforceDelayFine] = useState(true);

  // Cure Plan Review Modal state
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [counterDecision, setCounterDecision] = useState<"counter" | "reject_escalate">("counter");
  const [counterDays, setCounterDays] = useState(4);
  const [counterReason, setCounterReason] = useState("");

  // Backcharge Modal state
  const [isBackchargeModalOpen, setIsBackchargeModalOpen] = useState(false);
  const [backchargeSource, setBackchargeSource] = useState<"Off-Platform Artisan" | "Vantaged Verified Specialist">("Off-Platform Artisan");
  const [backchargeArtisanName, setBackchargeArtisanName] = useState("");
  const [backchargeContact, setBackchargeContact] = useState("");
  const [backchargeTrade, setBackchargeTrade] = useState("Certified MEP & Electrical Specialist");
  const [backchargeScope, setBackchargeScope] = useState("");
  const [backchargeAmount, setBackchargeAmount] = useState<number>(1200000);
  const [backchargeInvoiceRef, setBackchargeInvoiceRef] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const persistDisputes = (updated: ProjectDisputeItem[]) => {
    setDisputes(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event("vantaged_storage_update"));
      } catch {}
    }
  };

  const formatNaira = (val?: number) => {
    if (val === undefined || isNaN(val)) return "₦0";
    if (val >= 1000000) {
      return `₦${(val / 1000000).toLocaleString("en-NG", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const formatNairaFull = (val?: number) => {
    if (val === undefined || isNaN(val)) return "₦0";
    return `₦${val.toLocaleString("en-NG")}`;
  };

  // KPI Calculations
  const totalQuarantined = useMemo(() => {
    return disputes
      .filter((d) => d.status !== "Resolved" && !d.isDlpClaim)
      .reduce((acc, d) => acc + (d.escrowQuarantineAmount ?? d.linkedTrancheAmount ?? 0), 0);
  }, [disputes]);

  const activeDisputesCount = useMemo(() => {
    return disputes.filter((d) => d.status !== "Resolved").length;
  }, [disputes]);

  const underInspectionOrArbitrationCount = useMemo(() => {
    return disputes.filter((d) => d.status === "Under Independent Inspection" || d.status === "In Formal Arbitration").length;
  }, [disputes]);

  const resolvedCount = useMemo(() => {
    return disputes.filter((d) => d.status === "Resolved").length;
  }, [disputes]);

  // Selected Dispute
  const selectedDispute = useMemo(() => {
    return disputes.find((d) => d.id === selectedDisputeId) || disputes[0] || null;
  }, [disputes, selectedDisputeId]);

  // Filtered Disputes
  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      // 1. Scope Tab
      if (disputeScopeTab === "milestone" && (d.isDlpClaim || d.status === "Resolved")) return false;
      if (disputeScopeTab === "dlp" && !d.isDlpClaim) return false;
      if (disputeScopeTab === "resolved" && d.status !== "Resolved") return false;

      // 2. Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = d.title.toLowerCase().includes(q);
        const matchesCode = (d.disputeCode || "").toLowerCase().includes(q);
        const matchesStage = (d.linkedStage || "").toLowerCase().includes(q);
        const matchesCategory = d.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesStage && !matchesCategory) return false;
      }

      return true;
    });
  }, [disputes, disputeScopeTab, searchQuery]);

  // Delay Fine Calculation Helper
  const calculateDelayFine = (d?: ProjectDisputeItem | null) => {
    if (!d) {
      return { overdueDays: 0, dailyRate: 35000, totalFine: 0, ownerComp: 0, platformFee: 0, isWaived: false, isOverdue: false };
    }
    const overdueDays = d.overdueDays ?? (d.daysRemaining < 0 ? Math.abs(d.daysRemaining) : d.cureStatus === "Cure Defaulted" ? 2 : 0);
    const dailyRate = d.dailyDelayFineRate ?? 35000;
    const isWaived = Boolean(d.isDelayFineWaived);
    const isOverdue = overdueDays > 0;
    const totalFine = isOverdue && !isWaived ? overdueDays * dailyRate : 0;
    const ownerComp = Math.round(totalFine * 0.8);
    const platformFee = totalFine - ownerComp;

    return { overdueDays, dailyRate, totalFine, ownerComp, platformFee, isWaived, isOverdue };
  };

  // Create New Dispute
  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisputeReason.trim()) return;

    const disputeCode = `DISP-2026-${String(disputes.length + 1).padStart(3, "0")}`;
    const isDlp = isNewDisputeDlp;
    const linkedStage = isDlp ? "Practical Completion & Handover" : newDisputeStage;
    const matchingStageObj = project.stages.find((s) => s.title === linkedStage);
    const trancheAmount = matchingStageObj?.trancheAmount || 18450000;
    const maxAllowedDays = newDisputeSeverity === "Minor Snag" ? 7 : newDisputeSeverity === "Critical Structural Risk" ? 28 : 14;
    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newDispute: ProjectDisputeItem = {
      id: `disp-${Date.now()}`,
      disputeCode,
      title: newDisputeTitle.trim() || `${isDlp ? "DLP Warranty Snag" : "Problem with"} ${linkedStage}`,
      category: newDisputeCategory,
      linkedStage,
      linkedTrancheAmount: trancheAmount,
      escrowQuarantineAmount: isDlp ? 0 : trancheAmount,
      status: "Active Dispute",
      escalationTier: "Tier 1: Direct Contractor Rectification",
      openedDate: "Today, Just now",
      daysRemaining: isDlp ? 14 : 3,
      overdueDays: 0,
      dailyDelayFineRate: isDlp ? 25000 : 35000,
      delayFineAccrued: 0,
      isDelayFineWaived: false,
      cureNoticeDeadline: isDlp ? "14-Day Warranty SLA" : "72h Response Window",
      raisedBy: "Dr. James Arinze (Owner)",
      defectSeverity: newDisputeSeverity,
      cureStatus: "Awaiting Builder Response",
      responseWindowHoursRemaining: 72,
      isDlpClaim: isDlp,
      retentionClaimAmount: isDlp ? Number(newDisputeDlpClaimAmount) || 850000 : undefined,
      dlpWarrantyMonth: isDlp ? 1 : undefined,
      proposedCurePlan: {
        methodStatement: isDlp
          ? "Specialist warranty remediation under 5% Retention Escrow agreement."
          : "Pending builder inspection and submission.",
        proposedCompletionDate: "To be proposed by contractor",
        proposedDurationDays: 0,
        severityMaxAllowedDays: maxAllowedDays,
        status: "Pending Builder Submission",
      },
      whatHappened: newDisputeReason.trim(),
      builderReply: isDlp
        ? `DLP warranty notice dispatched to ${project.contractor.name}. Contractor is bound to rectify post-handover latent defect within 14 days under the ₦${formatNaira(retentionConfig.totalRetentionAmount)} retention trust.`
        : `Notice dispatched to ${project.contractor.name}. Contractor has an active 72-hour window to inspect site and submit a cure plan within the ${maxAllowedDays}-day limit.`,
      howItWasFixed: isDlp
        ? `Backed by ₦${formatNaira(retentionConfig.totalRetentionAmount)} Vantaged 5% Retention Escrow Trust. If contractor fails to cure, owner can backcharge a replacement artisan directly from the retention fund.`
        : "Contractor disbursement halted under Payout Freeze. Funds cannot be released until defect is certified resolved.",
      timelineEvents: [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: nowTimestamp,
          author: "Dr. James Arinze",
          role: "Owner",
          tier: "Tier 1: Direct Contractor Rectification",
          action: isDlp ? "Post-Handover DLP Snag Logged" : "Issue Opened & Defect Logged",
          notes: newDisputeReason.trim(),
        },
        {
          id: `tl-${Date.now()}-2`,
          timestamp: nowTimestamp,
          author: "Vantaged Automated Escrow Guard",
          role: "Vantaged Arbitrator",
          tier: "Tier 1: Direct Contractor Rectification",
          action: isDlp ? "5% Retention Escrow Warranty Activated" : "Milestone Payout Frozen & 72h Cure Notice Issued",
          notes: isDlp
            ? `Post-handover warranty claim logged against ${formatNairaFull(retentionConfig.totalRetentionAmount)} retention escrow pool.`
            : `Contractor payout of ${formatNairaFull(trancheAmount)} placed under protective disbursement hold.`,
        },
      ],
    };

    const next = [newDispute, ...disputes];
    persistDisputes(next);
    setSelectedDisputeId(newDispute.id);
    setIsRaiseModalOpen(false);
    setNewDisputeTitle("");
    setNewDisputeReason("");
    showToast(`Issue ${disputeCode} logged. Escrow protections activated.`);
  };

  // Add note to timeline
  const handleSendOwnerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerReplyText.trim() || !selectedDispute) return;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: nowTimestamp,
      author: "Dr. James Arinze",
      role: "Owner",
      tier: selectedDispute.escalationTier,
      action: "Owner Note / Directive Added",
      notes: ownerReplyText.trim(),
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          timelineEvents: [...(d.timelineEvents || []), newEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    setOwnerReplyText("");
    showToast("Message added to timeline audit log.");
  };

  // Accept Contractor Proposed Cure Plan
  const handleAcceptCurePlan = () => {
    if (!selectedDispute || !selectedDispute.proposedCurePlan) return;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const acceptedEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}-cure-accept`,
      timestamp: nowTimestamp,
      author: "Dr. James Arinze",
      role: "Owner",
      tier: selectedDispute.escalationTier,
      action: "Cure Plan & Timeline Accepted",
      notes: `Owner accepted contractor cure timeline of ${selectedDispute.proposedCurePlan.proposedDurationDays} days. Completion deadline set to ${selectedDispute.proposedCurePlan.proposedCompletionDate}. Payout freeze remains active.`,
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id && d.proposedCurePlan) {
        return {
          ...d,
          cureStatus: "Cure in Progress" as const,
          cureNoticeDeadline: `Due: ${d.proposedCurePlan.proposedCompletionDate}`,
          daysRemaining: d.proposedCurePlan.proposedDurationDays,
          proposedCurePlan: {
            ...d.proposedCurePlan,
            status: "Accepted" as const,
            acceptedAt: nowTimestamp,
          },
          timelineEvents: [...(d.timelineEvents || []), acceptedEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    showToast(`Cure plan approved. Deadline locked to ${selectedDispute.proposedCurePlan.proposedCompletionDate}.`);
  };

  // Reject or Counter Cure Plan
  const handleRejectOrCounterCurePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !selectedDispute.proposedCurePlan) return;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (counterDecision === "counter") {
      const counterEvent: DisputeTimelineEvent = {
        id: `tl-${Date.now()}-counter`,
        timestamp: nowTimestamp,
        author: "Dr. James Arinze",
        role: "Owner",
        tier: selectedDispute.escalationTier,
        action: `Timeline Countered to ${counterDays} Days`,
        notes: counterReason.trim() || `Owner countered requested cure timeline down to ${counterDays} days.`,
      };

      const next = disputes.map((d) => {
        if (d.id === selectedDispute.id && d.proposedCurePlan) {
          return {
            ...d,
            cureStatus: "Cure Plan Pending Approval" as const,
            cureNoticeDeadline: `Countered: ${counterDays} Days`,
            proposedCurePlan: {
              ...d.proposedCurePlan,
              status: "Rejected" as const,
              ownerCounterDate: `${counterDays} Days`,
            },
            timelineEvents: [...(d.timelineEvents || []), counterEvent],
          };
        }
        return d;
      });

      persistDisputes(next);
      setIsCounterModalOpen(false);
      showToast(`Counter-proposal of ${counterDays} days sent to contractor.`);
    } else {
      const escalationEvent: DisputeTimelineEvent = {
        id: `tl-${Date.now()}-esc2`,
        timestamp: nowTimestamp,
        author: "Dr. James Arinze",
        role: "Owner",
        tier: "Tier 2: Independent QS & Structural Inspection",
        action: "Cure Plan Rejected & Escalated to Tier 2",
        notes: counterReason.trim() || "Owner rejected cure plan. Immediate on-site engineer audit requested.",
      };

      const next = disputes.map((d) => {
        if (d.id === selectedDispute.id) {
          return {
            ...d,
            escalationTier: "Tier 2: Independent QS & Structural Inspection" as DisputeEscalationTier,
            status: "Under Independent Inspection" as const,
            cureStatus: "Cure Defaulted" as const,
            inspectorName: "Engr. Emeka Okonkwo, MNSE, COREN",
            inspectionReportSummary: "Independent structural audit scheduled.",
            timelineEvents: [...(d.timelineEvents || []), escalationEvent],
          };
        }
        return d;
      });

      persistDisputes(next);
      setIsCounterModalOpen(false);
      showToast("Cure plan rejected. Dispute escalated to independent inspection.");
    }
  };

  // Escalate to Tier 2
  const handleEscalateToTier2 = () => {
    if (!selectedDispute) return;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const escalationEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}-esc2`,
      timestamp: nowTimestamp,
      author: "Dr. James Arinze",
      role: "Owner",
      tier: "Tier 2: Independent QS & Structural Inspection",
      action: "Escalated to Tier 2 Independent Inspection",
      notes: "Contractor cure window expired or rectification unsatisfactory. Independent structural engineer appointed for on-site defect audit.",
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          escalationTier: "Tier 2: Independent QS & Structural Inspection" as DisputeEscalationTier,
          status: "Under Independent Inspection" as const,
          inspectorName: "Engr. Emeka Okonkwo, MNSE, COREN",
          inspectionReportSummary: "Independent QS on-site inspection initiated.",
          timelineEvents: [...(d.timelineEvents || []), escalationEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    setIsEscalateTier2Open(false);
    showToast("Dispute escalated to Tier 2. Engr. Emeka Okonkwo dispatched for site audit.");
  };

  // Escalate to Tier 3
  const handleEscalateToTier3 = () => {
    if (!selectedDispute) return;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const escalationEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}-esc3`,
      timestamp: nowTimestamp,
      author: "Dr. James Arinze",
      role: "Owner",
      tier: "Tier 3: Formal Vantaged Escrow Arbitration",
      action: "Escalated to Tier 3 Formal Escrow Arbitration",
      notes: "Parties referred to Vantaged Binding Dispute Tribunal for binding award.",
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          escalationTier: "Tier 3: Formal Vantaged Escrow Arbitration" as DisputeEscalationTier,
          status: "In Formal Arbitration" as const,
          timelineEvents: [...(d.timelineEvents || []), escalationEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    setIsEscalateTier3Open(false);
    showToast("Dispute escalated to Tier 3. Vantaged Escrow Arbitration Tribunal assigned.");
  };

  // Execute Settlement
  const handleExecuteSettlement = () => {
    if (!selectedDispute) return;

    const totalTranche = selectedDispute.linkedTrancheAmount || 18450000;
    const { overdueDays, totalFine, ownerComp, platformFee, isWaived } = calculateDelayFine(selectedDispute);
    const applyFine = enforceDelayFine && overdueDays > 0 && !isWaived && totalFine > 0;
    const actualFineDeducted = applyFine ? totalFine : 0;
    const actualOwnerComp = applyFine ? ownerComp : 0;
    const actualPlatformFee = applyFine ? platformFee : 0;
    const backchargeDeduction = selectedDispute.backchargeOrder ? selectedDispute.backchargeOrder.invoiceAmount : 0;

    let basePayout = totalTranche;
    let baseRefund = 0;

    if (settlementChoice === "Partial Release with Holdback") {
      baseRefund = Math.round((totalTranche * partialHoldbackPercent) / 100);
      basePayout = totalTranche - baseRefund;
    } else if (settlementChoice === "Full Tranche Refund to Owner") {
      baseRefund = totalTranche;
      basePayout = 0;
    }

    const finalPayoutAmount = Math.max(0, basePayout - actualFineDeducted - backchargeDeduction);
    const finalRefundAmount = baseRefund + actualOwnerComp + backchargeDeduction;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const settlementData: DisputeSettlementTerms = {
      settlementType: settlementChoice,
      agreedPayoutAmount: finalPayoutAmount,
      agreedRefundAmount: finalRefundAmount,
      delayFineDeducted: actualFineDeducted,
      ownerDelayCompensation: actualOwnerComp,
      platformDelayFee: actualPlatformFee,
      delayFineWaived: !applyFine && overdueDays > 0,
      backchargeDeducted: backchargeDeduction,
      settledDate: nowTimestamp,
      arbitrationVerdictNote:
        settlementNotes.trim() ||
        (settlementChoice === "Full Rectification & Release"
          ? "Contractor successfully rectified defect to specifications. 100% of frozen funds cleared for disbursement."
          : settlementChoice === "Partial Release with Holdback"
          ? `Settlement reached: ${formatNairaFull(finalPayoutAmount)} released to contractor, ${formatNairaFull(finalRefundAmount)} refunded to Owner Escrow Wallet.`
          : `Defective works rejected. 100% of frozen funds (${formatNairaFull(finalRefundAmount)}) refunded to Owner Escrow Balance.`),
    };

    const settlementEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}-settle`,
      timestamp: nowTimestamp,
      author: "Vantaged Dispute Tribunal",
      role: "Vantaged Arbitrator",
      tier: selectedDispute.escalationTier,
      action: `Dispute Resolved: ${settlementChoice}`,
      notes: settlementData.arbitrationVerdictNote,
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          status: "Resolved" as const,
          escrowQuarantineAmount: 0,
          howItWasFixed: settlementData.arbitrationVerdictNote,
          settlement: settlementData,
          timelineEvents: [...(d.timelineEvents || []), settlementEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    setIsSettleModalOpen(false);
    showToast(`Dispute marked as Resolved. Escrow payout freeze released per ${settlementChoice}.`);
  };

  // Create Backcharge
  const handleCreateBackcharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !backchargeArtisanName.trim()) return;

    const tokenNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: BackchargeOrder = {
      id: `bc-${Date.now()}`,
      createdAt: "Just now",
      source: backchargeSource,
      artisanName: backchargeArtisanName.trim(),
      artisanContact: backchargeContact.trim() || "+234 800 000 0000",
      trade: backchargeTrade.trim() || "Specialist Contractor",
      scopeOfWork: backchargeScope.trim() || "Independent remediation of site defect.",
      invoiceAmount: Number(backchargeAmount) || 0,
      status: "Work in Progress",
      invoiceRef: backchargeInvoiceRef.trim() || `INV-${tokenNum}`,
      viewLinkToken: `vantaged.ng/inspect/v-${tokenNum}`,
      notes: `Initiated by Owner. ${formatNairaFull(backchargeAmount)} deducted directly from defaulting contractor's milestone tranche.`,
    };

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const backchargeEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}-bc`,
      timestamp: nowTimestamp,
      author: "Dr. James Arinze",
      role: "Owner",
      tier: selectedDispute.escalationTier,
      action: `Third-Party Backcharge Order Issued: ${formatNaira(newOrder.invoiceAmount)}`,
      notes: `${newOrder.artisanName} (${newOrder.trade}) commissioned for independent remediation. ${formatNairaFull(newOrder.invoiceAmount)} allocated from milestone funds.`,
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          backchargeOrder: newOrder,
          timelineEvents: [...(d.timelineEvents || []), backchargeEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    setIsBackchargeModalOpen(false);
    showToast(`Backcharge order of ${formatNaira(newOrder.invoiceAmount)} approved.`);
  };

  // Complete Backcharge
  const handleCompleteBackcharge = (disputeId: string) => {
    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const next = disputes.map((d) => {
      if (d.id === disputeId && d.backchargeOrder) {
        const completeEvent: DisputeTimelineEvent = {
          id: `tl-${Date.now()}-bccomp`,
          timestamp: nowTimestamp,
          author: "Engr. Emeka Okonkwo",
          role: "Client Representative",
          tier: d.escalationTier,
          action: `Backcharge Rectification Completed & Verified (${formatNaira(d.backchargeOrder.invoiceAmount)})`,
          notes: `Replacement works by ${d.backchargeOrder.artisanName} inspected and certified compliant on site.`,
        };

        return {
          ...d,
          backchargeOrder: {
            ...d.backchargeOrder,
            status: "Completed & Verified" as const,
            completedAt: nowTimestamp,
          },
          timelineEvents: [...(d.timelineEvents || []), completeEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    showToast("Replacement rectification marked Completed & Verified on site.");
  };

  // Cancel Backcharge
  const handleCancelBackcharge = (disputeId: string) => {
    const next = disputes.map((d) => {
      if (d.id === disputeId && d.backchargeOrder) {
        return {
          ...d,
          backchargeOrder: undefined,
        };
      }
      return d;
    });

    persistDisputes(next);
    showToast("Backcharge order revoked.");
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Subtle decorative background vector waves */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path d="M-100 200 C 300 100, 600 450, 1500 100" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1.2" fill="none" />
          <path d="M-50 750 C 400 650, 800 850, 1550 650" stroke="var(--vt-color-neutral-300,#CBC8DA)" strokeWidth="1.2" fill="none" />
          <circle cx="1380" cy="550" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.6" />
        </svg>
      </div>

      {/* ── Left Sidebar Navigation Bar ── */}
      <ProjectSidebarNav projectId={projectId} activeTab="disputes" />

      {/* ── Main Scrollable Workspace ── */}
      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col gap-4 pb-24 md:pb-6"
      >
        {/* Top Header Navigation Bar */}
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={projectId}
              projectTitle={project.title}
              currentPageTitle="Disputes"
            />
          }
        />

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[var(--vt-color-indigo-900,#261A66)] text-white px-4 py-2.5 rounded-xl shadow-xl border border-white/10 flex items-center gap-2.5 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-400,#38C06C)] animate-ping" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* ── 1. Clean Summary Ribbon & Action Bar ── */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Disputes & Resolutions
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-orange-100,#FEDBC7)] text-[var(--vt-color-orange-800,#9C3205)]">
                {activeDisputesCount} Active
              </span>
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Defect rectifications, milestone disbursement freezes, and escrow dispute resolutions.
            </p>
          </div>

          {/* 3 Compact Metric Highlights & Action */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap lg:flex-nowrap w-full lg:w-auto">
            {/* Frozen in Escrow */}
            <div className="px-3.5 py-2 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0">
                <IconLock className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider">
                  Frozen in Escrow
                </p>
                <p className="text-sm font-black text-[var(--vt-color-orange-950,#4E1802)]">
                  {formatNaira(totalQuarantined)}
                </p>
              </div>
            </div>

            {/* Warranty Vault Trigger */}
            <button
              type="button"
              onClick={() => setIsDlpModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-center shrink-0">
                <IconShieldCheck className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider">
                  5% Retention Vault
                </p>
                <p className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  {formatNaira(retentionConfig.totalRetentionAmount)}
                </p>
              </div>
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsRaiseModalOpen(true)}
              className="h-11 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 shrink-0 ml-auto lg:ml-0"
            >
              <IconPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>

        {/* ── 2. Streamlined Filter & Search Bar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-2xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setDisputeScopeTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                disputeScopeTab === "all"
                  ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                  : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              All Issues ({disputes.length})
            </button>
            <button
              type="button"
              onClick={() => setDisputeScopeTab("milestone")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                disputeScopeTab === "milestone"
                  ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                  : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Milestone Holds ({disputes.filter((d) => !d.isDlpClaim && d.status !== "Resolved").length})
            </button>
            <button
              type="button"
              onClick={() => setDisputeScopeTab("dlp")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                disputeScopeTab === "dlp"
                  ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                  : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Warranty Snags ({disputes.filter((d) => d.isDlpClaim).length})
            </button>
            <button
              type="button"
              onClick={() => setDisputeScopeTab("resolved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                disputeScopeTab === "resolved"
                  ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                  : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter disputes or stages..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl text-xs font-medium placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
            />
            <svg
              className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* ── 3. Clean Master-Detail Workspace (2 Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* ── Left Column: Clean Disputes List (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {filteredDisputes.length === 0 ? (
              <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-400,#A3A0B8)] flex items-center justify-center mx-auto mb-3">
                  <IconCheck className="w-6 h-6 stroke-2" />
                </div>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">No disputes found</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-xs mx-auto">
                  {searchQuery ? "Try clearing your search term." : "All construction milestone stages are in good standing."}
                </p>
              </div>
            ) : (
              filteredDisputes.map((item) => {
                const isSelected = selectedDispute?.id === item.id;
                const isResolved = item.status === "Resolved";
                const isDlp = item.isDlpClaim;
                const isOverdue = (item.overdueDays ?? 0) > 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDisputeId(item.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-white border-[var(--vt-color-orange-500,#EF5F18)] shadow-md ring-1 ring-[var(--vt-color-orange-500,#EF5F18)]"
                        : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs"
                    }`}
                  >
                    {/* Header Row: Code & Status */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {item.disputeCode}
                      </span>

                      {/* Clean Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isResolved
                            ? "bg-[var(--vt-color-green-100,#DCF4E3)] text-[var(--vt-color-green-800,#134E2C)]"
                            : item.status === "Under Independent Inspection"
                            ? "bg-purple-100 text-purple-800"
                            : isOverdue
                            ? "bg-rose-100 text-rose-800 animate-pulse"
                            : "bg-[var(--vt-color-orange-100,#FEDBC7)] text-[var(--vt-color-orange-800,#9C3205)]"
                        }`}
                      >
                        {isResolved
                          ? "Resolved"
                          : item.status === "Under Independent Inspection"
                          ? "Tier 2 Inspection"
                          : isOverdue
                          ? "Overdue Response"
                          : "Action Required"}
                      </span>
                    </div>

                    {/* Defect Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Linked Stage */}
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 truncate">
                      {item.linkedStage}
                    </p>

                    {/* Bottom Row: Protected Amount & Timeline */}
                    <div className="mt-2.5 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px] font-semibold">
                      <span className="flex items-center gap-1 text-[var(--vt-color-orange-700,#B33C08)]">
                        <IconLock className="w-3 h-3" />
                        <span>
                          {isDlp
                            ? `${formatNaira(item.retentionClaimAmount || 850000)} warranty claim`
                            : isResolved
                            ? "Escrow released"
                            : `${formatNaira(item.escrowQuarantineAmount || item.linkedTrancheAmount)} frozen`}
                        </span>
                      </span>

                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">
                        {isResolved ? "Closed" : item.cureNoticeDeadline}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* ── Right Column: Streamlined Dossier (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
            {selectedDispute ? (
              <>
                {/* ── Card 1: Dispute Header & Resolution Progress ── */}
                <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          {selectedDispute.disputeCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]">
                          {selectedDispute.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {selectedDispute.defectSeverity}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                        {selectedDispute.title}
                      </h2>
                    </div>

                    {/* Escrow Protected Pill */}
                    <div className="px-3 py-1.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] shrink-0 self-start sm:self-center">
                      <p className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider">
                        Disbursement Freeze
                      </p>
                      <p className="text-xs sm:text-sm font-black text-[var(--vt-color-orange-950,#4E1802)]">
                        {formatNaira(selectedDispute.escrowQuarantineAmount || selectedDispute.linkedTrancheAmount)} Held
                      </p>
                    </div>
                  </div>

                  {/* Compact 3-Step Escalation Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] mb-1.5">
                      <span>Escalation Resolution Pathway</span>
                      <span className="text-[var(--vt-color-indigo-900,#261A66)]">{selectedDispute.escalationTier}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedDispute.escalationTier.includes("Tier 1") || selectedDispute.escalationTier.includes("Tier 2") || selectedDispute.escalationTier.includes("Tier 3")
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                            : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                        }`}
                        title="Tier 1: Direct Contractor Rectification"
                      />
                      <div
                        className={`h-2 rounded-full ${
                          selectedDispute.escalationTier.includes("Tier 2") || selectedDispute.escalationTier.includes("Tier 3")
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                            : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                        }`}
                        title="Tier 2: Independent Consultant Inspection"
                      />
                      <div
                        className={`h-2 rounded-full ${
                          selectedDispute.escalationTier.includes("Tier 3")
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                            : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                        }`}
                        title="Tier 3: Formal Arbitration Tribunal"
                      />
                    </div>
                    <div className="grid grid-cols-3 text-[10px] font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)] mt-1">
                      <span>1. Direct Fix</span>
                      <span className="text-center">2. Engineer Audit</span>
                      <span className="text-right">3. Tribunal</span>
                    </div>
                  </div>
                </div>

                {/* ── Card 2: Defect Details & Contractor Cure Plan ── */}
                <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
                  {/* Defect Description */}
                  <div>
                    <h3 className="text-xs font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase tracking-wider mb-1">
                      Observed Site Defect
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] leading-relaxed bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]">
                      {selectedDispute.whatHappened || "Issue reported during site inspection."}
                    </p>
                  </div>

                  {/* Builder Proposed Cure Plan */}
                  {selectedDispute.proposedCurePlan && (
                    <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/60 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[var(--vt-color-orange-800,#9C3205)] flex items-center gap-1.5">
                          <IconAlertTriangle className="w-3.5 h-3.5" />
                          <span>Builder's Proposed Cure & Timeline</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[var(--vt-color-orange-700,#B33C08)] border border-orange-200">
                          {selectedDispute.proposedCurePlan.status}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--vt-color-neutral-700,#443F63)] leading-relaxed">
                        {selectedDispute.proposedCurePlan.methodStatement}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-orange-200/60">
                        <span className="text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          Proposed Date: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{selectedDispute.proposedCurePlan.proposedCompletionDate}</strong>
                        </span>

                        {/* Owner Decision Action Gate Buttons */}
                        {selectedDispute.proposedCurePlan.status === "Awaiting Owner Approval" && selectedDispute.status !== "Resolved" && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCounterDecision("counter");
                                setIsCounterModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-neutral-50 text-[var(--vt-color-neutral-700,#443F63)] cursor-pointer"
                            >
                              Counter Date
                            </button>
                            <button
                              type="button"
                              onClick={handleAcceptCurePlan}
                              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[var(--vt-color-green-600,#247E46)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white cursor-pointer shadow-xs"
                            >
                              ✓ Approve Cure
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overdue Alert if active */}
                  {(selectedDispute.overdueDays ?? 0) > 0 && selectedDispute.status !== "Resolved" && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span>
                          Contractor response is overdue by <strong>{selectedDispute.overdueDays} days</strong>.
                        </span>
                      </div>
                      <span className="font-bold">
                        {formatNaira(calculateDelayFine(selectedDispute).totalFine)} fine accrued
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Card 3: Tabbed Activity, Financials & Actions ── */}
                <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xs overflow-hidden flex flex-col">
                  {/* Sub-tab Navigation */}
                  <div className="flex items-center border-b border-[var(--vt-color-neutral-100,#EFEEF5)] px-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                    <button
                      type="button"
                      onClick={() => setDossierTab("overview")}
                      className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                        dossierTab === "overview"
                          ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)]"
                          : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                      }`}
                    >
                      Audit Trail & Messages
                    </button>
                    <button
                      type="button"
                      onClick={() => setDossierTab("financial")}
                      className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                        dossierTab === "financial"
                          ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)]"
                          : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                      }`}
                    >
                      <span>Financial & Backcharges</span>
                      {selectedDispute.backchargeOrder && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDossierTab("timeline")}
                      className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                        dossierTab === "timeline"
                          ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)]"
                          : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                      }`}
                    >
                      Resolution Actions
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="p-4 sm:p-5">
                    {/* TAB 1: Audit Trail & Messages */}
                    {dossierTab === "overview" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                          {(selectedDispute.timelineEvents || []).map((ev) => (
                            <div key={ev.id} className="p-2.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-neutral-100,#EFEEF5)] text-xs">
                              <div className="flex items-center justify-between text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-semibold mb-1">
                                <span>{ev.author} ({ev.role})</span>
                                <span>{ev.timestamp}</span>
                              </div>
                              <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{ev.action}</p>
                              <p className="text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">{ev.notes}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reply Input Form */}
                        {selectedDispute.status !== "Resolved" && (
                          <form onSubmit={handleSendOwnerNote} className="flex items-center gap-2 mt-2 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                            <input
                              type="text"
                              value={ownerReplyText}
                              onChange={(e) => setOwnerReplyText(e.target.value)}
                              placeholder="Add instruction, instruction note, or query to audit trail..."
                              className="flex-1 h-9 px-3 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl text-xs focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                            />
                            <button
                              type="submit"
                              disabled={!ownerReplyText.trim()}
                              className="h-9 px-3 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1"
                            >
                              <IconSend className="w-3.5 h-3.5" />
                              <span>Send</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* TAB 2: Financial & Backcharges */}
                    {dossierTab === "financial" && (
                      <div className="flex flex-col gap-3.5">
                        {/* Delay Fine Summary */}
                        <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Liquidated Delay Damages</p>
                            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">Rate: ₦35,000/calendar day overdue</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                              {formatNaira(calculateDelayFine(selectedDispute).totalFine)}
                            </p>
                            <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                              {calculateDelayFine(selectedDispute).overdueDays} days calculated
                            </p>
                          </div>
                        </div>

                        {/* Backcharge Order Display */}
                        {selectedDispute.backchargeOrder ? (
                          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--vt-color-orange-800,#9C3205)]">
                                Active Third-Party Backcharge
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[var(--vt-color-orange-700,#B33C08)] border border-orange-200">
                                {selectedDispute.backchargeOrder.status}
                              </span>
                            </div>

                            <p className="text-xs text-[var(--vt-color-neutral-700,#443F63)]">
                              <strong>Artisan:</strong> {selectedDispute.backchargeOrder.artisanName} · {selectedDispute.backchargeOrder.trade}
                            </p>
                            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                              {selectedDispute.backchargeOrder.scopeOfWork}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-orange-200/60 text-xs">
                              <span className="font-black text-[var(--vt-color-orange-900,#7C2704)]">
                                {formatNairaFull(selectedDispute.backchargeOrder.invoiceAmount)}
                              </span>

                              {selectedDispute.status !== "Resolved" && (
                                <div className="flex items-center gap-1.5">
                                  {selectedDispute.backchargeOrder.status !== "Completed & Verified" && (
                                    <button
                                      type="button"
                                      onClick={() => handleCompleteBackcharge(selectedDispute.id)}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[var(--vt-color-green-600,#247E46)] text-white cursor-pointer"
                                    >
                                      ✓ Verify Complete
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleCancelBackcharge(selectedDispute.id)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] text-center flex flex-col items-center gap-2">
                            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm">
                              Need to bring in an independent artisan to fix this defect? You can deduct their invoice directly from the builder's held escrow payout.
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsBackchargeModalOpen(true)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] cursor-pointer"
                            >
                              + Issue Third-Party Backcharge Order
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: Resolution & Escrow Actions */}
                    {dossierTab === "timeline" && (
                      <div className="flex flex-col gap-3">
                        {selectedDispute.status === "Resolved" ? (
                          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-900">
                            <p className="font-bold text-sm">Dispute Resolved</p>
                            <p className="mt-1">{selectedDispute.settlement?.arbitrationVerdictNote || selectedDispute.howItWasFixed}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            {/* Primary Settle & Release Button */}
                            <button
                              type="button"
                              onClick={() => setIsSettleModalOpen(true)}
                              className="w-full py-2.5 rounded-xl bg-[var(--vt-color-green-600,#247E46)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                            >
                              <IconCheck className="w-4 h-4 stroke-2" />
                              <span>Confirm Fixed & Release Escrow Funds</span>
                            </button>

                            {/* Secondary Escalation Options */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                              <button
                                type="button"
                                onClick={() => setIsEscalateTier2Open(true)}
                                className="py-2 px-3 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-neutral-50 text-[var(--vt-color-neutral-700,#443F63)] text-xs font-semibold cursor-pointer"
                              >
                                Escalate to Tier 2 (QS Audit)
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEscalateTier3Open(true)}
                                className="py-2 px-3 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-neutral-50 text-[var(--vt-color-neutral-700,#443F63)] text-xs font-semibold cursor-pointer"
                              >
                                Escalate to Tier 3 (Arbitration)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>

      {/* ── MODAL 1: Report a Problem / Defect ── */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Report a Site Problem</h3>
              <button type="button" onClick={() => setIsRaiseModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Problem Title</label>
                <input
                  type="text"
                  required
                  value={newDisputeTitle}
                  onChange={(e) => setNewDisputeTitle(e.target.value)}
                  placeholder="e.g. Concrete honeycombing on Column C4"
                  className="w-full h-9 px-3 rounded-xl border text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-neutral-600 mb-1 block">Milestone Stage</label>
                  <select
                    value={newDisputeStage}
                    onChange={(e) => setNewDisputeStage(e.target.value)}
                    className="w-full h-9 px-2 rounded-xl border text-xs"
                  >
                    {project.stages.map((s) => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-600 mb-1 block">Defect Severity</label>
                  <select
                    value={newDisputeSeverity}
                    onChange={(e) => setNewDisputeSeverity(e.target.value as any)}
                    className="w-full h-9 px-2 rounded-xl border text-xs"
                  >
                    <option value="Minor Snag">Minor Snag (7-day cure)</option>
                    <option value="Moderate Defect">Moderate Defect (14-day cure)</option>
                    <option value="Critical Structural Risk">Critical Structural Risk (28-day cure)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Description & Evidence</label>
                <textarea
                  required
                  rows={3}
                  value={newDisputeReason}
                  onChange={(e) => setNewDisputeReason(e.target.value)}
                  placeholder="Describe the issue observed during site inspection..."
                  className="w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <IconShieldCheck className="w-4 h-4 shrink-0 text-amber-700" />
                <span>Logging this issue automatically freezes the milestone tranche disbursement in escrow trust.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsRaiseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 cursor-pointer shadow-xs"
                >
                  Confirm & Freeze Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Escalate to Tier 2 (QS Audit) ── */}
      {isEscalateTier2Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-3.5">
            <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Escalate to Tier 2 (Independent QS)</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              An independent chartered structural engineer (COREN / MNSE certified) will be commissioned to conduct on-site core sampling and compliance verification.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setIsEscalateTier2Open(false)} className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={handleEscalateToTier2} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-900 text-white cursor-pointer shadow-xs">
                Dispatch Independent Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Escalate to Tier 3 (Arbitration) ── */}
      {isEscalateTier3Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-3.5">
            <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Escalate to Tier 3 (Tribunal)</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Refers the matter to the Vantaged Escrow Arbitration Tribunal for a binding award under the construction agreement terms.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setIsEscalateTier3Open(false)} className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={handleEscalateToTier3} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-900 text-white cursor-pointer shadow-xs">
                Initiate Tribunal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Settlement & Escrow Release ── */}
      {isSettleModalOpen && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Resolve & Release Escrow</h3>
              <button type="button" onClick={() => setIsSettleModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-600">Select Resolution Type</label>
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementChoice === "Full Rectification & Release"}
                    onChange={() => setSettlementChoice("Full Rectification & Release")}
                  />
                  <span>100% Release (Contractor Fixed Defect)</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementChoice === "Partial Release with Holdback"}
                    onChange={() => setSettlementChoice("Partial Release with Holdback")}
                  />
                  <span>Partial Release with Holdback (Owner Refund)</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementChoice === "Full Tranche Refund to Owner"}
                    onChange={() => setSettlementChoice("Full Tranche Refund to Owner")}
                  />
                  <span>Full Refund to Owner Escrow Wallet</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setIsSettleModalOpen(false)} className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={handleExecuteSettlement} className="px-4 py-2 rounded-xl text-xs font-bold bg-green-600 text-white cursor-pointer shadow-xs">
                Confirm & Release Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: Counter Cure Plan ── */}
      {isCounterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border flex flex-col gap-3.5">
            <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Counter Proposed Timeline</h3>
            <form onSubmit={handleRejectOrCounterCurePlan} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Allowed Rectification Days</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={counterDays}
                  onChange={(e) => setCounterDays(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Instructions / Note for Builder</label>
                <textarea
                  rows={2}
                  value={counterReason}
                  onChange={(e) => setCounterReason(e.target.value)}
                  placeholder="e.g. Please expedite curing using rapid-hardening additives."
                  className="w-full p-2.5 rounded-xl border text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsCounterModalOpen(false)} className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white cursor-pointer shadow-xs">
                  Send Counter-Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: Third-Party Backcharge Entry ── */}
      {isBackchargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Issue Third-Party Backcharge</h3>
              <button type="button" onClick={() => setIsBackchargeModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBackcharge} className="flex flex-col gap-2.5">
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Artisan / Company Name</label>
                <input
                  type="text"
                  required
                  value={backchargeArtisanName}
                  onChange={(e) => setBackchargeArtisanName(e.target.value)}
                  placeholder="e.g. ArcLine Electrical Services"
                  className="w-full h-9 px-3 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Scope of Work</label>
                <input
                  type="text"
                  required
                  value={backchargeScope}
                  onChange={(e) => setBackchargeScope(e.target.value)}
                  placeholder="e.g. Replacement of substandard PVC conduits"
                  className="w-full h-9 px-3 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Invoice Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={backchargeAmount}
                  onChange={(e) => setBackchargeAmount(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl border text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsBackchargeModalOpen(false)} className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-900 text-white cursor-pointer shadow-xs">
                  Issue Backcharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 7: DLP Warranty Vault Details ── */}
      {isDlpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <IconShieldCheck className="w-5 h-5 text-indigo-900" />
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">5% Retention & Warranty Vault</h3>
              </div>
              <button type="button" onClick={() => setIsDlpModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Escrow Trust Pool</span>
                <span className="font-black text-indigo-900 text-sm">{formatNairaFull(retentionConfig.totalRetentionAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Warranty Term</span>
                <span className="font-bold text-indigo-900">{retentionConfig.dlpDurationMonths} Months Post-Handover</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Custodian</span>
                <span className="font-bold text-green-700">{retentionConfig.escrowCustodian}</span>
              </div>
            </div>

            <div className="text-xs text-neutral-600 leading-relaxed">
              <p className="font-bold text-neutral-800 mb-1">Covered Latent Defect Scope:</p>
              <div className="flex flex-wrap gap-1.5">
                {retentionConfig.coveredTrades.map((trade) => (
                  <span key={trade} className="px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] text-neutral-700">
                    {trade}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button type="button" onClick={() => setIsDlpModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-900 text-white cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
