import { prisma } from "@/lib/db/prisma";

export type RoadmapItemStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export async function getRoadmapItems(productId: string) {
  return prisma.roadmapItem.findMany({
    where: { productId },
    orderBy: { order: "asc" },
  });
}

export async function createRoadmapItem(data: {
  title: string;
  description?: string;
  status?: RoadmapItemStatus;
  order?: number;
  productId: string;
}) {
  return prisma.roadmapItem.create({ data });
}

export async function updateRoadmapItem(
  id: string,
  productId: string,
  data: Partial<{
    title: string;
    description: string;
    status: RoadmapItemStatus;
    order: number;
  }>
) {
  return prisma.roadmapItem.updateMany({ where: { id, productId }, data });
}

export async function deleteRoadmapItem(id: string, productId: string) {
  return prisma.roadmapItem.deleteMany({ where: { id, productId } });
}
