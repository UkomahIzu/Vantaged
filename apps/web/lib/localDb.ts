import fs from "fs";
import path from "path";

/**
 * Shared local JSON database helper pointing to `packages/db/data/`.
 * Designed as the single storage boundary to swap 1:1 with Supabase Postgres later.
 */
export function getDbDir(): string {
  const candidates = [
    path.join(process.cwd(), "packages", "db", "data"),
    path.join(process.cwd(), "..", "..", "packages", "db", "data"),
    path.join(process.cwd(), "..", "packages", "db", "data"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  const fallback = candidates[0]!;
  if (!fs.existsSync(fallback)) {
    fs.mkdirSync(fallback, { recursive: true });
  }
  return fallback;
}

export function readDbJson<T>(fileName: string, fallback: T): T {
  const filePath = path.join(getDbDir(), fileName);
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[localDb] Failed to read ${fileName}:`, err);
    return fallback;
  }
}

export function writeDbJson<T>(fileName: string, data: T): void {
  const dir = getDbDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}
