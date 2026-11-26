import { NextResponse } from "next/server";
import { listNigerianBanks } from "../../../../lib/paystack";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banks = await listNigerianBanks();
    return NextResponse.json({ success: true, data: banks });
  } catch (err: any) {
    console.error("[api/paystack/banks] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load banks from Paystack." },
      { status: 500 }
    );
  }
}
