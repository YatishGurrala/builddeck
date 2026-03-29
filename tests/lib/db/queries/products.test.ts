import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma - use vi.hoisted to ensure it exists before vi.mock runs
const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

// Import after mocking
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/db/queries/products'

describe('Product Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    const mockProducts = [
      { id: 'prod-1', name: 'Product 1', slug: 'product-1' },
      { id: 'prod-2', name: 'Product 2', slug: 'product-2' },
    ]

    it('should return paginated products', async () => {
      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(2)

      const result = await getProducts()

      expect(result.data).toEqual(mockProducts)
      expect(result.count).toBe(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(12)
    })

    it('should use custom pagination', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        pagination: { page: 2, pageSize: 10 },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })

    it('should filter by status', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        filters: { status: 'APPROVED' },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'APPROVED',
          }),
        })
      )
    })

    it('should filter by categoryId', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        filters: { categoryId: 'cat-1' },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 'cat-1',
          }),
        })
      )
    })

    it('should filter by featured', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        filters: { featured: true },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            featured: true,
          }),
        })
      )
    })

    it('should filter by userId', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        filters: { userId: 'user-1' },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-1',
          }),
        })
      )
    })

    it('should filter by search term', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        filters: { search: 'test' },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: { contains: 'test' } }),
              expect.objectContaining({ tagline: { contains: 'test' } }),
              expect.objectContaining({ description: { contains: 'test' } }),
            ]),
          }),
        })
      )
    })

    it('should apply custom sorting', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(0)

      await getProducts({
        sort: { field: 'viewCount', direction: 'desc' },
      })

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { viewCount: 'desc' },
        })
      )
    })

    it('should calculate hasMore correctly', async () => {
      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(25)

      const result = await getProducts({
        pagination: { page: 1, pageSize: 12 },
      })

      expect(result.hasMore).toBe(true)
      expect(result.totalPages).toBe(3)
    })

    it('should calculate hasMore false on last page', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])
      mockPrisma.product.count.mockResolvedValue(24)

      const result = await getProducts({
        pagination: { page: 2, pageSize: 12 },
      })

      expect(result.hasMore).toBe(false)
    })
  })

  describe('getProductBySlug', () => {
    it('should return product by slug', async () => {
      const mockProduct = { id: 'prod-1', slug: 'test-product' }
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct)

      const result = await getProductBySlug('test-product')

      expect(result).toEqual(mockProduct)
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
        include: expect.any(Object),
      })
    })

    it('should return null for non-existent slug', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null)

      const result = await getProductBySlug('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const mockProduct = { id: 'prod-1', name: 'Test' }
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct)

      const result = await getProductById('prod-1')

      expect(result).toEqual(mockProduct)
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        include: expect.any(Object),
      })
    })

    it('should return null for non-existent id', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null)

      const result = await getProductById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getFeaturedProducts', () => {
    it('should return featured products with default limit', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])

      await getFeaturedProducts()

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: 'APPROVED',
            featured: true,
          },
          take: 6,
          orderBy: { featuredAt: 'desc' },
        })
      )
    })

    it('should respect custom limit', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])

      await getFeaturedProducts(10)

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        })
      )
    })
  })

  describe('getLatestProducts', () => {
    it('should return latest approved products', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])

      await getLatestProducts()

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: 'APPROVED',
          },
          take: 12,
          orderBy: { approvedAt: 'desc' },
        })
      )
    })

    it('should respect custom limit', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])

      await getLatestProducts(5)

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        })
      )
    })
  })
})
