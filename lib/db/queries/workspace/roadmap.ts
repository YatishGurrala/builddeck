import { getRecords, getRecord, createRecord, updateRecord, deleteRecord } from "@/lib/buildstack/records";

export type RoadmapItemStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

interface RoadmapItemData {
  title: string;
  description?: string | null;
  status: RoadmapItemStatus;
  order: number;
  productId: string;
  userId: string;
}

export async function getRoadmapItems(productId: string, userId?: string) {
  const all = await getRecords<RoadmapItemData>("workspace_roadmap_items", userId);
  return all
    .filter((r) => r.data.productId === productId)
    .sort((a, b) => a.data.order - b.data.order)
    .map((r) => ({ id: r.id, ...r.data, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }));
}

export async function createRoadmapItem(userId: string, data: { title: string; description?: string; status?: RoadmapItemStatus; order?: number; productId: string; }) {
  return createRecord<RoadmapItemData>("workspace_roadmap_items", userId, {
    status: "PLANNED",
    order: 0,
    ...data,
    userId,
  });
}

export async function updateRoadmapItem(id: string, userId: string, data: Partial<{ title: string; description: string; status: RoadmapItemStatus; order: number; }>) {
  const record = await getRecord<RoadmapItemData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return updateRecord<RoadmapItemData>(id, data);
}

export async function deleteRoadmapItem(id: string, userId: string) {
  const record = await getRecord<RoadmapItemData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return deleteRecord(id);
}
