"use server";

import { signIn, signOut } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import type { ActionResponse } from "@/types";

export async function login(formData: FormData): Promise<ActionResponse> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    const redirectTo = (formData.get("redirect") as string) || "/dashboard";
    
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    redirect(redirectTo);
  } catch (error) {
    // Check if it's a redirect (which is expected)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, error: "Invalid email or password" };
  }
}

export async function signup(formData: FormData): Promise<ActionResponse> {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = signupSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { success: false, error: "An account with this email already exists" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Create user
  try {
    await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });

    // Sign in the user
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    redirect("/dashboard");
  } catch (error) {
    // Check if it's a redirect
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Signup error:", error);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/");
}
