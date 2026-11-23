import type { ProjectItem } from "../../../client/Owner dashboard/components/ProjectFolderCard";

export type DirectorNavId =
  | "home"
  | "projects"
  | "requests"
  | "messages"
  | "transactions"
  | "presets"
  | "team"
  | "rewards"
  | "notifications"
  | "settings";

export interface DirectorNavConfigItem {
  id: DirectorNavId;
  label: string;
  href: string;
  roleHint?: string;
}

export const DIRECTOR_NAV_ITEMS: DirectorNavConfigItem[] = [
  { id: "home", label: "Home", href: "/contractor/dashboard" },
  { id: "projects", label: "Projects", href: "/contractor/projects" },
  { id: "requests", label: "Project Requests", href: "/contractor/requests" },
  { id: "messages", label: "Messages", href: "/contractor/messages" },
  { id: "transactions", label: "Transactions", href: "/contractor/transactions" },
  { id: "presets", label: "Stage Presets", href: "/contractor/presets" },
  { id: "team", label: "Team & Crew", href: "/contractor/team" },
  { id: "rewards", label: "Rewards", href: "/contractor/rewards" },
  { id: "notifications", label: "Notifications", href: "/contractor/notifications" },
  { id: "settings", label: "Settings", href: "/contractor/settings" },
];

export interface DirectorProjectSummary {
  id: string;
  name: string;
  clientName: string;
  location: string;
  currentStage: string;
  verifiedPercent: number;
  reportedPercent: number;
  status:
    | "ACTIVE"
    | "AWAITING_CLIENT_ACCEPTANCE"
    | "ON_HOLD_DISPUTE"
    | "CLIENT_NOT_CONNECTED";
  ballInCourt: "CLIENT" | "CONTRACTOR";
  contractValue: string;
  escrowReceived: string;
  assignedCrewCount: number;
  delayFlag?: string;
}

export interface WaitingActionItem {
  id: string;
  category: "RECEIPT_CONFIRM" | "STAGE_REWORK" | "PROJECT_REQUEST" | "STAGE_READY";
  roleOwner: "Office Coord. / Director" | "Site Manager / Director" | "Director";
  title: string;
  subtitle: string;
  urgencyLabel: string;
  urgencyTone: "orange" | "rose" | "indigo" | "green";
  href: string;
}

export interface DirectorTeamSummary {
  id: string;
  name: string;
  role: "Director" | "Site Manager" | "Office Coordinator" | "Crew Member";
  assignedSites: number;
  points: number;
  status: "ACTIVE" | "ON_SITE";
}

export interface DirectorSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  demoOnly?: boolean;
}

export const DEMO_DIRECTOR_PROJECTS: DirectorProjectSummary[] = [
  {
    id: "proj-lekki",
    name: "Lekki Phase 1 Luxury Villa",
    clientName: "Dr. James Arinze",
    location: "Plot 14, Admiralty Way, Lekki",
    currentStage: "Stage 4: First-Floor Slab & Decking",
    verifiedPercent: 42,
    reportedPercent: 54,
    status: "ACTIVE",
    ballInCourt: "CLIENT",
    contractValue: "₦185,000,000",
    escrowReceived: "₦77,700,000",
    assignedCrewCount: 14,
  },
  {
    id: "proj-banana",
    name: "Banana Island Horizon Penthouse",
    clientName: "Adanna Okafor",
    location: "Zone C, Banana Island, Ikoyi",
    currentStage: "Stage 2: Substructure & Raft Foundation",
    verifiedPercent: 18,
    reportedPercent: 25,
    status: "ACTIVE",
    ballInCourt: "CONTRACTOR",
    contractValue: "₦320,000,000",
    escrowReceived: "₦64,000,000",
    assignedCrewCount: 22,
    delayFlag: "Fix requested on 2 items",
  },
  {
    id: "proj-guzape",
    name: "Guzape Hills Residence",
    clientName: "Dr. Musa Danjuma",
    location: "Guzape District, Asokoro Ext., Abuja",
    currentStage: "Stage 3: Ground-Floor Blockwork",
    verifiedPercent: 30,
    reportedPercent: 36,
    status: "ON_HOLD_DISPUTE",
    ballInCourt: "CONTRACTOR",
    contractValue: "₦240,000,000",
    escrowReceived: "₦72,000,000",
    assignedCrewCount: 11,
    delayFlag: "Active stage dispute",
  },
];

