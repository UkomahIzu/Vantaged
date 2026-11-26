export type OwnerNavId =
  | 'home'
  | 'projects'
  | 'transactions'
  | 'representatives'
  | 'find-companies'
  | 'inspectors'
  | 'notifications'
  | 'settings';

export interface OwnerNavItem {
  id: OwnerNavId;
  label: string;
  href:
    | '/dashboard'
    | '/projects'
    | '/transactions'
    | '/representatives'
    | '/find-companies'
    | '/inspectors'
    | '/notifications'
    | '/settings';
}

/** Bottom navigation tabs: strictly Home, Projects, Transactions & Representatives */
export const OWNER_BOTTOM_NAV_ITEMS: OwnerNavItem[] = [
  { id: 'home', label: 'Home', href: '/dashboard' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'transactions', label: 'Transactions', href: '/transactions' },
  { id: 'representatives', label: 'Reps', href: '/representatives' },
];

/** Remaining web navigation routes placed inside the collapsible left drawer */
export const OWNER_DRAWER_NAV_ITEMS: OwnerNavItem[] = [
  { id: 'find-companies', label: 'Find companies', href: '/find-companies' },
  { id: 'inspectors', label: 'Inspectors', href: '/inspectors' },
  { id: 'notifications', label: 'Notifications', href: '/notifications' },
  { id: 'settings', label: 'Settings', href: '/settings' },
];

export interface OwnerQuickActionData {
  id: string;
  title: string;
  subtitle: string;
  route?: OwnerNavItem['href'];
  actionType: 'modal' | 'route';
}

export const ALL_OWNER_QUICK_ACTIONS: OwnerQuickActionData[] = [
  {
    id: 'share-link',
    title: 'Generate share link',
    subtitle: 'Read-only live progress link for family & reps',
    route: '/projects',
    actionType: 'modal',
  },
  {
    id: 'message-contractor',
    title: 'Message contractor / rep',
    subtitle: 'Contextual project thread with site engineer',
    route: '/projects',
    actionType: 'modal',
  },
  {
    id: 'assign-rep',
    title: 'Assign representative',
    subtitle: 'Invite a trusted representative or proxy on site',
    route: '/representatives',
    actionType: 'route',
  },
  {
    id: 'site-weather',
    title: 'Check site weather',
    subtitle: 'Live radar, heat index & rain delay status',
    actionType: 'modal',
  },
  {
    id: 'stop-work',
    title: 'Issue stop-work notice',
    subtitle: 'Contractual pause pending inspection clearance',
    route: '/projects',
    actionType: 'route',
  },
];

export interface OwnerProjectProgressStep {
  label: string;
  progress: number;
  status: 'Completed' | 'Awaiting approval' | 'Active' | 'Pending';
}

export interface OwnerDemoProject {
  id: string;
  title: string;
  location: string;
  specs: string;
  scopeTitle: string;
  scopeDescription: string;
  contractorName: string;
  contractorRating: string;
  milestonesCompleted: number;
  assignedRep: string;
  verifiedPercent: number;
  reportedPercent: number;
  steps: OwnerProjectProgressStep[];
}

export const DEMO_OWNER_PROJECTS: OwnerDemoProject[] = [
  {
    id: 'proj-lekki',
    title: 'Lekki Phase 1 Luxury 5-Bed Villa',
    location: 'Lekki Phase 1, Lagos',
    specs: 'Detached Villa · 13 Stages · Escrow Protected',
    scopeTitle: 'Stage 4: First-Floor Decking & Structural Beams',
    scopeDescription:
      'Reinforcement mesh inspection, electrical conduit routing, and B25 concrete slab casting.',
    contractorName: 'Apex Structure & Civil Ltd',
    contractorRating: '4.9 ★',
    milestonesCompleted: 3,
    assignedRep: 'Engr. Damilola Adebayo',
    verifiedPercent: 42,
    reportedPercent: 54,
    steps: [
      { label: 'Clearing', progress: 100, status: 'Completed' },
      { label: 'Foundation', progress: 100, status: 'Completed' },
      { label: 'Blockwork', progress: 100, status: 'Completed' },
      { label: 'Decking', progress: 80, status: 'Awaiting approval' },
      { label: 'Roofing', progress: 0, status: 'Pending' },
    ],
  },
  {
    id: 'proj-vi',
    title: 'Victoria Island Commercial Annex',
    location: 'Victoria Island, Lagos',
    specs: 'Commercial 4-Floor · MEP Package',
    scopeTitle: 'Stage 2: Piled Foundation & Ground Beams',
    scopeDescription:
      'Pile integrity load testing, pile caps concreting, and damp-proof membrane sealing.',
    contractorName: 'Crane & Stone Engineering',
    contractorRating: '4.8 ★',
    milestonesCompleted: 1,
    assignedRep: 'QS Femi Oladipo',
    verifiedPercent: 20,
    reportedPercent: 28,
    steps: [
      { label: 'Site Prep', progress: 100, status: 'Completed' },
      { label: 'Substructure', progress: 65, status: 'Active' },
      { label: 'Superstructure', progress: 0, status: 'Pending' },
      { label: 'MEP', progress: 0, status: 'Pending' },
      { label: 'Finishes', progress: 0, status: 'Pending' },
    ],
  },
  {
    id: 'proj-ikoyi',
    title: 'Ikoyi Waterfront Terrace Apartments',
    location: 'Old Ikoyi, Lagos',
    specs: 'Residential Terraces · COREN Audited',
    scopeTitle: 'Stage 5: Structural Roof Trusses & Waterproofing',
    scopeDescription:
      'Steel truss anchoring, stone-coated roofing installation, and rainwater drainage flashing.',
    contractorName: 'Prestige Build & MEP Specialists',
    contractorRating: '4.9 ★',
    milestonesCompleted: 4,
    assignedRep: 'Arch. Zainab Musa',
    verifiedPercent: 64,
    reportedPercent: 72,
    steps: [
      { label: 'Substructure', progress: 100, status: 'Completed' },
      { label: 'Frame', progress: 100, status: 'Completed' },
      { label: 'Blockwork', progress: 100, status: 'Completed' },
      { label: 'Decking', progress: 100, status: 'Completed' },
      { label: 'Roofing', progress: 50, status: 'Active' },
    ],
  },
];

