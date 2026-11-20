import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getCustomPresetsPath(): string {
  const possibleDirs = [
    path.join(process.cwd(), "packages/db/data"),
    path.join(process.cwd(), "../../packages/db/data"),
    path.join(process.cwd(), "../packages/db/data"),
  ];
  for (const d of possibleDirs) {
    if (fs.existsSync(/*turbopackIgnore: true*/ d)) return path.join(d, "custom-presets.json");
  }
  return path.join(possibleDirs[0]!, "custom-presets.json");
}

function readCustomPresets(): any[] {
  try {
    const filePath = getCustomPresetsPath();
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read custom presets:", err);
  }
  return [];
}

function writeCustomPresets(presets: any[]): void {
  try {
    const filePath = getCustomPresetsPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(presets, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write custom presets:", err);
  }
}

export async function GET() {
  const customPresets = readCustomPresets();
  return NextResponse.json({
    success: true,
    data: customPresets,
  });
}

export async function POST(request: Request) {
  try {
    const newPreset = await request.json();
    if (!newPreset.name) {
      return NextResponse.json({ success: false, error: "Preset name required" }, { status: 400 });
    }

    const customPresets = readCustomPresets();
    const updated = [newPreset, ...customPresets.filter((p) => p.id !== newPreset.id)];
    writeCustomPresets(updated);

    return NextResponse.json({ success: true, data: newPreset });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to save preset" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Preset ID required" }, { status: 400 });
    }

    const customPresets = readCustomPresets();
    const updated = customPresets.filter((p) => p.id !== id);
    writeCustomPresets(updated);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to delete preset" }, { status: 500 });
  }
}
