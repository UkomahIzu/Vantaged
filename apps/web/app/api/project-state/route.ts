import { NextResponse } from "next/server";
import { readDbJson, writeDbJson } from "../../../lib/localDb";

export const dynamic = "force-dynamic";

const FILE = "project-state.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const prefix = searchParams.get("prefix");
  const store = readDbJson<Record<string, any>>(FILE, {});

  if (key) {
    return NextResponse.json({ success: true, data: store[key] ?? null });
  }
  if (prefix) {
    const matched: Record<string, any> = {};
    for (const [k, v] of Object.entries(store)) {
      if (k.startsWith(prefix)) matched[k] = v;
    }
    return NextResponse.json({ success: true, data: matched });
  }

  return NextResponse.json({ success: true, data: store });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const store = readDbJson<Record<string, any>>(FILE, {});

    if (body?.entries && typeof body.entries === "object") {
      Object.assign(store, body.entries);
    } else if (body?.key) {
      store[String(body.key)] = body.value;
    } else {
      return NextResponse.json(
        { success: false, error: "Provide { key, value } or { entries }." },
        { status: 400 }
      );
    }

    writeDbJson(FILE, store);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/project-state] PUT error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
