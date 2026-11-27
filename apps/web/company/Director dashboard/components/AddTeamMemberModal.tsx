"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import {
  IconCheck,
  IconClose,
  IconEye,
  IconLock,
} from "../../../client/Owner dashboard/pages/projects dashboard/ProjectIcons";
import { useContractorUser } from "../hooks/useContractorUser";
import { readLocalData, writeLocalData } from "../utils/localPersistence";
import {
  ContractorAccountRecord,
  KEY_REGISTERED_CONTRACTORS,
  readLocalContractorAccounts,
} from "../../../shared/vantagedAuth";

export type TeamRole =
  | "Director"
  | "Site Manager"
  | "Office Coordinator"
  | "Crew Member";

export interface TeamPersonnelCardItem {
  id: string;
  name: string;
  title: string;
  role: TeamRole;
  credential: string;
  location: string;
  email: string;
  phone: string;
  assignedSites: number;
  assignedProjectName: string;
  points: number;
  attendanceRate: number;
  status: "ON_SITE" | "ACTIVE";
  avatar: string;
  isFeatured?: boolean;
  isStarred?: boolean;
  specialties: string[];
}

export const TEAM_ROSTER_UPDATE_EVENT = "vantaged_director_team_update";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (member: TeamPersonnelCardItem) => void;
}

export function AddTeamMemberModal({
  isOpen,
  onClose,
  onCreated,
}: AddTeamMemberModalProps) {
  const contractorUser = useContractorUser();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    role: "Site Manager" as TeamRole,
    email: "",
    password: "",
    phone: "",
    location: "Lekki Phase 1, Lagos",
    assignedProjectName: "Active Company Site",
    specialtiesText: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = newMember.name.trim();
    const trimmedEmail = newMember.email.trim().toLowerCase();
    const trimmedPassword = newMember.password;

    if (!trimmedName) {
      setFormError("Please enter the team member's full name.");
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Please enter a valid login email address for this user.");
      return;
    }
    if (!trimmedPassword || trimmedPassword.length < 6) {
      setFormError("Please set a login password of at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    // 1. Provision real Contractor Staff login account so they can sign in at /contractor/login
    const accountPayload = {
      companyName: contractorUser.companyName || "Verified Construction Company",
      rcNumber: contractorUser.rcNumber || "RC-VERIFIED",
      directorName: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: newMember.role,
      phone: newMember.phone.trim() || undefined,
      issuedBy: "Company Director" as const,
      status: "ACTIVE" as const,
    };

    try {
      const res = await fetch("/api/contractor-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountPayload),
      });
      const json = await res.json().catch(() => null);
      const savedAccount: ContractorAccountRecord =
        json?.success && json?.data
          ? json.data
          : {
              id: `ctr-acc-${Date.now()}`,
              ...accountPayload,
              createdAt: new Date().toISOString(),
            };

      // Sync local contractor accounts cache immediately
      const existingAccounts = readLocalContractorAccounts();
      const filtered = existingAccounts.filter(
        (a) => a.email.trim().toLowerCase() !== trimmedEmail
      );
      localStorage.setItem(
        KEY_REGISTERED_CONTRACTORS,
        JSON.stringify([savedAccount, ...filtered])
      );
    } catch {
      const fallbackRecord: ContractorAccountRecord = {
        id: `ctr-acc-${Date.now()}`,
        ...accountPayload,
        createdAt: new Date().toISOString(),
      };
      const existingAccounts = readLocalContractorAccounts();
      const filtered = existingAccounts.filter(
        (a) => a.email.trim().toLowerCase() !== trimmedEmail
      );
      localStorage.setItem(
        KEY_REGISTERED_CONTRACTORS,
        JSON.stringify([fallbackRecord, ...filtered])
      );
    }

    // 2. Add to Company Team & Crew roster
    const created: TeamPersonnelCardItem = {
      id: `tm-custom-${Date.now()}`,
      name: trimmedName,
      title: newMember.title.trim() || newMember.role,
      role: newMember.role,
      credential: "Company Provisioned Login",
      location: newMember.location.trim() || "Lagos",
      email: trimmedEmail,
      phone: newMember.phone.trim() || "+234 800 000 0000",
      assignedSites: 1,
      assignedProjectName:
        newMember.assignedProjectName.trim() || "Active Company Site",
      points: 0,
      attendanceRate: 100,
      status: newMember.role === "Office Coordinator" ? "ACTIVE" : "ON_SITE",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80",
      specialties: newMember.specialtiesText
        ? newMember.specialtiesText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Site Execution", "Safety Compliance"],
    };

    const currentCustom = readLocalData<TeamPersonnelCardItem[]>(
      "vantaged_director_team_custom_roster",
      []
    );
    const nextCustom = [created, ...currentCustom];
    writeLocalData("vantaged_director_team_custom_roster", nextCustom);
    window.dispatchEvent(new Event(TEAM_ROSTER_UPDATE_EVENT));

    setIsSubmitting(false);
    setNewMember({
      name: "",
      title: "",
      role: "Site Manager",
      email: "",
      password: "",
      phone: "",
      location: "Lekki Phase 1, Lagos",
      assignedProjectName: "Active Company Site",
      specialtiesText: "",
    });
    onCreated?.(created);
    onClose();
  };

  return createPortal(
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 text-xs text-[var(--vt-color-text-default,#261A66)]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
              {contractorUser.companyName} · Staff Access
            </span>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Add Team &amp; Crew Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex flex-col gap-3.5"
        >
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="e.g. Engr. Segun Ogunleye"
              className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Company Role *
              </label>
              <VantagedSelect
                value={newMember.role}
                onChange={(val) =>
                  setNewMember({ ...newMember, role: val as TeamRole })
                }
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
                Job Title
              </label>
              <input
                type="text"
                value={newMember.title}
                onChange={(e) =>
                  setNewMember({ ...newMember, title: e.target.value })
                }
                placeholder="e.g. Lead Site Supervisor"
                className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>
          </div>

          {/* Login Email & Password Provisioning Card */}
          <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)]/65 border border-[var(--vt-color-orange-200,#FDCAA9)] space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider">
              <IconLock className="w-3.5 h-3.5" />
              <span>Portal Login Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Staff Email Account *
                </label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  placeholder="e.g. segun@company.com"
                  className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Login Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newMember.password}
                    onChange={(e) =>
                      setNewMember({ ...newMember, password: e.target.value })
                    }
                    placeholder="Min. 6 characters"
                    className="w-full h-9 pl-3 pr-9 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                  >
                    <IconEye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-snug">
              This user can sign in at <strong>/contractor/login</strong> using this email, password, and assigned role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
                placeholder="e.g. +234 803 123 4567"
                className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Location
              </label>
              <input
                type="text"
                value={newMember.location}
                onChange={(e) =>
                  setNewMember({ ...newMember, location: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Assigned Site
              </label>
              <input
                type="text"
                value={newMember.assignedProjectName}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    assignedProjectName: e.target.value,
                  })
                }
                className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Specialties (comma-separated)
              </label>
              <input
                type="text"
                value={newMember.specialtiesText}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    specialtiesText: e.target.value,
                  })
                }
                placeholder="e.g. Rebar Inspection, Daily Logs"
                className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-50 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <IconCheck className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Creating Account..." : "Create Login & Add to Team"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
