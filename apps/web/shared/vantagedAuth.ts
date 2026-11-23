"use client";

/**
 * Vantaged Authentication Adapter (Local Storage + Local JSON API).
 *
 * Designed as a clean 1:1 drop-in boundary for Supabase Auth + Postgres:
 * when migrating to Supabase, replace the implementation inside these
 * functions with `supabase.auth.signUp`, `supabase.auth.signInWithPassword`,
 * `supabase.auth.signOut`, and `profiles` table queries without changing
 * any calling components or route guards.
 */

export const KEY_REGISTERED_OWNERS = "vantaged_registered_owners";
export const KEY_OWNER_SESSION = "vantaged_owner_session";
export const KEY_REGISTERED_CONTRACTORS = "vantaged_registered_contractors";
export const KEY_CONTRACTOR_SESSION = "vantaged_contractor_session";
export const AUTH_CHANGE_EVENT = "vantaged_auth_change";

export interface OwnerAccountRecord {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  role: string;
  idMethod: "NIN" | "PASSPORT";
  idNumber: string;
  orgName?: string;
  rcNumber?: string;
  createdAt: string;
}

export interface OwnerSession {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  idMethod: "NIN" | "PASSPORT";
  idNumber: string;
  signedInAt: string;
}

export interface ContractorAccountRecord {
  id: string;
  companyName: string;
  rcNumber: string;
  directorName: string;
  email: string;
  password: string;
  role: "Director" | "Site Manager" | "Office Coordinator" | "Crew Member";
  phone?: string;
  submissionId?: string;
  createdAt: string;
  issuedBy?: "Vantaged Admin" | "Company Director";
}

export interface ContractorSession {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  companyName: string;
  rcNumber: string;
  signedInAt: string;
}

function broadcastAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  window.dispatchEvent(new Event("storage"));
}

/* ─────────────────────────── OWNER AUTH ─────────────────────────── */

export function readRegisteredOwners(): OwnerAccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_REGISTERED_OWNERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getOwnerSession(): OwnerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_OWNER_SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OwnerSession;
    if (!parsed?.email || !parsed?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Returns a localStorage key isolated to the currently signed-in Owner account.
 * Mirrors Supabase Row-Level Security (WHERE owner_id = auth.uid()).
 */
export function getOwnerScopedKey(baseKey: string): string {
  const session = getOwnerSession();
  if (!session?.userId) return baseKey;
  return `${baseKey}__${session.userId}`;
}

function persistOwnerSession(account: OwnerAccountRecord): OwnerSession {
  const session: OwnerSession = {
    userId: account.id,
    fullName: account.fullName,
    email: account.email,
    phone: account.phone,
    role: account.role,
    idMethod: account.idMethod,
    idNumber: account.idNumber,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY_OWNER_SESSION, JSON.stringify(session));
  localStorage.setItem("vantaged_user_name", account.fullName);
  localStorage.setItem("vantaged_fullName", account.fullName);
  localStorage.setItem("vantaged_user_email", account.email);
  localStorage.setItem("vantaged_email", account.email);
  localStorage.setItem("vantaged_user_phone", `${account.countryCode} ${account.phone}`);
  localStorage.setItem("vantaged_user_role", account.role);
  broadcastAuthChange();
  return session;
}

export async function signUpOwner(input: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  role: string;
  idMethod: "NIN" | "PASSPORT";
  idNumber: string;
  orgName?: string;
  rcNumber?: string;
}): Promise<{ ok: true; session: OwnerSession } | { ok: false; error: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (!normalizedEmail || !input.password || !input.fullName.trim()) {
    return { ok: false, error: "Please fill in your full name, email, and password." };
  }

  const existing = readRegisteredOwners();
  const duplicate = existing.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );
  if (duplicate) {
    return {
      ok: false,
      error: "An account with this email already exists. Please log in instead.",
    };
  }

  const created: OwnerAccountRecord = {
    id: `own-${Date.now()}`,
    fullName: input.fullName.trim(),
    email: normalizedEmail,
    password: input.password,
    phone: input.phone.trim(),
    countryCode: input.countryCode,
    role: input.role,
    idMethod: input.idMethod,
    idNumber: input.idNumber.trim(),
    orgName: input.orgName?.trim(),
    rcNumber: input.rcNumber?.trim(),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(KEY_REGISTERED_OWNERS, JSON.stringify([created, ...existing]));

  // Ensure a newly registered owner always starts in a clean empty state (never leftover legacy data)
  localStorage.setItem("vantaged_owner_demo_mode", "false");
  const legacyKeys = [
    "vantaged_active_projects",
    "vantaged_proposed_plans",
    "vantaged_contract_history",
    "vantaged_project_briefs",
    "vantaged_owner_live_notifications",
    "vantaged_owner_notifications",
    "vantaged_shared_conversations",
    "vantaged_client_reps_list",
    "vantaged_inspection_tickets",
    "vantaged_active_share_links",
    "vantaged_owner_tier",
    "vantaged_owner_extra_slots",
    "vantaged_owner_quick_slots",
  ];
  legacyKeys.forEach((k) => localStorage.removeItem(k));

  const session = persistOwnerSession(created);
  return { ok: true, session };
}

