import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getPricingFilePath(): string | null {
  const possibleDirs = [
    path.join(process.cwd(), "packages/db/data"),
    path.join(process.cwd(), "../../packages/db/data"),
    path.join(process.cwd(), "../packages/db/data"),
  ];
  for (const d of possibleDirs) {
    if (fs.existsSync(/*turbopackIgnore: true*/ d)) {
      return path.join(d, "platform-pricing.json");
    }
  }
  return path.join(possibleDirs[0]!, "platform-pricing.json");
}

export async function GET() {
  try {
    const filePath = getPricingFilePath();
    if (filePath && fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      const data = JSON.parse(raw);
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Pricing data not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to load platform pricing:", error);
    return NextResponse.json({ error: "Failed to load pricing data" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const filePath = getPricingFilePath();

    if (!filePath) {
      return NextResponse.json({ error: "Data path not resolved" }, { status: 500 });
    }

    let currentData: any = {};
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      currentData = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8"));
    }

    // Merge updated roles or tiers
    if (body.roles) {
      currentData.roles = body.roles;
    } else if (body.roleKey && body.tierId && body.updates) {
      const role = currentData.roles?.[body.roleKey];
      if (role) {
        const tierIndex = role.tiers.findIndex((t: any) => t.id === body.tierId);
        if (tierIndex !== -1) {
          role.tiers[tierIndex] = { ...role.tiers[tierIndex], ...body.updates };
        }
      }
    } else if (body.roleKey && body.extraSlotNotice) {
      if (currentData.roles?.[body.roleKey]) {
        currentData.roles[body.roleKey].extraSlotNotice = body.extraSlotNotice;
      }
    }

    currentData.updatedAt = new Date().toISOString();

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    }

    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(currentData, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: currentData });
  } catch (error) {
    console.error("Failed to update platform pricing:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
