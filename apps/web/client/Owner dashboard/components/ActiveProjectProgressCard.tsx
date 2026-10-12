"use client";

import React, { useState, useRef, useEffect } from "react";

export interface ActiveProject {
  id: string;
  jobId: string;
  shortName: string;
  title: string;
  location: string;
  specs: string;
  status: "In progress" | "Inspection pending" | "Final sign-off";
  scope: {
    title: string;
    description: string;
  };
  contractor: {
    name: string;
    rating: string;
    milestonesCompleted: number;
    assignedRep: string;
  };
  steps: {
    title: string;
    timeOrDate: string;
    status: "completed" | "active" | "pending";
    timeRemaining?: string;
  }[];
  milestoneFunded: string;
}

export const OWNER_ACTIVE_PROJECTS: ActiveProject[] = [
  {
    id: "proj-lekki",
    jobId: "JOB-4821",
    shortName: "Lekki Villa",
    title: "Lekki Phase 1 Luxury Villa",
    location: "Plot 14, Admiralty Way, Lekki",
    specs: "4-Bedroom Detached + Penthouse",
    status: "In progress",
    scope: {
      title: "First Floor Slab Casting + Structural Column Reinforcement",
      description:
        "Includes: High-tensile 16mm rebar tying · C30 ready-mix concrete pour · Core test cylinder collection · On-site Rep inspection",
    },
    contractor: {
      name: "Julius B. Consortium",
      rating: "4.8 ★",
      milestonesCompleted: 14,
      assignedRep: "Engr. Chidi O.",
    },
    steps: [
      { title: "Site setting out", timeOrDate: "Mon, 08:30", status: "completed" },
      { title: "Substructure & DPC", timeOrDate: "Mon, 09:20", status: "completed" },
      { title: "Quote approved & paid", timeOrDate: "Today, 09:12", status: "completed" },
      {
        title: "Work in progress",
        timeOrDate: "Started 09:40 · ~1h 10m left",
        status: "active",
      },
      { title: "Ready for sign-off", timeOrDate: "Expected 15:30", status: "pending" },
    ],
    milestoneFunded: "₦18,450,000",
  },
  {
    id: "proj-enclave",
    jobId: "JOB-3914",
    shortName: "The Enclave",
    title: "The Enclave Waterfront Resort",
    location: "Epe Waterfront Corridor, Lagos",
    specs: "Boutique Eco-Resort & Spa Villa",
    status: "In progress",
    scope: {
      title: "Substructure & Deep Foundation Piling Reinforcement",
      description:
        "Includes: 24 cast-in-situ concrete piles · Steel cage vibratory driving · Marine-grade waterproof concrete mix · Geotechnical probe review",
    },
    contractor: {
      name: "Crane & Stone Structural",
      rating: "4.9 ★",
      milestonesCompleted: 9,
      assignedRep: "Engr. Folake Ade",
    },
    steps: [
      { title: "Geotechnical soil probe", timeOrDate: "Oct 02, 10:00", status: "completed" },
      { title: "Piling layout survey", timeOrDate: "Oct 05, 08:30", status: "completed" },
      { title: "Escrow tranche released", timeOrDate: "Oct 08, 14:15", status: "completed" },
      {
        title: "Piling cage installation",
        timeOrDate: "Started 08:15 · ~2h 45m left",
        status: "active",
      },
      { title: "Ultrasonic integrity test", timeOrDate: "Expected Thu 12:00", status: "pending" },
    ],
    milestoneFunded: "₦32,800,000",
  },
  {
    id: "proj-guzape",
    jobId: "JOB-5102",
    shortName: "Guzape Hills",
    title: "Guzape Hills Residence",
    location: "Guzape District, Asokoro Extension, Abuja",
    specs: "6-Bedroom Contemporary Mansion",
    status: "In progress",
    scope: {
      title: "Roof Truss Structural Assembly & Parapet Concrete Casting",
      description:
        "Includes: Hot-rolled galvanized C-channel rafters · High-grade waterproof roof membrane · Rainwater drainage conduit layout · Rep load deflection test",
    },
    contractor: {
      name: "Apex Build Nigeria Ltd",
      rating: "4.7 ★",
      milestonesCompleted: 11,
      assignedRep: "Engr. Bello Usman",
    },
    steps: [
      { title: "First floor slab curing", timeOrDate: "Sep 28, 09:00", status: "completed" },
      { title: "Upper floor blockwork", timeOrDate: "Oct 03, 11:30", status: "completed" },
      { title: "Roofing tranche funded", timeOrDate: "Oct 07, 16:40", status: "completed" },
      {
        title: "Steel truss hoisting",
        timeOrDate: "Started 10:00 · ~3h 20m left",
        status: "active",
      },
      { title: "Parapet screed sign-off", timeOrDate: "Expected Fri 16:00", status: "pending" },
    ],
    milestoneFunded: "₦26,200,000",
  },
];

interface ActiveProjectProgressCardProps {
  projects?: ActiveProject[];
}

