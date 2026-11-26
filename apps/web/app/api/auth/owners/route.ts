import { NextResponse } from "next/server";
import { readDbJson, writeDbJson } from "../../../../lib/localDb";

export const dynamic = "force-dynamic";

export interface StoredOwnerAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  role: string;
  idMethod: "NIN" | "PASSPORT";
  idNumber: string;
  orgName?: string;
  rcNumber?: string;
  createdAt: string;
}

const FILE = "owner-accounts.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identifier = searchParams.get("identifier")?.trim().toLowerCase();
  const owners = readDbJson<StoredOwnerAccount[]>(FILE, []);

  if (identifier) {
    const cleanPhone = identifier.replace(/\s+/g, "");
    const found = owners.find(
      (o) =>
        o.email.trim().toLowerCase() === identifier ||
        o.phone.replace(/\s+/g, "") === cleanPhone
    );
    if (!found) {
      return NextResponse.json({ success: true, data: null });
    }
    const { password: _, ...safe } = found;
    return NextResponse.json({ success: true, data: safe });
  }

  return NextResponse.json({
    success: true,
    data: owners.map(({ password: _, ...safe }) => safe),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body?.action as "signup" | "signin" | "google";
    const owners = readDbJson<StoredOwnerAccount[]>(FILE, []);

    if (action === "signup") {
      const normalizedEmail = String(body.email || "").trim().toLowerCase();
      if (!normalizedEmail || !body.password || !String(body.fullName || "").trim()) {
        return NextResponse.json(
          { success: false, error: "Please fill in your full name, email, and password." },
          { status: 400 }
        );
      }

      const duplicate = owners.find(
        (u) => u.email.trim().toLowerCase() === normalizedEmail
      );
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this email already exists. Please log in instead.",
          },
          { status: 409 }
        );
      }

      const created: StoredOwnerAccount = {
        id: `own-${Date.now()}`,
        fullName: String(body.fullName).trim(),
        email: normalizedEmail,
        password: String(body.password),
        phone: String(body.phone || "").trim(),
        countryCode: String(body.countryCode || "+234"),
        role: String(body.role || "Owner Admin"),
        idMethod: body.idMethod === "PASSPORT" ? "PASSPORT" : "NIN",
        idNumber: String(body.idNumber || "").trim(),
        orgName: body.orgName ? String(body.orgName).trim() : undefined,
        rcNumber: body.rcNumber ? String(body.rcNumber).trim() : undefined,
        createdAt: new Date().toISOString(),
      };

      writeDbJson(FILE, [created, ...owners]);
      const { password: _, ...safe } = created;
      return NextResponse.json({ success: true, data: safe });
    }

    if (action === "signin") {
      const normalizedEmail = String(body.email || "").trim().toLowerCase();
      const matched = owners.find(
        (u) => u.email.trim().toLowerCase() === normalizedEmail
      );
      if (!matched) {
        return NextResponse.json(
          {
            success: false,
            error:
              "No account found with this email. Please sign up first to create your Owner account.",
          },
          { status: 404 }
        );
      }
      if (matched.password !== String(body.password || "")) {
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect password. Please check your password and try again.",
          },
          { status: 401 }
        );
      }
      const { password: _, ...safe } = matched;
      return NextResponse.json({ success: true, data: safe });
    }

    if (action === "google") {
      const normalizedEmail = String(body.email || "").trim().toLowerCase();
      const matched = owners.find(
        (u) => u.email.trim().toLowerCase() === normalizedEmail
      );
      if (!matched) {
        return NextResponse.json(
          {
            success: false,
            error: `No registered Vantaged Owner account found for ${body.email || "this Google account"}. Please sign up first.`,
          },
          { status: 404 }
        );
      }
      const { password: _, ...safe } = matched;
      return NextResponse.json({ success: true, data: safe });
    }

    return NextResponse.json(
      { success: false, error: "Invalid auth action." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[api/auth/owners] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
