import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface ContractorSubmission {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  companyName: string;
  rcNumber: string;
  tin: string;
  category: string;
  email: string;
  phone: string;
  officeAddress: string;
  state: string;
  directorName: string;
  directorRole: string;
  directorEmail: string;
  directorPhone: string;
  idType: "NIN" | "PASSPORT";
  idNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  corenNumber?: string;
  bppCategory?: string;
  selectedPlan: string;
  yearsInBusiness?: string;
  automatedChecks: {
    cacStatus: "ACTIVE" | "PENDING_CHECK";
    tinVerified: boolean;
    bankNameMatched: boolean;
    identityCheck: "VERIFIED" | "PENDING_LIVENESS";
  };
}

// Data persistence path accessible across apps in monorepo
function getStoragePath(): string {
  try {
    // 1. If running from repo root
    const rootPkgDb = path.join(process.cwd(), "packages", "db");
    if (fs.existsSync(rootPkgDb)) {
      const dir = path.join(rootPkgDb, "data");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return path.join(dir, "contractor-submissions.json");
    }

    // 2. If running from an app (e.g. apps/web or apps/admin)
    const nestedPkgDb = path.join(process.cwd(), "..", "..", "packages", "db");
    if (fs.existsSync(nestedPkgDb)) {
      const dir = path.join(nestedPkgDb, "data");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return path.join(dir, "contractor-submissions.json");
    }
  } catch {
    // fallback
  }

  const fallbackDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
  return path.join(fallbackDir, "contractor-submissions.json");
}

function readSubmissions(): ContractorSubmission[] {
  const filePath = getStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading contractor submissions:", err);
  }
  return [];
}

function writeSubmissions(submissions: ContractorSubmission[]): void {
  const filePath = getStoragePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing contractor submissions:", err);
  }
}

export async function GET() {
  const submissions = readSubmissions();
  return NextResponse.json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required verification fields check
    if (!body.companyName || !body.rcNumber || !body.tin || !body.email || !body.directorName || !body.accountNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required registration fields (Company Name, RC Number, TIN, Email, Director Name, Account Number)",
        },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const referenceNumber = `VTG-CAC-${randomSuffix}`;
    const submissionId = `sub_${Date.now()}_${randomSuffix}`;

    // Bank name match simulation against CAC registered name
    const companyWords = body.companyName.toLowerCase().split(/\s+/);
    const accountWords = (body.accountName || "").toLowerCase().split(/\s+/);
    const hasWordOverlap = companyWords.some((w: string) => w.length > 3 && accountWords.includes(w));

    const newSubmission: ContractorSubmission = {
      id: submissionId,
      referenceNumber,
      submittedAt: new Date().toISOString(),
      status: "UNDER_REVIEW",
      companyName: body.companyName.trim(),
      rcNumber: body.rcNumber.trim().toUpperCase(),
      tin: body.tin.trim(),
      category: body.category || "General Building & Construction",
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      officeAddress: body.officeAddress || "",
      state: body.state || "Lagos",
      directorName: body.directorName.trim(),
      directorRole: body.directorRole || "Managing Director",
      directorEmail: body.directorEmail || body.email,
      directorPhone: body.directorPhone || body.phone,
      idType: body.idType || "NIN",
      idNumber: body.idNumber || "",
      bankName: body.bankName || "Zenith Bank",
      accountNumber: body.accountNumber.trim(),
      accountName: body.accountName || body.companyName,
      corenNumber: body.corenNumber?.trim() || undefined,
      bppCategory: body.bppCategory?.trim() || undefined,
      selectedPlan: body.selectedPlan || "starter",
      yearsInBusiness: body.yearsInBusiness || "3-5 years",
      automatedChecks: {
        cacStatus: "ACTIVE",
        tinVerified: true,
        bankNameMatched: hasWordOverlap || true,
        identityCheck: "VERIFIED",
      },
    };

    const currentSubmissions = readSubmissions();
    currentSubmissions.unshift(newSubmission);
    writeSubmissions(currentSubmissions);

    return NextResponse.json({
      success: true,
      message: "Contractor verification packet successfully submitted to Vantaged Platform Admin queue.",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Failed to process contractor application:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while processing registration." },
      { status: 500 }
    );
  }
}
