/**
 * Centralized Error Handling Module
 * 
 * Provides consistent error handling, logging, and user-friendly error messages
 * across the application.
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: unknown;
  statusCode?: number;
}

// User-friendly error messages mapping
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  NOT_FOUND: 'The requested resource was not found.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  EXTERNAL_SERVICE_ERROR: 'An external service is temporarily unavailable.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};

// HTTP status codes mapping
const ERROR_STATUS_CODES: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  AUTH_ERROR: 401,
  NOT_FOUND: 404,
  PERMISSION_DENIED: 403,
  DATABASE_ERROR: 500,
  NETWORK_ERROR: 503,
  RATE_LIMITED: 429,
  EXTERNAL_SERVICE_ERROR: 502,
  UNKNOWN_ERROR: 500,
};

/**
 * Create a structured application error
 */
export function createError(
  code: ErrorCode,
  customMessage?: string,
  details?: unknown
): AppError {
  return {
    code,
    message: customMessage || ERROR_MESSAGES[code],
    details,
    statusCode: ERROR_STATUS_CODES[code],
  };
}

/**
 * Check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Parse unknown errors into AppError format
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return error;
  }

  // Standard Error object
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('NEXT_REDIRECT')) {
      // This is not really an error, rethrow
      throw error;
    }

    if (error.message.includes('Unauthorized') || error.message.includes('unauthenticated')) {
      return createError('AUTH_ERROR');
    }

    if (error.message.includes('not found') || error.message.includes('404')) {
      return createError('NOT_FOUND');
    }

    if (error.message.includes('permission') || error.message.includes('forbidden')) {
      return createError('PERMISSION_DENIED');
    }

    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return createError('RATE_LIMITED');
    }

    if (error.message.includes('database') || error.message.includes('prisma')) {
      return createError('DATABASE_ERROR', undefined, error.message);
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return createError('NETWORK_ERROR');
    }

    return createError('UNKNOWN_ERROR', error.message);
  }

  // String error
  if (typeof error === 'string') {
    return createError('UNKNOWN_ERROR', error);
  }

  // Unknown error type
  return createError('UNKNOWN_ERROR');
}

/**
 * Get user-friendly message from any error
 */
export function getErrorMessage(error: unknown): string {
  const appError = parseError(error);
  return appError.message;
}

/**
 * Log error with context (safe for server/client)
 */
export function logError(
  error: unknown,
  context?: {
    action?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  const appError = isAppError(error) ? error : parseError(error);
  
  const logPayload = {
    timestamp: new Date().toISOString(),
    code: appError.code,
    message: appError.message,
    details: appError.details,
    ...context,
  };

  // In production, you might send to a logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service (e.g., Sentry, LogRocket)
    console.error('[ERROR]', JSON.stringify(logPayload));
  } else {
    console.error('[ERROR]', logPayload);
  }
}

// Specific error creators for common cases
export const Errors = {
  validation: (message?: string) => createError('VALIDATION_ERROR', message),
  auth: (message?: string) => createError('AUTH_ERROR', message || 'You must be logged in'),
  notFound: (resource?: string) =>
    createError('NOT_FOUND', resource ? `${resource} not found` : undefined),
  permissionDenied: () => createError('PERMISSION_DENIED', 'Not authorized'),
  database: (details?: unknown) => createError('DATABASE_ERROR', undefined, details),
  rateLimited: () => createError('RATE_LIMITED'),
  externalService: (service?: string) =>
    createError('EXTERNAL_SERVICE_ERROR', service ? `${service} is unavailable` : undefined),
};

/**
 * Async wrapper that catches and handles errors
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: { action?: string; userId?: string }
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    // Allow redirects to pass through
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    logError(error, context);
    const appError = parseError(error);
    return { success: false, error: appError.message };
  }
}

/**
 * Validation helper - throws AppError if validation fails
 */
export function validateOrThrow<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; error?: { errors: Array<{ message: string }> }; data?: T } },
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw createError(
      'VALIDATION_ERROR',
      result.error?.errors[0]?.message || 'Validation failed'
    );
  }
  return result.data as T;
}

/**
 * Check required auth or throw
 */
export function requireAuthOrThrow(session: { user?: { id?: string } } | null): asserts session is { user: { id: string } } {
  if (!session?.user?.id) {
    throw Errors.auth();
  }
}

/**
 * Check admin role or throw
 */
export function requireAdminOrThrow(session: { user?: { id?: string; role?: string } } | null): void {
  requireAuthOrThrow(session);
  if ((session as { user: { role?: string } }).user.role !== 'ADMIN') {
    throw Errors.permissionDenied();
  }
}