export function ActiveProjectProgressCard({
  projects = OWNER_ACTIVE_PROJECTS,
}: ActiveProjectProgressCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasMultipleProjects = projects.length > 1;
  const currentProject = projects[currentIndex] || projects[0];

  // Handle horizontal scroll sync
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    if (offsetWidth > 0) {
      const newIndex = Math.round(scrollLeft / offsetWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < projects.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollNext = () => {
    if (currentIndex < projects.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_6px_20px_rgba(38,26,102,0.06)] flex flex-col font-sans select-none w-full transition-all relative">
      {/* ── Carousel Controls Header (Only if owner has more than one active project) ── */}
      {hasMultipleProjects && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
          {/* Left: Section tag, 1/3 indicator & Property Selector Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap relative">
            <span className="text-[11px] font-bold tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] uppercase font-sans">
              ACTIVE PROJECTS
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[10px] font-extrabold font-mono">
              {currentIndex + 1}/{projects.length}
            </span>

            {/* Select Property Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-8 px-3 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs font-sans"
              >
                <span className="truncate max-w-[150px] sm:max-w-[240px]">
                  {currentProject.title}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)] transition-transform duration-200 shrink-0 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown Menu Overlay */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-9.5 w-60 sm:w-72 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-xl py-1 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-60 overflow-y-auto divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {projects.map((p, idx) => {
                        const isSelected = currentIndex === idx;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              scrollToIndex(idx);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer block truncate ${
                              isSelected
                                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)]"
                                : "text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
                            }`}
                          >
                            {p.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Prev & Next Carousel Navigation Buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={currentIndex === 0}
              title="Previous project"
              aria-label="Previous project"
              className="h-8 w-8 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:text-[var(--vt-color-orange-600,#D84C0B)] hover:border-[var(--vt-color-orange-300,#FBA674)] disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-[var(--vt-color-neutral-400,#A3A0B8)] disabled:hover:border-[var(--vt-color-border-default,#E2E0EC)] disabled:cursor-not-allowed text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={currentIndex === projects.length - 1}
              title="Next project"
              aria-label="Next project"
              className="h-8 w-8 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:text-[var(--vt-color-orange-600,#D84C0B)] hover:border-[var(--vt-color-orange-300,#FBA674)] disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-[var(--vt-color-neutral-400,#A3A0B8)] disabled:hover:border-[var(--vt-color-border-default,#E2E0EC)] disabled:cursor-not-allowed text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Scrollable Snap Carousel Track ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-full shrink-0 snap-start snap-always flex flex-col justify-between"
          >
            {/* Top Row: Job ID for Single Project */}
            {!hasMultipleProjects && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] uppercase font-sans">
                  ACTIVE PROJECT
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--vt-color-indigo-50,#F4F3FC)] border border-[var(--vt-color-indigo-200,#D7D3F3)] text-[var(--vt-color-indigo-800,#342982)] text-[10px] font-bold font-mono">
                  {project.jobId}
                </span>
              </div>
            )}

            {/* 1. Project Title & Location Subtitle (Removed redundant 'In progress' badge) */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
                  {project.title}
                </h2>
                {hasMultipleProjects && (
                  <span className="px-2 py-0.5 rounded-md bg-[var(--vt-color-indigo-50,#F4F3FC)] border border-[var(--vt-color-indigo-200,#D7D3F3)] text-[var(--vt-color-indigo-800,#342982)] text-[10px] font-bold font-mono">
                    {project.jobId}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
                {project.location} • {project.specs}
              </p>
            </div>

            {/* 2. Scope Box */}
            <div className="bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg p-3.5 sm:p-4 mb-4 flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider block font-sans">
                  CURRENT STAGE SCOPE
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight mt-0.5">
                  {project.scope.title}
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 leading-relaxed font-sans">
                  {project.scope.description}
                </p>
              </div>
            </div>

            {/* 3. Contractor & Assigned Rep Row */}
            <div className="flex items-center gap-2 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mb-4 font-sans flex-wrap">
              <span>Lead Contractor:</span>
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                {project.contractor.name}
              </span>
              <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
                ({project.contractor.rating} · {project.contractor.milestonesCompleted} verified milestones)
              </span>
              <span className="hidden md:inline text-[var(--vt-color-neutral-300,#CBC8DA)]">•</span>
              <span className="hidden md:inline text-[var(--vt-color-neutral-500,#7C7894)]">
                Assigned Rep: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{project.contractor.assignedRep}</strong> (On-site)
              </span>
            </div>

            {/* 4. Five-Segment Progress Track */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-4">
              {project.steps.map((step, stepIdx) => (
                <div
                  key={stepIdx}
                  className={`flex flex-col gap-1.5 ${
                    stepIdx === 4 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <div
                    className={`h-1.5 w-full rounded-full ${
                      step.status === "completed"
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                        : step.status === "active"
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] shadow-[0_0_8px_rgba(239,95,24,0.4)]"
                        : "bg-[var(--vt-color-neutral-200,#E2E0EC)]"
                    }`}
                  />
                  <h4
                    className={`text-xs font-bold leading-tight font-sans ${
                      step.status === "active"
                        ? "text-[var(--vt-color-orange-600,#D84C0B)]"
                        : step.status === "completed"
                        ? "text-[var(--vt-color-indigo-900,#261A66)]"
                        : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <span
                    className={`text-[11px] font-sans ${
                      step.status === "pending"
                        ? "text-[var(--vt-color-neutral-400,#A3A0B8)]"
                        : "text-[var(--vt-color-neutral-500,#7C7894)]"
                    }`}
                  >
                    {step.timeOrDate}
                  </span>
                </div>
              ))}
            </div>

            {/* 5. Bottom Milestone Value & Action Button */}
            <div className="pt-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-[var(--vt-color-neutral-500,#7C7894)] block font-sans">
                  Total milestone value funded
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] font-sans tracking-tight mt-0.5">
                  {project.milestoneFunded}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-10 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] font-sans flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Track project</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Carousel Dot Indicators at Bottom (Only if > 1 project) ── */}
      {hasMultipleProjects && (
        <div className="flex items-center gap-1.5 justify-center mt-3 pt-2">
          {projects.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to project ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === i
                  ? "w-6 bg-[var(--vt-color-orange-500,#EF5F18)]"
                  : "w-1.5 bg-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-400,#A3A0B8)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
