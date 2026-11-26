import {
  DEMO_DIRECTOR_ACTIVE_FOLDER_PROJECTS,
  DEMO_DIRECTOR_HISTORY_FOLDER_PROJECTS,
  DEMO_DIRECTOR_PLAN_FOLDER_PROJECTS,
} from "../../data/directorData";
import {
  broadcastPortalSync,
  normalizeCanonicalProjectId,
  pushProjectStateToBackend,
  syncContractorStagesToOwner,
  syncContractorTeamToOwner,
} from "../../../../shared/vantagedSyncBridge";
import { getContractorSession } from "../../../../shared/vantagedAuth";

export type ContractorStageStatus =
  | "Approved"
  | "Ready for Review"
  | "Fix Requested"
  | "In Progress"
  | "Disputed"
  | "Scheduled";

export interface ContractorChecklistItem {
  id: string;
  label: string;
  requiredProof: string;
  isCompleted: boolean;
  ownerFlagged?: boolean;
  ownerNote?: string;
}

export interface ContractorProofItem {
  id: string;
  type: "photo" | "video" | "lab_report";
  title: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
  gpsCoords: string;
  checklistItemId?: string;
  thumbnailUrl?: string;
  fileSize?: string;
}

export interface ContractorStageComment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
  isCompany: boolean;
}

export interface ContractorProjectStage {
  id: string;
  order: number;
  title: string;
  summary: string;
  weightBps: number; // 10000 = 100%
  trancheAmount: number;
  status: ContractorStageStatus;
  dueDate: string;
  submittedAt?: string;
  approvedAt?: string;
  checklist: ContractorChecklistItem[];
  proofItems: ContractorProofItem[];
  comments: ContractorStageComment[];
}

export interface ContractorProjectTranche {
  id: string;
  reference: string;
  stageTitle: string;
  grossAmount: number;
  retainageAmount: number;
  netPayout: number;
  status: "Receipt Confirmed" | "Awaiting Your Confirmation" | "Held in Escrow" | "Upcoming";
  disbursedDate?: string;
  confirmDeadline?: string;
  bankSessionId?: string;
  confirmedAt?: string;
}

export interface ContractorProjectIssue {
  id: string;
  code: string;
  kind: "Fix Request" | "Formal Dispute";
  title: string;
  stageTitle: string;
  severity: "Minor Snag" | "Moderate Defect" | "Critical Structural";
  status: "Action Required" | "Cure Plan Submitted" | "Under Review" | "Resolved";
  escalationTier?: "Tier 1: Direct Fix" | "Tier 2: Independent Inspection" | "Tier 3: Formal Arbitration";
  responseWindowHours?: number;
  severityMaxAllowedDays?: number;
  mutualClockDaysLeft?: number;
  overdueDays?: number;
  dailyDelayFineRate?: number;
  backchargeAmount?: number;
  backchargeNote?: string;
  raisedBy: string;
  openedDate: string;
  deadlineLabel: string;
  heldAmount: number;
  ownerDescription: string;
  curePlan?: {
    methodStatement: string;
    proposedDays: number;
    submittedAt: string;
  };
  counterEvidence: {
    id: string;
    title: string;
    fileType: string;
    fileName?: string;
    previewUrl?: string;
    uploadedAt: string;
    note: string;
  }[];
  timeline: {
    id: string;
    actor: string;
    action: string;
    time: string;
  }[];
}

export interface ContractorVariationRequest {
  id: string;
  code: string;
  title: string;
  linkedStage: string;
  category: "Scope Addition" | "Material Upgrade" | "Site Condition" | "Design Revision";
  requestedBy?: "Owner" | "Contractor";
  costImpact: number; // positive = addition, negative = deduction
  timelineDays: number;
  status: "Awaiting Owner Approval" | "Needs Builder Quote" | "Approved" | "Declined" | "Draft";
  submittedAt: string;
  reason: string;
  boqBreakdown: string;
  ownerNote?: string;
}

export interface ContractorSiteMember {
  id: string;
  name: string;
  role: "Director" | "Site Manager" | "Office Coordinator" | "Site Foreman" | "QA/QC Engineer";
  phone: string;
  email: string;
  location: string;
  assigned: boolean;
  points: number;
}

export interface ContractorProjectDetail {
  id: string;
  jobId: string;
  title: string;
  category: string;
  location: string;
  address: string;
  specs: string;
  status: "Active" | "On Hold (Dispute)" | "Completed";
  ballInCourt: "CONTRACTOR" | "OWNER";
  contractValue: number;
  retainagePercent: number;
  targetEndDate: string;
  startDate: string;
  client: {
    name: string;
    email: string;
    phone: string;
    verifiedBadge: string;
    repName?: string;
    repRole?: string;
  };
  stages: ContractorProjectStage[];
  tranches: ContractorProjectTranche[];
  issues: ContractorProjectIssue[];
  variations: ContractorVariationRequest[];
  siteTeam: ContractorSiteMember[];
}

export const CONTRACTOR_STORAGE_EVENT = "vantaged_contractor_project_update";

export function formatNairaCompact(val: number): string {
  const abs = Math.abs(val);
  const prefix = val < 0 ? "-₦" : "₦";
  if (abs >= 1_000_000_000) return `${prefix}${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${prefix}${(abs / 1_000_000).toFixed(1)}M`;
  return `${prefix}${abs.toLocaleString("en-NG")}`;
}

export function formatNairaFull(val: number): string {
  const prefix = val < 0 ? "-₦" : "₦";
  return `${prefix}${Math.abs(val).toLocaleString("en-NG")}`;
}

