"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionResponse, Product, ProductStatus } from "@/types";

export async function createProduct(formData: FormData): Promise<ActionResponse<Product>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const data = {
    name: formData.get("name") as string,
    tagline: formData.get("tagline") as string,
    description: formData.get("description") as string,
    website_url: formData.get("website_url") as string,
    category_id: formData.get("category_id") as string,
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  // Generate unique slug
  let slug = slugify(data.name);
  const { data: existingProduct } = await supabase
    .from("products")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existingProduct) {
    slug = `${slug}-${Date.now()}`;
  }

  // Handle logo upload
  let logoUrl: string | null = null;
  const logo = formData.get("logo") as File;
  if (logo && logo.size > 0) {
    const fileExt = logo.name.split(".").pop();
    const filePath = `${user.id}/${slug}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, logo);

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath);
      logoUrl = publicUrl;
    }
  }

  // Handle screenshots upload
  const screenshots: string[] = [];
  const screenshotFiles = formData.getAll("screenshots") as File[];
  for (let i = 0; i < screenshotFiles.length; i++) {
    const file = screenshotFiles[i];
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${slug}/screenshot-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(filePath);
        screenshots.push(publicUrl);
      }
    }
  }

  // Insert product
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug,
      tagline: data.tagline,
      description: data.description,
      website_url: data.website_url,
      category_id: data.category_id,
      logo_url: logoUrl,
      screenshots,
      user_id: user.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?submitted=true");
}

export async function updateProduct(
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  // Verify ownership
  const { data: existingProduct } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single();

  if (!existingProduct) {
    return { success: false, error: "Product not found" };
  }

  const data = {
    name: formData.get("name") as string,
    tagline: formData.get("tagline") as string,
    description: formData.get("description") as string,
    website_url: formData.get("website_url") as string,
    category_id: formData.get("category_id") as string,
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  // Handle logo upload if new one provided
  let logoUrl = existingProduct.logo_url;
  const logo = formData.get("logo") as File;
  if (logo && logo.size > 0) {
    const fileExt = logo.name.split(".").pop();
    const filePath = `${user.id}/${existingProduct.slug}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, logo, { upsert: true });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath);
      logoUrl = publicUrl;
    }
  }

  // Handle new screenshots
  let screenshots = existingProduct.screenshots || [];
  const screenshotFiles = formData.getAll("screenshots") as File[];
  for (let i = 0; i < screenshotFiles.length; i++) {
    const file = screenshotFiles[i];
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${existingProduct.slug}/screenshot-${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(filePath);
        screenshots.push(publicUrl);
      }
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      website_url: data.website_url,
      category_id: data.category_id,
      logo_url: logoUrl,
      screenshots,
      status: "pending", // Reset to pending on edit
    })
    .eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Admin actions
export async function updateProductStatus(
  productId: string,
  status: ProductStatus
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Not authorized" };
  }

  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  return { success: true };
}

export async function toggleFeatured(productId: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Not authorized" };
  }

  // Get current featured status
  const { data: product } = await supabase
    .from("products")
    .select("featured")
    .eq("id", productId)
    .single();

  if (!product) {
    return { success: false, error: "Product not found" };
  }

  const { error } = await supabase
    .from("products")
    .update({ featured: !product.featured })
    .eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}
