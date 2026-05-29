import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/buildstack/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", { expires: new Date(0), path: "/" });
  return res;
}
