import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma - use vi.hoisted to ensure it exists before vi.mock runs
const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

// Import after mocking
import {
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getUserWithProducts,
} from '@/lib/db/queries/users'

describe('User Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserById', () => {
    it('should return user by id with selected fields', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      }
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getUserById('user-1')

      expect(result).toEqual(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true,
          avatarUrl: true,
          bio: true,
          website: true,
          twitter: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    })

    it('should NOT include password field', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({})

      await getUserById('user-1')

      // Verify password is not in the select
      const callArgs = mockPrisma.user.findUnique.mock.calls[0][0]
      expect(callArgs.select.password).toBeUndefined()
    })

    it('should return null for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await getUserById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed',
      }
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getUserByEmail('test@example.com')

      expect(result).toEqual(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })

    it('should return null for non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await getUserByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('getUserByUsername', () => {
    it('should return user by username with product count', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        username: 'testuser',
        _count: { products: 5 },
      }
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getUserByUsername('testuser')

      expect(result).toEqual(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          bio: true,
          website: true,
          twitter: true,
          createdAt: true,
          _count: {
            select: {
              products: {
                where: { status: 'APPROVED' },
              },
            },
          },
        },
      })
    })

    it('should only count approved products', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await getUserByUsername('testuser')

      const callArgs = mockPrisma.user.findUnique.mock.calls[0][0]
      expect(callArgs.select._count.select.products.where.status).toBe('APPROVED')
    })

    it('should return null for non-existent username', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await getUserByUsername('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getUserWithProducts', () => {
    it('should return user with all products', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        products: [
          { id: 'prod-1', name: 'Product 1', category: { name: 'Cat 1' } },
          { id: 'prod-2', name: 'Product 2', category: { name: 'Cat 2' } },
        ],
      }
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getUserWithProducts('user-1')

      expect(result).toEqual(mockUser)
      expect(result?.products).toHaveLength(2)
    })

    it('should order products by createdAt descending', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await getUserWithProducts('user-1')

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        include: {
          products: {
            orderBy: { createdAt: 'desc' },
            include: {
              category: true,
            },
          },
        },
      })
    })

    it('should include product category information', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await getUserWithProducts('user-1')

      const callArgs = mockPrisma.user.findUnique.mock.calls[0][0]
      expect(callArgs.include.products.include.category).toBe(true)
    })

    it('should return null for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await getUserWithProducts('non-existent')

      expect(result).toBeNull()
    })
  })
})
