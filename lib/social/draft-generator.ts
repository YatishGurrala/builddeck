import { SocialPlatform } from "./types";

interface ProductData {
  name: string;
  tagline: string;
  description?: string | null;
  websiteUrl: string;
  category?: { name: string } | null;
}

/**
 * Generate social media post drafts for a product
 */
export function generateDrafts(product: ProductData): { platform: SocialPlatform; content: string }[] {
  return [
    { platform: "X", content: generateXDraft(product) },
    { platform: "LINKEDIN", content: generateLinkedInDraft(product) },
  ];
}

/**
 * Generate X (Twitter) post draft
 * Character limit: 280
 */
function generateXDraft(product: ProductData): string {
  const { name, tagline, websiteUrl, category } = product;
  
  // Build hashtags from category
  const hashtags = [];
  if (category?.name) {
    // Convert category name to hashtag format
    const categoryHashtag = category.name
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    hashtags.push(`#${categoryHashtag}`);
  }
  hashtags.push("#BuildDeck", "#IndieHacker", "#Startup");
  
  // Build the post
  const parts = [
    `🚀 New on BuildDeck: ${name}`,
    "",
    tagline,
    "",
    `Check it out 👉 ${websiteUrl}`,
    "",
    hashtags.slice(0, 4).join(" "), // Limit hashtags to fit
  ];
  
  let draft = parts.join("\n");
  
  // If too long, trim and adjust
  if (draft.length > 280) {
    // Try shorter version without full tagline
    const shortTagline = tagline.length > 80 
      ? tagline.substring(0, 77) + "..." 
      : tagline;
    
    draft = [
      `🚀 New on BuildDeck: ${name}`,
      "",
      shortTagline,
      "",
      websiteUrl,
    ].join("\n");
  }
  
  // Final trim if still too long
  if (draft.length > 280) {
    draft = draft.substring(0, 277) + "...";
  }
  
  return draft;
}

/**
 * Generate LinkedIn post draft
 * Character limit: 3000 (we'll aim for ~500-800 for engagement)
 */
function generateLinkedInDraft(product: ProductData): string {
  const { name, tagline, description, websiteUrl, category } = product;
  
  // Build a more professional, longer-form post for LinkedIn
  const parts = [
    `🎉 Excited to feature ${name} on BuildDeck!`,
    "",
    `💡 ${tagline}`,
    "",
  ];
  
  // Add description if available (truncated if needed)
  if (description) {
    const shortDesc = description.length > 300 
      ? description.substring(0, 297) + "..." 
      : description;
    parts.push(shortDesc);
    parts.push("");
  }
  
  // Add category context
  if (category?.name) {
    parts.push(`📁 Category: ${category.name}`);
    parts.push("");
  }
  
  // Call to action
  parts.push(`🔗 Discover more: ${websiteUrl}`);
  parts.push("");
  
  // Hashtags (LinkedIn style)
  parts.push("#BuildDeck #IndieHacker #Startup #TechStartup #ProductLaunch");
  
  // Add a note about BuildDeck
  parts.push("");
  parts.push("---");
  parts.push("BuildDeck is a platform for discovering and sharing innovative products from indie makers and startups.");
  
  return parts.join("\n");
}

/**
 * Validate content for a specific platform
 */
export function validateContent(platform: SocialPlatform, content: string): { valid: boolean; error?: string } {
  const limits: Record<SocialPlatform, number> = {
    X: 280,
    LINKEDIN: 3000,
  };
  
  const limit = limits[platform];
  
  if (content.length === 0) {
    return { valid: false, error: "Content cannot be empty" };
  }
  
  if (content.length > limit) {
    return { 
      valid: false, 
      error: `Content exceeds ${limit} character limit (${content.length}/${limit})` 
    };
  }
  
  return { valid: true };
}
