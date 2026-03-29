import { describe, it, expect } from 'vitest'
import {
  productSchema,
  loginSchema,
  signupSchema,
  newsletterSchema,
} from '@/lib/validations'

describe('productSchema', () => {
  const validProduct = {
    name: 'Test Product',
    tagline: 'This is a great tagline for testing',
    description: 'This is a long description that needs to be at least 50 characters to pass validation.',
    website_url: 'https://example.com',
    category_id: '550e8400-e29b-41d4-a716-446655440000',
  }

  describe('name field', () => {
    it('should accept valid name', () => {
      const result = productSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('should reject name shorter than 2 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, name: 'A' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name must be at least 2 characters')
      }
    })

    it('should reject name longer than 100 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, name: 'a'.repeat(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name must be less than 100 characters')
      }
    })

    it('should accept name with exactly 2 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, name: 'AB' })
      expect(result.success).toBe(true)
    })

    it('should accept name with exactly 100 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, name: 'a'.repeat(100) })
      expect(result.success).toBe(true)
    })
  })

  describe('tagline field', () => {
    it('should reject tagline shorter than 10 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, tagline: 'Short' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Tagline must be at least 10 characters')
      }
    })

    it('should reject tagline longer than 200 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, tagline: 'a'.repeat(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Tagline must be less than 200 characters')
      }
    })

    it('should accept tagline with exactly 10 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, tagline: '1234567890' })
      expect(result.success).toBe(true)
    })
  })

  describe('description field', () => {
    it('should reject description shorter than 50 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, description: 'Short description' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Description must be at least 50 characters')
      }
    })

    it('should reject description longer than 2000 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, description: 'a'.repeat(2001) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Description must be less than 2000 characters')
      }
    })

    it('should accept description with exactly 50 characters', () => {
      const result = productSchema.safeParse({ ...validProduct, description: 'a'.repeat(50) })
      expect(result.success).toBe(true)
    })
  })

  describe('website_url field', () => {
    it('should accept valid URL', () => {
      const result = productSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('should accept URL with https', () => {
      const result = productSchema.safeParse({ ...validProduct, website_url: 'https://secure.example.com' })
      expect(result.success).toBe(true)
    })

    it('should accept URL with http', () => {
      const result = productSchema.safeParse({ ...validProduct, website_url: 'http://example.com' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid URL', () => {
      const result = productSchema.safeParse({ ...validProduct, website_url: 'not-a-url' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid URL')
      }
    })

    it('should reject URL without protocol', () => {
      const result = productSchema.safeParse({ ...validProduct, website_url: 'example.com' })
      expect(result.success).toBe(false)
    })
  })

  describe('category_id field', () => {
    it('should accept valid UUID', () => {
      const result = productSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID', () => {
      const result = productSchema.safeParse({ ...validProduct, category_id: 'not-a-uuid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please select a category')
      }
    })

    it('should reject empty category_id', () => {
      const result = productSchema.safeParse({ ...validProduct, category_id: '' })
      expect(result.success).toBe(false)
    })
  })
})

describe('loginSchema', () => {
  const validLogin = {
    email: 'test@example.com',
    password: 'password123',
  }

  describe('email field', () => {
    it('should accept valid email', () => {
      const result = loginSchema.safeParse(validLogin)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({ ...validLogin, email: 'invalid-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid email')
      }
    })

    it('should reject email without @', () => {
      const result = loginSchema.safeParse({ ...validLogin, email: 'testexample.com' })
      expect(result.success).toBe(false)
    })

    it('should reject empty email', () => {
      const result = loginSchema.safeParse({ ...validLogin, email: '' })
      expect(result.success).toBe(false)
    })

    it('should accept email with subdomain', () => {
      const result = loginSchema.safeParse({ ...validLogin, email: 'test@mail.example.com' })
      expect(result.success).toBe(true)
    })
  })

  describe('password field', () => {
    it('should accept password with 6+ characters', () => {
      const result = loginSchema.safeParse(validLogin)
      expect(result.success).toBe(true)
    })

    it('should reject password shorter than 6 characters', () => {
      const result = loginSchema.safeParse({ ...validLogin, password: '12345' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Password must be at least 6 characters')
      }
    })

    it('should accept password with exactly 6 characters', () => {
      const result = loginSchema.safeParse({ ...validLogin, password: '123456' })
      expect(result.success).toBe(true)
    })

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({ ...validLogin, password: '' })
      expect(result.success).toBe(false)
    })
  })
})

describe('signupSchema', () => {
  const validSignup = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  }

  describe('name field', () => {
    it('should accept valid name', () => {
      const result = signupSchema.safeParse(validSignup)
      expect(result.success).toBe(true)
    })

    it('should reject name shorter than 2 characters', () => {
      const result = signupSchema.safeParse({ ...validSignup, name: 'J' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name must be at least 2 characters')
      }
    })

    it('should accept name with exactly 2 characters', () => {
      const result = signupSchema.safeParse({ ...validSignup, name: 'JD' })
      expect(result.success).toBe(true)
    })
  })

  describe('password confirmation', () => {
    it('should accept matching passwords', () => {
      const result = signupSchema.safeParse(validSignup)
      expect(result.success).toBe(true)
    })

    it('should reject non-matching passwords', () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        confirmPassword: 'different',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Passwords don't match")
      }
    })

    it('should reject when confirm password is empty', () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        confirmPassword: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('all fields validation', () => {
    it('should reject when missing all fields', () => {
      const result = signupSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should reject when missing one field', () => {
      const { name, ...noName } = validSignup
      const result = signupSchema.safeParse(noName)
      expect(result.success).toBe(false)
    })
  })
})

describe('newsletterSchema', () => {
  describe('email field', () => {
    it('should accept valid email', () => {
      const result = newsletterSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = newsletterSchema.safeParse({ email: 'invalid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid email')
      }
    })

    it('should reject empty email', () => {
      const result = newsletterSchema.safeParse({ email: '' })
      expect(result.success).toBe(false)
    })

    it('should accept email with plus sign', () => {
      const result = newsletterSchema.safeParse({ email: 'test+tag@example.com' })
      expect(result.success).toBe(true)
    })

    it('should accept email with numbers', () => {
      const result = newsletterSchema.safeParse({ email: 'test123@example.com' })
      expect(result.success).toBe(true)
    })
  })
})
