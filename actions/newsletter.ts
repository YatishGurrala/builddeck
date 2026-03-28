"use server";

import { prisma } from "@/lib/db/prisma";
import { sendNewsletterConfirmation } from "@/lib/resend";
import { newsletterSchema } from "@/lib/validations";
import type { ActionResponse } from "@/types";

export async function subscribeToNewsletter(
  email: string
): Promise<ActionResponse> {
  const result = newsletterSchema.safeParse({ email });
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  // Check if already subscribed
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    return { success: false, error: "You're already subscribed!" };
  }

  try {
    // Insert subscriber
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    // Send confirmation email
    await sendNewsletterConfirmation(email);

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
