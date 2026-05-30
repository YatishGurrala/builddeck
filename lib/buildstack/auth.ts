import { cookies } from "next/headers";

export const SESSION_COOKIE = "bs_session";

export interface BsUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  metadata: Record<string, unknown>;
}

export interface BsSession {
  user: BsUser;
  token: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split(".");
  return JSON.parse(Buffer.from(payload, "base64url").toString());
}

export async function getSession(): Promise<BsSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = decodeJwtPayload(token);
    const exp = payload.exp as number;
    if (exp && Date.now() / 1000 > exp) return null;
    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string,
        name: (payload.name as string) ?? undefined,
        role: ((payload.metadata as Record<string, unknown>)?.role as string) ?? "USER",
        metadata: (payload.metadata as Record<string, unknown>) ?? {},
      },
      token,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<BsSession> {
  const { redirect } = await import("next/navigation");
  const session = await getSession();
  if (!session) redirect("/login");
  return session!;
}

export async function requireAdmin(): Promise<BsSession> {
  const { redirect } = await import("next/navigation");
  const session = await getSession();
  if (!session) redirect("/login");
  if (session!.user.role !== "ADMIN") redirect("/dashboard");
  return session!;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user.role === "ADMIN";
}