export interface OwnerCompletedContract {
  id: string;
  title: string;
  location: string;
  contractor: string;
  totalValue: string;
  completedDate: string;
}

export const DEMO_PAST_CONTRACTS: OwnerCompletedContract[] = [
  {
    id: 'cnt-1',
    title: 'Ikoyi Waterfront Luxury Penthouse & Terrace',
    location: 'Ikoyi, Lagos',
    contractor: 'Julius B. Consortium',
    totalValue: '₦84,500,000',
    completedDate: 'Aug 2025',
  },
  {
    id: 'cnt-2',
    title: 'Victoria Island Commercial Tech Hub',
    location: 'Victoria Island, Lagos',
    contractor: 'Crane & Stone Structural',
    totalValue: '₦165,000,000',
    completedDate: 'Feb 2025',
  },
  {
    id: 'cnt-3',
    title: 'Chevron Lekki Residential Estate — Phase 1',
    location: 'Lekki, Lagos',
    contractor: 'Apex Build Nigeria Ltd',
    totalValue: '₦210,000,000',
    completedDate: 'Nov 2024',
  },
];

export interface OwnerNotificationItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  tone: 'orange' | 'green' | 'indigo';
}

export const DEMO_OWNER_NOTIFICATIONS: OwnerNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Stage 4 ready for your approval',
    subtitle: 'Lekki Phase 1 Luxury Villa · 6 geofenced photos + 1 video uploaded',
    timestamp: '18 mins ago',
    tone: 'orange',
  },
  {
    id: 'notif-2',
    title: 'Site check-in & rebar audit verified',
    subtitle: 'Engr. Damilola Adebayo checked in on site (GPS matched)',
    timestamp: '2 hours ago',
    tone: 'green',
  },
  {
    id: 'notif-3',
    title: 'Tranche payment receipt confirmed',
    subtitle: 'Victoria Island Commercial Annex · ₦38,000,000 acknowledged by contractor',
    timestamp: 'Yesterday',
    tone: 'indigo',
  },
];

export interface OwnerSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: OwnerNavItem['href'];
  demoOnly?: boolean;
}

export const OWNER_SEARCH_ITEMS: OwnerSearchItem[] = [
  {
    id: 'nav-projects',
    title: 'Projects Directory',
    subtitle: 'Inspect active sites, progress & stages',
    category: 'Navigation',
    href: '/projects',
  },
  {
    id: 'nav-transactions',
    title: 'Transactions & Escrow',
    subtitle: 'Track milestone disbursements & bank receipts',
    category: 'Navigation',
    href: '/transactions',
  },
  {
    id: 'nav-reps',
    title: 'Client Representatives',
    subtitle: 'Manage delegated engineers & permission modules',
    category: 'Navigation',
    href: '/representatives',
  },
  {
    id: 'nav-companies',
    title: 'Find Verified Builders',
    subtitle: 'Browse CAC & COREN vetted contractors',
    category: 'Navigation',
    href: '/find-companies',
  },
  {
    id: 'demo-lekki',
    title: 'Lekki Phase 1 Luxury 5-Bed Villa',
    subtitle: 'Stage 4 Awaiting Approval · 42% Verified / 54% Reported',
    category: 'Project',
    href: '/projects',
    demoOnly: true,
  },
  {
    id: 'demo-vi',
    title: 'Victoria Island Commercial Annex',
    subtitle: 'Stage 2 Substructure · QS Femi Oladipo assigned',
    category: 'Project',
    href: '/projects',
    demoOnly: true,
  },
];

export interface OwnerFolderProjectItem {
  id: string;
  jobId: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Waterfront' | 'Hospitality';
  location: string;
  specs: string;
  status: 'In progress' | 'Inspection pending' | 'Final sign-off' | 'Substructure' | 'Completed';
  milestonesCount: number;
  milestonesTotal: number;
  progressPercent: number;
  escrowAmount: string;
  contractor: {
    name: string;
    rating: string;
    assignedRep: string;
  };
  currentScope: string;
  stageSubtitle: string;
  snippetLines: string[];
  lastUpdated: string;
}

export const DEMO_OWNER_FOLDER_PROJECTS: OwnerFolderProjectItem[] = [
  {
    id: 'proj-lekki',
    jobId: 'JOB-4821',
    title: 'Lekki Phase 1 Luxury Villa',
    category: 'Residential',
    location: 'Plot 14, Admiralty Way, Lekki',
    specs: '4-Bedroom Detached + Penthouse',
    status: 'In progress',
    milestonesCount: 14,
    milestonesTotal: 18,
    progressPercent: 82,
    escrowAmount: '₦145.0M',
    contractor: {
      name: 'Julius B. Consortium',
      rating: '4.8 ★',
      assignedRep: 'Engr. Chidi O.',
    },
    currentScope: '1st Floor Concrete Slab & Supporting Pillars',
    stageSubtitle: 'Stage 3: First floor concrete decking',
    snippetLines: [
      'Steel reinforcement bars tied',
      'Concrete mix quality checked',
      'Strength test samples collected',
    ],
    lastUpdated: 'Today, 11:42 AM',
  },
  {
    id: 'proj-enclave',
    jobId: 'JOB-3914',
    title: 'The Enclave Waterfront Resort',
    category: 'Waterfront',
    location: 'Epe Waterfront Corridor, Lagos',
    specs: 'Boutique Eco-Resort & Spa Villa',
    status: 'In progress',
    milestonesCount: 9,
    milestonesTotal: 20,
    progressPercent: 45,
    escrowAmount: '₦82.5M',
    contractor: {
      name: 'Crane & Stone Structural',
      rating: '4.9 ★',
      assignedRep: 'Engr. Folake Ade',
    },
    currentScope: 'Deep Foundation Concrete Pillars',
    stageSubtitle: 'Stage 2: Deep foundation pillars',
    snippetLines: [
      '24 foundation pillars installed',
      'Water-resistant concrete poured',
      'Pillar strength test passed',
    ],
    lastUpdated: 'Yesterday, 16:30',
  },
  {
    id: 'proj-guzape',
    jobId: 'JOB-5102',
    title: 'Guzape Hills Residence',
    category: 'Residential',
    location: 'Guzape District, Asokoro Ext., Abuja',
    specs: '6-Bedroom Contemporary Mansion',
    status: 'In progress',
    milestonesCount: 18,
    milestonesTotal: 28,
    progressPercent: 64,
    escrowAmount: '₦210.0M',
    contractor: {
      name: 'SolidGround Engineering',
      rating: '4.8 ★',
      assignedRep: 'Arc. Bello K.',
    },
    currentScope: 'Steel Roof Framework',
    stageSubtitle: 'Stage 4: Roof framing & edge walls',
    snippetLines: [
      'Strong steel trusses installed',
      'Roof edge concrete casted',
      'Weight & strength check passed',
    ],
    lastUpdated: 'Oct 08, 09:15',
  },
];

