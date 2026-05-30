import { prisma } from "@/lib/db/prisma";

export type WorkspaceProductStatus = "IDEA" | "BUILDING" | "LAUNCHED" | "PAUSED" | "ARCHIVED";
export type RoadmapPhase = "DISCOVERY" | "VALIDATION" | "BUILDING" | "BETA" | "LAUNCHED";

const workspaceProductInclude = {
  _count: {
    select: {
      tasks: true,
      docs: true,
      roadmapItems: true,
    },
  },
};

export async function getWorkspaceProducts(userId: string) {
  return prisma.workspaceProduct.findMany({
    where: { userId },
    include: workspaceProductInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getWorkspaceProductById(id: string, userId: string) {
  return prisma.workspaceProduct.findFirst({
    where: { id, userId },
    include: {
      tasks: { orderBy: { createdAt: "asc" } },
      docs: { orderBy: { updatedAt: "desc" } },
      roadmapItems: { orderBy: { order: "asc" } },
    },
  });
}

export async function createWorkspaceProduct(
  userId: string,
  data: {
    name: string;
    tagline?: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
    status?: WorkspaceProductStatus;
    roadmapPhase?: RoadmapPhase;
  }
) {
  return prisma.workspaceProduct.create({
    data: { ...data, userId },
  });
}

export async function updateWorkspaceProduct(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
    status: WorkspaceProductStatus;
    roadmapPhase: RoadmapPhase;
  }>
) {
  return prisma.workspaceProduct.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteWorkspaceProduct(id: string, userId: string) {
  return prisma.workspaceProduct.deleteMany({
    where: { id, userId },
  });
}
