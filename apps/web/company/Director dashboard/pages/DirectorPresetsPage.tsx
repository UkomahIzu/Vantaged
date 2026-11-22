"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import {
  BUILT_IN_PLATFORM_PRESETS,
  StageItem,
  StagePreset,
} from "../data/stagePresetsData";

type CategoryFilter =
  | "All"
  | "Residential"
  | "Commercial"
  | "Infrastructure"
  | "Industrial"
  | "Specialized"
  | "AdminSynced"
  | "CompanyCustom";

const DEFAULT_MODAL_STAGES: StageItem[] = [
  {
    order: 1,
    title: "Site Mobilization & Substructure",
    evidence: "Survey benchmarks, excavation log, blinding concrete & foundation rebar photos",
  },
  {
    order: 2,
    title: "Superstructure Frame & Masonry",
    evidence: "Column formwork, lintel beams, concrete cube test certificates",
  },
  {
    order: 3,
    title: "Roof Trusses, MEP Rough-in & Plastering",
    evidence:
      "Roof covering watertightness check, plumbing pressure gauge test (5 bar), wall screeding",
  },
  {
    order: 4,
    title: "Architectural Finishes & Final Snagging",
    evidence: "Tiling inspection, sanitary/electrical fixtures check, client handover checklist",
  },
];