export const DEMO_OWNER_PROPOSED_PLANS: OwnerFolderProjectItem[] = [
  {
    id: 'prop-guzape-plan',
    jobId: 'PROP-1042',
    title: 'Guzape 5-Bed Smart Duplex Plan',
    category: 'Residential',
    location: 'Guzape District, Abuja',
    specs: '8-Stage Turnkey Proposal',
    status: 'Inspection pending',
    milestonesCount: 0,
    milestonesTotal: 8,
    progressPercent: 100,
    escrowAmount: '₦210.0M Proposed',
    contractor: {
      name: 'SolidGround Engineering',
      rating: '4.8 ★',
      assignedRep: 'Arc. Bello K.',
    },
    currentScope: 'Awaiting your review and contract signature',
    stageSubtitle: '8 Stages · 10% Mobilization',
    snippetLines: [
      'Awaiting Owner Agreement',
      '8 verified milestone stages',
      '5% defect retention included',
    ],
    lastUpdated: 'Oct 12, 2026',
  },
];

export const DEMO_OWNER_CONTRACT_HISTORY: OwnerFolderProjectItem[] = [
  {
    id: 'hist-ikoyi-99',
    jobId: 'JOB-1094',
    title: 'Ikoyi Pearl Luxury Apartments',
    category: 'Residential',
    location: 'Bourdillon Road, Old Ikoyi',
    specs: '8-Unit Luxury Residential Block',
    status: 'Final sign-off',
    milestonesCount: 16,
    milestonesTotal: 16,
    progressPercent: 100,
    escrowAmount: '₦320.0M',
    contractor: {
      name: 'Julius B. Consortium',
      rating: '4.9 ★',
      assignedRep: 'Engr. Chidi O.',
    },
    currentScope: 'Completed Handover & Defect Closure',
    stageSubtitle: 'Completed & handed over',
    snippetLines: [
      'All 16 milestones approved',
      'Final snagging cleared',
      'Escrow 100% disbursed',
    ],
    lastUpdated: 'Nov 2024',
  },
];

export interface OwnerMobileProjectFinancialSummary {
  id: string;
  title: string;
  contractor: string;
  currentContractValue: number;
  disbursedAmount: number;
  inEscrowAmount: number;
  retainageAmount: number;
}

export interface OwnerMobileTransactionItem {
  id: string;
  reference: string;
  bankSessionId: string;
  projectId: string;
  projectTitle: string;
  contractorName: string;
  stageTitle: string;
  type:
    | 'Work Payment'
    | 'Deposited on Vantaged'
    | 'Extra Work Added'
    | 'Final Holdback Released';
  amount: number;
  date: string;
  paymentMethod: string;
  status:
    | 'Received by Builder'
    | 'Sent – Builder to Confirm'
    | 'Deposited on Vantaged'
    | 'Issue Reported';
  verifiedBy?: string;
  notes: string;
}

export const DEMO_OWNER_PROJECT_SUMMARIES: OwnerMobileProjectFinancialSummary[] = [
  {
    id: 'proj-lekki',
    title: 'Lekki Phase 1 Luxury Villa',
    contractor: 'Julius B. Consortium',
    currentContractValue: 145000000,
    disbursedAmount: 118900000,
    inEscrowAmount: 18450000,
    retainageAmount: 7250000,
  },
  {
    id: 'proj-enclave',
    title: 'The Enclave Waterfront Resort',
    contractor: 'Crane & Stone Structural',
    currentContractValue: 182500000,
    disbursedAmount: 82125000,
    inEscrowAmount: 32800000,
    retainageAmount: 9125000,
  },
  {
    id: 'proj-guzape',
    title: 'Guzape Hills Residence',
    contractor: 'SolidGround Engineering',
    currentContractValue: 210000000,
    disbursedAmount: 134400000,
    inEscrowAmount: 24500000,
    retainageAmount: 10500000,
  },
];

export const DEMO_OWNER_TRANSACTIONS: OwnerMobileTransactionItem[] = [
  {
    id: 'tx-101',
    reference: 'VTG-2026-88412',
    bankSessionId: 'NIBSS/0000142610948271',
    projectId: 'proj-lekki',
    projectTitle: 'Lekki Phase 1 Luxury Villa',
    contractorName: 'Julius B. Consortium',
    stageTitle: 'Stage 3: First Floor Concrete Decking',
    type: 'Work Payment',
    amount: 22500000,
    date: 'Today, 09:18 AM',
    paymentMethod: 'Zenith Bank (Vantaged Escrow)',
    status: 'Sent – Builder to Confirm',
    verifiedBy: 'Engr. Chidi O.',
    notes: 'Stage 3 concrete pour and rebar inspection approved. Builder has 3 days to confirm receipt.',
  },
  {
    id: 'tx-102',
    reference: 'DEP-2026-77104',
    bankSessionId: 'NIBSS/0000142608911204',
    projectId: 'proj-enclave',
    projectTitle: 'The Enclave Waterfront Resort',
    contractorName: 'Crane & Stone Structural',
    stageTitle: 'Escrow Deposit for Stage 3 Piling',
    type: 'Deposited on Vantaged',
    amount: 32800000,
    date: 'Yesterday, 04:10 PM',
    paymentMethod: 'Paystack Escrow Transfer',
    status: 'Deposited on Vantaged',
    notes: 'Funds locked in Vantaged Escrow pending independent foundation strength verification.',
  },
  {
    id: 'tx-103',
    reference: 'VTG-2026-66290',
    bankSessionId: 'NIBSS/0000142599182736',
    projectId: 'proj-guzape',
    projectTitle: 'Guzape Hills Residence',
    contractorName: 'SolidGround Engineering',
    stageTitle: 'Stage 4: Steel Roof Framework',
    type: 'Work Payment',
    amount: 38000000,
    date: 'Oct 14, 2026',
    paymentMethod: 'GTBank (Vantaged Escrow)',
    status: 'Received by Builder',
    verifiedBy: 'Arc. Bello K.',
    notes: 'Roof trusses and parapet casting inspected and signed off. Builder confirmed bank receipt.',
  },
  {
    id: 'tx-104',
    reference: 'VO-2026-44108',
    bankSessionId: 'NIBSS/0000142588120045',
    projectId: 'proj-lekki',
    projectTitle: 'Lekki Phase 1 Luxury Villa',
    contractorName: 'Julius B. Consortium',
    stageTitle: 'Extra Work: Acoustic Window Glazing',
    type: 'Extra Work Added',
    amount: 6400000,
    date: 'Oct 08, 2026',
    paymentMethod: 'Zenith Bank (Vantaged Escrow)',
    status: 'Received by Builder',
    verifiedBy: 'Engr. Chidi O.',
    notes: 'Approved variation order for double-glazed acoustic windows.',
  },
];

