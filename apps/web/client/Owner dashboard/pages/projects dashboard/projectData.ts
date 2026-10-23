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

export interface ProjectDisputeItem {
  id: string;
  disputeCode: string;
  title: string;
  category: "Quality of Work" | "Payment Issue" | "Change in Plan";
  linkedStage: string;
  linkedTrancheAmount: number;
  status: "Active Dispute" | "Resolved";
  openedDate: string;
  daysRemaining: number;
  raisedBy: string;
  whatHappened: string;
  builderReply: string;
  howItWasFixed: string;
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
  status: "Waiting for Your Approval" | "Approved" | "Declined";
  reason: string;
  breakdown: { item: string; cost: number }[];
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
        description: "Formwork props, rebar tying for cantilever balconies and main slab, electrical conduits, casting of Grade 25 reinforced waterproof concrete, and 14-day wet curing.",
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
            text: "Inspected the cantilever overhangs and plumbing sleeve placements on site yesterday. Clean alignment and no honeycombing observed on soffits. Recommend approval.",
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
        title: "5% Final Quality Hold (Retainage)",
        stageLinked: "Final Handover",
        amount: 12250000,
        status: "Held on Vantaged",
        dueDate: "Released at final key handover & defect liability period",
        paymentMethod: "Vantaged Secure Escrow",
        notes: "Retained until 6 months defects liability period expires without structural issues.",
      },
    ],
    disputes: [
      {
        id: "dsp-101",
        disputeCode: "ISSUE-01",
        title: "Rough concrete surface on ground floor Column C4",
        category: "Quality of Work",
        linkedStage: "Stage 3: Ground Floor Walls",
        linkedTrancheAmount: 18500000,
        status: "Resolved",
        openedDate: "14 Apr 2026",
        daysRemaining: 0,
        raisedBy: "Engr. Emeka Okonkwo",
        whatHappened: "Your site rep noticed small holes and rough concrete on Column C4 near the stairs.",
        builderReply: "Builder agreed to chip away the weak concrete and fill it with high-strength structural grout.",
        howItWasFixed: "Work was fixed properly at no extra charge. Site rep re-checked and approved it.",
      },
    ],
    changeRequests: [
      {
        id: "cr-1",
        requestCode: "CHANGE-01",
        title: "Add waterproof mix to swimming pool and decking",
        requestedBy: "Owner",
        requesterName: "Dr. James Arinze (Owner)",
        date: "12 May 2026",
        costImpact: 4500000,
        timeExtensionDays: 4,
        status: "Approved",
        reason: "Requested extra waterproofing seal to protect the pool and decking from moisture leaks.",
        breakdown: [
          { item: "Special waterproof seal bags (40 bags)", cost: 2800000 },
          { item: "Labor and application", cost: 1700000 },
        ],
      },
      {
        id: "cr-2",
        requestCode: "CHANGE-02",
        title: "Raise fence wall by 2 blocks for flood protection",
        requestedBy: "Contractor",
        requesterName: "Engr. Chidi Okafor",
        date: "04 Oct 2026",
        costImpact: 2800000,
        timeExtensionDays: 3,
        status: "Waiting for Your Approval",
        reason: "Rainwater from the road might spill into the yard during heavy rains. Adding 2 lines of blocks will keep the compound dry.",
        breakdown: [
          { item: "Blocks, cement and iron rods", cost: 1600000 },
          { item: "Mason labor and plastering", cost: 1200000 },
        ],
      },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetailData {
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