function buildDefaultTeam(): ContractorSiteMember[] {
  return [
    {
      id: "crew-1",
      name: "Engr. Babatunde Adeleke",
      role: "Director",
      phone: "+234 803 411 9021",
      email: "babatunde@apexstructure.ng",
      location: "Victoria Island, Lagos",
      assigned: true,
      points: 680,
    },
    {
      id: "crew-2",
      name: "Engr. Tunde Bakare",
      role: "Site Manager",
      phone: "+234 809 210 4412",
      email: "tunde.bakare@apexstructure.ng",
      location: "Lekki Phase 1, Lagos",
      assigned: true,
      points: 420,
    },
    {
      id: "crew-3",
      name: "Amaka Nwosu",
      role: "Office Coordinator",
      phone: "+234 812 308 7740",
      email: "amaka.nwosu@apexstructure.ng",
      location: "Ikoyi, Lagos",
      assigned: true,
      points: 315,
    },
    {
      id: "crew-4",
      name: "Suleiman Ibrahim",
      role: "Site Foreman",
      phone: "+234 806 901 3328",
      email: "suleiman@apexstructure.ng",
      location: "Ajah, Lagos",
      assigned: true,
      points: 280,
    },
    {
      id: "crew-5",
      name: "Chidi Eze",
      role: "QA/QC Engineer",
      phone: "+234 805 712 8801",
      email: "chidi.eze@apexstructure.ng",
      location: "Yaba, Lagos",
      assigned: false,
      points: 240,
    },
  ];
}

