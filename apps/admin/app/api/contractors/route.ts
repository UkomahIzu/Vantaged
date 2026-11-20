import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { INITIAL_CONTRACTORS, ContractorRecord } from "../../../data/contractorsData";

export const dynamic = "force-dynamic";

function getDbDir(): string {
  const possibleDirs = [
    path.join(process.cwd(), "packages/db/data"),
    path.join(process.cwd(), "../../packages/db/data"),
    path.join(process.cwd(), "../packages/db/data"),
  ];
  for (const d of possibleDirs) {
    if (fs.existsSync(/*turbopackIgnore: true*/ d)) return d;
  }
  return possibleDirs[0]!;
}

function getSubmissionsPath(): string | null {
  const p = path.join(getDbDir(), "contractor-submissions.json");
  return fs.existsSync(/*turbopackIgnore: true*/ p) ? p : null;
}

function getOverridesPath(): string {
  return path.join(getDbDir(), "contractor-overrides.json");
}

function readOverrides(): Record<string, Partial<ContractorRecord>> {
  try {
    const filePath = getOverridesPath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read contractor overrides:", err);
  }
  return {};
}

function writeOverrides(overrides: Record<string, Partial<ContractorRecord>>): void {
  try {
    const filePath = getOverridesPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(overrides, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write contractor overrides:", err);
  }
}

export async function GET() {
  try {
    const overrides = readOverrides();
    let contractors: ContractorRecord[] = [...INITIAL_CONTRACTORS];

    // Read submissions to check for newly verified contractors
    const subPath = getSubmissionsPath();
    if (subPath && fs.existsSync(subPath)) {
      const raw = fs.readFileSync(subPath, "utf-8");
      const submissions: any[] = JSON.parse(raw);

      // Merge verified submissions into contractor list
      submissions.forEach((sub) => {
        if (sub.status === "VERIFIED") {
          const existing = contractors.find(
            (c) => c.id === sub.id || c.rcNumber.toLowerCase() === (sub.rcNumber || "").toLowerCase()
          );

          if (!existing) {
            const planName =
              sub.selectedPlan === "consortium" || sub.selectedPlan === "Prime Consortium"
                ? "Prime Consortium"
                : sub.selectedPlan === "starter" || sub.selectedPlan === "Starter Builder"
                ? "Starter Builder"
                : "Verified Builder";

            const newContractor: ContractorRecord = {
              id: sub.id,
              name: sub.companyName || "Accredited Contractor",
              rcNumber: sub.rcNumber || `RC-${Date.now().toString().slice(-7)}`,
              tin: sub.tin || "Pending",
              director: sub.directorName || "Managing Director",
              directorRole: sub.directorRole || "Managing Director",
              directorEmail: sub.directorEmail || sub.email || "director@contractor.ng",
              directorPhone: sub.directorPhone || sub.phone || "+234 800 000 0000",
              state: sub.state || "Lagos",
              officeAddress: sub.officeAddress || "Corporate Office",
              category: sub.category || "General Building & Construction",
              plan: planName,
              status: "VERIFIED",
              badges: ["COREN Verified", "CAC Certified"],
              activeSlots: planName === "Starter Builder" ? "1 / 1 (Active Free Slot)" : planName === "Prime Consortium" ? "1 / Unlimited" : "1 / 3",
              slotsUsed: 1,
              slotsMax: planName === "Starter Builder" ? 1 : planName === "Prime Consortium" ? 999 : 3,
              freeSlotUsed: true,
              bankName: sub.bankName || "Zenith Bank",
              accountNumber: sub.accountNumber || "0000000000",
              accountName: sub.accountName || sub.companyName || "Corporate Account",
              joinedDate: new Date(sub.submittedAt || Date.now()).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            };
            contractors.push(newContractor);
          }
        }
      });
    }

    // Apply any custom overrides (suspensions, slot adjustments)
    contractors = contractors.map((c) => {
      if (overrides[c.id]) {
        return { ...c, ...overrides[c.id] };
      }
      return c;
    });

    return NextResponse.json({
      success: true,
      count: contractors.length,
      data: contractors,
    });
  } catch (error) {
    console.error("Failed to load contractors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load contractors", data: INITIAL_CONTRACTORS },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, plan, slotsUsed, slotsMax } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Contractor ID required" }, { status: 400 });
    }

    const overrides = readOverrides();
    const currentOverride = overrides[id] || {};

    const updatedOverride = {
      ...currentOverride,
      ...(status !== undefined ? { status } : {}),
      ...(plan !== undefined ? { plan } : {}),
      ...(slotsUsed !== undefined ? { slotsUsed } : {}),
      ...(slotsMax !== undefined ? { slotsMax } : {}),
      ...(slotsUsed !== undefined || slotsMax !== undefined
        ? {
            activeSlots:
              (slotsMax ?? currentOverride.slotsMax ?? 3) === 999
                ? `${slotsUsed ?? currentOverride.slotsUsed ?? 1} / Unlimited`
                : `${slotsUsed ?? currentOverride.slotsUsed ?? 1} / ${slotsMax ?? currentOverride.slotsMax ?? 3}`,
          }
        : {}),
    };

    overrides[id] = updatedOverride;
    writeOverrides(overrides);

    return NextResponse.json({ success: true, id, override: updatedOverride });
  } catch (error) {
    console.error("Failed to update contractor:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
