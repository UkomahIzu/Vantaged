"use client";

import React, { useState } from "react";
import { IconPresets } from "../../components/AdminIcons";

export default function StagePresetsPage() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const presets = [
    {
      id: "preset_duplex",
      name: "4-Bedroom Detached Duplex (Standard Nigerian Typology)",
      stagesCount: 7,
      typicalDuration: "6 to 9 Months",
      description: "Standard residential milestone framework with foundation soil signoff, casting cube tests, and roof covering stages.",
      stages: [
        { order: 1, title: "Substructure & Foundation", evidence: "Excavation depth log, blind concrete photo, rebar cage inspection, cube compressive test result" },
        { order: 2, title: "Superstructure Frame (Ground Floor)", evidence: "Column formwork, lintel rebar inspection, German floor / slab casting photos" },
        { order: 3, title: "First Floor Suspended Slab & Columns", evidence: "Props and decking inspection, electrical conduit placement, concrete pour certificate" },
        { order: 4, title: "Roof Framing, Trusses & Covering", evidence: "Hardwood/steel truss alignment, aluminium/stone-coated sheet installation, rainwater gutter test" },
        { order: 5, title: "Wall Blockwork & External Plastering", evidence: "Wall plumb lines, lintels over openings, screeding & exterior rendering photos" },
        { order: 6, title: "MEP Rough-in & Piping Pressure Test", evidence: "PEX plumbing pressure gauge test, conduit wiring continuity, septic/soakaway installation" },
        { order: 7, title: "Architectural Finishes, Snagging & Handover", evidence: "Floor tiling, sanitary fixtures, doors/glazing, snagging resolution checklist" },
      ],
    },
    {
      id: "preset_bungalow",
      name: "3-Bedroom Bungalow",
      stagesCount: 5,
      typicalDuration: "4 to 6 Months",
      description: "Optimized residential flow for single-level construction with rapid milestone cycles.",
      stages: [
        { order: 1, title: "Substructure, Trenching & DPC Slab", evidence: "Trench depth, hardcore compaction, DPC damp-proof membrane, slab pour" },
        { order: 2, title: "Blockwork to Lintel Level & Casting", evidence: "Plumb line alignment, lintel beam casting, door/window frame anchoring" },
        { order: 3, title: "Roof Carcass & Longspan Covering", evidence: "Truss spacing check, roofing sheet fastening, ceiling nogging installation" },
        { order: 4, title: "Plumbing, Electrical & Internal Screeding", evidence: "Conduit layout, pipe pressure test, wall plastering & floor screed" },
        { order: 5, title: "Finishes, Fittings & Key Handover", evidence: "Painting, tiling, sanitary ware, electrical fittings, final cleaning" },
      ],
    },
    {
      id: "preset_mep",
      name: "Commercial MEP & Systems Retrofit",
      stagesCount: 4,
      typicalDuration: "2 to 3 Months",
      description: "Dedicated mechanical, electrical, and plumbing staging with engineering certification requirements.",
      stages: [
        { order: 1, title: "Site Surveys & Equipment Procurements", evidence: "BOQ verification, manufacturer datasheets, equipment delivery receipts" },
        { order: 2, title: "Piping, Trunking & Containment Installation", evidence: "Cable tray routing, pipe support brackets, fire damper rough-in" },
        { order: 3, title: "Cabling, Panel Terminations & Testing", evidence: "Megger insulation resistance test, panel distribution schedule, pump alignment" },
        { order: 4, title: "Commissioning & COREN Engineering Signoff", evidence: "Integrated testing certificate, operation manuals, statutory compliance signoff" },
      ],
    },
  ];

  const currentPreset = presets[selectedPresetIndex];

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
            <IconPresets className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
            Standard Workflows
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">Stage Preset Library</h1>
        <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
          Standard Nigerian building templates that define milestone schedules, mandatory evidence, and inspection criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preset Selector */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] font-semibold">Available Presets</div>
          {presets.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedPresetIndex(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedPresetIndex === idx
                  ? "border-[var(--vt-color-orange-400,#F78241)] bg-white shadow-[0_8px_24px_rgba(239,95,24,0.12)] ring-1 ring-[var(--vt-color-orange-500,#EF5F18)]"
                  : "border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                  {p.name.split("(")[0]}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  {p.stagesCount} Stages
                </span>
              </div>
              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] line-clamp-2 leading-relaxed">
                {p.description}
              </p>
              <div className="mt-2.5 text-[10px] font-mono font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                Est: {p.typicalDuration}
              </div>
            </button>
          ))}
        </div>

        {/* Right: Milestone Breakdown */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">{currentPreset.name}</h2>
              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">{currentPreset.description}</p>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-md text-xs font-mono font-bold bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              {currentPreset.typicalDuration}
            </span>
          </div>

          <div className="space-y-3">
            {currentPreset.stages.map((stg) => (
              <div
                key={stg.order}
                className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  {stg.order}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">{stg.title}</h3>
                  <div className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Required Evidence: </span>
                    {stg.evidence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
