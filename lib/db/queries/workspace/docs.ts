import { prisma } from "@/lib/db/prisma";

export async function getWorkspaceDocs(productId: string, userId: string) {
  return prisma.workspaceDoc.findMany({
    where: { productId, userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getWorkspaceDocById(id: string, userId: string) {
  return prisma.workspaceDoc.findFirst({ where: { id, userId } });
}

export async function createWorkspaceDoc(
  userId: string,
  data: { title: string; content?: string; productId: string }
) {
  return prisma.workspaceDoc.create({ data: { ...data, userId } });
}

export async function updateWorkspaceDoc(
  id: string,
  userId: string,
  data: Partial<{ title: string; content: string }>
) {
  return prisma.workspaceDoc.updateMany({ where: { id, userId }, data });
}

export async function deleteWorkspaceDoc(id: string, userId: string) {
  return prisma.workspaceDoc.deleteMany({ where: { id, userId } });
}
