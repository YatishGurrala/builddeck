import { prisma } from "@/lib/db/prisma";

export async function getBuildsByUser(userId: string) {
  return prisma.build.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBuildByIdForUser(buildId: string, userId: string) {
  return prisma.build.findFirst({
    where: {
      id: buildId,
      userId,
    },
  });
}
