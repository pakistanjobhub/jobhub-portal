import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return NextResponse.json({ error: "Admin login configure nahi hai (ADMIN_KEY missing)." }, { status: 500 });
  }
  const { key } = (await req.json()) as { key?: string };
  if (key !== adminKey) {
    return NextResponse.json({ error: "Ghalat key." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminKey, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
