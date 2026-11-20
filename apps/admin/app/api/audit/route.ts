import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getAuditPath(): string {
  const possibleDirs = [
    path.join(process.cwd(), "packages/db/data"),
    path.join(process.cwd(), "../../packages/db/data"),
    path.join(process.cwd(), "../packages/db/data"),
  ];
  for (const d of possibleDirs) {
    if (fs.existsSync(/*turbopackIgnore: true*/ d)) return path.join(d, "audit-trail.json");
  }
  return path.join(possibleDirs[0]!, "audit-trail.json");
}

const DEFAULT_AUDIT_LOGS = [
  {
    id: "AUD-948102",
    timestamp: "Today at 09:14 WAT",
    actor: "Engr. Kenneth Adeleke (Super Admin)",
    action: "BADGE_ISSUED",
    actionLabel: "COREN License Verified & Issued",
    target: "Prestige Build & MEP Specialists (RC-1678291)",
    details: "COREN Registration COREN/R/58209 cross-verified against Council database. Granted Verified Builder privileges.",
    ipAddress: "102.89.34.19 (Lagos, NG)",
    level: "SUCCESS",
  },
  {
    id: "AUD-948088",
    timestamp: "Today at 08:31 WAT",
    actor: "Engr. Kenneth Adeleke (Super Admin)",
    action: "AUTH_LOGIN",
    actionLabel: "Admin Console Authentication",
    target: "Session: ses_01hzyq83m",
    details: "Two-Factor hardware token confirmed. Access granted to Port 3001 operations environment.",
    ipAddress: "102.89.34.19 (Lagos, NG)",
    level: "INFO",
  },
  {
    id: "AUD-947921",
    timestamp: "Yesterday at 16:40 WAT",
    actor: "Barrister Amina Bello (Compliance Officer)",
    action: "CAC_VALIDATION",
    actionLabel: "CAC Corporate Inspection Completed",
    target: "Apex Structure & Civil Engineering (RC-1849204)",
    details: "Corporate Affairs Commission status confirmed ACTIVE. TIN 23891048-0001 verified against FIRS database.",
    ipAddress: "197.210.55.82 (Abuja, NG)",
    level: "SUCCESS",
  },
  {
    id: "AUD-947814",
    timestamp: "27 Oct 2026, 14:15 WAT",
    actor: "Femi Oladipo (Disputes Arbitrator)",
    action: "STAGE_OVERRIDE_REVIEW",
    actionLabel: "Milestone Rejection Appeal Monitored",
    target: "PRJ-KN-0193 · Nassarawa Commercial Plaza",
    details: "Reviewed documentation for substructure stirrup placement. Advised contractor to provide rebar density log.",
    ipAddress: "102.88.192.12 (Lagos, NG)",
    level: "WARNING",
  },
  {
    id: "AUD-947602",
    timestamp: "26 Oct 2026, 11:05 WAT",
    actor: "Chioma Okonkwo (Support Specialist)",
    action: "CREDENTIAL_DISPATCH",
    actionLabel: "Contractor Terminal Credentials Dispatched",
    target: "Prestige Build & MEP Specialists",
    details: "Director login link dispatched to operations@prestigebuild.ng for Contractor Portal access.",
    ipAddress: "102.89.34.19 (Lagos, NG)",
    level: "INFO",
  },
];

function readAudit(): any[] {
  try {
    const filePath = getAuditPath();
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read audit trail:", err);
  }
  return DEFAULT_AUDIT_LOGS;
}

function writeAudit(logs: any[]): void {
  try {
    const filePath = getAuditPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write audit trail:", err);
  }
}

export async function GET() {
  const logs = readAudit();
  return NextResponse.json({
    success: true,
    count: logs.length,
    data: logs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const logs = readAudit();

    const newLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: "Just now",
      actor: body.actor || "Platform Admin",
      action: body.action || "ADMIN_ACTION",
      actionLabel: body.actionLabel || "Platform Action",
      target: body.target || "Platform Entity",
      details: body.details || "",
      ipAddress: "102.89.34.19 (Lagos, NG)",
      level: body.level || "INFO",
    };

    const updated = [newLog, ...logs];
    writeAudit(updated);

    return NextResponse.json({ success: true, data: newLog });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to record audit log" }, { status: 500 });
  }
}
