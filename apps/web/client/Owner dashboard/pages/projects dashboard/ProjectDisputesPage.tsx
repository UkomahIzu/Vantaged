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
import { VantagedSelect } from "../../components/VantagedSelect";

interface ProjectDisputesPageProps {
  projectId?: string;
}

export function ProjectDisputesPage({ projectId = "proj-lekki" }: ProjectDisputesPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_disputes_${projectId}`);
  const project = getProjectDetail(projectId);
  const storageKey = `vantaged_disputes_${projectId}`;

  // 1-Year Post-Handover Warranty Reserve (5% Retention Fund)
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
        "Structural Settlement & Wall Cracks",
        "MEP, Conduits & Main Distribution Board",
        "Plumbing Pipework, Drainage & Water Pressure",
        "Window & Sliding Door Weather Seals",
        "Solid Timber Joinery & Cabinetry",
      ],
      termsSummary:
        "5% warranty reserve (₦12,250,000) held in segregated Vantaged escrow trust for 12 months after building handover. If hidden defects appear, the contractor must fix them within 14 days, or you can use this fund to hire an independent repair specialist.",
    }
  );

  const [isDlpModalOpen, setIsDlpModalOpen] = useState(false);
  const [negotiatedDlpMonths, setNegotiatedDlpMonths] = useState<6 | 12>(
    project.retentionDlp?.dlpDurationMonths || 12
  );

  // Filter states: Project Stage and Defect Type only
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Persistent disputes list in client state
  const [disputes, setDisputes] = useState<ProjectDisputeItem[]>(project.disputes);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(project.disputes[0]?.id || "");

  // Dossier active sub-tab: Overview & Repair Plan vs Messages vs Financial & Replacement Workers
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
              builderReply: d.builderReply || "Repair notice dispatched to builder.",
              howItWasFixed: d.howItWasFixed || "Milestone payout held safely in escrow pending inspection.",
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
                      trade: "Certified MEP & Electrical Specialist",
                      scopeOfWork:
                        "Complete strip-out of 140m uncertified PVC conduits and replacement with Schneider heavy-gauge BS 4607 conduits before roof plastering.",
                      invoiceAmount: 1450000,
                      status: "Work in Progress",
                      invoiceRef: "INV-ARCLINE-8821",
                      viewLinkToken: "vantaged.ng/inspect/token-8821",
                      notes:
                        "Hired to replace substandard builder materials. Deducted directly from Stage 4 milestone payout.",
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
  const [raiseSuccess, setRaiseSuccess] = useState(false);

  // Escalation Modals state
  const [isEscalateTier2Open, setIsEscalateTier2Open] = useState(false);
  const [selectedInspectorChoice, setSelectedInspectorChoice] = useState("auto");
  const [isEscalateTier3Open, setIsEscalateTier3Open] = useState(false);

  // Settlement Modal state
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settlementChoice, setSettlementChoice] = useState<"Full Rectification & Release" | "Partial Release with Holdback" | "Full Tranche Refund to Owner">("Full Rectification & Release");
  const [partialHoldbackPercent, setPartialHoldbackPercent] = useState<number>(35);
  const [settlementNotes, setSettlementNotes] = useState("");
  const [enforceDelayFine, setEnforceDelayFine] = useState(true);

  // Repair Plan Review Modal state
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [counterDecision, setCounterDecision] = useState<"counter" | "reject_escalate">("counter");
  const [counterDays, setCounterDays] = useState(4);
  const [counterReason, setCounterReason] = useState("");

  // Replacement Worker Modal state (Backcharge)
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
    setTimeout(() => setToastMessage(null), 3800);
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
    if (val >= 1000000000) {
      return `₦${(val / 1000000000).toFixed(2)}B`;
    }
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
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

  const resolvedCount = useMemo(() => {
    return disputes.filter((d) => d.status === "Resolved").length;
  }, [disputes]);

  // Filtered Disputes (Stage and Type only)
  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      // 1. Stage filter
      if (stageFilter !== "all" && d.linkedStage !== stageFilter) return false;

      // 2. Category / Type filter
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;

      return true;
    });
  }, [disputes, stageFilter, categoryFilter]);

  // Selected Dispute (defaults to first item in filtered list if current selection is not visible)
  const selectedDispute = useMemo(() => {
    if (selectedDisputeId && filteredDisputes.some((d) => d.id === selectedDisputeId)) {
      return filteredDisputes.find((d) => d.id === selectedDisputeId) || null;
    }
    return filteredDisputes[0] || null;
  }, [filteredDisputes, selectedDisputeId]);

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
    const linkedStage = newDisputeStage;
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
      title: newDisputeTitle.trim() || `Problem with ${linkedStage}`,
      category: newDisputeCategory,
      linkedStage,
      linkedTrancheAmount: trancheAmount,
      escrowQuarantineAmount: trancheAmount,
      status: "Active Dispute",
      escalationTier: "Tier 1: Direct Contractor Rectification",
      openedDate: "Today, Just now",
      daysRemaining: 3,
      overdueDays: 0,
      dailyDelayFineRate: 35000,
      delayFineAccrued: 0,
      isDelayFineWaived: false,
      cureNoticeDeadline: "72h Builder Response Window",
      raisedBy: "Dr. James Arinze (Owner)",
      defectSeverity: newDisputeSeverity,
      cureStatus: "Awaiting Builder Response",
      responseWindowHoursRemaining: 72,
      isDlpClaim: false,
      proposedCurePlan: {
        methodStatement: "Pending builder site inspection and repair proposal.",
        proposedCompletionDate: "To be proposed by builder",
        proposedDurationDays: 0,
        severityMaxAllowedDays: maxAllowedDays,
        status: "Pending Builder Submission",
      },
      whatHappened: newDisputeReason.trim(),
      builderReply: `Notice sent to ${project.contractor.name}. Builder has 72 hours to inspect the site and submit a repair plan within the ${maxAllowedDays}-day limit.`,
      howItWasFixed: "Builder payment is on hold. Funds cannot be released until defect is certified resolved.",
      timelineEvents: [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: nowTimestamp,
          author: "Dr. James Arinze",
          role: "Owner",
          tier: "Tier 1: Direct Contractor Rectification",
          action: "Defect Logged & Payout Paused",
          notes: newDisputeReason.trim(),
        },
        {
          id: `tl-${Date.now()}-2`,
          timestamp: nowTimestamp,
          author: "Vantaged Automated Escrow Guard",
          role: "Vantaged Arbitrator",
          tier: "Tier 1: Direct Contractor Rectification",
          action: "Milestone Payout Placed on Hold",
          notes: `Builder milestone payment of ${formatNairaFull(trancheAmount)} held safely in escrow.`,
        },
      ],
    };

    const next = [newDispute, ...disputes];
    persistDisputes(next);
    setSelectedDisputeId(newDispute.id);
    setRaiseSuccess(true);
    showToast(`Issue ${disputeCode} logged. Milestone payout placed on hold.`);
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
      action: "Message / Owner Instruction Added",
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
    showToast("Message recorded on official project audit trail.");
  };

  // Accept Contractor Proposed Repair Plan
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
      action: "Repair Plan & Timeline Approved",
      notes: `Owner approved builder repair plan of ${selectedDispute.proposedCurePlan.proposedDurationDays} days. Completion deadline locked to ${selectedDispute.proposedCurePlan.proposedCompletionDate}. Payout remains safely on hold until inspected.`,
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id && d.proposedCurePlan) {
        return {
          ...d,
          cureStatus: "Cure in Progress" as const,
          cureNoticeDeadline: `Target: ${d.proposedCurePlan.proposedCompletionDate}`,
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
    showToast(`Repair plan approved. Completion deadline locked to ${selectedDispute.proposedCurePlan.proposedCompletionDate}.`);
  };

  // Counter or Request Changes to Repair Plan
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
        action: `Requested Faster Repair (${counterDays} Days)`,
        notes: counterReason.trim() || `Owner requested builder complete the repair within ${counterDays} days.`,
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
      showToast(`Request sent to builder for a ${counterDays}-day repair.`);
    } else {
      const escalationEvent: DisputeTimelineEvent = {
        id: `tl-${Date.now()}-esc2`,
        timestamp: nowTimestamp,
        author: "Dr. James Arinze",
        role: "Owner",
        tier: "Tier 2: Independent QS & Structural Inspection",
        action: "Repair Plan Rejected & Escalated to Engineer Inspection",
        notes: counterReason.trim() || "Owner rejected builder proposed repair plan. Independent structural engineer requested.",
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
      showToast("Repair plan rejected. Escalated to independent engineer inspection.");
    }
  };

  // Escalate to Step 2: Independent Engineer Inspection
  const handleEscalateToTier2 = () => {
    if (!selectedDispute) return;

    const nowTimestamp = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const chosenInspector =
      selectedInspectorChoice === "insp-folake"
        ? "Engr. Folake Adeleke, MNSE, COREN"
        : selectedInspectorChoice === "insp-chidinma"
        ? "Engr. Chidinma Eze, MNSE, COREN"
        : "Engr. Emeka Okonkwo, MNSE, COREN (Vantaged Nearest Certified Inspector)";

    const escalationEvent: DisputeTimelineEvent = {
      id: `tl-${Date.now()}-esc2`,
      timestamp: nowTimestamp,
      author: "Dr. James Arinze",
      role: "Owner",
      tier: "Tier 2: Independent QS & Structural Inspection",
      action: `Escalated to Step 2: Certified Audit (${chosenInspector})`,
      notes: `Builder repair challenged or unsatisfactory. ${chosenInspector} appointed for physical on-site compliance test.`,
    };

    const next = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          escalationTier: "Tier 2: Independent QS & Structural Inspection" as DisputeEscalationTier,
          status: "Under Independent Inspection" as const,
          inspectorName: chosenInspector,
          inspectionReportSummary: "Independent compliance audit and physical tests scheduled on site.",
          timelineEvents: [...(d.timelineEvents || []), escalationEvent],
        };
      }
      return d;
    });

    persistDisputes(next);
    setIsEscalateTier2Open(false);
    showToast(`Escalated to Step 2. ${chosenInspector} dispatched for site audit.`);
  };

  // Escalate to Step 3: Vantaged Dispute Panel Ruling
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
      action: "Escalated to Step 3: Formal Vantaged Ruling Panel",
      notes: "Parties unable to agree. Referred to Vantaged Binding Resolution Panel for final decision.",
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
    showToast("Escalated to Step 3. Vantaged Formal Dispute Panel assigned.");
  };

  // Execute Settlement & Release Payout
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
          ? "Contractor successfully fixed defect to specifications. 100% of held milestone payout released to builder."
          : settlementChoice === "Partial Release with Holdback"
          ? `Settlement reached: ${formatNairaFull(finalPayoutAmount)} released to builder for completed work, and ${formatNairaFull(finalRefundAmount)} refunded to Owner Wallet for remaining repairs.`
          : `Defective works rejected. 100% of held funds (${formatNairaFull(finalRefundAmount)}) refunded directly to Owner Wallet.`),
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
    showToast(`Dispute resolved. Held milestone payment released per your decision.`);
  };

  // Create Replacement Worker Order (Backcharge)
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
      trade: backchargeTrade.trim() || "Independent Repair Specialist",
      scopeOfWork: backchargeScope.trim() || "Replacement repair of site defect.",
      invoiceAmount: Number(backchargeAmount) || 0,
      status: "Work in Progress",
      invoiceRef: backchargeInvoiceRef.trim() || `INV-${tokenNum}`,
      viewLinkToken: `vantaged.ng/inspect/v-${tokenNum}`,
      notes: `Hired by Owner. ${formatNairaFull(backchargeAmount)} will be deducted directly from builder's held milestone payment.`,
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
      action: `Replacement Worker Authorized: ${formatNaira(newOrder.invoiceAmount)}`,
      notes: `${newOrder.artisanName} (${newOrder.trade}) commissioned to fix defect. ${formatNairaFull(newOrder.invoiceAmount)} will be deducted from builder's held payment.`,
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
    showToast(`Replacement worker authorized. ${formatNaira(newOrder.invoiceAmount)} allocated from builder's held payment.`);
  };

  // Complete Replacement Worker Order
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
          action: `Replacement Repair Completed & Verified (${formatNaira(d.backchargeOrder.invoiceAmount)})`,
          notes: `Replacement repair by ${d.backchargeOrder.artisanName} inspected and certified compliant on site. Deduction confirmed.`,
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
    showToast("Replacement repair verified complete on site.");
  };

  // Cancel Replacement Worker Order
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
    showToast("Replacement worker order cancelled.");
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      {/* ── Left Sidebar Navigation Bar ── */}
      <ProjectSidebarNav projectId={projectId} activeTab="disputes" />

      {/* ── Main Scrollable Workspace ── */}
      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5"
      >
        {/* Top Header Navigation Bar */}
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={projectId}
              projectTitle={project.title}
              currentPageTitle="Disputes & Defect Resolutions"
            />
          }
        />

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── Top Header Banner (Matching Change Requests Page Style) ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Disputes & Defect Resolutions
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 max-w-xl">
              Report site defects, hold contractor payouts safely in escrow, and review builder repair plans.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setRaiseSuccess(false);
                setNewDisputeTitle("");
                setNewDisputeReason("");
                setIsRaiseModalOpen(true);
              }}
              className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <IconPlus className="w-4 h-4" />
              <span>Report a Problem</span>
            </button>
          </div>
        </section>

        {/* ── Small Cards Grid (Matching Extra Work Page Style) ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Payouts on Hold */}
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Payouts on Hold
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5 block">
              {formatNaira(totalQuarantined)}
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              Held safely in escrow trust
            </span>
          </div>

          {/* Card 2: Active Issues */}
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Active Issues
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
              {activeDisputesCount} Open
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              {disputes.filter((d) => d.cureStatus === "Awaiting Builder Response").length} awaiting builder response
            </span>
          </div>

          {/* Card 3: 1-Year Warranty Fund */}
          <div
            onClick={() => setIsDlpModalOpen(true)}
            className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] shadow-2xs cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                1-Year Warranty Fund
              </span>
              <span className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] group-hover:underline">
                View Terms ↗
              </span>
            </div>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
              {formatNaira(retentionConfig.totalRetentionAmount)}
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              5% retention reserve fund
            </span>
          </div>

          {/* Card 4: Resolved & Released */}
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Resolved & Released
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5 block">
              {resolvedCount} Resolved
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              Verified defect repairs
            </span>
          </div>
        </section>

        {/* ── Filter Toolbar (Project Stage & Type Only) ── */}
        <section className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 font-sans">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Filter By:
            </span>
            <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
              {filteredDisputes.length} {filteredDisputes.length === 1 ? "Issue" : "Issues"}
            </span>
            {(stageFilter !== "all" || categoryFilter !== "all") && (
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Filtered
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-sans">
            {/* Stage Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] hidden md:inline">
                Stage:
              </span>
              <VantagedSelect
                value={stageFilter}
                onChange={(val) => setStageFilter(val)}
                containerClassName="w-full sm:w-auto min-w-[210px]"
                className="h-10 sm:h-11 px-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs sm:text-[13px] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs"
                options={[
                  { value: "all", label: "All Project Stages" },
                  ...project.stages.map((stg) => ({
                    value: stg.title,
                    label: stg.title,
                  })),
                ]}
              />
            </div>

            {/* Category / Defect Type Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] hidden md:inline">
                Type:
              </span>
              <VantagedSelect
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                containerClassName="w-full sm:w-auto min-w-[190px]"
                className="h-10 sm:h-11 px-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs sm:text-[13px] font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs"
                options={[
                  { value: "all", label: "All Defect Types" },
                  { value: "Quality of Work", label: "Quality of Work" },
                  { value: "Payment Issue", label: "Payment Issue" },
                  { value: "Change in Plan", label: "Change in Plan" },
                ]}
              />
            </div>

            {/* Reset Filters button if active */}
            {(stageFilter !== "all" || categoryFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setStageFilter("all");
                  setCategoryFilter("all");
                }}
                className="h-10 sm:h-11 px-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-colors cursor-pointer shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </section>

        {/* ── Master-Detail Workspace ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* ── Left Column: Issues List (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {filteredDisputes.length === 0 ? (
              <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 text-center shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-400,#A3A0B8)] flex items-center justify-center mx-auto mb-3">
                  <IconCheck className="w-6 h-6 stroke-2" />
                </div>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">No issues in this filter</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-xs mx-auto">
                  All construction milestone stages in this view are in good standing.
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
                    {/* Header Row: Code & Clear Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {item.disputeCode}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isResolved
                            ? "bg-[var(--vt-color-green-100,#DCF4E3)] text-[var(--vt-color-green-800,#134E2C)]"
                            : item.status === "Under Independent Inspection"
                            ? "bg-purple-100 text-purple-800"
                            : isOverdue
                            ? "bg-rose-100 text-rose-800 animate-pulse"
                            : item.proposedCurePlan?.status === "Awaiting Owner Approval"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-[var(--vt-color-orange-100,#FEDBC7)] text-[var(--vt-color-orange-800,#9C3205)]"
                        }`}
                      >
                        {isResolved
                          ? "Resolved & Paid"
                          : item.status === "Under Independent Inspection"
                          ? "Step 2: Engineer Audit"
                          : isOverdue
                          ? "Overdue Response"
                          : item.proposedCurePlan?.status === "Awaiting Owner Approval"
                          ? "Needs Your Approval"
                          : "Repair in Progress"}
                      </span>
                    </div>

                    {/* Defect Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Linked Stage Name */}
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 truncate">
                      {item.linkedStage}
                    </p>

                    {/* Bottom Row: Protected Amount & Target Date */}
                    <div className="mt-2.5 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px] font-semibold">
                      <span className="flex items-center gap-1 text-[var(--vt-color-orange-700,#B33C08)]">
                        <IconLock className="w-3 h-3" />
                        <span>
                          {isDlp
                            ? `${formatNaira(item.retentionClaimAmount || 850000)} warranty claim`
                            : isResolved
                            ? "Escrow released"
                            : `${formatNaira(item.escrowQuarantineAmount || item.linkedTrancheAmount)} on hold`}
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
                <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col gap-3.5">
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
                    <div
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] shrink-0 self-start sm:self-center"
                      title="This money cannot be released to the builder until you confirm the defect is fixed."
                    >
                      <p className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider">
                        Payout on Hold
                      </p>
                      <p className="text-xs sm:text-sm font-black text-[var(--vt-color-orange-950,#4E1802)]">
                        {formatNaira(selectedDispute.escrowQuarantineAmount || selectedDispute.linkedTrancheAmount)} Held Safely
                      </p>
                    </div>
                  </div>

                  {/* 3-Step Escalation Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] mb-1.5">
                      <span>Resolution Progress</span>
                      <span className="text-[var(--vt-color-indigo-900,#261A66)] font-bold">
                        {selectedDispute.escalationTier.includes("Tier 2")
                          ? "Step 2: Independent Engineer Inspection"
                          : selectedDispute.escalationTier.includes("Tier 3")
                          ? "Step 3: Vantaged Dispute Panel Ruling"
                          : "Step 1: Direct Builder Fix"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div
                        className="h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]"
                        title="Step 1: Direct Builder Fix"
                      />
                      <div
                        className={`h-2 rounded-full ${
                          selectedDispute.escalationTier.includes("Tier 2") || selectedDispute.escalationTier.includes("Tier 3")
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                            : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                        }`}
                        title="Step 2: Independent Engineer Inspection"
                      />
                      <div
                        className={`h-2 rounded-full ${
                          selectedDispute.escalationTier.includes("Tier 3")
                            ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                            : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                        }`}
                        title="Step 3: Formal Vantaged Ruling Panel"
                      />
                    </div>
                    <div className="grid grid-cols-3 text-[10px] font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)] mt-1">
                      <span>1. Direct Builder Fix</span>
                      <span className="text-center">2. Engineer Audit</span>
                      <span className="text-right">3. Dispute Panel</span>
                    </div>
                  </div>
                </div>

                {/* ── Card 2: Defect Details & Builder Repair Plan ── */}
                <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
                  {/* Defect Description */}
                  <div>
                    <h3 className="text-xs font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase tracking-wider mb-1">
                      Observed Site Defect
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] leading-relaxed bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]">
                      {selectedDispute.whatHappened || "Defect observed during site inspection."}
                    </p>
                  </div>

                  {/* Builder Proposed Repair Plan */}
                  {selectedDispute.proposedCurePlan && (
                    <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/60 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[var(--vt-color-orange-800,#9C3205)] flex items-center gap-1.5">
                          <IconAlertTriangle className="w-3.5 h-3.5" />
                          <span>Builder's Repair Plan & Timeline</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[var(--vt-color-orange-700,#B33C08)] border border-orange-200">
                          {selectedDispute.proposedCurePlan.status === "Awaiting Owner Approval"
                            ? "Waiting for Your Approval"
                            : selectedDispute.proposedCurePlan.status === "Accepted"
                            ? "Approved & In Progress"
                            : selectedDispute.proposedCurePlan.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] mb-0.5">
                          How the builder will fix this:
                        </p>
                        <p className="text-xs text-[var(--vt-color-neutral-700,#443F63)] leading-relaxed">
                          {selectedDispute.proposedCurePlan.methodStatement}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-orange-200/60">
                        <span className="text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          Target Completion Date: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{selectedDispute.proposedCurePlan.proposedCompletionDate}</strong>
                        </span>

                        {/* Owner Decision Buttons */}
                        {selectedDispute.proposedCurePlan.status === "Awaiting Owner Approval" && selectedDispute.status !== "Resolved" && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCounterDecision("counter");
                                setIsCounterModalOpen(true);
                              }}
                              className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                            >
                              Request Faster Date
                            </button>
                            <button
                              type="button"
                              onClick={handleAcceptCurePlan}
                              className="h-8 px-3.5 rounded-md bg-[var(--vt-color-green-600,#247E46)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                            >
                              ✓ Approve Repair Plan
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overdue Alert if active */}
                  {(selectedDispute.overdueDays ?? 0) > 0 && selectedDispute.status !== "Resolved" && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span>
                          Builder is <strong>{selectedDispute.overdueDays} days late</strong> past the agreed repair deadline.
                        </span>
                      </div>
                      <span className="font-bold">
                        Late penalty: {formatNaira(calculateDelayFine(selectedDispute).totalFine)} (will be credited to you)
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Card 3: Tabbed Activity, Financials & Actions ── */}
                <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xs overflow-hidden flex flex-col">
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
                      <span>Penalties & Replacement Workers</span>
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
                      Release & Resolution Actions
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

                        {/* Reply Form */}
                        {selectedDispute.status !== "Resolved" && (
                          <form onSubmit={handleSendOwnerNote} className="flex items-center gap-2 mt-2 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                            <input
                              type="text"
                              value={ownerReplyText}
                              onChange={(e) => setOwnerReplyText(e.target.value)}
                              placeholder="Type an instruction or message for the builder..."
                              className="flex-1 h-9.5 px-3 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg text-xs focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                            />
                            <button
                              type="submit"
                              disabled={!ownerReplyText.trim()}
                              className="h-9.5 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <IconSend className="w-3.5 h-3.5" />
                              <span>Send</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* TAB 2: Penalties & Replacement Workers */}
                    {dossierTab === "financial" && (
                      <div className="flex flex-col gap-3.5">
                        {/* Late Penalty Box */}
                        <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Daily Late Penalty (Delay Compensation)</p>
                            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                              Builder pays ₦35,000 per calendar day overdue. 80% is credited directly to your wallet.
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                              {formatNaira(calculateDelayFine(selectedDispute).totalFine)}
                            </p>
                            <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                              {calculateDelayFine(selectedDispute).overdueDays} days late
                            </p>
                          </div>
                        </div>

                        {/* Replacement Worker / Backcharge Box */}
                        {selectedDispute.backchargeOrder ? (
                          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--vt-color-orange-800,#9C3205)]">
                                Outside Worker Hired (Deducted from Builder)
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
                                Fee: {formatNairaFull(selectedDispute.backchargeOrder.invoiceAmount)} (deducted from builder)
                              </span>

                              {selectedDispute.status !== "Resolved" && (
                                <div className="flex items-center gap-1.5">
                                  {selectedDispute.backchargeOrder.status !== "Completed & Verified" && (
                                    <button
                                      type="button"
                                      onClick={() => handleCompleteBackcharge(selectedDispute.id)}
                                      className="h-8 px-3 rounded-md bg-[var(--vt-color-green-600,#247E46)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                                    >
                                      ✓ Confirm Fixed & Pay Worker
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleCancelBackcharge(selectedDispute.id)}
                                    className="h-8 px-3 rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] text-center flex flex-col items-center gap-2">
                            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] max-w-sm">
                              Builder taking too long or unresponsive? You can hire an independent specialist to fix this defect, and their bill will be deducted directly from the builder's held escrow payment.
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsBackchargeModalOpen(true)}
                              className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer transition-colors"
                            >
                              + Hire Outside Worker (Deduct from Builder)
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: Release & Resolution Actions */}
                    {dossierTab === "timeline" && (
                      <div className="flex flex-col gap-3">
                        {selectedDispute.status === "Resolved" ? (
                          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-900">
                            <p className="font-bold text-sm">Dispute Resolved & Paid</p>
                            <p className="mt-1">{selectedDispute.settlement?.arbitrationVerdictNote || selectedDispute.howItWasFixed}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            {/* Primary Settle & Release Button */}
                            <button
                              type="button"
                              onClick={() => setIsSettleModalOpen(true)}
                              className="w-full h-10 rounded-md bg-[var(--vt-color-green-600,#247E46)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
                            >
                              <IconCheck className="w-4 h-4 stroke-2" />
                              <span>Confirm Fixed & Release Payment to Builder</span>
                            </button>

                            {/* Secondary Escalation Options */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                              <button
                                type="button"
                                onClick={() => setIsEscalateTier2Open(true)}
                                className="h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] text-xs font-bold cursor-pointer transition-colors"
                              >
                                Step 2: Request Engineer Inspection
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEscalateTier3Open(true)}
                                className="h-9 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] text-xs font-bold cursor-pointer transition-colors"
                              >
                                Step 3: Request Dispute Panel Ruling
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

      {/* ── MODAL 1: Report a Site Problem (Styled to Match Vantaged Change Request Modal) ── */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!raiseSuccess ? (
              <form onSubmit={handleCreateDispute} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Report a Site Problem</h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">{project.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRaiseModalOpen(false)}
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      What is the problem or defect? *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDisputeTitle}
                      onChange={(e) => setNewDisputeTitle(e.target.value)}
                      placeholder="e.g. Concrete honeycombing and exposed rebar on Column C4"
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      Associated Milestone Stage *
                    </label>
                    <VantagedSelect
                      value={newDisputeStage}
                      onChange={(val) => setNewDisputeStage(val)}
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                      options={project.stages.map((stg) => ({
                        value: stg.title,
                        label: stg.title,
                      }))}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      Problem Severity & Repair Window *
                    </label>
                    <VantagedSelect
                      value={newDisputeSeverity}
                      onChange={(val) => setNewDisputeSeverity(val as any)}
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                      options={[
                        { value: "Minor Snag", label: "Minor Snag (7-day repair window)" },
                        { value: "Moderate Defect", label: "Moderate Defect (14-day repair window)" },
                        { value: "Critical Structural Risk", label: "Critical Safety Risk (28-day repair window)" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      Describe What Was Observed on Site *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newDisputeReason}
                      onChange={(e) => setNewDisputeReason(e.target.value)}
                      placeholder="Specify location, room number, affected structural member, or installation defect..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>

                  <div className="p-3 bg-[var(--vt-color-orange-50,#FFF4EE)] rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs text-[var(--vt-color-orange-900,#7C2704)] flex items-center gap-2">
                    <IconShieldCheck className="w-4 h-4 shrink-0 text-[var(--vt-color-orange-600,#D84C0B)]" />
                    <span>Reporting this defect pauses the milestone payout in escrow trust until you verify it is fixed.</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsRaiseModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                  >
                    Report Problem & Hold Payout
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-600,#248246)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Site Defect Logged & Payout Held
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  Your defect notice has been transmitted to your project builder. The milestone payout has been locked in escrow trust and cannot be disbursed until you confirm the fix is complete.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRaiseSuccess(false);
                    setIsRaiseModalOpen(false);
                    setNewDisputeTitle("");
                    setNewDisputeReason("");
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  View in Issues List
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: Step 2: Independent Engineer Inspection ── */}
      {isEscalateTier2Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Dispatch Certified Inspector</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Step 2: Chartered structural compliance audit</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEscalateTier2Open(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  How would you like to assign the inspector?
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] cursor-pointer hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                    <input
                      type="radio"
                      name="inspectorOption"
                      className="mt-0.5"
                      checked={selectedInspectorChoice === "auto"}
                      onChange={() => setSelectedInspectorChoice("auto")}
                    />
                    <div>
                      <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        ⚡ Auto-Assign Nearest Inspector (Recommended)
                      </p>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Matches the highest-rated COREN structural inspector nearby in Lekki (Within 12 hours • ₦45,000 fee).
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] cursor-pointer hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                    <input
                      type="radio"
                      name="inspectorOption"
                      className="mt-0.5"
                      checked={selectedInspectorChoice !== "auto"}
                      onChange={() => setSelectedInspectorChoice("insp-folake")}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Choose a Specific Inspector
                      </p>
                      {selectedInspectorChoice !== "auto" && (
                        <div className="mt-2">
                          <VantagedSelect
                            value={selectedInspectorChoice}
                            onChange={(val) => setSelectedInspectorChoice(val)}
                            className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                            options={[
                              { value: "insp-emeka", label: "Engr. Emeka Okonkwo (COREN • Structural • ₦45k)" },
                              { value: "insp-folake", label: "Engr. Folake Adeleke (COREN • MEP & Services • ₦40k)" },
                              { value: "insp-chidinma", label: "Engr. Chidinma Eze (COREN • Waterproofing • ₦45k)" },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-[var(--vt-color-orange-50,#FFF4EE)] rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs text-[var(--vt-color-orange-900,#7C2704)] flex flex-col gap-1">
                <span className="font-bold">Neutral Dispute Rule:</span>
                <span className="text-[11px] leading-relaxed">
                  The audit fee is held in escrow. If the certified test confirms the defect is unresolved, this fee is deducted directly from the builder's payment. If the repair meets code, the fee is paid by the owner.
                </span>
              </div>

              <div className="text-right">
                <Link
                  href="/owner/inspectors"
                  target="_blank"
                  className="text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline inline-flex items-center gap-1"
                >
                  <span>Browse all verified engineers on Vantaged</span>
                  <IconArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsEscalateTier2Open(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateToTier2}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Dispatch Inspector & Start Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Step 3: Formal Vantaged Ruling Panel ── */}
      {isEscalateTier3Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Refer to Dispute Panel Ruling</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Step 3: Formal binding escrow adjudication</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEscalateTier3Open(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              If both parties cannot agree on a solution, the Vantaged Binding Dispute Panel reviews the inspection evidence, contractor agreement, and site logs to issue a legally binding ruling and release funds accordingly.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsEscalateTier3Open(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateToTier3}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Refer to Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Confirm Resolution & Release Payout ── */}
      {isSettleModalOpen && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Confirm Resolution & Release Payment</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Choose how the held milestone funds should be disbursed</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettleModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)]">Choose Settlement Option</label>
              <div className="flex flex-col gap-2 text-xs">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] cursor-pointer hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <input
                    type="radio"
                    name="settlement"
                    className="mt-0.5"
                    checked={settlementChoice === "Full Rectification & Release"}
                    onChange={() => setSettlementChoice("Full Rectification & Release")}
                  />
                  <div>
                    <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Option 1: Defect Fixed Properly — Pay Builder in Full</p>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Work has been inspected and meets specifications. Release 100% of frozen funds to the builder.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] cursor-pointer hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <input
                    type="radio"
                    name="settlement"
                    className="mt-0.5"
                    checked={settlementChoice === "Partial Release with Holdback"}
                    onChange={() => setSettlementChoice("Partial Release with Holdback")}
                  />
                  <div>
                    <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Option 2: Partial Fix — Pay Builder Part, Refund Part to You</p>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Release a portion to the builder for work done, and refund the remaining balance to your wallet.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] cursor-pointer hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <input
                    type="radio"
                    name="settlement"
                    className="mt-0.5"
                    checked={settlementChoice === "Full Tranche Refund to Owner"}
                    onChange={() => setSettlementChoice("Full Tranche Refund to Owner")}
                  />
                  <div>
                    <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Option 3: Work Rejected — 100% Full Refund to You</p>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Builder failed or abandoned the repair. Return 100% of frozen funds back to your wallet.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsSettleModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSettlement}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#247E46)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
              >
                Confirm & Release Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: Request Faster Repair Date ── */}
      {isCounterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Request Faster Repair Date</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Ask the builder to complete this repair in fewer days</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCounterModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRejectOrCounterCurePlan} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  How many days do you give the builder? *
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={counterDays}
                  onChange={(e) => setCounterDays(Number(e.target.value))}
                  className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  Instructions / Message for Builder
                </label>
                <textarea
                  rows={2}
                  value={counterReason}
                  onChange={(e) => setCounterReason(e.target.value)}
                  placeholder="e.g. Please bring in additional hands to finish before the weekend..."
                  className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                <button
                  type="button"
                  onClick={() => setIsCounterModalOpen(false)}
                  className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                >
                  Send Timeline Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: Hire Outside Worker (Backcharge) ── */}
      {isBackchargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Hire Outside Worker (Deduct from Builder)</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Their fee will be deducted directly from the builder's held escrow payment</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBackchargeModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBackcharge} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  Worker or Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={backchargeArtisanName}
                  onChange={(e) => setBackchargeArtisanName(e.target.value)}
                  placeholder="e.g. ArcLine Electrical Services"
                  className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  Phone / Contact Number
                </label>
                <input
                  type="text"
                  value={backchargeContact}
                  onChange={(e) => setBackchargeContact(e.target.value)}
                  placeholder="e.g. +234 803 555 4912"
                  className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  Scope of Repair Work *
                </label>
                <input
                  type="text"
                  required
                  value={backchargeScope}
                  onChange={(e) => setBackchargeScope(e.target.value)}
                  placeholder="e.g. Complete replacement of substandard PVC conduits"
                  className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                  Agreed Invoice Amount (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={backchargeAmount}
                  onChange={(e) => setBackchargeAmount(Number(e.target.value))}
                  className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                <button
                  type="button"
                  onClick={() => setIsBackchargeModalOpen(false)}
                  className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Authorize Worker & Deduct from Builder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 7: 1-Year Post-Handover Warranty Fund (DLP Vault) ── */}
      {isDlpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div className="flex items-center gap-2">
                <IconShieldCheck className="w-5 h-5 text-[var(--vt-color-indigo-900,#261A66)]" />
                <div>
                  <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">1-Year Post-Handover Warranty Fund</h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">5% of total project budget held in escrow to guarantee repairs after you move in</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDlpModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Warranty Fund in Escrow</span>
                <span className="font-black text-[var(--vt-color-indigo-900,#261A66)] text-sm">{formatNairaFull(retentionConfig.totalRetentionAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Warranty Period</span>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{retentionConfig.dlpDurationMonths} Months After Handover</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Escrow Custodian</span>
                <span className="font-bold text-green-700">{retentionConfig.escrowCustodian}</span>
              </div>
            </div>

            <div className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">How this warranty protects you:</p>
              <p className="mb-2">
                If hidden water leaks, foundation settling, plaster cracks, or electrical defects appear during your first year in the building, the contractor is contractually required to fix them within 14 days. If they fail, you can hire any outside specialist and pay them directly from this reserve fund.
              </p>
              <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">Covered Repairs:</p>
              <div className="flex flex-wrap gap-1.5">
                {retentionConfig.coveredTrades.map((trade) => (
                  <span key={trade} className="px-2 py-0.5 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[11px] font-semibold text-[var(--vt-color-neutral-700,#443F63)]">
                    {trade}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsDlpModalOpen(false)}
                className="h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
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
