"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { useContractorUser } from "../hooks/useContractorUser";
import { readLocalData, writeLocalData } from "../utils/localPersistence";
import {
  KEY_REGISTERED_CONTRACTORS,
  readLocalContractorAccounts,
} from "../../../shared/vantagedAuth";
import {
  AddTeamMemberModal,
  TEAM_ROSTER_UPDATE_EVENT,
  type TeamPersonnelCardItem,
  type TeamRole,
} from "../components/AddTeamMemberModal";

export type { TeamPersonnelCardItem, TeamRole };

const INITIAL_PERSONNEL: TeamPersonnelCardItem[] = [
  {
    id: "tm-1",
    name: "Engr. Babatunde Adeleke",
    title: "Managing Director & Principal Engineer",
    role: "Director",
    credential: "COREN #RC-39412 / FNSE",
    location: "Victoria Island HQ, Lagos",
    email: "b.adeleke@apexstructure.ng",
    phone: "+234 803 411 9021",
    assignedSites: 3,
    assignedProjectName: "All Active Sites",
    points: 0,
    attendanceRate: 100,
    status: "ACTIVE",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80",
    isFeatured: true,
    isStarred: true,
    specialties: [
      "Executive Sign-Off",
      "Escrow Governance",
      "Structural QA",
      "Client Relations",
    ],
  },
  {
    id: "tm-2",
    name: "Engr. Tunde Bakare",
    title: "Senior Site Operations Manager",
    role: "Site Manager",
    credential: "COREN #RC-51820 / MNSE",
    location: "Lekki Phase 1, Lagos",
    email: "t.bakare@apexstructure.ng",
    phone: "+234 805 229 4410",
    assignedSites: 2,
    assignedProjectName: "Lekki Phase 1 Five-Bedroom Villa",
    points: 420,
    attendanceRate: 98.5,
    status: "ON_SITE",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80",
    isStarred: true,
    specialties: [
      "Slab & Decking Casts",
      "Cube Crush Logs",
      "Daily Site Proofs",
      "Rebar Inspection",
    ],
  },
  {
    id: "tm-3",
    name: "Amaka Nwosu",
    title: "Office & Escrow Coordinator",
    role: "Office Coordinator",
    credential: "NIQS Associate / Project Admin",
    location: "Victoria Island HQ, Lagos",
    email: "a.nwosu@apexstructure.ng",
    phone: "+234 809 731 1184",
    assignedSites: 3,
    assignedProjectName: "Central Finance & Receipts",
    points: 315,
    attendanceRate: 99.2,
    status: "ACTIVE",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&auto=format&fit=crop&q=80",
    specialties: [
      "NIP Receipt Audit",
      "BOQ & Procurement",
      "Subcontractor Ledgers",
      "Compliance Filing",
    ],
  },
  {
    id: "tm-4",
    name: "Suleiman Ibrahim",
    title: "Lead Structural Foreman",
    role: "Crew Member",
    credential: "Trade Cert · Master Mason & Steel",
    location: "Ikoyi & Lekki, Lagos",
    email: "s.ibrahim@apexstructure.ng",
    phone: "+234 802 640 8821",
    assignedSites: 2,
    assignedProjectName: "Banana Island Terrace Apartments",
    points: 280,
    attendanceRate: 97.4,
    status: "ON_SITE",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80",
    specialties: [
      "Formwork & Shoring",
      "Steel Bending",
      "Concrete Vibration",
      "Crew Supervision",
    ],
  },
  {
    id: "tm-5",
    name: "Engr. Chidinma Okafor",
    title: "MEP & Building Services Lead",
    role: "Site Manager",
    credential: "COREN #RC-60214 / IEEE",
    location: "Maitama, Abuja",
    email: "c.okafor@apexstructure.ng",
    phone: "+234 813 552 3901",
    assignedSites: 1,
    assignedProjectName: "Maitama Commercial Complex Annex",
    points: 360,
    attendanceRate: 98.0,
    status: "ON_SITE",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80",
    specialties: [
      "3-Phase Distribution",
      "PEX Pressure Testing",
      "HVAC Ducting",
      "Fire Suppression",
    ],
  },
  {
    id: "tm-6",
    name: "Kazeem Adeyemi",
    title: "Finishing & Tiling Crew Lead",
    role: "Crew Member",
    credential: "CORBON Trade Certified",
    location: "Lekki Phase 1, Lagos",
    email: "k.adeyemi@apexstructure.ng",
    phone: "+234 806 912 7730",
    assignedSites: 1,
    assignedProjectName: "Lekki Phase 1 Five-Bedroom Villa",
    points: 245,
    attendanceRate: 96.5,
    status: "ON_SITE",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80",
    specialties: [
      "POP Ceilings",
      "Porcelain Tiling",
      "External Rendering",
      "Snag Rectification",
    ],
  },
];

