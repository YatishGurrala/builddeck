import { getRecords, createRecord, getRecord } from "@/lib/buildstack/records";
import type { BsRecord } from "@/lib/buildstack/records";
import type { Category } from "@/types";

export interface CategoryData {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  isActive: boolean;
}

export type CategoryRecord = BsRecord<CategoryData>;

export function toCategory(r: CategoryRecord): Category {
  return {
    ...r.data,
    id: r.id,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  };
}

export async function getCategories(includeInactive = false): Promise<CategoryRecord[]> {
  const all = await getRecords<CategoryData>("categories");
  const active = includeInactive ? all : all.filter((r) => r.data.isActive);
  return active.sort((a, b) => a.data.displayOrder - b.data.displayOrder);
}

export const getAllCategories = () => getCategories(false);

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const all = await getRecords<CategoryData>("categories");
  return all.find((r) => r.data.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  return getRecord<CategoryData>(id);
}

export async function getCategoriesWithProductCount() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getRecords("products"),
  ]);
  return categories.map((cat) => ({
    ...toCategory(cat),
    productCount: products.filter(
      (p) =>
        (p.data as Record<string, unknown>).categoryId === cat.id &&
        (p.data as Record<string, unknown>).status === "APPROVED"
    ).length,
  }));
}
