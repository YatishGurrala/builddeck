import { prisma } from "@/lib/db/prisma";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
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
      updatedAt: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      website: true,
      twitter: true,
      createdAt: true,
      _count: {
        select: {
          products: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
  });
}

export async function getUserWithProducts(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      },
    },
  });
}
