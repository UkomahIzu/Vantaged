import { NextResponse } from "next/server";
import { verifyPaystackTransaction } from "../../../../lib/paystack";
import { readDbJson, writeDbJson } from "../../../../lib/localDb";
import type { StoredPaymentRecord } from "../initialize/route";

export const dynamic = "force-dynamic";

function applyVerifiedPaymentEffect(payment: StoredPaymentRecord) {
  if (payment.applied) return;
  const meta = payment.metadata || {};

  // 1. Company Plan / Extra Slots → persist directly to contractor-accounts.json (reflected on Admin!)
  if (
    payment.purpose === "company_plan" ||
    payment.purpose === "company_extra_slots"
  ) {
    const accounts = readDbJson<any[]>("contractor-accounts.json", []);
    const idx = accounts.findIndex(
      (a) =>
        (meta.companyId && a.id === meta.companyId) ||
        String(a.email || "").toLowerCase() === payment.email.toLowerCase()
    );
    if (idx >= 0) {
      const curr = accounts[idx];
      if (payment.purpose === "company_plan") {
        accounts[idx] = {
          ...curr,
          planId: meta.planId || curr.planId,
          planName: meta.planName || curr.planName,
          baseSlots:
            typeof meta.baseSlots === "number" ? meta.baseSlots : curr.baseSlots,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const added = Number(meta.slotsCount || 1);
        accounts[idx] = {
          ...curr,
          extraSlots: (Number(curr.extraSlots) || 0) + added,
          updatedAt: new Date().toISOString(),
        };
      }
      writeDbJson("contractor-accounts.json", accounts);
    }
  }

  // 2. Owner Plan / Extra Slots → persist directly to owner-accounts.json
  if (
    payment.purpose === "owner_plan" ||
    payment.purpose === "owner_extra_slots"
  ) {
    const owners = readDbJson<any[]>("owner-accounts.json", []);
    const idx = owners.findIndex(
      (o) =>
        (meta.ownerId && o.id === meta.ownerId) ||
        String(o.email || "").toLowerCase() === payment.email.toLowerCase()
    );
    if (idx >= 0) {
      const curr = owners[idx];
      if (payment.purpose === "owner_plan") {
        owners[idx] = {
          ...curr,
          tierId: meta.tierId || curr.tierId,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const added = Number(meta.slotsCount || 1);
        owners[idx] = {
          ...curr,
          extraSlots: (Number(curr.extraSlots) || 0) + added,
          updatedAt: new Date().toISOString(),
        };
      }
      writeDbJson("owner-accounts.json", owners);
    }
  }

  // 3. Project Escrow Deposit → record in project-state.json + notify Company
  if (payment.purpose === "escrow_deposit" && meta.projectId) {
    const state = readDbJson<Record<string, any>>("project-state.json", {});
    const escrowKey = `vantaged_escrow_ledger_${meta.projectId}`;
    const existingLedger: any[] = Array.isArray(state[escrowKey])
      ? state[escrowKey]
      : [];
    const newEntry = {
      id: `esc-${Date.now()}`,
      reference: payment.reference,
      amountNaira: payment.amountNaira,
      channel: payment.channel || "paystack",
      fundedAt: new Date().toISOString(),
      status: "Locked in Escrow",
    };
    state[escrowKey] = [newEntry, ...existingLedger];
    writeDbJson("project-state.json", state);

    // Push backend notification to company if linked
    if (meta.companyId) {
      const notifs = readDbJson<any[]>("notifications.json", []);
      notifs.unshift({
        id: `comp-notif-${Date.now()}`,
        recipientType: "company",
        recipientId: meta.companyId,
        category: "receipt",
        projectTitle: meta.projectTitle || "Project Escrow",
        title: `Owner Funded ₦${payment.amountNaira.toLocaleString("en-NG")} into Escrow`,
        description: `Verified Paystack deposit (${payment.reference}) is now locked on Vantaged for your next stage payout.`,
        timestamp: "Just now",
        isUnread: true,
        href: `/contractor/projects/${meta.projectId}/transactions`,
        createdAt: new Date().toISOString(),
      });
      writeDbJson("notifications.json", notifs);
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Payment reference is required." },
        { status: 400 }
      );
    }

    const verified = await verifyPaystackTransaction(reference);
    const isSuccess = verified.status === "success";

    const payments = readDbJson<StoredPaymentRecord[]>("payments.json", []);
    const idx = payments.findIndex((p) => p.reference === reference);
    let record: StoredPaymentRecord;

    if (idx >= 0) {
      record = {
        ...payments[idx],
        status: isSuccess ? "SUCCESS" : "FAILED",
        channel: verified.channel,
        verifiedAt: new Date().toISOString(),
      };
      if (isSuccess && !record.applied) {
        applyVerifiedPaymentEffect(record);
        record.applied = true;
      }
      payments[idx] = record;
    } else {
      record = {
        id: `pay-${Date.now()}`,
        reference,
        purpose: (verified.metadata?.purpose || "escrow_deposit") as any,
        email: verified.customer?.email || "",
        amountNaira:
          typeof verified.metadata?.requestedAmountNaira === "number"
            ? verified.metadata.requestedAmountNaira
            : Math.round((verified.amount || 0) / 100),
        status: isSuccess ? "SUCCESS" : "FAILED",
        channel: verified.channel,
        metadata: verified.metadata || {},
        applied: false,
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
      };
      if (isSuccess) {
        applyVerifiedPaymentEffect(record);
        record.applied = true;
      }
      payments.unshift(record);
    }

    writeDbJson("payments.json", payments);

    return NextResponse.json({
      success: isSuccess,
      data: record,
      paystackStatus: verified.status,
    });
  } catch (err: any) {
    console.error("[api/paystack/verify] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
