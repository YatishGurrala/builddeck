import { SupabaseClient } from "@supabase/supabase-js";
import type {
  Product,
  ProductWithRelations,
  Profile,
  Category,
  SubmissionWithRelations,
  NewsletterSubscriber,
  ProductFilters,
  ProductSortOptions,
  PaginationOptions,
  PaginatedResponse,
  AdminStats,
  ProductStatus,
} from "@/types";

// Use generic Supabase client - works without generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any, "public", any>;

// =====================================================
// PROFILE HELPERS
// =====================================================

export async function getProfile(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getProfileByUsername(supabase: Client, username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Profile | null;
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: Partial<Profile>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function isUserAdmin(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return false;
  return data?.role === "admin";
}

// =====================================================
// CATEGORY HELPERS
// =====================================================

export async function getCategories(supabase: Client, includeInactive = false) {
  let query = supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Category[];
}

export async function getCategoryBySlug(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Category | null;
}

export async function createCategory(
  supabase: Client,
  category: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    display_order?: number;
  }
) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  supabase: Client,
  categoryId: string,
  updates: Partial<Category>
) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(supabase: Client, categoryId: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw error;
}

// =====================================================
// PRODUCT HELPERS
// =====================================================

export async function getProducts(
  supabase: Client,
  options?: {
    filters?: ProductFilters;
    sort?: ProductSortOptions;
    pagination?: PaginationOptions;
  }
): Promise<PaginatedResponse<ProductWithRelations>> {
  const { filters, sort, pagination } = options || {};
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 12;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)", { count: "exact" });

  // Apply filters
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id);
  }
  if (filters?.featured !== undefined) {
    query = query.eq("featured", filters.featured);
  }
  if (filters?.user_id) {
    query = query.eq("user_id", filters.user_id);
  }
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Apply sorting
  const sortField = sort?.field || "created_at";
  const sortDirection = sort?.direction || "desc";
  query = query.order(sortField, { ascending: sortDirection === "asc" });

  // Apply pagination
  query = query.range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: data as ProductWithRelations[],
    count: totalCount,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function getProductBySlug(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as ProductWithRelations | null;
}

export async function getProductById(supabase: Client, id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as ProductWithRelations | null;
}

export async function getFeaturedProducts(supabase: Client, limit = 6) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)")
    .eq("status", "approved")
    .eq("featured", true)
    .order("featured_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ProductWithRelations[];
}

export async function getLatestProducts(supabase: Client, limit = 12) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)")
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ProductWithRelations[];
}

export async function getProductsByCategory(
  supabase: Client,
  categorySlug: string,
  pagination?: PaginationOptions
) {
  const category = await getCategoryBySlug(supabase, categorySlug);
  if (!category) return null;

  return getProducts(supabase, {
    filters: { category_id: category.id, status: "approved" },
    pagination,
  });
}

export async function getUserProducts(
  supabase: Client,
  userId: string,
  pagination?: PaginationOptions
) {
  return getProducts(supabase, {
    filters: { user_id: userId },
    sort: { field: "created_at", direction: "desc" },
    pagination,
  });
}

export async function createProduct(
  supabase: Client,
  product: {
    name: string;
    tagline: string;
    description?: string;
    website_url: string;
    category_id?: string;
    logo_url?: string;
    screenshots?: string[];
    user_id: string;
  }
) {
  // Generate slug
  const slug = await generateSlug(supabase, product.name, "products");

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      slug,
      status: "pending",
      submitted_at: new Date().toISOString(),
    })
    .select("*, category:categories(*), profile:profiles(*)")
    .single();

  if (error) throw error;
  return data as ProductWithRelations;
}

export async function updateProduct(
  supabase: Client,
  productId: string,
  updates: Partial<Product>
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select("*, category:categories(*), profile:profiles(*)")
    .single();

  if (error) throw error;
  return data as ProductWithRelations;
}

export async function deleteProduct(supabase: Client, productId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
}

export async function incrementViewCount(supabase: Client, productId: string) {
  const { error } = await supabase.rpc("increment_view_count", {
    product_id: productId,
  });

  // If RPC doesn't exist, fallback to direct update
  if (error) {
    const { data: product } = await supabase
      .from("products")
      .select("view_count")
      .eq("id", productId)
      .single();

    if (product) {
      await supabase
        .from("products")
        .update({ view_count: (product.view_count || 0) + 1 })
        .eq("id", productId);
    }
  }
}

