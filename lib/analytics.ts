/**
 * Analytics Module
 * 
 * Centralized analytics tracking for the BuildDeck application.
 * Provides type-safe tracking methods for various user actions.
 */

// Event types for type-safe tracking
export type AnalyticsEvent =
  // Product events
  | { name: 'product_view'; properties: { productId: string; productName: string; slug: string } }
  | { name: 'product_submit'; properties: { productName: string; categoryId?: string } }
  | { name: 'product_approved'; properties: { productId: string; productName: string } }
  | { name: 'product_rejected'; properties: { productId: string; productName: string } }
  | { name: 'product_featured'; properties: { productId: string; productName: string } }
  | { name: 'product_visit_site'; properties: { productId: string; productName: string; websiteUrl: string } }
  
  // User events  
  | { name: 'user_signup'; properties: { method: 'credentials' } }
  | { name: 'user_login'; properties: { method: 'credentials' } }
  | { name: 'user_logout'; properties: Record<string, never> }
  
  // Newsletter events
  | { name: 'newsletter_subscribe'; properties: { source: string } }
  | { name: 'newsletter_unsubscribe'; properties: { email?: string } }
  
  // Social events
  | { name: 'social_post_created'; properties: { platform: 'X' | 'LINKEDIN'; productId: string } }
  | { name: 'social_post_published'; properties: { platform: 'X' | 'LINKEDIN'; productId: string; postId?: string } }
  | { name: 'social_post_failed'; properties: { platform: 'X' | 'LINKEDIN'; productId: string; error: string } }
  
  // Search/Filter events
  | { name: 'search'; properties: { query: string; resultsCount: number } }
  | { name: 'category_filter'; properties: { categoryId: string; categoryName: string } }
  
  // Page events
  | { name: 'page_view'; properties: { path: string; title?: string } }
  | { name: 'cta_click'; properties: { ctaName: string; location: string } };

/**
 * Track an analytics event
 * In development, logs to console. In production, sends to analytics provider.
 */
export function trackEvent<T extends AnalyticsEvent>(event: T): void {
  if (typeof window === 'undefined') {
    // Server-side tracking (optional logging)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Server]', event.name, event.properties);
    }
    return;
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.name, event.properties);
  }

  // Production tracking via Vercel Analytics (if available)
  try {
    // @ts-expect-error - Vercel Analytics may add this globally
    if (typeof window.va === 'function') {
      // @ts-expect-error - Vercel Analytics
      window.va('event', {
        name: event.name,
        ...event.properties,
      });
    }
  } catch {
    // Silently fail if analytics not available
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent({
    name: 'page_view',
    properties: { path, title },
  });
}

// Convenience methods for common events
export const Analytics = {
  // Product tracking
  productView: (productId: string, productName: string, slug: string) =>
    trackEvent({ name: 'product_view', properties: { productId, productName, slug } }),

  productSubmit: (productName: string, categoryId?: string) =>
    trackEvent({ name: 'product_submit', properties: { productName, categoryId } }),

  productApproved: (productId: string, productName: string) =>
    trackEvent({ name: 'product_approved', properties: { productId, productName } }),

  productRejected: (productId: string, productName: string) =>
    trackEvent({ name: 'product_rejected', properties: { productId, productName } }),

  productFeatured: (productId: string, productName: string) =>
    trackEvent({ name: 'product_featured', properties: { productId, productName } }),

  productVisitSite: (productId: string, productName: string, websiteUrl: string) =>
    trackEvent({ name: 'product_visit_site', properties: { productId, productName, websiteUrl } }),

  // User tracking
  userSignup: () =>
    trackEvent({ name: 'user_signup', properties: { method: 'credentials' } }),

  userLogin: () =>
    trackEvent({ name: 'user_login', properties: { method: 'credentials' } }),

  userLogout: () =>
    trackEvent({ name: 'user_logout', properties: {} }),

  // Newsletter tracking
  newsletterSubscribe: (source: string = 'website') =>
    trackEvent({ name: 'newsletter_subscribe', properties: { source } }),

  newsletterUnsubscribe: (email?: string) =>
    trackEvent({ name: 'newsletter_unsubscribe', properties: { email } }),

  // Social tracking
  socialPostCreated: (platform: 'X' | 'LINKEDIN', productId: string) =>
    trackEvent({ name: 'social_post_created', properties: { platform, productId } }),

  socialPostPublished: (platform: 'X' | 'LINKEDIN', productId: string, postId?: string) =>
    trackEvent({ name: 'social_post_published', properties: { platform, productId, postId } }),

  socialPostFailed: (platform: 'X' | 'LINKEDIN', productId: string, error: string) =>
    trackEvent({ name: 'social_post_failed', properties: { platform, productId, error } }),

  // Search tracking
  search: (query: string, resultsCount: number) =>
    trackEvent({ name: 'search', properties: { query, resultsCount } }),

  categoryFilter: (categoryId: string, categoryName: string) =>
    trackEvent({ name: 'category_filter', properties: { categoryId, categoryName } }),

  // CTA tracking
  ctaClick: (ctaName: string, location: string) =>
    trackEvent({ name: 'cta_click', properties: { ctaName, location } }),
};

export default Analytics;
