import { prisma } from "@/lib/db/prisma";

export async function getCategories(includeInactive = false) {
  return prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

// Alias for getCategories
export const getAllCategories = () => getCategories(false);

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function getCategoriesWithProductCount() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
  });

  return categories.map((cat) => ({
    ...cat,
    productCount: cat._count.products,
  }));
}
