import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createError,
  isAppError,
  parseError,
  getErrorMessage,
  logError,
  Errors,
  withErrorHandling,
  validateOrThrow,
  requireAuthOrThrow,
  requireAdminOrThrow,
} from '@/lib/errors'

describe('Error Handling Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createError', () => {
    it('should create an error with default message', () => {
      const error = createError('AUTH_ERROR')
      expect(error.code).toBe('AUTH_ERROR')
      expect(error.message).toBe('Authentication failed. Please login again.')
      expect(error.statusCode).toBe(401)
    })

    it('should create an error with custom message', () => {
      const error = createError('AUTH_ERROR', 'Custom auth message')
      expect(error.message).toBe('Custom auth message')
    })

    it('should include details when provided', () => {
      const details = { field: 'email' }
      const error = createError('VALIDATION_ERROR', undefined, details)
      expect(error.details).toEqual(details)
    })

    it('should set correct status codes for each error type', () => {
      expect(createError('VALIDATION_ERROR').statusCode).toBe(400)
      expect(createError('AUTH_ERROR').statusCode).toBe(401)
      expect(createError('NOT_FOUND').statusCode).toBe(404)
      expect(createError('PERMISSION_DENIED').statusCode).toBe(403)
      expect(createError('DATABASE_ERROR').statusCode).toBe(500)
      expect(createError('RATE_LIMITED').statusCode).toBe(429)
    })
  })

  describe('isAppError', () => {
    it('should return true for AppError objects', () => {
      const error = createError('AUTH_ERROR')
      expect(isAppError(error)).toBe(true)
    })

    it('should return false for standard Error', () => {
      expect(isAppError(new Error('test'))).toBe(false)
    })

    it('should return false for null', () => {
      expect(isAppError(null)).toBe(false)
    })

    it('should return false for string', () => {
      expect(isAppError('error')).toBe(false)
    })

    it('should return false for object without required props', () => {
      expect(isAppError({ code: 'ERROR' })).toBe(false)
      expect(isAppError({ message: 'error' })).toBe(false)
    })
  })

  describe('parseError', () => {
    it('should return AppError as-is', () => {
      const appError = createError('NOT_FOUND')
      expect(parseError(appError)).toBe(appError)
    })

    it('should parse auth-related errors', () => {
      const error = new Error('Unauthorized access')
      const parsed = parseError(error)
      expect(parsed.code).toBe('AUTH_ERROR')
    })

    it('should parse not found errors', () => {
      const error = new Error('Resource not found')
      const parsed = parseError(error)
      expect(parsed.code).toBe('NOT_FOUND')
    })

    it('should parse permission errors', () => {
      const error = new Error('permission denied')
      const parsed = parseError(error)
      expect(parsed.code).toBe('PERMISSION_DENIED')
    })

    it('should parse rate limit errors', () => {
      const error = new Error('rate limit exceeded')
      const parsed = parseError(error)
      expect(parsed.code).toBe('RATE_LIMITED')
    })

    it('should parse database errors', () => {
      const error = new Error('prisma query failed')
      const parsed = parseError(error)
      expect(parsed.code).toBe('DATABASE_ERROR')
    })

    it('should parse network errors', () => {
      const error = new Error('network request failed')
      const parsed = parseError(error)
      expect(parsed.code).toBe('NETWORK_ERROR')
    })

    it('should parse string errors', () => {
      const parsed = parseError('Something went wrong')
      expect(parsed.code).toBe('UNKNOWN_ERROR')
      expect(parsed.message).toBe('Something went wrong')
    })

    it('should rethrow NEXT_REDIRECT errors', () => {
      const error = new Error('NEXT_REDIRECT')
      expect(() => parseError(error)).toThrow('NEXT_REDIRECT')
    })

    it('should handle unknown error types', () => {
      const parsed = parseError(undefined)
      expect(parsed.code).toBe('UNKNOWN_ERROR')
    })
  })

  describe('getErrorMessage', () => {
    it('should return message from AppError', () => {
      const error = createError('AUTH_ERROR', 'Custom message')
      expect(getErrorMessage(error)).toBe('Custom message')
    })

    it('should return message from standard Error', () => {
      expect(getErrorMessage(new Error('Test error'))).toBe('Test error')
    })

    it('should return default message for unknown errors', () => {
      expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.')
    })
  })

  describe('logError', () => {
    it('should log error with context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      logError(new Error('Test error'), {
        action: 'createProduct',
        userId: 'user-1',
      })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should log AppError details', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const error = createError('DATABASE_ERROR', undefined, { query: 'SELECT *' })
      logError(error)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Errors factory', () => {
    it('should create validation error', () => {
      const error = Errors.validation('Invalid email')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.message).toBe('Invalid email')
    })

    it('should create auth error', () => {
      const error = Errors.auth()
      expect(error.code).toBe('AUTH_ERROR')
      expect(error.message).toBe('You must be logged in')
    })

    it('should create not found error with resource', () => {
      const error = Errors.notFound('Product')
      expect(error.code).toBe('NOT_FOUND')
      expect(error.message).toBe('Product not found')
    })

    it('should create permission denied error', () => {
      const error = Errors.permissionDenied()
      expect(error.code).toBe('PERMISSION_DENIED')
      expect(error.message).toBe('Not authorized')
    })

    it('should create database error with details', () => {
      const error = Errors.database({ query: 'failed' })
      expect(error.code).toBe('DATABASE_ERROR')
      expect(error.details).toEqual({ query: 'failed' })
    })

    it('should create rate limited error', () => {
      const error = Errors.rateLimited()
      expect(error.code).toBe('RATE_LIMITED')
    })

    it('should create external service error', () => {
      const error = Errors.externalService('Twitter API')
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR')
      expect(error.message).toBe('Twitter API is unavailable')
    })
  })

  describe('withErrorHandling', () => {
    it('should return success with data on success', async () => {
      const result = await withErrorHandling(async () => ({ id: 1, name: 'Test' }))
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ id: 1, name: 'Test' })
      }
    })

    it('should return error on failure', async () => {
      const result = await withErrorHandling(async () => {
        throw new Error('Test error')
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Test error')
      }
    })

    it('should rethrow NEXT_REDIRECT', async () => {
      await expect(
        withErrorHandling(async () => {
          throw new Error('NEXT_REDIRECT:/dashboard')
        })
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    it('should log errors with context', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await withErrorHandling(
        async () => {
          throw new Error('Test')
        },
        { action: 'testAction', userId: 'user-1' }
      )

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('validateOrThrow', () => {
    const mockSchema = {
      safeParse: (data: unknown) => {
        if (typeof data === 'object' && data !== null && 'email' in data) {
          return { success: true, data }
        }
        return {
          success: false,
          error: { errors: [{ message: 'Email is required' }] },
        }
      },
    }

    it('should return data on valid input', () => {
      const result = validateOrThrow(mockSchema, { email: 'test@example.com' })
      expect(result).toEqual({ email: 'test@example.com' })
    })

    it('should throw validation error on invalid input', () => {
      expect(() => validateOrThrow(mockSchema, {})).toThrow()
      
      try {
        validateOrThrow(mockSchema, {})
      } catch (error) {
        expect(isAppError(error)).toBe(true)
        if (isAppError(error)) {
          expect(error.code).toBe('VALIDATION_ERROR')
          expect(error.message).toBe('Email is required')
        }
      }
    })
  })

  describe('requireAuthOrThrow', () => {
    it('should not throw for valid session', () => {
      expect(() => {
        requireAuthOrThrow({ user: { id: 'user-1' } })
      }).not.toThrow()
    })

    it('should throw for null session', () => {
      expect(() => requireAuthOrThrow(null)).toThrow()
    })

    it('should throw for session without user', () => {
      expect(() => requireAuthOrThrow({ user: undefined })).toThrow()
    })

    it('should throw for session without user id', () => {
      expect(() => requireAuthOrThrow({ user: {} })).toThrow()
    })

    it('should throw AUTH_ERROR', () => {
      try {
        requireAuthOrThrow(null)
      } catch (error) {
        expect(isAppError(error)).toBe(true)
        if (isAppError(error)) {
          expect(error.code).toBe('AUTH_ERROR')
        }
      }
    })
  })

  describe('requireAdminOrThrow', () => {
    it('should not throw for admin user', () => {
      expect(() => {
        requireAdminOrThrow({ user: { id: 'user-1', role: 'ADMIN' } })
      }).not.toThrow()
    })

    it('should throw for non-admin user', () => {
      expect(() => {
        requireAdminOrThrow({ user: { id: 'user-1', role: 'USER' } })
      }).toThrow()
    })

    it('should throw AUTH_ERROR for null session', () => {
      try {
        requireAdminOrThrow(null)
      } catch (error) {
        expect(isAppError(error)).toBe(true)
        if (isAppError(error)) {
          expect(error.code).toBe('AUTH_ERROR')
        }
      }
    })

    it('should throw PERMISSION_DENIED for non-admin', () => {
      try {
        requireAdminOrThrow({ user: { id: 'user-1', role: 'USER' } })
      } catch (error) {
        expect(isAppError(error)).toBe(true)
        if (isAppError(error)) {
          expect(error.code).toBe('PERMISSION_DENIED')
        }
      }
    })
  })
})
