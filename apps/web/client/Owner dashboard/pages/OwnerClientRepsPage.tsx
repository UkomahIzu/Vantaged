"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { VantagedSelect } from "../components/VantagedSelect";

export interface ClientRepItem {
  id: string;
  name: string;
  title: string;
  discipline: "Structural & Civil" | "Architecture" | "Quantity Surveying" | "MEP Engineering" | "Marine & Geotech" | "Owner Proxy";
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
  status: "Active" | "Pending Invitation";
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
  recentAudits: {
    id: string;
    action: string;
    projectTitle: string;
    module: "Stage Sign-Off" | "BOQ & Escrow" | "Variation Review" | "Site Inspection";
    status: "Verified & Cleared" | "Punch List Flagged" | "Disbursed" | "Pending Review";
    timestamp: string;
  }[];
}

const INITIAL_CLIENT_REPS: ClientRepItem[] = [
  {
    id: "rep-adeleke",
    name: "Engr. Babatunde Adeleke",
    title: "Principal Consulting Structural Engineer",
    discipline: "Structural & Civil",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    stagesVerifiedCount: 24,
    licenseNumber: "COREN #R.48201 / NSE Fellow",
    isVerified: true,
    isFavorite: true,
    isFeatured: true,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&h=160&fit=crop&crop=face",
    email: "babatunde.adeleke@adeleke-eng.ng",
    phone: "+234 803 401 9920",
    status: "Active",
    mandateSummary:
      "Independent technical client representative appointed to oversee rebar schedules, post-tensioned slab casting, structural core integrity tests, and issue formal stage clearance prior to escrow tranche release.",
    assignedProjects: [
      {
        id: "proj-lekki",
        title: "Lekki Phase 1 Luxury Villa",
        roleOnProject: "Lead Structural Representative",
        progressPercent: 68,
        status: "Active Construction",
      },
      {
        id: "proj-kolawole",
        title: "Kolawole Commercial Tower",
        roleOnProject: "Supervising Structural Engineer",
        progressPercent: 35,
        status: "Substructure Phase",
      },
      {
        id: "proj-banana",
        title: "Banana Island Horizon Penthouse",
        roleOnProject: "Structural Consultant",
        progressPercent: 88,
        status: "Finishing Phase",
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
    recentAudits: [
      {
        id: "log-1",
        action: "Inspected Level 3 slab rebar grid spacing; approved concrete pour batching",
        projectTitle: "Lekki Phase 1 Luxury Villa",
        module: "Stage Sign-Off",
        status: "Verified & Cleared",
        timestamp: "Today, 11:20 AM",
      },
      {
        id: "log-2",
        action: "Reviewed core compressive strength cylinder break reports (Day 28: 38.5 MPa)",
        projectTitle: "Kolawole Commercial Tower",
        module: "Site Inspection",
        status: "Verified & Cleared",
        timestamp: "Yesterday, 04:45 PM",
      },
      {
        id: "log-3",
        action: "Validated contractor variation request VR-04 for anti-crack seismic mesh",
        projectTitle: "Lekki Phase 1 Luxury Villa",
        module: "Variation Review",
        status: "Verified & Cleared",
        timestamp: "Oct 10, 02:15 PM",
      },
    ],
  },
  {
    id: "rep-amina",
    name: "Arc. Amina Yusuf",
    title: "Resident Project Architect & Design Lead",
    discipline: "Architecture",
    location: "Ikoyi, Lagos",
    state: "Lagos",
    stagesVerifiedCount: 18,
    licenseNumber: "NIA #AR-1092 / ARCON Registered",
    isVerified: true,
    isFavorite: true,
    isFeatured: false,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face",
    email: "amina.yusuf@archstudio.ng",
    phone: "+234 802 334 1180",
    status: "Active",
    mandateSummary:
      "Retained for architectural fidelity audits, facade alignment, premium finishing quality surveillance, and acoustic insulation compliance across residential developments.",
    assignedProjects: [
      {
        id: "proj-banana",
        title: "Banana Island Horizon Penthouse",
        roleOnProject: "Lead Interior & Facade Architect",
        progressPercent: 88,
        status: "Finishing Phase",
      },
      {
        id: "proj-lekki",
        title: "Lekki Phase 1 Luxury Villa",
        roleOnProject: "Resident Design Architect",
        progressPercent: 68,
        status: "Active Construction",
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
    recentAudits: [
      {
        id: "log-4",
        action: "Audited frameless curtain wall glazing seals and solar glass U-value compliance",
        projectTitle: "Banana Island Horizon Penthouse",
        module: "Site Inspection",
        status: "Verified & Cleared",
        timestamp: "Oct 11, 03:30 PM",
      },
      {
        id: "log-5",
        action: "Flagged terrace porcelain tile slope gradient (water pooling risk on grid C2)",
        projectTitle: "Banana Island Horizon Penthouse",
        module: "Stage Sign-Off",
        status: "Punch List Flagged",
        timestamp: "Oct 09, 09:10 AM",
      },
    ],
  },
  {
    id: "rep-oladipo",
    name: "QS Femi Oladipo",
    title: "Senior Chartered Quantity Surveyor",
    discipline: "Quantity Surveying",
    location: "Central Business District, Abuja",
    state: "Abuja FCT",
    stagesVerifiedCount: 26,
    licenseNumber: "NIQS #QS-3391 / QSRBN Certified",
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face",
    email: "femi.oladipo@costmatrix.ng",
    phone: "+234 802 889 0041",
    status: "Active",
    mandateSummary:
      "Direct commercial oversight representative responsible for BOQ line-item audit, materials gate pass verification, invoice cross-referencing, and signing off escrow payment releases.",
    assignedProjects: [
      {
        id: "proj-enclave",
        title: "The Enclave Waterfront Resort",
        roleOnProject: "Commercial & Cost Auditor",
        progressPercent: 42,
        status: "Piling & Deck Phase",
      },
      {
        id: "proj-guzape",
        title: "Guzape Hills Residence",
        roleOnProject: "Cost Consultant",
        progressPercent: 55,
        status: "Superstructure Phase",
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
    recentAudits: [
      {
        id: "log-6",
        action: "Certified Stage 2 substructure claim: ₦48.5M released from escrow vault",
        projectTitle: "The Enclave Waterfront Resort",
        module: "BOQ & Escrow",
        status: "Disbursed",
        timestamp: "Oct 08, 02:40 PM",
      },
      {
        id: "log-7",
        action: "Audited delivery waybills for 60 tonnes of 16mm high-yield reinforcement bars",
        projectTitle: "Guzape Hills Residence",
        module: "BOQ & Escrow",
        status: "Verified & Cleared",
        timestamp: "Oct 06, 11:15 AM",
      },
    ],
  },
  {
    id: "rep-balogun",
    name: "Mr. Olumide Balogun",
    title: "Owner Family Representative & Proxy",
    discipline: "Owner Proxy",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    stagesVerifiedCount: 12,
    licenseNumber: "Verified Identity (NIN #491028)",
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face",
    email: "olumide.balogun@familyoffice.ng",
    phone: "+234 803 771 9022",
    status: "Active",
    mandateSummary:
      "Authorized family proxy with power-of-attorney oversight on milestone progression, contractor physical walk-throughs, site security coordination, and owner representation.",
    assignedProjects: [
      {
        id: "proj-lekki",
        title: "Lekki Phase 1 Luxury Villa",
        roleOnProject: "Family Representative",
        progressPercent: 68,
        status: "Active Construction",
      },
      {
        id: "proj-banana",
        title: "Banana Island Horizon Penthouse",
        roleOnProject: "Family Proxy",
        progressPercent: 88,
        status: "Finishing Phase",
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
    recentAudits: [
      {
        id: "log-8",
        action: "Conducted weekly physical site inspection alongside resident clerk of works",
        projectTitle: "Lekki Phase 1 Luxury Villa",
        module: "Site Inspection",
        status: "Verified & Cleared",
        timestamp: "Yesterday, 05:00 PM",
      },
    ],
  },
  {
    id: "rep-uche",
    name: "Engr. Emeka Uche",
    title: "Mechanical & Electrical Systems Specialist",
    discipline: "MEP Engineering",
    location: "Central Business District, Abuja",
    state: "Abuja FCT",
    stagesVerifiedCount: 15,
    licenseNumber: "COREN #R.51022 / IEEE Member",
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
    email: "emeka.uche@powerline-mep.ng",
    phone: "+234 805 119 4432",
    status: "Active",
    mandateSummary:
      "Specialist consultant overseeing central HVAC chilled water piping, earthing resistance tests, diesel generator auto-transfer switches, and fire suppression compliance.",
    assignedProjects: [
      {
        id: "proj-guzape",
        title: "Guzape Hills Residence",
        roleOnProject: "MEP Quality Inspector",
        progressPercent: 55,
        status: "Superstructure Phase",
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
    recentAudits: [
      {
        id: "log-9",
        action: "Hydrostatic pressure test approved: Underfloor PEX pipe sustained 8-bar pressure for 24h",
        projectTitle: "Guzape Hills Residence",
        module: "Stage Sign-Off",
        status: "Verified & Cleared",
        timestamp: "Oct 10, 01:10 PM",
      },
    ],
  },
  {
    id: "rep-briggs",
    name: "Dr. Tariere Briggs",
    title: "Geotechnical & Coastal Marine Consultant",
    discipline: "Marine & Geotech",
    location: "Epe Waterfront Corridor, Lagos",
    state: "Lagos",
    stagesVerifiedCount: 8,
    licenseNumber: "COREN #R.39144 / PhD Imperial",
    isVerified: true,
    isFavorite: false,
    isFeatured: false,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face",
    email: "tariere.briggs@earthworks-geo.com",
    phone: "+234 809 334 1120",
    status: "Active",
    mandateSummary:
      "Retained to oversee marine piling depth verification, pile integrity testing (PIT), and soil settlement dynamic monitoring along waterfront developments.",
    assignedProjects: [
      {
        id: "proj-enclave",
        title: "The Enclave Waterfront Resort",
        roleOnProject: "Geotechnical Lead",
        progressPercent: 42,
        status: "Piling & Deck Phase",
      },
    ],
    permissions: {
      viewProgress: true,
      approveStages: true,
      managePayments: false,
      changeRequests: false,
      messageContractor: true,
      manageShareLinks: false,
      invitePeople: false,
    },
    recentAudits: [
      {
        id: "log-10",
        action: "Ultrasonic pile integrity test signed off for Piles #14 through #28",
        projectTitle: "The Enclave Waterfront Resort",
        module: "Stage Sign-Off",
        status: "Verified & Cleared",
        timestamp: "Oct 07, 03:15 PM",
      },
    ],
  },
];

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer relative shrink-0 ${
        checked
          ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
          : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
      }`}
    >
      <span
        className={`block w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function StepperInput({
  value,
  onDecrement,
  onIncrement,
}: {
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="h-8 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center overflow-hidden bg-white shadow-2xs shrink-0">
      <button
        type="button"
        onClick={onDecrement}
        className="w-7 h-full flex items-center justify-center hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] font-bold text-sm cursor-pointer border-r border-[var(--vt-color-border-default,#E2E0EC)] transition-colors"
      >
        −
      </button>
      <span className="px-3 text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] whitespace-nowrap">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="w-7 h-full flex items-center justify-center hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] font-bold text-sm cursor-pointer border-l border-[var(--vt-color-border-default,#E2E0EC)] transition-colors"
      >
        +
      </button>
    </div>
  );
}

function normalizeRep(raw: any, index: number = 0): ClientRepItem {
  const loc = raw.location || raw.state || "Lekki, Lagos";
  const st = raw.state || (loc.includes(",") ? loc.split(",").pop()?.trim() : loc) || "Lagos";
  return {
    id: raw.id || `rep-${Date.now()}-${index}`,
    name: raw.name || "Representative",
    title: raw.title || raw.roleTitle || "Independent Client Representative",
    discipline: raw.discipline || "Structural & Civil",
    location: loc,
    state: st,
    stagesVerifiedCount: typeof raw.stagesVerifiedCount === "number" ? raw.stagesVerifiedCount : 0,
    licenseNumber: raw.licenseNumber || "Accreditation Verification Pending",
    isVerified: Boolean(raw.isVerified),
    isFavorite: Boolean(raw.isFavorite),
    isFeatured: Boolean(raw.isFeatured),
    avatar: raw.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face",
    email: raw.email || "rep@vantaged.app",
    phone: raw.phone || "+234 800 000 0000",
    status: raw.status || "Pending Invitation",
    mandateSummary:
      raw.mandateSummary ||
      "Authorized client representative appointed to oversee site milestones and quality assurance.",
    assignedProjects: Array.isArray(raw.assignedProjects) && raw.assignedProjects.length > 0
      ? raw.assignedProjects.map((p: any, pIdx: number) => ({
          id: p.id || p.projectId || `proj-${pIdx}`,
          title: p.title || p.projectName || "Assigned Project",
          roleOnProject: p.roleOnProject || raw.title || raw.roleTitle || "Client Representative",
          progressPercent: typeof p.progressPercent === "number" ? p.progressPercent : 50,
          status: p.status || "Active Construction",
        }))
      : [
          {
            id: "proj-lekki",
            title: "Lekki Phase 1 Luxury Villa",
            roleOnProject: raw.title || raw.roleTitle || "Client Representative",
            progressPercent: 50,
            status: "Active Construction",
          },
        ],
    permissions: {
      viewProgress: raw.permissions?.viewProgress ?? true,
      approveStages: raw.permissions?.approveStages ?? raw.permissions?.approveRejectStages ?? true,
      managePayments: raw.permissions?.managePayments ?? false,
      changeRequests: raw.permissions?.changeRequests ?? raw.permissions?.suggestChanges ?? true,
      messageContractor: raw.permissions?.messageContractor ?? true,
      manageShareLinks: raw.permissions?.manageShareLinks ?? false,
      invitePeople: raw.permissions?.invitePeople ?? false,
      maxEscrowLimit: raw.permissions?.maxEscrowLimit ?? 25,
      maxChangeLimit: raw.permissions?.maxChangeLimit ?? 10,
    },
    recentAudits: Array.isArray(raw.recentAudits) ? raw.recentAudits : [],
  };
}

export function OwnerClientRepsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("owner_reps");
  const storageKey = "vantaged_client_reps_list";

  const [reps, setReps] = useState<ClientRepItem[]>(INITIAL_CLIENT_REPS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((item: any, idx: number) => normalizeRep(item, idx));
          setReps(normalized);
        }
      }
    } catch {}
  }, []);

  const persistReps = (updated: ClientRepItem[]) => {
    setReps(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
    }
  };

  const [selectedRep, setSelectedRep] = useState<ClientRepItem | null>(null);
  const [managingPermissionsRep, setManagingPermissionsRep] = useState<ClientRepItem | null>(null);

  // Active PRD §5.2 permissions form state
  const [permViewProgress, setPermViewProgress] = useState(true);
  const [permApproveStages, setPermApproveStages] = useState(true);
  const [permManagePayments, setPermManagePayments] = useState(true);
  const [permChangeRequests, setPermChangeRequests] = useState(true);
  const [permMessageContractor, setPermMessageContractor] = useState(true);
  const [permManageShareLinks, setPermManageShareLinks] = useState(false);
  const [permInvitePeople, setPermInvitePeople] = useState(false);
  const [escrowLimit, setEscrowLimit] = useState(25);
  const [changeLimit, setChangeLimit] = useState(10);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const openPermissionsPage = (rep: ClientRepItem) => {
    setManagingPermissionsRep(rep);
    setSelectedRep(null);
    setPermViewProgress(rep.permissions?.viewProgress ?? true);
    setPermApproveStages(rep.permissions?.approveStages ?? (rep.permissions as any)?.approveRejectStages ?? true);
    setPermManagePayments(rep.permissions?.managePayments ?? false);
    setPermChangeRequests(rep.permissions?.changeRequests ?? (rep.permissions as any)?.suggestChanges ?? true);
    setPermMessageContractor(rep.permissions?.messageContractor ?? true);
    setPermManageShareLinks(rep.permissions?.manageShareLinks ?? false);
    setPermInvitePeople(rep.permissions?.invitePeople ?? false);
    setEscrowLimit(rep.permissions?.maxEscrowLimit ?? 25);
    setChangeLimit(rep.permissions?.maxChangeLimit ?? 10);
    setSaveSuccessNotice(false);
  };

  const handleSavePermissions = () => {
    if (!managingPermissionsRep) return;
    const next = reps.map((r) =>
      r.id === managingPermissionsRep.id
        ? {
            ...r,
            permissions: {
              viewProgress: permViewProgress,
              approveStages: permApproveStages,
              managePayments: permManagePayments,
              changeRequests: permChangeRequests,
              messageContractor: permMessageContractor,
              manageShareLinks: permManageShareLinks,
              invitePeople: permInvitePeople,
              maxEscrowLimit: escrowLimit,
              maxChangeLimit: changeLimit,
            },
          }
        : r
    );
    persistReps(next);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 3500);
  };

  const activePermissionsCount = useMemo(() => {
    let count = 0;
    if (permViewProgress) count++;
    if (permApproveStages) count++;
    if (permManagePayments) count++;
    if (permChangeRequests) count++;
    if (permMessageContractor) count++;
    if (permManageShareLinks) count++;
    if (permInvitePeople) count++;
    return count;
  }, [
    permViewProgress,
    permApproveStages,
    permManagePayments,
    permChangeRequests,
    permMessageContractor,
    permManageShareLinks,
    permInvitePeople,
  ]);

  const activePercentage = Math.round((activePermissionsCount / 7) * 100);

  // Check URL query parameters for direct permissions management
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const repId = params.get("managePermissions") || params.get("permissions");
      if (repId) {
        const found = reps.find((r) => r.id === repId);
        if (found) {
          openPermissionsPage(found);
        }
      }
    }
  }, [reps]);

  // Filter States (Same architecture as Find Companies)
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTitle, setInviteTitle] = useState("");
  const [inviteDiscipline, setInviteDiscipline] = useState<ClientRepItem["discipline"]>("Structural & Civil");
  const [inviteProject, setInviteProject] = useState("Lekki Phase 1 Luxury Villa");
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState(false);

  const handleToggleFavorite = (repId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = reps.map((r) => (r.id === repId ? { ...r, isFavorite: !r.isFavorite } : r));
    persistReps(next);
  };

  const isFilterActive =
    selectedDiscipline !== "All" ||
    selectedState !== "All States" ||
    onlyVerified ||
    onlyFavorites;

  // Filtered Reps
  const filteredReps = useMemo(() => {
    return reps.filter((r) => {
      if (selectedDiscipline !== "All" && r.discipline !== selectedDiscipline) return false;
      if (selectedState !== "All States" && r.state !== selectedState) return false;
      if (onlyVerified && !r.isVerified) return false;
      if (onlyFavorites && !r.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (r.name || "").toLowerCase().includes(q);
        const matchesTitle = (r.title || "").toLowerCase().includes(q);
        const matchesLicense = (r.licenseNumber || "").toLowerCase().includes(q);
        const matchesProject = (r.assignedProjects || []).some((p) =>
          (p.title || (p as any).projectName || "").toLowerCase().includes(q)
        );
        if (!matchesName && !matchesTitle && !matchesLicense && !matchesProject) return false;
      }
      return true;
    });
  }, [reps, selectedDiscipline, selectedState, onlyVerified, onlyFavorites, searchQuery]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newRep: ClientRepItem = {
      id: `rep-${Date.now()}`,
      name: inviteName.trim(),
      title: inviteTitle.trim() || "Independent Client Representative",
      discipline: inviteDiscipline,
      location: "Lekki, Lagos",
      state: "Lagos",
      stagesVerifiedCount: 0,
      licenseNumber: "Accreditation Verification Pending",
      isVerified: false,
      isFavorite: false,
      isFeatured: false,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face",
      email: inviteEmail.trim(),
      phone: "+234 800 000 0000",
      status: "Pending Invitation",
      mandateSummary: `Authorized client representative appointed to oversee milestones and quality assurance for ${inviteProject}.`,
      assignedProjects: [
        {
          id: `proj-${Date.now()}`,
          title: inviteProject,
          roleOnProject: inviteTitle.trim() || "Client Representative",
          progressPercent: 50,
          status: "Active Construction",
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
      recentAudits: [
        {
          id: `log-${Date.now()}`,
          action: `Invitation link dispatched to ${inviteEmail.trim()}`,
          projectTitle: inviteProject,
          module: "Site Inspection",
          status: "Pending Review",
          timestamp: "Just now",
        },
      ],
    };

    const next = [newRep, ...reps];
    persistReps(next);
    setInviteSuccessNotice(true);
    setTimeout(() => {
      setInviteSuccessNotice(false);
      setIsInviteModalOpen(false);
      setInviteName("");
      setInviteEmail("");
      setInviteTitle("");
    }, 1500);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Decorative vector background lines (Identical to Find Companies) */}
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

      {/* ── Left Sidebar Navigation (Consistent with Home, Projects & Find Companies) ── */}
      <SidebarNav currentActiveItem="client-reps" />

      {/* ── Main Workspace ── */}
      <main
        ref={scrollRef}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5"
      >
        {/* Top Header Navigation Bar */}
        <HeaderBar
          leftSlot={
            managingPermissionsRep ? (
              <button
                type="button"
                onClick={() => setManagingPermissionsRep(null)}
                title="Back to Representatives"
                className="h-8 px-2.5 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Representatives</span>
              </button>
            ) : (
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
            )
          }
        />

        {managingPermissionsRep ? (
          /* ── REPRESENTATIVE PERMISSIONS PAGE VIEW (Matching uploaded image) ── */
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 pt-1 pb-16">
            {/* Live Success Banner */}
            {saveSuccessNotice && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 px-4 py-2.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Permissions updated for {managingPermissionsRep.name}. Changes active immediately across the platform.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setManagingPermissionsRep(null)}
                  className="underline hover:text-[var(--vt-color-orange-800,#8F320D)] cursor-pointer"
                >
                  Return to Reps list →
                </button>
              </div>
            )}

            {/* Two-Column Grid matching reference image */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left / Main Card: 2 Columns */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                    Representative permissions
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed mt-1">
                    Permissions defined in PRD §5.2 and authorized on your behalf. Turn any module off and the representative dashboard hides it entirely across assigned projects.
                  </p>
                </div>

                {/* Permission Rows with Hairline Dividers (Strict PRD §5.2 Alignment) */}
                <div className="flex flex-col divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                  {/* Row 1: View progress (PRD §5.2) */}
                  <div className="py-4.5 flex items-center justify-between gap-4 first:pt-0">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          View progress
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          VIEW_PROGRESS
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        See project dashboard, stage milestones, contractor proof photos/videos, timeline, and verified vs reported progress.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={permViewProgress}
                      onChange={setPermViewProgress}
                    />
                  </div>

                  {/* Row 2: Approve / reject stages (PRD §5.2) */}
                  <div className="py-4.5 flex items-center justify-between gap-4">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Approve / reject stages
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          REVIEW_STAGES
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        Review stages marked "Ready for review", conduct technical compliance inspections, approve stages, or reject with issues.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={permApproveStages}
                      onChange={setPermApproveStages}
                    />
                  </div>

                  {/* Row 3: Payments & escrow (PRD §5.2) */}
                  <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Payments & escrow
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          PAYMENTS
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        See payments due and contractor account details, upload and withdraw payment receipts, and authorize escrow tranche disbursements.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <StepperInput
                        value={`₦${escrowLimit}M max`}
                        onDecrement={() => setEscrowLimit((prev) => Math.max(5, prev - 5))}
                        onIncrement={() => setEscrowLimit((prev) => Math.min(200, prev + 5))}
                      />
                      <ToggleSwitch
                        checked={permManagePayments}
                        onChange={setPermManagePayments}
                      />
                    </div>
                  </div>

                  {/* Row 4: Change requests (PRD §5.2) */}
                  <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Change requests (Variations)
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          CHANGE_REQUESTS
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        Raise change requests and formally approve or reject the contractor's scope and BOQ variation claims.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <StepperInput
                        value={`₦${changeLimit}M cap`}
                        onDecrement={() => setChangeLimit((prev) => Math.max(2, prev - 2))}
                        onIncrement={() => setChangeLimit((prev) => Math.min(100, prev + 2))}
                      />
                      <ToggleSwitch
                        checked={permChangeRequests}
                        onChange={setPermChangeRequests}
                      />
                    </div>
                  </div>

                  {/* Row 5: Message the contractor (PRD §5.2) */}
                  <div className="py-4.5 flex items-center justify-between gap-4">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Message the contractor
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          MESSAGE_CONTRACTOR
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        Use direct project chat with the contractor's director, site manager, and engineering team on assigned projects.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={permMessageContractor}
                      onChange={setPermMessageContractor}
                    />
                  </div>

                  {/* Row 6: Manage share links (PRD §5.2) */}
                  <div className="py-4.5 flex items-center justify-between gap-4">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Manage share links
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          SHARE_LINKS
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        Create and revoke secure, read-only observer share links (e.g. for family members, bank lenders, or external auditors).
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={permManageShareLinks}
                      onChange={setPermManageShareLinks}
                    />
                  </div>

                  {/* Row 7: Invite people (PRD §5.2) */}
                  <div className="py-4.5 flex items-center justify-between gap-4 last:pb-0">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Invite people
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          INVITE_PEOPLE
                        </span>
                      </div>
                      <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 leading-relaxed">
                        Browse the contractor directory to invite contractors to projects, and onboard additional representatives under the account.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={permInvitePeople}
                      onChange={setPermInvitePeople}
                    />
                  </div>
                </div>

                {/* Bottom Action Button (Save) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePermissions}
                    className="h-10 px-6 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-98"
                  >
                    Save representative permissions
                  </button>
                </div>
              </div>

              {/* Right Card: PROGRAMME HEALTH equivalent (Exact match to uploaded image) */}
              <div className="flex flex-col gap-4">
                <div className="bg-[var(--vt-color-green-50,#E9F6EC)]/50 border border-[var(--vt-color-green-200,#A3D9B1)]/70 rounded-2xl p-6 sm:p-7 flex flex-col">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-green-700,#1F6B3E)]">
                    PROGRAMME HEALTH
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-2">
                    {activePercentage}%
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed mt-2.5">
                    {activePermissionsCount} of 7 PRD governance modules authorized. {managingPermissionsRep.stagesVerifiedCount ?? 0} milestone sign-offs verified this month, backed by cryptographic audit logs.
                  </p>
                </div>

                {/* Rep Identity Card */}
                <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={managingPermissionsRep.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face"}
                      alt={managingPermissionsRep.name || "Representative"}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/40 shadow-xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {managingPermissionsRep.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {managingPermissionsRep.title}
                      </p>
                      <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        {managingPermissionsRep.licenseNumber || "Accreditation Verification Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center justify-between text-[var(--vt-color-neutral-600,#5E5A7D)]">
                      <span>Assigned Sites:</span>
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {(managingPermissionsRep.assignedProjects || []).length} projects
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--vt-color-neutral-600,#5E5A7D)]">
                      <span>Discipline:</span>
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {managingPermissionsRep.discipline || "Structural & Civil"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Section Header Row: Title on Left, Controls on Right ── */}
            <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  Representatives
                </h1>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium mt-0.5">
                  Your trusted team members, engineers, or family who visit the site and confirm work before payments are made
                </p>
              </div>

          {/* Action Toolbar: [Filter] and [Invite Rep] */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap">
            {/* Filter Dropdown Button */}
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

              {/* Filter Dropdown Popover */}
              {isFilterDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsFilterDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-11 w-72 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-xl p-4 z-40 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Discipline Filter */}
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1.5">
                        Professional Discipline
                      </label>
                      <VantagedSelect
                        value={selectedDiscipline}
                        onChange={(val) => setSelectedDiscipline(val)}
                        className="w-full h-8 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                        options={[
                          { value: "All", label: "All Disciplines" },
                          { value: "Structural & Civil", label: "Structural & Civil" },
                          { value: "Architecture", label: "Architecture" },
                          { value: "Quantity Surveying", label: "Quantity Surveying" },
                          { value: "MEP Engineering", label: "MEP Engineering" },
                          { value: "Marine & Geotech", label: "Marine & Geotech" },
                          { value: "Owner Proxy", label: "Owner Proxy" },
                        ]}
                      />
                    </div>

                    {/* Region Filter */}
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1.5">
                        Location / State
                      </label>
                      <VantagedSelect
                        value={selectedState}
                        onChange={(val) => setSelectedState(val)}
                        className="w-full h-8 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                        options={[
                          { value: "All States", label: "All Regions" },
                          { value: "Lagos", label: "Lagos State" },
                          { value: "Abuja FCT", label: "Abuja FCT" },
                        ]}
                      />
                    </div>

                    {/* Regulatory Verification Checkbox */}
                    <label className="flex items-center justify-between pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] cursor-pointer">
                      <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Verified Practitioners Only
                      </span>
                      <input
                        type="checkbox"
                        checked={onlyVerified}
                        onChange={(e) => setOnlyVerified(e.target.checked)}
                        className="w-4 h-4 accent-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer rounded"
                      />
                    </label>

                    {/* Bookmarked Reps Only Checkbox */}
                    <label className="flex items-center justify-between pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] cursor-pointer">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-600,#D84C0B)]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          Bookmarked Reps Only
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
                          setSelectedDiscipline("All");
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

            {/* Invite a Representative Button (Matching Compact Icon Button from Find Companies) */}
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              title="Invite Representative"
              className="w-9 h-9 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 font-sans shrink-0"
            >
              <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </section>

        {/* ── Active Filter Summary Pills ── */}
        {isFilterActive && (
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">Active filters:</span>
            {selectedDiscipline !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                {selectedDiscipline}
                <button type="button" onClick={() => setSelectedDiscipline("All")} className="hover:opacity-75">×</button>
              </span>
            )}
            {selectedState !== "All States" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                {selectedState}
                <button type="button" onClick={() => setSelectedState("All States")} className="hover:opacity-75">×</button>
              </span>
            )}
            {onlyVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-[11px]">
                Verified Practitioners
                <button type="button" onClick={() => setOnlyVerified(false)} className="hover:opacity-75">×</button>
              </span>
            )}
            {onlyFavorites && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]">
                ♥ Bookmarked
                <button type="button" onClick={() => setOnlyFavorites(false)} className="hover:opacity-75">×</button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline("All");
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

        {/* ── CLIENT REPRESENTATIVES DIRECTORY GRID ── */}
        <div className="flex flex-col gap-3">
          <div className="pt-1">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Authorized Representatives ({filteredReps.length})
              </span>
              <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                Click any card to view their profile, credentials & inspection audit trail
              </span>
            </div>

            {/* Grid: 1 col on mobile, 2 col on tablet, 3-4 col on desktop (Exact match to Find Companies) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-12">
              {filteredReps.map((rep) => {
                const isFeatured = rep.isFeatured;

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedRep(rep)}
                    className={`group relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                      isFeatured
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-2 border-[var(--vt-color-orange-600,#D84C0B)] shadow-[0_12px_28px_rgba(239,95,24,0.22)]"
                        : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                    }`}
                  >
                    {/* Top Header of Card: Bookmark Heart + Quick Action Button */}
                    <div className="flex items-center justify-between w-full mb-3">
                      {/* Bookmark / Favorite Heart Icon */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(rep.id, e)}
                        title={rep.isFavorite ? "Remove bookmark" : "Bookmark representative"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isFeatured
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : rep.isFavorite
                            ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)]"
                            : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill={rep.isFavorite ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>

                      {/* Top Right Quick Action: View Profile Dossier */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRep(rep);
                        }}
                        title="View representative profile"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold ${
                          isFeatured
                            ? "bg-white text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-white/90 shadow-2xs"
                            : "bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-2xs"
                        }`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </button>
                    </div>

                    {/* Center Representative Photo Emblem & Title */}
                    <div className="flex flex-col items-center text-center my-4">
                      {/* Squircle Photo Badge */}
                      <div className="relative mb-3">
                        <img
                          src={rep.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face"}
                          alt={rep.name || "Representative"}
                          className={`w-16 h-16 rounded-2xl object-cover shadow-sm ${
                            isFeatured
                              ? "ring-2 ring-white/60"
                              : "ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/40"
                          }`}
                        />
                        {rep.isVerified && (
                          <span
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] text-white flex items-center justify-center text-[10px] font-bold shadow-xs"
                            title="Verified Practitioner"
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Rep Name */}
                      <h3
                        className={`text-base font-extrabold tracking-tight truncate max-w-full ${
                          isFeatured ? "text-white" : "text-[var(--vt-color-indigo-900,#261A66)]"
                        }`}
                      >
                        {rep.name}
                      </h3>

                      {/* Discipline / Role */}
                      <p
                        className={`text-[11.5px] font-semibold mt-1 line-clamp-1 ${
                          isFeatured ? "text-white/85" : "text-[var(--vt-color-neutral-500,#7C7894)]"
                        }`}
                      >
                        {rep.discipline} • {rep.location ? rep.location.split(",")[0] : rep.state || "Nigeria"}
                      </p>
                    </div>

                    {/* Bottom Footer Row: Clean Stages Verified + Site Count */}
                    <div
                      className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                        isFeatured
                          ? "border-white/20 text-white"
                          : "border-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]"
                      }`}
                    >
                      <span className={isFeatured ? "text-white/80 text-[11px]" : "text-[var(--vt-color-neutral-500,#7C7894)] text-[11px]"}>
                        {rep.stagesVerifiedCount ?? 0} {(rep.stagesVerifiedCount ?? 0) === 1 ? "Stage" : "Stages"} Verified
                      </span>

                      <span
                        className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md ${
                          isFeatured
                            ? "bg-white/20 text-white"
                            : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                        }`}
                      >
                        {(rep.assignedProjects || []).length} {(rep.assignedProjects || []).length === 1 ? "Site" : "Sites"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {/* ── CLIENT REPRESENTATIVE PROFILE DETAIL MODAL (Simplified & Clean) ── */}
      {selectedRep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
          >
            {/* Modal Header */}
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={selectedRep.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face"}
                    alt={selectedRep.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
                  />
                  {selectedRep.isVerified && (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] text-white flex items-center justify-center text-[9px] font-bold shadow-xs"
                      title="Verified Practitioner"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">{selectedRep.name}</h2>
                  <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
                    {selectedRep.title}
                  </p>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    {selectedRep.licenseNumber || "Accreditation Verification Pending"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRep(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Simplified & Focused */}
            <div className="p-5 flex flex-col gap-4 text-xs">
              {/* Contact Information Bar */}
              <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11.5px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                <span>{selectedRep.email}</span>
                <span>•</span>
                <span>{selectedRep.phone || "+234 800 000 0000"}</span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  {selectedRep.status}
                </span>
              </div>

              {/* Oversight Scope / Mandate */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                  Oversight Scope
                </span>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  {selectedRep.mandateSummary || "Authorized client representative appointed to oversee site milestones and quality assurance."}
                </p>
              </div>

              {/* Assigned Construction Sites */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1.5">
                  Assigned Sites ({(selectedRep.assignedProjects || []).length})
                </span>
                <div className="flex flex-col gap-1.5">
                  {(selectedRep.assignedProjects || []).map((p) => (
                    <Link
                      key={p.id || (p as any).projectId || Math.random().toString()}
                      href={`/owner/projects/${p.id || (p as any).projectId || "proj-lekki"}`}
                      className="p-2.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] flex items-center justify-between text-xs transition-colors cursor-pointer group"
                    >
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                        {p.title || (p as any).projectName || "Assigned Project"}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] flex items-center gap-1">
                        <span>{p.roleOnProject || "Representative"}</span>
                        <span className="text-[var(--vt-color-orange-500,#EF5F18)] opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Active Permissions (Clean Badges) */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1.5">
                  Active Delegated Permissions (PRD §5.2)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRep.permissions?.viewProgress && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#484564)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11px] font-bold">
                      ✓ View Progress
                    </span>
                  )}
                  {(selectedRep.permissions?.approveStages ?? (selectedRep.permissions as any)?.approveRejectStages) && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[11px] font-bold">
                      ✓ Stage Sign-Off
                    </span>
                  )}
                  {selectedRep.permissions?.managePayments && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[11px] font-bold">
                      ✓ Payments & Escrow
                    </span>
                  )}
                  {(selectedRep.permissions?.changeRequests ?? (selectedRep.permissions as any)?.suggestChanges) && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[11px] font-bold">
                      ✓ Change Requests
                    </span>
                  )}
                  {selectedRep.permissions?.messageContractor && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#484564)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11px] font-bold">
                      ✓ Direct Site Chat
                    </span>
                  )}
                  {selectedRep.permissions?.manageShareLinks && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#484564)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11px] font-bold">
                      ✓ Share Links
                    </span>
                  )}
                  {selectedRep.permissions?.invitePeople && (
                    <span className="px-2.5 py-1 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#484564)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11px] font-bold">
                      ✓ Invite People
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 font-sans">
              <button
                type="button"
                onClick={() => setSelectedRep(null)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  openPermissionsPage(selectedRep);
                }}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans active:scale-95"
              >
                Manage Permissions →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INVITE CLIENT REP MODAL (Matching Send Project Brief Modal from Find Companies) ── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
          >
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Invite Representative</h3>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
                  Dispatch onboarding invite code with delegated inspection rights
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inviteSuccessNotice ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Invitation Dispatched!
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-xs">
                  Unique link code has been sent to {inviteEmail}. Representative will be authorized upon acceptance.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="p-5 flex flex-col gap-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                    Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Kayode Adeleke"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kayode.adeleke@engineers.ng"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                      Professional Discipline
                    </label>
                    <VantagedSelect
                      value={inviteDiscipline}
                      onChange={(val) => setInviteDiscipline(val as ClientRepItem["discipline"])}
                      className="w-full h-9 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                      options={[
                        { value: "Structural & Civil", label: "Structural & Civil" },
                        { value: "Architecture", label: "Architecture" },
                        { value: "Quantity Surveying", label: "Quantity Surveying" },
                        { value: "MEP Engineering", label: "MEP Engineering" },
                        { value: "Marine & Geotech", label: "Marine & Geotech" },
                        { value: "Owner Proxy", label: "Owner Proxy" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                      Assign Site
                    </label>
                    <VantagedSelect
                      value={inviteProject}
                      onChange={(val) => setInviteProject(val)}
                      className="w-full h-9 px-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                      options={[
                        { value: "Lekki Phase 1 Luxury Villa", label: "Lekki Phase 1 Luxury Villa" },
                        { value: "The Enclave Waterfront Resort", label: "The Enclave Waterfront Resort" },
                        { value: "Guzape Hills Residence", label: "Guzape Hills Residence" },
                        { value: "Banana Island Horizon Penthouse", label: "Banana Island Horizon Penthouse" },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                    Role Description / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Project Structural Auditor"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div className="pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 font-sans"
                  >
                    Send Invitation Link →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
