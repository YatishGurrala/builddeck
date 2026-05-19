import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies - use vi.hoisted to ensure they exist before vi.mock runs
const { mockPrisma, mockSendNewsletterConfirmation, mockSyncMakerDigestContact, mockIsReachWelcomeManaged } = vi.hoisted(() => ({
  mockPrisma: {
    newsletterSubscriber: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  mockSendNewsletterConfirmation: vi.fn(),
  mockSyncMakerDigestContact: vi.fn(),
  mockIsReachWelcomeManaged: vi.fn(),
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

vi.mock('@/lib/resend', () => ({
  sendNewsletterConfirmation: (...args: unknown[]) => mockSendNewsletterConfirmation(...args),
}))

vi.mock('@/lib/hostinger-reach', () => ({
  syncMakerDigestContact: (...args: unknown[]) => mockSyncMakerDigestContact(...args),
  isReachWelcomeManaged: () => mockIsReachWelcomeManaged(),
}))

// Import after mocking
import { subscribeToNewsletter } from '@/actions/newsletter'

describe('Newsletter Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSyncMakerDigestContact.mockResolvedValue({ success: true, skipped: false })
    mockIsReachWelcomeManaged.mockReturnValue(false)
  })

  describe('subscribeToNewsletter', () => {
    it('should validate email format', async () => {
      const result = await subscribeToNewsletter('invalid-email')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid email')
    })

    it('should reject empty email', async () => {
      const result = await subscribeToNewsletter('')

      expect(result.success).toBe(false)
    })

    it('should check for existing subscriber', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue({
        id: 'existing-sub',
        email: 'existing@example.com',
      })

      const result = await subscribeToNewsletter('existing@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe("You're already subscribed!")
    })

    it('should create new subscriber with valid email', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'new@example.com',
      })
      mockSendNewsletterConfirmation.mockResolvedValue({})

      const result = await subscribeToNewsletter('new@example.com')

      expect(result.success).toBe(true)
      expect(mockPrisma.newsletterSubscriber.create).toHaveBeenCalledWith({
        data: { email: 'new@example.com' },
      })
      expect(mockSyncMakerDigestContact).toHaveBeenCalledWith('new@example.com')
    })

    it('should send confirmation email after subscription', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'new@example.com',
      })
      mockSendNewsletterConfirmation.mockResolvedValue({})

      await subscribeToNewsletter('new@example.com')

      expect(mockSendNewsletterConfirmation).toHaveBeenCalledWith('new@example.com')
    })

    it('should not send SMTP welcome when Reach manages welcome flow', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'new@example.com',
      })
      mockIsReachWelcomeManaged.mockReturnValue(true)

      const result = await subscribeToNewsletter('new@example.com')

      expect(result.success).toBe(true)
      expect(mockSendNewsletterConfirmation).not.toHaveBeenCalled()
    })

    it('should return error when Reach sync fails', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockSyncMakerDigestContact.mockResolvedValue({
        success: false,
        skipped: false,
        error: 'Reach API failed',
      })

      const result = await subscribeToNewsletter('new@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Reach API failed')
      expect(mockPrisma.newsletterSubscriber.create).not.toHaveBeenCalled()
    })

    it('should return error on database failure', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockRejectedValue(new Error('Database error'))

      const result = await subscribeToNewsletter('new@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to subscribe. Please try again.')
    })

    it('should return error on email sending failure', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'new@example.com',
      })
      mockSendNewsletterConfirmation.mockRejectedValue(new Error('Email error'))

      const result = await subscribeToNewsletter('new@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to subscribe. Please try again.')
    })

    it('should accept email with plus sign', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'test+tag@example.com',
      })
      mockSendNewsletterConfirmation.mockResolvedValue({})

      const result = await subscribeToNewsletter('test+tag@example.com')

      expect(result.success).toBe(true)
    })

    it('should accept email with subdomain', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'test@mail.example.com',
      })
      mockSendNewsletterConfirmation.mockResolvedValue({})

      const result = await subscribeToNewsletter('test@mail.example.com')

      expect(result.success).toBe(true)
    })

    it('should reject email without domain', async () => {
      const result = await subscribeToNewsletter('test@')

      expect(result.success).toBe(false)
    })

    it('should reject email without @ symbol', async () => {
      const result = await subscribeToNewsletter('testexample.com')

      expect(result.success).toBe(false)
    })

    it('should handle database connection issues', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockRejectedValue(
        new Error('Connection refused')
      )

      const result = await subscribeToNewsletter('new@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to subscribe. Please try again.')
    })

    it('should handle uppercase email', async () => {
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'new-sub',
        email: 'TEST@EXAMPLE.COM',
      })
      mockSendNewsletterConfirmation.mockResolvedValue({})

      const result = await subscribeToNewsletter('TEST@EXAMPLE.COM')

      expect(result.success).toBe(true)
    })
  })
})
