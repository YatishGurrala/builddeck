import { NextRequest, NextResponse } from "next/server";
import { bsApi } from "@/lib/buildstack/client";
import { SESSION_COOKIE } from "@/lib/buildstack/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await bsApi<{ user: Record<string, unknown>; token: string; expiresAt: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    const res = NextResponse.json({ success: true, user: result.user });
    res.cookies.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(result.expiresAt),
      path: "/",
    });
    return res;
  } catch (err: unknown) {
    const msg = (err as Record<string, unknown>)?.error?.toString() ?? "Invalid credentials";
    return NextResponse.json({ success: false, error: msg }, { status: 401 });
  }
}
