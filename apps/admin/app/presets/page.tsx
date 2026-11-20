"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IconPresets, IconSearch } from "../../components/AdminIcons";
import { VantagedSelect } from "../../components/VantagedSelect";

export interface StageItem {
  order: number;
  title: string;
  evidence: string;
}

export interface StagePreset {
  id: string;
  name: string;
  category: "Residential" | "Commercial" | "Infrastructure" | "Industrial" | "Specialized";
  stagesCount: number;
  typicalDuration: string;
  description: string;
  isCustom?: boolean;
  stages: StageItem[];
}

const BUILT_IN_PRESETS: StagePreset[] = [
  {
    id: "preset_duplex",
    name: "4-Bedroom Detached Duplex (Standard Nigerian Typology)",
    category: "Residential",
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
    name: "3-Bedroom Bungalow (Suburban Residential)",
    category: "Residential",
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
    id: "preset_terrace_block",
    name: "Multi-Unit Terrace Housing Block (G+2 / 6 Units)",
    category: "Residential",
    stagesCount: 8,
    typicalDuration: "9 to 14 Months",
    description: "Multi-family high-density residential development with reinforced foundation piling, multiple suspended floors, communal utility rough-ins, and perimeter finishes.",
    stages: [
      { order: 1, title: "Substructure & Deep Foundation Piling", evidence: "Piling rig depth logs, borehole soil test, pile cap rebar inspection, lean concrete blinding" },
      { order: 2, title: "Ground Floor Suspended Deck & Columns", evidence: "Beam reinforcement check, electrical conduit sleeve layout, concrete crush cube certificate (28-day)" },
      { order: 3, title: "Upper Floors Frame & Intermediate Decks", evidence: "Decking formwork props safety audit, stirrup spacing, slab pour inspection signoff" },
      { order: 4, title: "Roof Trusses & Longspan Aluminium Covering", evidence: "Anti-rot timber treatment check or steel truss weld test, aluminium gauge certificate, fascia board alignment" },
      { order: 5, title: "Sandcrete Blockwork & External Plastering", evidence: "Plumb line verticality report, lintel castings above door/window openings, external roughcast plaster" },
      { order: 6, title: "MEP Rough-in & Pressure Testing", evidence: "Water supply pressure gauge hold test (5 bar / 24 hrs), electrical conduit continuity, septic soakaway soak test" },
      { order: 7, title: "Interior POP Ceilings, Screeding & Glazing", evidence: "POP ceiling suspension wire inspection, wall screeding smoothness check, anodized aluminium window latching" },
      { order: 8, title: "Finishes, Interlocking Compound & Commissioning", evidence: "Floor tiling leveling, sanitary ware seal test, estate transformer energization, client snagging signoff" },
    ],
  },
  {
    id: "preset_commercial_plaza",
    name: "Commercial Office Complex & Retail Plaza (Mid-Rise G+4)",
    category: "Commercial",
    stagesCount: 8,
    typicalDuration: "12 to 18 Months",
    description: "Multi-tenant commercial center framework with reinforced elevator shafts, central HVAC rough-in, curtain wall facade, and statutory fire compliance.",
    stages: [
      { order: 1, title: "Site Demolition, Piling & Raft Foundation", evidence: "Bored pile depth logs, pile integrity testing (PIT), rebar mesh inspection, raft concrete batch records" },
      { order: 2, title: "RC Shear Walls, Columns & Post-Tensioned Slabs", evidence: "Shear wall formwork plumbness, tendon elongation logs, cube compressive strength certificates" },
      { order: 3, title: "Curtain Wall Facade, Glazing & External Cladding", evidence: "Aluminium mullion wind-load anchoring, tempered safety glass certificates, silicone weather-seal test" },
      { order: 4, title: "Central HVAC, Fire Suppression & Sprinkler Grid", evidence: "Chilled water pipe hydrostatic pressure test, ductwork smoke damper inspection, fire pump installation test" },
      { order: 5, title: "Electrical Substation, Transformer & Standby Power", evidence: "High-voltage cable megger insulation tests, ATS panel switching logs, grounding earth resistance (<2 ohms)" },
      { order: 6, title: "Passenger Lifts & Vertical Circulation", evidence: "Elevator shaft plumb report, car safety brake drop test, emergency recall sensor signoff" },
      { order: 7, title: "Public Restrooms, Lobby Granite & Tenant Demarcation", evidence: "Common area floor tiling levelness, acoustic drywall partitions, emergency exit signage" },
      { order: 8, title: "Final Commissioning, Statutory Fire & Handover", evidence: "State Fire Service safety certificate, occupancy permit signoff, operation manuals delivery" },
    ],
  },
  {
    id: "preset_mep",
    name: "Commercial MEP & Systems Retrofit",
    category: "Commercial",
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
  {
    id: "preset_estate_road",
    name: "Estate Access Road & Reinforced Stormwater Drainage",
    category: "Infrastructure",
    stagesCount: 5,
    typicalDuration: "3 to 5 Months",
    description: "Civil works template for private estate road paving, reinforced stormwater culverts, stone base compaction, and solar streetlighting.",
    stages: [
      { order: 1, title: "Site Clearing, Topsoil Stripping & Sub-Grade Compaction", evidence: "Surveyor centerline GPS benchmarks, California Bearing Ratio (CBR) soil test, sub-grade nuclear density test" },
      { order: 2, title: "Concrete Box Culverts & U-Drain Channels", evidence: "Drain invert levels check, culvert rebar spacing, precast drain cover load certificates" },
      { order: 3, title: "Crushed Granite Stone Base & Prime Coat", evidence: "Stone aggregate grading sieve analysis, prime coat bitumen spray rate test, rolling pass compaction" },
      { order: 4, title: "Heavy-Duty Interlocking Paving Stones / Asphalt Surfacing", evidence: "80mm heavy-duty paver crushing strength (>=45 MPa), sand bed leveling, asphalt core temperature & thickness test" },
      { order: 5, title: "Solar Streetlight Poles, Kerb Painting & Signage", evidence: "Galvanized pole footing depth, solar battery storage autonomy check, thermoplastic road marking reflectivity" },
    ],
  },
  {
    id: "preset_perimeter_wall",
    name: "Perimeter Security Enclosure & Automated Gatehouse",
    category: "Infrastructure",
    stagesCount: 4,
    typicalDuration: "3 to 6 Weeks",
    description: "Rapid security perimeter framework covering trenching, reinforced stiffener pillars, anti-climb electric wiring, and motorized access gate.",
    stages: [
      { order: 1, title: "Boundary Trenching, Lean Concrete & Strip Footing", evidence: "Cadastral survey boundary beacon verification, footing trench depth photo, starter rebar bars" },
      { order: 2, title: "Sandcrete Blockwork & Reinforced Stiffener Columns", evidence: "Vibrated sandcrete block test, vertical column stirrup ties every 3 meters, lintel beam casting" },
      { order: 3, title: "Concrete Wall Coping, Razor Wire & Electric Fencing", evidence: "Water-drip coping mold inspection, concertina razor wire bracket welds, electric fence energizer voltage test" },
      { order: 4, title: "Security Gatehouse, Automated Vehicular Gate & Turnstile", evidence: "Gatehouse roof & glazing, heavy-duty track roller alignment, motor remote transmitter testing" },
    ],
  },
  {
    id: "preset_warehouse",
    name: "Industrial Warehouse & Steel Portal Frame Logistics Shed",
    category: "Industrial",
    stagesCount: 6,
    typicalDuration: "4 to 6 Months",
    description: "Industrial logistics template covering column pad footings, pre-engineered steel frames, high-load industrial floors, and loading bays.",
    stages: [
      { order: 1, title: "Earthworks, Isolated Column Bases & Anchor Bolts", evidence: "Plate bearing soil load test, anchor bolt template alignment survey, high-strength grouting under baseplates" },
      { order: 2, title: "Pre-Engineered Steel Portal Frames & Purlins", evidence: "Mill test certificates, ultrasonic weld testing on rafter joints, high-tensile torque wrench log" },
      { order: 3, title: "Insulated Wall & Roof Cladding Panels", evidence: "Aluzinc insulated sandwich panels, translucent skylight sheet alignment, rain gutter slope test" },
      { order: 4, title: "Laser-Screeded High-Tolerance Floor Slab", evidence: "Vapour barrier membrane, dual-layer BRC wire mesh, dry-shake quartz surface hardener, saw-cut joints" },
      { order: 5, title: "High-Bay LED Lighting, Industrial Power & Fire Mains", evidence: "Three-phase busbar trunking, emergency luminaire lux meter reading, fire hose reel flow test" },
      { order: 6, title: "Hydraulic Dock Levelers, Industrial Roller Doors & Handover", evidence: "Dock bumper installation check, motorized roller shutter cycle test, perimeter apron concrete pour" },
    ],
  },
  {
    id: "preset_swimming_pool",
    name: "Reinforced Concrete Swimming Pool & Leisure Deck",
    category: "Specialized",
    stagesCount: 4,
    typicalDuration: "6 to 10 Weeks",
    description: "Specialized aquatic construction template requiring hydrostatic water tightness testing, mosaic tiling, and recirculating pumps.",
    stages: [
      { order: 1, title: "Excavation, Blinding & Double-Layer Rebar Cage", evidence: "Excavation profile check, lean concrete blinding, anti-rust rebar mesh, main drain pot embeds" },
      { order: 2, title: "Waterproof Monolithic Concrete Shell & Water Test", evidence: "Concrete waterproofing admixture docket, pneumatic vibrator pour log, 72-hour hydrostatic water test report" },
      { order: 3, title: "Hydraulic Plumbing, Filtration & Pump Room", evidence: "Schedule 40 PVC pipe pressure test, sand filter media loading, chlorinator and pump wiring" },
      { order: 4, title: "Glass Mosaic Tiling, Non-Slip Coping & Underwater LED", evidence: "Epoxy pool grout inspection, bullnose granite coping levelness, 12V transformer underwater lighting signoff" },
    ],
  },
];

type CategoryFilter = "All" | "Residential" | "Commercial" | "Infrastructure" | "Industrial" | "Specialized" | "Custom";

export default function StagePresetsPage() {
  const [customPresets, setCustomPresets] = useState<StagePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset_duplex");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Preset Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: "",
    category: "Residential" as StagePreset["category"],
    typicalDuration: "",
    description: "",
    stages: [
      { order: 1, title: "Site Mobilization & Substructure", evidence: "Survey benchmarks, excavation log, blinding concrete & foundation rebar photos" },
      { order: 2, title: "Superstructure Frame & Masonry", evidence: "Column formwork, lintel beams, concrete cube test certificates" },
      { order: 3, title: "Roof Trusses, MEP Rough-in & Plastering", evidence: "Roof covering watertightness check, plumbing pressure gauge test (5 bar), wall screeding" },
      { order: 4, title: "Architectural Finishes & Final Snagging", evidence: "Tiling inspection, sanitary/electrical fixtures check, client handover checklist" },
    ],
  });

  // Load custom presets from server API or LocalStorage on mount
  useEffect(() => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setCustomPresets(data.data);
        } else if (typeof window !== "undefined") {
          const stored = localStorage.getItem("vantaged_admin_custom_stage_presets");
          if (stored) setCustomPresets(JSON.parse(stored));
        }
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("vantaged_admin_custom_stage_presets");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) setCustomPresets(parsed);
            }
          } catch (err) {
            console.error("Failed to load custom presets:", err);
          }
        }
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Combine built-in presets and custom presets
  const allPresets = useMemo(() => {
    return [...customPresets, ...BUILT_IN_PRESETS];
  }, [customPresets]);

  // Options for VantagedSelect typology filter
  const categoryOptions = useMemo(() => [
    { value: "All", label: "All Typologies", count: allPresets.length },
    { value: "Residential", label: "Residential", count: allPresets.filter((p) => p.category === "Residential").length },
    { value: "Commercial", label: "Commercial", count: allPresets.filter((p) => p.category === "Commercial").length },
    { value: "Infrastructure", label: "Civil & Infrastructure", count: allPresets.filter((p) => p.category === "Infrastructure").length },
    { value: "Industrial", label: "Industrial", count: allPresets.filter((p) => p.category === "Industrial").length },
    { value: "Specialized", label: "Specialized & Amenities", count: allPresets.filter((p) => p.category === "Specialized").length },
    { value: "Custom", label: "Custom Admin Templates", count: customPresets.length },
  ], [allPresets, customPresets]);

  // Filter presets based on category and search query
  const filteredPresets = useMemo(() => {
    return allPresets.filter((p) => {
      const matchesCategory =
        activeCategory === "All"
          ? true
          : activeCategory === "Custom"
          ? p.isCustom === true
          : p.category === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inStages = p.stages.some((s) => s.title.toLowerCase().includes(q) || s.evidence.toLowerCase().includes(q));

      return inName || inDesc || inStages;
    });
  }, [allPresets, activeCategory, searchQuery]);

  // Ensure selected preset is valid
  useEffect(() => {
    if (filteredPresets.length > 0) {
      const exists = filteredPresets.some((p) => p.id === selectedPresetId);
      if (!exists && filteredPresets[0]) {
        setSelectedPresetId(filteredPresets[0].id);
      }
    }
  }, [filteredPresets, selectedPresetId]);

  const currentPreset = allPresets.find((p) => p.id === selectedPresetId) || allPresets[0] || BUILT_IN_PRESETS[0];

  // Stage builder helpers in modal
  const handleAddStageToModal = () => {
    setModalForm((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          order: prev.stages.length + 1,
          title: "",
          evidence: "",
        },
      ],
    }));
  };

  const handleRemoveStageFromModal = (indexToRemove: number) => {
    if (modalForm.stages.length <= 1) return;
    setModalForm((prev) => {
      const nextStages = prev.stages
        .filter((_, idx) => idx !== indexToRemove)
        .map((stg, idx) => ({ ...stg, order: idx + 1 }));
      return { ...prev, stages: nextStages };
    });
  };

  const handleStageFieldChange = (index: number, field: "title" | "evidence", value: string) => {
    setModalForm((prev) => {
      const updated = [...prev.stages];
      const target = updated[index];
      if (target) {
        target[field] = value;
      }
      return { ...prev, stages: updated };
    });
  };

  const handleSaveCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!modalForm.name.trim()) {
      alert("Please provide a name for this stage preset template.");
      return;
    }

    const invalidStage = modalForm.stages.find((s) => !s.title.trim());
    if (invalidStage) {
      alert(`Please fill in the title for Stage ${invalidStage.order}.`);
      return;
    }

    const newPresetId = `preset_custom_${Date.now()}`;
    const newPreset: StagePreset = {
      id: newPresetId,
      name: modalForm.name.trim(),
      category: modalForm.category,
      typicalDuration: modalForm.typicalDuration.trim() || "Flexible Schedule",
      stagesCount: modalForm.stages.length,
      description: modalForm.description.trim() || "Custom project milestone preset configured by platform admin.",
      isCustom: true,
      stages: modalForm.stages.map((stg, idx) => ({
        order: idx + 1,
        title: stg.title.trim(),
        evidence: stg.evidence.trim() || "Site photos, signed field inspection report, quality testing certificates.",
      })),
    };

    const updatedCustom = [newPreset, ...customPresets];
    setCustomPresets(updatedCustom);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vantaged_admin_custom_stage_presets", JSON.stringify(updatedCustom));
      } catch (err) {
        console.error("Failed to persist custom preset:", err);
      }
    }

    // Persist to server API and log audit trail
    fetch("/api/presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPreset),
    }).catch(() => {});

    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "STAGE_PRESET_CREATED",
        actionLabel: "Custom Stage Preset Template Created",
        target: newPreset.name,
        details: `Created preset with ${newPreset.stages.length} inspection milestones in ${newPreset.category} category.`,
        level: "INFO",
      }),
    }).catch(() => {});

    setSelectedPresetId(newPresetId);
    setIsCreateModalOpen(false);
    showToast(`Custom preset "${newPreset.name}" created successfully!`);

    // Reset form
    setModalForm({
      name: "",
      category: "Residential",
      typicalDuration: "",
      description: "",
      stages: [
        { order: 1, title: "Site Mobilization & Substructure", evidence: "Survey benchmarks, excavation log, blinding concrete & foundation rebar photos" },
        { order: 2, title: "Superstructure Frame & Masonry", evidence: "Column formwork, lintel beams, concrete cube test certificates" },
        { order: 3, title: "Roof Trusses, MEP Rough-in & Plastering", evidence: "Roof covering watertightness check, plumbing pressure gauge test (5 bar), wall screeding" },
        { order: 4, title: "Architectural Finishes & Final Snagging", evidence: "Tiling inspection, sanitary/electrical fixtures check, client handover checklist" },
      ],
    });
  };

  const handleDeleteCustomPreset = (presetId: string, presetName: string) => {
    if (typeof window !== "undefined") {
      const confirmDelete = window.confirm(`Are you sure you want to delete the custom preset "${presetName}"? This action cannot be undone.`);
      if (!confirmDelete) return;

      const updated = customPresets.filter((p) => p.id !== presetId);
      setCustomPresets(updated);
      try {
        localStorage.setItem("vantaged_admin_custom_stage_presets", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to update custom presets:", err);
      }

      fetch(`/api/presets?id=${presetId}`, { method: "DELETE" }).catch(() => {});

      fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "STAGE_PRESET_DELETED",
          actionLabel: "Custom Stage Preset Deleted",
          target: presetName,
          details: `Preset removed from library by platform administrator.`,
          level: "WARNING",
        }),
      }).catch(() => {});

      setSelectedPresetId("preset_duplex");
      showToast(`Preset "${presetName}" deleted from library.`);
    }
  };

  const handleExportPresetJSON = (preset: StagePreset) => {
    const jsonStr = JSON.stringify(preset, null, 2);
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(jsonStr);
      showToast(`Preset JSON copied to clipboard! Ready to export.`);
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans pb-16"
    >
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <IconPresets className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Standard Workflows & Inspection Templates
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
            Stage Preset Library
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
            Pre-configured Nigerian & international construction milestones, mandatory quality evidence, and inspection checkpoints.
          </p>
        </div>

        {/* Action: Add Preset Manually + Live Toast */}
        <div className="flex items-center gap-3 shrink-0">
          {toastMessage && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200 px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{toastMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] px-4 py-2 text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Custom Preset</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar: VantagedSelect & Search (Replaced bulky tabs and native select) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
        {/* Dropdown Filter */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <label className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1.5 shrink-0">
            <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Typology Filter:</span>
          </label>

          <VantagedSelect
            value={activeCategory}
            onChange={(val) => setActiveCategory(val as CategoryFilter)}
            options={categoryOptions}
            containerClassName="w-full sm:w-[280px]"
          />

          {activeCategory !== "All" && (
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] hover:underline font-bold whitespace-nowrap cursor-pointer px-1.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <IconSearch className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search preset or evidence..."
            className="w-full h-9 pl-9 pr-7 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] focus:bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Main Presets Layout: Clean Natural Scrolling ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Preset Cards List (Natural flow, no nested scroll trap) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] font-semibold px-1">
            <span>
              Available Presets ({filteredPresets.length})
            </span>
            {activeCategory !== "All" && (
              <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                Category: {activeCategory}
              </span>
            )}
          </div>

          {filteredPresets.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-center flex flex-col items-center justify-center">
              <IconPresets className="w-8 h-8 text-[var(--vt-color-neutral-300,#CAC7D8)] mb-2" />
              <p className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">No Presets Found</p>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-xs">
                No templates match your search criteria. Try selecting another typology or create a custom preset.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-3 text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline"
              >
                + Create Custom Preset
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredPresets.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-white shadow-[0_8px_24px_rgba(239,95,24,0.12)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/20"
                        : "border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:border-[var(--vt-color-neutral-300,#CBC8DA)] shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          {p.name.split("(")[0]}
                        </span>
                        {p.isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                            Custom
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                        {p.stagesCount} Stages
                      </span>
                    </div>

                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[var(--vt-color-border-default,#E2E0EC)]/60 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {p.category}
                      </span>
                      <span className="font-mono font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                        Est: {p.typicalDuration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Preset Milestone Sequence Breakdown (Pinned sticky preview on desktop) */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-6 shadow-sm lg:sticky lg:top-4 self-start">
          {currentPreset ? (
            <div>
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-indigo-900,#261A66)]">
                      {currentPreset.category}
                    </span>
                    {currentPreset.isCustom && (
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                        Custom Preset Template
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    {currentPreset.name}
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 leading-relaxed max-w-xl">
                    {currentPreset.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] whitespace-nowrap">
                    {currentPreset.typicalDuration}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleExportPresetJSON(currentPreset)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer flex items-center gap-1"
                      title="Copy Preset Template as JSON"
                    >
                      <svg className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                      <span>Export JSON</span>
                    </button>

                    {currentPreset.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomPreset(currentPreset.id, currentPreset.name)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[var(--vt-color-red-600,#C92A2A)] hover:bg-[var(--vt-color-red-50,#FFF5F5)] border border-[var(--vt-color-red-200,#FFC9C9)] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestone Checklist Sequence */}
              <div className="flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-3">
                <span>Standard Milestone Sequence ({currentPreset.stages.length} Stages)</span>
                <span className="text-[11px] font-normal text-[var(--vt-color-neutral-500,#7C7894)]">
                  Mandatory Evidence & Inspection Log
                </span>
              </div>

              <div className="space-y-3">
                {currentPreset.stages.map((stg) => (
                  <div
                    key={stg.order}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CAC7D8)] transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-2xs">
                      {stg.order}
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {stg.title}
                        </h3>
                        <span className="text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          Stage {stg.order}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed bg-white/70 p-2 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)]/60">
                        <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Required Evidence: </strong>
                        <span>{stg.evidence}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[var(--vt-color-neutral-500,#7C7894)] text-xs">
              Select a preset template from the list to view its milestone sequence.
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: CREATE CUSTOM STAGE PRESET MANUALLY (Smooth Single-Pane Scrolling) ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between bg-[var(--vt-color-neutral-50,#F7F7FA)] shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Create Custom Stage Preset Template
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Define a customized milestone sequence and mandatory evidence checkpoints.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body (Single smooth scroll container) */}
            <form onSubmit={handleSaveCustomPreset} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Preset Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Preset Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. 5-Bedroom Luxury Penthouse with Automation"
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                  />
                </div>

                {/* Category Typology */}
                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Typology Category
                  </label>
                  <VantagedSelect
                    value={modalForm.category}
                    onChange={(val) => setModalForm((prev) => ({ ...prev, category: val as any }))}
                    options={[
                      { value: "Residential", label: "Residential" },
                      { value: "Commercial", label: "Commercial" },
                      { value: "Infrastructure", label: "Civil & Infrastructure" },
                      { value: "Industrial", label: "Industrial" },
                      { value: "Specialized", label: "Specialized" },
                    ]}
                  />
                </div>

                {/* Typical Duration */}
                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={modalForm.typicalDuration}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, typicalDuration: e.target.value }))}
                    placeholder="e.g. 8 to 12 Months"
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Template Description
                  </label>
                  <textarea
                    rows={2}
                    value={modalForm.description}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of when this milestone template is recommended..."
                    className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs resize-none"
                  />
                </div>
              </div>

              {/* Dynamic Stage Sequence Builder */}
              <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                      Milestone Stages Sequence ({modalForm.stages.length} Stages)
                    </h4>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                      Add, arrange, or specify required proof for each inspection milestone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStageToModal}
                    className="h-7 px-3 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold transition-colors border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-1 cursor-pointer"
                  >
                    + Add Stage
                  </button>
                </div>

                <div className="space-y-3">
                  {modalForm.stages.map((stg, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                            Stage {idx + 1}
                          </span>
                        </div>

                        {modalForm.stages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStageFromModal(idx)}
                            className="text-[11px] text-[var(--vt-color-red-600,#C92A2A)] hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Stage Title (e.g. Substructure Raft)"
                            value={stg.title}
                            onChange={(e) => handleStageFieldChange(idx, "title", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] font-semibold"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Required Evidence (e.g. Cube tests, photos)"
                            value={stg.evidence}
                            onChange={(e) => handleStageFieldChange(idx, "evidence", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-neutral-700,#443E63)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-2 pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-9 px-4 rounded-xl bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] text-xs font-semibold border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  Save Preset to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
