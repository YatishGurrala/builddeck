import { describe, it, expect } from 'vitest'
import { generateDrafts } from '@/lib/social/draft-generator'

describe('generateDrafts', () => {
  const mockProduct = {
    name: 'TestApp',
    tagline: 'A revolutionary testing application',
    description: 'This is a comprehensive testing application that helps developers write better tests faster.',
    websiteUrl: 'https://testapp.com',
    category: { name: 'Developer Tools' },
  }

  it('should generate drafts for both platforms', () => {
    const drafts = generateDrafts(mockProduct)
    expect(drafts).toHaveLength(2)
    expect(drafts.map(d => d.platform)).toContain('X')
    expect(drafts.map(d => d.platform)).toContain('LINKEDIN')
  })

  it('should include product name in X draft', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content).toContain('TestApp')
  })

  it('should include product name in LinkedIn draft', () => {
    const drafts = generateDrafts(mockProduct)
    const linkedInDraft = drafts.find(d => d.platform === 'LINKEDIN')
    expect(linkedInDraft?.content).toContain('TestApp')
  })

  it('should include tagline in drafts', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content.toLowerCase()).toContain('revolutionary')
  })

  it('should include website URL', () => {
    const drafts = generateDrafts(mockProduct)
    drafts.forEach(draft => {
      expect(draft.content).toContain('https://testapp.com')
    })
  })

  it('should respect X character limit (280)', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content.length).toBeLessThanOrEqual(280)
  })

  it('should include BuildDeck hashtag in X draft', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content).toContain('#BuildDeck')
  })

  it('should include category hashtag when available', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content).toContain('#DeveloperTools')
  })

  it('should handle product without category', () => {
    const productNoCategory = {
      ...mockProduct,
      category: null,
    }
    const drafts = generateDrafts(productNoCategory)
    expect(drafts).toHaveLength(2)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content).toBeDefined()
  })

  it('should handle product without description', () => {
    const productNoDesc = {
      ...mockProduct,
      description: null,
    }
    const drafts = generateDrafts(productNoDesc)
    expect(drafts).toHaveLength(2)
    const linkedInDraft = drafts.find(d => d.platform === 'LINKEDIN')
    expect(linkedInDraft?.content).toBeDefined()
  })

  it('should generate longer content for LinkedIn than X', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    const linkedInDraft = drafts.find(d => d.platform === 'LINKEDIN')
    
    // LinkedIn posts should generally be longer
    expect(linkedInDraft!.content.length).toBeGreaterThan(xDraft!.content.length)
  })

  it('should truncate very long taglines for X', () => {
    const productLongTagline = {
      ...mockProduct,
      tagline: 'A'.repeat(150), // Very long tagline
    }
    const drafts = generateDrafts(productLongTagline)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content.length).toBeLessThanOrEqual(280)
  })

  it('should include emoji in X draft', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content).toMatch(/🚀|👉/)
  })

  it('should include emoji in LinkedIn draft', () => {
    const drafts = generateDrafts(mockProduct)
    const linkedInDraft = drafts.find(d => d.platform === 'LINKEDIN')
    expect(linkedInDraft?.content).toMatch(/🎉|💡/)
  })

  it('should handle multi-word category names', () => {
    const productMultiWordCat = {
      ...mockProduct,
      category: { name: 'AI & Machine Learning' },
    }
    const drafts = generateDrafts(productMultiWordCat)
    const xDraft = drafts.find(d => d.platform === 'X')
    // Should create a camelCase hashtag
    expect(xDraft?.content).toMatch(/#[A-Za-z]+/)
  })

  it('should include IndieHacker or Startup hashtag for X', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    expect(xDraft?.content).toMatch(/#IndieHacker|#Startup/)
  })
})

describe('draft content quality', () => {
  const mockProduct = {
    name: 'AwesomeApp',
    tagline: 'Make your life easier with automation',
    description: 'AwesomeApp is a tool that automates repetitive tasks and saves you hours every week.',
    websiteUrl: 'https://awesomeapp.io',
    category: { name: 'Productivity' },
  }

  it('should create readable X content', () => {
    const drafts = generateDrafts(mockProduct)
    const xDraft = drafts.find(d => d.platform === 'X')
    
    // Should not be empty
    expect(xDraft?.content.length).toBeGreaterThan(50)
    
    // Should contain newlines for formatting
    expect(xDraft?.content).toContain('\n')
  })

  it('should create professional LinkedIn content', () => {
    const drafts = generateDrafts(mockProduct)
    const linkedInDraft = drafts.find(d => d.platform === 'LINKEDIN')
    
    // Should be longer than X post
    expect(linkedInDraft?.content.length).toBeGreaterThan(100)
    
    // Should have proper formatting with newlines
    expect(linkedInDraft?.content).toContain('\n')
  })

  it('should not exceed LinkedIn character limit (3000)', () => {
    const productLongDesc = {
      ...mockProduct,
      description: 'A'.repeat(2500),
    }
    const drafts = generateDrafts(productLongDesc)
    const linkedInDraft = drafts.find(d => d.platform === 'LINKEDIN')
    expect(linkedInDraft?.content.length).toBeLessThanOrEqual(3000)
  })
})
