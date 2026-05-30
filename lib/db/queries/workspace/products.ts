import {
  getRecords, getRecord, createRecord, updateRecord, deleteRecord,
} from "@/lib/buildstack/records";

export type WorkspaceProductStatus = "IDEA" | "BUILDING" | "LAUNCHED" | "PAUSED" | "ARCHIVED";
export type RoadmapPhase = "DISCOVERY" | "VALIDATION" | "BUILDING" | "BETA" | "LAUNCHED";

interface ProductData {
  name: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  status: WorkspaceProductStatus;
  roadmapPhase: RoadmapPhase;
  userId: string;
}

export async function getWorkspaceProducts(userId: string) {
  const [products, tasks, docs, roadmapItems] = await Promise.all([
    getRecords<ProductData>("workspace_products", userId),
    getRecords<{ productId: string }>("workspace_tasks", userId),
    getRecords<{ productId: string }>("workspace_docs", userId),
    getRecords<{ productId: string }>("workspace_roadmap_items", userId),
  ]);
  return products
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((r) => ({
      id: r.id,
      ...r.data,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      _count: {
        tasks: tasks.filter((t) => t.data.productId === r.id).length,
        docs: docs.filter((d) => d.data.productId === r.id).length,
        roadmapItems: roadmapItems.filter((i) => i.data.productId === r.id).length,
      },
    }));
}

export async function getWorkspaceProductById(id: string, userId: string) {
  const record = await getRecord<ProductData>(id);
  if (!record || record.ownerId !== userId) return null;
  const [tasks, docs, roadmapItems] = await Promise.all([
    getRecords<{ productId: string; title: string; status: string; priority: string; description?: string | null; dueDate?: string | null }>("workspace_tasks", userId),
    getRecords<{ productId: string; title: string; content?: string | null }>("workspace_docs", userId),
    getRecords<{ productId: string; title: string; description?: string | null; status: string; order: number }>("workspace_roadmap_items", userId),
  ]);
  return {
    id: record.id,
    ...record.data,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    tasks: tasks.filter((t) => t.data.productId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map((t) => ({ id: t.id, ...t.data, createdAt: new Date(t.createdAt), updatedAt: new Date(t.updatedAt) })),
    docs: docs.filter((d) => d.data.productId === id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((d) => ({ id: d.id, ...d.data, createdAt: new Date(d.createdAt), updatedAt: new Date(d.updatedAt) })),
    roadmapItems: roadmapItems.filter((i) => i.data.productId === id).sort((a, b) => a.data.order - b.data.order).map((i) => ({ id: i.id, ...i.data, createdAt: new Date(i.createdAt), updatedAt: new Date(i.updatedAt) })),
  };
}

export async function createWorkspaceProduct(userId: string, data: { name: string; tagline?: string; description?: string; logoUrl?: string; websiteUrl?: string; status?: WorkspaceProductStatus; roadmapPhase?: RoadmapPhase; }) {
  return createRecord<ProductData>("workspace_products", userId, { status: "IDEA", roadmapPhase: "DISCOVERY", ...data, userId });
}

export async function updateWorkspaceProduct(id: string, userId: string, data: Partial<Omit<ProductData, "userId">>) {
  const record = await getRecord<ProductData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return updateRecord<ProductData>(id, data);
}

export async function deleteWorkspaceProduct(id: string, userId: string) {
  const record = await getRecord<ProductData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return deleteRecord(id);
}
