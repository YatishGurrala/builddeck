import { bsApi } from "./client";

export interface BsRecord<T = Record<string, unknown>> {
  id: string;
  collection: string;
  ownerId: string;
  data: T;
  createdAt: string;
  updatedAt: string;
}

export async function createRecord<T = Record<string, unknown>>(
  collection: string,
  ownerId: string,
  data: T
): Promise<BsRecord<T>> {
  const res = await bsApi<{ data: BsRecord<T> }>("/records", {
    method: "POST",
    body: JSON.stringify({ collection, ownerId, data }),
  });
  return res.data;
}

export async function getRecords<T = Record<string, unknown>>(
  collection: string,
  ownerId?: string
): Promise<BsRecord<T>[]> {
  const params = new URLSearchParams({ collection });
  if (ownerId) params.set("ownerId", ownerId);
  const res = await bsApi<{ data: BsRecord<T>[] }>(`/records?${params}`);
  return res.data;
}

export async function getRecord<T = Record<string, unknown>>(
  id: string
): Promise<BsRecord<T> | null> {
  try {
    const res = await bsApi<{ data: BsRecord<T> }>(`/records/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function updateRecord<T = Record<string, unknown>>(
  id: string,
  data: Partial<T>
): Promise<BsRecord<T>> {
  const res = await bsApi<{ data: BsRecord<T> }>(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
  return res.data;
}

export async function deleteRecord(id: string): Promise<void> {
  await bsApi(`/records/${id}`, { method: "DELETE" });
}
