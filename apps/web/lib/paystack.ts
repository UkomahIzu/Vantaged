import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured in .env.local");
  }
  return key;
}

async function paystackFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ status: boolean; message: string; data: T }> {
  const res = await fetch(`${PAYSTACK_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json?.message || `Paystack API error (${res.status})`);
  }
  return json;
}

export interface PaystackInitializeParams {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  channels?: string[];
  metadata?: Record<string, any>;
}

export async function initializePaystackTransaction(
  params: PaystackInitializeParams
) {
  const amountKobo = Math.round(params.amountNaira * 100);
  if (amountKobo < 10000) {
    throw new Error("Minimum Paystack transaction amount is ₦100.");
  }

  const res = await paystackFetch<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: amountKobo,
      currency: "NGN",
      reference: params.reference,
      callback_url: params.callbackUrl,
      channels: params.channels || ["card", "bank", "bank_transfer", "ussd"],
      metadata: params.metadata || {},
    }),
  });

  return res.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const res = await paystackFetch<{
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    paid_at: string;
    customer: { email: string };
    metadata: Record<string, any>;
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);
  return res.data;
}

export async function listNigerianBanks() {
  const res = await paystackFetch<
    Array<{ id: number; name: string; code: string; slug: string; active: boolean }>
  >("/bank?country=nigeria&perPage=100");
  return res.data.filter((b) => b.active);
}

export async function resolveNubanAccount(
  accountNumber: string,
  bankCode: string
) {
  const res = await paystackFetch<{
    account_number: string;
    account_name: string;
    bank_id: number;
  }>(
    `/bank/resolve?account_number=${encodeURIComponent(
      accountNumber
    )}&bank_code=${encodeURIComponent(bankCode)}`
  );
  return res.data;
}

export async function createTransferRecipient(params: {
  name: string;
  accountNumber: string;
  bankCode: string;
}) {
  const res = await paystackFetch<{
    recipient_code: string;
    name: string;
    details: { account_number: string; bank_name: string };
  }>("/transferrecipient", {
    method: "POST",
    body: JSON.stringify({
      type: "nuban",
      name: params.name,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: "NGN",
    }),
  });
  return res.data;
}

export async function initiateStageTransfer(params: {
  amountNaira: number;
  recipientCode: string;
  reference: string;
  reason: string;
}) {
  const amountKobo = Math.round(params.amountNaira * 100);
  const res = await paystackFetch<{
    transfer_code: string;
    reference: string;
    status: string;
    amount: number;
  }>("/transfer", {
    method: "POST",
    body: JSON.stringify({
      source: "balance",
      amount: amountKobo,
      recipient: params.recipientCode,
      reference: params.reference,
      reason: params.reason,
    }),
  });
  return res.data;
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", getSecretKey())
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
