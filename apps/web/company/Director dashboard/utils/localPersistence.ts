import { getContractorScopedKey } from "../../../shared/vantagedAuth";

export function readLocalData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const scopedKey = getContractorScopedKey(key);
    const raw = localStorage.getItem(scopedKey);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const scopedKey = getContractorScopedKey(key);
    localStorage.setItem(scopedKey, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}
