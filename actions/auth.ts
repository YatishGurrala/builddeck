"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/validations";
import type { ActionResponse } from "@/types";

export async function login(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, error: error.message };
  }

  const redirectTo = formData.get("redirect") as string;
  redirect(redirectTo || "/dashboard");
}

export async function signup(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

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

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
