// Social Publishing Types

export type SocialPlatform = "X" | "LINKEDIN";

export type SocialPostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";

export interface SocialPostDraft {
  platform: SocialPlatform;
  content: string;
  productId: string;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface SocialProvider {
  platform: SocialPlatform;
  
  /**
   * Publish content to the social platform
   */
  publish(content: string): Promise<PublishResult>;
  
  /**
   * Check if the provider is configured and ready
   */
  isConfigured(): boolean;
  
  /**
   * Get the character limit for this platform
   */
  getCharacterLimit(): number;
}

// Database model type
export interface SocialPost {
  id: string;
  platform: string;
  status: string;
  content: string;
  publishedAt: Date | null;
  publishedId: string | null;
  errorMessage: string | null;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
