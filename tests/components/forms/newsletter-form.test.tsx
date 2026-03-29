import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewsletterForm } from '@/components/forms/newsletter-form'

// Mock the newsletter action
const mockSubscribeToNewsletter = vi.fn()

vi.mock('@/actions/newsletter', () => ({
  subscribeToNewsletter: (...args: unknown[]) => mockSubscribeToNewsletter(...args),
}))

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form with email input and subscribe button', () => {
    render(<NewsletterForm />)

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('should update email input value on change', () => {
    render(<NewsletterForm />)

    const input = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })

    expect(input).toHaveValue('test@example.com')
  })

  it('should call subscribeToNewsletter on form submit', async () => {
    mockSubscribeToNewsletter.mockResolvedValue({ success: true })
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(mockSubscribeToNewsletter).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('should show success message after successful subscription', async () => {
    mockSubscribeToNewsletter.mockResolvedValue({ success: true })
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument()
    })
  })

  it('should clear email input after successful subscription', async () => {
    mockSubscribeToNewsletter.mockResolvedValue({ success: true })
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument()
    })
    
    // Form should be replaced by success message
    expect(screen.queryByPlaceholderText('Enter your email')).not.toBeInTheDocument()
  })

  it('should show error message on failed subscription', async () => {
    mockSubscribeToNewsletter.mockResolvedValue({
      success: false,
      error: 'Already subscribed',
    })
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(screen.getByText('Already subscribed')).toBeInTheDocument()
    })
  })

  it('should show default error message when no error provided', async () => {
    mockSubscribeToNewsletter.mockResolvedValue({ success: false })
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  it('should disable input while loading', async () => {
    mockSubscribeToNewsletter.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    )
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(screen.getByPlaceholderText('Enter your email')).toBeDisabled()
  })

  it('should require email input', () => {
    render(<NewsletterForm />)

    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toHaveAttribute('required')
  })

  it('should validate email type', () => {
    render(<NewsletterForm />)

    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toHaveAttribute('type', 'email')
  })
})
