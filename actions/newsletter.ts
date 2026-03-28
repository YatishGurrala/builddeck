"use server";

import { createClient } from "@/lib/supabase/server";
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

  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return { success: false, error: "You're already subscribed!" };
  }

  // Insert subscriber
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    return { success: false, error: "Failed to subscribe. Please try again." };
  }

  // Send confirmation email
  await sendNewsletterConfirmation(email);

  return { success: true };
}
