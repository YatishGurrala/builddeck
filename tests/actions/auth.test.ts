import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies - use vi.hoisted to ensure they exist before vi.mock runs
const { mockAuth, mockPrisma, mockSignIn, mockSignOut, mockRedirect, mockBcrypt } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  mockSignIn: vi.fn(),
  mockSignOut: vi.fn(),
  mockRedirect: vi.fn(),
  mockBcrypt: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
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

vi.mock('bcryptjs', () => ({
  default: {
    hash: (...args: unknown[]) => mockBcrypt.hash(...args),
    compare: (...args: unknown[]) => mockBcrypt.compare(...args),
  },
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
      formData.append('password', 'password123')

      const result = await login(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid email')
    })

    it('should validate password minimum length', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', '12345') // Less than 6 chars

      const result = await login(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Password must be at least 6 characters')
    })

    it('should call signIn with correct credentials', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await login(formData)
      } catch (e) {
        // Expected redirect error
      }

      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    it('should use custom redirect path when provided', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('redirect', '/products')

      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await login(formData)
      } catch (e) {
        // Expected redirect
      }

      expect(mockRedirect).toHaveBeenCalledWith('/products')
    })

    it('should default redirect to /dashboard', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await login(formData)
      } catch (e) {
        // Expected redirect
      }

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should return error for invalid credentials', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

      const result = await login(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email or password')
    })

    it('should handle empty email', async () => {
      const formData = new FormData()
      formData.append('email', '')
      formData.append('password', 'password123')

      const result = await login(formData)

      expect(result.success).toBe(false)
    })

    it('should handle empty password', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', '')

      const result = await login(formData)

      expect(result.success).toBe(false)
    })
  })

  describe('signup', () => {
    it('should validate name minimum length', async () => {
      const formData = new FormData()
      formData.append('name', 'J')
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Name must be at least 2 characters')
    })

    it('should validate email format', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'invalid')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid email')
    })

    it('should validate password confirmation', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'different')

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Passwords don't match")
    })

    it('should check for existing user', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-user' })

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('An account with this email already exists')
    })

    it('should hash password with salt of 12', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password')
      mockPrisma.user.create.mockResolvedValue({ id: 'new-user' })
      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await signup(formData)
      } catch (e) {
        // Expected redirect
      }

      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12)
    })

    it('should create user with correct data', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password')
      mockPrisma.user.create.mockResolvedValue({ id: 'new-user' })
      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await signup(formData)
      } catch (e) {
        // Expected redirect
      }

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          name: 'John Doe',
          password: 'hashed-password',
        },
      })
    })

    it('should auto sign in after successful signup', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password')
      mockPrisma.user.create.mockResolvedValue({ id: 'new-user' })
      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await signup(formData)
      } catch (e) {
        // Expected redirect
      }

      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'new@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    it('should redirect to dashboard after signup', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password')
      mockPrisma.user.create.mockResolvedValue({ id: 'new-user' })
      mockSignIn.mockResolvedValue({})
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await signup(formData)
      } catch (e) {
        // Expected redirect
      }

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should return error on database failure', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password')
      mockPrisma.user.create.mockRejectedValue(new Error('Database error'))

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create account. Please try again.')
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
