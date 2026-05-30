import { getRecords, getRecord, createRecord, updateRecord, deleteRecord } from "@/lib/buildstack/records";

interface DocData {
  title: string;
  content?: string | null;
  productId: string;
  userId: string;
}

export async function getWorkspaceDocs(productId: string, userId: string) {
  const all = await getRecords<DocData>("workspace_docs", userId);
  return all
    .filter((r) => r.data.productId === productId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((r) => ({ id: r.id, ...r.data, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }));
}

export async function getWorkspaceDocById(id: string, userId: string) {
  const record = await getRecord<DocData>(id);
  if (!record || record.ownerId !== userId) return null;
  return { id: record.id, ...record.data, createdAt: new Date(record.createdAt), updatedAt: new Date(record.updatedAt) };
}

export async function createWorkspaceDoc(userId: string, data: { title: string; content?: string; productId: string }) {
  return createRecord<DocData>("workspace_docs", userId, { ...data, userId });
}

export async function updateWorkspaceDoc(id: string, userId: string, data: Partial<{ title: string; content: string }>) {
  const record = await getRecord<DocData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return updateRecord<DocData>(id, data);
}

export async function deleteWorkspaceDoc(id: string, userId: string) {
  const record = await getRecord<DocData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return deleteRecord(id);
}
