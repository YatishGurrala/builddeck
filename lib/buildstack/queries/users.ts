import { getRecords, createRecord, updateRecord } from "@/lib/buildstack/records";

interface UserProfile {
  userId: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
}

export async function getUserProfile(userId: string) {
  const records = await getRecords<UserProfile>("users_profile", userId);
  return records[0] ?? null;
}

export async function upsertUserProfile(userId: string, data: Partial<Omit<UserProfile, "userId">>) {
  const existing = await getUserProfile(userId);
  if (existing) {
    return updateRecord(existing.id, data);
  }
  return createRecord<UserProfile>("users_profile", userId, { userId, ...data } as UserProfile);
}