export interface OwnerMobileClientRepItem {
  id: string;
  name: string;
  title: string;
  discipline:
    | 'Structural & Civil'
    | 'Architecture'
    | 'Quantity Surveying'
    | 'MEP Engineering'
    | 'Marine & Geotech'
    | 'Owner Proxy';
  location: string;
  state: string;
  stagesVerifiedCount: number;
  licenseNumber: string;
  isVerified: boolean;
  isFavorite?: boolean;
  isFeatured?: boolean;
  avatar: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending Invitation';
  mandateSummary: string;
  assignedProjects: {
    id: string;
    title: string;
    roleOnProject: string;
    progressPercent: number;
    status: string;
  }[];
  permissions: {
    viewProgress: boolean;
    approveStages: boolean;
    managePayments: boolean;
    changeRequests: boolean;
    messageContractor: boolean;
    manageShareLinks: boolean;
    invitePeople: boolean;
    maxEscrowLimit?: number;
    maxChangeLimit?: number;
  };
}

export const DEMO_OWNER_CLIENT_REPS: OwnerMobileClientRepItem[] = [
  {
    id: 'rep-adeleke',
    name: 'Engr. Babatunde Adeleke',
    title: 'Principal Consulting Structural Engineer',
    discipline: 'Structural & Civil',
    location: 'Victoria Island, Lagos',
    state: 'Lagos',
    stagesVerifiedCount: 24,
    licenseNumber: 'COREN #R.48201 / NSE Fellow',
    isVerified: true,
    isFavorite: true,
    isFeatured: true,
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&h=160&fit=crop&crop=face',
    email: 'babatunde.adeleke@adeleke-eng.ng',
    phone: '+234 803 401 9920',
    status: 'Active',
    mandateSummary:
      'Independent technical client representative appointed to oversee rebar schedules, post-tensioned slab casting, structural core integrity tests, and issue formal stage clearance prior to escrow tranche release.',
    assignedProjects: [
      {
        id: 'proj-lekki',
        title: 'Lekki Phase 1 Luxury Villa',
        roleOnProject: 'Lead Structural Representative',
        progressPercent: 68,
        status: 'Active Construction',
      },
      {
        id: 'proj-kolawole',
        title: 'Kolawole Commercial Tower',
        roleOnProject: 'Supervising Structural Engineer',
        progressPercent: 35,
        status: 'Substructure Phase',
      },
      {
        id: 'proj-banana',
        title: 'Banana Island Horizon Penthouse',
        roleOnProject: 'Structural Consultant',
        progressPercent: 88,
        status: 'Finishing Phase',
      },
    ],
    permissions: {
      viewProgress: true,
      approveStages: true,
      managePayments: true,
      changeRequests: true,
      messageContractor: true,
      manageShareLinks: true,
      invitePeople: false,
      maxEscrowLimit: 25,
      maxChangeLimit: 10,
    },
  },
  {
    id: 'rep-amina',
    name: 'Arc. Amina Yusuf',
    title: 'Resident Project Architect & Design Lead',
    discipline: 'Architecture',
    location: 'Ikoyi, Lagos',
    state: 'Lagos',
    stagesVerifiedCount: 18,
    licenseNumber: 'NIA #AR-1092 / ARCON Registered',
    isVerified: true,
    isFavorite: true,
    isFeatured: false,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
    email: 'amina.yusuf@archstudio.ng',
    phone: '+234 802 334 1180',
    status: 'Active',
    mandateSummary:
      'Retained for architectural fidelity audits, facade alignment, premium finishing quality surveillance, and acoustic insulation compliance across residential developments.',
    assignedProjects: [
      {
        id: 'proj-banana',
        title: 'Banana Island Horizon Penthouse',
        roleOnProject: 'Lead Interior & Facade Architect',
        progressPercent: 88,
        status: 'Finishing Phase',
      },
      {
        id: 'proj-lekki',
        title: 'Lekki Phase 1 Luxury Villa',
        roleOnProject: 'Resident Design Architect',
        progressPercent: 68,
        status: 'Active Construction',
      },
    ],
    permissions: {
      viewProgress: true,
      approveStages: true,
      managePayments: false,
      changeRequests: true,
      messageContractor: true,
      manageShareLinks: true,
      invitePeople: false,
    },
  },
  {
    id: 'rep-oladipo',
    name: 'QS Femi Oladipo',
    title: 'Senior Chartered Quantity Surveyor',
    discipline: 'Quantity Surveying',
    location: 'Central Business District, Abuja',
    state: 'Abuja FCT',
    stagesVerifiedCount: 26,
    licenseNumber: 'NIQS #QS-3391 / QSRBN Certified',
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face',
    email: 'femi.oladipo@costmatrix.ng',
    phone: '+234 802 889 0041',
    status: 'Active',
    mandateSummary:
      'Direct commercial oversight representative responsible for BOQ line-item audit, materials gate pass verification, invoice cross-referencing, and signing off escrow payment releases.',
    assignedProjects: [
      {
        id: 'proj-enclave',
        title: 'The Enclave Waterfront Resort',
        roleOnProject: 'Commercial & Cost Auditor',
        progressPercent: 42,
        status: 'Piling & Deck Phase',
      },
      {
        id: 'proj-guzape',
        title: 'Guzape Hills Residence',
        roleOnProject: 'Cost Consultant',
        progressPercent: 55,
        status: 'Superstructure Phase',
      },
    ],
    permissions: {
      viewProgress: true,
      approveStages: true,
      managePayments: true,
      changeRequests: true,
      messageContractor: true,
      manageShareLinks: false,
      invitePeople: false,
      maxEscrowLimit: 50,
      maxChangeLimit: 20,
    },
  },
  {
    id: 'rep-balogun',
    name: 'Mr. Olumide Balogun',
    title: 'Owner Family Representative & Proxy',
    discipline: 'Owner Proxy',
    location: 'Victoria Island, Lagos',
    state: 'Lagos',
    stagesVerifiedCount: 12,
    licenseNumber: 'Verified Identity (NIN #491028)',
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face',
    email: 'olumide.balogun@familyoffice.ng',
    phone: '+234 803 771 9022',
    status: 'Active',
    mandateSummary:
      'Authorized family proxy with power-of-attorney oversight on milestone progression, contractor physical walk-throughs, site security coordination, and owner representation.',
    assignedProjects: [
      {
        id: 'proj-lekki',
        title: 'Lekki Phase 1 Luxury Villa',
        roleOnProject: 'Family Representative',
        progressPercent: 68,
        status: 'Active Construction',
      },
      {
        id: 'proj-banana',
        title: 'Banana Island Horizon Penthouse',
        roleOnProject: 'Family Proxy',
        progressPercent: 88,
        status: 'Finishing Phase',
      },
    ],
    permissions: {
      viewProgress: true,
      approveStages: true,
      managePayments: false,
      changeRequests: false,
      messageContractor: true,
      manageShareLinks: true,
      invitePeople: true,
    },
  },
  {
    id: 'rep-uche',
    name: 'Engr. Emeka Uche',
    title: 'Mechanical & Electrical Systems Specialist',
    discipline: 'MEP Engineering',
    location: 'Central Business District, Abuja',
    state: 'Abuja FCT',
    stagesVerifiedCount: 15,
    licenseNumber: 'COREN #R.51022 / IEEE Member',
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face',
    email: 'emeka.uche@powerline-mep.ng',
    phone: '+234 805 119 4432',
    status: 'Active',
    mandateSummary:
      'Specialist consultant overseeing central HVAC chilled water piping, earthing resistance tests, diesel generator auto-transfer switches, and fire suppression compliance.',
    assignedProjects: [
      {
        id: 'proj-guzape',
        title: 'Guzape Hills Residence',
        roleOnProject: 'MEP Quality Inspector',
        progressPercent: 55,
        status: 'Superstructure Phase',
      },
    ],
    permissions: {
      viewProgress: true,
      approveStages: true,
      managePayments: false,
      changeRequests: true,
      messageContractor: true,
      manageShareLinks: false,
      invitePeople: false,
    },
  },
];

