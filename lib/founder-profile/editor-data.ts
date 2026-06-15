export type CreatorBlockType =
  | "hero"
  | "social-links"
  | "newsletter"
  | "digital-product"
  | "featured-content"
  | "video-embed"
  | "resources"
  | "testimonial"
  | "current-project";

export interface CreatorPageBlock {
  id: string;
  type: CreatorBlockType;
  title: string;
  description: string;
  position: number;
  isActive: boolean;
}

export interface CreatorBlockTemplate {
  type: CreatorBlockType;
  title: string;
  description: string;
  category: "identity" | "conversion" | "content";
}

export interface CreatorThemeOption {
  id: string;
  label: string;
  subtitle: string;
  isAvailable: boolean;
}

const BLOCK_TEMPLATES: CreatorBlockTemplate[] = [
  {
    type: "hero",
    title: "Hero Block",
    description: "High-impact intro with avatar, thesis, and key social proof.",
    category: "identity",
  },
  {
    type: "social-links",
    title: "Social Links",
    description: "Icon and text links to your broader creator footprint.",
    category: "identity",
  },
  {
    type: "newsletter",
    title: "Newsletter",
    description: "Email capture block for recurring updates and offers.",
    category: "conversion",
  },
  {
    type: "digital-product",
    title: "Currently Building",
    description: "Show your active products in clean rectangular cards.",
    category: "conversion",
  },
  {
    type: "featured-content",
    title: "Featured Content",
    description: "Large spotlight card for your most important post or video.",
    category: "content",
  },
  {
    type: "video-embed",
    title: "Video Embed",
    description: "Responsive media block for YouTube and Vimeo embeds.",
    category: "content",
  },
  {
    type: "resources",
    title: "Resources",
    description: "Structured link list for playbooks, tools, and references.",
    category: "content",
  },
  {
    type: "testimonial",
    title: "Testimonial",
    description: "Social proof quote card with attribution and role.",
    category: "conversion",
  },
  {
    type: "current-project",
    title: "Current Project",
    description: "Large focus card highlighting what you are building now.",
    category: "identity",
  },
];

const DEFAULT_PAGE_BLOCKS: CreatorPageBlock[] = [
  {
    id: "blk_hero",
    type: "hero",
    title: "Hero Block",
    description: "Profile intro, avatar, and positioning statement.",
    position: 1,
    isActive: true,
  },
  {
    id: "blk_social",
    type: "social-links",
    title: "Social Links",
    description: "Outbound links to your social platforms.",
    position: 2,
    isActive: true,
  },
  {
    id: "blk_newsletter",
    type: "newsletter",
    title: "Newsletter",
    description: "Lead capture module with a clear CTA.",
    position: 3,
    isActive: true,
  },
  {
    id: "blk_current_project",
    type: "current-project",
    title: "Current Project",
    description: "Highlight what you are currently building.",
    position: 4,
    isActive: true,
  },
  {
    id: "blk_featured",
    type: "featured-content",
    title: "Featured Content",
    description: "One highlighted content piece for discovery.",
    position: 5,
    isActive: false,
  },
];

const DEFAULT_THEME_OPTIONS: CreatorThemeOption[] = [
  { id: "founder-gradient", label: "Founder", subtitle: "SaaS Preview", isAvailable: true },
  { id: "minimal-light", label: "Minimal", subtitle: "Portfolio Preview", isAvailable: true },
  { id: "minimal-dark", label: "Creator", subtitle: "Link-in-Bio Preview", isAvailable: true },
  { id: "hacker", label: "Hacker", subtitle: "Tech Preview", isAvailable: false },
  { id: "startup", label: "Startup", subtitle: "Growth Preview", isAvailable: false },
  { id: "premium", label: "Premium", subtitle: "Luxe Preview", isAvailable: false },
];

export function getMockCreatorPageBlocks(): CreatorPageBlock[] {
  return [...DEFAULT_PAGE_BLOCKS].sort((a, b) => a.position - b.position);
}

export function getCreatorBlockTemplates(): CreatorBlockTemplate[] {
  return BLOCK_TEMPLATES;
}

export function getCreatorThemeOptions(): CreatorThemeOption[] {
  return DEFAULT_THEME_OPTIONS;
}
