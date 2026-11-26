"use client";

import { useState, useEffect } from "react";
import { getProjectDetail, ProjectDetailData } from "./projectData";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
} from "../../../../shared/vantagedSyncBridge";

/**
 * Hydration-safe Owner project loader: renders deterministic SSR data on initial pass,
 * then resolves any newly created / accepted project from localStorage & backend state after mount.
 */
export function useOwnerProject(projectId: string): ProjectDetailData {
  const [project, setProject] = useState<ProjectDetailData>(() =>
    getProjectDetail(projectId, false)
  );

  useEffect(() => {
    const sync = () => {
      setProject(getProjectDetail(projectId, true));
    };
    sync();
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [projectId]);

  return project;
}
