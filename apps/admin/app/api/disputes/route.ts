import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getDisputesPath(): string {
  const possibleDirs = [
    path.join(process.cwd(), "packages/db/data"),
    path.join(process.cwd(), "../../packages/db/data"),
    path.join(process.cwd(), "../packages/db/data"),
  ];
  for (const d of possibleDirs) {
    if (fs.existsSync(/*turbopackIgnore: true*/ d)) return path.join(d, "disputes.json");
  }
  return path.join(possibleDirs[0]!, "disputes.json");
}

const DEFAULT_DISPUTES = [
  {
    id: "DSP-KN-0193",
    projectId: "PRJ-KN-0193",
    projectName: "Kano Commercial Plaza & Warehouses",
    contractorName: "Civic Vanguard Roads & Bridges Co.",
    contractorDirector: "Engr. Ibrahim Sanusi",
    ownerName: "Alhaji Bello & Sons Trading",
    state: "Kano",
    type: "MILESTONE_REJECTION_WARNING",
    title: "Second consecutive stage review rejection logged by Owner Rep",
    description: "Substructure reinforcement inspection rejected twice due to missing stirrup spacing documentation. Escrow tranche remains locked. Platform protocol allows contractor 5 working days before mediation triggers.",
    stage: "Stage 2: Column Reinforcement & Stirrup Spacing",
    escrowAmount: "₦18,500,000",
    status: "ACTION_REQUIRED",
    rejectionsCount: 2,
    createdAt: "2026-10-30T10:14:00Z",
    history: [
      {
        date: "26 Oct 2026",
        actor: "Owner Inspector (Arch. Bello)",
        event: "Rejected Stage 2 inspection: Stirrup spacing exceeds 200mm c/c structural design tolerance.",
      },
      {
        date: "28 Oct 2026",
        actor: "Civic Vanguard Site Lead",
        event: "Uploaded revised site photos asserting spacing was corrected to 150mm c/c.",
      },
      {
        date: "30 Oct 2026",
        actor: "Owner Inspector (Arch. Bello)",
        event: "Second Rejection: Rebar alignment photos lack measurement tape reference. Escrow hold maintained.",
      },
    ],
  },
];

function readDisputes(): any[] {
  try {
    const filePath = getDisputesPath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read disputes:", err);
  }
  return DEFAULT_DISPUTES;
}

function writeDisputes(disputes: any[]): void {
  try {
    const filePath = getDisputesPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(disputes, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write disputes:", err);
  }
}

export async function GET() {
  const disputes = readDisputes();
  return NextResponse.json({
    success: true,
    count: disputes.length,
    data: disputes,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, note } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Dispute ID required" }, { status: 400 });
    }

    const disputes = readDisputes();
    const index = disputes.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Dispute record not found" }, { status: 404 });
    }

    const current = disputes[index];
    const newHistoryItem = {
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      actor: "Platform Super Admin",
      event: note || `Admin executed action: ${action}`,
    };

    const updated = {
      ...current,
      status: action === "RESOLVE_DISPUTE" || action === "RELEASE_ESCROW" ? "RESOLVED" : "IN_MEDIATION",
      history: [...current.history, newHistoryItem],
      resolvedAt: action === "RESOLVE_DISPUTE" || action === "RELEASE_ESCROW" ? new Date().toISOString() : undefined,
    };

    disputes[index] = updated;
    writeDisputes(disputes);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update dispute" }, { status: 500 });
  }
}
