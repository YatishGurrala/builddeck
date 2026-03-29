import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma - use vi.hoisted to ensure it exists before vi.mock runs
const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

// Import after mocking
import {
  getCategories,
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  getCategoriesWithProductCount,
} from '@/lib/db/queries/categories'

describe('Category Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    const mockCategories = [
      { id: 'cat-1', name: 'Category 1', slug: 'category-1', isActive: true },
      { id: 'cat-2', name: 'Category 2', slug: 'category-2', isActive: true },
    ]

    it('should return only active categories by default', async () => {
      mockPrisma.category.findMany.mockResolvedValue(mockCategories)

      const result = await getCategories()

      expect(result).toEqual(mockCategories)
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      })
    })

    it('should include inactive categories when specified', async () => {
      mockPrisma.category.findMany.mockResolvedValue(mockCategories)

      await getCategories(true)

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { displayOrder: 'asc' },
      })
    })

    it('should order by displayOrder ascending', async () => {
      mockPrisma.category.findMany.mockResolvedValue(mockCategories)

      await getCategories()

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { displayOrder: 'asc' },
        })
      )
    })
  })

  describe('getAllCategories', () => {
    it('should return only active categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([])

      await getAllCategories()

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      })
    })
  })

  describe('getCategoryBySlug', () => {
    it('should return category by slug', async () => {
      const mockCategory = { id: 'cat-1', slug: 'developer-tools' }
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory)

      const result = await getCategoryBySlug('developer-tools')

      expect(result).toEqual(mockCategory)
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { slug: 'developer-tools' },
      })
    })

    it('should return null for non-existent slug', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null)

      const result = await getCategoryBySlug('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getCategoryById', () => {
    it('should return category by id', async () => {
      const mockCategory = { id: 'cat-1', name: 'Test Category' }
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory)

      const result = await getCategoryById('cat-1')

      expect(result).toEqual(mockCategory)
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      })
    })

    it('should return null for non-existent id', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null)

      const result = await getCategoryById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getCategoriesWithProductCount', () => {
    it('should return categories with product count', async () => {
      const mockCategoriesWithCount = [
        {
          id: 'cat-1',
          name: 'Category 1',
          isActive: true,
          _count: { products: 5 },
        },
        {
          id: 'cat-2',
          name: 'Category 2',
          isActive: true,
          _count: { products: 3 },
        },
      ]
      mockPrisma.category.findMany.mockResolvedValue(mockCategoriesWithCount)

      const result = await getCategoriesWithProductCount()

      expect(result).toHaveLength(2)
      expect(result[0].productCount).toBe(5)
      expect(result[1].productCount).toBe(3)
    })

    it('should only count approved products', async () => {
      mockPrisma.category.findMany.mockResolvedValue([])

      await getCategoriesWithProductCount()

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
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

    it('should only include active categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([])

      await getCategoriesWithProductCount()

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        })
      )
    })
  })
})
