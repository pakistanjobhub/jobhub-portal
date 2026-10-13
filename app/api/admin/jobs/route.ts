import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createJob, deleteJob, getAllJobs, updateJob } from "@/lib/db";
import type { Job } from "@/lib/types";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  if (!isAdmin()) return unauthorized();
  try {
    return NextResponse.json({ jobs: await getAllJobs() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin()) return unauthorized();
  try {
    const body = (await req.json()) as Omit<Job, "id" | "slug"> & { slug?: string };
    const job = await createJob(body);
    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin()) return unauthorized();
  try {
    const body = (await req.json()) as { slug: string; patch: Partial<Job> };
    const job = await updateJob(body.slug, body.patch);
    if (!job) return NextResponse.json({ error: "Job nahi mili." }, { status: 404 });
    return NextResponse.json({ job });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return unauthorized();
  try {
    const body = (await req.json()) as { slug: string };
    const ok = await deleteJob(body.slug);
    if (!ok) return NextResponse.json({ error: "Job nahi mili." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}
