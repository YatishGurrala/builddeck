import { auth } from "./config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

/**
 * Get the current session (server-side)
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user (server-side)
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      role: true,
      avatarUrl: true,
      bio: true,
      website: true,
      twitter: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Require admin role - redirects if not admin
 */
export async function requireAdmin() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}
