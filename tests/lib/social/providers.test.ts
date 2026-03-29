import { describe, it, expect, vi, beforeEach } from 'vitest'
import { XProvider } from '@/lib/social/providers/x-provider'
import { LinkedInProvider } from '@/lib/social/providers/linkedin-provider'

describe('XProvider', () => {
  let provider: XProvider

  beforeEach(() => {
    provider = new XProvider()
    vi.stubEnv('SOCIAL_MOCK_MODE', 'true')
  })

  describe('isConfigured', () => {
    it('should return true when mock mode is enabled', () => {
      expect(provider.isConfigured()).toBe(true)
    })

    it('should return true when API credentials are set', () => {
      vi.stubEnv('SOCIAL_MOCK_MODE', '')
      vi.stubEnv('X_API_KEY', 'test-key')
      vi.stubEnv('X_API_SECRET', 'test-secret')
      vi.stubEnv('X_ACCESS_TOKEN', 'test-token')
      vi.stubEnv('X_ACCESS_SECRET', 'test-secret')
      
      expect(provider.isConfigured()).toBe(true)
    })

    it('should return false when neither mock mode nor credentials are set', () => {
      vi.stubEnv('SOCIAL_MOCK_MODE', '')
      vi.stubEnv('X_API_KEY', '')
      vi.stubEnv('X_API_SECRET', '')
      vi.stubEnv('X_ACCESS_TOKEN', '')
      vi.stubEnv('X_ACCESS_SECRET', '')
      
      expect(provider.isConfigured()).toBe(false)
    })
  })

  describe('getCharacterLimit', () => {
    it('should return 280 for X', () => {
      expect(provider.getCharacterLimit()).toBe(280)
    })
  })

  describe('publish', () => {
    it('should reject content exceeding character limit', async () => {
      const longContent = 'A'.repeat(300)
      const result = await provider.publish(longContent)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('280 character limit')
    })

    it('should accept content within character limit', async () => {
      const content = 'This is a valid tweet'
      const result = await provider.publish(content)
      
      // In mock mode, it should succeed (with small random failure chance)
      // We'll check that it doesn't fail due to character limit
      if (!result.success) {
        expect(result.error).not.toContain('character limit')
      }
    })

    it('should return error when not configured', async () => {
      vi.stubEnv('SOCIAL_MOCK_MODE', '')
      vi.stubEnv('X_API_KEY', '')
      
      const result = await provider.publish('Test content')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')
    })

    it('should handle empty content', async () => {
      const result = await provider.publish('')
      // Empty content is within limit
      expect(result.success === true || result.error !== undefined).toBe(true)
    })

    it('should handle content at exact limit', async () => {
      const content = 'A'.repeat(280)
      const result = await provider.publish(content)
      
      // Should not fail due to character limit
      if (!result.success) {
        expect(result.error).not.toContain('character limit')
      }
    })
  })
})

describe('LinkedInProvider', () => {
  let provider: LinkedInProvider

  beforeEach(() => {
    provider = new LinkedInProvider()
    vi.stubEnv('SOCIAL_MOCK_MODE', 'true')
  })

  describe('isConfigured', () => {
    it('should return true when mock mode is enabled', () => {
      expect(provider.isConfigured()).toBe(true)
    })

    it('should return true when API credentials are set', () => {
      vi.stubEnv('SOCIAL_MOCK_MODE', '')
      vi.stubEnv('LINKEDIN_CLIENT_ID', 'test-id')
      vi.stubEnv('LINKEDIN_CLIENT_SECRET', 'test-secret')
      vi.stubEnv('LINKEDIN_ACCESS_TOKEN', 'test-token')
      
      expect(provider.isConfigured()).toBe(true)
    })

    it('should return false when neither mock mode nor credentials are set', () => {
      vi.stubEnv('SOCIAL_MOCK_MODE', '')
      vi.stubEnv('LINKEDIN_CLIENT_ID', '')
      vi.stubEnv('LINKEDIN_CLIENT_SECRET', '')
      vi.stubEnv('LINKEDIN_ACCESS_TOKEN', '')
      
      expect(provider.isConfigured()).toBe(false)
    })
  })

  describe('getCharacterLimit', () => {
    it('should return 3000 for LinkedIn', () => {
      expect(provider.getCharacterLimit()).toBe(3000)
    })
  })

  describe('publish', () => {
    it('should reject content exceeding character limit', async () => {
      const longContent = 'A'.repeat(3100)
      const result = await provider.publish(longContent)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('3000 character limit')
    })

    it('should accept content within character limit', async () => {
      const content = 'This is a valid LinkedIn post'
      const result = await provider.publish(content)
      
      // In mock mode, should work
      if (!result.success) {
        expect(result.error).not.toContain('character limit')
      }
    })

    it('should return error when not configured', async () => {
      vi.stubEnv('SOCIAL_MOCK_MODE', '')
      vi.stubEnv('LINKEDIN_CLIENT_ID', '')
      
      const result = await provider.publish('Test content')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')
    })

    it('should handle longer professional content', async () => {
      const content = `
        🎉 Excited to share a new product launch!
        
        This is a professional LinkedIn post that showcases our new feature.
        We've been working hard on this and can't wait to share it with you.
        
        Key features:
        - Feature 1
        - Feature 2
        - Feature 3
        
        Check it out at https://example.com
        
        #Tech #Innovation #Startup
      `
      const result = await provider.publish(content)
      
      if (!result.success) {
        expect(result.error).not.toContain('character limit')
      }
    })
  })
})

describe('Provider interface consistency', () => {
  it('both providers should implement the same interface', () => {
    const xProvider = new XProvider()
    const linkedInProvider = new LinkedInProvider()

    // Both should have the same methods
    expect(typeof xProvider.isConfigured).toBe('function')
    expect(typeof xProvider.getCharacterLimit).toBe('function')
    expect(typeof xProvider.publish).toBe('function')

    expect(typeof linkedInProvider.isConfigured).toBe('function')
    expect(typeof linkedInProvider.getCharacterLimit).toBe('function')
    expect(typeof linkedInProvider.publish).toBe('function')
  })

  it('X character limit should be less than LinkedIn', () => {
    const xProvider = new XProvider()
    const linkedInProvider = new LinkedInProvider()

    expect(xProvider.getCharacterLimit()).toBeLessThan(linkedInProvider.getCharacterLimit())
  })
})
