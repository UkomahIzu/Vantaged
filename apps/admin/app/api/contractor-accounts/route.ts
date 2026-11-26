import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface ProvisionedContractorAccount {
  id: string;
  companyName: string;
  rcNumber: string;
  directorName: string;
  email: string;
  password: string;
  role: "Director" | "Site Manager" | "Office Coordinator" | "Crew Member";
  phone?: string;
  submissionId?: string;
  createdAt: string;
  issuedBy: "Vantaged Admin" | "Company Director";
  status?: "ACTIVE" | "SUSPENDED";
  planId?: string;
  planName?: string;
  baseSlots?: number;
  extraSlots?: number;
  slotsUsed?: number;
  updatedAt?: string;
}

function getStoragePath(): string {
  const candidates = [
    path.join(process.cwd(), "packages", "db", "data", "contractor-accounts.json"),
    path.join(process.cwd(), "..", "..", "packages", "db", "data", "contractor-accounts.json"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.dirname(c))) return c;
  }
  const fallbackDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(fallbackDir)) fs.mkdirSync(fallbackDir, { recursive: true });
  return path.join(fallbackDir, "contractor-accounts.json");
}

function readAccounts(): ProvisionedContractorAccount[] {
  const filePath = getStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Failed to read contractor accounts:", err);
  }
  return [];
}

function writeAccounts(accounts: ProvisionedContractorAccount[]): void {
  const filePath = getStoragePath();
  fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2), "utf8");
}

export async function GET() {
  const accounts = readAccounts();
  return NextResponse.json({ success: true, data: accounts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      rcNumber,
      directorName,
      email,
      password,
      role = "Director",
      phone,
      submissionId,
      issuedBy = "Vantaged Admin",
    } = body;

    if (!email || !password || !companyName || !directorName) {
      return NextResponse.json(
        { success: false, error: "companyName, directorName, email, and password are required." },
        { status: 400 }
      );
    }

    const accounts = readAccounts();
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingIdx = accounts.findIndex(
      (a) => a.email.trim().toLowerCase() === normalizedEmail
    );

    const record: ProvisionedContractorAccount = {
      id: existingIdx >= 0 ? accounts[existingIdx].id : `ctr-acc-${Date.now()}`,
      companyName: String(companyName).trim(),
      rcNumber: String(rcNumber || "RC-PENDING").trim(),
      directorName: String(directorName).trim(),
      email: normalizedEmail,
      password: String(password),
      role,
      phone: phone ? String(phone).trim() : undefined,
      submissionId,
      createdAt: existingIdx >= 0 ? accounts[existingIdx].createdAt : new Date().toISOString(),
      issuedBy,
    };

    if (existingIdx >= 0) {
      accounts[existingIdx] = record;
    } else {
      accounts.unshift(record);
    }

    writeAccounts(accounts);
    return NextResponse.json({ success: true, data: record });
  } catch (err) {
    console.error("Failed to save contractor account:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      submissionId,
      email,
      companyName,
      status,
      planId,
      planName,
      baseSlots,
      extraSlots,
      slotsUsed,
    } = body;

    const accounts = readAccounts();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : "";
    const normalizedCompany = companyName ? String(companyName).trim().toLowerCase() : "";

    const idx = accounts.findIndex(
      (a) =>
        (id && a.id === id) ||
        (submissionId && a.submissionId === submissionId) ||
        (normalizedEmail && a.email.trim().toLowerCase() === normalizedEmail) ||
        (normalizedCompany && a.companyName.trim().toLowerCase() === normalizedCompany)
    );

    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Contractor account not found." },
        { status: 404 }
      );
    }

    const updated: ProvisionedContractorAccount = {
      ...accounts[idx],
      ...(status === "ACTIVE" || status === "SUSPENDED" ? { status } : {}),
      ...(planId !== undefined ? { planId } : {}),
      ...(planName !== undefined ? { planName } : {}),
      ...(typeof baseSlots === "number" ? { baseSlots } : {}),
      ...(typeof extraSlots === "number" ? { extraSlots } : {}),
      ...(typeof slotsUsed === "number" ? { slotsUsed } : {}),
      updatedAt: new Date().toISOString(),
    };

    accounts[idx] = updated;
    writeAccounts(accounts);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Failed to update contractor account:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
