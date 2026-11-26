import { NextResponse } from "next/server";
import { initializePaystackTransaction } from "../../../../lib/paystack";
import { readDbJson, writeDbJson } from "../../../../lib/localDb";

export const dynamic = "force-dynamic";

export interface StoredPaymentRecord {
  id: string;
  reference: string;
  purpose:
    | "owner_plan"
    | "owner_extra_slots"
    | "company_plan"
    | "company_extra_slots"
    | "escrow_deposit"
    | "stage_payout";
  email: string;
  amountNaira: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "TRANSFERRED";
  channel?: string;
  metadata: Record<string, any>;
  applied?: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      amountNaira,
      purpose,
      callbackPath = "/owner/settings?tab=subscription",
      metadata = {},
    } = body || {};

    if (!email || !amountNaira || Number(amountNaira) < 100 || !purpose) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid email, amountNaira (>= ₦100), and purpose are required.",
        },
        { status: 400 }
      );
    }

    const reference = `VTG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const sep = callbackPath.includes("?") ? "&" : "?";
    const callbackUrl = `${origin}${callbackPath}${sep}paystack_ref=${encodeURIComponent(
      reference
    )}`;

    const requestedAmountNaira = Number(amountNaira);
    const isTestMode = process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_test_");
    // Paystack Test Mode cards cap at ₦500,000 per transaction; cap the test charge at ₦100,000
    // while preserving the full requested amount in metadata and payments.json.
    const paystackChargeNaira =
      isTestMode && requestedAmountNaira > 500000 ? 100000 : requestedAmountNaira;

    const initData = await initializePaystackTransaction({
      email: String(email).trim(),
      amountNaira: paystackChargeNaira,
      reference,
      callbackUrl,
      metadata: {
        ...metadata,
        purpose,
        vantagedRef: reference,
        requestedAmountNaira,
        testModeCapped: isTestMode && requestedAmountNaira > 500000,
      },
    });

    const payments = readDbJson<StoredPaymentRecord[]>("payments.json", []);
    const record: StoredPaymentRecord = {
      id: `pay-${Date.now()}`,
      reference: initData.reference,
      purpose,
      email: String(email).trim().toLowerCase(),
      amountNaira: requestedAmountNaira,
      status: "PENDING",
      metadata: {
        ...metadata,
        purpose,
        requestedAmountNaira,
        paystackChargeNaira,
      },
      applied: false,
      createdAt: new Date().toISOString(),
    };
    writeDbJson("payments.json", [record, ...payments]);

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: initData.authorization_url,
        access_code: initData.access_code,
        reference: initData.reference,
      },
    });
  } catch (err: any) {
    console.error("[api/paystack/initialize] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to initialize Paystack payment." },
      { status: 500 }
    );
  }
}
