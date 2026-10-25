export interface StageChecklistItem {
  id: string;
  label: string;
  isPassed: boolean;
  completedBy?: string;
  completedDate?: string;
  proofCount?: number;
  notes?: string;
  issueId?: string;
}

export interface StageProofMedia {
  id: string;
  type: "photo" | "video" | "voice";
  title: string;
  url: string;
  gpsLocation: string;
  gpsCoordinates?: string;
  withinSite?: boolean;
  timestamp: string;
  uploadedBy: string;
  uploaderRole?: string;
  checklistItemId?: string;
  checklistItemLabel?: string;
  sizeMb?: string;
  duration?: string;
}

export interface StageComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isClient?: boolean;
  voiceDuration?: string;
}

export interface StageActivityEvent {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details?: string;
}

export interface StageIssueItem {
  id: string;
  issueCode: string;
  title: string;
  status: "Open" | "Fixed" | "Resolved";
  assignedTo: string;
  dateRaised: string;
  resolutionNotes?: string;
}

export interface StageBeforeAfter {
  beforeTitle: string;
  beforeUrl: string;
  beforeDate: string;
  afterTitle: string;
  afterUrl: string;
  afterDate: string;
  description: string;
}

export interface ProjectStage {
  id: string;
  stageNumber: number;
  title: string;
  category: string;
  description?: string;
  weightPercent: number; // percentage of project
  trancheAmount: number;
  status: "Approved" | "Ready for Review" | "In Progress" | "Scheduled" | "Disputed";
  ballInCourt?: string;
  delayDays?: number;
  rejectionCount?: number;
  startDate: string;
  targetEndDate: string;
  completedDate?: string;
  verifiedBy?: string;
  checklist: StageChecklistItem[];
  proofMedia: StageProofMedia[];
  beforeAfter?: StageBeforeAfter;
  comments?: StageComment[];
  activityLog?: StageActivityEvent[];
  issues?: StageIssueItem[];
}

export interface ProjectTransactionTranche {
  id: string;
  trancheNumber: number;
  title: string;
  stageLinked: string;
  amount: number;
  status: "Paid to Builder" | "Held on Vantaged" | "Ready for Your Approval" | "Scheduled";
  dueDate: string;
  paidDate?: string;
  bankSessionId?: string;
  receiptUrl?: string;
  paymentMethod?: string;
  verifiedBy?: string;
  verifiedRole?: string;
  contractorConfirmed?: boolean;
  contractorConfirmedDate?: string;
  notes?: string;
}

export type DisputeEscalationTier =
  | "Tier 1: Direct Contractor Rectification"
  | "Tier 2: Independent QS & Structural Inspection"
  | "Tier 3: Formal Vantaged Escrow Arbitration";

export interface DisputeTimelineEvent {
  id: string;
  timestamp: string;
  author: string;
  role: "Owner" | "Contractor" | "Client Representative" | "Vantaged Arbitrator";
  tier: DisputeEscalationTier;
  action: string;
  notes?: string;
  attachmentName?: string;
}

export interface DisputeSettlementTerms {
  settlementType: "Full Rectification & Release" | "Partial Release with Holdback" | "Full Tranche Refund to Owner";
  agreedRefundAmount?: number;
  agreedPayoutAmount?: number;
  rectificationDeadline?: string;
  arbitrationVerdictNote?: string;
  settledDate?: string;
  delayFineDeducted?: number;
  ownerDelayCompensation?: number; // 80% to owner
  platformDelayFee?: number; // 20% to platform
  delayFineWaived?: boolean;
  backchargeDeducted?: number; // Third-party replacement cost
}

export interface BackchargeOrder {
  id: string;
  createdAt: string;
  source: "Off-Platform Artisan" | "Vantaged Verified Specialist";
  artisanName: string;
  artisanContact: string;
  trade: string; // e.g., "Certified MEP & Electrical Specialist"
  scopeOfWork: string;
  invoiceAmount: number;
  status: "Quotation Approved - Funds Reserved" | "Work in Progress" | "Completed & Verified";
  invoiceRef?: string;
  viewLinkToken?: string;
  completedAt?: string;
  notes?: string;
}

export interface ProposedCurePlan {
  methodStatement: string;
  proposedCompletionDate: string;
  proposedDurationDays: number;
  severityMaxAllowedDays: number;
  status: "Awaiting Owner Approval" | "Accepted" | "Rejected" | "Pending Builder Submission";
  builderNote?: string;
  ownerCounterDate?: string;
  acceptedAt?: string;
}

export interface ProjectDisputeItem {
  id: string;
  disputeCode: string;
  title: string;
  category: "Quality of Work" | "Payment Issue" | "Change in Plan";
  linkedStage: string;
  linkedTrancheAmount: number;
  status: "Active Dispute" | "Under Independent Inspection" | "In Formal Arbitration" | "Resolved";
  escalationTier: DisputeEscalationTier;
  openedDate: string;
  daysRemaining: number;
  overdueDays?: number;
  dailyDelayFineRate?: number; // standard liquidated damages rate in Naira per day
  delayFineAccrued?: number;
  isDelayFineWaived?: boolean;
  backchargeOrder?: BackchargeOrder;
  raisedBy: string;
  whatHappened: string;
  builderReply: string;
  howItWasFixed?: string;
  escrowQuarantineAmount?: number;
  cureNoticeDeadline?: string;
  inspectorName?: string;
  inspectionReportSummary?: string;
  defectSeverity?: "Minor Snag" | "Moderate Defect" | "Critical Structural Risk";
  cureStatus?: "Awaiting Builder Response" | "Cure Plan Pending Approval" | "Cure in Progress" | "Cure Complete - Ready for Review" | "Cure Defaulted";
  responseWindowHoursRemaining?: number;
  proposedCurePlan?: ProposedCurePlan;
  timelineEvents?: DisputeTimelineEvent[];
  settlement?: DisputeSettlementTerms;
  isDlpClaim?: boolean; // Post-handover Defects Liability Period warranty snag
  retentionClaimAmount?: number; // Estimated cost backed by 5% retention escrow fund
  dlpWarrantyMonth?: number; // Month within the 6 or 12 month DLP window
}

export interface RetentionDlpConfig {
  retentionRatePercent: number; // e.g. 5% standard retention holdback
  totalRetentionAmount: number; // e.g. ₦12,250,000 (5% of contract value)
  dlpDurationMonths: 6 | 12; // 6 or 12 months (negotiable)
  dlpStatus: "Pre-Handover Accumulating" | "Active DLP Warranty" | "Final Snag Audit" | "Completed & Released";
  handoverDate: string; // e.g. "15 Oct 2026"
  targetReleaseDate: string; // e.g. "15 Oct 2027"
  daysRemaining: number; // days until retention funds can be released
  activeSnagsCount: number; // active post-handover snags
  totalClaimsDeducted: number; // amount deducted from retention for unrectified snags / backcharges
  escrowBalance: number; // remaining funds in retention trust
  escrowCustodian: string; // "Vantaged Secure Escrow Trust"
  coveredTrades: string[];
  termsSummary: string;
}

export interface ProjectChangeRequestItem {
  id: string;
  requestCode: string;
  title: string;
  requestedBy: "Contractor" | "Owner";
  requesterName: string;
  date: string;
  costImpact: number; // added cost
  timeExtensionDays: number;
  status: "Waiting for Your Approval" | "Approved" | "Declined" | "Awaiting Contractor Assessment";
  reason: string;
  breakdown: { item: string; cost: number }[];
  affectedStage?: string;
  declineReason?: string;
  approvedDate?: string;
  declinedDate?: string;
  contractorAssessmentNote?: string;
  paymentFundingMethod?: string;
}

