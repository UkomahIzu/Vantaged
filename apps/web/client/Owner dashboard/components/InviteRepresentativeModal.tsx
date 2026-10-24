"use client";

import React, { useState } from "react";
import { VantagedSelect } from "./VantagedSelect";

export interface InviteRepFormData {
  name: string;
  email: string;
  discipline: "Structural & Civil" | "Architecture" | "Quantity Surveying" | "MEP Engineering" | "Marine & Geotech" | "Owner Proxy";
  assignedProject: string;
  roleTitle: string;
}

interface InviteRepresentativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (rep: InviteRepFormData) => void;
  defaultProject?: string;
}

export function InviteRepresentativeModal({
  isOpen,
  onClose,
  onSuccess,
  defaultProject = "Lekki Phase 1 Luxury Villa",
}: InviteRepresentativeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState<InviteRepFormData["discipline"]>("Structural & Civil");
  const [assignedProject, setAssignedProject] = useState(defaultProject);
  const [roleTitle, setRoleTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const repData: InviteRepFormData = {
      name: name.trim(),
      email: email.trim(),
      discipline,
      assignedProject,
      roleTitle: roleTitle.trim() || "Independent Representative",
    };

    // Save to localStorage if possible
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vantaged_client_reps_list");
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          id: `rep-${Date.now()}`,
          name: repData.name,
          email: repData.email,
          discipline: repData.discipline,
          title: repData.roleTitle,
          location: "Lekki, Lagos",
          state: "Lagos",
          stagesVerifiedCount: 0,
          licenseNumber: "Accreditation Verification Pending",
          isVerified: false,
          isFavorite: false,
          isFeatured: false,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face",
          phone: "+234 800 000 0000",
          status: "Pending Invitation",
          mandateSummary: `Authorized client representative appointed to oversee site milestones and quality assurance for ${repData.assignedProject}.`,
          assignedProjects: [
            {
              id: "proj-lekki",
              title: repData.assignedProject,
              roleOnProject: repData.roleTitle,
              progressPercent: 50,
              status: "Active Construction",
            },
          ],
          permissions: {
            viewProgress: true,
            approveStages: true,
            makePayments: false,
            changeRequests: true,
            messageContractor: true,
            manageShareLinks: false,
            invitePeople: false,
            maxEscrowLimit: 25,
            maxChangeLimit: 10,
          },
          recentAudits: [
            {
              id: `log-${Date.now()}`,
              action: `Invitation link dispatched to ${repData.email}`,
              projectTitle: repData.assignedProject,
              module: "Site Inspection",
              status: "Pending Review",
              timestamp: "Just now",
            },
          ],
        });
        localStorage.setItem("vantaged_client_reps_list", JSON.stringify(list));
        window.dispatchEvent(new Event("vantaged_storage_update"));
      } catch {
        // ignore
      }
    }

    onSuccess?.(repData);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setName("");
    setEmail("");
    setRoleTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-sans select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
      >
        {/* Header */}
        <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Invite Representative</h3>
            <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
              Dispatch onboarding invite code with delegated inspection rights
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <h4 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Invitation Dispatched!
            </h4>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-xs">
              A secure onboarding invite code has been dispatched to <strong>{email}</strong>. Representative will be authorized upon acceptance.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 px-5 py-2 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191142)] text-white font-bold text-xs transition-all cursor-pointer shadow-2xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                Representative Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engr. Kayode Adeleke"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                  Professional Discipline
                </label>
                <VantagedSelect
                  value={discipline}
                  onChange={(val) => setDiscipline(val as InviteRepFormData["discipline"])}
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
                  value={assignedProject}
                  onChange={(val) => setAssignedProject(val)}
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
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div className="pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
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
  );
}
