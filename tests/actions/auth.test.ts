import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies - use vi.hoisted to ensure they exist before vi.mock runs
const { mockAuth, mockPrisma, mockSignIn, mockSignOut, mockRedirect } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    user: {
      upsert: vi.fn(),
    },
  },
  mockSignIn: vi.fn(),
  mockSignOut: vi.fn(),
  mockRedirect: vi.fn(),
}))

vi.mock('@/lib/auth/config', () => ({
  auth: () => mockAuth(),
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

// Import after mocking
import { login, signup, logout } from '@/actions/auth'

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should validate email format', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')

      const result = await login(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid email')
    })

    it('should return error on empty email', async () => {
      const formData = new FormData()
      formData.append('email', '')

      const result = await login(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid email')
    })

    it('should call signIn with magic-link provider and default redirect', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      mockSignIn.mockResolvedValue({})
      const result = await login(formData)

      expect(result.success).toBe(true)
      expect(mockSignIn).toHaveBeenCalledWith('nodemailer', {
        email: 'test@example.com',
        redirect: false,
        redirectTo: '/dashboard',
      })
    })

    it('should use custom redirect path when provided', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('redirect', '/products')

      mockSignIn.mockResolvedValue({})
      const result = await login(formData)

      expect(result.success).toBe(true)
      expect(mockSignIn).toHaveBeenCalledWith('nodemailer', {
        email: 'test@example.com',
        redirect: false,
        redirectTo: '/products',
      })
    })

    it('should return error when signIn fails', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      mockSignIn.mockRejectedValue(new Error('SMTP failure'))

      const result = await login(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to send magic link')
    })
  })

  describe('signup', () => {
    it('should validate email format', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'invalid')

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid email')
    })

    it('should upsert user and send signup magic link', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'test@example.com')

      mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1' })
      mockSignIn.mockResolvedValue({})

      const result = await signup(formData)

      expect(result.success).toBe(true)
      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        update: { name: 'John Doe' },
        create: { email: 'test@example.com', name: 'John Doe' },
      })
      expect(mockSignIn).toHaveBeenCalledWith('nodemailer', {
        email: 'test@example.com',
        redirect: false,
        redirectTo: '/dashboard',
      })
    })

    it('should store null name when omitted', async () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('email', 'test@example.com')

      mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1' })
      mockSignIn.mockResolvedValue({})

      const result = await signup(formData)

      expect(result.success).toBe(true)
      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        update: { name: undefined },
        create: { email: 'test@example.com', name: null },
      })
    })

    it('should return generic error when signup flow fails', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'test@example.com')
      mockPrisma.user.upsert.mockRejectedValue(new Error('Database error'))

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to start signup flow. Please try again.')
    })
  })

  describe('logout', () => {
    it('should call signOut', async () => {
      mockSignOut.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await logout()
      } catch (e) {
        // Expected redirect
      }

      expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
    })

    it('should redirect to home after logout', async () => {
      mockSignOut.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await logout()
      } catch (e) {
        // Expected redirect
      }

      expect(mockRedirect).toHaveBeenCalledWith('/')
    })
  })
})
