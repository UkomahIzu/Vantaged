import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATHS = [
  path.join(process.cwd(), "packages/db/data/platform-pricing.json"),
  path.join(process.cwd(), "../../packages/db/data/platform-pricing.json"),
  path.join(process.cwd(), "../packages/db/data/platform-pricing.json"),
];

function getPricingFilePath(): string | null {
  for (const p of DATA_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export async function GET() {
  try {
    const filePath = getPricingFilePath();
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Pricing data not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to load platform pricing:", error);
    return NextResponse.json({ error: "Failed to load pricing data" }, { status: 500 });
  }
}