export const DEMO_WAITING_ACTIONS: WaitingActionItem[] = [
  {
    id: "wait-receipt-01",
    category: "RECEIPT_CONFIRM",
    roleOwner: "Office Coord. / Director",
    title: "Confirm ₦22,500,000 stage payment receipt",
    subtitle: "Lekki Phase 1 Luxury Villa · Ref NIP-88492014",
    urgencyLabel: "Day 2 of 3",
    urgencyTone: "rose",
    href: "/contractor/projects/proj-lekki/transactions",
  },
  {
    id: "wait-rework-01",
    category: "STAGE_REWORK",
    roleOwner: "Site Manager / Director",
    title: "Fix 2 failed checklist items on Stage 2",
    subtitle: "Banana Island Horizon Penthouse · Rebar lap length & slump photo",
    urgencyLabel: "Fix List",
    urgencyTone: "orange",
    href: "/contractor/projects/proj-banana/stages/stg-2",
  },
  {
    id: "wait-req-01",
    category: "PROJECT_REQUEST",
    roleOwner: "Director",
    title: "New client project brief: Victoria Island Duplex",
    subtitle: "Est. Budget ₦160M · Invited by Chinedu Okeke",
    urgencyLabel: "New Request",
    urgencyTone: "indigo",
    href: "/contractor/requests",
  },
  {
    id: "wait-ready-01",
    category: "STAGE_READY",
    roleOwner: "Site Manager / Director",
    title: "Guzape Hills Residence: Upload supporting proof",
    subtitle: "Concrete cube test report for disputed Stage 3",
    urgencyLabel: "48h Reply",
    urgencyTone: "rose",
    href: "/contractor/projects/proj-guzape/disputes",
  },
];

export const DEMO_TEAM_MEMBERS: DirectorTeamSummary[] = [
  {
    id: "tm-1",
    name: "Engr. Babatunde Adeleke",
    role: "Director",
    assignedSites: 3,
    points: 0,
    status: "ACTIVE",
  },
  {
    id: "tm-2",
    name: "Engr. Tunde Bakare",
    role: "Site Manager",
    assignedSites: 2,
    points: 420,
    status: "ON_SITE",
  },
  {
    id: "tm-3",
    name: "Amaka Nwosu",
    role: "Office Coordinator",
    assignedSites: 3,
    points: 315,
    status: "ACTIVE",
  },
  {
    id: "tm-4",
    name: "Suleiman Ibrahim (Foreman)",
    role: "Crew Member",
    assignedSites: 2,
    points: 280,
    status: "ON_SITE",
  },
];

export const DIRECTOR_SEARCH_ITEMS: DirectorSearchItem[] = [
  {
    id: "nav-projects",
    title: "Projects & Stage Plans",
    subtitle: "Manage builds, verified % vs reported %, crew tasks & proof",
    category: "Navigation",
    url: "/contractor/projects",
  },
  {
    id: "nav-requests",
    title: "Project Requests Inbox",
    subtitle: "Review incoming client invitations and project briefs",
    category: "Navigation",
    url: "/contractor/requests",
  },
  {
    id: "nav-transactions",
    title: "Payments & Receipt Confirmation",
    subtitle: "Confirm client bank receipts within 3-day window",
    category: "Navigation",
    url: "/contractor/transactions",
  },
  {
    id: "nav-presets",
    title: "Company Stage Presets",
    subtitle: "Customize milestone templates and default payment splits",
    category: "Navigation",
    url: "/contractor/presets",
  },
  {
    id: "nav-team",
    title: "Team & Crew Directory",
    subtitle: "Invite Site Managers, Office Coordinators, and Crew Members",
    category: "Navigation",
    url: "/contractor/team",
  },
  {
    id: "nav-settings",
    title: "Company Verification, Bank & Subscription",
    subtitle: "CAC, COREN badges, 48h NUBAN lock & job slot capacity",
    category: "Settings",
    url: "/contractor/settings",
  },
  {
    id: "demo-prj-lekki",
    title: "Lekki Phase 1 Luxury Villa",
    subtitle: "Stage 4 · 42% Verified / 54% Reported · Client: Dr. James Arinze",
    category: "Active Site",
    url: "/contractor/projects/proj-lekki",
    demoOnly: true,
  },
  {
    id: "demo-prj-ikoyi",
    title: "Banana Island Horizon Penthouse",
    subtitle: "Stage 2 · Fix requested on 2 checklist items",
    category: "Active Site",
    url: "/contractor/projects/proj-banana",
    demoOnly: true,
  },
  {
    id: "demo-receipt-1",
    title: "₦22,500,000 Tranche Receipt (Day 2/3)",
    subtitle: "Pending confirmation for Lekki Phase 1 Villa",
    category: "Receipt",
    url: "/contractor/transactions",
    demoOnly: true,
  },
];

