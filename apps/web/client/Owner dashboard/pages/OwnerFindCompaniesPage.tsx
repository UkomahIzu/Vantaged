"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";

export interface CompanyItem {
  id: string;
  name: string;
  tagline: string;
  category: "General Contractor" | "Structural & Civil" | "MEP Engineering" | "Architecture" | "Marine & Geotech";
  location: string;
  state: string;
  rating: number;
  reviewsCount: number;
  completedProjectsCount: number;
  escrowDelivered: string;
  reliabilityRate: number; // e.g. 99.4%
  licenseNumber: string;
  isVerified: boolean;
  isFavorite?: boolean;
  isFeatured?: boolean;
  logoBg: string;
  logoColor: string;
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

export interface ProjectBrief {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  category: string;
  estimatedBudget: string;
  location: string;
  status: "Under Contractor Review" | "Drafting Milestone Plan" | "Proposal Ready";
  dateSubmitted: string;
  description: string;
}

const INITIAL_COMPANIES: CompanyItem[] = [
  {
    id: "comp-julius",
    name: "Julius B. Consortium",
    tagline: "Turnkey Commercial & Premium Residential Infrastructure",
    category: "General Contractor",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    rating: 4.9,
    reviewsCount: 38,
    completedProjectsCount: 28,
    escrowDelivered: "₦4.2B",
    reliabilityRate: 99.8,
    licenseNumber: "COREN #RC-48201 / FMWH Category A",
    isVerified: true,
    isFavorite: true,
    isFeatured: true,
    logoBg: "bg-[var(--vt-color-orange-500,#EF5F18)]",
    logoColor: "text-white",
    logoInitials: "JB",
    leadDirector: {
      name: "Engr. Chidi Okafor",
      role: "Managing Director & Registered Civil Lead",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["Post-Tensioned Slabs", "High-End Residential", "Sub-surface Drainage", "Full MEP Integration"],
    recentProjects: [
      { title: "Lekki Phase 1 Luxury Villa", category: "Residential", escrowAmount: "₦145.0M", year: "2026" },
      { title: "Kolawole Commercial Tower", category: "Commercial", escrowAmount: "₦850.0M", year: "2025" },
    ],
  },
  {
    id: "comp-crane",
    name: "Crane & Stone Structural",
    tagline: "Marine Concrete, Deep Piling & Coastal Heavy Engineering",
    category: "Marine & Geotech",
    location: "Epe Waterfront Corridor, Lagos",
    state: "Lagos",
    rating: 4.9,
    reviewsCount: 24,
    completedProjectsCount: 16,
    escrowDelivered: "₦1.8B",
    reliabilityRate: 100.0,
    licenseNumber: "COREN #RC-39144 / NIQS Certified",
    isVerified: true,
    isFavorite: false,
    logoBg: "bg-[var(--vt-color-indigo-900,#261A66)]",
    logoColor: "text-white",
    logoInitials: "CS",
    leadDirector: {
      name: "Engr. Folake Ade",
      role: "Chief Marine Geotechnical Director",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["Driven Piles", "Bored Secant Piles", "Sheet Piling", "Marine Retaining Walls"],
    recentProjects: [
      { title: "The Enclave Waterfront Resort", category: "Waterfront", escrowAmount: "₦82.5M", year: "2026" },
      { title: "Atlantic Jetty Slipway", category: "Marine", escrowAmount: "₦320.0M", year: "2025" },
    ],
  },
  {
    id: "comp-solidground",
    name: "SolidGround Engineering",
    tagline: "Structural Steelwork, Long-Span Roof Trusses & Pre-cast",
    category: "Structural & Civil",
    location: "Central Business District, Abuja",
    state: "Abuja FCT",
    rating: 4.8,
    reviewsCount: 19,
    completedProjectsCount: 14,
    escrowDelivered: "₦950M",
    reliabilityRate: 99.2,
    licenseNumber: "COREN #RC-51022 / NSE Fellow",
    isVerified: true,
    isFavorite: false,
    logoBg: "bg-emerald-700",
    logoColor: "text-white",
    logoInitials: "SG",
    leadDirector: {
      name: "Arc. Bello Kassim",
      role: "Lead Structural Representative",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["Galvanized Steel Trusses", "Pre-stressed Concrete", "Seismic Load Balancing"],
    recentProjects: [
      { title: "Guzape Hills Residence", category: "Residential", escrowAmount: "₦210.0M", year: "2026" },
      { title: "Maitama Logistics Hub", category: "Industrial", escrowAmount: "₦410.0M", year: "2025" },
    ],
  },
  {
    id: "comp-cappa",
    name: "Cappa & D'Alberto",
    tagline: "High-Rise Skyscraper Core Construction & Urban Landmarks",
    category: "General Contractor",
    location: "Marina District, Eko Atlantic City",
    state: "Lagos",
    rating: 5.0,
    reviewsCount: 52,
    completedProjectsCount: 34,
    escrowDelivered: "₦5.1B",
    reliabilityRate: 99.9,
    licenseNumber: "COREN #RC-62055 / International Tier 1",
    isVerified: true,
    isFavorite: true,
    logoBg: "bg-blue-900",
    logoColor: "text-white",
    logoInitials: "CD",
    leadDirector: {
      name: "Engr. Tunde Coker",
      role: "High-Rise Operations Executive",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["Hydraulic Slip-Forming", "30+ Storey Towers", "Post-Tension Slabs", "Wind Load Telemetry"],
    recentProjects: [
      { title: "Eko Atlantic Sky Tower", category: "Commercial", escrowAmount: "₦450.0M", year: "2026" },
      { title: "Lighthouse Marina Complex", category: "Commercial", escrowAmount: "₦1.2B", year: "2024" },
    ],
  },
  {
    id: "comp-hitech",
    name: "Hitech Construction Group",
    tagline: "Waterfront Shore Protection, Highways & Island Foundations",
    category: "General Contractor",
    location: "Zone C, Banana Island, Ikoyi",
    state: "Lagos",
    rating: 4.9,
    reviewsCount: 31,
    completedProjectsCount: 22,
    escrowDelivered: "₦3.4B",
    reliabilityRate: 99.5,
    licenseNumber: "COREN #RC-73119 / Lagos LASPPPA Verified",
    isVerified: true,
    isFavorite: false,
    logoBg: "bg-slate-900",
    logoColor: "text-white",
    logoInitials: "HT",
    leadDirector: {
      name: "Engr. Emeka Obi",
      role: "Island Infrastructure Lead",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["Cantilever Roof Decks", "Ponding Waterproofing", "Caisson Foundations"],
    recentProjects: [
      { title: "Banana Island Horizon Penthouse", category: "Residential", escrowAmount: "₦310.0M", year: "2026" },
      { title: "Parkview Lagoon Revetment", category: "Marine", escrowAmount: "₦580.0M", year: "2025" },
    ],
  },
  {
    id: "comp-primeform",
    name: "PrimeForm Architects",
    tagline: "Bespoke Contemporary Architecture & Tropical Energy Design",
    category: "Architecture",
    location: "Maitama District, Abuja",
    state: "Abuja FCT",
    rating: 4.9,
    reviewsCount: 28,
    completedProjectsCount: 19,
    escrowDelivered: "₦1.2B",
    reliabilityRate: 99.4,
    licenseNumber: "NIA #AR-1092 / ARCON Registered",
    isVerified: true,
    isFavorite: false,
    logoBg: "bg-[var(--vt-color-orange-600,#D84C0B)]",
    logoColor: "text-white",
    logoInitials: "PF",
    leadDirector: {
      name: "Arc. Zainab Aliyu",
      role: "Principal Design Partner",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["BIM 3D Modeling", "Passive Cooling Design", "Cantilever Balconies", "Interior Architecture"],
    recentProjects: [
      { title: "Asokoro Sunset Villa", category: "Residential", escrowAmount: "₦180.0M", year: "2025" },
      { title: "Wuse Innovation Center", category: "Commercial", escrowAmount: "₦390.0M", year: "2025" },
    ],
  },
  {
    id: "comp-hydratech",
    name: "HydraTech MEP Solutions",
    tagline: "Industrial HVAC, Chiller Loops, Sub-stations & Clean Power",
    category: "MEP Engineering",
    location: "Ikeja Industrial Estate, Lagos",
    state: "Lagos",
    rating: 4.8,
    reviewsCount: 17,
    completedProjectsCount: 12,
    escrowDelivered: "₦780M",
    reliabilityRate: 98.9,
    licenseNumber: "COREN #RC-28401 / IEEE Member",
    isVerified: true,
    isFavorite: false,
    logoBg: "bg-teal-800",
    logoColor: "text-white",
    logoInitials: "HT",
    leadDirector: {
      name: "Engr. Amina Lawal",
      role: "Lead Mechanical & Electrical Partner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["VRF Chiller Systems", "Solar Hybrid Microgrids", "Core Elevator Conduits", "Fire Suppression"],
    recentProjects: [
      { title: "Maryland Medical Facility MEP", category: "Healthcare", escrowAmount: "₦260.0M", year: "2025" },
      { title: "Lekki Villa Smart Automation", category: "Residential", escrowAmount: "₦95.0M", year: "2025" },
    ],
  },
  {
    id: "comp-coastline",
    name: "CoastLine Geotechnics",
    tagline: "Borehole Coring, Bathymetric Sonar & Foundation Settlement",
    category: "Marine & Geotech",
    location: "Trans-Amadi Industrial Layout, Port Harcourt",
    state: "Rivers / PH",
    rating: 4.7,
    reviewsCount: 14,
    completedProjectsCount: 11,
    escrowDelivered: "₦620M",
    reliabilityRate: 99.0,
    licenseNumber: "COREN #RC-19402 / NMGS Certified",
    isVerified: true,
    isFavorite: false,
    logoBg: "bg-cyan-900",
    logoColor: "text-white",
    logoInitials: "CG",
    leadDirector: {
      name: "Joshua Clarkson",
      role: "Lead Hydrographic Surveyor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
    },
    specialties: ["Soil Mechanics Lab", "Sonar Sounding", "Settlement Monitoring", "Permeability Profiling"],
    recentProjects: [
      { title: "Bonny Island Terminal Sub-base", category: "Industrial", escrowAmount: "₦240.0M", year: "2025" },
      { title: "Epe Breakwater Bathymetry", category: "Marine", escrowAmount: "₦78.0M", year: "2025" },
    ],
  },
];

const INITIAL_BRIEFS: ProjectBrief[] = [
  {
    id: "brf-1",
    companyId: "comp-julius",
    companyName: "Julius B. Consortium",
    title: "5-Bedroom Luxury Smart Duplex in Guzape",
    category: "Residential",
    estimatedBudget: "₦180.0M - ₦220.0M",
    location: "Guzape District, Abuja",
    status: "Drafting Milestone Plan",
    dateSubmitted: "Oct 08, 2026",
    description: "Full architectural execution including cantilever suspended slab, concealed rooftop chiller ducting, and private swimming pool foundation.",
  },
  {
    id: "brf-2",
    companyId: "comp-crane",
    companyName: "Crane & Stone Structural",
    title: "Marine Piling for Private Boat Jetty",
    category: "Marine & Waterfront",
    estimatedBudget: "₦65.0M - ₦80.0M",
    location: "Lekki Phase 1 Waterfront, Lagos",
    status: "Under Contractor Review",
    dateSubmitted: "Oct 10, 2026",
    description: "16 marine grade concrete driven piles into bedrock refusal depth with corrosion-resistant sheet reinforcement.",
  },
  {
    id: "brf-3",
    companyId: "comp-primeform",
    companyName: "PrimeForm Architects",
    title: "Bespoke Modern Villa Architectural Drawings",
    category: "Architecture & Design",
    estimatedBudget: "₦35.0M - ₦45.0M",
    location: "Maitama Ext., Abuja",
    status: "Proposal Ready",
    dateSubmitted: "Oct 05, 2026",
    description: "Complete 3D BIM structural, MEP coordination, and LASPPPA/FCDA statutory approval documentation.",
  },
];

export function OwnerFindCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>(INITIAL_COMPANIES);
  const [projectBriefs, setProjectBriefs] = useState<ProjectBrief[]>(INITIAL_BRIEFS);
  const [activeTab, setActiveTab] = useState<"directory" | "my-briefs">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Selected company for detailed dossier modal
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);

  // "Send Project Request" brief modal
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [briefTargetCompany, setBriefTargetCompany] = useState<CompanyItem | null>(null);
  const [viewingBrief, setViewingBrief] = useState<ProjectBrief | null>(null);
  const [briefForm, setBriefForm] = useState({
    title: "",
    category: "Residential",
    estimatedBudget: "₦100M - ₦200M",
    location: "",
    description: "",
  });

  // "Invite a Company" modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCompanyName, setInviteCompanyName] = useState("");
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState(false);

  // Toggle favorite
  const handleToggleFavorite = (companyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const isFilterActive = selectedCategory !== "All" || selectedState !== "All States" || onlyVerified || onlyFavorites;

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      if (selectedState !== "All States" && c.state !== selectedState) return false;
      if (onlyVerified && !c.isVerified) return false;
      if (onlyFavorites && !c.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesTag = c.tagline.toLowerCase().includes(q);
        const matchesSpecialty = c.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesLoc = c.location.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesSpecialty && !matchesLoc) return false;
      }
      return true;
    });
  }, [companies, selectedCategory, selectedState, onlyVerified, searchQuery]);

  const handleOpenBriefModal = (company: CompanyItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBriefTargetCompany(company);
    setBriefForm({
      title: "",
      category: company.category === "Architecture" ? "Architecture" : "Residential",
      estimatedBudget: "₦100M - ₦200M",
      location: company.state === "Abuja FCT" ? "Guzape, Abuja" : "Lekki Phase 1, Lagos",
      description: "",
    });
    setIsBriefModalOpen(true);
  };

  const handleSubmitBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefTargetCompany || !briefForm.title.trim()) return;

    const newBrief: ProjectBrief = {
      id: `brf-${Date.now()}`,
      companyId: briefTargetCompany.id,
      companyName: briefTargetCompany.name,
      title: briefForm.title.trim(),
      category: briefForm.category,
      estimatedBudget: briefForm.estimatedBudget,
      location: briefForm.location || briefTargetCompany.location,
      status: "Under Contractor Review",
      dateSubmitted: "Just now",
      description: briefForm.description || "Project specifications submitted for milestone scoping.",
    };

    setProjectBriefs((prev) => [newBrief, ...prev]);
    setIsBriefModalOpen(false);
    setActiveTab("my-briefs");
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCompanyName.trim() || !inviteEmail.trim()) return;
    setInviteSuccessNotice(true);
    setTimeout(() => {
      setInviteSuccessNotice(false);
      setIsInviteModalOpen(false);
      setInviteCompanyName("");
      setInviteEmail("");
    }, 1800);
  };

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Decorative vector background lines */}
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

      {/* ── Left Sidebar Navigation (Consistent with Home & Projects) ── */}
      <SidebarNav currentActiveItem="find-companies" />

      {/* ── Main Workspace ── */}
      <main
        style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5"
      >
        {/* Top Header Navigation Bar (Identical to Home and Projects Page) */}
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        {/* ── Section Header Row: Title on Left, Controls on Right ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              {activeTab === "directory" ? "Find Companies" : "My Active Project Requests"}
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium mt-0.5">
              {activeTab === "directory"
                ? "Connect with COREN-registered contractors, structural engineers & architects with verified escrow delivery"
                : "Contractors scoping your project briefs. All scopes, budgets and locations aligned for comparison."}
            </p>
          </div>

          {/* Action Toolbar: [Companies | My Briefs], [Filter], and [Invite Company] (All matching Start project button size & radius: h-9, rounded-md) */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap">
            {/* View Switcher: Companies vs My Briefs */}
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
                Companies ({companies.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("my-briefs")}
                className={`h-full px-3.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "my-briefs"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                <span>My Briefs</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeTab === "my-briefs"
                      ? "bg-white/25 text-white"
                      : "bg-white text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)]"
                  }`}
                >
                  {projectBriefs.length}
                </span>
              </button>
            </div>

            {/* Filter Dropdown Button (matching Start project button size & border-radius) */}
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
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>Filter</span>
                  {isFilterActive && (
                    <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                  )}
                  <svg
                    className={`w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] transition-transform ${
                      isFilterDropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Simplified Filter Dropdown Menu */}
                {isFilterDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsFilterDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-11 w-72 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xl p-4 z-40 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Specialty Filter */}
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1.5">
                          Specialty
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer"
                        >
                          <option value="All">All Specialties</option>
                          <option value="General Contractor">General Contractor</option>
                          <option value="Structural & Civil">Structural & Civil</option>
                          <option value="Marine & Geotech">Marine & Geotechnical</option>
                          <option value="Architecture">Architecture & Design</option>
                          <option value="MEP Engineering">MEP Engineering</option>
                        </select>
                      </div>

                      {/* Region Filter */}
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1.5">
                          Region / State
                        </label>
                        <select
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer"
                        >
                          <option value="All States">All Regions</option>
                          <option value="Lagos">Lagos State</option>
                          <option value="Abuja FCT">Abuja FCT</option>
                          <option value="Rivers / PH">Rivers / Port Harcourt</option>
                        </select>
                      </div>

                      {/* COREN Verification Checkbox */}
                      <label className="flex items-center justify-between pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] cursor-pointer">
                        <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          COREN Verified Only
                        </span>
                        <input
                          type="checkbox"
                          checked={onlyVerified}
                          onChange={(e) => setOnlyVerified(e.target.checked)}
                          className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer rounded"
                        />
                      </label>

                      {/* Favourited Companies Only Checkbox */}
                      <label className="flex items-center justify-between pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] cursor-pointer">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                          <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            Favourited Companies Only
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={onlyFavorites}
                          onChange={(e) => setOnlyFavorites(e.target.checked)}
                          className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer rounded"
                        />
                      </label>

                      {/* Dropdown Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory("All");
                            setSelectedState("All States");
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

            {/* Invite a Contractor Button (Compact Icon Button) */}
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              title="Invite Company to Vantaged"
              className="w-9 h-9 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 font-sans shrink-0"
            >
              <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </section>

        {/* ── Directory Content Area ── */}
        {activeTab === "directory" ? (
          <div className="flex flex-col gap-3">
            {/* Active Filter Pill Summary (if any filter active) */}
            {isFilterActive && (
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">Active filters:</span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                    {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory("All")} className="hover:text-black">×</button>
                  </span>
                )}
                {selectedState !== "All States" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                    {selectedState}
                    <button type="button" onClick={() => setSelectedState("All States")} className="hover:text-black">×</button>
                  </span>
                )}
                {onlyVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] font-bold text-[11px]">
                    COREN Verified
                    <button type="button" onClick={() => setOnlyVerified(false)} className="hover:text-black">×</button>
                  </span>
                )}
                {onlyFavorites && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                    ♥ Favourited
                    <button type="button" onClick={() => setOnlyFavorites(false)} className="hover:text-black">×</button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedState("All States");
                    setOnlyVerified(false);
                    setOnlyFavorites(false);
                  }}
                  className="text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ── CARD DIRECTORY GRID (Inspired by Marcin Rumierz.jpeg with 'View Profile' removed) ── */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Registered Companies ({filteredCompanies.length})
                </span>
                <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                  Click any card to view their profile, licenses & past delivery
                </span>
              </div>

              {/* Grid: 1 col on mobile, 2 col on tablet, 3-4 col on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-12">
                {filteredCompanies.map((company) => {
                  const isFeatured = company.isFeatured;
                  return (
                    <div
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      className={`group relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                        isFeatured
                          ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-2 border-[var(--vt-color-orange-600,#D84C0B)] shadow-[0_12px_28px_rgba(239,95,24,0.22)]"
                          : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                      }`}
                    >
                      {/* Top Header of Card: Favorite Heart + Add/Brief Action Button */}
                      <div className="flex items-center justify-between w-full mb-3">
                        {/* Bookmark / Favorite Heart Icon */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(company.id, e)}
                          title={company.isFavorite ? "Remove favorite" : "Bookmark company"}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isFeatured
                              ? "bg-white/20 text-white hover:bg-white/30"
                              : company.isFavorite
                              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)]"
                              : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill={company.isFavorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>

                        {/* Top Right Quick Action: Plus / Brief Button */}
                        <button
                          type="button"
                          onClick={(e) => handleOpenBriefModal(company, e)}
                          title="Send quick project brief"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold ${
                            isFeatured
                              ? "bg-white text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-white/90 shadow-2xs"
                              : "bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-2xs"
                          }`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Center Company Emblem & Title */}
                      <div className="flex flex-col items-center text-center my-2">
                        {/* Company Logo Badge */}
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black mb-3 shadow-sm ${
                            isFeatured ? "bg-white text-[var(--vt-color-orange-600,#D84C0B)]" : `${company.logoBg} ${company.logoColor}`
                          }`}
                        >
                          {company.logoInitials}
                        </div>

                        {/* Company Name */}
                        <h3
                          className={`text-base font-extrabold tracking-tight truncate max-w-full ${
                            isFeatured ? "text-white" : "text-[var(--vt-color-indigo-900,#261A66)]"
                          }`}
                        >
                          {company.name}
                        </h3>

                        {/* Tagline / Category */}
                        <p
                          className={`text-[11.5px] font-semibold mt-1 line-clamp-1 ${
                            isFeatured ? "text-white/85" : "text-[var(--vt-color-neutral-500,#7C7894)]"
                          }`}
                        >
                          {company.category} • {company.location.split(",")[0]}
                        </p>
                      </div>

                      {/* Escrow Track Record Status Line (matching bar in Marcin Rumierz.jpeg) */}
                      <div className="my-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={isFeatured ? "text-white/80" : "text-[var(--vt-color-neutral-500,#7C7894)]"}>
                            Escrow Track Record
                          </span>
                          <span className={isFeatured ? "text-white font-extrabold" : "text-[var(--vt-color-orange-600,#D84C0B)] font-extrabold"}>
                            {company.escrowDelivered}
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
                            style={{ width: `${company.reliabilityRate}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Footer Row (View Profile removed as requested; clicking card opens profile) */}
                      <div
                        className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                          isFeatured ? "border-white/20 text-white" : "border-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400">★</span>
                          <span>{company.rating}</span>
                          <span className={isFeatured ? "text-white/70 text-[11px]" : "text-[var(--vt-color-neutral-400,#A3A0B8)] text-[11px]"}>
                            ({company.completedProjectsCount} projects)
                          </span>
                        </div>

                        <span
                          className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md ${
                            isFeatured
                              ? "bg-white/20 text-white"
                              : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                          }`}
                        >
                          {company.state.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── MY PROJECT BRIEFS TAB (CL-F04) ── */
          <div className="flex flex-col gap-3 pt-1 pb-12 w-full">
            {/* Table Container with Aligned Columns */}
            <div className="w-full bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      <th className="py-3 px-4 sm:px-5">Project Scope</th>
                      <th className="py-3 px-4">Recipient Contractor</th>
                      <th className="py-3 px-4">Estimated Budget</th>
                      <th className="py-3 px-4">Site Location</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)] text-xs font-medium">
                    {projectBriefs.map((brief) => (
                      <tr
                        key={brief.id}
                        onClick={() => setViewingBrief(brief)}
                        className="group hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/40 transition-colors cursor-pointer"
                      >
                        {/* Project Title */}
                        <td className="py-3.5 px-4 sm:px-5 max-w-xs">
                          <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate block">
                            {brief.title}
                          </span>
                          <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-0.5 max-w-sm">
                            {brief.description}
                          </p>
                        </td>

                        {/* Recipient */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] font-black text-[10px] flex items-center justify-center border border-[var(--vt-color-indigo-100,#EAE8F9)] shrink-0">
                              {brief.companyName.charAt(0)}
                            </div>
                            <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                              {brief.companyName}
                            </span>
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-extrabold text-[var(--vt-color-orange-600,#D84C0B)]">
                            {brief.estimatedBudget}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{brief.location}</span>
                          </div>
                        </td>

                        {/* Submitted */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-semibold">
                          {brief.dateSubmitted}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                              brief.status === "Proposal Ready"
                                ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                                : brief.status === "Drafting Milestone Plan"
                                ? "bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-indigo-100,#EAE8F9)]"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                brief.status === "Proposal Ready"
                                  ? "bg-[var(--vt-color-green-500,#2E9E57)]"
                                  : brief.status === "Drafting Milestone Plan"
                                  ? "bg-[var(--vt-color-indigo-600,#5547B0)]"
                                  : "bg-amber-500"
                              }`}
                            />
                            {brief.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingBrief(brief);
                            }}
                            className="h-8 px-3 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold transition-all cursor-pointer shadow-2xs font-sans"
                          >
                            View Brief
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── COMPANY PROFILE DETAIL MODAL (CL-F02) ── */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${selectedCompany.logoBg} ${selectedCompany.logoColor} shadow-md`}>
                  {selectedCompany.logoInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{selectedCompany.name}</h2>
                    {selectedCompany.isVerified && (
                      <span className="w-5 h-5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] text-white flex items-center justify-center text-[11px]" title="COREN Verified">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium mt-0.5">
                    {selectedCompany.licenseNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs sm:text-sm">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-center">
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Escrow Track</span>
                  <p className="text-base font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5">{selectedCompany.escrowDelivered}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Completed</span>
                  <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">{selectedCompany.completedProjectsCount} Projects</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Rating</span>
                  <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">★ {selectedCompany.rating} / 5.0</p>
                </div>
              </div>

              {/* Tagline & Specialties */}
              <div>
                <h4 className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">Company Overview</h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  {selectedCompany.tagline}. Licensed with registered structural, geotech and MEP practitioners delivering milestone-verified infrastructure across Nigeria.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {selectedCompany.specialties.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#484564)] text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lead Representative */}
              <div className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-3">
                <img
                  src={selectedCompany.leadDirector.avatar}
                  alt={selectedCompany.leadDirector.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]"
                />
                <div>
                  <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    {selectedCompany.leadDirector.name}
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                    {selectedCompany.leadDirector.role}
                  </p>
                </div>
              </div>

              {/* Past Projects Portfolio */}
              <div>
                <h4 className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-2">Verified Projects Track Record</h4>
                <div className="flex flex-col gap-2">
                  {selectedCompany.recentProjects.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">{p.title}</p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">{p.category} • Completed {p.year}</p>
                      </div>
                      <span className="text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)]">
                        {p.escrowAmount} in Escrow
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
                onClick={() => setSelectedCompany(null)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const comp = selectedCompany;
                  setSelectedCompany(null);
                  handleOpenBriefModal(comp);
                }}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans active:scale-95"
              >
                Send Project Request (Brief) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEND PROJECT BRIEF MODAL (CL-4) ── */}
      {isBriefModalOpen && briefTargetCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Send Project Request</h3>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
                  To: {briefTargetCompany.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBriefModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBrief} className="p-5 flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={briefForm.title}
                  onChange={(e) => setBriefForm({ ...briefForm, title: e.target.value })}
                  placeholder="e.g. 5-Bedroom Waterfront Villa"
                  className="w-full h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Category
                  </label>
                  <select
                    value={briefForm.category}
                    onChange={(e) => setBriefForm({ ...briefForm, category: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Marine & Waterfront">Marine & Waterfront</option>
                    <option value="Architecture & Design">Architecture & Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Estimated Budget
                  </label>
                  <select
                    value={briefForm.estimatedBudget}
                    onChange={(e) => setBriefForm({ ...briefForm, estimatedBudget: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  >
                    <option value="₦50M - ₦100M">₦50M - ₦100M</option>
                    <option value="₦100M - ₦250M">₦100M - ₦250M</option>
                    <option value="₦250M - ₦500M">₦250M - ₦500M</option>
                    <option value="₦500M+">₦500M+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Site Location
                </label>
                <input
                  type="text"
                  value={briefForm.location}
                  onChange={(e) => setBriefForm({ ...briefForm, location: e.target.value })}
                  placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1"
                  className="w-full h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Brief Scope Description
                </label>
                <textarea
                  rows={3}
                  value={briefForm.description}
                  onChange={(e) => setBriefForm({ ...briefForm, description: e.target.value })}
                  placeholder="Summarize the core requirements, drawing status, or desired milestone delivery..."
                  className="w-full p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setIsBriefModalOpen(false)}
                  className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans active:scale-95"
                >
                  Submit Project Brief →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INVITE COMPANY MODAL (CL-F06) ── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Invite a Company</h3>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
                  Invite your external contractor to onboard on Vantaged
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inviteSuccessNotice ? (
              <div className="p-8 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-600,#248247)] flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-extrabold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                  Invite Dispatched!
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  An onboarding link with verification guidelines was sent to {inviteEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="p-5 flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteCompanyName}
                    onChange={(e) => setInviteCompanyName(e.target.value)}
                    placeholder="e.g. Apex Civil Works Ltd"
                    className="w-full h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Contractor Email or WhatsApp *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="director@contractor.com"
                    className="w-full h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3 font-sans">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans active:scale-95"
                  >
                    Send Invite Code →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW PROJECT BRIEF DETAILS MODAL ── */}
      {viewingBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white truncate max-w-sm">
                    {viewingBrief.title}
                  </h3>
                </div>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium mt-0.5">
                  Submitted to {viewingBrief.companyName} • {viewingBrief.dateSubmitted}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingBrief(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Estimated Budget
                  </span>
                  <p className="text-sm font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5">
                    {viewingBrief.estimatedBudget}
                  </p>
                </div>
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Current Status
                  </span>
                  <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {viewingBrief.status}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                  Site Location
                </span>
                <p className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                  {viewingBrief.location}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                  Scope of Work Description
                </span>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]">
                  {viewingBrief.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end font-sans">
              <button
                type="button"
                onClick={() => setViewingBrief(null)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
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