export function DirectorTeamPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_team_page");
  const { isDemoMode } = useDirectorDemoMode();
  const contractorUser = useContractorUser();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "onsite">("all");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [demoRoster, setDemoRoster] = useState<TeamPersonnelCardItem[]>(() =>
    readLocalData("vantaged_director_team_demo_roster", INITIAL_PERSONNEL)
  );
  const [customRoster, setCustomRoster] = useState<TeamPersonnelCardItem[]>(() =>
    readLocalData("vantaged_director_team_custom_roster", [])
  );
  const [selectedPerson, setSelectedPerson] = useState<TeamPersonnelCardItem | null>(null);
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [editRole, setEditRole] = useState<TeamRole>("Site Manager");
  const [editSite, setEditSite] = useState("");
  const [resetPasswordInput, setResetPasswordInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const syncCustom = () => {
      setCustomRoster(readLocalData("vantaged_director_team_custom_roster", []));
    };
    window.addEventListener(TEAM_ROSTER_UPDATE_EVENT, syncCustom);
    window.addEventListener("storage", syncCustom);
    return () => {
      window.removeEventListener(TEAM_ROSTER_UPDATE_EVENT, syncCustom);
      window.removeEventListener("storage", syncCustom);
    };
  }, []);

  const roster = useMemo(
    () => (isDemoMode ? [...customRoster, ...demoRoster] : customRoster),
    [isDemoMode, customRoster, demoRoster]
  );

  const onSiteCount = useMemo(
    () => roster.filter((p) => p.status === "ON_SITE").length,
    [roster]
  );

  const filteredPersonnel = useMemo(() => {
    return roster.filter((p) => {
      if (activeTab === "onsite" && p.status !== "ON_SITE") return false;
      if (selectedRole !== "All" && p.role !== selectedRole) return false;
      if (onlyStarred && !p.isStarred) return false;
      return true;
    });
  }, [roster, activeTab, selectedRole, onlyStarred]);

  const isFilterActive = selectedRole !== "All" || onlyStarred;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextDemo = demoRoster.map((m) =>
      m.id === id ? { ...m, isStarred: !m.isStarred } : m
    );
    const nextCustom = customRoster.map((m) =>
      m.id === id ? { ...m, isStarred: !m.isStarred } : m
    );
    setDemoRoster(nextDemo);
    setCustomRoster(nextCustom);
    writeLocalData("vantaged_director_team_demo_roster", nextDemo);
    writeLocalData("vantaged_director_team_custom_roster", nextCustom);
  };

  const handleToggleStatus = (person: TeamPersonnelCardItem) => {
    const nextStatus: "ON_SITE" | "ACTIVE" =
      person.status === "ON_SITE" ? "ACTIVE" : "ON_SITE";
    const nextDemo = demoRoster.map((m) =>
      m.id === person.id ? { ...m, status: nextStatus } : m
    );
    const nextCustom = customRoster.map((m) =>
      m.id === person.id ? { ...m, status: nextStatus } : m
    );
    setDemoRoster(nextDemo);
    setCustomRoster(nextCustom);
    writeLocalData("vantaged_director_team_demo_roster", nextDemo);
    writeLocalData("vantaged_director_team_custom_roster", nextCustom);
    setSelectedPerson((prev) =>
      prev && prev.id === person.id ? { ...prev, status: nextStatus } : prev
    );
    showToast(
      `${person.name} marked as ${nextStatus === "ON_SITE" ? "On Site" : "Active (Office)"}.`
    );
  };

  const handleOpenPersonDossier = (person: TeamPersonnelCardItem) => {
    setSelectedPerson(person);
    setEditRole(person.role);
    setEditSite(person.assignedProjectName);
    setResetPasswordInput("");
    setIsEditingPerson(false);
  };

  const handleSavePersonEdits = async () => {
    if (!selectedPerson) return;
    const nextDemo = demoRoster.map((m) =>
      m.id === selectedPerson.id
        ? { ...m, role: editRole, assignedProjectName: editSite.trim() || m.assignedProjectName }
        : m
    );
    const nextCustom = customRoster.map((m) =>
      m.id === selectedPerson.id
        ? { ...m, role: editRole, assignedProjectName: editSite.trim() || m.assignedProjectName }
        : m
    );
    setDemoRoster(nextDemo);
    setCustomRoster(nextCustom);
    writeLocalData("vantaged_director_team_demo_roster", nextDemo);
    writeLocalData("vantaged_director_team_custom_roster", nextCustom);
    window.dispatchEvent(new Event(TEAM_ROSTER_UPDATE_EVENT));

    if (resetPasswordInput.trim().length >= 6 && selectedPerson.email) {
      const normalizedEmail = selectedPerson.email.trim().toLowerCase();
      try {
        await fetch("/api/contractor-accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: contractorUser.companyName || "Verified Construction Company",
            rcNumber: contractorUser.rcNumber || "RC-VERIFIED",
            directorName: selectedPerson.name,
            email: normalizedEmail,
            password: resetPasswordInput.trim(),
            role: editRole,
            phone: selectedPerson.phone,
            issuedBy: "Company Director",
          }),
        });
      } catch {}
      const localAccounts = readLocalContractorAccounts();
      const updatedAccounts = localAccounts.map((acc) =>
        acc.email.trim().toLowerCase() === normalizedEmail
          ? { ...acc, role: editRole, password: resetPasswordInput.trim() }
          : acc
      );
      localStorage.setItem(KEY_REGISTERED_CONTRACTORS, JSON.stringify(updatedAccounts));
    }

    setSelectedPerson((prev) =>
      prev
        ? { ...prev, role: editRole, assignedProjectName: editSite.trim() || prev.assignedProjectName }
        : prev
    );
    setResetPasswordInput("");
    setIsEditingPerson(false);
    showToast(
      resetPasswordInput.trim().length >= 6
        ? `Updated ${selectedPerson.name}'s role, site & login password!`
        : `Updated ${selectedPerson.name}'s role and site assignment!`
    );
  };

  const handleRemoveMember = (person: TeamPersonnelCardItem) => {
    const nextDemo = demoRoster.filter((m) => m.id !== person.id);
    const nextCustom = customRoster.filter((m) => m.id !== person.id);
    setDemoRoster(nextDemo);
    setCustomRoster(nextCustom);
    writeLocalData("vantaged_director_team_demo_roster", nextDemo);
    writeLocalData("vantaged_director_team_custom_roster", nextCustom);
    window.dispatchEvent(new Event(TEAM_ROSTER_UPDATE_EVENT));
    setSelectedPerson(null);
    showToast(`Removed ${person.name} from Team & Crew.`);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      {/* Decorative vector background lines (matching Inspectors Page) */}
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

      <DirectorSidebarNav currentActiveItem="team" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <Link
              href="/contractor/dashboard"
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

        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header Row (Matching Inspectors Page) */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Team &amp; Crew
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium mt-0.5">
              Company directors, site managers, office coordinators, and field crew personnel across active sites.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap">
            {/* View Switcher: All Personnel vs On-Site */}
            <div className="h-9 p-0.5 bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center shadow-2xs font-sans">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`h-full px-3.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                All Personnel ({roster.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("onsite")}
                className={`h-full px-3.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "onsite"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                On Site ({onSiteCount})
              </button>
            </div>

            {/* Filter Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`h-9 px-3.5 rounded-md border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isFilterActive
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-400,#F78241)] text-[var(--vt-color-orange-700,#B33C08)]"
                    : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 w-72 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-4 flex flex-col gap-3.5 text-xs">
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1.5">
                        Role
                      </span>
                      <VantagedSelect
                        value={selectedRole}
                        onChange={(val) => setSelectedRole(val)}
                        options={[
                          { value: "All", label: "All Roles" },
                          { value: "Director", label: "Director" },
                          { value: "Site Manager", label: "Site Manager" },
                          { value: "Office Coordinator", label: "Office Coordinator" },
                          { value: "Crew Member", label: "Crew Member" },
                        ]}
                      />
                    </div>

                    <label className="flex items-center justify-between cursor-pointer pt-1">
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Starred Personnel Only
                      </span>
                      <input
                        type="checkbox"
                        checked={onlyStarred}
                        onChange={(e) => setOnlyStarred(e.target.checked)}
                        className="w-4 h-4 accent-[#EF5F18]"
                      />
                    </label>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("All");
                          setOnlyStarred(false);
                        }}
                        className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-600,#D84C0B)] cursor-pointer"
                      >
                        Reset Filters
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="h-7 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-xs font-bold cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Add Team Member Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>+ Add Team Member</span>
            </button>
          </div>
        </section>

        {/* Personnel Cards Directory Grid (Matches Inspectors Card Anatomy 1:1) */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Registered Personnel ({filteredPersonnel.length})
            </span>
            <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
              Click any card to view role, site assignment &amp; attendance
            </span>
          </div>

          {filteredPersonnel.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 shadow-xs">
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                No Team &amp; Crew Personnel Added Yet
              </h3>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-1">
                Invite Site Managers, Office Coordinators, and Crew Foremen to manage site attendance, daily proofs, and rewards.
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Team Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-12">
              {filteredPersonnel.map((person) => {
                const isFeatured = person.isFeatured;
                return (
                  <div
                    key={person.id}
                    onClick={() => handleOpenPersonDossier(person)}
                    className={`group relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                      isFeatured
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-2 border-[var(--vt-color-orange-600,#D84C0B)] shadow-[0_12px_28px_rgba(239,95,24,0.22)]"
                        : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                    }`}
                  >
                    {/* Top Header of Card: Star + On-Site Status Pill */}
                    <div className="flex items-center justify-between w-full mb-3">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStar(person.id, e)}
                        title={person.isStarred ? "Remove bookmark" : "Star personnel"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isFeatured
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : person.isStarred
                            ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)]"
                            : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill={person.isStarred ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                          isFeatured
                            ? "bg-white/20 text-white"
                            : person.status === "ON_SITE"
                            ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                            : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isFeatured
                              ? "bg-white"
                              : person.status === "ON_SITE"
                              ? "bg-[var(--vt-color-green-500,#2E9E57)] animate-pulse"
                              : "bg-[var(--vt-color-neutral-400,#A3A0B8)]"
                          }`}
                        />
                        {person.status === "ON_SITE" ? "On Site" : "Active"}
                      </span>
                    </div>

                    {/* Center Avatar & Identity */}
                    <div className="flex flex-col items-center text-center my-2">
                      <div className="mb-3">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className={`w-16 h-16 rounded-2xl object-cover shadow-sm ${
                            isFeatured
                              ? "ring-2 ring-white"
                              : "border border-[var(--vt-color-border-default,#E2E0EC)]"
                          }`}
                        />
                      </div>

                      <h3
                        className={`text-base font-extrabold tracking-tight truncate max-w-full ${
                          isFeatured ? "text-white" : "text-[var(--vt-color-indigo-900,#261A66)]"
                        }`}
                      >
                        {person.name}
                      </h3>

                      <p
                        className={`text-[11.5px] font-semibold mt-1 line-clamp-1 ${
                          isFeatured ? "text-white/85" : "text-[var(--vt-color-neutral-500,#7C7894)]"
                        }`}
                      >
                        {person.role} • {person.location.split(",")[0]}
                      </p>
                    </div>

                    {/* Attendance / Reliability Bar */}
                    <div className="my-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={isFeatured ? "text-white/80" : "text-[var(--vt-color-neutral-500,#7C7894)]"}>
                          Site Attendance
                        </span>
                        <span
                          className={
                            isFeatured
                              ? "text-white font-extrabold"
                              : "text-[var(--vt-color-orange-600,#D84C0B)] font-extrabold"
                          }
                        >
                          {person.attendanceRate}%
                        </span>
                      </div>

                      <div
                        className={`w-full h-1.5 rounded-full overflow-hidden ${
                          isFeatured ? "bg-white/25" : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFeatured ? "bg-white" : "bg-[var(--vt-color-orange-500,#EF5F18)]"
                          }`}
                          style={{ width: `${person.attendanceRate}%` }}
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
                      <span className="text-[11px] font-mono">
                        {person.points > 0 ? `${person.points} pts` : "Principal"}
                      </span>

                      <span
                        className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md ${
                          isFeatured
                            ? "bg-white/20 text-white"
                            : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                        }`}
                      >
                        {person.assignedSites} {person.assignedSites === 1 ? "site" : "sites"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Personnel Dossier Modal (Portaled above navbar with Edit Role/Site, Reset Password & Remove) */}
      {mounted &&
        selectedPerson &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
            onClick={() => setSelectedPerson(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-[var(--vt-color-text-default,#261A66)]"
            >
              <div className="p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-start justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedPerson.avatar}
                    alt={selectedPerson.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                      {selectedPerson.role} · {selectedPerson.credential}
                    </span>
                    <h2 className="text-lg font-extrabold text-white mt-0.5">
                      {selectedPerson.name}
                    </h2>
                    <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)]">
                      {selectedPerson.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPerson(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Assigned Sites
                    </span>
                    <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                      {selectedPerson.assignedSites}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Attendance
                    </span>
                    <p className="text-base font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5">
                      {selectedPerson.attendanceRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Reward Points
                    </span>
                    <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                      {selectedPerson.points}
                    </p>
                  </div>
                </div>

                {isEditingPerson ? (
                  <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)]/60 border border-[var(--vt-color-orange-200,#FDCAA9)] space-y-3">
                    <p className="font-extrabold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider text-[10.5px]">
                      Edit Staff Access &amp; Assignment
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                          Role
                        </label>
                        <VantagedSelect
                          value={editRole}
                          onChange={(val) => setEditRole(val as TeamRole)}
                          options={[
                            { value: "Site Manager", label: "Site Manager" },
                            { value: "Office Coordinator", label: "Office Coordinator" },
                            { value: "Crew Member", label: "Crew Member" },
                            { value: "Director", label: "Director" },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                          Assigned Site
                        </label>
                        <input
                          type="text"
                          value={editSite}
                          onChange={(e) => setEditSite(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                        Reset Login Password (Optional, min. 6 chars)
                      </label>
                      <input
                        type="password"
                        value={resetPasswordInput}
                        onChange={(e) => setResetPasswordInput(e.target.value)}
                        placeholder="Leave blank to keep existing password"
                        className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingPerson(false)}
                        className="h-8 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePersonEdits}
                        className="h-8 px-3.5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-1.5">
                    <p>
                      <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Primary Site:</strong>{" "}
                      {selectedPerson.assignedProjectName}
                    </p>
                    <p>
                      <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Location:</strong>{" "}
                      {selectedPerson.location}
                    </p>
                    <p>
                      <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Contact:</strong>{" "}
                      {selectedPerson.email} · {selectedPerson.phone}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-2">
                    Specialties &amp; Responsibilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPerson.specialties.map((sp) => (
                      <span
                        key={sp}
                        className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-[11px]"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(selectedPerson)}
                    className="h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                  >
                    {selectedPerson.status === "ON_SITE" ? "Mark Office" : "Mark On Site"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingPerson((prev) => !prev)}
                    className="h-9 px-3 rounded-lg border border-[var(--vt-color-indigo-200,#D5D2EF)] bg-[var(--vt-color-indigo-50,#F4F3FC)] hover:bg-[var(--vt-color-indigo-100,#EAE7FA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                  >
                    {isEditingPerson ? "Close Edit" : "Edit / Reset Password"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPerson.role !== "Director" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(selectedPerson)}
                      className="h-9 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedPerson(null)}
                    className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add Team Member Modal (with Staff Email + Login Password) */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={(created) => {
          setCustomRoster(readLocalData("vantaged_director_team_custom_roster", []));
          showToast(`Created login for ${created.name} (${created.email}) and added to Team & Crew!`);
        }}
      />
    </div>
  );
}