export interface OwnerMobileCompanyItem {
  id: string;
  name: string;
  tagline: string;
  category:
    | 'General Contractor'
    | 'Structural & Civil'
    | 'MEP Engineering'
    | 'Architecture'
    | 'Marine & Geotech';
  location: string;
  state: string;
  rating: number;
  reviewsCount: number;
  completedProjectsCount: number;
  escrowDelivered: string;
  reliabilityRate: number;
  licenseNumber: string;
  isVerified: boolean;
  isFavorite?: boolean;
  isFeatured?: boolean;
  logoBgHex: string;
  logoInitials: string;
  leadDirector: {
    name: string;
    role: string;
    avatar: string;
  };
  specialties: string[];
  recentProjects: {
    title: string;
    category: string;
    escrowAmount: string;
    year: string;
  }[];
}

export interface OwnerMobileProjectBrief {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  category: string;
  estimatedBudget: string;
  location: string;
  status:
    | 'Under Contractor Review'
    | 'Drafting Milestone Plan'
    | 'Proposal Ready'
    | 'Plan Accepted & Active'
    | 'Revisions Requested';
  dateSubmitted: string;
  description: string;
}

export interface OwnerMobileIncomingCompanyRequest {
  id: string;
  companyId: string;
  companyName: string;
  directorName: string;
  title: string;
  category: string;
  location: string;
  budget: string;
  notes: string;
  ownerIdentifier: string;
  status: 'Pending Owner Review' | 'Accepted' | 'Declined';
}

