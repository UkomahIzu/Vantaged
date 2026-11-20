"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  IconContractors,
  IconUsers,
  IconSearch,
  IconShield,
  IconCheckCircle,
  IconExternalLink,
} from "../../../../components/AdminIcons";
import {
  INITIAL_CONTRACTORS,
  ALL_PROJECTS,
  ContractorRecord,
  ProjectRecord,
} from "../../../../data/contractorsData";

export default function ContractorProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const contractorId = (params?.id as string) || "";

  const [liveContractor, setLiveContractor] = useState<ContractorRecord | null>(null);

  useEffect(() => {
    fetch("/api/contractors")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const match = data.data.find(
            (c: ContractorRecord) =>
              c.id === contractorId ||
              c.name.toLowerCase().replace(/\s+/g, "-") === contractorId.toLowerCase()
          );
          if (match) setLiveContractor(match);
        }
      })
      .catch(() => {});
  }, [contractorId]);

  // Lookup contractor (static or live API)
  const contractor = useMemo(() => {
    if (liveContractor) return liveContractor;
    return (
      INITIAL_CONTRACTORS.find((c) => c.id === contractorId) ||
      INITIAL_CONTRACTORS.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === contractorId.toLowerCase()
      ) ||
      null
    );
  }, [contractorId, liveContractor]);

  // Lookup contractor's projects
  const initialList = useMemo(() => {
    if (!contractor) return [];
    return ALL_PROJECTS.filter(
      (p) =>
        p.contractorId === contractor.id ||
        p.contractor.toLowerCase() === contractor.name.toLowerCase()
    );
  }, [contractor]);

  const [contractorProjects, setContractorProjects] = useState<ProjectRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setContractorProjects(initialList);
  }, [initialList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthorizeMilestone = async (project: ProjectRecord) => {
    const updated = contractorProjects.map((p) => {
      if (p.id === project.id) {
        return {
          ...p,
          status: "IN_PROGRESS" as const,
          stageProgress: "100%",
        };
      }
      return p;
    });

    setContractorProjects(updated);
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject({
        ...selectedProject,
        status: "IN_PROGRESS",
        stageProgress: "100%",
      });
    }

    // Log to audit
    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "ESCROW_DISBURSEMENT_AUTHORIZED",
        actionLabel: "Milestone Tranche Escrow Disbursement Authorized",
        target: `${project.id} · ${project.name}`,
        details: `Approved inspection evidence for ${project.stage}. Authorized release of ${project.escrowLocked} to ${project.contractor}.`,
        level: "SUCCESS",
      }),
    }).catch(() => {});

    showToast(`Escrow disbursement authorized for ${project.name}!`);
  };

  // Filtering & search
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);

  const filteredProjects = useMemo(() => {
    return contractorProjects.filter((p) => {
      let matchesStatus = true;
      if (statusFilter === "IN_PROGRESS") matchesStatus = p.status === "IN_PROGRESS";
      else if (statusFilter === "STAGE_APPROVAL_PENDING")
        matchesStatus = p.status === "STAGE_APPROVAL_PENDING";
      else if (statusFilter === "COMPLETED") matchesStatus = p.status === "COMPLETED";

      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.stage.toLowerCase().includes(q)
      );
    });
  }, [contractorProjects, statusFilter, searchQuery]);

  // Financial aggregates
  const totalEscrow = useMemo(() => {
    return contractorProjects.reduce((acc, p) => acc + (p.rawEscrow || 0), 0);
  }, [contractorProjects]);

  const pendingApprovalsCount = useMemo(() => {
    return contractorProjects.filter((p) => p.status === "STAGE_APPROVAL_PENDING").length;
  }, [contractorProjects]);

  const inProgressCount = useMemo(() => {
    return contractorProjects.filter((p) => p.status === "IN_PROGRESS").length;
  }, [contractorProjects]);

  const completedCount = useMemo(() => {
    return contractorProjects.filter((p) => p.status === "COMPLETED").length;
  }, [contractorProjects]);

  const formattedTotalEscrow = useMemo(() => {
    return `₦${totalEscrow.toLocaleString("en-NG")}`;
  }, [totalEscrow]);

  // Fallback if contractor not found
  if (!contractor) {
    return (
      <div
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="flex flex-col items-center justify-center min-h-[55vh] text-center p-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center mb-4">
          <IconContractors className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
          Contractor Not Found
        </h1>
        <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] max-w-sm mb-6">
          The requested company ID could not be located in the platform accredited contractor registry.
        </p>
        <Link
          href="/contractors"
          className="inline-flex items-center gap-2 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] px-4 py-2 text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)]"
        >
          <span>← Return to Contractor Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans pb-16"
    >
      {/* ── Top Navigation & Breadcrumb ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
          <Link
            href="/contractors"
            className="hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors flex items-center gap-1 font-semibold"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Contractor Directory</span>
          </Link>
          <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">/</span>
          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate max-w-[200px] sm:max-w-none">
            {contractor.name}
          </span>
          <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">/</span>
          <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold">Active Projects</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {toastMessage && (
            <div className="animate-in fade-in slide-in-from-top-1 px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center gap-1.5">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          <Link
            href="/contractors"
            className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all flex items-center gap-1.5"
          >
            <span>← All Contractors</span>
          </Link>
          <Link
            href="/subscriptions"
            className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all flex items-center gap-1.5"
          >
            <span>Quota & Slots</span>
          </Link>
        </div>
      </div>

      {/* ── Contractor Overview Banner ── */}
      <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Company Details */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white font-extrabold text-xl flex items-center justify-center shadow-[0_4px_12px_rgba(239,95,24,0.25)] shrink-0">
              {contractor.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF4EE)] px-2 py-0.5 rounded border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  {contractor.rcNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)]">
                  {contractor.plan}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified Legal Entity
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
                {contractor.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] pt-0.5">
                <span>
                  Lead Director: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{contractor.director}</strong> ({contractor.directorRole})
                </span>
                <span>·</span>
                <span>{contractor.state}</span>
                <span>·</span>
                <span>Bank: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{contractor.bankName}</strong> ({contractor.accountNumber})</span>
              </div>
            </div>
          </div>

          {/* Active Capacity Pill */}
          <div className="flex sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-[var(--vt-color-neutral-100,#EFEEF5)] pt-4 lg:pt-0 lg:pl-6 shrink-0">
            <div className="space-y-0.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] font-bold">
                Project Slot Quota
              </div>
              <div className="text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                {contractor.slotsUsed} <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] font-semibold">/ {contractor.slotsMax === 999 ? "Unlimited" : contractor.slotsMax} Slots</span>
              </div>
              <div className="text-[11px] text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                {contractor.slotsMax === 999
                  ? "Prime Unlimited Quota"
                  : `${contractor.slotsMax - contractor.slotsUsed} Slot(s) Remaining`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards for this Contractor's Builds ── */}
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
            Total Projects Contracted
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {contractorProjects.length.toString().padStart(2, "0")}
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
          <div className="text-[11px] font-semibold text-[var(--vt-color-orange-600,#D84C0B)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
            Milestone Approvals Pending
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
            {pendingApprovalsCount.toString().padStart(2, "0")}
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
          <div className="text-[11px] font-semibold text-[var(--vt-color-indigo-700,#43379A)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-indigo-600,#4F46E5)]" />
            Ongoing Site Construction
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {inProgressCount.toString().padStart(2, "0")}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
            Escrow Locked in Custody
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-1 truncate">
            {formattedTotalEscrow}
          </div>
        </div>
      </section>

      {/* ── Search & Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-3.5 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project title, site address, owner name..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All Sites (${contractorProjects.length})` },
            { id: "IN_PROGRESS", label: `In Progress (${inProgressCount})` },
            { id: "STAGE_APPROVAL_PENDING", label: `Approval Pending (${pendingApprovalsCount})` },
            { id: "COMPLETED", label: `Completed (${completedCount})` },
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

      {/* ── Contractor's Projects Table ── */}
      <div className="w-full bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              <th className="py-3 px-3 sm:px-4 w-[32%]">Project & Location</th>
              <th className="py-3 px-3 sm:px-4 w-[24%]">Owner / Client</th>
              <th className="py-3 px-3 sm:px-4 w-[20%]">Milestone Stage & Progress</th>
              <th className="py-3 px-3 sm:px-4 w-[14%]">Escrow Locked</th>
              <th className="py-3 px-3 sm:px-4 w-[10%] text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  <svg className="w-10 h-10 mx-auto mb-2.5 text-[var(--vt-color-neutral-300,#CBC8DA)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">No projects found</p>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                    No active sites match the selected criteria for this contractor.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setSearchQuery("");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--vt-color-orange-500,#EF5F18)] hover:underline cursor-pointer"
                  >
                    Clear search filter
                  </button>
                </td>
              </tr>
            ) : (
              filteredProjects.map((proj) => (
                <tr
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`group hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 transition-colors cursor-pointer ${
                    selectedProject?.id === proj.id ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/80" : ""
                  }`}
                >
                  {/* Project & Location */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs flex items-center justify-center border border-[var(--vt-color-indigo-100,#EAE8F9)] shrink-0">
                        <IconUsers className="w-4 h-4 text-[var(--vt-color-indigo-600,#4F46E5)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                          {proj.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                          <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">{proj.id}</span>
                          <span>·</span>
                          <span>{proj.location}</span>
                          <span>·</span>
                          <span>{proj.state}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner / Client */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {proj.owner}
                    </div>
                    <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                      {proj.ownerType} · {proj.ownerPhone}
                    </div>
                  </td>

                  {/* Milestone Stage & Progress */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate pr-2">
                        {proj.stage.split(":")[0]} ({proj.stageNumber}/{proj.totalStages})
                      </span>
                      <span className="font-mono font-bold text-[var(--vt-color-orange-600,#D84C0B)] text-[11px]">
                        {proj.stageProgress}
                      </span>
                    </div>
                    <div className="w-full bg-[var(--vt-color-neutral-100,#EFEEF5)] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--vt-color-orange-500,#EF5F18)] h-full rounded-full transition-all duration-300"
                        style={{ width: proj.stageProgress }}
                      />
                    </div>
                    <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-1">
                      {proj.stage.split(":")[1]?.trim() || proj.stage}
                    </div>
                  </td>

                  {/* Escrow Locked */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-mono font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {proj.escrowLocked}
                    </div>
                    <div className="mt-0.5">
                      {proj.status === "STAGE_APPROVAL_PENDING" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                          Review Due
                        </span>
                      ) : proj.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#134427)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                          <span>✓ Handed Over</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                          <span>✓ CBN Vault</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Inspect Action */}
                  <td className="py-3 px-3 sm:px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(proj)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-700,#443E63)] hover:text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA06E)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Inspect</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Project Inspection Modal Drawer ── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start justify-between gap-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0">
                  <IconUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                      {selectedProject.id}
                    </span>
                    <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">·</span>
                    <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">{selectedProject.location}, {selectedProject.state}</span>
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
              {/* Escrow & Stage Progress Highlight */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    Current Milestone
                  </div>
                  <div className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {selectedProject.stage}
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Stage Progress: <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">{selectedProject.stageProgress}</span> ({selectedProject.stageNumber} of {selectedProject.totalStages} Milestones)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    Escrow Locked (CBN Custody)
                  </div>
                  <div className="text-base font-mono font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                    {selectedProject.escrowLocked}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    ✓ Protected under CBN Escrow Mandate
                  </div>
                </div>
              </div>

              {/* Stakeholders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Client / Owner */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Client / Property Owner
                  </h3>
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedProject.owner}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      {selectedProject.ownerType}
                    </div>
                    <div className="text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)] pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {selectedProject.ownerEmail}
                    </div>
                    <div className="text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                      {selectedProject.ownerPhone}
                    </div>
                  </div>
                </div>

                {/* Assigned Contractor */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Accredited Contractor
                  </h3>
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedProject.contractor}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      Director: {selectedProject.contractorDirector}
                    </div>
                    <div className="text-xs font-mono text-[var(--vt-color-orange-600,#D84C0B)] pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] font-bold">
                      {contractor.rcNumber} · {contractor.plan}
                    </div>
                    <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                      Settlement: {contractor.bankName} ({contractor.accountNumber})
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Evidence Checklist for this Milestone */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5 flex items-center justify-between">
                  <span>Mandatory Quality Evidence & Proof of Work</span>
                  <span className="text-[10px] text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    {selectedProject.requiredEvidence.length} Checkpoints
                  </span>
                </h3>

                <div className="space-y-2">
                  {selectedProject.requiredEvidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[var(--vt-color-orange-200,#FDCAA9)]">
                        {idx + 1}
                      </span>
                      <div className="flex-1 text-xs text-[var(--vt-color-neutral-700,#443E63)] font-medium">
                        {ev}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 shrink-0">
                        Uploaded
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit & Legal Visibility Note */}
              <div className="p-3.5 rounded-xl border border-[var(--vt-color-indigo-100,#EAE8F9)] bg-[var(--vt-color-indigo-50,#F4F3FC)] flex items-start gap-2.5">
                <IconShield className="w-4 h-4 text-[var(--vt-color-indigo-600,#4F46E5)] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[var(--vt-color-indigo-900,#261A66)] leading-relaxed">
                  <strong>NDPA & Escrow Audit Notice:</strong> Platform admin project inspection is strictly restricted to verifying quality milestones for escrow release authorization and statutory safety compliance.
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all cursor-pointer"
              >
                Close
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {selectedProject.status === "STAGE_APPROVAL_PENDING" && (
                  <button
                    type="button"
                    onClick={() => handleAuthorizeMilestone(selectedProject)}
                    className="h-9 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✓ Authorize Escrow Disbursement ({selectedProject.escrowLocked})</span>
                  </button>
                )}

                <Link
                  href="/disputes"
                  className="h-9 px-3.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Risk Radar</span>
                </Link>
                <Link
                  href="/presets"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Compare Preset Checklist</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

