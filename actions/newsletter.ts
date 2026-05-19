"use server";

import { prisma } from "@/lib/db/prisma";
import { isReachWelcomeManaged, syncMakerDigestContact } from "@/lib/hostinger-reach";
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

  try {
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "You're already subscribed!" };
    }

    const reachResult = await syncMakerDigestContact(email);

    if (!reachResult.success && !reachResult.skipped) {
      return {
        success: false,
        error: reachResult.error || "Failed to add subscriber to Maker Digest audience.",
      };
    }

    // Insert subscriber
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    // If Reach automations are not sending the welcome email yet, use SMTP fallback.
    if (!isReachWelcomeManaged()) {
      await sendNewsletterConfirmation(email);
    }

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
