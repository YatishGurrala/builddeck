// Re-export Buildstack auth helpers for backwards compatibility.
export {
  getSession,
  requireAuth,
  requireAdmin,
  isAdmin,
} from "@/lib/buildstack/auth";

import { getSession } from "@/lib/buildstack/auth";

/** Returns the current user object or null if not authenticated. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const { user } = session;
  return {
    id: user.id,
    email: user.email,
    name: (user.metadata as Record<string, unknown>)?.name as string | null ?? null,
    username: null as string | null,
    role: user.role as "USER" | "ADMIN",
    avatarUrl: null as string | null,
    bio: null as string | null,
    website: null as string | null,
    twitter: null as string | null,
    createdAt: new Date(),
  };
}
