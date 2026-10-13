import { NextResponse } from "next/server";
import { saveJobAlert } from "@/lib/db";
import type { JobAlert } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<JobAlert>;
    const email = String(body.email ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email chahiye." }, { status: 400 });
    }
    const result = await saveJobAlert({
      email,
      keyword: body.keyword || undefined,
      city: body.city || undefined,
      category: body.category || undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed." }, { status: 500 });
  }
}