const DEMO_PROJECTS_MAP: Record<string, ContractorProjectDetail> = {
  "proj-lekki": {
    id: "proj-lekki",
    jobId: "JOB-4821",
    title: "Lekki Phase 1 Luxury Villa",
    category: "Residential",
    location: "Lekki Phase 1, Lagos",
    address: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos",
    specs: "4-Bedroom Detached + Penthouse",
    status: "Active",
    ballInCourt: "OWNER",
    contractValue: 185_000_000,
    retainagePercent: 5,
    startDate: "12 May 2026",
    targetEndDate: "18 Apr 2027",
    client: {
      name: "Dr. James Arinze",
      email: "james.arinze@example.com",
      phone: "+234 803 778 2190",
      verifiedBadge: "NIN & Escrow Verified",
      repName: "Adebayo Fashola",
      repRole: "Appointed Client Rep",
    },
    stages: [
      {
        id: "stg-1",
        order: 1,
        title: "Stage 1: Site Clearing, Setting Out & Soil Compaction",
        summary: "Site mobilization, perimeter hoarding, survey beacons, and borehole water setup.",
        weightBps: 1000,
        trancheAmount: 18_500_000,
        status: "Approved",
        dueDate: "05 Jun 2026",
        submittedAt: "02 Jun 2026",
        approvedAt: "04 Jun 2026",
        checklist: [
          { id: "c1-1", label: "Perimeter hoarding and site safety signage installed", requiredProof: "Wide-angle site photo", isCompleted: true },
          { id: "c1-2", label: "Surveyor setting-out pegs confirmed against stamped layout", requiredProof: "Geo-tagged peg photos", isCompleted: true },
          { id: "c1-3", label: "Geotechnical compaction certificate uploaded", requiredProof: "Signed lab PDF", isCompleted: true },
        ],
        proofItems: [
          {
            id: "p1-1",
            type: "photo",
            title: "Completed Site Hoarding & Setting Out",
            caption: "North-east corner beacon verified with total station.",
            uploadedAt: "02 Jun 2026 · 14:15",
            uploadedBy: "Engr. Tunde Bakare",
            gpsCoords: "6.4474° N, 3.4723° E",
            checklistItemId: "c1-1",
            thumbnailUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
          },
        ],
        comments: [
          {
            id: "cm1-1",
            authorName: "James Robinson",
            authorRole: "Property Owner",
            text: "Looks clean and right on schedule. Approved for Stage 1 release.",
            timestamp: "04 Jun 2026",
            isCompany: false,
          },
        ],
      },
      {
        id: "stg-2",
        order: 2,
        title: "Stage 2: Raft Foundation & German Floor",
        summary: "Excavation, blinding, Y16 reinforcement mesh, and 25N/mm² ready-mix concrete pour.",
        weightBps: 2000,
        trancheAmount: 37_000_000,
        status: "Approved",
        dueDate: "28 Jul 2026",
        submittedAt: "24 Jul 2026",
        approvedAt: "27 Jul 2026",
        checklist: [
          { id: "c2-1", label: "DPM polythene membrane laid across entire foundation bed", requiredProof: "Site walkthrough photo", isCompleted: true },
          { id: "c2-2", label: "Y16 & Y12 steel spacing verified by structural engineer", requiredProof: "Close-up rebar photo", isCompleted: true },
          { id: "c2-3", label: "14-day concrete cube crush strength >= 25N/mm²", requiredProof: "Lab crush certificate", isCompleted: true },
        ],
        proofItems: [
          {
            id: "p2-1",
            type: "photo",
            title: "Raft Foundation Reinforcement Grid",
            caption: "Double-layer Y16 reinforcement ready for concrete pour.",
            uploadedAt: "20 Jul 2026 · 10:40",
            uploadedBy: "Engr. Tunde Bakare",
            gpsCoords: "6.4474° N, 3.4723° E",
            checklistItemId: "c2-2",
            thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
          },
          {
            id: "p2-2",
            type: "lab_report",
            title: "Lagos Materials Lab 14-Day Cube Test.pdf",
            caption: "Mean compressive strength: 28.4 N/mm² (Passed).",
            uploadedAt: "24 Jul 2026 · 16:05",
            uploadedBy: "Amaka Nwosu",
            gpsCoords: "6.4474° N, 3.4723° E",
            checklistItemId: "c2-3",
            fileSize: "1.4 MB",
          },
        ],
        comments: [],
      },
      {
        id: "stg-3",
        order: 3,
        title: "Stage 3: Ground-Floor Blockwork & Columns",
        summary: "9-inch vibrated sandcrete block walls, lintels, and ground-floor structural columns.",
        weightBps: 1200,
        trancheAmount: 22_200_000,
        status: "Approved",
        dueDate: "15 Sep 2026",
        submittedAt: "12 Sep 2026",
        approvedAt: "14 Sep 2026",
        checklist: [
          { id: "c3-1", label: "Ground floor column verticality checked with plumb bob", requiredProof: "Column elevation photo", isCompleted: true },
          { id: "c3-2", label: "Window & door lintel castings cured for 7 days", requiredProof: "Photo evidence", isCompleted: true },
        ],
        proofItems: [
          {
            id: "p3-1",
            type: "photo",
            title: "Ground-Floor Blockwork Complete",
            caption: "All internal partitions and load-bearing columns cured.",
            uploadedAt: "12 Sep 2026 · 11:20",
            uploadedBy: "Suleiman Ibrahim",
            gpsCoords: "6.4474° N, 3.4723° E",
            checklistItemId: "c3-1",
            thumbnailUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
          },
        ],
        comments: [],
      },
      {
        id: "stg-4",
        order: 4,
        title: "Stage 4: First-Floor Slab & Decking",
        summary: "Marine-board formwork, beam reinforcement, electrical conduit piping, and decking pour.",
        weightBps: 1800,
        trancheAmount: 33_300_000,
        status: "Ready for Review",
        dueDate: "28 Nov 2026",
        submittedAt: "Today · 09:40",
        checklist: [
          { id: "c4-1", label: "Acrow props spaced at 900mm centers across living void", requiredProof: "Under-slab formwork photo", isCompleted: true },
          { id: "c4-2", label: "First-floor MEP conduit layout pressure-checked before pour", requiredProof: "Overhead slab video", isCompleted: true },
          { id: "c4-3", label: "Concrete pour & poker vibrator compaction documented", requiredProof: "Video & cube test", isCompleted: true },
          { id: "c4-4", label: "7-day curing ponding inspection uploaded", requiredProof: "Geo-tagged photo", isCompleted: false },
        ],
        proofItems: [
          {
            id: "p4-1",
            type: "photo",
            title: "First-Floor Slab Rebar & Conduit Grid",
            caption: "Schneider 25mm heavy-gauge conduits laid cleanly prior to pour.",
            uploadedAt: "Today · 09:20",
            uploadedBy: "Engr. Tunde Bakare",
            gpsCoords: "6.4474° N, 3.4723° E",
            checklistItemId: "c4-2",
            thumbnailUrl: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80",
          },
          {
            id: "p4-2",
            type: "video",
            title: "Decking Concrete Pour Walkthrough (01:24)",
            caption: "Lafarge ready-mix pump truck pouring slab with mechanical vibrator.",
            uploadedAt: "Today · 09:35",
            uploadedBy: "Suleiman Ibrahim",
            gpsCoords: "6.4474° N, 3.4723° E",
            checklistItemId: "c4-3",
            thumbnailUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80",
          },
        ],
        comments: [
          {
            id: "cm4-1",
            authorName: "Engr. Tunde Bakare",
            authorRole: "Site Manager (Company)",
            text: "Slab pour finished smoothly. Submitted conduit and pour proofs for owner review.",
            timestamp: "Today · 09:42",
            isCompany: true,
          },
        ],
      },
      {
        id: "stg-5",
        order: 5,
        title: "Stage 5: Upper-Floor Blockwork & Roof Truss",
        summary: "First-floor walls, parapet concrete beams, and stone-coated steel roof installation.",
        weightBps: 1500,
        trancheAmount: 27_750_000,
        status: "In Progress",
        dueDate: "20 Jan 2027",
        checklist: [
          { id: "c5-1", label: "Upper-floor column starter bars cleaned and spliced", requiredProof: "Site photo", isCompleted: true },
          { id: "c5-2", label: "Parapet formwork & waterproofing additive verified", requiredProof: "Geo-tagged photo", isCompleted: false },
          { id: "c5-3", label: "Roof truss anti-rust coat & Gerrard stone-coated sheets", requiredProof: "Drone / roof photo", isCompleted: false },
        ],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-6",
        order: 6,
        title: "Stage 6: MEP First Fix, Plastering & Screeding",
        summary: "Internal/external plastering, plumbing pressure testing, and concealed AC copper piping.",
        weightBps: 1200,
        trancheAmount: 22_200_000,
        status: "Scheduled",
        dueDate: "25 Feb 2027",
        checklist: [
          { id: "c6-1", label: "Plumbing manifold pressure test held at 6 bar for 24h", requiredProof: "Gauge reading photo", isCompleted: false },
          { id: "c6-2", label: "External sand-cement render completed with drip grooves", requiredProof: "Elevation photos", isCompleted: false },
        ],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-7",
        order: 7,
        title: "Stage 7: Finishing, POP, Tiling & Handover",
        summary: "Spanish porcelain tiling, POP ceilings, sanitary ware, Dulux paint, and practical handover.",
        weightBps: 1300,
        trancheAmount: 24_050_000,
        status: "Scheduled",
        dueDate: "18 Apr 2027",
        checklist: [
          { id: "c7-1", label: "Final snagging walkthrough signed off with owner rep", requiredProof: "Signed handover sheet", isCompleted: false },
        ],
        proofItems: [],
        comments: [],
      },
    ],
    tranches: [
      {
        id: "tr-1",
        reference: "NIP-77104821",
        stageTitle: "Stage 1: Site Clearing, Setting Out & Soil Compaction",
        grossAmount: 18_500_000,
        retainageAmount: 925_000,
        netPayout: 17_575_000,
        status: "Receipt Confirmed",
        disbursedDate: "05 Jun 2026",
        bankSessionId: "NIP-77104821",
        confirmedAt: "05 Jun 2026",
      },
      {
        id: "tr-2",
        reference: "NIP-81209344",
        stageTitle: "Stage 2: Raft Foundation & German Floor",
        grossAmount: 37_000_000,
        retainageAmount: 1_850_000,
        netPayout: 35_150_000,
        status: "Receipt Confirmed",
        disbursedDate: "28 Jul 2026",
        bankSessionId: "NIP-81209344",
        confirmedAt: "29 Jul 2026",
      },
      {
        id: "tr-3",
        reference: "NIP-88492014",
        stageTitle: "Stage 3: Ground-Floor Blockwork & Columns",
        grossAmount: 22_200_000,
        retainageAmount: 1_110_000,
        netPayout: 21_090_000,
        status: "Awaiting Your Confirmation",
        disbursedDate: "Yesterday",
        confirmDeadline: "Day 2 of 3 (26h left)",
        bankSessionId: "NIP-88492014",
      },
      {
        id: "tr-4",
        reference: "ESC-409120",
        stageTitle: "Stage 4: First-Floor Slab & Decking",
        grossAmount: 33_300_000,
        retainageAmount: 1_665_000,
        netPayout: 31_635_000,
        status: "Held in Escrow",
      },
      {
        id: "tr-5",
        reference: "ESC-509121",
        stageTitle: "Stage 5: Upper-Floor Blockwork & Roof Truss",
        grossAmount: 27_750_000,
        retainageAmount: 1_387_500,
        netPayout: 26_362_500,
        status: "Upcoming",
      },
    ],
    issues: [
      {
        id: "iss-1",
        code: "FIX-2026-014",
        kind: "Fix Request",
        title: "Verify 7-day slab curing ponding photo on terrace bay",
        stageTitle: "Stage 4: First-Floor Slab & Decking",
        severity: "Minor Snag",
        status: "Action Required",
        raisedBy: "Adebayo Fashola (Client Rep)",
        openedDate: "Today · 11:15",
        deadlineLabel: "48 hours left",
        heldAmount: 0,
        ownerDescription: "Please upload clear daytime photos showing curing water ponding on the master bedroom balcony cantilever before we sign off Stage 4.",
        counterEvidence: [],
        timeline: [
          { id: "t1", actor: "Adebayo Fashola (Client Rep)", action: "Opened checklist punch item on Stage 4", time: "Today · 11:15" },
        ],
      },
    ],
    variations: [
      {
        id: "var-1",
        code: "VO-2026-01",
        title: "Upgrade Swimming Pool Deck to Anti-Slip Travertine Tiles",
        linkedStage: "Stage 7: Finishing, POP, Tiling & Handover",
        category: "Material Upgrade",
        costImpact: 4_800_000,
        timelineDays: 4,
        status: "Awaiting Owner Approval",
        submittedAt: "2 days ago",
        reason: "Client requested natural travertine coping and slip-resistant deck pavers instead of standard ceramic outdoor tiles.",
        boqBreakdown: "68 sqm Turkish Travertine @ ₦58,000/sqm + adhesive & waterproofing grout (₦856,000).",
      },
      {
        id: "var-2",
        code: "VO-2026-00",
        title: "Add Dedicated 20kVA Solar Inverter & Battery Room",
        linkedStage: "Stage 3: Ground-Floor Blockwork & Columns",
        category: "Scope Addition",
        costImpact: 2_650_000,
        timelineDays: 3,
        status: "Approved",
        submittedAt: "08 Sep 2026",
        reason: "Construct ventilated battery enclosure adjacent to the BQ with heavy-duty armored cable trunking.",
        boqBreakdown: "Blockwork, extractor vent, fire-rated steel door, and 16mm armored cable sleeve.",
        ownerNote: "Approved — please coordinate trunking with our solar vendor.",
      },
    ],
    siteTeam: buildDefaultTeam(),
  },
  "proj-banana": {
    id: "proj-banana",
    jobId: "JOB-7311",
    title: "Banana Island Horizon Penthouse",
    category: "Residential",
    location: "Ikoyi, Lagos",
    address: "Zone C, Banana Island, Ikoyi, Lagos",
    specs: "Ultra-Luxury Triplex Penthouse",
    status: "Active",
    ballInCourt: "CONTRACTOR",
    contractValue: 320_000_000,
    retainagePercent: 5,
    startDate: "01 Aug 2026",
    targetEndDate: "30 Oct 2027",
    client: {
      name: "Adanna Okafor",
      email: "adanna.okafor@example.com",
      phone: "+234 809 445 8120",
      verifiedBadge: "NIN & Escrow Verified",
      repName: "Chukwuemeka Obi",
      repRole: "Quantity Surveyor Rep",
    },
    stages: [
      {
        id: "stg-1",
        order: 1,
        title: "Stage 1: Piling Mobilization & Test Piles",
        summary: "600mm bored piles driven to 24m refusal depth with pile integrity testing.",
        weightBps: 2000,
        trancheAmount: 64_000_000,
        status: "Approved",
        dueDate: "15 Sep 2026",
        submittedAt: "10 Sep 2026",
        approvedAt: "14 Sep 2026",
        checklist: [
          { id: "ik1-1", label: "Pile Integrity Test (PIT) report passed for all 36 piles", requiredProof: "PIT Lab Report", isCompleted: true },
        ],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-2",
        order: 2,
        title: "Stage 2: Substructure & Raft Foundation",
        summary: "Pile cap breaking, ground beams, waterproof tanking, and substructure slab.",
        weightBps: 2000,
        trancheAmount: 64_000_000,
        status: "Fix Requested",
        dueDate: "30 Nov 2026",
        submittedAt: "2 days ago",
        checklist: [
          { id: "ik2-1", label: "Pile cap concrete trimmed to sound level", requiredProof: "Site photos", isCompleted: true },
          {
            id: "ik2-2",
            label: "Y20 rebar lap length >= 50D on North ground beam",
            requiredProof: "Measured tape photo",
            isCompleted: false,
            ownerFlagged: true,
            ownerNote: "Lap splice measured 820mm on Grid B — please extend to 1000mm minimum.",
          },
          {
            id: "ik2-3",
            label: "Slump test photo recorded before blinding pour",
            requiredProof: "Slump cone photo",
            isCompleted: false,
            ownerFlagged: true,
            ownerNote: "Missing slump cone verification photo from Batch #3.",
          },
        ],
        proofItems: [
          {
            id: "ik-p1",
            type: "photo",
            title: "Pile Cap Rebar Cage Assembly",
            caption: "Grid A-C ground beam steel reinforcement.",
            uploadedAt: "2 days ago",
            uploadedBy: "Engr. Babatunde Adeleke",
            gpsCoords: "6.4654° N, 3.4578° E",
            checklistItemId: "ik2-1",
            thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
          },
        ],
        comments: [
          {
            id: "ik-c1",
            authorName: "Chukwuemeka Obi",
            authorRole: "Client QS Rep",
            text: "Please extend Grid B rebar lap length to 1000mm and upload the missing slump photo so we can release Stage 2.",
            timestamp: "Yesterday",
            isCompany: false,
          },
        ],
      },
      {
        id: "stg-3",
        order: 3,
        title: "Stage 3: Ground-Floor Frame & Suspended Slab",
        summary: "Structural columns, lift shaft walls, and first suspended slab.",
        weightBps: 2000,
        trancheAmount: 64_000_000,
        status: "Scheduled",
        dueDate: "10 Feb 2027",
        checklist: [
          { id: "ik3-1", label: "Lift shaft formwork plumb verification", requiredProof: "Site photo", isCompleted: false },
        ],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-4",
        order: 4,
        title: "Stage 4: Upper Superstructure & Roofing",
        summary: "Upper floor frames, roof beams, and standing-seam aluminum roof.",
        weightBps: 2000,
        trancheAmount: 64_000_000,
        status: "Scheduled",
        dueDate: "15 May 2027",
        checklist: [],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-5",
        order: 5,
        title: "Stage 5: Luxury Finishing, MEP & Handover",
        summary: "Smart-home automation, marble floors, fitted kitchens, and handover.",
        weightBps: 2000,
        trancheAmount: 64_000_000,
        status: "Scheduled",
        dueDate: "30 Oct 2027",
        checklist: [],
        proofItems: [],
        comments: [],
      },
    ],
    tranches: [
      {
        id: "ik-tr-1",
        reference: "NIP-66421900",
        stageTitle: "Stage 1: Piling Mobilization & Test Piles",
        grossAmount: 64_000_000,
        retainageAmount: 3_200_000,
        netPayout: 60_800_000,
        status: "Receipt Confirmed",
        disbursedDate: "15 Sep 2026",
        bankSessionId: "NIP-66421900",
        confirmedAt: "15 Sep 2026",
      },
      {
        id: "ik-tr-2",
        reference: "ESC-771290",
        stageTitle: "Stage 2: Substructure & Raft Foundation",
        grossAmount: 64_000_000,
        retainageAmount: 3_200_000,
        netPayout: 60_800_000,
        status: "Held in Escrow",
      },
    ],
    issues: [
      {
        id: "ik-iss-1",
        code: "FIX-2026-019",
        kind: "Fix Request",
        title: "Rebar lap length on Grid B & missing Batch #3 slump photo",
        stageTitle: "Stage 2: Substructure & Raft Foundation",
        severity: "Moderate Defect",
        status: "Action Required",
        raisedBy: "Chukwuemeka Obi (Client QS Rep)",
        openedDate: "Yesterday",
        deadlineLabel: "3 days left",
        heldAmount: 64_000_000,
        ownerDescription: "2 checklist items flagged during pre-pour check: Grid B rebar lap length needs extension to 1000mm and Batch #3 slump cone verification photo must be uploaded.",
        counterEvidence: [],
        timeline: [
          { id: "ikt1", actor: "Chukwuemeka Obi (Client QS Rep)", action: "Flagged 2 checklist items on Stage 2", time: "Yesterday · 15:20" },
        ],
      },
    ],
    variations: [],
    siteTeam: buildDefaultTeam(),
  },
  "proj-guzape": {
    id: "proj-guzape",
    jobId: "JOB-5102",
    title: "Guzape Hills Residence",
    category: "Residential",
    location: "Guzape District, Abuja",
    address: "Guzape District, Asokoro Ext., Abuja",
    specs: "6-Bedroom Contemporary Mansion",
    status: "On Hold (Dispute)",
    ballInCourt: "CONTRACTOR",
    contractValue: 240_000_000,
    retainagePercent: 5,
    startDate: "20 Apr 2026",
    targetEndDate: "15 Jun 2027",
    client: {
      name: "Dr. Musa Danjuma",
      email: "musa.danjuma@example.com",
      phone: "+234 803 992 1044",
      verifiedBadge: "Corporate Escrow Verified",
    },
    stages: [
      {
        id: "stg-1",
        order: 1,
        title: "Stage 1: Excavation & Pad Foundations",
        summary: "Deep pad footings and reinforced starter columns.",
        weightBps: 1500,
        trancheAmount: 36_000_000,
        status: "Approved",
        dueDate: "20 Jun 2026",
        approvedAt: "18 Jun 2026",
        checklist: [{ id: "ab1-1", label: "Pad footing rebar & pour approved", requiredProof: "Lab report", isCompleted: true }],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-2",
        order: 2,
        title: "Stage 2: Ground-Floor Slab & Lift Pit",
        summary: "Waterproof lift pit and ground-floor commercial slab.",
        weightBps: 1500,
        trancheAmount: 36_000_000,
        status: "Approved",
        dueDate: "18 Aug 2026",
        approvedAt: "16 Aug 2026",
        checklist: [{ id: "ab2-1", label: "Lift pit tanking approved", requiredProof: "Site photo", isCompleted: true }],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-3",
        order: 3,
        title: "Stage 3: Ground-Floor Blockwork & Core Columns",
        summary: "Load-bearing columns, shear walls, and ground-floor partitions.",
        weightBps: 2000,
        trancheAmount: 48_000_000,
        status: "Disputed",
        dueDate: "30 Oct 2026",
        submittedAt: "12 days ago",
        checklist: [
          { id: "ab3-1", label: "Shear wall verticality verified", requiredProof: "Survey check", isCompleted: true },
          {
            id: "ab3-2",
            label: "28-day concrete cube strength >= 30N/mm²",
            requiredProof: "Independent lab test",
            isCompleted: false,
            ownerFlagged: true,
            ownerNote: "Dispute opened over column C4 batch mix report.",
          },
        ],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-4",
        order: 4,
        title: "Stage 4: Upper Office Floors & Curtain Wall",
        summary: "Floors 1-3 concrete slabs and double-glazed aluminum facade.",
        weightBps: 3000,
        trancheAmount: 72_000_000,
        status: "Scheduled",
        dueDate: "20 Mar 2027",
        checklist: [],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-5",
        order: 5,
        title: "Stage 5: Lift Commissioning & Commercial Handover",
        summary: "Passenger lift installation, fire sprinklers, and commissioning.",
        weightBps: 2000,
        trancheAmount: 48_000_000,
        status: "Scheduled",
        dueDate: "15 Jun 2027",
        checklist: [],
        proofItems: [],
        comments: [],
      },
    ],
    tranches: [
      {
        id: "ab-tr-1",
        reference: "NIP-55102911",
        stageTitle: "Stage 1: Excavation & Pad Foundations",
        grossAmount: 36_000_000,
        retainageAmount: 1_800_000,
        netPayout: 34_200_000,
        status: "Receipt Confirmed",
        disbursedDate: "19 Jun 2026",
        bankSessionId: "NIP-55102911",
        confirmedAt: "19 Jun 2026",
      },
      {
        id: "ab-tr-2",
        reference: "NIP-60918442",
        stageTitle: "Stage 2: Ground-Floor Slab & Lift Pit",
        grossAmount: 36_000_000,
        retainageAmount: 1_800_000,
        netPayout: 34_200_000,
        status: "Receipt Confirmed",
        disbursedDate: "17 Aug 2026",
        bankSessionId: "NIP-60918442",
        confirmedAt: "18 Aug 2026",
      },
      {
        id: "ab-tr-3",
        reference: "ESC-890122",
        stageTitle: "Stage 3: Ground-Floor Blockwork & Core Columns",
        grossAmount: 48_000_000,
        retainageAmount: 2_400_000,
        netPayout: 45_600_000,
        status: "Held in Escrow",
      },
    ],
    issues: [
      {
        id: "ab-iss-1",
        code: "DISP-2026-008",
        kind: "Formal Dispute",
        title: "Concrete batch strength verification for Column C4",
        stageTitle: "Stage 3: Ground-Floor Blockwork & Core Columns",
        severity: "Critical Structural",
        status: "Action Required",
        raisedBy: "Dr. Musa Danjuma (Owner)",
        openedDate: "3 days ago",
        deadlineLabel: "48h reply · Max 28d repair",
        heldAmount: 48_000_000,
        ownerDescription: "Stage 3 payout is paused pending independent 28-day cube test dossier and rebound hammer test on Column C4.",
        counterEvidence: [],
        timeline: [
          { id: "abt1", actor: "Dr. Musa Danjuma", action: "Opened formal dispute on Stage 3 tranche (₦48M held)", time: "3 days ago" },
          { id: "abt2", actor: "Vantaged Escrow Trust", action: "Stage 3 payout frozen pending fix plan & lab verification", time: "3 days ago" },
        ],
      },
    ],
    variations: [],
    siteTeam: buildDefaultTeam(),
  },
  "hist-ikoyi-99": {
    id: "hist-ikoyi-99",
    jobId: "JOB-IK-0741",
    title: "Ikoyi Pearl Luxury Apartments",
    category: "Residential",
    location: "Old Ikoyi, Lagos",
    address: "18 Bourdillon Road, Old Ikoyi, Lagos",
    specs: "6-Unit Boutique Block · Completed",
    status: "Completed",
    ballInCourt: "OWNER",
    contractValue: 410_000_000,
    retainagePercent: 5,
    startDate: "10 Jan 2025",
    targetEndDate: "14 Sep 2026",
    client: {
      name: "Chief Adewale Coker",
      email: "adewale.coker@example.com",
      phone: "+234 802 110 7788",
      verifiedBadge: "5.0 ★ Verified Client",
    },
    stages: [
      {
        id: "stg-1",
        order: 1,
        title: "Stage 1: Substructure & Piling",
        summary: "Completed piling and raft foundation.",
        weightBps: 3000,
        trancheAmount: 123_000_000,
        status: "Approved",
        dueDate: "30 Apr 2025",
        approvedAt: "28 Apr 2025",
        checklist: [{ id: "h1", label: "Substructure certified", requiredProof: "COREN sign-off", isCompleted: true }],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-2",
        order: 2,
        title: "Stage 2: Superstructure & Envelope",
        summary: "Full 4-storey concrete structure and roof.",
        weightBps: 4000,
        trancheAmount: 164_000_000,
        status: "Approved",
        dueDate: "20 Jan 2026",
        approvedAt: "18 Jan 2026",
        checklist: [{ id: "h2", label: "Superstructure certified", requiredProof: "Site photos", isCompleted: true }],
        proofItems: [],
        comments: [],
      },
      {
        id: "stg-3",
        order: 3,
        title: "Stage 3: Finishing & Practical Handover",
        summary: "All 6 luxury apartments handed over with defect-free sign-off.",
        weightBps: 3000,
        trancheAmount: 123_000_000,
        status: "Approved",
        dueDate: "14 Sep 2026",
        approvedAt: "14 Sep 2026",
        checklist: [{ id: "h3", label: "Certificate of Practical Completion issued", requiredProof: "Signed CPC", isCompleted: true }],
        proofItems: [],
        comments: [],
      },
    ],
    tranches: [
      {
        id: "h-tr-1",
        reference: "NIP-33019822",
        stageTitle: "Stage 1: Substructure & Piling",
        grossAmount: 123_000_000,
        retainageAmount: 6_150_000,
        netPayout: 116_850_000,
        status: "Receipt Confirmed",
        disbursedDate: "29 Apr 2025",
        bankSessionId: "NIP-33019822",
        confirmedAt: "29 Apr 2025",
      },
      {
        id: "h-tr-2",
        reference: "NIP-44812091",
        stageTitle: "Stage 2: Superstructure & Envelope",
        grossAmount: 164_000_000,
        retainageAmount: 8_200_000,
        netPayout: 155_800_000,
        status: "Receipt Confirmed",
        disbursedDate: "19 Jan 2026",
        bankSessionId: "NIP-44812091",
        confirmedAt: "20 Jan 2026",
      },
      {
        id: "h-tr-3",
        reference: "NIP-59104438",
        stageTitle: "Stage 3: Finishing & Practical Handover",
        grossAmount: 123_000_000,
        retainageAmount: 6_150_000,
        netPayout: 116_850_000,
        status: "Receipt Confirmed",
        disbursedDate: "15 Sep 2026",
        bankSessionId: "NIP-59104438",
        confirmedAt: "15 Sep 2026",
      },
    ],
    issues: [],
    variations: [],
    siteTeam: buildDefaultTeam(),
  },
};

