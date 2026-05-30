"use server";

import { getSession } from "@/lib/buildstack/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { createDraftsForProduct } from "@/lib/social";
import {
  bsCreateProduct,
  bsUpdateProduct,
  bsDeleteProduct,
  getAllProducts,
  getProductById,
} from "@/lib/buildstack/queries/products";
import type { ActionResponse } from "@/types";
import type { ProductData } from "@/lib/buildstack/queries/products";

type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export async function createProduct(formData: FormData): Promise<ActionResponse> {
  const session = await getSession();

  if (!session?.user?.id) {
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
  const allProducts = await getAllProducts();
  const existingSlug = allProducts.find((p) => p.data.slug === slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  const logoUrl = formData.get("logo_url") as string | null;
  const now = new Date().toISOString();

  try {
    await bsCreateProduct({
      name: data.name,
      slug,
      tagline: data.tagline,
      description: data.description,
      websiteUrl: data.website_url,
      categoryId: data.category_id || null,
      logoUrl: logoUrl || null,
      screenshots: "[]",
      userId: session.user.id,
      status: "PENDING",
      featured: false,
      featuredAt: null,
      viewCount: 0,
      upvoteCount: 0,
      rejectionReason: null,
      reviewedAt: null,
      reviewedById: null,
      submittedAt: now,
      approvedAt: null,
    });

    revalidatePath("/dashboard");
    redirect("/dashboard?submitted=true");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Create product error:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  const existing = await getProductById(productId);
  if (!existing || existing.data.userId !== session.user.id) {
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

  try {
    await bsUpdateProduct(productId, {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      websiteUrl: data.website_url,
      categoryId: data.category_id || null,
      status: "PENDING",
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  const existing = await getProductById(productId);
  if (!existing || existing.data.userId !== session.user.id) {
    return { success: false, error: "Product not found" };
  }

  try {
    await bsDeleteProduct(productId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function updateProductStatus(
  productId: string,
  status: ProductStatus
): Promise<ActionResponse> {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  const now = new Date().toISOString();

  try {
    const updateData: Partial<ProductData> = {
      status,
      reviewedById: session.user.id,
      reviewedAt: now,
      ...(status === "APPROVED" && { approvedAt: now }),
    };
    await bsUpdateProduct(productId, updateData);

    if (status === "APPROVED") {
      try {
        await createDraftsForProduct(productId);
      } catch (error) {
        console.error("Failed to create social drafts:", error);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function toggleFeatured(productId: string): Promise<ActionResponse> {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  const product = await getProductById(productId);
  if (!product) {
    return { success: false, error: "Product not found" };
  }

  try {
    await bsUpdateProduct(productId, {
      featured: !product.data.featured,
      featuredAt: !product.data.featured ? new Date().toISOString() : null,
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return { success: false, error: "Failed to toggle featured" };
  }
}
