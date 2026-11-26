import { NextResponse } from "next/server";
import { readDbJson, writeDbJson } from "../../../lib/localDb";

export const dynamic = "force-dynamic";

const FILE = "projects.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("ownerId");
  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName")?.trim().toLowerCase();
  const projects = readDbJson<any[]>(FILE, []);

  let filtered = projects;
  if (ownerId) {
    filtered = filtered.filter((p) => p.ownerId === ownerId);
  }
  if (companyId || companyName) {
    filtered = filtered.filter((p) => {
      if (companyId && p.companyId === companyId) return true;
      if (companyName && p.companyName) {
        return String(p.companyName).trim().toLowerCase() === companyName;
      }
      return false;
    });
  }

  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  try {
    const project = await request.json();
    if (!project?.id || !project?.title) {
      return NextResponse.json(
        { success: false, error: "Project id and title are required." },
        { status: 400 }
      );
    }

    const projects = readDbJson<any[]>(FILE, []);
    const idx = projects.findIndex((p) => p.id === project.id);
    const record = {
      ...project,
      updatedAt: new Date().toISOString(),
      createdAt: idx >= 0 ? projects[idx].createdAt : new Date().toISOString(),
    };

    if (idx >= 0) {
      projects[idx] = record;
    } else {
      projects.unshift(record);
    }

    writeDbJson(FILE, projects);
    return NextResponse.json({ success: true, data: record });
  } catch (err) {
    console.error("[api/projects] POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body || {};
    if (!id) {
      return NextResponse.json({ success: false, error: "Project id required." }, { status: 400 });
    }

    const projects = readDbJson<any[]>(FILE, []);
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    projects[idx] = {
      ...projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeDbJson(FILE, projects);
    return NextResponse.json({ success: true, data: projects[idx] });
  } catch (err) {
    console.error("[api/projects] PATCH error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
