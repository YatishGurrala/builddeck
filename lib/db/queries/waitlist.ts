import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type WaitlistLeadRecord = {
  id: string;
  email: string;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function isMissingWaitlistTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}
}

function mapNewsletterToWaitlistLead(subscriber: {
  id: string;
  email: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}): WaitlistLeadRecord {
  return {
    id: subscriber.id,
    email: subscriber.email,
    source: subscriber.source,
    createdAt: subscriber.createdAt,
    updatedAt: subscriber.updatedAt,
  };
}

export async function createWaitlistLead(email: string, source?: string) {
  try {
    return await prisma.waitlistLead.create({
      data: {
        email,
        source,
      },
    });
  } catch (error) {
    if (!isMissingWaitlistTableError(error)) throw error;

    return prisma.newsletterSubscriber.create({
      data: {
        email,
        source: source || "builddeck-landing",
      },
    });
  }
}

export async function getWaitlistLeadByEmail(email: string) {
  try {
    return await prisma.waitlistLead.findUnique({
      where: { email },
    });
  } catch (error) {
    if (!isMissingWaitlistTableError(error)) throw error;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        source: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return subscriber ? mapNewsletterToWaitlistLead(subscriber) : null;
  }
}

export async function getWaitlistLeads() {
  try {
    return await prisma.waitlistLead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (!isMissingWaitlistTableError(error)) throw error;

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { source: "builddeck-landing" },
      select: {
        id: true,
        email: true,
        source: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return subscribers.map(mapNewsletterToWaitlistLead);
  }
}

export async function getWaitlistLeadCount() {
  try {
    return await prisma.waitlistLead.count();
  } catch (error) {
    if (!isMissingWaitlistTableError(error)) throw error;

    return prisma.newsletterSubscriber.count();
  }
}