export const DEMO_DIRECTOR_ACTIVE_FOLDER_PROJECTS: ProjectItem[] = [
  {
    id: "proj-lekki",
    jobId: "JOB-4821",
    title: "Lekki Phase 1 Luxury Villa",
    category: "Residential",
    location: "Plot 14, Admiralty Way, Lekki",
    specs: "4-Bedroom Detached + Penthouse",
    status: "Inspection pending",
    milestonesCount: 4,
    milestonesTotal: 7,
    progressPercent: 42,
    escrowAmount: "₦185,000,000",
    contractor: {
      name: "Dr. James Arinze",
      rating: "Client · Verified NIN",
      assignedRep: "Engr. Tunde Bakare",
    },
    currentScope: "Stage 4: First-Floor Slab & Decking",
    stageSubtitle: "Stage 4: First-floor slab & decking",
    snippetLines: [
      "Client: Dr. James Arinze",
      "Lekki Phase 1, Lagos · 14 Crew",
      "42% Verified · 54% Reported",
    ],
    lastUpdated: "2 hours ago",
  },
  {
    id: "proj-banana",
    jobId: "JOB-7311",
    title: "Banana Island Horizon Penthouse",
    category: "Residential",
    location: "Zone C, Banana Island, Ikoyi",
    specs: "Ultra-Luxury Triplex Penthouse",
    status: "Substructure",
    milestonesCount: 2,
    milestonesTotal: 5,
    progressPercent: 18,
    escrowAmount: "₦320,000,000",
    contractor: {
      name: "Adanna Okafor",
      rating: "Client · Verified NIN",
      assignedRep: "Engr. Babatunde Adeleke",
    },
    currentScope: "Stage 2: Substructure & Raft Foundation",
    stageSubtitle: "Stage 2: Fix requested (2 items)",
    snippetLines: [
      "Client: Adanna Okafor",
      "Banana Island, Ikoyi · 22 Crew on site",
      "18% Verified · 25% Reported",
    ],
    lastUpdated: "Yesterday",
  },
  {
    id: "proj-guzape",
    jobId: "JOB-5102",
    title: "Guzape Hills Residence",
    category: "Residential",
    location: "Guzape District, Asokoro Ext., Abuja",
    specs: "6-Bedroom Contemporary Mansion",
    status: "In progress",
    milestonesCount: 3,
    milestonesTotal: 5,
    progressPercent: 30,
    escrowAmount: "₦240,000,000",
    contractor: {
      name: "Dr. Musa Danjuma",
      rating: "Client · Corporate",
      assignedRep: "Engr. Tunde Bakare",
    },
    currentScope: "Stage 3: Ground-Floor Blockwork",
    stageSubtitle: "Stage 3: Active dispute",
    snippetLines: [
      "Client: Dr. Musa Danjuma",
      "Guzape, Abuja · 11 Crew",
      "30% Verified · 36% Reported",
    ],
    lastUpdated: "3 days ago",
  },
];

export const DEMO_DIRECTOR_PLAN_FOLDER_PROJECTS: ProjectItem[] = [
  {
    id: "plan-vi-01",
    jobId: "PLN-VI-902",
    title: "Victoria Island Luxury Duplex",
    category: "Residential",
    location: "Victoria Island, Lagos",
    specs: "4-Bed Smart Duplex · 8 Milestone Stages",
    status: "Inspection pending",
    milestonesCount: 0,
    milestonesTotal: 8,
    progressPercent: 0,
    escrowAmount: "₦160,000,000",
    contractor: {
      name: "Chinedu Okeke",
      rating: "Client · Brief Invited",
      assignedRep: "Engr. Babatunde Adeleke",
    },
    currentScope: "Awaiting Client Acceptance of Stage Plan",
    stageSubtitle: "Proposal sent · Awaiting sign-off",
    snippetLines: [
      "Client: Chinedu Okeke",
      "Victoria Island, Lagos · 8 Stages",
      "Proposed payment split ready",
    ],
    lastUpdated: "Today",
  },
];

