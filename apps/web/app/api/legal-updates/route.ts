import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getStoragePath(): string {
  const candidates = [
    path.join(process.cwd(), "packages", "db", "data", "legal-update-requests.json"),
    path.join(process.cwd(), "..", "..", "packages", "db", "data", "legal-update-requests.json"),
    path.join(process.cwd(), "..", "packages", "db", "data", "legal-update-requests.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) return p;
  }
  const fallbackDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
  return path.join(fallbackDir, "legal-update-requests.json");
}

function readRequests(): any[] {
  const filePath = getStoragePath();
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      return JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf8"));
    }
  } catch (err) {
    console.error("Failed to read legal update requests:", err);
  }
  return [];
}

function writeRequests(requests: any[]): void {
  const filePath = getStoragePath();
  fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(requests, null, 2), "utf8");
}

export async function GET() {
  const requests = readRequests();
  return NextResponse.json({ success: true, data: requests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, directorName, field, currentValue, requestedValue, reason } = body;
    if (!companyName || !field || !requestedValue) {
      return NextResponse.json(
        { success: false, error: "companyName, field, and requestedValue are required" },
        { status: 400 }
      );
    }

    const requests = readRequests();
    const newRequest = {
      id: `LUR-${Date.now().toString().slice(-6)}`,
      companyName,
      directorName: directorName || "Company Director",
      field,
      currentValue: currentValue || "",
      requestedValue,
      reason: reason || "",
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    };
    const updated = [newRequest, ...requests];
    writeRequests(updated);
    return NextResponse.json({ success: true, data: newRequest });
  } catch (err) {
    console.error("Failed to create legal update request:", err);
    return NextResponse.json({ success: false, error: "Failed to save request" }, { status: 500 });
  }
}
