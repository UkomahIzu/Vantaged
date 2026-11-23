"use client";

import { useState, useEffect } from "react";
import {
  ContractorProjectDetail,
  getContractorProjectDetail,
} from "./contractorProjectData";
import { SHARED_SYNC_EVENT } from "../../../../shared/vantagedSyncBridge";

/**
 * Hydration-safe project loader: renders deterministic SSR data on initial pass,
 * then resolves any localStorage-accepted project after client mount.
 */
export function useContractorProject(projectId: string): ContractorProjectDetail {
  const [project, setProject] = useState<ContractorProjectDetail>(() =>
    getContractorProjectDetail(projectId, false)
  );

  useEffect(() => {
    const sync = () => {
      setProject(getContractorProjectDetail(projectId, true));
    };
    sync();
    window.addEventListener("vantaged_company_projects_update", sync);
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vantaged_company_projects_update", sync);
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [projectId]);

  return project;
}
