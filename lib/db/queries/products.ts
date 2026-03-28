import { prisma } from "@/lib/db/prisma";

export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

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

const productInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      avatarUrl: true,
    },
  },
  category: true,
};

export async function getProducts(options?: {
  filters?: ProductFilters;
  pagination?: PaginationOptions;
  sort?: SortOptions;
}) {
  const { filters, pagination, sort } = options || {};
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 12;
  const skip = (page - 1) * pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }
  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters?.featured !== undefined) {
    where.featured = filters.featured;
  }
  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { tagline: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [products, count] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { [sort?.field || "createdAt"]: sort?.direction || "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: {
      status: "APPROVED",
      featured: true,
    },
    include: productInclude,
    orderBy: { featuredAt: "desc" },
    take: limit,
  });
}

export async function getLatestProducts(limit = 12) {
  return prisma.product.findMany({
    where: { status: "APPROVED" },
    include: productInclude,
    orderBy: { approvedAt: "desc" },
    take: limit,
  });
}

export async function getProductsByCategory(categorySlug: string, pagination?: PaginationOptions) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) return null;

  return getProducts({
    filters: { categoryId: category.id, status: "APPROVED" },
    pagination,
  });
}

export async function getUserProducts(userId: string, pagination?: PaginationOptions) {
  return getProducts({
    filters: { userId },
    pagination,
    sort: { field: "createdAt", direction: "desc" },
  });
}

export async function getProductsByUser(userId: string) {
  return prisma.product.findMany({
    where: { userId },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function searchProducts(query: string, limit = 10) {
  return prisma.product.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { name: { contains: query } },
        { tagline: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: productInclude,
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function incrementViewCount(productId: string) {
  return prisma.product.update({
    where: { id: productId },
    data: { viewCount: { increment: 1 } },
  });
}

// Admin functions
export async function getAdminStats() {
  const [
    totalProducts,
    pendingProducts,
    approvedProducts,
    rejectedProducts,
    featuredProducts,
    totalUsers,
    totalSubscribers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { status: "APPROVED" } }),
    prisma.product.count({ where: { status: "REJECTED" } }),
    prisma.product.count({ where: { featured: true } }),
    prisma.user.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  return {
    totalProducts,
    pendingProducts,
    approvedProducts,
    rejectedProducts,
    featuredProducts,
    totalUsers,
    totalSubscribers,
  };
}
