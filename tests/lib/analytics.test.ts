import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'

// Store original values
const originalWindow = global.window
const originalEnv = process.env.NODE_ENV

describe('Analytics Module', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>
  
  // Import module dynamically after setting up environment
  let trackEvent: typeof import('@/lib/analytics').trackEvent
  let trackPageView: typeof import('@/lib/analytics').trackPageView
  let Analytics: typeof import('@/lib/analytics').Analytics

  beforeAll(async () => {
    // Set NODE_ENV to development for logging
    process.env.NODE_ENV = 'development'
    
    // Dynamically import to get fresh module with correct env
    const module = await import('@/lib/analytics')
    trackEvent = module.trackEvent
    trackPageView = module.trackPageView
    Analytics = module.Analytics
  })

  afterAll(() => {
    process.env.NODE_ENV = originalEnv
  })

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    // Restore original window
    global.window = originalWindow
  })

  describe('trackEvent', () => {
    it('should log events in development', () => {
      // Simulate browser environment
      global.window = {} as Window & typeof globalThis

      trackEvent({
        name: 'product_view',
        properties: { productId: 'prod-1', productName: 'Test', slug: 'test' },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        'product_view',
        { productId: 'prod-1', productName: 'Test', slug: 'test' }
      )
    })

    it('should handle server-side execution', () => {
      // @ts-expect-error - simulating server
      global.window = undefined

      trackEvent({
        name: 'product_view',
        properties: { productId: 'prod-1', productName: 'Test', slug: 'test' },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics Server]',
        'product_view',
        { productId: 'prod-1', productName: 'Test', slug: 'test' }
      )
    })

    it('should call Vercel Analytics when available', () => {
      const mockVa = vi.fn()
      // @ts-expect-error - mock window.va
      global.window = { va: mockVa }

      trackEvent({
        name: 'user_login',
        properties: { method: 'credentials' },
      })

      expect(mockVa).toHaveBeenCalledWith('event', {
        name: 'user_login',
        method: 'credentials',
      })
    })

    it('should not throw when Vercel Analytics is unavailable', () => {
      global.window = {} as Window & typeof globalThis

      expect(() => {
        trackEvent({
          name: 'user_login',
          properties: { method: 'credentials' },
        })
      }).not.toThrow()
    })
  })

  describe('trackPageView', () => {
    beforeEach(() => {
      global.window = {} as Window & typeof globalThis
    })

    it('should track page views', () => {
      trackPageView('/products', 'Products Page')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        'page_view',
        { path: '/products', title: 'Products Page' }
      )
    })

    it('should handle missing title', () => {
      trackPageView('/products')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        'page_view',
        { path: '/products', title: undefined }
      )
    })
  })

  describe('Analytics convenience methods', () => {
    beforeEach(() => {
      global.window = {} as Window & typeof globalThis
    })
    describe('Product tracking', () => {
      it('should track product view', () => {
        Analytics.productView('prod-1', 'Test Product', 'test-product')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'product_view',
          { productId: 'prod-1', productName: 'Test Product', slug: 'test-product' }
        )
      })

      it('should track product submit', () => {
        Analytics.productSubmit('New Product', 'cat-1')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'product_submit',
          { productName: 'New Product', categoryId: 'cat-1' }
        )
      })

      it('should track product approved', () => {
        Analytics.productApproved('prod-1', 'Test Product')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'product_approved',
          { productId: 'prod-1', productName: 'Test Product' }
        )
      })

      it('should track product rejected', () => {
        Analytics.productRejected('prod-1', 'Test Product')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'product_rejected',
          { productId: 'prod-1', productName: 'Test Product' }
        )
      })

      it('should track product featured', () => {
        Analytics.productFeatured('prod-1', 'Test Product')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'product_featured',
          { productId: 'prod-1', productName: 'Test Product' }
        )
      })

      it('should track visit site', () => {
        Analytics.productVisitSite('prod-1', 'Test', 'https://example.com')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'product_visit_site',
          { productId: 'prod-1', productName: 'Test', websiteUrl: 'https://example.com' }
        )
      })
    })

    describe('User tracking', () => {
      it('should track signup', () => {
        Analytics.userSignup()

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'user_signup',
          { method: 'credentials' }
        )
      })

      it('should track login', () => {
        Analytics.userLogin()

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'user_login',
          { method: 'credentials' }
        )
      })

      it('should track logout', () => {
        Analytics.userLogout()

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'user_logout',
          {}
        )
      })
    })

    describe('Newsletter tracking', () => {
      it('should track subscribe with default source', () => {
        Analytics.newsletterSubscribe()

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'newsletter_subscribe',
          { source: 'website' }
        )
      })

      it('should track subscribe with custom source', () => {
        Analytics.newsletterSubscribe('footer')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'newsletter_subscribe',
          { source: 'footer' }
        )
      })

      it('should track unsubscribe', () => {
        Analytics.newsletterUnsubscribe('test@example.com')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'newsletter_unsubscribe',
          { email: 'test@example.com' }
        )
      })
    })

    describe('Social tracking', () => {
      it('should track post created', () => {
        Analytics.socialPostCreated('X', 'prod-1')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'social_post_created',
          { platform: 'X', productId: 'prod-1' }
        )
      })

      it('should track post published', () => {
        Analytics.socialPostPublished('LINKEDIN', 'prod-1', 'ext-123')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'social_post_published',
          { platform: 'LINKEDIN', productId: 'prod-1', postId: 'ext-123' }
        )
      })

      it('should track post failed', () => {
        Analytics.socialPostFailed('X', 'prod-1', 'Rate limited')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'social_post_failed',
          { platform: 'X', productId: 'prod-1', error: 'Rate limited' }
        )
      })
    })

    describe('Search tracking', () => {
      it('should track search', () => {
        Analytics.search('testing tools', 15)

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'search',
          { query: 'testing tools', resultsCount: 15 }
        )
      })

      it('should track category filter', () => {
        Analytics.categoryFilter('cat-1', 'Developer Tools')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'category_filter',
          { categoryId: 'cat-1', categoryName: 'Developer Tools' }
        )
      })
    })

    describe('CTA tracking', () => {
      it('should track CTA clicks', () => {
        Analytics.ctaClick('Submit Product', 'homepage-hero')

        expect(consoleSpy).toHaveBeenCalledWith(
          '[Analytics]',
          'cta_click',
          { ctaName: 'Submit Product', location: 'homepage-hero' }
        )
      })
    })
  })
})
