import { NextResponse } from "next/server";
import { readDbJson, writeDbJson } from "../../../lib/localDb";

export const dynamic = "force-dynamic";

const FILE = "project-requests.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const planId = searchParams.get("planId");
  const direction = searchParams.get("direction"); // "company_to_owner" | "owner_to_company"
  const ownerId = searchParams.get("ownerId");
  const ownerIdentifier = searchParams.get("ownerIdentifier")?.trim().toLowerCase();
  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName")?.trim().toLowerCase();

  let items = readDbJson<any[]>(FILE, []);
  if (id) {
    items = items.filter((r) => r.id === id || r.planId === id);
  }
  if (planId) {
    const clean = planId.replace(/^prop-/, "").replace(/-plan$/, "");
    items = items.filter((r) => {
      if (r.planId === planId || r.id === planId) return true;
      if (r.planId) {
        const rc = String(r.planId).replace(/^prop-/, "").replace(/-plan$/, "");
        if (rc === clean) return true;
      }
      return false;
    });
  }
  if (direction) {
    items = items.filter((r) => r.direction === direction);
  }
  if (ownerId || ownerIdentifier) {
    const cleanPhone = ownerIdentifier ? ownerIdentifier.replace(/\s+/g, "") : "";
    items = items.filter((r) => {
      if (ownerId && r.ownerId === ownerId) return true;
      const candidates = [r.ownerIdentifier, r.ownerEmail].filter(Boolean);
      for (const cand of candidates) {
        const rid = String(cand).trim().toLowerCase();
        if (ownerIdentifier && (rid === ownerIdentifier || (cleanPhone && rid.replace(/\s+/g, "") === cleanPhone))) {
          return true;
        }
      }
      // If a legacy record has no owner scoping metadata, allow ownerId match only when explicitly matching
      return false;
    });
  }
  if (companyId || companyName) {
    items = items.filter((r) => {
      if (companyId && r.companyId === companyId) return true;
      if (companyName && r.companyName) {
        return String(r.companyName).trim().toLowerCase() === companyName;
      }
      return false;
    });
  }

  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = readDbJson<any[]>(FILE, []);
    const record = {
      ...body,
      id: body.id || `REQ-${Date.now().toString().slice(-6)}`,
      direction: body.direction || "company_to_owner",
      createdAt: body.createdAt || new Date().toISOString(),
    };
    const idx = items.findIndex(
      (i) => i.id === record.id || (record.planId && i.planId === record.planId)
    );
    if (idx >= 0) {
      items[idx] = {
        ...items[idx],
        ...record,
        negotiationMessages:
          record.negotiationMessages || items[idx].negotiationMessages || [],
        updatedAt: new Date().toISOString(),
      };
    } else {
      items.unshift({
        ...record,
        negotiationMessages: record.negotiationMessages || [],
      });
    }
    writeDbJson(FILE, items);
    return NextResponse.json({ success: true, data: idx >= 0 ? items[idx] : items[0] });
  } catch (err) {
    console.error("[api/project-requests] POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, planId, appendMessage, upsert, ...updates } = body || {};
    if (!id && !planId) {
      return NextResponse.json({ success: false, error: "Request id or planId required." }, { status: 400 });
    }
    const items = readDbJson<any[]>(FILE, []);
    let idx = items.findIndex(
      (i) =>
        (id && (i.id === id || i.planId === id)) ||
        (planId && (i.planId === planId || i.id === planId))
    );

    if (idx === -1) {
      if (!upsert) {
        return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
      }
      const created = {
        id: id || planId || `REQ-${Date.now().toString().slice(-6)}`,
        ...(planId ? { planId } : {}),
        direction: updates.direction || "owner_to_company",
        ...updates,
        negotiationMessages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      items.unshift(created);
      idx = 0;
    } else {
      items[idx] = {
        ...items[idx],
        ...updates,
        ...(planId ? { planId } : {}),
        updatedAt: new Date().toISOString(),
      };
    }

    if (appendMessage && appendMessage.text) {
      const existingMsgs = Array.isArray(items[idx].negotiationMessages)
        ? items[idx].negotiationMessages
        : [];
      const newMsg = {
        id: appendMessage.id || `pmsg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: appendMessage.sender === "company" ? "company" : "owner",
        senderName: appendMessage.senderName || (appendMessage.sender === "company" ? "Builder" : "Property Owner"),
        text: String(appendMessage.text).trim(),
        timestamp:
          appendMessage.timestamp ||
          new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
      };
      if (!existingMsgs.some((m: any) => m.id === newMsg.id)) {
        items[idx].negotiationMessages = [...existingMsgs, newMsg];
      }
    }

    writeDbJson(FILE, items);
    return NextResponse.json({ success: true, data: items[idx] });
  } catch (err) {
    console.error("[api/project-requests] PATCH error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