export function getContractorProjectDetail(
  projectId: string,
  includeLocalStorage = false
): ContractorProjectDetail {
  const canonicalId = normalizeCanonicalProjectId(projectId);
  if (DEMO_PROJECTS_MAP[canonicalId]) {
    return DEMO_PROJECTS_MAP[canonicalId];
  }

  // Fallback: look up demo folder items (and accepted/active projects from localStorage only after mount)
  const allFolders = [
    ...DEMO_DIRECTOR_ACTIVE_FOLDER_PROJECTS,
    ...DEMO_DIRECTOR_PLAN_FOLDER_PROJECTS,
    ...DEMO_DIRECTOR_HISTORY_FOLDER_PROJECTS,
  ];
  let matched: any = allFolders.find((p) => p.id === canonicalId);
  let dynamicPlan: any = null;

  if (includeLocalStorage && typeof window !== "undefined") {
    try {
      const companyRaw = localStorage.getItem("vantaged_company_accepted_projects");
      const ownerRaw = localStorage.getItem("vantaged_active_projects");
      const accepted = companyRaw ? JSON.parse(companyRaw) : [];
      const ownerActive = ownerRaw ? JSON.parse(ownerRaw) : [];
      const combined = [
        ...(Array.isArray(accepted) ? accepted : []),
        ...(Array.isArray(ownerActive) ? ownerActive : []),
      ];
      if (!matched) {
        matched = combined.find((p: any) => normalizeCanonicalProjectId(p.id) === canonicalId);
      }
      const dynRaw =
        localStorage.getItem(`vantaged_dynamic_plan_${canonicalId}`) ||
        localStorage.getItem(`vantaged_dynamic_plan_prop-${canonicalId.replace(/^proj-/, "")}`);
      if (dynRaw) dynamicPlan = JSON.parse(dynRaw);
    } catch {}
  }

  // Build a CLEAN ZERO-STATE ContractorProjectDetail for any newly created project
  // (NEVER inherit demo tranches, demo issues, demo variations, or fake crew from proj-lekki!)
  const rawStr = String(
    dynamicPlan?.proposedBudget ||
      dynamicPlan?.proposedPlan?.proposedBudget ||
      matched?.escrowAmount ||
      "0"
  ).toUpperCase();
  const numMatch = rawStr.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  let parsedValue = 0;
  if (numMatch) {
    const base = parseFloat(numMatch[1]);
    if (rawStr.includes("B")) parsedValue = Math.round(base * 1_000_000_000);
    else if (rawStr.includes("M")) parsedValue = Math.round(base * 1_000_000);
    else if (rawStr.includes("K")) parsedValue = Math.round(base * 1_000);
    else if (base > 0) parsedValue = Math.round(base);
  }

  const customRawStages: any[] = Array.isArray(matched?.proposedStages)
    ? matched.proposedStages
    : Array.isArray(dynamicPlan?.proposedPlan?.stages)
    ? dynamicPlan.proposedPlan.stages
    : [];

  let dynamicStages: ContractorProjectStage[];
  if (customRawStages.length > 0) {
    const count = customRawStages.length;
    const baseBps = Math.floor(10000 / count);
    const remainderBps = 10000 - baseBps * count;
    dynamicStages = customRawStages.map((stg, idx) => {
      const weightBps = idx === count - 1 ? baseBps + remainderBps : baseBps;
      const order = stg.order || idx + 1;
      const cleanTitle = String(stg.title || `Stage ${order}`);
      return {
        id: `stg-${order}`,
        order,
        title: cleanTitle.startsWith("Stage")
          ? cleanTitle
          : `Stage ${order}: ${cleanTitle}`,
        summary:
          stg.evidence ||
          "Milestone verification deliverables & geofenced site proof.",
        weightBps,
        trancheAmount: Math.round((parsedValue * weightBps) / 10000),
        status: idx === 0 ? "In Progress" : "Scheduled",
        dueDate: dynamicPlan?.proposedPlan?.typicalDuration || `Stage ${order} Window`,
        checklist: [
          {
            id: `chk-${order}-1`,
            label:
              stg.evidence ||
              "Upload geofenced site photos & inspection verification",
            requiredProof: "Min 3 GPS Photos",
            isCompleted: false,
          },
        ],
        proofItems: [],
        comments: [],
      };
    });
  } else {
    dynamicStages = [
      {
        id: "stg-1",
        order: 1,
        title: "Stage 1: Site Mobilization & Setting Out",
        summary: "Survey setting-out pegs, perimeter setup, and initial groundwork.",
        weightBps: 10000,
        trancheAmount: parsedValue,
        status: "In Progress",
        dueDate: "Per Agreed Schedule",
        checklist: [
          {
            id: "chk-1-1",
            label: "Upload site mobilization & setting-out verification photos",
            requiredProof: "Min 3 GPS Photos",
            isCompleted: false,
          },
        ],
        proofItems: [],
        comments: [],
      },
    ];
  }

  // Zero-state tranches: all start as "Upcoming" (₦0 confirmed, ₦0 in escrow, ₦0 awaiting confirmation)
  const freshTranches: ContractorProjectTranche[] = dynamicStages.map((st) => {
    const retainageAmount = Math.round(st.trancheAmount * 0.05);
    return {
      id: `ctr-${st.order}`,
      reference: `ESC-${canonicalId.slice(-4).toUpperCase()}-0${st.order}`,
      stageTitle: st.title,
      grossAmount: st.trancheAmount,
      retainageAmount,
      netPayout: st.trancheAmount - retainageAmount,
      status: "Upcoming",
    };
  });

  const contractorSession = includeLocalStorage ? getContractorSession() : null;
  const freshTeam: ContractorSiteMember[] = [
    {
      id: `crew-dir-${canonicalId}`,
      name:
        contractorSession?.fullName ||
        dynamicPlan?.proposedPlan?.directorName ||
        matched?.contractor?.assignedRep ||
        "Project Director",
      role: "Director",
      phone: "Verified Company Director",
      email: contractorSession?.email || "director@vantaged.ng",
      location: matched?.location || dynamicPlan?.location || "Lagos, Nigeria",
      assigned: true,
      points: 0,
    },
  ];

  return {
    id: canonicalId,
    jobId:
      matched?.jobId ||
      `JOB-${String(canonicalId).replace(/[^0-9A-Za-z]/g, "").slice(-4).toUpperCase()}`,
    title: dynamicPlan?.title || matched?.title || "New Building Project",
    category: dynamicPlan?.category || matched?.category || "Residential",
    location: dynamicPlan?.location || matched?.location || "Lagos, Nigeria",
    address: dynamicPlan?.location || matched?.location || "Lagos, Nigeria",
    specs:
      dynamicPlan?.proposedPlan?.presetName ||
      matched?.specs ||
      `${dynamicStages.length}-Stage Construction Plan`,
    status: matched?.status === "Completed" ? "Completed" : "Active",
    ballInCourt: "CONTRACTOR",
    contractValue: parsedValue,
    retainagePercent: 5,
    startDate: "Just started",
    targetEndDate: dynamicPlan?.proposedPlan?.typicalDuration || "Per Agreed Schedule",
    client: {
      name:
        dynamicPlan?.ownerName ||
        matched?.ownerName ||
        matched?.contractor?.name ||
        "Property Owner",
      email: dynamicPlan?.ownerEmail || "Verified via Vantaged",
      phone: "Verified via Vantaged",
      verifiedBadge: "NIN Verified Owner",
    },
    stages: dynamicStages,
    tranches: freshTranches,
    issues: [],
    variations: [],
    siteTeam: freshTeam,
  };
}