export interface ProjectDetailData {
  id: string;
  jobId: string;
  title: string;
  category: "Residential" | "Commercial" | "Waterfront";
  location: string;
  address: string;
  specs: string;
  contractValue: number;
  currency: string;
  verifiedProgress: number; // approved %
  reportedProgress: number; // builder %
  startDate: string;
  targetEndDate: string;
  status: "In progress" | "Inspection pending" | "Completed";
  currentActiveStageTitle: string;
  contractor: {
    name: string;
    cacNumber: string;
    directorName: string;
    rating: string;
    reviewsCount: number;
    projectsCompleted: number;
    bankAccountName: string;
    bankName: string;
    bankAccountNumber: string;
  };
  siteManager: {
    name: string;
    phone: string;
    email: string;
    lastSeen: string;
    avatar: string;
  };
  clientReps: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    modules: string[];
  }[];
  stages: ProjectStage[];
  transactions: ProjectTransactionTranche[];
  disputes: ProjectDisputeItem[];
  changeRequests: ProjectChangeRequestItem[];
  retentionDlp?: RetentionDlpConfig;
}

export const PROJECT_DETAILS_MAP: Record<string, ProjectDetailData> = {
  "proj-lekki": {
    id: "proj-lekki",
    jobId: "JOB-4821",
    title: "Lekki Phase 1 Luxury Villa",
    category: "Residential",
    location: "Plot 14, Admiralty Way, Lekki",
    address: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos",
    specs: "4-Bedroom Detached House + Penthouse & Pool",
    contractValue: 245000000,
    currency: "NGN",
    verifiedProgress: 82,
    reportedProgress: 88,
    startDate: "15 Jan 2026",
    targetEndDate: "30 Nov 2026",
    status: "In progress",
    currentActiveStageTitle: "Stage 4: First Floor Decking (Slab)",
    contractor: {
      name: "Julius B. Consortium Nigeria Ltd",
      cacNumber: "RC-1849204",
      directorName: "Engr. Babatunde Adeleke",
      rating: "4.8 ★",
      reviewsCount: 34,
      projectsCompleted: 26,
      bankAccountName: "Julius B. Consortium Nigeria Ltd",
      bankName: "Zenith Bank",
      bankAccountNumber: "1012849201",
    },
    siteManager: {
      name: "Engr. Chidi Okafor",
      phone: "+234 803 491 8204",
      email: "chidi.okafor@juliusbconsortium.ng",
      lastSeen: "Checked in on site today at 08:15 AM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
    clientReps: [
      {
        id: "rep-1",
        name: "Engr. Emeka Okonkwo",
        role: "Site Representative (Brother)",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
        modules: ["View progress", "Approve stages", "Make payments", "Chat with builder"],
      },
      {
        id: "rep-2",
        name: "Arc. Folake Davies",
        role: "Quality Inspector",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
        modules: ["View progress", "Check extra work"],
      },
    ],
    stages: [
      {
        id: "stg-1",
        stageNumber: 1,
        title: "Site Clearing & Setting Out",
        category: "Preparation",
        description: "Clearing of vegetation, site perimeter hoarding, excavation of topsoil to solid laterite, and beacon setting out by registered surveyor.",
        weightPercent: 12,
        trancheAmount: 29400000,
        status: "Approved",
        ballInCourt: "Completed",
        startDate: "15 Jan 2026",
        targetEndDate: "05 Feb 2026",
        completedDate: "02 Feb 2026",
        verifiedBy: "Arc. Folake Davies",
        checklist: [
          { id: "c1", label: "Land boundaries checked by surveyor", isPassed: true, completedBy: "Surv. Kayode Alabi", completedDate: "18 Jan 2026", proofCount: 2, notes: "All 4 corner boundary beacons verified against Lagos State survey plan." },
          { id: "c2", label: "Topsoil dug out to solid ground", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "26 Jan 2026", proofCount: 3, notes: "Excavation carried down 1.2m to load-bearing laterite formation." },
          { id: "c3", label: "Security gate and fence installed", isPassed: true, completedBy: "Site Crew", completedDate: "01 Feb 2026", proofCount: 2, notes: "Corrugated perimeter hoarding and site office security hut erected." },
        ],
        proofMedia: [
          {
            id: "m1",
            type: "photo",
            title: "Site Boundary & Ground Digging",
            url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4731° E",
            withinSite: true,
            timestamp: "28 Jan 2026, 10:14 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c2",
            checklistItemLabel: "Topsoil dug out to solid ground",
            sizeMb: "3.4 MB",
          },
          {
            id: "m1b",
            type: "photo",
            title: "Survey Pegs & Boundary Line Setting Out",
            url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4475° N, 3.4730° E",
            withinSite: true,
            timestamp: "18 Jan 2026, 02:20 PM",
            uploadedBy: "Surv. Kayode Alabi",
            uploaderRole: "Surveyor",
            checklistItemId: "c1",
            checklistItemLabel: "Land boundaries checked by surveyor",
            sizeMb: "4.1 MB",
          },
        ],
        beforeAfter: {
          beforeTitle: "Before: Overgrown Raw Plot",
          beforeUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&fit=crop",
          beforeDate: "14 Jan 2026",
          afterTitle: "After: Cleared & Pegged Site",
          afterUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1200&fit=crop",
          afterDate: "02 Feb 2026",
          description: "Complete removal of wild shrubs and leveling of building footprint.",
        },
        comments: [
          {
            id: "com-1",
            authorName: "Arc. Folake Davies",
            authorRole: "Representative",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
            text: "Inspected beacons on site. Setback from road conforms with 9-meter Lagos urban planning rule.",
            timestamp: "02 Feb 2026, 01:15 PM",
            isClient: true,
          },
        ],
        activityLog: [
          { id: "act-1", action: "Stage approved & tranche released", user: "Arc. Folake Davies", role: "Representative", timestamp: "02 Feb 2026, 04:30 PM", details: "Tranche ₦29.4M approved and transferred." },
          { id: "act-2", action: "Stage submitted for review", user: "Engr. Chidi Okafor", role: "Site Manager", timestamp: "01 Feb 2026, 05:00 PM" },
        ],
      },
      {
        id: "stg-2",
        stageNumber: 2,
        title: "Foundation & Ground Beams",
        category: "Substructure",
        description: "Tying of foundation iron reinforcement cages, blind casting, ground beam shuttering, and pouring of high-strength waterproof concrete.",
        weightPercent: 20,
        trancheAmount: 49000000,
        status: "Approved",
        ballInCourt: "Completed",
        startDate: "08 Feb 2026",
        targetEndDate: "15 Mar 2026",
        completedDate: "12 Mar 2026",
        verifiedBy: "Engr. Emeka Okonkwo",
        checklist: [
          { id: "c4", label: "16mm and 20mm iron rods tied as specified", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "24 Feb 2026", proofCount: 4, notes: "High yield TMT rebar used, spacing checked against structural drawings." },
          { id: "c5", label: "Concrete poured with machine mixer", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "03 Mar 2026", proofCount: 3, notes: "Grade 30 mix with slump of 75mm recorded." },
          { id: "c6", label: "Anti-termite treatment applied to ground", isPassed: true, completedBy: "Site Crew", completedDate: "10 Mar 2026", proofCount: 2, notes: "Chemical barrier sprayed over entire sub-base prior to blinding." },
        ],
        proofMedia: [
          {
            id: "m2",
            type: "photo",
            title: "Foundation Iron Rods & Concrete Pour",
            url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4731° E",
            withinSite: true,
            timestamp: "10 Mar 2026, 02:40 PM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c4",
            checklistItemLabel: "16mm and 20mm iron rods tied as specified",
            sizeMb: "4.7 MB",
          },
        ],
        beforeAfter: {
          beforeTitle: "Before: Excavated Foundation Trenches",
          beforeUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1200&fit=crop",
          beforeDate: "10 Feb 2026",
          afterTitle: "After: Cast Ground Beams & Columns",
          afterUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&fit=crop",
          afterDate: "12 Mar 2026",
          description: "Substructure footing successfully transferred to ground beams.",
        },
        comments: [
          {
            id: "com-2",
            authorName: "Engr. Emeka Okonkwo",
            authorRole: "Site Representative (Brother)",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
            text: "Checked the concrete cube crush certificates at 7 and 28 days. Concrete strength reached 31.4 N/mm².",
            timestamp: "12 Mar 2026, 11:40 AM",
            isClient: true,
          },
        ],
        activityLog: [
          { id: "act-3", action: "Stage approved & tranche released", user: "Engr. Emeka Okonkwo", role: "Representative", timestamp: "12 Mar 2026, 03:15 PM" },
        ],
      },
      {
        id: "stg-3",
        stageNumber: 3,
        title: "Ground Floor & Block Walls",
        category: "Walls",
        description: "Laying of damp-proof membrane (DPM), casting of oversized German floor slab, solid 9-inch sandcrete block walling up to lintel level, and casting of window lintels.",
        weightPercent: 25,
        trancheAmount: 61250000,
        status: "Approved",
        ballInCourt: "Completed",
        startDate: "20 Mar 2026",
        targetEndDate: "10 May 2026",
        completedDate: "08 May 2026",
        verifiedBy: "Engr. Emeka Okonkwo",
        checklist: [
          { id: "c7", label: "German floor waterproof plastic sheet laid", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "28 Mar 2026", proofCount: 2, notes: "Heavy gauge 500-micron polythene laid with 150mm overlap." },
          { id: "c8", label: "Solid 9-inch blocks laid straight to lintel level", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "22 Apr 2026", proofCount: 3, notes: "Blocks cured 7 days; plumb lines verified daily." },
          { id: "c9", label: "Lintel beams cast over doors and windows", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "04 May 2026", proofCount: 3, notes: "4Y12 rebar reinforcement inside all window and doorway lintels." },
        ],
        proofMedia: [
          {
            id: "m3",
            type: "photo",
            title: "Ground Floor Blockwork & Lintel Beams",
            url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4731° E",
            withinSite: true,
            timestamp: "04 May 2026, 11:15 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c8",
            checklistItemLabel: "Solid 9-inch blocks laid straight to lintel level",
            sizeMb: "4.5 MB",
          },
        ],
        beforeAfter: {
          beforeTitle: "Before: German Floor Sub-base",
          beforeUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&fit=crop",
          beforeDate: "22 Mar 2026",
          afterTitle: "After: Blockwork Raised to First Floor Level",
          afterUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&fit=crop",
          afterDate: "06 May 2026",
          description: "All ground floor rooms and living areas walled up to 3.3m clear ceiling height.",
        },
        comments: [
          {
            id: "com-3",
            authorName: "Dr. James Arinze",
            authorRole: "Owner",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
            text: "The living room archway looks great in the photos. Payment approved on Vantaged.",
            timestamp: "08 May 2026, 02:10 PM",
            isClient: true,
          },
        ],
        activityLog: [
          { id: "act-4", action: "Stage approved & tranche released", user: "Dr. James Arinze", role: "Owner", timestamp: "08 May 2026, 02:15 PM" },
        ],
      },
      {
        id: "stg-4",
        stageNumber: 4,
        title: "First Floor Decking (Slab)",
        category: "Decking",
        description: "Installing wooden supports, tying strong steel bars for balconies and main floor, laying electrical pipe conduits, pouring waterproof concrete, and completing 14 days of wet curing.",
        weightPercent: 25,
        trancheAmount: 61250000,
        status: "Ready for Review",
        ballInCourt: "Client Review (You)",
        startDate: "15 May 2026",
        targetEndDate: "25 Oct 2026",
        checklist: [
          { id: "c10", label: "Wood supports and marine plywood checked for level", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "18 May 2026", proofCount: 2, notes: "Formwork braced with heavy-duty props and checked with spirit level." },
          { id: "c11", label: "Waterproof concrete poured and vibrated properly", isPassed: true, completedBy: "Engr. Chidi Okafor", completedDate: "20 May 2026", proofCount: 2, notes: "Grade 25 mix with waterproofing admixture used; mechanical poker vibrators operated throughout pour." },
          { id: "c12", label: "Water poured daily for 14 days to cure concrete", isPassed: true, completedBy: "Site Crew Team A", completedDate: "05 Jun 2026", proofCount: 2, notes: "Flooding method and damp hessian sacks maintained for the full 14 days." },
          { id: "c13", label: "Electrical pipes and plumbing set in slab", isPassed: true, completedBy: "Arc. Folake Davies", completedDate: "19 May 2026", proofCount: 1, notes: "All conduits inspected and pressure-tested before casting." },
        ],
        proofMedia: [
          {
            id: "m4",
            type: "photo",
            title: "First Floor Decking Slab After 14-Day Curing",
            url: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4731° E",
            withinSite: true,
            timestamp: "Today, 10:20 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c12",
            checklistItemLabel: "Water poured daily for 14 days to cure concrete",
            sizeMb: "4.2 MB",
          },
          {
            id: "m4b",
            type: "photo",
            title: "Rebar Reinforcement & Plywood Formwork Prior to Pour",
            url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4475° N, 3.4730° E",
            withinSite: true,
            timestamp: "18 May 2026, 03:45 PM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c10",
            checklistItemLabel: "Wood supports and marine plywood checked for level",
            sizeMb: "3.8 MB",
          },
          {
            id: "m4c",
            type: "photo",
            title: "Mechanical Vibrator During Concrete Pour",
            url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4732° E",
            withinSite: true,
            timestamp: "20 May 2026, 11:15 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c11",
            checklistItemLabel: "Waterproof concrete poured and vibrated properly",
            sizeMb: "5.1 MB",
          },
          {
            id: "m4d",
            type: "photo",
            title: "Conduit Lines & Plumbing Sleeves Laid",
            url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4473° N, 3.4731° E",
            withinSite: true,
            timestamp: "19 May 2026, 09:30 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c13",
            checklistItemLabel: "Electrical pipes and plumbing set in slab",
            sizeMb: "3.5 MB",
          },
          {
            id: "m5",
            type: "video",
            title: "Site Video Walkthrough of Decking & Cantilevers",
            url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&fit=crop",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4731° E",
            withinSite: true,
            timestamp: "Today, 11:05 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            checklistItemId: "c12",
            checklistItemLabel: "Water poured daily for 14 days to cure concrete",
            sizeMb: "28.4 MB",
            duration: "0:52",
          },
          {
            id: "m6",
            type: "voice",
            title: "Site Manager Audio Memo on Curing & Test Results",
            url: "#",
            gpsLocation: "Plot 14, Admiralty Way, Lekki",
            gpsCoordinates: "6.4474° N, 3.4731° E",
            withinSite: true,
            timestamp: "Today, 11:10 AM",
            uploadedBy: "Engr. Chidi Okafor",
            uploaderRole: "Site Manager",
            sizeMb: "1.2 MB",
            duration: "1:15",
          },
        ],
        beforeAfter: {
          beforeTitle: "Before: Blockwork Ready for Formwork",
          beforeUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&fit=crop",
          beforeDate: "14 May 2026",
          afterTitle: "After: Fully Cast & Cured Decking Slab",
          afterUrl: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=1200&fit=crop",
          afterDate: "Today",
          description: "Top floor surface is level, cured uniformly with no shrinkage cracks, and ready for second floor block walls.",
        },
        comments: [
          {
            id: "com-4",
            authorName: "Engr. Chidi Okafor",
            authorRole: "Site Manager (Julius B.)",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
            text: "Good day Dr. Arinze and Arc. Folake. The first floor decking slab has completed its 14-day curing cycle. Cube crushing test at 14 days yielded 24.8 N/mm², exceeding our specification. All photos, walkaround video, and audio notes have been attached for review.",
            timestamp: "Today, 11:15 AM",
            isClient: false,
          },
          {
            id: "com-5",
            authorName: "Arc. Folake Davies",
            authorRole: "Quality Inspector (Representative)",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
            text: "Inspected the balcony edges and plumbing pipe placements on site yesterday. Clean alignment and smooth underside concrete finish with no gaps or voids. Ready for approval.",
            timestamp: "Today, 11:32 AM",
            isClient: true,
          },
        ],
        activityLog: [
          { id: "act-5", action: "Stage submitted for client approval", user: "Engr. Chidi Okafor", role: "Site Manager", timestamp: "Today, 11:12 AM", details: "All 4 checklist items verified complete. Proof package locked. Ball moved to Client." },
          { id: "act-6", action: "Progress update posted (4 photos, 1 video walkthrough, 1 audio memo)", user: "Engr. Chidi Okafor", role: "Site Manager", timestamp: "Today, 10:20 AM", details: "GPS stamped and verified within site boundary." },
          { id: "act-7", action: "Daily curing logged (Day 14)", user: "Site Crew Team A", role: "Field Crew", timestamp: "Today, 09:30 AM" },
          { id: "act-8", action: "Slab concrete poured", user: "Julius B. Concrete Batch", role: "Contractor Crew", timestamp: "20 May 2026, 05:40 PM", details: "52m³ Grade 25 mix placed with boom pump." },
        ],
        issues: [
          { id: "iss-1", issueCode: "PUNCH-04", title: "Clean dust and concrete splash from rear drainage sleeve", status: "Fixed", assignedTo: "Site Crew Team A", dateRaised: "19 May 2026", resolutionNotes: "Conduit flushed with compressed air and end caps fastened." },
        ],
      },
      {
        id: "stg-5",
        stageNumber: 5,
        title: "Roofing & Parapet Wall",
        category: "Roofing",
        description: "Hardwood roof trusses, galvanized steel purlins, high-grade stone coated aluminium roofing sheets, and parapet coping waterproofing.",
        weightPercent: 10,
        trancheAmount: 24500000,
        status: "Scheduled",
        ballInCourt: "Contractor",
        startDate: "01 Nov 2026",
        targetEndDate: "20 Dec 2026",
        checklist: [
          { id: "c14", label: "Treated wood rafters and iron purlins installed", isPassed: false, proofCount: 0 },
          { id: "c15", label: "Stone-coated Gerard roof tiles installed", isPassed: false, proofCount: 0 },
          { id: "c16", label: "Parapet wall waterproofed to stop roof leaks", isPassed: false, proofCount: 0 },
        ],
        proofMedia: [],
        comments: [],
        activityLog: [
          { id: "act-9", action: "Stage scheduled in plan", user: "Contractor Director", role: "Julius B.", timestamp: "15 Jan 2026" },
        ],
      },
      {
        id: "stg-6",
        stageNumber: 6,
        title: "Plastering, POP, Tiles & Handover",
        category: "Finishing",
        weightPercent: 8,
        trancheAmount: 19600000,
        status: "Scheduled",
        startDate: "05 Jan 2027",
        targetEndDate: "28 Feb 2027",
        checklist: [
          { id: "c17", label: "Wall plastering, POP ceiling and floor tiles laid", isPassed: false },
          { id: "c18", label: "Wiring, plumbing fixtures and painting completed", isPassed: false },
          { id: "c19", label: "Final walkthrough and key handover", isPassed: false },
        ],
        proofMedia: [],
      },
    ],
    transactions: [
      {
        id: "trx-1",
        trancheNumber: 1,
        title: "Stage 1: Site Clearing & Setting Out",
        stageLinked: "Stage 1",
        amount: 29400000,
        status: "Paid to Builder",
        dueDate: "15 Jan 2026",
        paidDate: "16 Jan 2026",
        bankSessionId: "NIBSS/000014261016091422",
        paymentMethod: "Zenith Bank Escrow Transfer",
        verifiedBy: "Arc. Folake Davies",
        verifiedRole: "Quality Inspector",
        contractorConfirmed: true,
        contractorConfirmedDate: "16 Jan 2026, 04:30 PM",
        notes: "Tranche 1 released upon boundary pegging and site office setup.",
      },
      {
        id: "trx-2",
        trancheNumber: 2,
        title: "Stage 2: Foundation & Ground Beams",
        stageLinked: "Stage 2",
        amount: 49000000,
        status: "Paid to Builder",
        dueDate: "12 Mar 2026",
        paidDate: "13 Mar 2026",
        bankSessionId: "NIBSS/000014260313142019",
        paymentMethod: "Zenith Bank Escrow Transfer",
        verifiedBy: "Engr. Emeka Okonkwo",
        verifiedRole: "Site Representative (Brother)",
        contractorConfirmed: true,
        contractorConfirmedDate: "13 Mar 2026, 05:15 PM",
        notes: "Tranche 2 released following concrete cube crush strength tests pass.",
      },
      {
        id: "trx-3",
        trancheNumber: 3,
        title: "Stage 3: Ground Floor & Block Walls",
        stageLinked: "Stage 3",
        amount: 61250000,
        status: "Paid to Builder",
        dueDate: "08 May 2026",
        paidDate: "09 May 2026",
        bankSessionId: "NIBSS/000014260509114502",
        paymentMethod: "Zenith Bank Escrow Transfer",
        verifiedBy: "Dr. James Arinze",
        verifiedRole: "Building Owner",
        contractorConfirmed: true,
        contractorConfirmedDate: "09 May 2026, 02:45 PM",
        notes: "Tranche 3 released after blockwork inspection to first floor level.",
      },
      {
        id: "trx-4",
        trancheNumber: 4,
        title: "Stage 4: First Floor Decking",
        stageLinked: "Stage 4",
        amount: 61250000,
        status: "Ready for Your Approval",
        dueDate: "Payable when you approve Stage 4",
        paymentMethod: "Vantaged Secure Escrow",
        notes: "Funds held in project escrow account; will be disbursed when you approve Stage 4 photos.",
      },
      {
        id: "trx-5",
        trancheNumber: 5,
        title: "Stage 5: Roofing & Parapet",
        stageLinked: "Stage 5",
        amount: 24500000,
        status: "Held on Vantaged",
        dueDate: "Payable when Stage 5 is completed",
        paymentMethod: "Vantaged Secure Escrow",
        notes: "Secured in project escrow. Released only after roof leak inspection passes.",
      },
      {
        id: "trx-6",
        trancheNumber: 6,
        title: "5% Final Quality Guarantee Hold",
        stageLinked: "Final Handover",
        amount: 12250000,
        status: "Held on Vantaged",
        dueDate: "Released 6 months after move-in once all final checks pass",
        paymentMethod: "Vantaged Secure Escrow",
        notes: "Held safely until the 6-month warranty period passes with no issues.",
      },
    ],
    disputes: [
      {
        id: "dsp-101",
        disputeCode: "DISP-2026-001",
        title: "Honeycomb voiding and exposed rebar on First Floor Column C4",
        category: "Quality of Work",
        linkedStage: "Stage 3: First Floor Slab & Columns",
        linkedTrancheAmount: 18450000,
        escrowQuarantineAmount: 18450000,
        status: "Active Dispute",
        escalationTier: "Tier 1: Direct Contractor Rectification",
        openedDate: "Yesterday, 09:30",
        daysRemaining: 2,
        cureNoticeDeadline: "Tomorrow, 17:00",
        raisedBy: "Dr. James Arinze (Owner)",
        defectSeverity: "Moderate Defect",
        cureStatus: "Cure Plan Pending Approval",
        responseWindowHoursRemaining: 42,
        dailyDelayFineRate: 35000,
        overdueDays: 0,
        delayFineAccrued: 0,
        isDelayFineWaived: false,
        proposedCurePlan: {
          methodStatement: "Mechanical chipping of unsound concrete, steel anti-corrosion primer application, and pneumatic placement of Sika structural polymer repair mortar.",
          proposedCompletionDate: "3 Nov 2026",
          proposedDurationDays: 7,
          severityMaxAllowedDays: 14,
          status: "Awaiting Owner Approval",
          builderNote: "Mortar requires 5 days curing prior to load-bearing checks. Requesting 7 calendar days total to ensure structural compliance.",
        },
        whatHappened: "During site walkthrough, formwork stripping revealed extensive concrete honeycombing and exposed 16mm vertical rebar on column C4 near the perimeter staircase. Concreting vibration was clearly deficient during pour.",
        builderReply: "Site supervisor acknowledges honeycombing due to rebar congestion around the beam-column junction. We have dispatched our structural repair team with polymer-modified repair mortar and bonding agent.",
        howItWasFixed: "Cure Notice active. Milestone payout of ₦18,450,000 frozen pending owner and engineer approval.",
        timelineEvents: [
          {
            id: "tl-1",
            timestamp: "Yesterday, 09:30",
            author: "Dr. James Arinze",
            role: "Owner",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Issue Opened & 3 Photos Uploaded",
            notes: "Exposed rebar on column C4 inspected during site visit.",
          },
          {
            id: "tl-2",
            timestamp: "Yesterday, 10:15",
            author: "Vantaged Automated Escrow Guard",
            role: "Vantaged Arbitrator",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Milestone Payout Frozen",
            notes: "Tranche 3 funds (₦18,450,000) placed under disbursement freeze. Contractor payout blocked.",
          },
          {
            id: "tl-3",
            timestamp: "Today, 11:20",
            author: "Engr. Chidi Okafor (PrimeBuild)",
            role: "Contractor",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Rectification Work Plan Submitted",
            notes: "Polymer repair mortar to be applied following high-pressure chipping and rust-inhibitor application.",
          },
        ],
      },
      {
        id: "dsp-102",
        disputeCode: "DISP-2026-002",
        title: "Substandard electrical conduit piping contrary to approved MEP drawings",
        category: "Change in Plan",
        linkedStage: "Stage 4: Roof Truss & Covering",
        linkedTrancheAmount: 14760000,
        escrowQuarantineAmount: 14760000,
        status: "Under Independent Inspection",
        escalationTier: "Tier 2: Independent QS & Structural Inspection",
        openedDate: "3 days ago",
        daysRemaining: 0,
        overdueDays: 2,
        dailyDelayFineRate: 35000,
        delayFineAccrued: 70000,
        isDelayFineWaived: false,
        raisedBy: "Engr. Emeka Okonkwo (Client Rep)",
        defectSeverity: "Critical Structural Risk",
        cureStatus: "Cure Defaulted",
        responseWindowHoursRemaining: 0,
        inspectorName: "Engr. Emeka Okonkwo, MNSE, COREN",
        inspectionReportSummary: "Certified on-site destructive test confirmed 35% of installed conduits failed fire-retardancy rating BS 4607. Immediate replacement required before plastering.",
        backchargeOrder: {
          id: "bc-2026-001",
          createdAt: "Yesterday, 16:30",
          source: "Off-Platform Artisan",
          artisanName: "ArcLine Electrical Services (Engr. Tunde Bakare)",
          artisanContact: "+234 803 555 4912",
          trade: "Certified MEP & Conduit Specialist",
          scopeOfWork: "Complete strip-out of 140m uncertified PVC conduits and replacement with Schneider heavy-gauge BS 4607 conduits before roof plastering.",
          invoiceAmount: 1450000,
          status: "Work in Progress",
          invoiceRef: "INV-ARCLINE-8821",
          viewLinkToken: "vantaged.ng/inspect/token-8821",
          notes: "Dispatched under Owner-Controlled Backcharge protocol. Deducted directly from Stage 4 milestone funds.",
        },
        whatHappened: "Subcontractor delivered unbranded thin-walled PVC electrical conduits contrary to the Schneider/Clipsal specification in approved architectural MEP documents.",
        builderReply: "Supplier delivered substitute conduits due to seaport clearing backlog; we offered a ₦1,200,000 cost rebate if owner accepts as-is.",
        howItWasFixed: "Independent inspection completed by Engr. Emeka Okonkwo. Builder rebate rejected; full replacement mandated under Tier 2 inspection protocol.",
        timelineEvents: [
          {
            id: "tl-201",
            timestamp: "3 days ago, 14:00",
            author: "Engr. Emeka Okonkwo",
            role: "Client Representative",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Defect Identified on Site",
            notes: "Conduits found to be non-certified brittle PVC.",
          },
          {
            id: "tl-202",
            timestamp: "2 days ago, 16:45",
            author: "Dr. James Arinze",
            role: "Owner",
            tier: "Tier 2: Independent QS & Structural Inspection",
            action: "Escalated to Independent Inspection",
            notes: "Contractor rebate rejected. Certified structural inspection requested.",
          },
          {
            id: "tl-203",
            timestamp: "Yesterday, 15:30",
            author: "Engr. Emeka Okonkwo",
            role: "Client Representative",
            tier: "Tier 2: Independent QS & Structural Inspection",
            action: "Official Inspection Report Filed",
            notes: "Failure of BS 4607 fire test documented. Replacement order issued.",
          },
          {
            id: "tl-204",
            timestamp: "Yesterday, 16:30",
            author: "Dr. James Arinze",
            role: "Owner",
            tier: "Tier 2: Independent QS & Structural Inspection",
            action: "Third-Party Backcharge Order Issued: ₦1,450,000",
            notes: "ArcLine Electrical Services engaged to replace sub-standard conduits. ₦1,450,000 deducted directly from PrimeBuild Stage 4 frozen milestone payout.",
          },
        ],
      },
      {
        id: "dsp-103",
        disputeCode: "DISP-2026-003",
        title: "Foundation trench waterlogged before blinding concrete cast",
        category: "Quality of Work",
        linkedStage: "Stage 2: Ground Floor Foundation & Pool",
        linkedTrancheAmount: 22140000,
        escrowQuarantineAmount: 0,
        status: "Resolved",
        escalationTier: "Tier 1: Direct Contractor Rectification",
        openedDate: "12 May 2026",
        daysRemaining: 0,
        overdueDays: 0,
        dailyDelayFineRate: 35000,
        delayFineAccrued: 0,
        isDelayFineWaived: false,
        raisedBy: "Dr. James Arinze (Owner)",
        defectSeverity: "Moderate Defect",
        cureStatus: "Cure Complete - Ready for Review",
        responseWindowHoursRemaining: 0,
        whatHappened: "Flash rainstorm flooded section 4 foundation trenches. Builder attempted to pour blinding concrete over standing muddy lagoon water.",
        builderReply: "Contractor stopped pour immediately. High-capacity dewatering pumps deployed and mud de-silted.",
        howItWasFixed: "Contractor pumped out water, replaced sub-base with graded granite stones at zero cost, and re-inspected. Escrow hold cleared.",
        settlement: {
          settlementType: "Full Rectification & Release",
          agreedPayoutAmount: 22140000,
          agreedRefundAmount: 0,
          delayFineDeducted: 0,
          ownerDelayCompensation: 0,
          platformDelayFee: 0,
          delayFineWaived: false,
          settledDate: "15 May 2026",
          arbitrationVerdictNote: "Site engineer verified sub-base compaction test at 98% Proctor density. Full payment tranche released to builder.",
        },
        timelineEvents: [
          {
            id: "tl-301",
            timestamp: "12 May 2026",
            author: "Dr. James Arinze",
            role: "Owner",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Stop Work Notice Issued",
            notes: "Foundation trench flooding flagged.",
          },
          {
            id: "tl-302",
            timestamp: "14 May 2026",
            author: "PrimeBuild Lead Team",
            role: "Contractor",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Dewatering & Granite Sub-base Completed",
            notes: "12 truckloads of graded aggregate installed.",
          },
          {
            id: "tl-303",
            timestamp: "15 May 2026",
            author: "Engr. Emeka Okonkwo",
            role: "Client Representative",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Verified & Settlement Finalized",
            notes: "Passed soil compaction test. Issue resolved and escrow released.",
          },
        ],
      },
      {
        id: "dsp-104",
        disputeCode: "DLP-2026-001",
        title: "Roof parapet flashing debonding causing moisture ingress into master bedroom ceiling",
        category: "Quality of Work",
        linkedStage: "Defects Liability Period (12 Months DLP)",
        linkedTrancheAmount: 12250000,
        escrowQuarantineAmount: 0,
        status: "Active Dispute",
        escalationTier: "Tier 1: Direct Contractor Rectification",
        openedDate: "Yesterday, 14:15",
        daysRemaining: 12,
        overdueDays: 0,
        dailyDelayFineRate: 25000,
        delayFineAccrued: 0,
        isDelayFineWaived: false,
        raisedBy: "Dr. James Arinze (Owner)",
        defectSeverity: "Moderate Defect",
        cureStatus: "Cure in Progress",
        responseWindowHoursRemaining: 54,
        isDlpClaim: true,
        retentionClaimAmount: 850000,
        dlpWarrantyMonth: 1,
        proposedCurePlan: {
          methodStatement: "Torch-on re-application of 4mm SBS elastomeric bitumen membrane along 22m perimeter parapet flashing, water-ponding test for 48 hours, and replacement of affected POP ceiling boards.",
          proposedCompletionDate: "28 Oct 2026",
          proposedDurationDays: 5,
          severityMaxAllowedDays: 14,
          status: "Accepted",
          builderNote: "PrimeBuild specialist waterproofing crew mobilized under contractual DLP obligations.",
        },
        whatHappened: "Following heavy seasonal rain, water ingress was observed pooling along the master bedroom ceiling cornices. External inspection revealed debonding along the parapet torch-on waterproofing membrane.",
        builderReply: "PrimeBuild DLP Emergency Team acknowledges notice. Waterproofing subcontractor will re-prime and lay double-layer SBS torch-on membrane this Saturday, then repaint internal ceiling boards.",
        howItWasFixed: "Backed by ₦12,250,000 Vantaged 5% Retention Escrow Trust. If contractor fails to finish within 14 days, owner can backcharge a third-party waterproofing specialist directly from the retention fund.",
        timelineEvents: [
          {
            id: "tl-401",
            timestamp: "Yesterday, 14:15",
            author: "Dr. James Arinze",
            role: "Owner",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "Post-Handover DLP Snag Logged",
            notes: "Parapet wall moisture ingress logged with photos.",
          },
          {
            id: "tl-402",
            timestamp: "Yesterday, 16:00",
            author: "PrimeBuild Lead Team",
            role: "Contractor",
            tier: "Tier 1: Direct Contractor Rectification",
            action: "DLP Rectification Crew Mobilized",
            notes: "Repair crew scheduled for Saturday re-torch and sealing.",
          },
        ],
      },
    ],
    changeRequests: [
      {
        id: "cr-1",
        requestCode: "VO-2026-001",
        title: "Add waterproof crystalline additive to swimming pool and decking slab",
        requestedBy: "Owner",
        requesterName: "Dr. James Arinze (Owner)",
        date: "12 May 2026",
        costImpact: 4500000,
        timeExtensionDays: 4,
        status: "Approved",
        affectedStage: "Stage 2: Ground Floor Foundation & Pool",
        approvedDate: "14 May 2026",
        paymentFundingMethod: "Escrow Reserve Deposit",
        reason: "Specialized crystalline waterproofing integral admixture specified to resist hydrostatic ground water seepage along Lekki lagoon water table.",
        breakdown: [
          { item: "Penetron Admix crystalline waterproofing bags (40 units)", cost: 2800000 },
          { item: "Specialist application, slump monitoring & joint waterstops", cost: 1700000 },
        ],
      },
      {
        id: "cr-2",
        requestCode: "VO-2026-002",
        title: "Raise perimeter boundary retaining wall by 3 courses with heavy weep holes",
        requestedBy: "Contractor",
        requesterName: "Engr. Chidi Okafor (Lead Builder)",
        date: "04 Oct 2026",
        costImpact: 2800000,
        timeExtensionDays: 3,
        status: "Waiting for Your Approval",
        affectedStage: "Stage 3: First Floor Slab & Columns",
        reason: "Rainwater from street runoff during heavy downpours risks pooling against compound boundary; raising retaining perimeter prevents yard flooding.",
        contractorAssessmentNote: "Site surveyor confirmed street runoff level during flash storm. Adding 3 courses of vibrated solid 9-inch blocks with geotextile weep holes will prevent surface water flooding into parking deck.",
        breakdown: [
          { item: "Vibrated 9-inch solid sandcrete blocks & high-grade Portland cement", cost: 1600000 },
          { item: "Steel rebar dowels, coping mortar & mason specialist labor", cost: 1200000 },
        ],
      },
      {
        id: "cr-3",
        requestCode: "VO-2026-003",
        title: "Upgrade master penthouse ensuite to Spanish matte porcelain tiling",
        requestedBy: "Owner",
        requesterName: "Dr. James Arinze (Owner)",
        date: "Yesterday, 14:15",
        costImpact: 3600000,
        timeExtensionDays: 2,
        status: "Awaiting Contractor Assessment",
        affectedStage: "Stage 5: Interior Finishes & Tiling",
        reason: "Owner requested replacing standard glazed ceramic tile finish with 1200x600mm anti-slip Spanish matte porcelain and concealed brass drainage strips.",
        breakdown: [
          { item: "Estimated imported porcelain tile crates & flexible adhesive", cost: 2400000 },
          { item: "Precision waterjet cutting & specialized tile setter labor", cost: 1200000 },
        ],
      },
    ],
    retentionDlp: {
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
      termsSummary: "5% retention (₦12,250,000) held in segregated Vantaged escrow trust for 12 months following practical handover. Contractor is contractually obliged to remediate latent defects within 14 days of notice, failing which owner can authorize backcharge drawdowns from this retention pool.",
    },
  },
};

export const COMPLETED_PROJECTS_META: Record<string, Partial<ProjectDetailData>> = {
  "hist-ikoyi": {
    id: "hist-ikoyi",
    jobId: "JOB-3104",
    title: "Ikoyi Waterfront Luxury Penthouse",
    category: "Residential",
    location: "Ikoyi, Lagos",
    address: "Plot 12, Alexander Avenue, Ikoyi, Lagos",
    specs: "Penthouse & Terrace Suite",
    contractValue: 84500000,
    startDate: "10 Feb 2024",
    targetEndDate: "15 Aug 2025",
    contractor: {
      name: "Julius B. Consortium",
      cacNumber: "RC-482910",
      directorName: "Engr. Babatunde Adeleke",
      rating: "4.9 ★",
      reviewsCount: 42,
      projectsCompleted: 28,
      bankAccountName: "Julius B. Consortium Ltd",
      bankName: "Zenith Bank",
      bankAccountNumber: "1018492019",
    },
  },
  "hist-vi-tech": {
    id: "hist-vi-tech",
    jobId: "JOB-2911",
    title: "Victoria Island Commercial Tech Hub",
    category: "Commercial",
    location: "Victoria Island, Lagos",
    address: "14 Kofo Abayomi Street, Victoria Island, Lagos",
    specs: "5-Storey Corporate Headquarters",
    contractValue: 165000000,
    startDate: "05 Jun 2023",
    targetEndDate: "20 Feb 2025",
    contractor: {
      name: "Crane & Stone Structural",
      cacNumber: "RC-391840",
      directorName: "Engr. Folake Ade",
      rating: "4.9 ★",
      reviewsCount: 38,
      projectsCompleted: 19,
      bankAccountName: "Crane & Stone Structural Nigeria",
      bankName: "Stanbic IBTC Bank",
      bankAccountNumber: "0029481940",
    },
  },
  "hist-chevron": {
    id: "hist-chevron",
    jobId: "JOB-2680",
    title: "Chevron Lekki Residential Estate",
    category: "Residential",
    location: "Lekki, Lagos",
    address: "Phase 1 Infrastructure, Chevron Drive, Lekki, Lagos",
    specs: "Phase 1 Infrastructure & 8 Units",
    contractValue: 210000000,
    startDate: "12 Jan 2023",
    targetEndDate: "18 Nov 2024",
    contractor: {
      name: "Apex Build Nigeria Ltd",
      cacNumber: "RC-268041",
      directorName: "Arc. Bello K.",
      rating: "4.8 ★",
      reviewsCount: 31,
      projectsCompleted: 15,
      bankAccountName: "Apex Build Nigeria Ltd",
      bankName: "Access Bank",
      bankAccountNumber: "0104829104",
    },
  },
  "hist-epe-cold": {
    id: "hist-epe-cold",
    jobId: "JOB-2419",
    title: "Epe Agro Cold Storage Facility",
    category: "Commercial",
    location: "Epe, Lagos",
    address: "Agro Industrial Zone, Epe Waterfront, Lagos",
    specs: "Industrial Cold Storage Facility",
    contractValue: 42000000,
    startDate: "15 Sep 2023",
    targetEndDate: "25 Jun 2024",
    contractor: {
      name: "Prime Terra Infrastructure",
      cacNumber: "RC-241950",
      directorName: "Engr. Tunde Coker",
      rating: "4.7 ★",
      reviewsCount: 22,
      projectsCompleted: 11,
      bankAccountName: "Prime Terra Infrastructure Ltd",
      bankName: "First Bank of Nigeria",
      bankAccountNumber: "2018492011",
    },
  },
  "hist-maitama": {
    id: "hist-maitama",
    jobId: "JOB-2105",
    title: "Maitama Diplomatic Villa",
    category: "Residential",
    location: "Maitama District, Abuja",
    address: "Plot 88, Amazon Street, Maitama District, Abuja",
    specs: "Diplomatic Residence & Perimeter",
    contractValue: 195000000,
    startDate: "08 Oct 2022",
    targetEndDate: "14 Nov 2023",
    contractor: {
      name: "SolidGround Engineering",
      cacNumber: "RC-210560",
      directorName: "Arc. Bello K.",
      rating: "4.9 ★",
      reviewsCount: 35,
      projectsCompleted: 24,
      bankAccountName: "SolidGround Engineering Ltd",
      bankName: "Access Bank",
      bankAccountNumber: "0104928172",
    },
  },
  "hist-asokoro": {
    id: "hist-asokoro",
    jobId: "JOB-1940",
    title: "Asokoro Medical Center",
    category: "Commercial",
    location: "Asokoro District, Abuja",
    address: "Asokoro Extension, Near ECOWAS Secretariat, Abuja",
    specs: "Specialist Clinical Center",
    contractValue: 130000000,
    startDate: "10 Mar 2022",
    targetEndDate: "30 May 2023",
    contractor: {
      name: "Hitech Construction",
      cacNumber: "RC-194070",
      directorName: "Engr. Amina Lawal",
      rating: "4.8 ★",
      reviewsCount: 29,
      projectsCompleted: 18,
      bankAccountName: "Hitech Construction Co. Ltd",
      bankName: "Zenith Bank",
      bankAccountNumber: "1019284910",
    },
  },
};

export function buildCompletedProjectDetail(
  id: string,
  meta?: Partial<ProjectDetailData>
): ProjectDetailData {
  const base = PROJECT_DETAILS_MAP["proj-lekki"];
  const contractVal = meta?.contractValue || 145000000;
  const stageWeights = [0.15, 0.2, 0.25, 0.15, 0.15, 0.1];
  const stageTitles = [
    { title: "Site Setting Out, Pegging & Excavation", category: "Substructure" },
    { title: "Deep Foundation Pillars & Ground Beams", category: "Substructure" },
    { title: "Superstructure Blockwork & Decking", category: "Superstructure" },
    { title: "Roof Framing, Parapet & Waterproofing", category: "Roofing" },
    { title: "Mechanical, Electrical & Wall Plastering", category: "MEP Services" },
    { title: "Finishing Snagging, Handover & Retainage", category: "Finishing" },
  ];

  const stages: ProjectStage[] = stageTitles.map((st, i) => {
    const stageNum = i + 1;
    const tranche = Math.round(contractVal * stageWeights[i]);
    return {
      id: `hist-stg-${id}-${stageNum}`,
      stageNumber: stageNum,
      title: st.title,
      category: st.category,
      weightPercent: Math.round(stageWeights[i] * 100),
      trancheAmount: tranche,
      status: "Approved",
      startDate: "Completed",
      targetEndDate: "Completed",
      completedDate: "Completed & Verified",
      verifiedBy: "Dr. James Arinze (Owner) & Lead Quality Inspector",
      checklist: [
        { id: `c-${id}-${stageNum}-1`, label: `${st.title} fully inspected against structural drawings`, isPassed: true, completedDate: "Verified" },
        { id: `c-${id}-${stageNum}-2`, label: `Material batch compliance and crush test certificates verified`, isPassed: true, completedDate: "Verified" },
        { id: `c-${id}-${stageNum}-3`, label: `Site engineer and owner representative signed off approval`, isPassed: true, completedDate: "Verified" },
      ],
      proofMedia: [
        {
          id: `p-${id}-${stageNum}-1`,
          type: "photo",
          title: "Final Verified Inspection Proof",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=800&auto=format&fit=crop&q=80",
          gpsLocation: meta?.location || "Lagos, Nigeria",
          withinSite: true,
          timestamp: "Verified on site",
          uploadedBy: "Lead Quality Inspector",
        },
      ],
      activityLog: [
        {
          id: `act-${id}-${stageNum}`,
          action: "Stage Approved & Milestone Paid",
          user: "Owner & Inspector",
          role: "Quality Sign-off",
          timestamp: "Approved & Completed",
          details: `Milestone ${stageNum} inspected, certified defect-free and funds released.`,
        },
      ],
    };
  });

  const transactions: ProjectTransactionTranche[] = stageTitles.map((st, i) => {
    const stageNum = i + 1;
    const tranche = Math.round(contractVal * stageWeights[i]);
    return {
      id: `hist-trx-${id}-${stageNum}`,
      trancheNumber: stageNum,
      title: `Stage ${stageNum}: ${st.title}`,
      stageLinked: `Stage ${stageNum}`,
      amount: tranche,
      status: "Paid to Builder",
      dueDate: "Paid",
      paidDate: "Paid & Cleared",
      bankSessionId: `NIBSS/0000142${stageNum}819201`,
      paymentMethod: "Vantaged Secure Escrow Settlement",
      verifiedBy: "Dr. James Arinze",
      verifiedRole: "Building Owner",
      contractorConfirmed: true,
      contractorConfirmedDate: "Payment Confirmed by Contractor",
      notes: `Tranche ${stageNum} fully disbursed from escrow upon verified stage completion.`,
    };
  });

  return {
    ...base,
    id,
    jobId: meta?.jobId || `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
    title: meta?.title || "Completed Luxury Building",
    category: meta?.category || "Residential",
    location: meta?.location || "Lagos, Nigeria",
    address: meta?.address || meta?.location || "Lagos, Nigeria",
    specs: meta?.specs || "Completed Construction",
    contractValue: contractVal,
    currency: "NGN",
    verifiedProgress: 100,
    reportedProgress: 100,
    startDate: meta?.startDate || "2023",
    targetEndDate: meta?.targetEndDate || "2025",
    status: "Completed",
    currentActiveStageTitle: "All Stages Approved & Handed Over",
    contractor: meta?.contractor ? { ...base.contractor, ...meta.contractor } : base.contractor,
    stages,
    transactions,
    disputes: [
      {
        id: `dsp-${id}`,
        disputeCode: "RESOLVED-01",
        title: "Snagging punch-list items on final walkthrough",
        category: "Quality of Work",
        linkedStage: "Final Handover",
        linkedTrancheAmount: 0,
        status: "Resolved",
        escalationTier: "Tier 1: Direct Contractor Rectification",
        openedDate: "Before handover",
        daysRemaining: 0,
        raisedBy: "Owner Representative",
        whatHappened: "Minor paint touch-ups and door lock adjustment identified.",
        builderReply: "Rectified immediately within 24 hours.",
        howItWasFixed: "All punch list snags verified and closed. Final handover certificate signed.",
      },
    ],
    changeRequests: [],
  };
}

export function getProjectDetail(id: string): ProjectDetailData {
  // If it's a proposed plan ID (e.g. prop-lekki-plan), map to the base project
  if (id.startsWith("prop-")) {
    const cleanId = id.replace("prop-", "proj-").replace("-plan", "");
    return getProjectDetail(cleanId);
  }

  // 1. If it's a known completed project or id starts with "hist-"
  if (COMPLETED_PROJECTS_META[id] || id.startsWith("hist-")) {
    return buildCompletedProjectDetail(id, COMPLETED_PROJECTS_META[id]);
  }

  // 2. Check if this project has been marked completed in localStorage
  if (typeof window !== "undefined") {
    try {
      const savedHistory = localStorage.getItem("vantaged_contract_history");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          const inHistory = parsed.find((p: any) => p.id === id);
          if (inHistory && (inHistory.progressPercent >= 100 || inHistory.status === "Final sign-off" || inHistory.status === "Completed")) {
            return buildCompletedProjectDetail(id, {
              id: inHistory.id,
              jobId: inHistory.jobId,
              title: inHistory.title,
              category: inHistory.category,
              location: inHistory.location,
              specs: inHistory.specs,
              contractValue: parseFloat(inHistory.escrowAmount?.replace(/[^0-9.]/g, "") || "145") * 1000000,
              contractor: {
                ...PROJECT_DETAILS_MAP["proj-lekki"].contractor,
                name: inHistory.contractor?.name || "Contractor Consortium",
                rating: inHistory.contractor?.rating || "4.9 ★",
              },
            });
          }
        }
      }
    } catch {}
  }

  if (PROJECT_DETAILS_MAP[id]) return PROJECT_DETAILS_MAP[id];

  const base = PROJECT_DETAILS_MAP["proj-lekki"];
  if (id === "proj-enclave") {
    return {
      ...base,
      id: "proj-enclave",
      jobId: "JOB-3914",
      title: "The Enclave Waterfront Resort",
      category: "Waterfront",
      location: "Epe Waterfront Corridor, Lagos",
      address: "Epe Waterfront Corridor, Lekki-Epe Expressway, Lagos",
      specs: "Boutique Eco-Resort & Spa Villa",
      contractValue: 188500000,
      verifiedProgress: 45,
      contractor: {
        ...base.contractor,
        name: "Crane & Stone Structural",
        bankAccountName: "Crane & Stone Structural Nigeria",
        bankName: "Stanbic IBTC Bank",
        bankAccountNumber: "0029481940",
      },
    };
  }

  if (id === "proj-guzape") {
    return {
      ...base,
      id: "proj-guzape",
      jobId: "JOB-5102",
      title: "Guzape Hills Residence",
      category: "Residential",
      location: "Guzape District, Asokoro Ext., Abuja",
      address: "Plot 104, Guzape Hills, Asokoro Extension, Abuja",
      specs: "6-Bedroom Contemporary Mansion",
      contractValue: 210000000,
      verifiedProgress: 64,
      contractor: {
        ...base.contractor,
        name: "SolidGround Engineering",
        bankAccountName: "SolidGround Engineering Ltd",
        bankName: "Access Bank",
        bankAccountNumber: "0104928172",
      },
    };
  }

  if (id === "proj-eko") {
    return {
      ...base,
      id: "proj-eko",
      jobId: "JOB-6205",
      title: "Eko Atlantic Sky Tower",
      category: "Commercial",
      location: "Marina District, Eko Atlantic City",
      address: "Plot 12, Marina District, Eko Atlantic City, Lagos",
      specs: "14-Storey Mixed-Use Commercial",
      contractValue: 466500000,
      verifiedProgress: 30,
      contractor: {
        ...base.contractor,
        name: "Cappa & D'Alberto",
        bankAccountName: "Cappa & D'Alberto Plc",
        bankName: "First Bank of Nigeria",
        bankAccountNumber: "2019481023",
      },
    };
  }

  if (id === "proj-banana") {
    return {
      ...base,
      id: "proj-banana",
      jobId: "JOB-7311",
      title: "Banana Island Horizon Penthouse",
      category: "Residential",
      location: "Zone C, Banana Island, Ikoyi",
      address: "Zone C, Close 4, Banana Island, Ikoyi, Lagos",
      specs: "Ultra-Luxury Triplex Penthouse",
      contractValue: 320000000,
      verifiedProgress: 90,
      contractor: {
        ...base.contractor,
        name: "Hitech Construction",
        bankAccountName: "Hitech Construction Co. Ltd",
        bankName: "Zenith Bank",
        bankAccountNumber: "1019284910",
      },
    };
  }

  if (id === "proj-vi") {
    return {
      ...base,
      id: "proj-vi",
      jobId: "JOB-8140",
      title: "Victoria Island Commercial Plaza",
      category: "Commercial",
      location: "Adeola Odeku St, Victoria Island",
      address: "Plot 84, Adeola Odeku Street, Victoria Island, Lagos",
      specs: "Premium Office & Retail Complex",
      contractValue: 95000000,
      verifiedProgress: 18,
      contractor: {
        ...base.contractor,
        name: "Costain West Africa",
        bankAccountName: "Costain West Africa Plc",
        bankName: "Guaranty Trust Bank",
        bankAccountNumber: "0149281055",
      },
    };
  }

  return base;
}

export function getStageDetail(projectId: string, stageId: string): { project: ProjectDetailData; stage: ProjectStage } {
  const project = getProjectDetail(projectId);
  const stage = project.stages.find((s) => s.id === stageId) || project.stages[3] || project.stages[0];
  return { project, stage };
}
