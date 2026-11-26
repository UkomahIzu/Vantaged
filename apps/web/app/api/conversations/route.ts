import { NextResponse } from "next/server";
import { readDbJson, writeDbJson } from "../../../lib/localDb";

export const dynamic = "force-dynamic";

const FILE = "conversations.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("ownerId");
  const companyId = searchParams.get("companyId");
  let threads = readDbJson<any[]>(FILE, []);

  if (ownerId) {
    threads = threads.filter((t) => t.ownerId === ownerId);
  }
  if (companyId) {
    threads = threads.filter((t) => t.companyId === companyId);
  }

  return NextResponse.json({ success: true, data: threads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const threads = readDbJson<any[]>(FILE, []);

    if (body.action === "append_message") {
      const { conversationId, sender, senderName, text } = body;
      const idx = threads.findIndex((t) => t.id === conversationId);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: "Conversation not found." }, { status: 404 });
      }
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender,
        senderName,
        text: String(text || "").trim(),
        timestamp: "Just now",
        status: "delivered",
      };
      const t = threads[idx];
      threads[idx] = {
        ...t,
        lastMessage: newMsg.text,
        lastMessageTime: "Just now",
        ownerUnreadCount: sender === "contractor" ? (t.ownerUnreadCount || 0) + 1 : 0,
        contractorUnreadCount: sender === "owner" ? (t.contractorUnreadCount || 0) + 1 : 0,
        messages: [...(t.messages || []), newMsg],
      };
      writeDbJson(FILE, threads);
      return NextResponse.json({ success: true, data: threads[idx] });
    }

    // Ensure or upsert conversation thread
    const idx = threads.findIndex(
      (t) => t.id === body.id || (body.projectId && t.projectId === body.projectId)
    );
    if (idx >= 0) {
      threads[idx] = { ...threads[idx], ...body };
      writeDbJson(FILE, threads);
      return NextResponse.json({ success: true, data: threads[idx] });
    }

    threads.unshift(body);
    writeDbJson(FILE, threads);
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    console.error("[api/conversations] POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { conversationId, viewer } = await request.json();
    const threads = readDbJson<any[]>(FILE, []);
    const idx = threads.findIndex((t) => t.id === conversationId);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Conversation not found." }, { status: 404 });
    }
    threads[idx] =
      viewer === "owner"
        ? { ...threads[idx], ownerUnreadCount: 0 }
        : { ...threads[idx], contractorUnreadCount: 0 };
    writeDbJson(FILE, threads);
    return NextResponse.json({ success: true, data: threads[idx] });
  } catch (err) {
    console.error("[api/conversations] PATCH error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
