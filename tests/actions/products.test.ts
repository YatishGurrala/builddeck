import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies - use vi.hoisted to ensure they exist before vi.mock runs
const { mockAuth, mockPrisma, mockRevalidatePath, mockRedirect, mockCreateDraftsForProduct } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    product: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  mockRevalidatePath: vi.fn(),
  mockRedirect: vi.fn(),
  mockCreateDraftsForProduct: vi.fn(),
}))

vi.mock('@/lib/auth/config', () => ({
  auth: () => mockAuth(),
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

vi.mock('@/lib/social', () => ({
  createDraftsForProduct: (...args: unknown[]) => mockCreateDraftsForProduct(...args),
}))

// Import after mocking
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  toggleFeatured,
} from '@/actions/products'

describe('Product Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createProduct', () => {
    const validFormData = () => {
      const formData = new FormData()
      formData.append('name', 'Test Product')
      formData.append('tagline', 'This is a great tagline for testing purposes')
      formData.append('description', 'This is a long description that needs to be at least 50 characters to pass validation.')
      formData.append('website_url', 'https://example.com')
      formData.append('category_id', '550e8400-e29b-41d4-a716-446655440000')
      return formData
    }

    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await createProduct(validFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in')
    })

    it('should require user ID in session', async () => {
      mockAuth.mockResolvedValue({ user: {} })

      const result = await createProduct(validFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in')
    })

    it('should validate product name length', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })

      const formData = validFormData()
      formData.set('name', 'A')

      const result = await createProduct(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Name must be at least 2 characters')
    })

    it('should validate tagline length', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })

      const formData = validFormData()
      formData.set('tagline', 'Short')

      const result = await createProduct(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Tagline must be at least 10 characters')
    })

    it('should validate description length', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })

      const formData = validFormData()
      formData.set('description', 'Too short')

      const result = await createProduct(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Description must be at least 50 characters')
    })

    it('should validate website URL format', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })

      const formData = validFormData()
      formData.set('website_url', 'not-a-url')

      const result = await createProduct(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please enter a valid URL')
    })

    it('should validate category ID format', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })

      const formData = validFormData()
      formData.set('category_id', 'invalid-uuid')

      const result = await createProduct(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please select a category')
    })

    it('should generate unique slug', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findUnique.mockResolvedValue(null)
      mockPrisma.product.create.mockResolvedValue({ id: 'product-1' })
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await createProduct(validFormData())
      } catch (e) {
        // Expected redirect
      }

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'test-product',
        }),
      })
    })

    it('should append timestamp to slug if exists', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'existing' })
      mockPrisma.product.create.mockResolvedValue({ id: 'product-1' })
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await createProduct(validFormData())
      } catch (e) {
        // Expected redirect
      }

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: expect.stringMatching(/^test-product-\d+$/),
        }),
      })
    })

    it('should set status to PENDING', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findUnique.mockResolvedValue(null)
      mockPrisma.product.create.mockResolvedValue({ id: 'product-1' })
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await createProduct(validFormData())
      } catch (e) {
        // Expected redirect
      }

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'PENDING',
        }),
      })
    })

    it('should revalidate dashboard path', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findUnique.mockResolvedValue(null)
      mockPrisma.product.create.mockResolvedValue({ id: 'product-1' })
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await createProduct(validFormData())
      } catch (e) {
        // Expected redirect
      }

      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    })

    it('should redirect to dashboard with success param', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findUnique.mockResolvedValue(null)
      mockPrisma.product.create.mockResolvedValue({ id: 'product-1' })
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await createProduct(validFormData())
      } catch (e) {
        // Expected redirect
      }

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard?submitted=true')
    })

    it('should return error on database failure', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findUnique.mockResolvedValue(null)
      mockPrisma.product.create.mockRejectedValue(new Error('Database error'))

      const result = await createProduct(validFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create product')
    })
  })

  describe('updateProduct', () => {
    const validFormData = () => {
      const formData = new FormData()
      formData.append('name', 'Updated Product')
      formData.append('tagline', 'This is an updated tagline for testing')
      formData.append('description', 'This is an updated long description that needs to be at least 50 characters.')
      formData.append('website_url', 'https://updated.com')
      formData.append('category_id', '550e8400-e29b-41d4-a716-446655440000')
      return formData
    }

    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await updateProduct('product-1', validFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in')
    })

    it('should verify product ownership', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findFirst.mockResolvedValue(null)

      const result = await updateProduct('product-1', validFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Product not found')
      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'product-1',
          userId: 'user-1',
        },
      })
    })

    it('should reset status to PENDING on update', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findFirst.mockResolvedValue({ id: 'product-1' })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      await updateProduct('product-1', validFormData())

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: expect.objectContaining({
          status: 'PENDING',
        }),
      })
    })

    it('should return success on valid update', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findFirst.mockResolvedValue({ id: 'product-1' })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      const result = await updateProduct('product-1', validFormData())

      expect(result.success).toBe(true)
    })

    it('should validate form data', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.findFirst.mockResolvedValue({ id: 'product-1' })

      const formData = validFormData()
      formData.set('name', 'A')

      const result = await updateProduct('product-1', formData)

      expect(result.success).toBe(false)
    })
  })

  describe('deleteProduct', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await deleteProduct('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in')
    })

    it('should delete product owned by user', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.delete.mockResolvedValue({ id: 'product-1' })

      const result = await deleteProduct('product-1')

      expect(result.success).toBe(true)
      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: {
          id: 'product-1',
          userId: 'user-1',
        },
      })
    })

    it('should revalidate dashboard path', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.delete.mockResolvedValue({ id: 'product-1' })

      await deleteProduct('product-1')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    })

    it('should return error on database failure', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1' } })
      mockPrisma.product.delete.mockRejectedValue(new Error('Not found'))

      const result = await deleteProduct('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete product')
    })
  })

  describe('updateProductStatus', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await updateProductStatus('product-1', 'APPROVED')

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await updateProductStatus('product-1', 'APPROVED')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should update status with admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      const result = await updateProductStatus('product-1', 'APPROVED')

      expect(result.success).toBe(true)
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: expect.objectContaining({
          status: 'APPROVED',
          reviewedById: 'admin-1',
          reviewedAt: expect.any(Date),
          approvedAt: expect.any(Date),
        }),
      })
    })

    it('should not set approvedAt for non-APPROVED status', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      await updateProductStatus('product-1', 'REJECTED')

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: {
          status: 'REJECTED',
          reviewedById: 'admin-1',
          reviewedAt: expect.any(Date),
        },
      })
    })

    it('should create social drafts when approving', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })
      mockCreateDraftsForProduct.mockResolvedValue([])

      await updateProductStatus('product-1', 'APPROVED')

      expect(mockCreateDraftsForProduct).toHaveBeenCalledWith('product-1')
    })

    it('should not fail approval if draft creation fails', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })
      mockCreateDraftsForProduct.mockRejectedValue(new Error('Draft error'))

      const result = await updateProductStatus('product-1', 'APPROVED')

      expect(result.success).toBe(true)
    })

    it('should revalidate admin and products paths', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      await updateProductStatus('product-1', 'APPROVED')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/admin')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/products')
    })
  })

  describe('toggleFeatured', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await toggleFeatured('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('You must be logged in')
    })

    it('should require admin role', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } })

      const result = await toggleFeatured('product-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized')
    })

    it('should toggle featured from false to true', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'product-1',
        featured: false,
      })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      await toggleFeatured('product-1')

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: {
          featured: true,
          featuredAt: expect.any(Date),
        },
      })
    })

    it('should toggle featured from true to false', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'product-1',
        featured: true,
      })
      mockPrisma.product.update.mockResolvedValue({ id: 'product-1' })

      await toggleFeatured('product-1')

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: {
          featured: false,
          featuredAt: null,
        },
      })
    })
  })
})