export async function signInOwner(
  email: string,
  password: string
): Promise<{ ok: true; session: OwnerSession } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const owners = readRegisteredOwners();
  const matched = owners.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );

  if (!matched) {
    return {
      ok: false,
      error: "No account found with this email. Please sign up first to create your Owner account.",
    };
  }

  if (matched.password !== password) {
    return {
      ok: false,
      error: "Incorrect password. Please check your password and try again.",
    };
  }

  const session = persistOwnerSession(matched);
  return { ok: true, session };
}

export async function signInOwnerWithGoogle(
  email: string
): Promise<{ ok: true; session: OwnerSession } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const owners = readRegisteredOwners();
  const matched = owners.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );

  if (!matched) {
    return {
      ok: false,
      error: `No registered Vantaged Owner account found for ${email || "this Google account"}. Please sign up first.`,
    };
  }

  const session = persistOwnerSession(matched);
  return { ok: true, session };
}

export function signOutOwner(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_OWNER_SESSION);
  broadcastAuthChange();
}

/* ─────────────────────────── CONTRACTOR AUTH ─────────────────────────── */

export function readLocalContractorAccounts(): ContractorAccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_REGISTERED_CONTRACTORS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getContractorSession(): ContractorSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_CONTRACTOR_SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ContractorSession;
    if (!parsed?.email || !parsed?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistContractorSession(
  account: ContractorAccountRecord
): ContractorSession {
  const session: ContractorSession = {
    userId: account.id,
    fullName: account.directorName,
    email: account.email,
    role: account.role,
    companyName: account.companyName,
    rcNumber: account.rcNumber,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY_CONTRACTOR_SESSION, JSON.stringify(session));
  localStorage.setItem("vantaged_contractor_user_email", account.email);
  localStorage.setItem("vantaged_contractor_user_role", account.role);
  localStorage.setItem("vantaged_contractor_user_name", account.directorName);
  localStorage.setItem("vantaged_contractor_company_name", account.companyName);
  localStorage.setItem("vantaged_contractor_rc_number", account.rcNumber);
  broadcastAuthChange();
  return session;
}

export async function signInContractor(
  email: string,
  password: string,
  selectedRoleLabel?: string
): Promise<{ ok: true; session: ContractorSession } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  let serverAccounts: ContractorAccountRecord[] = [];
  try {
    const res = await fetch("/api/contractor-accounts", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        serverAccounts = json.data;
        localStorage.setItem(
          KEY_REGISTERED_CONTRACTORS,
          JSON.stringify(serverAccounts)
        );
      }
    }
  } catch {
    // Fallback to local cache if API unavailable
  }

  const localAccounts = readLocalContractorAccounts();
  const mergedMap = new Map<string, ContractorAccountRecord>();
  for (const acc of [...localAccounts, ...serverAccounts]) {
    mergedMap.set(acc.email.trim().toLowerCase(), acc);
  }

  const matched = mergedMap.get(normalizedEmail);
  if (!matched) {
    return {
      ok: false,
      error:
        "No approved company account found for this email. Company Director logins are issued by Vantaged Admin after verification.",
    };
  }

  if (matched.password !== password) {
    return {
      ok: false,
      error: "Incorrect password. Please use the credentials issued by Vantaged Admin.",
    };
  }

  if (
    selectedRoleLabel &&
    matched.role.toLowerCase() !== selectedRoleLabel.toLowerCase()
  ) {
    return {
      ok: false,
      error: `This account is registered as "${matched.role}", not "${selectedRoleLabel}". Please select the matching role on the left.`,
    };
  }

  const session = persistContractorSession(matched);
  return { ok: true, session };
}

export function signOutContractor(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_CONTRACTOR_SESSION);
  localStorage.removeItem("vantaged_contractor_user");
  broadcastAuthChange();
}
