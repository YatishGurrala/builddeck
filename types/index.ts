// =====================================================
// Database Enums (uppercase to match Prisma)
// =====================================================
export type UserRole = "USER" | "ADMIN";
export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SubmissionAction = "SUBMITTED" | "APPROVED" | "REJECTED" | "RESUBMITTED" | "FEATURED" | "UNFEATURED";

// =====================================================
// Database Tables (camelCase to match Prisma)
// =====================================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  password?: string;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string | null;
  websiteUrl: string;
  logoUrl: string | null;
  screenshots: string;
  
  // Status & Features
  status: ProductStatus;
  featured: boolean;
  featuredAt: Date | null;
  
  // Metrics
  viewCount: number;
  upvoteCount: number;
  
  // Moderation
  rejectionReason: string | null;
  reviewedAt: Date | null;
  
  // Relations
  userId: string;
  categoryId: string | null;
  reviewedById: string | null;
  
  // Timestamps
  submittedAt: Date;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Joined relations (optional)
  user?: User;
  category?: Category | null;
  reviewedBy?: User | null;
}

export interface Submission {
  id: string;
  action: string;
  previousStatus: string | null;
  newStatus: string | null;
  notes: string | null;
  productId: string;
  userId: string;
  performedById: string | null;
  createdAt: Date;
  
  // Joined relations
  product?: Product;
  user?: User;
  performedBy?: User | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  confirmed: boolean;
  confirmationToken: string | null;
  confirmedAt: Date | null;
  unsubscribed: boolean;
  unsubscribedAt: Date | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// Joined/Extended Types
// =====================================================

// ProductWithRelations is same as Product since relations are already defined
export type ProductWithRelations = Product;

// SubmissionWithRelations is same as Submission since relations are already defined
export type SubmissionWithRelations = Submission;

// =====================================================
// Form Data Types
// =====================================================

export interface ProductFormData {
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  category_id: string;
  logo?: File;
  screenshots?: File[];
}

export interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  website: string;
  twitter_handle: string;
  avatar?: File;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

// =====================================================
// API Response Types
// =====================================================

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// =====================================================
// Query/Filter Types
// =====================================================

export interface ProductFilters {
  status?: ProductStatus;
  category_id?: string;
  featured?: boolean;
  user_id?: string;
  search?: string;
}

export interface ProductSortOptions {
  field: "created_at" | "updated_at" | "view_count" | "upvote_count" | "name";
  direction: "asc" | "desc";
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

// =====================================================
// Admin Types
// =====================================================

export interface AdminStats {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;
  featuredProducts: number;
  totalUsers: number;
  totalSubscribers: number;
}

export interface ModerateProductInput {
  productId: string;
  action: "approve" | "reject" | "feature" | "unfeature";
  rejectionReason?: string;
}
