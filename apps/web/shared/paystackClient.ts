"use client";

export interface PaystackCheckoutParams {
  email: string;
  amountNaira: number;
  purpose:
    | "owner_plan"
    | "owner_extra_slots"
    | "company_plan"
    | "company_extra_slots"
    | "escrow_deposit";
  callbackPath: string;
  metadata?: Record<string, any>;
}

export function parseNairaString(priceStr: string, fallback = 25000): number {
  const digits = String(priceStr || "").replace(/[^0-9.]/g, "");
  const parsed = parseFloat(digits);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : fallback;
}

export async function startPaystackCheckout(
  params: PaystackCheckoutParams
): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!res.ok || !json?.success || !json?.data?.authorization_url) {
      return {
        ok: false,
        error: json?.error || "Could not start Paystack checkout.",
      };
    }
    window.location.href = json.data.authorization_url;
    return { ok: true, reference: json.data.reference };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Network error starting Paystack checkout.",
    };
  }
}

export async function verifyPaystackCallback(): Promise<{
  checked: boolean;
  success?: boolean;
  data?: any;
  error?: string;
}> {
  if (typeof window === "undefined") return { checked: false };
  const url = new URL(window.location.href);
  const ref =
    url.searchParams.get("paystack_ref") ||
    url.searchParams.get("reference") ||
    url.searchParams.get("trxref");
  if (!ref) return { checked: false };

  // Strip Paystack params from URL cleanly so refreshing won't re-verify
  url.searchParams.delete("paystack_ref");
  url.searchParams.delete("reference");
  url.searchParams.delete("trxref");
  window.history.replaceState({}, "", url.toString());

  try {
    const res = await fetch(
      `/api/paystack/verify?reference=${encodeURIComponent(ref)}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (!res.ok || !json?.success) {
      return {
        checked: true,
        success: false,
        error: json?.error || "Paystack payment was not completed.",
      };
    }
    return { checked: true, success: true, data: json.data };
  } catch (err: any) {
    return {
      checked: true,
      success: false,
      error: err?.message || "Could not verify Paystack payment.",
    };
  }
}

export async function fetchPaystackBanks(): Promise<
  Array<{ name: string; code: string }>
> {
  try {
    const res = await fetch("/api/paystack/banks", { cache: "no-store" });
    const json = await res.json();
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map((b: any) => ({ name: b.name, code: b.code }));
    }
  } catch {}
  return [];
}

export async function verifyBankAccountNuban(
  accountNumber: string,
  bankCode: string
): Promise<{ ok: true; accountName: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/paystack/resolve-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountNumber, bankCode }),
    });
    const json = await res.json();
    if (!res.ok || !json?.success || !json?.data?.account_name) {
      return {
        ok: false,
        error: json?.error || "Could not verify NUBAN account.",
      };
    }
    return { ok: true, accountName: json.data.account_name };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Bank verification error." };
  }
}
