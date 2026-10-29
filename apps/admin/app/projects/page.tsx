"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconSearch,
  IconShield,
  IconCheckCircle,
  IconExternalLink,
} from "../../components/AdminIcons";

interface ProjectRecord {
  id: string;
  name: string;
  owner: string;
  ownerType: string;
  ownerEmail: string;
  ownerPhone: string;
  contractor: string;
  contractorDirector: string;
  location: string;
  state: string;
  stage: string;
  stageProgress: string;
  stageNumber: number;
  totalStages: number;
  escrowLocked: string;
  rawEscrow: number;
  repsCount: number;
  status: "IN_PROGRESS" | "STAGE_APPROVAL_PENDING" | "COMPLETED";
  requiredEvidence: string[];
}

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "PRJ-LEK-0012",
    name: "Lekki Phase 1 Luxury Villa",
    owner: "Chief Olumide Adeyemi",
    ownerType: "Individual Client",
    ownerEmail: "o.adeyemi@lagoshomes.ng",
    ownerPhone: "+234 803 219 4021",
    contractor: "Julius B. Consortium",
    contractorDirector: "Engr. Chidi Okafor",
    location: "Admiralty Way, Lekki",
    state: "Lagos",
    stage: "Stage 4: Upper Floor Concrete Pouring",
    stageProgress: "82%",
    stageNumber: 4,
    totalStages: 6,
    escrowLocked: "₦145,000,000",
    rawEscrow: 145000000,
    repsCount: 2,
    status: "IN_PROGRESS",
    requiredEvidence: [
      "Concrete compressive strength cube test (38.5 MPa)",
      "Rebar alignment certificate by COREN structural lead",
      "Formwork prop density site inspection log",
    ],
  },
  {
    id: "PRJ-ABJ-0822",
    name: "Maitama Heights Residential",
    owner: "Oakwood Properties Ltd",
    ownerType: "Organisation Client",
    ownerEmail: "tenders@oakwoodng.com",
    ownerPhone: "+234 802 110 9982",
    contractor: "Apex Structure & Civil Engineering",
    contractorDirector: "Engr. Babatunde Adeleke",
    location: "Maitama, Abuja",
    state: "Abuja",
    stage: "Stage 3: Superstructure Frame (1st Floor Slab)",
    stageProgress: "60%",
    stageNumber: 3,
    totalStages: 5,
    escrowLocked: "₦120,000,000",
    rawEscrow: 120000000,
    repsCount: 4,
    status: "IN_PROGRESS",
    requiredEvidence: [
      "Batch plant delivery receipts for 45m³ C30 concrete",
      "MEP conduit conduit electrical continuity report",
      "Laser level horizontality verification",
    ],
  },
  {
    id: "PRJ-EPE-0104",
    name: "The Enclave Waterfront Resort",
    owner: "Enclave Waterfront Ltd",
    ownerType: "Organisation Client",
    ownerEmail: "developments@enclave.ng",
    ownerPhone: "+234 818 902 3341",
    contractor: "Crane & Stone Engineering Limited",
    contractorDirector: "Engr. Babatunde Julius Adeleke",
    location: "Epe Waterfront Corridor",
    state: "Lagos",
    stage: "Stage 2: Marine Sheet Piling & Deep Ground Piles",
    stageProgress: "44%",
    stageNumber: 2,
    totalStages: 7,
    escrowLocked: "₦82,500,000",
    rawEscrow: 82500000,
    repsCount: 3,
    status: "IN_PROGRESS",
    requiredEvidence: [
      "Pile driving resistance log (SET criteria confirmed)",
      "Marine corrosion inhibitor application certificate",
      "Dewatering pump continuity inspection report",
    ],
  },
  {
    id: "PRJ-LG-0419",
    name: "The Coral Horizon Duplex",
    owner: "Adeyemi Johnson",
    ownerType: "Individual Client",
    ownerEmail: "adeyemi.j@gmail.com",
    ownerPhone: "+234 805 443 1928",
    contractor: "Prestige Build & MEP Specialists",
    contractorDirector: "Engr. Fatima Bello",
    location: "Ikoyi, Lagos",
    state: "Lagos",
    stage: "Stage 1: Substructure & Foundation",
    stageProgress: "85%",
    stageNumber: 1,
    totalStages: 5,
    escrowLocked: "₦45,000,000",
    rawEscrow: 45000000,
    repsCount: 2,
    status: "IN_PROGRESS",
    requiredEvidence: [
      "Soil bearing capacity signoff by geotechnical engineer",
      "Damp Proof Membrane (DPC) installation photographs",
      "German floor concrete pour certification",
    ],
  },
  {
    id: "PRJ-KN-0193",
    name: "Nassarawa Commercial Plaza",
    owner: "Alhaji Musa Dangote",
    ownerType: "Individual Client",
    ownerEmail: "m.dangote@kplazang.com",
    ownerPhone: "+234 803 999 1827",
    contractor: "Kano Skyline Contractors",
    contractorDirector: "Alhaji Ibrahim Danjuma",
    location: "Nassarawa, Kano",
    state: "Kano",
    stage: "Stage 1: Pre-Construction & Site Prep",
    stageProgress: "20%",
    stageNumber: 1,
    totalStages: 6,
    escrowLocked: "₦28,000,000",
    rawEscrow: 28000000,
    repsCount: 1,
    status: "STAGE_APPROVAL_PENDING",
    requiredEvidence: [
      "Perimeter site hoarding & signage completion",
      "Cadastral beacon boundary verification certificate",
      "Site store material security confirmation",
    ],
  },
];

