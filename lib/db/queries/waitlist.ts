import { prisma } from "@/lib/db/prisma";

export async function createWaitlistLead(email: string, source?: string) {
  return prisma.waitlistLead.create({
    data: {
      email,
      source,
    },
  });
}

export async function getWaitlistLeadByEmail(email: string) {
  return prisma.waitlistLead.findUnique({
    where: { email },
  });
}

export async function getWaitlistLeads() {
  return prisma.waitlistLead.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getWaitlistLeadCount() {
  return prisma.waitlistLead.count();
}
