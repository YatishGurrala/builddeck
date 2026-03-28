// =====================================================
// Database Enums
// =====================================================
export type UserRole = "user" | "admin";
export type ProductStatus = "pending" | "approved" | "rejected";
export type SubmissionAction = "submitted" | "approved" | "rejected" | "resubmitted" | "featured" | "unfeatured";

// =====================================================
// Database Tables
// =====================================================

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  twitter_handle: string | null;
  role: UserRole;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string | null;
  website_url: string;
  logo_url: string | null;
  screenshots: string[];
  
  // Relationships
  category_id: string | null;
  user_id: string;
  
  // Status & Features
  status: ProductStatus;
  featured: boolean;
  featured_at: string | null;
  
  // Metrics
  view_count: number;
  upvote_count: number;
  
  // Moderation
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  
  // Timestamps
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  product_id: string;
  user_id: string;
  action: SubmissionAction;
  previous_status: ProductStatus | null;
  new_status: ProductStatus | null;
  notes: string | null;
  performed_by: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  confirmed: boolean;
  confirmation_token: string | null;
  confirmed_at: string | null;
  unsubscribed: boolean;
  unsubscribed_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Joined/Extended Types
// =====================================================

export interface ProductWithRelations extends Product {
  category?: Category | null;
  profile?: Profile | null;
}

export interface SubmissionWithRelations extends Submission {
  product?: Product | null;
  user?: Profile | null;
  performer?: Profile | null;
}

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

// =====================================================
// Supabase Database Types (for type-safe queries)
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at" | "product_count"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          product_count?: number;
        };
        Update: Partial<Omit<Category, "id">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at" | "view_count" | "upvote_count"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          upvote_count?: number;
        };
        Update: Partial<Omit<Product, "id">>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Submission, "id">>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<NewsletterSubscriber, "id">>;
      };
    };
    Enums: {
      user_role: UserRole;
      product_status: ProductStatus;
      submission_action: SubmissionAction;
    };
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
      generate_unique_slug: {
        Args: { base_name: string; table_name: string };
        Returns: string;
      };
    };
  };
}
