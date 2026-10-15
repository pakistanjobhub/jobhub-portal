import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createScholarship, deleteScholarship, getAllScholarships, updateScholarship } from "@/lib/db";
import type { Scholarship } from "@/lib/types";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  if (!isAdmin()) return unauthorized();
  try {
    return NextResponse.json({ scholarships: await getAllScholarships() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin()) return unauthorized();
  try {
    const body = (await req.json()) as Omit<Scholarship, "id" | "slug"> & { slug?: string };
    const scholarship = await createScholarship(body);
    return NextResponse.json({ scholarship }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin()) return unauthorized();
  try {
    const body = (await req.json()) as { slug: string; patch: Partial<Scholarship> };
    const scholarship = await updateScholarship(body.slug, body.patch);
    if (!scholarship) return NextResponse.json({ error: "Scholarship nahi mili." }, { status: 404 });
    return NextResponse.json({ scholarship });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return unauthorized();
  try {
    const body = (await req.json()) as { slug: string };
    const ok = await deleteScholarship(body.slug);
    if (!ok) return NextResponse.json({ error: "Scholarship nahi mili." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}
