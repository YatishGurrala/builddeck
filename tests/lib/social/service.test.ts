import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockBsRecord = (id: string, data: Record<string, unknown>) => ({
  id,
  collection: 'social_posts',
  ownerId: 'user-1',
  data,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const mockProductRecord = (id: string, data: Record<string, unknown>) => ({
  id,
  collection: 'products',
  ownerId: 'user-1',
  data,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const { mockSocialQueries, mockProductQueries, mockCategoryQueries } = vi.hoisted(() => ({
  mockSocialQueries: {
    createSocialPost: vi.fn(),
    getSocialPosts: vi.fn(),
    getSocialPostsByProduct: vi.fn(),
    getSocialPostById: vi.fn(),
    updateSocialPostContent: vi.fn(),
    updateSocialPostStatus: vi.fn(),
    deleteSocialPostById: vi.fn(),
    deleteSocialPostsByProduct: vi.fn(),
  },
  mockProductQueries: {
    getProductById: vi.fn(),
  },
  mockCategoryQueries: {
    getCategoryById: vi.fn(),
  },
}))

vi.mock('@/lib/buildstack/queries/social', () => mockSocialQueries)
vi.mock('@/lib/buildstack/queries/products', () => mockProductQueries)
vi.mock('@/lib/buildstack/queries/categories', () => mockCategoryQueries)

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
    const mockProductRec = mockProductRecord('product-1', {
      name: 'TestApp',
      tagline: 'A great testing app',
      description: 'Description here',
      websiteUrl: 'https://testapp.com',
      categoryId: 'cat-1',
      status: 'APPROVED',
    })

    it('should create drafts for a valid product', async () => {
      mockProductQueries.getProductById.mockResolvedValue(mockProductRec)
      mockCategoryQueries.getCategoryById.mockResolvedValue({
        id: 'cat-1',
        collection: 'categories',
        ownerId: null,
        data: { name: 'Developer Tools', slug: 'dev-tools' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      mockSocialQueries.createSocialPost.mockResolvedValue(mockBsRecord('post-1', { platform: 'X', status: 'DRAFT' }))

      const result = await createDraftsForProduct('product-1')

      expect(mockProductQueries.getProductById).toHaveBeenCalledWith('product-1')
      expect(mockSocialQueries.createSocialPost).toHaveBeenCalledTimes(2) // X and LinkedIn
      expect(result).toHaveLength(2)
    })

    it('should throw error for non-existent product', async () => {
      mockProductQueries.getProductById.mockResolvedValue(null)

      await expect(createDraftsForProduct('non-existent')).rejects.toThrow(
        'Product not found'
      )
    })

    it('should store drafts with DRAFT status', async () => {
      mockProductQueries.getProductById.mockResolvedValue(mockProductRec)
      mockCategoryQueries.getCategoryById.mockResolvedValue(null)
      mockSocialQueries.createSocialPost.mockResolvedValue(mockBsRecord('post-1', { platform: 'X', status: 'DRAFT' }))

      await createDraftsForProduct('product-1')

      expect(mockSocialQueries.createSocialPost).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'DRAFT' })
      )
    })
  })

  describe('getSocialPostsForProduct', () => {
    it('should fetch posts for a product', async () => {
      const mockPosts = [
        mockBsRecord('post-1', { platform: 'X' }),
        mockBsRecord('post-2', { platform: 'LINKEDIN' }),
      ]
      mockSocialQueries.getSocialPostsByProduct.mockResolvedValue(mockPosts)

      const result = await getSocialPostsForProduct('product-1')

      expect(mockSocialQueries.getSocialPostsByProduct).toHaveBeenCalledWith('product-1')
      expect(result).toEqual(mockPosts)
    })

    it('should return empty array when no posts exist', async () => {
      mockSocialQueries.getSocialPostsByProduct.mockResolvedValue([])

      const result = await getSocialPostsForProduct('product-1')

      expect(result).toEqual([])
    })
  })

  describe('getAllSocialPosts', () => {
    it('should fetch all posts without filters', async () => {
      const mockPosts = [mockBsRecord('post-1', {}), mockBsRecord('post-2', {})]
      mockSocialQueries.getSocialPosts.mockResolvedValue(mockPosts)

      const result = await getAllSocialPosts()

      expect(mockSocialQueries.getSocialPosts).toHaveBeenCalledWith(undefined)
      expect(result).toEqual(mockPosts)
    })

    it('should filter by status', async () => {
      mockSocialQueries.getSocialPosts.mockResolvedValue([])

      await getAllSocialPosts({ status: 'DRAFT' })

      expect(mockSocialQueries.getSocialPosts).toHaveBeenCalledWith({ status: 'DRAFT' })
    })

    it('should filter by platform', async () => {
      mockSocialQueries.getSocialPosts.mockResolvedValue([])

      await getAllSocialPosts({ platform: 'X' })

      expect(mockSocialQueries.getSocialPosts).toHaveBeenCalledWith({ platform: 'X' })
    })

    it('should filter by both status and platform', async () => {
      mockSocialQueries.getSocialPosts.mockResolvedValue([])

      await getAllSocialPosts({ status: 'PUBLISHED', platform: 'LINKEDIN' })

      expect(mockSocialQueries.getSocialPosts).toHaveBeenCalledWith({ status: 'PUBLISHED', platform: 'LINKEDIN' })
    })
  })

  describe('updateSocialPost', () => {
    it('should update post content', async () => {
      const updatedRecord = mockBsRecord('post-1', { content: 'Updated content' })
      mockSocialQueries.updateSocialPostContent.mockResolvedValue(updatedRecord)

      const result = await updateSocialPost('post-1', 'Updated content')

      expect(mockSocialQueries.updateSocialPostContent).toHaveBeenCalledWith('post-1', 'Updated content')
      expect(result.data.content).toBe('Updated content')
    })
  })

  describe('publishSocialPost', () => {
    it('should return error for non-existent post', async () => {
      mockSocialQueries.getSocialPostById.mockResolvedValue(null)

      const result = await publishSocialPost('non-existent')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Post not found')
    })

    it('should return error for already published post', async () => {
      mockSocialQueries.getSocialPostById.mockResolvedValue(
        mockBsRecord('post-1', { status: 'PUBLISHED', platform: 'X', content: 'Test' })
      )

      const result = await publishSocialPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Post already published')
    })

    it('should update status on successful publish', async () => {
      mockSocialQueries.getSocialPostById.mockResolvedValue(
        mockBsRecord('post-1', { status: 'DRAFT', platform: 'X', content: 'Test content' })
      )
      mockSocialQueries.updateSocialPostStatus.mockResolvedValue(
        mockBsRecord('post-1', { status: 'PUBLISHED', platform: 'X' })
      )

      const result = await publishSocialPost('post-1')

      expect(result.success).toBe(true)
      expect(mockSocialQueries.updateSocialPostStatus).toHaveBeenCalledWith(
        'post-1',
        'PUBLISHED',
        expect.objectContaining({ publishedAt: expect.any(String) })
      )
    })
  })

  describe('deleteSocialPost', () => {
    it('should delete a post', async () => {
      mockSocialQueries.deleteSocialPostById.mockResolvedValue(undefined)

      await deleteSocialPost('post-1')

      expect(mockSocialQueries.deleteSocialPostById).toHaveBeenCalledWith('post-1')
    })
  })

  describe('regenerateDrafts', () => {
    const mockProductRec = mockProductRecord('product-1', {
      name: 'TestApp',
      tagline: 'A great testing app',
      description: 'Description here',
      websiteUrl: 'https://testapp.com',
      categoryId: null,
      status: 'APPROVED',
    })

    it('should delete existing drafts and create new ones', async () => {
      mockSocialQueries.deleteSocialPostsByProduct.mockResolvedValue(undefined)
      mockProductQueries.getProductById.mockResolvedValue(mockProductRec)
      mockSocialQueries.createSocialPost.mockResolvedValue(mockBsRecord('new-post', { platform: 'X', status: 'DRAFT' }))

      await regenerateDrafts('product-1')

      expect(mockSocialQueries.deleteSocialPostsByProduct).toHaveBeenCalledWith('product-1', 'DRAFT')
      expect(mockSocialQueries.createSocialPost).toHaveBeenCalled()
    })

    it('should only delete DRAFT posts, not PUBLISHED ones', async () => {
      mockSocialQueries.deleteSocialPostsByProduct.mockResolvedValue(undefined)
      mockProductQueries.getProductById.mockResolvedValue(mockProductRec)
      mockSocialQueries.createSocialPost.mockResolvedValue(mockBsRecord('new-post', { platform: 'X', status: 'DRAFT' }))

      await regenerateDrafts('product-1')

      expect(mockSocialQueries.deleteSocialPostsByProduct).toHaveBeenCalledWith('product-1', 'DRAFT')
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

