import { NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "../../../../lib/paystack";
import { readDbJson, writeDbJson } from "../../../../lib/localDb";
import type { StoredPaymentRecord } from "../initialize/route";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { success: false, error: "Invalid Paystack webhook signature." },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload?.event as string;
    const data = payload?.data || {};
    const reference = data?.reference as string | undefined;

    if (reference && (event === "charge.success" || event === "transfer.success")) {
      const payments = readDbJson<StoredPaymentRecord[]>("payments.json", []);
      const idx = payments.findIndex((p) => p.reference === reference);
      if (idx >= 0) {
        payments[idx] = {
          ...payments[idx],
          status: event === "transfer.success" ? "TRANSFERRED" : "SUCCESS",
          channel: data.channel || payments[idx].channel,
          verifiedAt: new Date().toISOString(),
        };
        writeDbJson("payments.json", payments);
      }
    }

    return NextResponse.json({ success: true, received: event });
  } catch (err: any) {
    console.error("[api/paystack/webhook] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Webhook error" },
      { status: 500 }
    );
  }
}
