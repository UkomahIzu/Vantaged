"use client";

import { useState, useEffect } from "react";

export const STORAGE_KEY_DIRECTOR_DEMO = "vantaged_director_demo_mode";

export function getIsDirectorDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY_DIRECTOR_DEMO) === "true";
  } catch {
    return false;
  }
}

export function setDirectorDemoMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_DIRECTOR_DEMO, enabled ? "true" : "false");
    window.dispatchEvent(new Event("vantaged_director_demo_toggle"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to set director demo mode:", err);
  }
}

export function useDirectorDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const sync = () => {
      setIsDemoMode(getIsDirectorDemoMode());
    };

    sync();
    window.addEventListener("vantaged_director_demo_toggle", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vantaged_director_demo_toggle", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleDemoMode = () => {
    const next = !getIsDirectorDemoMode();
    setDirectorDemoMode(next);
    setIsDemoMode(next);
  };

  return {
    isDemoMode,
    toggleDemoMode,
    setDemoMode: (val: boolean) => {
      setDirectorDemoMode(val);
      setIsDemoMode(val);
    },
  };
}
