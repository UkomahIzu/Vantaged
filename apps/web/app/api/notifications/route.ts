import { NextResponse } from "next/server";
import { readDbJson, writeDbJson } from "../../../lib/localDb";

export const dynamic = "force-dynamic";

const FILE = "notifications.json";

function matchesRecipient(
  n: any,
  params: {
    recipientType?: string | null;
    recipientId?: string | null;
    recipientEmail?: string | null;
    recipientCompanyName?: string | null;
  }
): boolean {
  if (params.recipientType && n.recipientType !== params.recipientType) {
    return false;
  }

  const hasFilter = Boolean(
    params.recipientId || params.recipientEmail || params.recipientCompanyName
  );
  if (!hasFilter) return true;

  // If the stored notification has no specific recipient targeting fields, allow delivery to matching recipientType
  const hasStoredTarget = Boolean(
    n.recipientId || n.recipientEmail || n.recipientCompanyName
  );
  if (!hasStoredTarget) return true;

  if (params.recipientId && n.recipientId && n.recipientId === params.recipientId) {
    return true;
  }

  if (params.recipientEmail && n.recipientEmail) {
    const targetEmail = params.recipientEmail.trim().toLowerCase();
    const cleanPhone = targetEmail.replace(/\s+/g, "");
    const storedEmail = String(n.recipientEmail).trim().toLowerCase();
    if (
      storedEmail === targetEmail ||
      (cleanPhone && storedEmail.replace(/\s+/g, "") === cleanPhone)
    ) {
      return true;
    }
  }

  if (params.recipientCompanyName && n.recipientCompanyName) {
    if (
      String(n.recipientCompanyName).trim().toLowerCase() ===
      params.recipientCompanyName.trim().toLowerCase()
    ) {
      return true;
    }
  }

  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipientType = searchParams.get("recipientType"); // "owner" | "company"
  const recipientId = searchParams.get("recipientId");
  const recipientEmail = searchParams.get("recipientEmail");
  const recipientCompanyName = searchParams.get("recipientCompanyName");

  const items = readDbJson<any[]>(FILE, []);
  const filtered = items.filter((n) =>
    matchesRecipient(n, {
      recipientType,
      recipientId,
      recipientEmail,
      recipientCompanyName,
    })
  );

  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = readDbJson<any[]>(FILE, []);
    const created = {
      ...body,
      id: body.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: body.timestamp || "Just now",
      isUnread: body.isUnread ?? true,
      createdAt: new Date().toISOString(),
    };
    const deduped = items.filter((i) => i.id !== created.id);
    writeDbJson(FILE, [created, ...deduped].slice(0, 200));
    return NextResponse.json({ success: true, data: created });
  } catch (err) {
    console.error("[api/notifications] POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientType,
      recipientId,
      recipientEmail,
      recipientCompanyName,
      ids,
      markAllRead,
    } = body || {};
    const items = readDbJson<any[]>(FILE, []);
    const idSet = Array.isArray(ids) ? new Set(ids) : null;

    const updated = items.map((n) => {
      if (idSet && idSet.has(n.id)) return { ...n, isUnread: false };
      if (
        markAllRead &&
        matchesRecipient(n, {
          recipientType,
          recipientId,
          recipientEmail,
          recipientCompanyName,
        })
      ) {
        return { ...n, isUnread: false };
      }
      return n;
    });

    writeDbJson(FILE, updated);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/notifications] PATCH error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");
    let body: any = {};
    try {
      body = await request.json();
    } catch {}

    const targetId = queryId || body?.id;
    const clearAll = Boolean(body?.clearAll);
    const items = readDbJson<any[]>(FILE, []);

    let updated = items;
    if (targetId) {
      updated = items.filter((n) => n.id !== targetId);
    } else if (clearAll) {
      updated = items.filter(
        (n) =>
          !matchesRecipient(n, {
            recipientType: body?.recipientType,
            recipientId: body?.recipientId,
            recipientEmail: body?.recipientEmail,
            recipientCompanyName: body?.recipientCompanyName,
          })
      );
    }

    writeDbJson(FILE, updated);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/notifications] DELETE error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