export const DEMO_OWNER_COMPANIES: OwnerMobileCompanyItem[] = [
  {
    id: 'comp-julius',
    name: 'Julius B. Consortium',
    tagline: 'Turnkey Commercial & Premium Residential Infrastructure',
    category: 'General Contractor',
    location: 'Victoria Island, Lagos',
    state: 'Lagos',
    rating: 4.9,
    reviewsCount: 38,
    completedProjectsCount: 28,
    escrowDelivered: '₦4.2B',
    reliabilityRate: 99.8,
    licenseNumber: 'COREN #RC-48201 / FMWH Category A',
    isVerified: true,
    isFavorite: true,
    isFeatured: true,
    logoBgHex: '#EF5F18',
    logoInitials: 'JB',
    leadDirector: {
      name: 'Engr. Chidi Okafor',
      role: 'Managing Director & Registered Civil Lead',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'Post-Tensioned Slabs',
      'High-End Residential',
      'Sub-surface Drainage',
      'Full MEP Integration',
    ],
    recentProjects: [
      {
        title: 'Lekki Phase 1 Luxury Villa',
        category: 'Residential',
        escrowAmount: '₦145.0M',
        year: '2026',
      },
      {
        title: 'Kolawole Commercial Tower',
        category: 'Commercial',
        escrowAmount: '₦850.0M',
        year: '2025',
      },
    ],
  },
  {
    id: 'comp-crane',
    name: 'Crane & Stone Structural',
    tagline: 'Marine Concrete, Deep Piling & Coastal Heavy Engineering',
    category: 'Marine & Geotech',
    location: 'Epe Waterfront Corridor, Lagos',
    state: 'Lagos',
    rating: 4.9,
    reviewsCount: 24,
    completedProjectsCount: 16,
    escrowDelivered: '₦1.8B',
    reliabilityRate: 100.0,
    licenseNumber: 'COREN #RC-39144 / NIQS Certified',
    isVerified: true,
    isFavorite: false,
    logoBgHex: '#261A66',
    logoInitials: 'CS',
    leadDirector: {
      name: 'Engr. Folake Ade',
      role: 'Chief Marine Geotechnical Director',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'Driven Piles',
      'Bored Secant Piles',
      'Sheet Piling',
      'Marine Retaining Walls',
    ],
    recentProjects: [
      {
        title: 'The Enclave Waterfront Resort',
        category: 'Waterfront',
        escrowAmount: '₦82.5M',
        year: '2026',
      },
      {
        title: 'Atlantic Jetty Slipway',
        category: 'Marine',
        escrowAmount: '₦320.0M',
        year: '2025',
      },
    ],
  },
  {
    id: 'comp-solidground',
    name: 'SolidGround Engineering',
    tagline: 'Structural Steelwork, Long-Span Roof Trusses & Pre-cast',
    category: 'Structural & Civil',
    location: 'Central Business District, Abuja',
    state: 'Abuja FCT',
    rating: 4.8,
    reviewsCount: 19,
    completedProjectsCount: 14,
    escrowDelivered: '₦950M',
    reliabilityRate: 99.2,
    licenseNumber: 'COREN #RC-51022 / NSE Fellow',
    isVerified: true,
    isFavorite: false,
    logoBgHex: '#047857',
    logoInitials: 'SG',
    leadDirector: {
      name: 'Arc. Bello Kassim',
      role: 'Lead Structural Representative',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'Galvanized Steel Trusses',
      'Pre-stressed Concrete',
      'Seismic Load Balancing',
    ],
    recentProjects: [
      {
        title: 'Guzape Hills Residence',
        category: 'Residential',
        escrowAmount: '₦210.0M',
        year: '2026',
      },
      {
        title: 'Maitama Logistics Hub',
        category: 'Industrial',
        escrowAmount: '₦410.0M',
        year: '2025',
      },
    ],
  },
  {
    id: 'comp-cappa',
    name: "Cappa & D'Alberto",
    tagline: 'High-Rise Skyscraper Core Construction & Urban Landmarks',
    category: 'General Contractor',
    location: 'Marina District, Eko Atlantic City',
    state: 'Lagos',
    rating: 5.0,
    reviewsCount: 52,
    completedProjectsCount: 34,
    escrowDelivered: '₦5.1B',
    reliabilityRate: 99.9,
    licenseNumber: 'COREN #RC-62055 / International Tier 1',
    isVerified: true,
    isFavorite: true,
    logoBgHex: '#1E3A8A',
    logoInitials: 'CD',
    leadDirector: {
      name: 'Engr. Tunde Coker',
      role: 'High-Rise Operations Executive',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'Hydraulic Slip-Forming',
      '30+ Storey Towers',
      'Post-Tension Slabs',
      'Wind Load Telemetry',
    ],
    recentProjects: [
      {
        title: 'Eko Atlantic Sky Tower',
        category: 'Commercial',
        escrowAmount: '₦450.0M',
        year: '2026',
      },
      {
        title: 'Lighthouse Marina Complex',
        category: 'Commercial',
        escrowAmount: '₦1.2B',
        year: '2024',
      },
    ],
  },
  {
    id: 'comp-hitech',
    name: 'Hitech Construction Group',
    tagline: 'Waterfront Shore Protection, Highways & Island Foundations',
    category: 'General Contractor',
    location: 'Zone C, Banana Island, Ikoyi',
    state: 'Lagos',
    rating: 4.9,
    reviewsCount: 31,
    completedProjectsCount: 22,
    escrowDelivered: '₦3.4B',
    reliabilityRate: 99.5,
    licenseNumber: 'COREN #RC-73119 / Lagos LASPPPA Verified',
    isVerified: true,
    isFavorite: false,
    logoBgHex: '#0F172A',
    logoInitials: 'HT',
    leadDirector: {
      name: 'Engr. Emeka Obi',
      role: 'Island Infrastructure Lead',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'Cantilever Roof Decks',
      'Ponding Waterproofing',
      'Caisson Foundations',
    ],
    recentProjects: [
      {
        title: 'Banana Island Horizon Penthouse',
        category: 'Residential',
        escrowAmount: '₦310.0M',
        year: '2026',
      },
      {
        title: 'Parkview Lagoon Revetment',
        category: 'Marine',
        escrowAmount: '₦580.0M',
        year: '2025',
      },
    ],
  },
  {
    id: 'comp-primeform',
    name: 'PrimeForm Architects',
    tagline: 'Bespoke Contemporary Architecture & Tropical Energy Design',
    category: 'Architecture',
    location: 'Maitama District, Abuja',
    state: 'Abuja FCT',
    rating: 4.9,
    reviewsCount: 28,
    completedProjectsCount: 19,
    escrowDelivered: '₦1.2B',
    reliabilityRate: 99.4,
    licenseNumber: 'NIA #AR-1092 / ARCON Registered',
    isVerified: true,
    isFavorite: false,
    logoBgHex: '#D84C0B',
    logoInitials: 'PF',
    leadDirector: {
      name: 'Arc. Zainab Aliyu',
      role: 'Principal Design Partner',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'BIM 3D Modeling',
      'Passive Cooling Design',
      'Cantilever Balconies',
      'Interior Architecture',
    ],
    recentProjects: [
      {
        title: 'Asokoro Sunset Villa',
        category: 'Residential',
        escrowAmount: '₦180.0M',
        year: '2025',
      },
      {
        title: 'Wuse Innovation Center',
        category: 'Commercial',
        escrowAmount: '₦390.0M',
        year: '2025',
      },
    ],
  },
  {
    id: 'comp-hydratech',
    name: 'HydraTech MEP Solutions',
    tagline: 'Industrial HVAC, Chiller Loops, Sub-stations & Clean Power',
    category: 'MEP Engineering',
    location: 'Ikeja Industrial Estate, Lagos',
    state: 'Lagos',
    rating: 4.8,
    reviewsCount: 17,
    completedProjectsCount: 12,
    escrowDelivered: '₦780M',
    reliabilityRate: 98.9,
    licenseNumber: 'COREN #RC-28401 / IEEE Member',
    isVerified: true,
    isFavorite: false,
    logoBgHex: '#115E59',
    logoInitials: 'HM',
    leadDirector: {
      name: 'Engr. Amina Lawal',
      role: 'Lead Mechanical & Electrical Partner',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'VRF Chiller Systems',
      'Solar Hybrid Microgrids',
      'Core Elevator Conduits',
      'Fire Suppression',
    ],
    recentProjects: [
      {
        title: 'Maryland Medical Facility MEP',
        category: 'Healthcare',
        escrowAmount: '₦260.0M',
        year: '2025',
      },
      {
        title: 'Lekki Villa Smart Automation',
        category: 'Residential',
        escrowAmount: '₦95.0M',
        year: '2025',
      },
    ],
  },
  {
    id: 'comp-coastline',
    name: 'CoastLine Geotechnics',
    tagline: 'Borehole Coring, Bathymetric Sonar & Foundation Settlement',
    category: 'Marine & Geotech',
    location: 'Trans-Amadi Industrial Layout, Port Harcourt',
    state: 'Rivers / PH',
    rating: 4.7,
    reviewsCount: 14,
    completedProjectsCount: 11,
    escrowDelivered: '₦620M',
    reliabilityRate: 99.0,
    licenseNumber: 'COREN #RC-19402 / NMGS Certified',
    isVerified: true,
    isFavorite: false,
    logoBgHex: '#164E63',
    logoInitials: 'CG',
    leadDirector: {
      name: 'Joshua Clarkson',
      role: 'Lead Hydrographic Surveyor',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    },
    specialties: [
      'Soil Mechanics Lab',
      'Sonar Sounding',
      'Settlement Monitoring',
      'Permeability Profiling',
    ],
    recentProjects: [
      {
        title: 'Bonny Island Terminal Sub-base',
        category: 'Industrial',
        escrowAmount: '₦240.0M',
        year: '2025',
      },
      {
        title: 'Epe Breakwater Bathymetry',
        category: 'Marine',
        escrowAmount: '₦78.0M',
        year: '2025',
      },
    ],
  },
];

