"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionResponse } from "@/types";

type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export async function createProduct(formData: FormData): Promise<ActionResponse> {
  const session = await auth();

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
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    slug = `${slug}-${Date.now()}`;
  }

  // For now, we'll skip file uploads (can add Cloudinary or local storage later)
  // Handle logo URL from form if provided directly
  const logoUrl = formData.get("logo_url") as string | null;

  try {
    await prisma.product.create({
      data: {
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
      },
    });

    // Log submission
    // Note: We'll let the product creation handle this for now

    revalidatePath("/dashboard");
    redirect("/dashboard?submitted=true");
  } catch (error) {
    // Check if it's a redirect
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
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  // Verify ownership
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      userId: session.user.id,
    },
  });

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

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        websiteUrl: data.website_url,
        categoryId: data.category_id || null,
        status: "PENDING", // Reset to pending on edit
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  try {
    await prisma.product.delete({
      where: {
        id: productId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Admin actions
export async function updateProductStatus(
  productId: string,
  status: ProductStatus
): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  // Verify admin role
  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        status,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        ...(status === "APPROVED" && { approvedAt: new Date() }),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function toggleFeatured(productId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  // Verify admin role
  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  // Get current featured status
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { featured: true },
  });

  if (!product) {
    return { success: false, error: "Product not found" };
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        featured: !product.featured,
        featuredAt: !product.featured ? new Date() : null,
      },
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
