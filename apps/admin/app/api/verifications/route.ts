import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getStoragePath(): string {
  try {
    // 1. From root
    const rootPkgDb = path.join(process.cwd(), "packages", "db", "data", "contractor-submissions.json");
    if (fs.existsSync(rootPkgDb)) {
      return rootPkgDb;
    }
    // 2. From apps/admin
    const nestedPkgDb = path.join(process.cwd(), "..", "..", "packages", "db", "data", "contractor-submissions.json");
    if (fs.existsSync(nestedPkgDb)) {
      return nestedPkgDb;
    }
  } catch {}

  const fallbackDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
  return path.join(fallbackDir, "contractor-submissions.json");
}

function readSubmissions(): any[] {
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

function writeSubmissions(submissions: any[]): void {
  const filePath = getStoragePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing contractor submissions:", err);
  }

  // Also sync to apps/web/data fallback if accessible
  try {
    const webDataPath = path.join(process.cwd(), "..", "web", "data", "contractor-submissions.json");
    if (fs.existsSync(path.dirname(webDataPath))) {
      fs.writeFileSync(webDataPath, JSON.stringify(submissions, null, 2), "utf8");
    }
  } catch {}
}

export async function GET() {
  const submissions = readSubmissions();
  return NextResponse.json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, rejectionReason, rejectionNotes, documentVerification } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Submission ID is required" }, { status: 400 });
    }

    const submissions = readSubmissions();
    const index = submissions.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    const current = submissions[index];
    const updated = {
      ...current,
      ...(status ? { status } : {}),
      ...(status === "VERIFIED" ? { verifiedAt: new Date().toISOString() } : {}),
      ...(rejectionReason !== undefined ? { rejectionReason } : {}),
      ...(rejectionNotes !== undefined ? { rejectionNotes } : {}),
      ...(documentVerification && current.documents
        ? {
            documents: current.documents.map((doc: any) =>
              doc.id === documentVerification.documentId
                ? { ...doc, verified: documentVerification.verified }
                : doc
            ),
          }
        : {}),
    };

    submissions[index] = updated;
    writeSubmissions(submissions);

    return NextResponse.json({
      success: true,
      message: `Submission ${id} updated to ${updated.status}`,
      data: updated,
    });
  } catch (err) {
    console.error("Failed to update submission:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error while updating submission" },
      { status: 500 }
    );
  }
}

