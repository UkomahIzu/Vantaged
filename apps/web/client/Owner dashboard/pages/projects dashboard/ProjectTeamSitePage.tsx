"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { DraggableChatWindow } from "../../components/DraggableChatWindow";
import { getProjectDetail } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import { IconArrowRight, IconMessage, IconPlus, IconShieldCheck } from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";

interface ProjectTeamSitePageProps {
  projectId?: string;
}

export function ProjectTeamSitePage({ projectId = "proj-lekki" }: ProjectTeamSitePageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_team_${projectId}`);
  const project = getProjectDetail(projectId);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="team" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Site & Team"
            />
          }
        />

        {/* ── Headline Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Verified Team
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Builder & Site Team
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              People working on your building: the registered contractor, site engineer, and your trusted representatives.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <IconMessage className="w-4 h-4" />
            <span>Message Site Team</span>
          </button>
        </section>

        {/* ── Contractor Company Card ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-center font-bold text-lg shrink-0">
                JB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[var(--vt-color-indigo-900,#261A66)]">{project.contractor.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] inline-flex items-center gap-1">
                    <IconShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Builder</span>
                  </span>
                </div>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Managing Director: <strong>{project.contractor.directorName}</strong> • {project.contractor.cacNumber}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-[var(--vt-color-orange-600,#D84C0B)]">{project.contractor.rating}</span>
              <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] block">({project.contractor.projectsCompleted} completed buildings)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">Bank Account</span>
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">{project.contractor.bankName}</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">Bank Account Name</span>
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">{project.contractor.bankAccountName}</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">Verification</span>
              <span className="font-bold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5 block">100% Identity & CAC Matched</span>
            </div>
          </div>
        </section>

        {/* ── Two Columns: Site Engineer vs Your Representatives ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8">
          {/* Site Engineer */}
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-4">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Engineer in Charge on Site
              </span>
              <div className="flex items-center gap-3.5 mt-3">
                <img src={project.siteManager.avatar} alt={project.siteManager.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">{project.siteManager.name}</h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">Head Site Engineer • {project.contractor.name}</p>
                  <p className="text-xs font-mono text-[var(--vt-color-indigo-900,#261A66)] mt-1">{project.siteManager.phone}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)]/70 border border-[var(--vt-color-green-200,#A3D9B1)]/80 mt-4 text-xs">
                <span className="text-[10px] font-bold uppercase text-[var(--vt-color-green-800,#17512F)] block">Today's Check-in:</span>
                <p className="text-[var(--vt-color-green-700,#1F6B3E)] font-bold mt-0.5">{project.siteManager.lastSeen}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Available on site</span>
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="h-8 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors"
              >
                <IconMessage className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>

          {/* Your Representatives */}
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Your Site Representatives
                </span>
                <Link href="/owner/client-reps" className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline inline-flex items-center gap-1">
                  <span>Manage permissions</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-2.5 mt-3">
                {project.clientReps.map((rep) => (
                  <div key={rep.id} className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rep.avatar} alt={rep.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">{rep.name}</h4>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">{rep.role}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rep.modules.map((m, idx) => (
                            <span key={idx} className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
              <Link href="/owner/inspectors" className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline inline-flex items-center gap-1">
                <span>Browse Verified Inspectors ↗</span>
              </Link>
              <Link href="/owner/client-reps" className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:underline inline-flex items-center gap-1">
                <IconPlus className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
                <span>Add representative</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <DraggableChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        projectName={project.title}
      />
    </div>
  );
}
