"use server";

import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/validations";
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const json = (await res.json()) as { error?: string };
    return { success: false, error: json.error ?? "Login failed" };
  }

  redirect(formData.get("redirect") as string || "/dashboard");
}

export async function signup(formData: FormData): Promise<ActionResponse> {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signupSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const json = (await res.json()) as { error?: string };
    return { success: false, error: json.error ?? "Registration failed" };
  }

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  redirect("/");
}
