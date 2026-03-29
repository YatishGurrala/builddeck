import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/product/product-card'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

const mockProduct = {
  id: 'prod-1',
  name: 'Test Product',
  slug: 'test-product',
  tagline: 'This is a great product tagline',
  description: 'Full description here',
  websiteUrl: 'https://example.com',
  logoUrl: null,
  screenshots: '[]',
  status: 'APPROVED' as const,
  featured: false,
  featuredAt: null,
  viewCount: 10,
  upvoteCount: 5,
  rejectionReason: null,
  reviewedAt: null,
  submittedAt: new Date(),
  approvedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-1',
  categoryId: 'cat-1',
  reviewedById: null,
  category: { id: 'cat-1', name: 'Developer Tools', slug: 'developer-tools' },
  user: { id: 'user-1', name: 'John Doe' },
}

describe('ProductCard', () => {
  describe('rendering', () => {
    it('should render product name', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should render product tagline', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('This is a great product tagline')).toBeInTheDocument()
    })

    it('should render category name', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Developer Tools')).toBeInTheDocument()
    })

    it('should render first letter initial when no logo', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('T')).toBeInTheDocument()
    })

    it('should render logo image when logoUrl provided', () => {
      const productWithLogo = {
        ...mockProduct,
        logoUrl: 'https://example.com/logo.png',
      }
      render(<ProductCard product={productWithLogo} />)
      const img = screen.getByAltText('Test Product')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com/logo.png')
    })

    it('should render visit site text', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Visit Site')).toBeInTheDocument()
    })
  })

  describe('featured badge', () => {
    it('should show featured badge when product is featured', () => {
      const featuredProduct = {
        ...mockProduct,
        featured: true,
        featuredAt: new Date(),
      }
      render(<ProductCard product={featuredProduct} />)
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('should not show featured badge when product is not featured', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    })
  })

  describe('links', () => {
    it('should link to product detail page', () => {
      render(<ProductCard product={mockProduct} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/products/test-product')
    })
  })

  describe('category', () => {
    it('should not render category when not provided', () => {
      const productNoCategory = {
        ...mockProduct,
        category: null,
      }
      render(<ProductCard product={productNoCategory} />)
      expect(screen.queryByText('Developer Tools')).not.toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should have rounded card styling', () => {
      render(<ProductCard product={mockProduct} />)
      const card = screen.getByRole('link').firstChild
      expect(card).toHaveClass('rounded-2xl')
    })

    it('should have hover transition classes', () => {
      render(<ProductCard product={mockProduct} />)
      const card = screen.getByRole('link').firstChild
      expect(card).toHaveClass('transition-all')
      expect(card).toHaveClass('hover:-translate-y-2')
    })
  })
})
