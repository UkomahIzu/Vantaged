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
  { id: 'representatives', label: 'Representatives', href: '/representatives' },
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
