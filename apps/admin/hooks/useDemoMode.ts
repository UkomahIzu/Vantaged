"use client";

import { useState, useEffect } from "react";

export const STORAGE_KEY_DEMO_MODE = "vantaged_admin_demo_mode";

/**
 * Returns true only if the admin has explicitly toggled on Demo Data.
 * Defaults to false (clean empty state matching Owner Dashboard).
 */
export function getIsDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DEMO_MODE);
    return saved === "true";
  } catch {
    return false;
  }
}

export function setDemoMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_DEMO_MODE, enabled ? "true" : "false");
    window.dispatchEvent(new Event("vantaged_admin_demo_toggle"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to set admin demo mode:", err);
  }
}

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const sync = () => {
      setIsDemoMode(getIsDemoMode());
    };

    sync();
    window.addEventListener("vantaged_admin_demo_toggle", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vantaged_admin_demo_toggle", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleDemoMode = () => {
    const next = !getIsDemoMode();
    setDemoMode(next);
    setIsDemoMode(next);
  };

  return {
    isDemoMode,
    toggleDemoMode,
    setDemoMode: (val: boolean) => {
      setDemoMode(val);
      setIsDemoMode(val);
    },
  };
}