export const DEMO_DIRECTOR_HISTORY_FOLDER_PROJECTS: ProjectItem[] = [
  {
    id: "hist-ikoyi-99",
    jobId: "JOB-IK-0741",
    title: "Ikoyi Pearl Luxury Apartments",
    category: "Residential",
    location: "Old Ikoyi, Lagos",
    specs: "6-Unit Boutique Block · Completed",
    status: "Completed",
    milestonesCount: 10,
    milestonesTotal: 10,
    progressPercent: 100,
    escrowAmount: "₦410,000,000",
    contractor: {
      name: "Chief Adewale Coker",
      rating: "5.0 ★ Client Rating",
      assignedRep: "Engr. Babatunde Adeleke",
    },
    currentScope: "Handed Over · Structural Warranty Active",
    stageSubtitle: "100% Verified · Handed over",
    snippetLines: [
      "Client: Chief Adewale Coker",
      "Old Ikoyi, Lagos · Completed",
      "All 10 milestones settled",
    ],
    lastUpdated: "2 months ago",
  },
];

export interface DirectorProjectRequestItem {
  id: string;
  requestCode: string;
  ownerName: string;
  ownerVerified: boolean;
  title: string;
  category:
    | "Residential"
    | "Commercial"
    | "Industrial"
    | "Marine & Waterfront"
    | "Architecture & Design";
  estimatedBudget: string;
  location: string;
  description: string;
  dateSubmitted: string;
  status:
    | "Under Contractor Review"
    | "Drafting Milestone Plan"
    | "Proposal Ready"
    | "Declined";
}

export const DEMO_DIRECTOR_PROJECT_REQUESTS: DirectorProjectRequestItem[] = [
  {
    id: "req-vi-01",
    requestCode: "REQ-VI-204",
    ownerName: "Chinedu Okeke",
    ownerVerified: true,
    title: "Victoria Island Smart 4-Bed Duplex",
    category: "Residential",
    estimatedBudget: "₦100M - ₦250M",
    location: "Plot 12, Adeola Odeku, Victoria Island, Lagos",
    description:
      "Full turnkey construction of a 4-bedroom contemporary duplex with detached BQ, solar hybrid inverter room, and swimming pool deck. Architectural and structural drawings are stamped and ready for milestone breakdown.",
    dateSubmitted: "Today · 2 hours ago",
    status: "Under Contractor Review",
  },
  {
    id: "req-epe-02",
    requestCode: "REQ-EP-189",
    ownerName: "Folake Adeyemi",
    ownerVerified: true,
    title: "Epe Waterfront Boutique Resort",
    category: "Marine & Waterfront",
    estimatedBudget: "₦250M - ₦500M",
    location: "Epe Lagoon Waterfront Corridor, Lagos",
    description:
      "6-chalet eco-resort with reinforced timber jetty, shoreline piling, central dining pavilion, and borehole water treatment plant. Looking for phased escrow milestones with independent COREN inspection.",
    dateSubmitted: "Yesterday",
    status: "Under Contractor Review",
  },
  {
    id: "req-ikeja-03",
    requestCode: "REQ-IK-175",
    ownerName: "Apex Logistics NG Ltd",
    ownerVerified: true,
    title: "Ikeja Cold-Chain Warehouse Annex",
    category: "Industrial",
    estimatedBudget: "₦250M - ₦500M",
    location: "Oba Akran Avenue, Ikeja Industrial Estate, Lagos",
    description:
      "Steel portal-frame warehouse extension (1,400 sqm) with heavy-duty industrial slab, loading dock levelers, and insulated MEP cold-room bays. Soil test report already completed.",
    dateSubmitted: "3 days ago",
    status: "Drafting Milestone Plan",
  },
  {
    id: "req-guzape-04",
    requestCode: "REQ-GZ-162",
    ownerName: "Dr. Ibrahim Suleiman",
    ownerVerified: true,
    title: "Guzape Hills 5-Bed Family Residence",
    category: "Residential",
    estimatedBudget: "₦100M - ₦250M",
    location: "Guzape District, Abuja FCT",
    description:
      "Cantilevered 5-bedroom hillside residence with retaining wall substructure, rooftop terrace, and concealed HVAC ducting. Seeking a 9-stage milestone plan and BOQ validation.",
    dateSubmitted: "Oct 14, 2026",
    status: "Proposal Ready",
  },
];
