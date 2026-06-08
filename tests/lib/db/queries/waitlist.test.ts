import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma - use vi.hoisted to ensure it exists before vi.mock runs
const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    waitlistLead: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    newsletterSubscriber: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}))

// Mock @prisma/client so we can control PrismaClientKnownRequestError
vi.mock('@prisma/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@prisma/client')>()
  return {
    ...actual,
    Prisma: {
      ...actual.Prisma,
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        code: string
        constructor(message: string, { code }: { code: string; clientVersion: string }) {
          super(message)
          this.code = code
          this.name = 'PrismaClientKnownRequestError'
        }
      },
    },
  }
})

// Import after mocking
import {
  createWaitlistLead,
  getWaitlistLeadByEmail,
  getWaitlistLeads,
  getWaitlistLeadCount,
} from '@/lib/db/queries/waitlist'
import { Prisma } from '@prisma/client'

function makePrismaP2021Error() {
  return new Prisma.PrismaClientKnownRequestError('Table does not exist', {
    code: 'P2021',
    clientVersion: '5.0.0',
  })
}

function makePrismaOtherError() {
  return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
    code: 'P2002',
    clientVersion: '5.0.0',
  })
}

describe('Waitlist Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createWaitlistLead', () => {
    const mockLead = {
      id: 'lead-1',
      email: 'test@example.com',
      source: 'builddeck-landing',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should create a waitlist lead in the normal path', async () => {
      mockPrisma.waitlistLead.create.mockResolvedValue(mockLead)

      const result = await createWaitlistLead('test@example.com', 'builddeck-landing')

      expect(result).toEqual(mockLead)
      expect(mockPrisma.waitlistLead.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', source: 'builddeck-landing' },
      })
      expect(mockPrisma.newsletterSubscriber.create).not.toHaveBeenCalled()
    })

    it('should fall back to newsletterSubscriber on P2021 error', async () => {
      const mockSubscriber = { ...mockLead }
      mockPrisma.waitlistLead.create.mockRejectedValue(makePrismaP2021Error())
      mockPrisma.newsletterSubscriber.create.mockResolvedValue(mockSubscriber)

      const result = await createWaitlistLead('test@example.com', 'builddeck-landing')

      expect(result).toEqual(mockSubscriber)
      expect(mockPrisma.newsletterSubscriber.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', source: 'builddeck-landing' },
      })
    })

    it('should use default source in fallback when none provided', async () => {
      mockPrisma.waitlistLead.create.mockRejectedValue(makePrismaP2021Error())
      mockPrisma.newsletterSubscriber.create.mockResolvedValue(mockLead)

      await createWaitlistLead('test@example.com')

      expect(mockPrisma.newsletterSubscriber.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', source: 'builddeck-landing' },
      })
    })

    it('should rethrow non-P2021 errors', async () => {
      mockPrisma.waitlistLead.create.mockRejectedValue(makePrismaOtherError())

      await expect(createWaitlistLead('test@example.com')).rejects.toMatchObject({
        code: 'P2002',
      })
      expect(mockPrisma.newsletterSubscriber.create).not.toHaveBeenCalled()
    })
  })

  describe('getWaitlistLeadByEmail', () => {
    const mockLead = {
      id: 'lead-1',
      email: 'test@example.com',
      source: 'builddeck-landing',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should return a waitlist lead in the normal path', async () => {
      mockPrisma.waitlistLead.findUnique.mockResolvedValue(mockLead)

      const result = await getWaitlistLeadByEmail('test@example.com')

      expect(result).toEqual(mockLead)
      expect(mockPrisma.waitlistLead.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })

    it('should fall back to newsletterSubscriber on P2021 error', async () => {
      const mockSubscriber = { ...mockLead }
      mockPrisma.waitlistLead.findUnique.mockRejectedValue(makePrismaP2021Error())
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(mockSubscriber)

      const result = await getWaitlistLeadByEmail('test@example.com')

      expect(result).toEqual(mockSubscriber)
      expect(mockPrisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true, email: true, source: true, createdAt: true, updatedAt: true },
      })
    })

    it('should return null from fallback when subscriber not found', async () => {
      mockPrisma.waitlistLead.findUnique.mockRejectedValue(makePrismaP2021Error())
      mockPrisma.newsletterSubscriber.findUnique.mockResolvedValue(null)

      const result = await getWaitlistLeadByEmail('test@example.com')

      expect(result).toBeNull()
    })

    it('should rethrow non-P2021 errors', async () => {
      mockPrisma.waitlistLead.findUnique.mockRejectedValue(makePrismaOtherError())

      await expect(getWaitlistLeadByEmail('test@example.com')).rejects.toMatchObject({
        code: 'P2002',
      })
    })
  })

  describe('getWaitlistLeads', () => {
    const mockLeads = [
      { id: 'lead-1', email: 'a@example.com', source: 'builddeck-landing', createdAt: new Date(), updatedAt: new Date() },
      { id: 'lead-2', email: 'b@example.com', source: 'builddeck-landing', createdAt: new Date(), updatedAt: new Date() },
    ]

    it('should return waitlist leads in the normal path', async () => {
      mockPrisma.waitlistLead.findMany.mockResolvedValue(mockLeads)

      const result = await getWaitlistLeads()

      expect(result).toEqual(mockLeads)
      expect(mockPrisma.waitlistLead.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should fall back to newsletterSubscriber on P2021 error', async () => {
      mockPrisma.waitlistLead.findMany.mockRejectedValue(makePrismaP2021Error())
      mockPrisma.newsletterSubscriber.findMany.mockResolvedValue(mockLeads)

      const result = await getWaitlistLeads()

      expect(result).toEqual(mockLeads)
      expect(mockPrisma.newsletterSubscriber.findMany).toHaveBeenCalledWith({
        where: { source: 'builddeck-landing' },
        select: { id: true, email: true, source: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should rethrow non-P2021 errors', async () => {
      mockPrisma.waitlistLead.findMany.mockRejectedValue(makePrismaOtherError())

      await expect(getWaitlistLeads()).rejects.toMatchObject({ code: 'P2002' })
    })
  })

  describe('getWaitlistLeadCount', () => {
    it('should return count in the normal path', async () => {
      mockPrisma.waitlistLead.count.mockResolvedValue(42)

      const result = await getWaitlistLeadCount()

      expect(result).toBe(42)
      expect(mockPrisma.waitlistLead.count).toHaveBeenCalled()
    })

    it('should fall back to newsletterSubscriber count on P2021 error', async () => {
      mockPrisma.waitlistLead.count.mockRejectedValue(makePrismaP2021Error())
      mockPrisma.newsletterSubscriber.count.mockResolvedValue(10)

      const result = await getWaitlistLeadCount()

      expect(result).toBe(10)
      expect(mockPrisma.newsletterSubscriber.count).toHaveBeenCalledWith({
        where: { source: 'builddeck-landing' },
      })
    })

    it('should rethrow non-P2021 errors', async () => {
      mockPrisma.waitlistLead.count.mockRejectedValue(makePrismaOtherError())

      await expect(getWaitlistLeadCount()).rejects.toMatchObject({ code: 'P2002' })
    })
  })
})
