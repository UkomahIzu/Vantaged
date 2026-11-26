"use client";

import React, { useState, useEffect } from "react";
import { DirectorHeaderBar } from "../../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../../client/Owner dashboard/components/VantagedSelect";
import { ContractorProjectSidebarNav } from "./ContractorProjectSidebarNav";
import { ContractorProjectBreadcrumb } from "./ContractorProjectBreadcrumb";
import { VantagedCheckbox } from "./VantagedCheckbox";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorSiteMember,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import { SHARED_SYNC_EVENT } from "../../../../shared/vantagedSyncBridge";

interface ContractorProjectTeamPageProps {
  projectId: string;
}

export function ContractorProjectTeamPage({ projectId }: ContractorProjectTeamPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_team_${projectId}`);
  const project = useContractorProject(projectId);

  const [team, setTeam] = useState<ContractorSiteMember[]>(project.siteTeam);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<ContractorSiteMember["role"]>("Site Foreman");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLocation, setNewLocation] = useState(project.location);

  useEffect(() => {
    const sync = () => {
      setTeam(loadProjectKey(projectId, "team", project.siteTeam));
    };
    sync();
    window.addEventListener(CONTRACTOR_STORAGE_EVENT, sync);
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONTRACTOR_STORAGE_EVENT, sync);
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [projectId, project.siteTeam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleToggleAssigned = (memberId: string, assigned: boolean) => {
    const next = team.map((m) => (m.id === memberId ? { ...m, assigned } : m));
    setTeam(next);
    saveProjectKey(projectId, "team", next);
    const target = team.find((m) => m.id === memberId);
    if (target) {
      showToast(
        assigned
          ? `${target.name} assigned to this project site.`
          : `${target.name} unassigned from this site.`
      );
    }
  };

  const handleAddSiteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const added: ContractorSiteMember = {
      id: `crew-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      phone: newPhone.trim() || "+234 800 000 0000",
      email: newEmail.trim() || "crew@apexstructure.ng",
      location: newLocation.trim() || project.location,
      assigned: true,
      points: 0,
    };

    const next = [added, ...team];
    setTeam(next);
    saveProjectKey(projectId, "team", next);
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setIsAddModalOpen(false);
    showToast(`${added.name} added and assigned to ${project.title}.`);
  };

  const assignedCount = team.filter((m) => m.assigned).length;
  const visibleTeam = roleFilter === "all" ? team : team.filter((m) => m.role === roleFilter);

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ContractorProjectSidebarNav projectId={project.id} activeTab="team" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <ContractorProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Site Crew & Client"
            />
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Headline */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Site Crew &amp; Project Stakeholders
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Assign company supervisors and field crew to this site with zero per-seat fees, and view client contacts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer shrink-0"
          >
            + Add Crew to Site
          </button>
        </section>

        {/* Client & Representative Card */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
            <h2 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Property Owner &amp; Client Representative
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
              ✓ {project.client.verifiedBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Property Owner
              </span>
              <p className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                {project.client.name}
              </p>
              <p className="text-[var(--vt-color-neutral-600,#5E5A7D)]">{project.client.email}</p>
              <p className="text-[var(--vt-color-neutral-600,#5E5A7D)]">{project.client.phone}</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Appointed Client Rep
              </span>
              <p className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                {project.client.repName || "No representative appointed yet"}
              </p>
              <p className="text-[var(--vt-color-neutral-600,#5E5A7D)]">
                {project.client.repRole || "Owner handles stage approvals directly"}
              </p>
            </div>
          </div>
        </section>

        {/* Company Crew Roster Assignment */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                Company Site Roster ({assignedCount} Assigned)
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                Check or uncheck team members to control who has proof-upload access on {project.title}.
              </p>
            </div>
            <div className="w-full sm:w-52">
              <VantagedSelect
                value={roleFilter}
                onChange={setRoleFilter}
                options={[
                  { value: "all", label: "All Roles" },
                  { value: "Director", label: "Director" },
                  { value: "Site Manager", label: "Site Manager" },
                  { value: "Office Coordinator", label: "Office Coordinator" },
                  { value: "Site Foreman", label: "Site Foreman" },
                  { value: "QA/QC Engineer", label: "QA/QC Engineer" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {visibleTeam.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  member.assigned
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/40 border-[var(--vt-color-orange-200,#FDCAA9)]"
                    : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)]"
                }`}
              >
                <VantagedCheckbox
                  checked={member.assigned}
                  onChange={(checked) => handleToggleAssigned(member.id, checked)}
                  label={
                    <span className="font-extrabold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {member.name}
                    </span>
                  }
                  description={`${member.role} · ${member.location} · ${member.phone}`}
                />
                <span className="px-2 py-0.5 rounded-full bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] shrink-0">
                  {member.points} pts
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Add Site Crew Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <form
            onSubmit={handleAddSiteMember}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Add Team Member to Site
            </h3>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engr. Musa Ibrahim"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Site Role
              </label>
              <VantagedSelect
                value={newRole}
                onChange={(val) => setNewRole(val as ContractorSiteMember["role"])}
                options={["Site Manager", "Site Foreman", "QA/QC Engineer", "Office Coordinator", "Director"]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="+234 803..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="staff@apexstructure.ng"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer"
              >
                Add &amp; Assign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