// =====================================================
// ADMIN/MODERATION HELPERS
// =====================================================

export async function approveProduct(
  supabase: Client,
  productId: string,
  reviewerId: string
) {
  const { data, error } = await supabase
    .from("products")
    .update({
      status: "approved" as ProductStatus,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function rejectProduct(
  supabase: Client,
  productId: string,
  reviewerId: string,
  reason?: string
) {
  const { data, error } = await supabase
    .from("products")
    .update({
      status: "rejected" as ProductStatus,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function toggleFeatured(
  supabase: Client,
  productId: string,
  featured: boolean,
  reviewerId: string
) {
  const { data, error } = await supabase
    .from("products")
    .update({
      featured,
      featured_at: featured ? new Date().toISOString() : null,
      reviewed_by: reviewerId,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function getAdminStats(supabase: Client): Promise<AdminStats> {
  const [products, pendingProducts, approvedProducts, rejectedProducts, featuredProducts, users, subscribers] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    ]);

  return {
    totalProducts: products.count || 0,
    pendingProducts: pendingProducts.count || 0,
    approvedProducts: approvedProducts.count || 0,
    rejectedProducts: rejectedProducts.count || 0,
    featuredProducts: featuredProducts.count || 0,
    totalUsers: users.count || 0,
    totalSubscribers: subscribers.count || 0,
  };
}

// =====================================================
// SUBMISSION HELPERS
// =====================================================

export async function getSubmissionHistory(
  supabase: Client,
  productId: string
): Promise<SubmissionWithRelations[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*, product:products(*), user:profiles!submissions_user_id_fkey(*), performer:profiles!submissions_performed_by_fkey(*)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as SubmissionWithRelations[];
}

export async function getUserSubmissions(
  supabase: Client,
  userId: string,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<SubmissionWithRelations>> {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("submissions")
    .select("*, product:products(*)", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: data as SubmissionWithRelations[],
    count: totalCount,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
}

// =====================================================
// NEWSLETTER HELPERS
// =====================================================

export async function subscribeToNewsletter(
  supabase: Client,
  email: string,
  name?: string,
  source = "website"
) {
  const confirmationToken = crypto.randomUUID();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: email.toLowerCase().trim(),
      name,
      source,
      confirmation_token: confirmationToken,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique violation - already subscribed
      throw new Error("This email is already subscribed");
    }
    throw error;
  }

  return { subscriber: data as NewsletterSubscriber, confirmationToken };
}

export async function confirmNewsletterSubscription(
  supabase: Client,
  token: string
) {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
    })
    .eq("confirmation_token", token)
    .select()
    .single();

  if (error) throw error;
  return data as NewsletterSubscriber;
}

export async function unsubscribeFromNewsletter(supabase: Client, email: string) {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      unsubscribed: true,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase().trim())
    .select()
    .single();

  if (error) throw error;
  return data as NewsletterSubscriber;
}

export async function getNewsletterSubscribers(
  supabase: Client,
  options?: {
    confirmedOnly?: boolean;
    pagination?: PaginationOptions;
  }
): Promise<PaginatedResponse<NewsletterSubscriber>> {
  const { confirmedOnly = true, pagination } = options || {};
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 50;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .eq("unsubscribed", false);

  if (confirmedOnly) {
    query = query.eq("confirmed", true);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: data as NewsletterSubscriber[],
    count: totalCount,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
}

// =====================================================
// STORAGE HELPERS
// =====================================================

export async function uploadProductImage(
  supabase: Client,
  file: File,
  userId: string,
  type: "logo" | "screenshot"
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${type}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function deleteProductImage(supabase: Client, imageUrl: string) {
  // Extract path from URL
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split("/storage/v1/object/public/products/");
  if (pathParts.length !== 2) return;

  const filePath = pathParts[1];
  await supabase.storage.from("products").remove([filePath]);
}

// =====================================================
// UTILITY HELPERS
// =====================================================

export async function generateSlug(
  supabase: Client,
  name: string,
  table: "products" | "categories"
): Promise<string> {
  // Convert to lowercase and replace spaces/special chars with hyphens
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const { data } = await supabase
      .from(table)
      .select("id")
      .eq("slug", slug)
      .single();

    if (!data) break;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export async function searchProducts(
  supabase: Client,
  query: string,
  limit = 10
): Promise<ProductWithRelations[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)")
    .eq("status", "approved")
    .or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
    .order("view_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ProductWithRelations[];
}
