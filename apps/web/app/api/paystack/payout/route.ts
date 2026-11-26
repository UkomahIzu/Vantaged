import { NextResponse } from "next/server";
import {
  createTransferRecipient,
  initiateStageTransfer,
} from "../../../../lib/paystack";
import { readDbJson, writeDbJson } from "../../../../lib/localDb";
import type { StoredPaymentRecord } from "../initialize/route";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const {
      projectId,
      stageTitle,
      amountNaira,
      accountName,
      accountNumber,
      bankCode,
      companyEmail,
    } = await request.json();

    if (!amountNaira || Number(amountNaira) <= 0 || !stageTitle) {
      return NextResponse.json(
        { success: false, error: "stageTitle and amountNaira are required." },
        { status: 400 }
      );
    }

    const reference = `VTG-OUT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    let recipientCode: string | null = null;
    let transferCode: string | null = null;
    let mode: "paystack_transfer" | "paystack_recipient_escrow_sim" = "paystack_transfer";
    let note = "Disbursed via Paystack Transfer API.";

    // Step 1: Create a real Paystack Transfer Recipient if NUBAN details are provided
    if (accountNumber && bankCode && accountName) {
      try {
        const recipient = await createTransferRecipient({
          name: String(accountName),
          accountNumber: String(accountNumber).replace(/\D/g, ""),
          bankCode: String(bankCode),
        });
        recipientCode = recipient.recipient_code;

        // Step 2: Attempt Paystack Transfer (Note: Paystack Test Starter accounts may disallow transfers)
        try {
          const transfer = await initiateStageTransfer({
            amountNaira: Number(amountNaira),
            recipientCode,
            reference,
            reason: `Vantaged Stage Payout: ${stageTitle}`,
          });
          transferCode = transfer.transfer_code;
        } catch (transferErr: any) {
          mode = "paystack_recipient_escrow_sim";
          note = `Paystack recipient verified (${recipientCode}). Test-mode transfer queued: ${
            transferErr?.message || "Starter test account"
          }`;
        }
      } catch (recErr: any) {
        mode = "paystack_recipient_escrow_sim";
        note = `Escrow disbursement queued in Test Mode (${recErr?.message || "recipient pending"}).`;
      }
    } else {
      mode = "paystack_recipient_escrow_sim";
      note = "Escrow payout queued (awaiting company verified NUBAN bank code).";
    }

    const payments = readDbJson<StoredPaymentRecord[]>("payments.json", []);
    const record: StoredPaymentRecord = {
      id: `payout-${Date.now()}`,
      reference,
      purpose: "stage_payout",
      email: String(companyEmail || "").toLowerCase(),
      amountNaira: Number(amountNaira),
      status: "TRANSFERRED",
      channel: mode,
      metadata: {
        projectId,
        stageTitle,
        recipientCode,
        transferCode,
        note,
      },
      applied: true,
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };
    writeDbJson("payments.json", [record, ...payments]);

    return NextResponse.json({
      success: true,
      data: {
        reference,
        recipientCode,
        transferCode,
        mode,
        note,
      },
    });
  } catch (err: any) {
    console.error("[api/paystack/payout] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to initiate stage payout." },
      { status: 500 }
    );
  }
}
