import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getDataDir(): string {
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

function readJsonArray(fileName: string): any[] {
  try {
    const filePath = path.join(getDataDir(), fileName);
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error(`Failed to read ${fileName}:`, err);
  }
  return [];
}

function readJsonObject(fileName: string): Record<string, any> {
  try {
    const filePath = path.join(getDataDir(), fileName);
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    }
  } catch (err) {
    console.error(`Failed to read ${fileName}:`, err);
  }
  return {};
}

function writeJsonArray(fileName: string, data: any[]): void {
  try {
    const filePath = path.join(getDataDir(), fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    }
    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to write ${fileName}:`, err);
  }
}

export async function GET() {
  const adminCustomPresets = readJsonArray("custom-presets.json");
  const adminOverrides = readJsonObject("preset-overrides.json");
  const companyPresets = readJsonArray("company-presets.json");

  return NextResponse.json({
    success: true,
    adminCustomPresets,
    adminOverrides,
    companyPresets,
  });
}

export async function POST(request: Request) {
  try {
    const newPreset = await request.json();
    if (!newPreset?.name) {
      return NextResponse.json(
        { success: false, error: "Preset name required" },
        { status: 400 }
      );
    }

    const companyPresets = readJsonArray("company-presets.json");
    const updated = [newPreset, ...companyPresets.filter((p) => p.id !== newPreset.id)];
    writeJsonArray("company-presets.json", updated);

    return NextResponse.json({ success: true, data: newPreset });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save company preset" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updatedPreset = body?.preset || body;
    const targetId = body?.id || updatedPreset?.id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Preset ID required" },
        { status: 400 }
      );
    }

    const companyPresets = readJsonArray("company-presets.json");
    const exists = companyPresets.some((p) => p.id === targetId);
    const updated = exists
      ? companyPresets.map((p) => (p.id === targetId ? updatedPreset : p))
      : [updatedPreset, ...companyPresets];

    writeJsonArray("company-presets.json", updated);
    return NextResponse.json({ success: true, data: updatedPreset });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update company preset" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Preset ID required" },
        { status: 400 }
      );
    }

    const companyPresets = readJsonArray("company-presets.json");
    const updated = companyPresets.filter((p) => p.id !== id);
    writeJsonArray("company-presets.json", updated);

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete company preset" },
      { status: 500 }
    );
  }
}
