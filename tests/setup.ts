import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach, vi } from 'vitest'

// Mock environment variables
vi.stubEnv('RESEND_API_KEY', 'test-api-key')
vi.stubEnv('SOCIAL_MOCK_MODE', 'true')
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test')
vi.stubEnv('NEXTAUTH_SECRET', 'test-secret')
vi.stubEnv('NEXTAUTH_URL', 'http://localhost:3000')

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(),
}))

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})
