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

function getCustomPresetsPath(): string {
  return path.join(getDataDir(), "custom-presets.json");
}

function getPresetOverridesPath(): string {
  return path.join(getDataDir(), "preset-overrides.json");
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
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(presets, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write custom presets:", err);
  }
}

function readPresetOverrides(): Record<string, any> {
  try {
    const filePath = getPresetOverridesPath();
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    }
  } catch (err) {
    console.error("Failed to read preset overrides:", err);
  }
  return {};
}

function writePresetOverrides(overrides: Record<string, any>): void {
  try {
    const filePath = getPresetOverridesPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(overrides, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write preset overrides:", err);
  }
}

export async function GET() {
  const customPresets = readCustomPresets();
  const overrides = readPresetOverrides();
  return NextResponse.json({
    success: true,
    data: customPresets,
    overrides,
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, resetBuiltIn, preset } = body;
    const targetId = id || preset?.id;

    if (!targetId) {
      return NextResponse.json({ success: false, error: "Preset ID required" }, { status: 400 });
    }

    if (resetBuiltIn) {
      const overrides = readPresetOverrides();
      delete overrides[targetId];
      writePresetOverrides(overrides);
      return NextResponse.json({ success: true, id: targetId, reset: true });
    }

    const updatedPreset = preset || body;
    if (!updatedPreset.name) {
      return NextResponse.json({ success: false, error: "Preset name required" }, { status: 400 });
    }

    // If it exists in custom presets, update it there; otherwise save as a built-in override
    const customPresets = readCustomPresets();
    const customIdx = customPresets.findIndex((p) => p.id === targetId);
    if (customIdx !== -1) {
      customPresets[customIdx] = updatedPreset;
      writeCustomPresets(customPresets);
    } else {
      const overrides = readPresetOverrides();
      overrides[targetId] = updatedPreset;
      writePresetOverrides(overrides);
    }

    return NextResponse.json({ success: true, data: updatedPreset });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update preset" }, { status: 500 });
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
