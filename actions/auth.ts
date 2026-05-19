"use server";

import { signIn, signOut } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { magicLinkSchema } from "@/lib/validations";
import type { ActionResponse } from "@/types";

export async function login(formData: FormData): Promise<ActionResponse> {
  const data = {
    email: formData.get("email") as string,
  };

  const result = magicLinkSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    const redirectTo = (formData.get("redirect") as string) || "/dashboard";

    await signIn("nodemailer", {
      email: data.email,
      redirect: false,
      redirectTo,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send magic link" };
  }
}

export async function signup(formData: FormData): Promise<ActionResponse> {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const result = magicLinkSchema.safeParse({ email: data.email });
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name || undefined,
      },
      create: {
        email: data.email,
        name: data.name || null,
      },
    });

    await signIn("nodemailer", {
      email: data.email,
      redirect: false,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to start signup flow. Please try again." };
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/");
}
