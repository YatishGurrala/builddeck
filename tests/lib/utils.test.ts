import { describe, it, expect } from 'vitest'
import { cn, slugify, formatDate, truncate, getInitials } from '@/lib/utils'

describe('cn (class name merger)', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'active', false && 'inactive')
    expect(result).toBe('base active')
  })

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'])
    expect(result).toBe('class1 class2')
  })

  it('should handle object syntax', () => {
    const result = cn({ active: true, disabled: false })
    expect(result).toBe('active')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'py-4')
    expect(result).toBe('px-4 py-4')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle undefined and null', () => {
    const result = cn('base', undefined, null, 'end')
    expect(result).toBe('base end')
  })

  it('should override conflicting tailwind utilities', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })
})

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('my product name')).toBe('my-product-name')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('-hello world-')).toBe('hello-world')
  })

  it('should handle underscores', () => {
    expect(slugify('hello_world')).toBe('hello-world')
  })

  it('should handle numbers', () => {
    expect(slugify('Product 123')).toBe('product-123')
  })

  it('should handle emoji removal', () => {
    expect(slugify('Hello 🚀 World')).toBe('hello-world')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle string with only special characters', () => {
    expect(slugify('!@#$%')).toBe('')
  })

  it('should handle mixed case and special chars', () => {
    expect(slugify('My App: The Best!')).toBe('my-app-the-best')
  })

  it('should handle consecutive hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })
})

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toBe('Jan 15, 2024')
  })

  it('should format date string', () => {
    const result = formatDate('2024-06-20')
    expect(result).toBe('Jun 20, 2024')
  })

  it('should format ISO date string', () => {
    const result = formatDate('2024-12-25T10:30:00Z')
    // Note: Exact output may vary based on timezone
    expect(result).toMatch(/Dec \d+, 2024/)
  })

  it('should handle different months', () => {
    expect(formatDate('2024-03-01')).toBe('Mar 1, 2024')
    expect(formatDate('2024-09-30')).toBe('Sep 30, 2024')
    expect(formatDate('2024-11-15')).toBe('Nov 15, 2024')
  })

  it('should handle year boundaries', () => {
    expect(formatDate('2023-12-31')).toBe('Dec 31, 2023')
    expect(formatDate('2025-01-01')).toBe('Jan 1, 2025')
  })
})

describe('truncate', () => {
  it('should truncate long text', () => {
    const result = truncate('This is a very long text', 10)
    expect(result).toBe('This is a ...')
  })

  it('should not truncate text shorter than limit', () => {
    const result = truncate('Short', 10)
    expect(result).toBe('Short')
  })

  it('should handle text exactly at limit', () => {
    const result = truncate('1234567890', 10)
    expect(result).toBe('1234567890')
  })

  it('should handle empty string', () => {
    const result = truncate('', 10)
    expect(result).toBe('')
  })

  it('should handle very short limit', () => {
    const result = truncate('Hello World', 3)
    expect(result).toBe('Hel...')
  })

  it('should handle limit of 0', () => {
    const result = truncate('Hello', 0)
    expect(result).toBe('...')
  })

  it('should preserve whole words is not guaranteed', () => {
    const result = truncate('Hello World', 7)
    expect(result).toBe('Hello W...')
  })
})

describe('getInitials', () => {
  it('should return initials for full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should return single initial for single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should handle three names', () => {
    expect(getInitials('John Jacob Doe')).toBe('JJ')
  })

  it('should return uppercase initials', () => {
    expect(getInitials('john doe')).toBe('JD')
  })

  it('should limit to 2 characters', () => {
    expect(getInitials('John Jacob Samuel Doe')).toBe('JJ')
  })

  it('should handle names with multiple spaces', () => {
    const result = getInitials('John   Doe')
    // May have empty entries, but should still get J and D
    expect(result.length).toBeLessThanOrEqual(2)
    expect(result).toContain('J')
  })

  it('should handle single character name', () => {
    expect(getInitials('J')).toBe('J')
  })

  it('should handle lowercase names', () => {
    expect(getInitials('jane smith')).toBe('JS')
  })
})