export default function ProjectsSupportPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);

  // Filter logic
  const filtered = projects.filter((p) => {
    let matchesFilter = true;
    if (statusFilter === "IN_PROGRESS") matchesFilter = p.status === "IN_PROGRESS";
    else if (statusFilter === "STAGE_APPROVAL_PENDING") matchesFilter = p.status === "STAGE_APPROVAL_PENDING";
    else if (statusFilter === "LAGOS") matchesFilter = p.state === "Lagos";
    else if (statusFilter === "ABUJA") matchesFilter = p.state === "Abuja";
    else if (statusFilter === "KANO") matchesFilter = p.state === "Kano";

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.owner.toLowerCase().includes(term) ||
      p.contractor.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  // KPI calculations
  const countInProgress = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const countPending = projects.filter((p) => p.status === "STAGE_APPROVAL_PENDING").length;
  const totalEscrow = projects.reduce((acc, p) => acc + p.rawEscrow, 0);
  const formattedTotalEscrow = `₦${(totalEscrow / 1000000).toFixed(1)}M`;

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <IconUsers className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Oversight & Accounts
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
            Projects & User Support
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
            Monitor client accounts, milestone stage sign-offs, representative oversight, and locked escrow funds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/contractors"
            className="h-10 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs"
          >
            <span>Contractor Directory</span>
          </Link>
          <Link
            href="/verifications"
            className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-2"
          >
            <span>Verification Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25 font-bold">2</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards matching Verification Queue & Directory */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "ALL"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
            Total Monitored Sites
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {projects.length.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("IN_PROGRESS")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "IN_PROGRESS"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
            Active In Progress
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
            {countInProgress.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("STAGE_APPROVAL_PENDING")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "STAGE_APPROVAL_PENDING"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-orange-700,#B33C08)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
            Stage Sign-off Pending
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
            {countPending.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white shadow-2xs"
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-indigo-700,#43379A)]">
            Total Escrow Vaults
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1 font-mono">
            {formattedTotalEscrow}
          </div>
        </div>
      </section>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-3.5 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search project ID, title, owner, contractor, location..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All (${projects.length})` },
            { id: "IN_PROGRESS", label: `In Progress (${countInProgress})` },
            { id: "STAGE_APPROVAL_PENDING", label: `Pending (${countPending})` },
            { id: "LAGOS", label: "Lagos" },
            { id: "ABUJA", label: "Abuja" },
            { id: "KANO", label: "Kano" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                  : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table with Zero Horizontal Scroll */}
      <div className="w-full bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              <th className="py-3 px-3 sm:px-4 w-[34%]">Project Scope & Location</th>
              <th className="py-3 px-3 sm:px-4 w-[24%]">Contractor & Client</th>
              <th className="py-3 px-3 sm:px-4 w-[20%]">Active Stage</th>
              <th className="py-3 px-3 sm:px-4 w-[22%]">Escrow Locked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  <svg className="w-10 h-10 mx-auto mb-2.5 text-[var(--vt-color-neutral-300,#CBC8DA)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">No projects found</p>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">Try clearing your filters or search keywords.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setSearchTerm("");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--vt-color-orange-500,#EF5F18)] hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedProject(item)}
                  className={`group hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/40 transition-colors cursor-pointer ${
                    selectedProject?.id === item.id ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/70" : ""
                  }`}
                >
                  {/* Project Scope & Location */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs flex items-center justify-center border border-[var(--vt-color-indigo-100,#EAE8F9)] shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                          <span>{item.id}</span>
                          <span> · </span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contractor & Client */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-semibold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {item.contractor}
                    </div>
                    <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                      Client: {item.owner} ({item.repsCount} Reps)
                    </div>
                  </td>

                  {/* Active Stage & Progress */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-semibold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {item.stage.split(":")[1]?.trim() || item.stage}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 sm:w-20 h-1.5 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] transition-all"
                          style={{ width: item.stageProgress }}
                        />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                        {item.stageProgress}
                      </span>
                    </div>
                  </td>

                  {/* Escrow Locked */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs sm:text-sm">
                      {item.escrowLocked}
                    </div>
                    <div className="mt-0.5">
                      {item.status === "IN_PROGRESS" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                          Pending Sign-off
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Project Support & Oversight Drawer / Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start justify-between gap-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0">
                  {selectedProject.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                      {selectedProject.id}
                    </span>
                    <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">·</span>
                    <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">{selectedProject.location}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                    {selectedProject.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-[var(--vt-color-text-default,#261A66)]">
              {/* Escrow Vault & Progress Banner */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    Escrow Vault Locked
                  </div>
                  <div className="text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 font-mono">
                    {selectedProject.escrowLocked}
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Stage {selectedProject.stageNumber} of {selectedProject.totalStages} ({selectedProject.stageProgress} progress)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedProject.status === "IN_PROGRESS" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                      BUILD IN PROGRESS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                      SIGN-OFF PENDING
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Assigned Contractor */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Assigned Contractor Firm
                  </h3>
                  <div className="space-y-1.5">
                    <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedProject.contractor}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      Lead: {selectedProject.contractorDirector}
                    </div>
                    <div className="text-[11px] text-[var(--vt-color-green-700,#1F6B3E)] font-semibold pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      ✓ COREN Verified Enterprise Access Active
                    </div>
                  </div>
                </div>

                {/* Client & Representatives */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Client & Representatives
                  </h3>
                  <div className="space-y-1.5">
                    <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedProject.owner}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      {selectedProject.ownerType} · {selectedProject.repsCount} Authorized Reps
                    </div>
                    <div className="text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)] pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {selectedProject.ownerEmail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Milestone Stage Details */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono">
                    Active Milestone & Inspection Evidence
                  </h3>
                  <span className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                    {selectedProject.stageProgress} Done
                  </span>
                </div>
                <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] mb-2">
                  {selectedProject.stage}
                </div>
                <div className="space-y-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  {selectedProject.requiredEvidence.map((ev, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[var(--vt-color-green-600,#2E9E57)] font-bold">✓</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href="/disputes"
                  className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Risk Radar</span>
                </Link>
                <Link
                  href="/contractors"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Contractor Dossier</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
