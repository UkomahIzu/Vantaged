"use client";

import { useEffect, useState } from "react";
import { readLocalData } from "../utils/localPersistence";
import { readScopedCompanyAcceptedProjects } from "../../../shared/vantagedAuth";
import { DEMO_DIRECTOR_PROJECTS } from "../data/directorData";
import { useDirectorDemoMode } from "./useDirectorDemoMode";

export type ContractorPlanId =
  | "contractor-starter"
  | "contractor-verified"
  | "contractor-prime";

export interface ContractorPlanInfo {
  id: ContractorPlanId;
  name: string;
  slots: number;
}

export const CONTRACTOR_CAPACITY_EVENT = "vantaged_director_capacity_update";

export const DEFAULT_CONTRACTOR_PLAN_MAP: Record<ContractorPlanId, ContractorPlanInfo> = {
  "contractor-starter": {
    id: "contractor-starter",
    name: "Starter Contractor",
    slots: 1,
  },
  "contractor-verified": {
    id: "contractor-verified",
    name: "Verified Builder",
    slots: 3,
  },
  "contractor-prime": {
    id: "contractor-prime",
    name: "Prime Consortium",
    slots: 8,
  },
};

export function normalizeContractorPlanId(raw: string | null | undefined): ContractorPlanId {
  if (!raw || raw === "starter" || raw === "contractor-starter") {
    return "contractor-starter";
  }
  if (raw === "enterprise" || raw === "contractor-prime") {
    return "contractor-prime";
  }
  if (raw === "verified" || raw === "contractor-verified") {
    return "contractor-verified";
  }
  return "contractor-starter";
}

export function readStoredContractorPlanId(): ContractorPlanId {
  return normalizeContractorPlanId(
    readLocalData<string>("vantaged_director_plan_id", "contractor-starter")
  );
}

export function readStoredContractorExtraSlots(): number {
  const raw = readLocalData<number>("vantaged_director_extra_slots", 0);
  return Math.max(0, Number(raw) || 0);
}

export function broadcastContractorCapacityUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONTRACTOR_CAPACITY_EVENT));
  }
}

export interface ContractorCapacityState {
  planId: ContractorPlanId;
  planName: string;
  baseSlots: number;
  extraSlots: number;
  totalSlots: number;
  usedSlots: number;
  realUsedSlots: number;
  remainingSlots: number;
  canAddProject: boolean;
  isAtCapacity: boolean;
  isOverCapacity: boolean;
}

export function useContractorCapacity(overrideUsedSlots?: number): ContractorCapacityState {
  const { isDemoMode } = useDirectorDemoMode();
  const [planMap, setPlanMap] = useState<Record<ContractorPlanId, ContractorPlanInfo>>(
    DEFAULT_CONTRACTOR_PLAN_MAP
  );
  const [planId, setPlanId] = useState<ContractorPlanId>(() => readStoredContractorPlanId());
  const [extraSlots, setExtraSlots] = useState<number>(() => readStoredContractorExtraSlots());
  const [realAcceptedCount, setRealAcceptedCount] = useState<number>(() =>
    typeof window !== "undefined" ? readScopedCompanyAcceptedProjects().length : 0
  );

  useEffect(() => {
    const sync = () => {
      setPlanId(readStoredContractorPlanId());
      setExtraSlots(readStoredContractorExtraSlots());
      setRealAcceptedCount(readScopedCompanyAcceptedProjects().length);
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener(CONTRACTOR_CAPACITY_EVENT, sync);
    window.addEventListener("vantaged_company_projects_update", sync);
    window.addEventListener("vantaged_storage_update", sync);
    window.addEventListener("vantaged_director_demo_toggle", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener(CONTRACTOR_CAPACITY_EVENT, sync);
      window.removeEventListener("vantaged_company_projects_update", sync);
      window.removeEventListener("vantaged_storage_update", sync);
      window.removeEventListener("vantaged_director_demo_toggle", sync);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadPricing = () => {
      fetch("/api/pricing")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!active) return;
          const tiers = data?.roles?.contractor?.tiers;
          if (!Array.isArray(tiers)) return;
          const next: Record<ContractorPlanId, ContractorPlanInfo> = {
            ...DEFAULT_CONTRACTOR_PLAN_MAP,
          };
          for (const t of tiers) {
            if (t?.id && typeof t.capacitySlots === "number") {
              const normalized = normalizeContractorPlanId(t.id);
              next[normalized] = {
                id: normalized,
                name: t.name || next[normalized].name,
                slots: t.capacitySlots,
              };
            }
          }
          setPlanMap(next);
        })
        .catch(() => {});
    };

    loadPricing();
    window.addEventListener("vantaged_pricing_update", loadPricing);
    return () => {
      active = false;
      window.removeEventListener("vantaged_pricing_update", loadPricing);
    };
  }, []);

  const activePlan = planMap[planId] ?? DEFAULT_CONTRACTOR_PLAN_MAP["contractor-starter"];
  const baseSlots = activePlan.slots;
  const totalSlots = baseSlots + extraSlots;

  // Demo items never exceed the company's paid slot allocation
  const demoFillCount = isDemoMode
    ? Math.min(DEMO_DIRECTOR_PROJECTS.length, Math.max(0, totalSlots - realAcceptedCount))
    : 0;
  const computedUsed = realAcceptedCount + demoFillCount;
  const usedSlots = typeof overrideUsedSlots === "number" ? overrideUsedSlots : computedUsed;
  const remainingSlots = Math.max(0, totalSlots - usedSlots);

  return {
    planId,
    planName: activePlan.name,
    baseSlots,
    extraSlots,
    totalSlots,
    usedSlots,
    realUsedSlots: realAcceptedCount,
    remainingSlots,
    canAddProject: usedSlots < totalSlots,
    isAtCapacity: usedSlots >= totalSlots,
    isOverCapacity: usedSlots > totalSlots,
  };
}
