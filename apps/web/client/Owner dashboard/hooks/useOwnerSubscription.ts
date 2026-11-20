"use client";

import { useState, useEffect } from "react";

export type OwnerTierId = "owner-private" | "owner-portfolio" | "owner-estate";

export interface OwnerCapacity {
  tierId: OwnerTierId;
  tierName: string;
  kicker: string;
  baseSlots: number;
  extraSlots: number;
  totalSlots: number;
  usedSlots: number;
  remainingSlots: number;
  canAddProject: boolean;
  priceMonthlyUSD: string;
  priceMonthlyNGN: string;
}

const TIER_CONFIGS: Record<
  OwnerTierId,
  {
    name: string;
    kicker: string;
    baseSlots: number;
    priceMonthlyUSD: string;
    priceMonthlyNGN: string;
  }
> = {
  "owner-private": {
    name: "Private Owner",
    kicker: "Single-Home Builder (Starter Tier)",
    baseSlots: 1,
    priceMonthlyUSD: "$0",
    priceMonthlyNGN: "₦0",
  },
  "owner-portfolio": {
    name: "Portfolio Investor",
    kicker: "Multi-Build Portfolio",
    baseSlots: 3,
    priceMonthlyUSD: "$49.99",
    priceMonthlyNGN: "₦65,000",
  },
  "owner-estate": {
    name: "Estate Developer",
    kicker: "Large-Scale Portfolios",
    baseSlots: 10,
    priceMonthlyUSD: "$149.99",
    priceMonthlyNGN: "₦200,000",
  },
};

let liveTierConfigs: Record<
  OwnerTierId,
  {
    name: string;
    kicker: string;
    baseSlots: number;
    priceMonthlyUSD: string;
    priceMonthlyNGN: string;
  }
> = { ...TIER_CONFIGS };

if (typeof window !== "undefined") {
  fetch("/api/pricing")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.roles?.owner?.tiers) {
        data.roles.owner.tiers.forEach((t: any) => {
          if (liveTierConfigs[t.id as OwnerTierId]) {
            liveTierConfigs[t.id as OwnerTierId] = {
              ...liveTierConfigs[t.id as OwnerTierId],
              priceMonthlyNGN: t.priceMonthlyNGN || liveTierConfigs[t.id as OwnerTierId].priceMonthlyNGN,
              priceMonthlyUSD: t.priceMonthlyUSD || liveTierConfigs[t.id as OwnerTierId].priceMonthlyUSD,
            };
          }
        });
        window.dispatchEvent(new Event("vantaged_pricing_update"));
      }
    })
    .catch(() => {});
}

export function getOwnerCapacity(currentUsedSlots?: number): OwnerCapacity {
  let tierId: OwnerTierId = "owner-private";
  let extraSlots = 0;

  if (typeof window !== "undefined") {
    const savedTier = localStorage.getItem("vantaged_owner_tier") as OwnerTierId | null;
    if (savedTier && liveTierConfigs[savedTier]) {
      tierId = savedTier;
    }
    const savedExtra = localStorage.getItem("vantaged_owner_extra_slots");
    if (savedExtra !== null) {
      const parsed = parseInt(savedExtra, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        extraSlots = parsed;
      }
    }
  }

  const config = liveTierConfigs[tierId];
  const totalSlots = config.baseSlots + extraSlots;
  const used = typeof currentUsedSlots === "number" ? currentUsedSlots : 0;
  const remaining = Math.max(0, totalSlots - used);

  return {
    tierId,
    tierName: config.name,
    kicker: config.kicker,
    baseSlots: config.baseSlots,
    extraSlots,
    totalSlots,
    usedSlots: used,
    remainingSlots: remaining,
    canAddProject: used < totalSlots,
    priceMonthlyUSD: config.priceMonthlyUSD,
    priceMonthlyNGN: config.priceMonthlyNGN,
  };
}

export function useOwnerSubscription(currentUsedSlots?: number) {
  const [capacity, setCapacity] = useState<OwnerCapacity>(() => getOwnerCapacity(currentUsedSlots));

  useEffect(() => {
    const sync = () => {
      setCapacity(getOwnerCapacity(currentUsedSlots));
    };

    sync();
    window.addEventListener("vantaged_storage_update", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("vantaged_demo_toggle", sync);
    window.addEventListener("vantaged_pricing_update", sync);
    return () => {
      window.removeEventListener("vantaged_storage_update", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("vantaged_demo_toggle", sync);
      window.removeEventListener("vantaged_pricing_update", sync);
    };
  }, [currentUsedSlots]);

  const upgradeTier = (tier: OwnerTierId) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_owner_tier", tier);
      window.dispatchEvent(new Event("vantaged_storage_update"));
      window.dispatchEvent(new Event("storage"));
    }
    setCapacity(getOwnerCapacity(currentUsedSlots));
  };

  const addExtraSlots = (count: number) => {
    if (typeof window !== "undefined") {
      const current = capacity.extraSlots;
      const updated = Math.max(0, current + count);
      localStorage.setItem("vantaged_owner_extra_slots", updated.toString());
      window.dispatchEvent(new Event("vantaged_storage_update"));
      window.dispatchEvent(new Event("storage"));
    }
    setCapacity(getOwnerCapacity(currentUsedSlots));
  };

  return {
    ...capacity,
    upgradeTier,
    addExtraSlots,
  };
}