export const DEMO_OWNER_PROJECT_BRIEFS: OwnerMobileProjectBrief[] = [
  {
    id: 'brf-101',
    companyId: 'comp-solidground',
    companyName: 'SolidGround Engineering',
    title: 'Guzape 5-Bed Smart Duplex Plan',
    category: 'Residential',
    estimatedBudget: '₦100M - ₦250M',
    location: 'Guzape District, Abuja',
    status: 'Proposal Ready',
    dateSubmitted: 'Oct 12, 2026',
    description:
      '8-stage turnkey milestone plan with structural steel roof trusses and smart home MEP conduit rough-in.',
  },
  {
    id: 'brf-102',
    companyId: 'comp-crane',
    companyName: 'Crane & Stone Structural',
    title: 'Ikoyi Lagoon Jetty & Retaining Wall',
    category: 'Marine & Waterfront',
    estimatedBudget: '₦250M - ₦500M',
    location: 'Bourdillon Creek, Ikoyi',
    status: 'Under Contractor Review',
    dateSubmitted: 'Yesterday',
    description:
      'Sheet piling and marine-grade concrete retaining wall along 45m waterfront boundary.',
  },
];

export const DEMO_OWNER_INCOMING_REQUESTS: OwnerMobileIncomingCompanyRequest[] = [
  {
    id: 'REQ-4810',
    companyId: 'comp-julius',
    companyName: 'Julius B. Consortium',
    directorName: 'Engr. Chidi Okafor',
    title: 'Lekki Phase 1 Annex Guest Chalet',
    category: 'Residential',
    location: 'Plot 14, Admiralty Way, Lekki',
    budget: '₦68,000,000',
    notes:
      'Turnkey 2-bedroom detached guest chalet matching existing Lekki Phase 1 Villa architectural finish.',
    ownerIdentifier: 'owner@vantaged.ng',
    status: 'Pending Owner Review',
  },
];

export interface OwnerMobileInspectorItem {
  id: string;
  name: string;
  title: string;
  discipline:
    | 'Structural & Civil'
    | 'MEP & Electrical'
    | 'Quantity Surveying'
    | 'Waterproofing & Roofing';
  licenseNumber: string;
  location: string;
  state: string;
  rating: number;
  auditsCompleted: number;
  perVisitFee: number;
  reliabilityRate: number;
  avatar: string;
  isVerified: boolean;
  isFavorite?: boolean;
  isFeatured?: boolean;
  specialties: string[];
  recentAudits: {
    title: string;
    project: string;
    stage: string;
    outcome: string;
    date: string;
  }[];
}

export interface OwnerMobileInspectionTicket {
  id: string;
  projectTitle: string;
  stageTitle: string;
  fee: number;
  requestedAt: string;
  status: 'Broadcasting' | 'Accepted' | 'Completed';
  inspectorId?: string;
  inspectorName?: string;
  inspectorLicense?: string;
  inspectorAvatar?: string;
  scheduledTime?: string;
}

