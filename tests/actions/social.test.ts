import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
const mockAuth = vi.fn()
const mockRevalidatePath = vi.fn()

const mockGetAllSocialPosts = vi.fn()
const mockGetSocialPostsForProduct = vi.fn()
const mockUpdateSocialPost = vi.fn()
const mockPublishSocialPost = vi.fn()
const mockDeleteSocialPost = vi.fn()
const mockRegenerateDrafts = vi.fn()

vi.mock('@/lib/auth/config', () => ({
  auth: () => mockAuth(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('@/lib/social', () => ({
  getAllSocialPosts: (...args: unknown[]) => mockGetAllSocialPosts(...args),
  getSocialPostsForProduct: (...args: unknown[]) => mockGetSocialPostsForProduct(...args),
  updateSocialPost: (...args: unknown[]) => mockUpdateSocialPost(...args),
  publishSocialPost: (...args: unknown[]) => mockPublishSocialPost(...args),
  deleteSocialPost: (...args: unknown[]) => mockDeleteSocialPost(...args),
  regenerateDrafts: (...args: unknown[]) => mockRegenerateDrafts(...args),
}))

// Import after mocking
import {
  getSocialPosts,
  getProductSocialPosts,
  editSocialPost,
  publishPost,
  removeSocialPost,
  regenerateProductDrafts,
} from '@/actions/social'

describe('Social Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSocialPosts', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await getSocialPosts()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
      expect(result.data).toEqual([])
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await getSocialPosts()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should return posts for admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      const mockPosts = [
        { id: 'post-1', platform: 'X' },
        { id: 'post-2', platform: 'LINKEDIN' },
      ]
      mockGetAllSocialPosts.mockResolvedValue(mockPosts)

      const result = await getSocialPosts()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPosts)
    })

    it('should pass status filter', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockGetAllSocialPosts.mockResolvedValue([])

      await getSocialPosts({ status: 'DRAFT' })

      expect(mockGetAllSocialPosts).toHaveBeenCalledWith({ status: 'DRAFT' })
    })

    it('should pass platform filter', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockGetAllSocialPosts.mockResolvedValue([])

      await getSocialPosts({ platform: 'X' })

      expect(mockGetAllSocialPosts).toHaveBeenCalledWith({ platform: 'X' })
    })

    it('should handle database errors', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockGetAllSocialPosts.mockRejectedValue(new Error('Database error'))

      const result = await getSocialPosts()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch social posts')
    })
  })

  describe('getProductSocialPosts', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await getProductSocialPosts('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await getProductSocialPosts('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should return posts for admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      const mockPosts = [{ id: 'post-1', productId: 'product-1' }]
      mockGetSocialPostsForProduct.mockResolvedValue(mockPosts)

      const result = await getProductSocialPosts('product-1')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPosts)
      expect(mockGetSocialPostsForProduct).toHaveBeenCalledWith('product-1')
    })
  })

  describe('editSocialPost', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await editSocialPost('post-1', 'New content')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await editSocialPost('post-1', 'New content')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should reject empty content', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

      const result = await editSocialPost('post-1', '')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Content cannot be empty')
    })

    it('should reject whitespace-only content', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

      const result = await editSocialPost('post-1', '   ')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Content cannot be empty')
    })

    it('should update post content', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockUpdateSocialPost.mockResolvedValue({ id: 'post-1', content: 'New content' })

      const result = await editSocialPost('post-1', 'New content')

      expect(result.success).toBe(true)
      expect(mockUpdateSocialPost).toHaveBeenCalledWith('post-1', 'New content')
    })

    it('should revalidate admin/social path', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockUpdateSocialPost.mockResolvedValue({})

      await editSocialPost('post-1', 'New content')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/social')
    })

    it('should handle update errors', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockUpdateSocialPost.mockRejectedValue(new Error('Update failed'))

      const result = await editSocialPost('post-1', 'New content')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update post')
    })
  })

  describe('publishPost', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await publishPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await publishPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should publish post successfully', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPublishSocialPost.mockResolvedValue({ success: true, postId: 'ext-123' })

      const result = await publishPost('post-1')

      expect(result.success).toBe(true)
      expect(result.publishResult?.postId).toBe('ext-123')
    })

    it('should return publish error', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPublishSocialPost.mockResolvedValue({ success: false, error: 'Rate limited' })

      const result = await publishPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Rate limited')
    })

    it('should handle publish exceptions', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPublishSocialPost.mockRejectedValue(new Error('Network error'))

      const result = await publishPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to publish post')
    })
  })

  describe('removeSocialPost', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await removeSocialPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await removeSocialPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should delete post', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockDeleteSocialPost.mockResolvedValue({})

      const result = await removeSocialPost('post-1')

      expect(result.success).toBe(true)
      expect(mockDeleteSocialPost).toHaveBeenCalledWith('post-1')
    })

    it('should revalidate admin/social path', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockDeleteSocialPost.mockResolvedValue({})

      await removeSocialPost('post-1')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/social')
    })

    it('should handle delete errors', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockDeleteSocialPost.mockRejectedValue(new Error('Delete failed'))

      const result = await removeSocialPost('post-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete post')
    })
  })

  describe('regenerateProductDrafts', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await regenerateProductDrafts('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await regenerateProductDrafts('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should regenerate drafts', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockRegenerateDrafts.mockResolvedValue([])

      const result = await regenerateProductDrafts('product-1')

      expect(result.success).toBe(true)
      expect(mockRegenerateDrafts).toHaveBeenCalledWith('product-1')
    })

    it('should revalidate admin/social path', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockRegenerateDrafts.mockResolvedValue([])

      await regenerateProductDrafts('product-1')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/social')
    })

    it('should handle regeneration errors', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockRegenerateDrafts.mockRejectedValue(new Error('Regeneration failed'))

      const result = await regenerateProductDrafts('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to regenerate drafts')
    })
  })
})
