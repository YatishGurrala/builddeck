import { getRecords, createRecord, updateRecord, deleteRecord, getRecord } from "@/lib/buildstack/records";
import type { BsRecord } from "@/lib/buildstack/records";
import type { Product, Category } from "@/types";

export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProductData {
  name: string;
  slug: string;
  tagline: string;
  description: string | null;
  websiteUrl: string;
  logoUrl: string | null;
  screenshots: string;
  status: ProductStatus;
  featured: boolean;
  featuredAt: string | null;
  viewCount: number;
  upvoteCount: number;
  rejectionReason: string | null;
  reviewedAt: string | null;
  userId: string;
  categoryId: string | null;
  reviewedById: string | null;
  submittedAt: string;
  approvedAt: string | null;
}

export type ProductRecord = BsRecord<ProductData>;

export interface ProductFilters {
  status?: ProductStatus;
  categoryId?: string;
  featured?: boolean;
  userId?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SortOptions {
  field?: "createdAt" | "viewCount" | "upvoteCount" | "name";
  direction?: "asc" | "desc";
}

/** Convert a Buildstack record to the app-wide Product type for UI compatibility. */
export function toProduct(
  r: ProductRecord,
  opts?: { category?: Category | null }
): Product {
  return {
    ...r.data,
    id: r.id,
    featuredAt: r.data.featuredAt ? new Date(r.data.featuredAt) : null,
    reviewedAt: r.data.reviewedAt ? new Date(r.data.reviewedAt) : null,
    submittedAt: new Date(r.data.submittedAt),
    approvedAt: r.data.approvedAt ? new Date(r.data.approvedAt) : null,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
    category: opts?.category ?? undefined,
  };
}

export async function getAllProducts(): Promise<ProductRecord[]> {
  return getRecords<ProductData>("products");
}

export async function getProducts(options?: {
  filters?: ProductFilters;
  pagination?: PaginationOptions;
  sort?: SortOptions;
}) {
  const { filters, pagination, sort } = options ?? {};
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 12;

  let all = await getRecords<ProductData>("products", filters?.userId);

  if (filters?.status) all = all.filter((r) => r.data.status === filters.status);
  if (filters?.categoryId) all = all.filter((r) => r.data.categoryId === filters.categoryId);
  if (filters?.featured !== undefined) all = all.filter((r) => r.data.featured === filters.featured);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    all = all.filter(
      (r) =>
        r.data.name.toLowerCase().includes(q) ||
        r.data.tagline.toLowerCase().includes(q) ||
        (r.data.description ?? "").toLowerCase().includes(q)
    );
  }

  const field = sort?.field ?? "createdAt";
  const dir = sort?.direction ?? "desc";
  all.sort((a, b) => {
    const av = field === "createdAt" ? a.createdAt : String(((a.data as unknown) as Record<string, unknown>)[field] ?? "");
    const bv = field === "createdAt" ? b.createdAt : String(((b.data as unknown) as Record<string, unknown>)[field] ?? "");
    return dir === "desc" ? bv.localeCompare(av) : av.localeCompare(bv);
  });

  const count = all.length;
  const data = all.slice((page - 1) * pageSize, page * pageSize);

  return {
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const all = await getRecords<ProductData>("products");
  return all.find((r) => r.data.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  return getRecord<ProductData>(id);
}

export async function getFeaturedProducts(limit = 6): Promise<ProductRecord[]> {
  const all = await getRecords<ProductData>("products");
  return all
    .filter((r) => r.data.status === "APPROVED" && r.data.featured)
    .sort((a, b) => (b.data.featuredAt ?? "").localeCompare(a.data.featuredAt ?? ""))
    .slice(0, limit);
}

export async function getLatestProducts(limit = 12): Promise<ProductRecord[]> {
  const all = await getRecords<ProductData>("products");
  return all
    .filter((r) => r.data.status === "APPROVED")
    .sort((a, b) => (b.data.approvedAt ?? "").localeCompare(a.data.approvedAt ?? ""))
    .slice(0, limit);
}

export async function searchProducts(query: string, limit = 10): Promise<ProductRecord[]> {
  const q = query.toLowerCase();
  const all = await getRecords<ProductData>("products");
  return all
    .filter(
      (r) =>
        r.data.status === "APPROVED" &&
        (r.data.name.toLowerCase().includes(q) ||
          r.data.tagline.toLowerCase().includes(q) ||
          (r.data.description ?? "").toLowerCase().includes(q))
    )
    .sort((a, b) => b.data.viewCount - a.data.viewCount)
    .slice(0, limit);
}

export async function incrementViewCount(productId: string): Promise<void> {
  const record = await getRecord<ProductData>(productId);
  if (!record) return;
  await updateRecord(productId, { viewCount: record.data.viewCount + 1 });
}

export async function getAdminStats() {
  const all = await getRecords<ProductData>("products");
  return {
    totalProducts: all.length,
    pendingProducts: all.filter((r) => r.data.status === "PENDING").length,
    approvedProducts: all.filter((r) => r.data.status === "APPROVED").length,
    rejectedProducts: all.filter((r) => r.data.status === "REJECTED").length,
    featuredProducts: all.filter((r) => r.data.featured).length,
    totalUsers: 0,
    totalSubscribers: (await getRecords("newsletter_subscribers")).length,
  };
}

export async function bsCreateProduct(data: ProductData): Promise<ProductRecord> {
  return createRecord<ProductData>("products", data.userId, data);
}

export async function bsUpdateProduct(id: string, data: Partial<ProductData>): Promise<ProductRecord> {
  return updateRecord<ProductData>(id, data);
}

export async function bsDeleteProduct(id: string): Promise<void> {
  return deleteRecord(id);
}
