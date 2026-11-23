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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;
    if (!id || !["APPROVED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Valid id and status (APPROVED | DECLINED) are required" },
        { status: 400 }
      );
    }

    const requests = readRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    const updated = {
      ...requests[index],
      status,
      adminNotes: adminNotes || "",
      reviewedAt: new Date().toISOString(),
    };
    requests[index] = updated;
    writeRequests(requests);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Failed to update legal update request:", err);
    return NextResponse.json({ success: false, error: "Failed to update request" }, { status: 500 });
  }
}