export const DEMO_OWNER_INSPECTORS: OwnerMobileInspectorItem[] = [
  {
    id: 'insp-emeka',
    name: 'Engr. Emeka Okonkwo, FNSE',
    title: 'Chartered Principal Structural Engineer',
    discipline: 'Structural & Civil',
    licenseNumber: 'COREN #RC-48201 / NSE Fellow',
    location: 'Victoria Island & Lekki Phase 1, Lagos',
    state: 'Lagos',
    rating: 4.95,
    auditsCompleted: 42,
    perVisitFee: 45000,
    reliabilityRate: 99.4,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isFeatured: true,
    isFavorite: true,
    specialties: [
      'Post-Tensioned Slabs',
      'Column Reinforcement',
      'Concrete Core Ultrasonic',
      'Rebar Tensile Testing',
    ],
    recentAudits: [
      {
        title: 'Suspended Slab Integrity Sign-off',
        project: 'Lekki Phase 1 Luxury Villa',
        stage: 'Stage 3: First Floor Slab',
        outcome: 'Passed with zero defect snags',
        date: 'Oct 2026',
      },
      {
        title: 'Retaining Wall Footing Reinforcement',
        project: 'Banana Island Horizon Penthouse',
        stage: 'Stage 2: Foundation & Ground Floor',
        outcome: 'Approved after tie wire re-spacing',
        date: 'Sep 2026',
      },
    ],
  },
  {
    id: 'insp-folake',
    name: 'Engr. Folake Adeleke',
    title: 'Lead MEP & Electrical Compliance Auditor',
    discipline: 'MEP & Electrical',
    licenseNumber: 'COREN #RC-52914 / IEEE Lead',
    location: 'Ikeja GRA & Maryland, Lagos',
    state: 'Lagos',
    rating: 4.9,
    auditsCompleted: 36,
    perVisitFee: 40000,
    reliabilityRate: 98.8,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isFavorite: false,
    specialties: [
      'Megger Insulation Testing',
      'VRF Ducted HVAC Balancing',
      'Fire Suppression Loops',
      '3-Phase Balancing',
    ],
    recentAudits: [
      {
        title: '3-Phase Power Distribution Sign-off',
        project: 'Maryland Medical Facility',
        stage: 'Stage 4: MEP Conduits',
        outcome: 'Certified 100% compliant with IEEE code',
        date: 'Sep 2026',
      },
    ],
  },
  {
    id: 'insp-bello',
    name: 'QS Aminu Bello, FNIQS',
    title: 'Registered Principal Quantity Surveyor',
    discipline: 'Quantity Surveying',
    licenseNumber: 'NIQS #QS-10482 / RQS Fellow',
    location: 'Maitama & Wuse 2, Abuja',
    state: 'Abuja FCT',
    rating: 4.88,
    auditsCompleted: 29,
    perVisitFee: 50000,
    reliabilityRate: 98.2,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isFavorite: false,
    specialties: [
      'BOQ Physical Verification',
      'Materials Ledger Cross-Audit',
      'Change Order Valuation',
      'Milestone Valuation',
    ],
    recentAudits: [
      {
        title: 'Roof Truss Galvanized Steelwork Audit',
        project: 'Guzape Hills Residence',
        stage: 'Stage 4: Structural Steelwork',
        outcome: 'Overbilling snag rectified (-₦2.4M)',
        date: 'Aug 2026',
      },
    ],
  },
  {
    id: 'insp-chidinma',
    name: 'Engr. Chidinma Eze',
    title: 'Coastal Waterproofing & Sub-surface Auditor',
    discipline: 'Waterproofing & Roofing',
    licenseNumber: 'COREN #RC-61102 / NBRRI Lead',
    location: 'Lekki Peninsula & Ajah, Lagos',
    state: 'Lagos',
    rating: 4.92,
    auditsCompleted: 31,
    perVisitFee: 45000,
    reliabilityRate: 99.1,
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isFavorite: false,
    specialties: [
      '48-Hour Flood Water Testing',
      'SBS Bituminous Membrane Audit',
      'Hydrostatic Waterstop Bar',
      'Basement Tanking',
    ],
    recentAudits: [
      {
        title: 'Roof Deck 48-Hour Ponding Audit',
        project: 'The Enclave Waterfront Resort',
        stage: 'Stage 5: Roof Covering',
        outcome: 'Passed flood test with zero seepage',
        date: 'Oct 2026',
      },
    ],
  },
  {
    id: 'insp-tari',
    name: 'Engr. Tari Briggs',
    title: 'Piling, Deep Marine & Geotech Auditor',
    discipline: 'Structural & Civil',
    licenseNumber: 'COREN #RC-44180 / NMGS Certified',
    location: 'Trans-Amadi & Peter Odili, Port Harcourt',
    state: 'Rivers / PH',
    rating: 4.85,
    auditsCompleted: 24,
    perVisitFee: 55000,
    reliabilityRate: 97.5,
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isFavorite: false,
    specialties: [
      'Bored Secant Pile Testing',
      'Dynamic Pile Integrity (PIT)',
      'Soil Compaction Proctors',
      'Settlement Telemetry',
    ],
    recentAudits: [
      {
        title: 'Deep Piling Ultrasonic Call',
        project: 'Bonny Terminal Sub-base',
        stage: 'Stage 1: Underground Piling',
        outcome: 'Load capacity certified at 350kN',
        date: 'Jul 2026',
      },
    ],
  },
  {
    id: 'insp-kazeem',
    name: 'Engr. Kazeem Balogun',
    title: 'Civil Materials & Rebar Testing Auditor',
    discipline: 'Structural & Civil',
    licenseNumber: 'COREN #RC-57881 / NIS Lead',
    location: 'Bodija & Oluyole, Ibadan',
    state: 'Oyo',
    rating: 4.82,
    auditsCompleted: 19,
    perVisitFee: 35000,
    reliabilityRate: 96.8,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isFavorite: false,
    specialties: [
      'Concrete Cube Crush Testing',
      'Aggregate Sieve Analysis',
      'Mortar Mix Ratios',
      'Yield Strength Verification',
    ],
    recentAudits: [
      {
        title: 'Grade 30 Concrete Cube Crush Verification',
        project: 'Oluyole Commercial Hub',
        stage: 'Stage 2: Ground Floor Casting',
        outcome: 'Met 32.5 MPa requirement at 28 days',
        date: 'Sep 2026',
      },
    ],
  },
];

export const DEMO_OWNER_INSPECTION_TICKETS: OwnerMobileInspectionTicket[] = [
  {
    id: 'TICK-2026-081',
    projectTitle: 'Lekki Phase 1 Luxury Villa',
    stageTitle: 'Stage 3: First Floor Slab & Columns',
    fee: 45000,
    requestedAt: 'Today, 10:15 AM',
    status: 'Accepted',
    inspectorId: 'insp-emeka',
    inspectorName: 'Engr. Emeka Okonkwo, FNSE',
    inspectorLicense: 'COREN #RC-48201 / NSE Fellow',
    inspectorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    scheduledTime: 'Tomorrow, 10:30 AM',
  },
  {
    id: 'TICK-2026-079',
    projectTitle: 'The Enclave Waterfront Resort',
    stageTitle: 'Stage 5: Roof Deck Ponding Flood Audit',
    fee: 45000,
    requestedAt: 'Yesterday, 3:45 PM',
    status: 'Accepted',
    inspectorId: 'insp-chidinma',
    inspectorName: 'Engr. Chidinma Eze',
    inspectorLicense: 'COREN #RC-61102 / NBRRI Lead',
    inspectorAvatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    scheduledTime: 'Friday, 2:00 PM',
  },
];