export function loadProjectKey<T>(projectId: string, section: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const canonicalId = normalizeCanonicalProjectId(projectId);
  try {
    const raw =
      localStorage.getItem(`vantaged_cproj_${section}_${canonicalId}`) ||
      localStorage.getItem(`vantaged_cproj_${section}_${projectId}`);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveProjectKey<T>(projectId: string, section: string, value: T): void {
  if (typeof window === "undefined") return;
  const canonicalId = normalizeCanonicalProjectId(projectId);
  const fullKey = `vantaged_cproj_${section}_${canonicalId}`;
  try {
    localStorage.setItem(fullKey, JSON.stringify(value));
    pushProjectStateToBackend({ [fullKey]: value });
    if (section === "stages" && Array.isArray(value)) {
      syncContractorStagesToOwner(canonicalId, value as unknown as ContractorProjectStage[]);
    } else if (section === "team" && Array.isArray(value)) {
      syncContractorTeamToOwner(canonicalId, value as unknown as ContractorSiteMember[]);
    }
    broadcastPortalSync();
  } catch {}
}

export function computeProjectMetrics(stages: ContractorProjectStage[]) {
  const totalWeight = stages.reduce((acc, s) => acc + s.weightBps, 0) || 10000;
  const approvedWeight = stages
    .filter((s) => s.status === "Approved")
    .reduce((acc, s) => acc + s.weightBps, 0);
  const reportedWeight = stages
    .filter((s) => s.status === "Approved" || s.status === "Ready for Review")
    .reduce((acc, s) => acc + s.weightBps, 0);

  return {
    verifiedPercent: Math.round((approvedWeight / totalWeight) * 100),
    reportedPercent: Math.round((reportedWeight / totalWeight) * 100),
    approvedCount: stages.filter((s) => s.status === "Approved").length,
    totalCount: stages.length,
  };
}
