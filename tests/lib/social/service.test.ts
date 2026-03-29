import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma - use vi.hoisted to ensure it exists before vi.mock runs
const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    product: {
      findUnique: vi.fn(),
    },
    socialPost: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

// Mock providers
vi.mock('@/lib/social/providers', () => {
  class MockXProvider {
    platform = 'X'
    isConfigured() { return true }
    getCharacterLimit() { return 280 }
    async publish() { return { success: true, postId: 'mock-x-id' } }
  }
  class MockLinkedInProvider {
    platform = 'LINKEDIN'
    isConfigured() { return true }
    getCharacterLimit() { return 3000 }
    async publish() { return { success: true, postId: 'mock-li-id' } }
  }
  return {
    XProvider: MockXProvider,
    LinkedInProvider: MockLinkedInProvider,
  }
})

// Import after mocks
import {
  createDraftsForProduct,
  getSocialPostsForProduct,
  getAllSocialPosts,
  updateSocialPost,
  publishSocialPost,
  deleteSocialPost,
  regenerateDrafts,
  isProviderConfigured,
} from '@/lib/social/service'

describe('Social Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDraftsForProduct', () => {
    const mockProduct = {
      id: 'product-1',
      name: 'TestApp',
      tagline: 'A great testing app',
      description: 'Description here',
      websiteUrl: 'https://testapp.com',
      category: { name: 'Developer Tools' },
    }

    it('should create drafts for a valid product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct)
      mockPrisma.socialPost.create.mockResolvedValue({ id: 'post-1' })

      const result = await createDraftsForProduct('product-1')

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        include: { category: true },
      })
      expect(mockPrisma.socialPost.create).toHaveBeenCalledTimes(2) // X and LinkedIn
      expect(result).toHaveLength(2)
    })

    it('should throw error for non-existent product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null)

      await expect(createDraftsForProduct('non-existent')).rejects.toThrow(
        'Product not found'
      )
    })

    it('should store drafts with DRAFT status', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct)
      mockPrisma.socialPost.create.mockResolvedValue({ id: 'post-1' })

      await createDraftsForProduct('product-1')

      expect(mockPrisma.socialPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DRAFT',
          }),
        })
      )
    })
  })

  describe('getSocialPostsForProduct', () => {
    it('should fetch posts for a product', async () => {
      const mockPosts = [
        { id: 'post-1', platform: 'X' },
        { id: 'post-2', platform: 'LINKEDIN' },
      ]
      mockPrisma.socialPost.findMany.mockResolvedValue(mockPosts)

      const result = await getSocialPostsForProduct('product-1')

      expect(mockPrisma.socialPost.findMany).toHaveBeenCalledWith({
        where: { productId: 'product-1' },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual(mockPosts)
    })

    it('should return empty array when no posts exist', async () => {
      mockPrisma.socialPost.findMany.mockResolvedValue([])

      const result = await getSocialPostsForProduct('product-1')

      expect(result).toEqual([])
    })
  })

  describe('getAllSocialPosts', () => {
    it('should fetch all posts without filters', async () => {
      const mockPosts = [{ id: 'post-1' }, { id: 'post-2' }]
      mockPrisma.socialPost.findMany.mockResolvedValue(mockPosts)

      const result = await getAllSocialPosts()

      expect(mockPrisma.socialPost.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              tagline: true,
              logoUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual(mockPosts)
    })

    it('should filter by status', async () => {
      mockPrisma.socialPost.findMany.mockResolvedValue([])

      await getAllSocialPosts({ status: 'DRAFT' })

      expect(mockPrisma.socialPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'DRAFT' },
        })
      )
    })

    it('should filter by platform', async () => {
      mockPrisma.socialPost.findMany.mockResolvedValue([])

      await getAllSocialPosts({ platform: 'X' })

      expect(mockPrisma.socialPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { platform: 'X' },
        })
      )
    })

    it('should filter by both status and platform', async () => {
      mockPrisma.socialPost.findMany.mockResolvedValue([])

      await getAllSocialPosts({ status: 'PUBLISHED', platform: 'LINKEDIN' })

      expect(mockPrisma.socialPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PUBLISHED', platform: 'LINKEDIN' },
        })
      )
    })
  })

  describe('updateSocialPost', () => {
    it('should update post content', async () => {
      mockPrisma.socialPost.update.mockResolvedValue({
        id: 'post-1',
        content: 'Updated content',
      })

      const result = await updateSocialPost('post-1', 'Updated content')

      expect(mockPrisma.socialPost.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: { content: 'Updated content' },
      })
      expect(result.content).toBe('Updated content')
    })
  })

  describe('publishSocialPost', () => {
    it('should return error for non-existent post', async () => {
      mockPrisma.socialPost.findUnique.mockResolvedValue(null)

      const result = await publishSocialPost('non-existent')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Post not found')
    })

    it('should return error for already published post', async () => {
      mockPrisma.socialPost.findUnique.mockResolvedValue({
        id: 'post-1',
        status: 'PUBLISHED',
        platform: 'X',
      })

      const result = await publishSocialPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Post already published')
    })

    it('should update status on successful publish', async () => {
      mockPrisma.socialPost.findUnique.mockResolvedValue({
        id: 'post-1',
        status: 'DRAFT',
        platform: 'X',
        content: 'Test content',
      })
      mockPrisma.socialPost.update.mockResolvedValue({})

      const result = await publishSocialPost('post-1')

      expect(result.success).toBe(true)
      expect(mockPrisma.socialPost.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'post-1' },
          data: expect.objectContaining({
            status: 'PUBLISHED',
          }),
        })
      )
    })
  })

  describe('deleteSocialPost', () => {
    it('should delete a post', async () => {
      mockPrisma.socialPost.delete.mockResolvedValue({ id: 'post-1' })

      await deleteSocialPost('post-1')

      expect(mockPrisma.socialPost.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      })
    })
  })

  describe('regenerateDrafts', () => {
    const mockProduct = {
      id: 'product-1',
      name: 'TestApp',
      tagline: 'A great testing app',
      description: 'Description here',
      websiteUrl: 'https://testapp.com',
      category: { name: 'Developer Tools' },
    }

    it('should delete existing drafts and create new ones', async () => {
      mockPrisma.socialPost.deleteMany.mockResolvedValue({ count: 2 })
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct)
      mockPrisma.socialPost.create.mockResolvedValue({ id: 'new-post' })

      await regenerateDrafts('product-1')

      expect(mockPrisma.socialPost.deleteMany).toHaveBeenCalledWith({
        where: {
          productId: 'product-1',
          status: 'DRAFT',
        },
      })
      expect(mockPrisma.socialPost.create).toHaveBeenCalled()
    })

    it('should only delete DRAFT posts, not PUBLISHED ones', async () => {
      mockPrisma.socialPost.deleteMany.mockResolvedValue({ count: 1 })
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct)
      mockPrisma.socialPost.create.mockResolvedValue({ id: 'new-post' })

      await regenerateDrafts('product-1')

      expect(mockPrisma.socialPost.deleteMany).toHaveBeenCalledWith({
        where: {
          productId: 'product-1',
          status: 'DRAFT',
        },
      })
    })
  })

  describe('isProviderConfigured', () => {
    it('should check X provider configuration', () => {
      const result = isProviderConfigured('X')
      expect(typeof result).toBe('boolean')
    })

    it('should check LinkedIn provider configuration', () => {
      const result = isProviderConfigured('LINKEDIN')
      expect(typeof result).toBe('boolean')
    })
  })
})