export function DirectorPresetsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_presets");

  const [adminCustomPresets, setAdminCustomPresets] = useState<StagePreset[]>([]);
  const [adminOverrides, setAdminOverrides] = useState<Record<string, StagePreset>>({});
  const [companyPresets, setCompanyPresets] = useState<StagePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset_duplex");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create / Edit Company Preset Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState({
    name: "",
    category: "Residential" as StagePreset["category"],
    typicalDuration: "",
    description: "",
    stages: DEFAULT_MODAL_STAGES.map((s) => ({ ...s })),
  });

  const syncPresets = () => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) return;
        if (Array.isArray(data.adminCustomPresets)) {
          setAdminCustomPresets(
            data.adminCustomPresets.map((p: StagePreset) => ({
              ...p,
              source: "admin" as const,
            }))
          );
        }
        if (data.adminOverrides && typeof data.adminOverrides === "object") {
          setAdminOverrides(data.adminOverrides);
        }
        if (Array.isArray(data.companyPresets)) {
          setCompanyPresets(
            data.companyPresets.map((p: StagePreset) => ({
              ...p,
              source: "company" as const,
              isCustom: true,
            }))
          );
        }
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("vantaged_company_stage_presets");
            if (stored) setCompanyPresets(JSON.parse(stored));
          } catch {
            // ignore
          }
        }
      });
  };

  useEffect(() => {
    syncPresets();
    const onFocus = () => syncPresets();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Merge: Company Custom Presets + Admin Custom Presets + Built-In Platform Presets (with Admin Overrides applied)
  const allPresets = useMemo(() => {
    const mergedBuiltIn = BUILT_IN_PLATFORM_PRESETS.map((bp) =>
      adminOverrides[bp.id]
        ? { ...bp, ...adminOverrides[bp.id], isModified: true, source: "platform" as const }
        : { ...bp, source: "platform" as const }
    );
    return [...companyPresets, ...adminCustomPresets, ...mergedBuiltIn];
  }, [companyPresets, adminCustomPresets, adminOverrides]);

  const categoryOptions = useMemo(
    () => [
      { value: "All", label: `All Typologies (${allPresets.length})` },
      {
        value: "Residential",
        label: `Residential (${allPresets.filter((p) => p.category === "Residential").length})`,
      },
      {
        value: "Commercial",
        label: `Commercial (${allPresets.filter((p) => p.category === "Commercial").length})`,
      },
      {
        value: "Infrastructure",
        label: `Civil & Infrastructure (${allPresets.filter((p) => p.category === "Infrastructure").length})`,
      },
      {
        value: "Industrial",
        label: `Industrial (${allPresets.filter((p) => p.category === "Industrial").length})`,
      },
      {
        value: "Specialized",
        label: `Specialized & Amenities (${allPresets.filter((p) => p.category === "Specialized").length})`,
      },
      {
        value: "AdminSynced",
        label: `Admin Platform Presets (${adminCustomPresets.length + BUILT_IN_PLATFORM_PRESETS.length})`,
      },
      {
        value: "CompanyCustom",
        label: `My Company Presets (${companyPresets.length})`,
      },
    ],
    [allPresets, adminCustomPresets.length, companyPresets.length]
  );

  const filteredPresets = useMemo(() => {
    return allPresets.filter((p) => {
      const matchesCategory =
        activeCategory === "All"
          ? true
          : activeCategory === "CompanyCustom"
          ? p.source === "company"
          : activeCategory === "AdminSynced"
          ? p.source === "admin" || p.source === "platform"
          : p.category === activeCategory;

      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.stages.some(
          (s) =>
            s.title.toLowerCase().includes(q) || s.evidence.toLowerCase().includes(q)
        )
      );
    });
  }, [allPresets, activeCategory, searchQuery]);

  useEffect(() => {
    if (filteredPresets.length > 0) {
      const exists = filteredPresets.some((p) => p.id === selectedPresetId);
      if (!exists && filteredPresets[0]) {
        setSelectedPresetId(filteredPresets[0].id);
      }
    }
  }, [filteredPresets, selectedPresetId]);

  const currentPreset =
    allPresets.find((p) => p.id === selectedPresetId) ||
    allPresets[0] ||
    BUILT_IN_PLATFORM_PRESETS[0];

  // Stage builder helpers
  const handleAddStageToModal = () => {
    setModalForm((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        { order: prev.stages.length + 1, title: "", evidence: "" },
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

  const handleStageFieldChange = (
    index: number,
    field: "title" | "evidence",
    value: string
  ) => {
    setModalForm((prev) => {
      const updated = prev.stages.map((stg, i) =>
        i === index ? { ...stg, [field]: value } : stg
      );
      return { ...prev, stages: updated };
    });
  };

  const handleMoveStageInModal = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= modalForm.stages.length) return;
    setModalForm((prev) => {
      const next = [...prev.stages];
      const temp = next[index]!;
      next[index] = next[targetIndex]!;
      next[targetIndex] = temp;
      return {
        ...prev,
        stages: next.map((stg, idx) => ({ ...stg, order: idx + 1 })),
      };
    });
  };

  const openCreateModal = () => {
    setEditingPresetId(null);
    setModalForm({
      name: "",
      category: "Residential",
      typicalDuration: "",
      description: "",
      stages: DEFAULT_MODAL_STAGES.map((s) => ({ ...s })),
    });
    setIsModalOpen(true);
  };

  const openEditCompanyModal = (preset: StagePreset) => {
    setEditingPresetId(preset.id);
    setModalForm({
      name: preset.name,
      category: preset.category,
      typicalDuration: preset.typicalDuration,
      description: preset.description,
      stages: preset.stages.map((s, idx) => ({
        order: idx + 1,
        title: s.title,
        evidence: s.evidence,
      })),
    });
    setIsModalOpen(true);
  };

  const handleDuplicateToCompany = (preset: StagePreset) => {
    setEditingPresetId(null);
    setModalForm({
      name: `${preset.name.split("(")[0].trim()} (Company Edition)`,
      category: preset.category,
      typicalDuration: preset.typicalDuration,
      description: preset.description,
      stages: preset.stages.map((s, idx) => ({
        order: idx + 1,
        title: s.title,
        evidence: s.evidence,
      })),
    });
    setIsModalOpen(true);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return;

    const invalidStage = modalForm.stages.find((s) => !s.title.trim());
    if (invalidStage) {
      alert(`Please fill in the title for Stage ${invalidStage.order}.`);
      return;
    }

    const normalizedStages: StageItem[] = modalForm.stages.map((stg, idx) => ({
      order: idx + 1,
      title: stg.title.trim(),
      evidence:
        stg.evidence.trim() ||
        "Site photos, signed field inspection report, quality testing certificates.",
    }));

    if (editingPresetId) {
      const updatedPreset: StagePreset = {
        id: editingPresetId,
        name: modalForm.name.trim(),
        category: modalForm.category,
        typicalDuration: modalForm.typicalDuration.trim() || "Flexible Schedule",
        stagesCount: normalizedStages.length,
        description:
          modalForm.description.trim() ||
          "Custom milestone preset created by company director.",
        isCustom: true,
        source: "company",
        stages: normalizedStages,
      };

      const nextCompany = companyPresets.map((p) =>
        p.id === editingPresetId ? updatedPreset : p
      );
      setCompanyPresets(nextCompany);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "vantaged_company_stage_presets",
          JSON.stringify(nextCompany)
        );
      }

      fetch("/api/presets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPresetId, preset: updatedPreset }),
      }).catch(() => {});

      setSelectedPresetId(editingPresetId);
      setIsModalOpen(false);
      setEditingPresetId(null);
      showToast(`Company preset "${updatedPreset.name}" updated!`);
      return;
    }

    const newPresetId = `preset_company_${Date.now()}`;
    const newPreset: StagePreset = {
      id: newPresetId,
      name: modalForm.name.trim(),
      category: modalForm.category,
      typicalDuration: modalForm.typicalDuration.trim() || "Flexible Schedule",
      stagesCount: normalizedStages.length,
      description:
        modalForm.description.trim() ||
        "Custom milestone preset configured by your company.",
      isCustom: true,
      source: "company",
      stages: normalizedStages,
    };

    const nextCompany = [newPreset, ...companyPresets];
    setCompanyPresets(nextCompany);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "vantaged_company_stage_presets",
        JSON.stringify(nextCompany)
      );
    }

    fetch("/api/presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPreset),
    }).catch(() => {});

    setSelectedPresetId(newPresetId);
    setIsModalOpen(false);
    showToast(`Company preset "${newPreset.name}" created!`);
  };

  const handleDeleteCompanyPreset = (presetId: string, presetName: string) => {
    if (typeof window === "undefined") return;
    if (!window.confirm(`Delete company preset "${presetName}"?`)) return;

    const nextCompany = companyPresets.filter((p) => p.id !== presetId);
    setCompanyPresets(nextCompany);
    localStorage.setItem("vantaged_company_stage_presets", JSON.stringify(nextCompany));

    fetch(`/api/presets?id=${presetId}`, { method: "DELETE" }).catch(() => {});
    setSelectedPresetId("preset_duplex");
    showToast(`Company preset "${presetName}" deleted.`);
  };

  const handleExportPresetJSON = (preset: StagePreset) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(JSON.stringify(preset, null, 2));
      showToast("Preset JSON copied to clipboard!");
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Decorative background waves */}
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

      {/* Left Sidebar Navigation */}
      <DirectorSidebarNav currentActiveItem="presets" />

      {/* Main Workspace */}
      <main
        ref={scrollRef}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 sm:gap-6 pb-24 md:pb-12"
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

        {/* Top Header Bar (Matches Admin Stage Preset Library) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
                Standard Workflows &amp; Inspection Templates
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
              Stage Preset Library
            </h1>
            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
              Synced with Vantaged Admin platform templates, plus your company&apos;s own reusable construction milestone presets.
            </p>
          </div>

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
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] px-4 py-2 text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] cursor-pointer active:scale-98"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Company Preset</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
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
              containerClassName="w-full sm:w-[290px]"
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

          <div className="relative w-full sm:w-64 shrink-0">
            <svg className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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

        {/* Main 12-Col Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Preset List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] font-semibold px-1">
              <span>Available Presets ({filteredPresets.length})</span>
              {activeCategory !== "All" && (
                <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                  Filter: {activeCategory}
                </span>
              )}
            </div>

            {filteredPresets.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-center flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">No Presets Found</p>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-xs">
                  No templates match your search criteria. Try another typology or create a company preset.
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-3 text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                >
                  + Create Company Preset
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
                          {p.source === "company" ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                              Company
                            </span>
                          ) : p.source === "admin" ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-800,#352488)] border border-[var(--vt-color-indigo-200,#D5D2EF)]">
                              Admin
                            </span>
                          ) : null}
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

          {/* Right Column: Sticky Milestone Sequence Breakdown */}
          <div className="lg:col-span-7 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-6 shadow-sm lg:sticky lg:top-4 self-start">
            {currentPreset ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-indigo-900,#261A66)]">
                        {currentPreset.category}
                      </span>
                      {currentPreset.source === "company" ? (
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[var(--vt-color-orange-100,#FEDDC7)] text-[var(--vt-color-orange-800,#8D2B05)]">
                          Company Custom Preset
                        </span>
                      ) : currentPreset.source === "admin" ? (
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-800,#352488)] border border-[var(--vt-color-indigo-200,#D5D2EF)]">
                          Synced from Vantaged Admin
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]">
                          Platform Standard
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

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {currentPreset.source === "company" ? (
                        <button
                          type="button"
                          onClick={() => openEditCompanyModal(currentPreset)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] transition-colors cursor-pointer"
                        >
                          Edit Preset
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDuplicateToCompany(currentPreset)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] transition-colors cursor-pointer"
                        >
                          Customize Copy
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleExportPresetJSON(currentPreset)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer"
                      >
                        Export JSON
                      </button>

                      {currentPreset.source === "company" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCompanyPreset(currentPreset.id, currentPreset.name)
                          }
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestone Sequence */}
                <div className="flex items-center justify-between text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-3">
                  <span>Standard Milestone Sequence ({currentPreset.stages.length} Stages)</span>
                  <span className="text-[11px] font-normal text-[var(--vt-color-neutral-500,#7C7894)]">
                    Mandatory Evidence &amp; Inspection Log
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
                          <strong className="text-[var(--vt-color-indigo-900,#261A66)]">
                            Required Evidence:{" "}
                          </strong>
                          <span>{stg.evidence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Create / Edit Company Preset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between bg-[var(--vt-color-neutral-50,#F7F7FA)] shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {editingPresetId
                    ? "Edit Company Stage Preset"
                    : "Create Company Stage Preset"}
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Build a reusable milestone sequence and evidence checklist for your company&apos;s project proposals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPresetId(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSavePreset}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Preset Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) =>
                      setModalForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. 5-Bedroom Luxury Penthouse with Automation"
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Typology Category
                  </label>
                  <VantagedSelect
                    value={modalForm.category}
                    onChange={(val) =>
                      setModalForm((prev) => ({
                        ...prev,
                        category: val as StagePreset["category"],
                      }))
                    }
                    options={[
                      { value: "Residential", label: "Residential" },
                      { value: "Commercial", label: "Commercial" },
                      { value: "Infrastructure", label: "Civil & Infrastructure" },
                      { value: "Industrial", label: "Industrial" },
                      { value: "Specialized", label: "Specialized" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={modalForm.typicalDuration}
                    onChange={(e) =>
                      setModalForm((prev) => ({
                        ...prev,
                        typicalDuration: e.target.value,
                      }))
                    }
                    placeholder="e.g. 8 to 12 Months"
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Template Description
                  </label>
                  <textarea
                    rows={2}
                    value={modalForm.description}
                    onChange={(e) =>
                      setModalForm((prev) => ({ ...prev, description: e.target.value }))
                    }
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

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStageInModal(idx, -1)}
                            className="w-6 h-6 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === modalForm.stages.length - 1}
                            onClick={() => handleMoveStageInModal(idx, 1)}
                            className="w-6 h-6 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                          >
                            ↓
                          </button>
                          {modalForm.stages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStageFromModal(idx)}
                              className="text-[11px] text-rose-700 hover:underline cursor-pointer ml-1"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Stage Title (e.g. Substructure Raft)"
                          value={stg.title}
                          onChange={(e) =>
                            handleStageFieldChange(idx, "title", e.target.value)
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Required Evidence (e.g. Cube tests, photos)"
                          value={stg.evidence}
                          onChange={(e) =>
                            handleStageFieldChange(idx, "evidence", e.target.value)
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-neutral-700,#443E63)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPresetId(null);
                  }}
                  className="h-9 px-4 rounded-xl bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] text-xs font-semibold border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  {editingPresetId ? "Save Changes" : "Save Company Preset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
