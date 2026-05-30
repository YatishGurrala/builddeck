"use server";

import { createRecord, getRecords } from "@/lib/buildstack/records";
import { isReachWelcomeManaged, syncMakerDigestContact } from "@/lib/hostinger-reach";
import { sendNewsletterConfirmation } from "@/lib/resend";
import { newsletterSchema } from "@/lib/validations";
import type { ActionResponse } from "@/types";

interface SubscriberData {
  email: string;
}

export async function subscribeToNewsletter(
  email: string
): Promise<ActionResponse> {
  const result = newsletterSchema.safeParse({ email });
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    const all = await getRecords<SubscriberData>("newsletter_subscribers");
    const existing = all.find((r) => r.data.email === email);

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

    await createRecord<SubscriberData>("newsletter_subscribers", email, { email });

    if (!isReachWelcomeManaged()) {
      await sendNewsletterConfirmation(email);
    }

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
