"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { VantagedSelect } from "../components/VantagedSelect";

// ── Crisp High-Precision SVG Icons ──
function IconStar({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconBolt({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconShieldCheck({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconHeart({ className = "w-4 h-4", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function IconPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconFilter({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconClock({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheck({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronDown({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconClose({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconArrowLeft({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconRadar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.07 4.93a10 10 0 0 0-14.14 0" />
      <path d="M16.24 7.76a6 6 0 0 0-8.48 0" />
      <path d="M13.41 10.59a2 2 0 0 0-2.82 0" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export interface InspectorCardItem {
  id: string;
  name: string;
  title: string;
  discipline: "Structural & Civil" | "MEP & Electrical" | "Quantity Surveying" | "Waterproofing & Roofing";
  licenseNumber: string;
  location: string;
  state: string;
  rating: number;
  auditsCompleted: number;
  perVisitFee: number;
  reliabilityRate: number; // e.g. 99.4%
  avatar: string;
  logoBg: string;
  logoColor: string;
  logoInitials: string;
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

export interface InspectionTicket {
  id: string;
  projectTitle: string;
  stageTitle: string;
  fee: number;
  requestedAt: string;
  status: "Broadcasting" | "Accepted" | "Completed";
  inspectorId?: string;
  inspectorName?: string;
  inspectorLicense?: string;
  inspectorAvatar?: string;
  scheduledTime?: string;
}

const INITIAL_INSPECTORS: InspectorCardItem[] = [
  {
    id: "insp-emeka",
    name: "Engr. Emeka Okonkwo, FNSE",
    title: "Chartered Principal Structural Engineer",
    discipline: "Structural & Civil",
    licenseNumber: "COREN #RC-48201 / NSE Fellow",
    location: "Victoria Island & Lekki Phase 1, Lagos",
    state: "Lagos",
    rating: 4.95,
    auditsCompleted: 42,
    perVisitFee: 45000,
    reliabilityRate: 99.4,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    logoBg: "bg-[var(--vt-color-orange-500,#EF5F18)]",
    logoColor: "text-white",
    logoInitials: "EO",
    isVerified: true,
    isFeatured: true,
    isFavorite: true,
    specialties: ["Post-Tensioned Slabs", "Column Reinforcement", "Concrete Core Ultrasonic", "Rebar Tensile Testing"],
    recentAudits: [
      {
        title: "Suspended Slab Integrity Sign-off",
        project: "Lekki Phase 1 Luxury Villa",
        stage: "Stage 3: First Floor Slab",
        outcome: "Passed with zero defect snags",
        date: "Oct 2026",
      },
      {
        title: "Retaining Wall Footing Reinforcement",
        project: "Banana Island Horizon Penthouse",
        stage: "Stage 2: Foundation & Ground Floor",
        outcome: "Approved after tie wire re-spacing",
        date: "Sep 2026",
      },
    ],
  },
  {
    id: "insp-folake",
    name: "Engr. Folake Adeleke",
    title: "Lead MEP & Electrical Compliance Auditor",
    discipline: "MEP & Electrical",
    licenseNumber: "COREN #RC-52914 / IEEE Lead",
    location: "Ikeja GRA & Maryland, Lagos",
    state: "Lagos",
    rating: 4.9,
    auditsCompleted: 36,
    perVisitFee: 40000,
    reliabilityRate: 98.8,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    logoBg: "bg-[var(--vt-color-indigo-900,#261A66)]",
    logoColor: "text-white",
    logoInitials: "FA",
    isVerified: true,
    isFavorite: false,
    specialties: ["Megger Insulation Testing", "VRF Ducted HVAC Balancing", "Fire Suppression Loops", "3-Phase Balancing"],
    recentAudits: [
      {
        title: "3-Phase Power Distribution Sign-off",
        project: "Maryland Medical Facility",
        stage: "Stage 4: MEP Conduits",
        outcome: "Certified 100% compliant with IEEE code",
        date: "Sep 2026",
      },
    ],
  },
  {
    id: "insp-bello",
    name: "QS Aminu Bello, FNIQS",
    title: "Registered Principal Quantity Surveyor",
    discipline: "Quantity Surveying",
    licenseNumber: "NIQS #QS-10482 / RQS Fellow",
    location: "Maitama & Wuse 2, Abuja",
    state: "Abuja FCT",
    rating: 4.88,
    auditsCompleted: 29,
    perVisitFee: 50000,
    reliabilityRate: 98.2,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    logoBg: "bg-emerald-700",
    logoColor: "text-white",
    logoInitials: "AB",
    isVerified: true,
    isFavorite: false,
    specialties: ["BOQ Physical Verification", "Materials Ledger Cross-Audit", "Change Order Valuation", "Milestone Valuation"],
    recentAudits: [
      {
        title: "Roof Truss Galvanized Steelwork Audit",
        project: "Guzape Hills Residence",
        stage: "Stage 4: Structural Steelwork",
        outcome: "Overbilling snag rectified (-₦2.4M)",
        date: "Aug 2026",
      },
    ],
  },
  {
    id: "insp-chidinma",
    name: "Engr. Chidinma Eze",
    title: "Coastal Waterproofing & Sub-surface Auditor",
    discipline: "Waterproofing & Roofing",
    licenseNumber: "COREN #RC-61102 / NBRRI Lead",
    location: "Lekki Peninsula & Ajah, Lagos",
    state: "Lagos",
    rating: 4.92,
    auditsCompleted: 31,
    perVisitFee: 45000,
    reliabilityRate: 99.1,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    logoBg: "bg-[var(--vt-color-orange-600,#D84C0B)]",
    logoColor: "text-white",
    logoInitials: "CE",
    isVerified: true,
    isFavorite: false,
    specialties: ["48-Hour Flood Water Testing", "SBS Bituminous Membrane Audit", "Hydrostatic Waterstop Bar", "Basement Tanking"],
    recentAudits: [
      {
        title: "Roof Deck 48-Hour Ponding Audit",
        project: "The Enclave Waterfront Resort",
        stage: "Stage 5: Roof Covering",
        outcome: "Passed flood test with zero seepage",
        date: "Oct 2026",
      },
    ],
  },
  {
    id: "insp-tari",
    name: "Engr. Tari Briggs",
    title: "Piling, Deep Marine & Geotech Auditor",
    discipline: "Structural & Civil",
    licenseNumber: "COREN #RC-44180 / NMGS Certified",
    location: "Trans-Amadi & Peter Odili, Port Harcourt",
    state: "Rivers / PH",
    rating: 4.85,
    auditsCompleted: 24,
    perVisitFee: 55000,
    reliabilityRate: 97.5,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    logoBg: "bg-teal-800",
    logoColor: "text-white",
    logoInitials: "TB",
    isVerified: true,
    isFavorite: false,
    specialties: ["Bored Secant Pile Testing", "Dynamic Pile Integrity (PIT)", "Soil Compaction Proctors", "Settlement Telemetry"],
    recentAudits: [
      {
        title: "Deep Piling Ultrasonic Call",
        project: "Bonny Terminal Sub-base",
        stage: "Stage 1: Underground Piling",
        outcome: "Load capacity certified at 350kN",
        date: "Jul 2026",
      },
    ],
  },
  {
    id: "insp-kazeem",
    name: "Engr. Kazeem Balogun",
    title: "Civil Materials & Rebar Testing Auditor",
    discipline: "Structural & Civil",
    licenseNumber: "COREN #RC-57881 / NIS Lead",
    location: "Bodija & Oluyole, Ibadan",
    state: "Oyo",
    rating: 4.82,
    auditsCompleted: 19,
    perVisitFee: 35000,
    reliabilityRate: 96.8,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    logoBg: "bg-slate-900",
    logoColor: "text-white",
    logoInitials: "KB",
    isVerified: true,
    isFavorite: false,
    specialties: ["Concrete Cube Crush Testing", "Aggregate Sieve Analysis", "Mortar Mix Ratios", "Yield Strength Verification"],
    recentAudits: [
      {
        title: "Grade 30 Concrete Cube Crush Verification",
        project: "Oluyole Commercial Hub",
        stage: "Stage 2: Ground Floor Casting",
        outcome: "Met 32.5 MPa requirement at 28 days",
        date: "Sep 2026",
      },
    ],
  },
];

const DEFAULT_TICKETS: InspectionTicket[] = [
  {
    id: "TICK-2026-081",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    stageTitle: "Stage 3: First Floor Slab & Columns",
    fee: 45000,
    requestedAt: "Today, 10:15 AM",
    status: "Accepted",
    inspectorId: "insp-emeka",
    inspectorName: "Engr. Emeka Okonkwo, FNSE",
    inspectorLicense: "COREN #RC-48201 / NSE Fellow",
    inspectorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    scheduledTime: "Tomorrow, 10:30 AM",
  },
  {
    id: "TICK-2026-079",
    projectTitle: "The Enclave Waterfront Resort",
    stageTitle: "Stage 5: Roof Deck Ponding Flood Audit",
    fee: 45000,
    requestedAt: "Yesterday, 3:45 PM",
    status: "Accepted",
    inspectorId: "insp-chidinma",
    inspectorName: "Engr. Chidinma Eze",
    inspectorLicense: "COREN #RC-61102 / NBRRI Lead",
    inspectorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    scheduledTime: "Friday, 2:00 PM",
  },
];

export function OwnerInspectorsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("owner_inspectors_page");

  // View tab: directory vs active tickets (matching Find Companies style)
  const [activeTab, setActiveTab] = useState<"directory" | "tickets">("directory");

  // Filter states
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Inspectors state
  const [inspectors, setInspectors] = useState<InspectorCardItem[]>(INITIAL_INSPECTORS);
  const [tickets, setTickets] = useState<InspectionTicket[]>(DEFAULT_TICKETS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inspector Dossier Profile Modal (Matching Find Companies detailed modal)
  const [selectedInspector, setSelectedInspector] = useState<InspectorCardItem | null>(null);

  // Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetInspector, setTargetInspector] = useState<InspectorCardItem | null>(null);
  const [selectedProject, setSelectedProject] = useState("Lekki Phase 1 Luxury Villa");
  const [selectedStage, setSelectedStage] = useState("Stage 4: Roof Truss & Covering");

  useEffect(() => {
    try {
      const savedTickets = localStorage.getItem("vantaged_inspection_tickets");
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      }
    } catch {}
  }, []);

  const persistTickets = (next: InspectionTicket[]) => {
    setTickets(next);
    try {
      localStorage.setItem("vantaged_inspection_tickets", JSON.stringify(next));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle favorite bookmark
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInspectors((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Filter logic
  const isFilterActive = selectedDiscipline !== "All" || selectedState !== "All" || onlyVerified || onlyFavorites;

  const filteredInspectors = useMemo(() => {
    return inspectors.filter((item) => {
      if (selectedDiscipline !== "All" && item.discipline !== selectedDiscipline) return false;
      if (selectedState !== "All" && item.state !== selectedState) return false;
      if (onlyVerified && !item.isVerified) return false;
      if (onlyFavorites && !item.isFavorite) return false;
      return true;
    });
  }, [inspectors, selectedDiscipline, selectedState, onlyVerified, onlyFavorites]);

  // Request Inspection (Bolt style)
  const handleRequestInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TICK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fee = targetInspector ? targetInspector.perVisitFee : 45000;

    const newTicket: InspectionTicket = {
      id: newId,
      projectTitle: selectedProject,
      stageTitle: selectedStage,
      fee,
      requestedAt: "Just now",
      status: "Broadcasting",
      inspectorId: targetInspector?.id,
    };

    const next = [newTicket, ...tickets];
    persistTickets(next);
    setIsModalOpen(false);
    setSelectedInspector(null);
    setActiveTab("tickets");
    showToast(`Ticket ${newId} dispatched! Broadcasting to nearby COREN engineers...`);

    // Simulate Engineer Accepting the Ticket after 3.8 seconds (Bolt ride style!)
    setTimeout(() => {
      const acceptedInspector = targetInspector || INITIAL_INSPECTORS[0];
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === newId) {
            return {
              ...t,
              status: "Accepted" as const,
              inspectorId: acceptedInspector.id,
              inspectorName: acceptedInspector.name,
              inspectorLicense: acceptedInspector.licenseNumber,
              inspectorAvatar: acceptedInspector.avatar,
              scheduledTime: "Tomorrow, 10:30 AM",
            };
          }
          return t;
        })
      );
      showToast(`⚡ ${acceptedInspector.name} accepted your inspection ticket!`);
    }, 3800);
  };

  // Manual simulation for instant testing
  const handleManualAcceptTicket = (ticketId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const engineer = INITIAL_INSPECTORS[0];
    const next = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Accepted" as const,
          inspectorId: engineer.id,
          inspectorName: engineer.name,
          inspectorLicense: engineer.licenseNumber,
          inspectorAvatar: engineer.avatar,
          scheduledTime: "Tomorrow, 10:30 AM",
        };
      }
      return t;
    });
    persistTickets(next);
    showToast(`Ticket accepted by ${engineer.name}! Click card to view engineer profile.`);
  };

  const handleCancelTicket = (ticketId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = tickets.filter((t) => t.id !== ticketId);
    persistTickets(next);
    showToast("Inspection ticket cancelled.");
  };

  // Handle clicking on an active ticket card -> Opens engineer's profile dossier
  const handleTicketCardClick = (ticket: InspectionTicket) => {
    if (ticket.status === "Accepted") {
      const found =
        inspectors.find(
          (i) =>
            i.id === ticket.inspectorId ||
            (ticket.inspectorName && i.name.toLowerCase().includes(ticket.inspectorName.split(" ")[1]?.toLowerCase() || ""))
        ) || INITIAL_INSPECTORS[0];
      setSelectedInspector(found);
    } else {
      showToast(`Ticket ${ticket.id} is currently broadcasting. Click 'Simulate Acceptance' or wait for live engineer acceptance.`);
    }
  };

  const formatNaira = (amt: number) => `₦${amt.toLocaleString("en-NG")}`;

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      {/* Decorative vector background lines (matching Find Companies page) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 200 C 300 100, 600 450, 1500 100"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M-50 750 C 400 650, 800 850, 1550 650"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="1380" cy="550" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.6" />
        </svg>
      </div>

      <SidebarNav currentActiveItem="inspectors" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 pb-24 md:pb-8"
      >
        {/* Top Header Navigation Bar with Left Back Button (Matching Find Companies Page) */}
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <IconArrowLeft className="w-4 h-4" />
            </Link>
          }
        />

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── Section Header Row: Title on Left, Controls on Right (Identical to Find Companies Page) ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              {activeTab === "directory" ? "Site Inspectors" : "Active Inspection Requests"}
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium mt-0.5">
              {activeTab === "directory"
                ? "Licensed COREN and NIQS engineers available on-demand for milestone audits and defect verifications."
                : "Active site inspection tickets dispatched to certified engineers. Click any card to view engineer profile."}
            </p>
          </div>

          {/* Action Toolbar: [Inspectors | Tickets], [Filter], and [Auto-Dispatch] */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap">
            {/* View Switcher: Directory vs Active Tickets */}
            <div className="h-9 p-0.5 bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center shadow-2xs font-sans">
              <button
                type="button"
                onClick={() => setActiveTab("directory")}
                className={`h-full px-3.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "directory"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                Inspectors ({inspectors.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className={`h-full px-3.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "tickets"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                <span>Active Tickets</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeTab === "tickets"
                      ? "bg-white/25 text-white"
                      : "bg-white text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)]"
                  }`}
                >
                  {tickets.length}
                </span>
              </button>
            </div>

            {/* Filter Dropdown (matching Find Companies style) */}
            {activeTab === "directory" && (
              <div className="relative font-sans">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`h-9 px-3.5 rounded-md border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs font-sans ${
                    isFilterActive
                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-300,#FBA674)]"
                      : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                  }`}
                >
                  <IconFilter className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
                  <span>Filter</span>
                  {isFilterActive && <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />}
                  <IconChevronDown
                    className={`w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] transition-transform ${
                      isFilterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isFilterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterDropdownOpen(false)} />
                    <div className="absolute right-0 top-11 w-72 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xl p-4 z-40 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1.5">
                          Discipline
                        </label>
                        <VantagedSelect
                          value={selectedDiscipline}
                          onChange={(val) => setSelectedDiscipline(val)}
                          className="w-full h-8 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                          options={[
                            { value: "All", label: "All Disciplines" },
                            { value: "Structural & Civil", label: "Structural & Civil" },
                            { value: "MEP & Electrical", label: "MEP & Electrical" },
                            { value: "Quantity Surveying", label: "Quantity Surveying" },
                            { value: "Waterproofing & Roofing", label: "Waterproofing & Roofing" },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1.5">
                          Region / State
                        </label>
                        <VantagedSelect
                          value={selectedState}
                          onChange={(val) => setSelectedState(val)}
                          className="w-full h-8 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                          options={[
                            { value: "All", label: "All Regions" },
                            { value: "Lagos", label: "Lagos State" },
                            { value: "Abuja FCT", label: "Abuja FCT" },
                            { value: "Rivers / PH", label: "Rivers / Port Harcourt" },
                            { value: "Oyo", label: "Oyo State" },
                          ]}
                        />
                      </div>

                      <label className="flex items-center justify-between pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] cursor-pointer">
                        <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Verified Only
                        </span>
                        <input
                          type="checkbox"
                          checked={onlyVerified}
                          onChange={(e) => setOnlyVerified(e.target.checked)}
                          className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] cursor-pointer">
                        <div className="flex items-center gap-1.5">
                          <IconHeart className="w-3.5 h-3.5 text-rose-500" filled />
                          <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            Favourited Engineers Only
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={onlyFavorites}
                          onChange={(e) => setOnlyFavorites(e.target.checked)}
                          className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer rounded"
                        />
                      </label>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDiscipline("All");
                            setSelectedState("All");
                            setOnlyVerified(false);
                            setOnlyFavorites(false);
                          }}
                          className="text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-600,#D84C0B)] font-bold cursor-pointer"
                        >
                          Reset Filters
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFilterDropdownOpen(false)}
                          className="h-7 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quick 1-Click Request Nearest Inspector Button */}
            <button
              type="button"
              onClick={() => {
                setTargetInspector(null);
                setIsModalOpen(true);
              }}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <IconBolt className="w-3.5 h-3.5" />
              <span>Request Nearest Inspector</span>
            </button>
          </div>
        </section>

        {/* ── Content View ── */}
        {activeTab === "directory" ? (
          <div className="flex flex-col gap-3">
            {/* Active Filter Pill Summary */}
            {isFilterActive && (
              <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">Active filters:</span>
                {selectedDiscipline !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                    {selectedDiscipline}
                    <button type="button" onClick={() => setSelectedDiscipline("All")} className="hover:text-black">
                      <IconClose className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {selectedState !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                    {selectedState}
                    <button type="button" onClick={() => setSelectedState("All")} className="hover:text-black">
                      <IconClose className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {onlyVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] font-bold text-[11px]">
                    Verified
                    <button type="button" onClick={() => setOnlyVerified(false)} className="hover:text-black">
                      <IconClose className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {onlyFavorites && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                    <IconHeart className="w-2.5 h-2.5 text-rose-600" filled />
                    <span>Favourited</span>
                    <button type="button" onClick={() => setOnlyFavorites(false)} className="hover:text-black">
                      <IconClose className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDiscipline("All");
                    setSelectedState("All");
                    setOnlyVerified(false);
                    setOnlyFavorites(false);
                  }}
                  className="text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ── CARDS DIRECTORY GRID (Faithful 1:1 match of Find Companies card anatomy) ── */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Registered Engineers ({filteredInspectors.length})
                </span>
                <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                  Click any card to view license, bio & audit track record
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-12">
                {filteredInspectors.map((inspector) => {
                  const isFeatured = inspector.isFeatured;

                  return (
                    <div
                      key={inspector.id}
                      onClick={() => setSelectedInspector(inspector)}
                      className={`group relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                        isFeatured
                          ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-2 border-[var(--vt-color-orange-600,#D84C0B)] shadow-[0_12px_28px_rgba(239,95,24,0.22)]"
                          : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                      }`}
                    >
                      {/* Top Header of Card: Favorite Heart + Quick Request Button */}
                      <div className="flex items-center justify-between w-full mb-3">
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(inspector.id, e)}
                          title={inspector.isFavorite ? "Remove favorite" : "Bookmark engineer"}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isFeatured
                              ? "bg-white/20 text-white hover:bg-white/30"
                              : inspector.isFavorite
                              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)]"
                              : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
                          }`}
                        >
                          <IconHeart className="w-4 h-4" filled={Boolean(inspector.isFavorite)} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetInspector(inspector);
                            setIsModalOpen(true);
                          }}
                          title="Quick request inspection ticket"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold ${
                            isFeatured
                              ? "bg-white text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-white/90 shadow-2xs"
                              : "bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-2xs"
                          }`}
                        >
                          <IconPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Center Emblem / Photo & Title (Faithful match of Find Companies card layout) */}
                      <div className="flex flex-col items-center text-center my-2">
                        <div className="mb-3">
                          <img
                            src={inspector.avatar}
                            alt={inspector.name}
                            className={`w-16 h-16 rounded-2xl object-cover shadow-sm ${
                              isFeatured ? "ring-2 ring-white" : "border border-[var(--vt-color-border-default,#E2E0EC)]"
                            }`}
                          />
                        </div>

                        <h3
                          className={`text-base font-extrabold tracking-tight truncate max-w-full ${
                            isFeatured ? "text-white" : "text-[var(--vt-color-indigo-900,#261A66)]"
                          }`}
                        >
                          {inspector.name}
                        </h3>

                        <p
                          className={`text-[11.5px] font-semibold mt-1 line-clamp-1 ${
                            isFeatured ? "text-white/85" : "text-[var(--vt-color-neutral-500,#7C7894)]"
                          }`}
                        >
                          {inspector.discipline} • {inspector.location ? inspector.location.split(",")[0] : inspector.state}
                        </p>
                      </div>

                      {/* Escrow Track Record Status Line (matching Find Companies bar) */}
                      <div className="my-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={isFeatured ? "text-white/80" : "text-[var(--vt-color-neutral-500,#7C7894)]"}>
                            Audits Track Record
                          </span>
                          <span
                            className={
                              isFeatured
                                ? "text-white font-extrabold"
                                : "text-[var(--vt-color-orange-600,#D84C0B)] font-extrabold"
                            }
                          >
                            {formatNaira(inspector.perVisitFee)} / visit
                          </span>
                        </div>

                        {/* Accent Bar */}
                        <div
                          className={`w-full h-1.5 rounded-full overflow-hidden ${
                            isFeatured ? "bg-white/25" : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFeatured ? "bg-white" : "bg-[var(--vt-color-orange-500,#EF5F18)]"
                            }`}
                            style={{ width: `${inspector.reliabilityRate}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Footer Row */}
                      <div
                        className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                          isFeatured
                            ? "border-white/20 text-white"
                            : "border-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconStar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{inspector.rating}</span>
                          <span
                            className={
                              isFeatured ? "text-white/70 text-[11px]" : "text-[var(--vt-color-neutral-400,#A3A0B8)] text-[11px]"
                            }
                          >
                            ({inspector.auditsCompleted} audits)
                          </span>
                        </div>

                        <span
                          className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md ${
                            isFeatured
                              ? "bg-white/20 text-white"
                              : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                          }`}
                        >
                          {inspector.state ? inspector.state.split(" ")[0] : "Nigeria"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── ACTIVE TICKETS VIEW (Grid of Cards Matching Find Company Style) ── */
          <div className="flex flex-col gap-3 pb-12">
            {tickets.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[var(--vt-color-border-default,#E2E0EC)] p-8 text-center shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mx-auto mb-3">
                  <IconBolt className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)]">No Active Inspection Tickets</h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-sm mx-auto">
                  When you request an inspection on any milestone or defect, your live ticket will appear here with real-time status.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTargetInspector(null);
                    setIsModalOpen(true);
                  }}
                  className="mt-4 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1.5"
                >
                  <IconBolt className="w-3.5 h-3.5" />
                  <span>Request an Inspector</span>
                </button>
              </div>
            ) : (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Active Inspection Tickets ({tickets.length})
                  </span>
                  <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                    Click any card to open the assigned engineer&apos;s full credentials &amp; profile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {tickets.map((t) => {
                    const isBroadcasting = t.status === "Broadcasting";

                    return (
                      <div
                        key={t.id}
                        onClick={() => handleTicketCardClick(t)}
                        className={`group relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                          isBroadcasting
                            ? "bg-amber-50/70 border-2 border-dashed border-amber-300 hover:border-amber-400 text-[var(--vt-color-indigo-900,#261A66)]"
                            : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                        }`}
                      >
                        {/* Top Header of Ticket Card: Status Pill & Cancel Action */}
                        <div className="flex items-center justify-between w-full mb-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold flex items-center gap-1.5 ${
                              isBroadcasting
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-[var(--vt-color-green-100,#DCF4E3)] text-[var(--vt-color-green-800,#134E2C)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                            }`}
                          >
                            {isBroadcasting ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                <span>Broadcasting</span>
                              </>
                            ) : (
                              <>
                                <IconCheck className="w-3 h-3 text-[var(--vt-color-green-700,#1F6B3E)]" />
                                <span>Accepted</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleCancelTicket(t.id, e)}
                            title="Cancel inspection ticket"
                            className="w-8 h-8 rounded-full bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-rose-50 text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-rose-200 shadow-2xs"
                          >
                            <IconClose className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Center Emblem / Photo & Title */}
                        <div className="flex flex-col items-center text-center my-2">
                          <div className="mb-3">
                            {isBroadcasting ? (
                              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center relative shadow-sm border border-amber-200">
                                <span className="w-5 h-5 rounded-full bg-amber-400/50 animate-ping absolute" />
                                <IconRadar className="w-7 h-7 relative z-10 text-amber-600" />
                              </div>
                            ) : (
                              <img
                                src={t.inspectorAvatar}
                                alt={t.inspectorName || "Inspector"}
                                className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-2 ring-[var(--vt-color-green-500,#2E9E57)]/30 border border-[var(--vt-color-border-default,#E2E0EC)]"
                              />
                            )}
                          </div>

                          <h3 className="text-base font-extrabold tracking-tight truncate max-w-full text-[var(--vt-color-indigo-900,#261A66)]">
                            {isBroadcasting ? "Finding Nearby Engineer..." : t.inspectorName}
                          </h3>

                          <p className="text-[11.5px] font-semibold mt-1 line-clamp-1 text-[var(--vt-color-neutral-500,#7C7894)]">
                            {t.stageTitle}
                          </p>

                          <p className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)] truncate max-w-full mt-0.5">
                            {t.projectTitle}
                          </p>
                        </div>

                        {/* Escrow Track Record Status Line (matching Find Companies bar) */}
                        <div className="my-3 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-[var(--vt-color-neutral-500,#7C7894)]">
                              {isBroadcasting ? "Broadcasting Network" : "Escrow Safe Deposit"}
                            </span>
                            <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-extrabold">
                              {formatNaira(t.fee)}
                            </span>
                          </div>

                          {/* Accent Bar */}
                          <div className="w-full h-1.5 rounded-full overflow-hidden bg-[var(--vt-color-neutral-200,#E2E0EC)]">
                            {isBroadcasting ? (
                              <div className="h-full rounded-full bg-amber-500 animate-pulse w-3/4" />
                            ) : (
                              <div className="h-full rounded-full bg-[var(--vt-color-green-500,#2E9E57)] w-full" />
                            )}
                          </div>
                        </div>

                        {/* Bottom Footer Row */}
                        <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {isBroadcasting ? (
                            <>
                              <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                                <IconBolt className="w-3 h-3 text-amber-600" />
                                <span>Live radar</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleManualAcceptTicket(t.id, e)}
                                className="h-7 px-2.5 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1B6035)] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                                title="Simulate engineer accepting ticket"
                              >
                                <IconCheck className="w-3 h-3" />
                                <span>Accept</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--vt-color-green-800,#134E2C)]">
                                <IconClock className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#248246)] shrink-0" />
                                <span>{t.scheduledTime}</span>
                              </div>
                              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#134E2C)]">
                                Confirmed
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── INSPECTOR DOSSIER PROFILE MODAL (Opens when clicking Directory card OR Active Ticket card) ── */}
      {selectedInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
          >
            {/* Modal Header Banner */}
            <div className="p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div>
                  <img
                    src={selectedInspector.avatar}
                    alt={selectedInspector.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {selectedInspector.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium mt-0.5">
                    {selectedInspector.licenseNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInspector(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs sm:text-sm">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-center">
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Audit Fee</span>
                  <p className="text-base font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5">
                    {formatNaira(selectedInspector.perVisitFee)}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Completed</span>
                  <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {selectedInspector.auditsCompleted} Audits
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Rating</span>
                  <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    ★ {selectedInspector.rating} / 5.0
                  </p>
                </div>
              </div>

              {/* Active Ticket Notification (If currently assigned to owner) */}
              {tickets.some((t) => t.inspectorId === selectedInspector.id && t.status === "Accepted") && (
                <div className="p-3.5 bg-[var(--vt-color-green-50,#E9F6EC)] rounded-2xl border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-between text-xs text-[var(--vt-color-green-900,#113B22)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-600,#248246)] animate-pulse" />
                    <span>
                      <strong>Active Assignment:</strong> Assigned to your site audit. Scheduled for:{" "}
                      <strong>
                        {tickets.find((t) => t.inspectorId === selectedInspector.id && t.status === "Accepted")?.scheduledTime}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Inspector Overview & Specialties */}
              <div>
                <h4 className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Professional Credentials & Scope
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  {selectedInspector.title} practicing across {selectedInspector.location}. Fully licensed for site audits, defect diagnosis, independent escrow sign-offs, and compliance verification.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {selectedInspector.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#484564)] text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Past Audits Track Record */}
              <div>
                <h4 className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
                  Verified Site Audit Track Record
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedInspector.recentAudits.map((a, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">{a.title}</p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          {a.project} • {a.stage} ({a.date})
                        </p>
                      </div>
                      <span className="text-[11px] font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] px-2 py-0.5 rounded-md border border-[var(--vt-color-green-200,#A3D9B1)]">
                        {a.outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 font-sans">
              <button
                type="button"
                onClick={() => setSelectedInspector(null)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const insp = selectedInspector;
                  setSelectedInspector(null);
                  setTargetInspector(insp);
                  setIsModalOpen(true);
                }}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans active:scale-95"
              >
                <span>Dispatch Inspection Ticket</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1-Step Request / Dispatch Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans">
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {targetInspector ? `Request ${targetInspector.name}` : "Request Nearest Inspector"}
                </h3>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
                  On-demand certified site inspection ticket
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestInspection} className="p-5 flex flex-col gap-3.5 text-xs">
              <div>
                <label className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] block mb-1">
                  Project
                </label>
                <VantagedSelect
                  value={selectedProject}
                  onChange={(val) => setSelectedProject(val)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                  options={[
                    { value: "Lekki Phase 1 Luxury Villa", label: "Lekki Phase 1 Luxury Villa" },
                    { value: "Eko Atlantic Horizon Tower", label: "Eko Atlantic Horizon Tower" },
                    { value: "Guzape Hills Residence", label: "Guzape Hills Residence" },
                  ]}
                />
              </div>

              <div>
                <label className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] block mb-1">
                  Milestone Stage / Defect Snag
                </label>
                <VantagedSelect
                  value={selectedStage}
                  onChange={(val) => setSelectedStage(val)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                  options={[
                    { value: "Stage 3: First Floor Slab & Columns", label: "Stage 3: First Floor Slab & Columns" },
                    { value: "Stage 4: Roof Truss & Covering", label: "Stage 4: Roof Truss & Covering" },
                    { value: "Defect Re-Inspection: Column C4 Spalling", label: "Defect Re-Inspection: Column C4 Spalling" },
                  ]}
                />
              </div>

              <div className="p-3 bg-[var(--vt-color-orange-50,#FFF4EE)] rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between text-xs text-[var(--vt-color-orange-900,#7C2704)]">
                <div>
                  <span className="font-bold block">Escrow Protected Fee</span>
                  <span className="text-[10px] text-[var(--vt-color-orange-800,#9C3205)]">
                    Deducted from contractor if defect snag is verified
                  </span>
                </div>
                <span className="font-black text-sm text-[var(--vt-color-orange-700,#B33C08)]">
                  {formatNaira(targetInspector ? targetInspector.perVisitFee : 45000)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] font-sans">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <IconBolt className="w-3.5 h-3.5" />
                  <span>Send Ticket to Inspector</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
