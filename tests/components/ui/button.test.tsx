import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  describe('rendering', () => {
    it('should render children correctly', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('should render with default variant', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-[#0070f3]')
    })

    it('should render with destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })

    it('should render with outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('bg-transparent')
    })

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-[#31353b]')
    })

    it('should render with ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-[#262a30]')
    })

    it('should render with link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-[#0070f3]')
    })
  })

  describe('sizes', () => {
    it('should render with default size', () => {
      render(<Button>Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('should render with small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    it('should render with large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
    })

    it('should render with icon size', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('w-10')
    })
  })

  describe('states', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should show loading spinner when isLoading', () => {
      render(<Button isLoading>Loading</Button>)
      const button = screen.getByRole('button')
      const spinner = button.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
    })

    it('should be disabled when isLoading', () => {
      render(<Button isLoading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should show children alongside spinner when loading', () => {
      render(<Button isLoading>Loading Text</Button>)
      expect(screen.getByText('Loading Text')).toBeInTheDocument()
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have focus ring styles', () => {
      render(<Button>Accessible</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:ring-2')
    })

    it('should have proper disabled styling', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:opacity-50')
      expect(button).toHaveClass('disabled:pointer-events-none')
    })
  })

  describe('className prop', () => {
    it('should merge custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      // Should also have default classes
      expect(button).toHaveClass('inline-flex')
    })
  })

  describe('HTML attributes', () => {
    it('should pass type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('should pass aria attributes', () => {
      render(<Button aria-label="Close">X</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close')
    })
  })
})
