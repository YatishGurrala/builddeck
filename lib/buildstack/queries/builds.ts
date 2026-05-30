import { getRecords, getRecord } from "@/lib/buildstack/records";

interface BuildData {
  userId: string;
  idea: string;
  output: Record<string, unknown>;
}

export async function getBuildsByUser(userId: string) {
  return getRecords<BuildData>("builds", userId);
}

export async function getBuildByIdForUser(buildId: string, userId: string) {
  const record = await getRecord<BuildData>(buildId);
  if (!record || record.data.userId !== userId) return null;
  return record;
}
