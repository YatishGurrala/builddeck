import { getRecords, createRecord } from "@/lib/buildstack/records";

interface WaitlistData {
  email: string;
  source: string | null;
}

export async function createWaitlistLead(email: string, source?: string) {
  return createRecord<WaitlistData>("waitlist", email, { email, source: source ?? null });
}

export async function getWaitlistLeadByEmail(email: string) {
  const all = await getRecords<WaitlistData>("waitlist", email);
  return all[0] ?? null;
}

export async function getWaitlistLeads() {
  const all = await getRecords<WaitlistData>("waitlist");
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getWaitlistLeadCount() {
  const all = await getRecords<WaitlistData>("waitlist");
  return all.length;
}
