import { NextResponse } from "next/server";
import { resolveNubanAccount } from "../../../../lib/paystack";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { accountNumber, bankCode } = await request.json();
    const cleanAcc = String(accountNumber || "").replace(/\D/g, "");
    if (cleanAcc.length !== 10 || !bankCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a valid 10-digit NUBAN account number and select a bank.",
        },
        { status: 400 }
      );
    }

    const resolved = await resolveNubanAccount(cleanAcc, String(bankCode));
    return NextResponse.json({ success: true, data: resolved });
  } catch (err: any) {
    console.error("[api/paystack/resolve-account] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Could not verify bank account with Paystack.",
      },
      { status: 400 }
    );
  }
}
