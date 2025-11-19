import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibleButton } from '@/app/components/accessible/AccessibleButton'
import { AccessibleInput } from '@/app/components/accessible/AccessibleInput'

describe('Accessible Components', () => {
  describe('AccessibleButton', () => {
    it('renders with aria-label', () => {
      render(
        <AccessibleButton ariaLabel="Delete item">
          Delete
        </AccessibleButton>
      )

      const button = screen.getByRole('button', { name: /delete/i })
      expect(button).toHaveAttribute('aria-label', 'Delete item')
    })

    it('handles keyboard Enter key', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()

      render(<AccessibleButton onClick={onClick}>Click me</AccessibleButton>)

      const button = screen.getByRole('button')
      await user.keyboard('{Enter}')
      
      // Focus button first
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      
      expect(onClick).toHaveBeenCalled()
    })

    it('disables when loading', () => {
      render(<AccessibleButton loading>Submit</AccessibleButton>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('respects disabled state', () => {
      const onClick = jest.fn()
      render(
        <AccessibleButton disabled onClick={onClick}>
          Disabled
        </AccessibleButton>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      fireEvent.click(button)
      expect(onClick).not.toHaveBeenCalled()
    })

    it('applies correct variant styles', () => {
      const { rerender } = render(<AccessibleButton variant="primary">Primary</AccessibleButton>)

      let button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600')

      rerender(<AccessibleButton variant="danger">Danger</AccessibleButton>)
      button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })
  })

  describe('AccessibleInput', () => {
    it('renders with label', () => {
      render(<AccessibleInput label="Email" type="email" />)

      const label = screen.getByText('Email')
      expect(label).toBeInTheDocument()
    })

    it('shows required indicator', () => {
      render(<AccessibleInput label="Name" required />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('displays error message', () => {
      render(
        <AccessibleInput
          label="Email"
          error="Invalid email address"
        />
      )

      const error = screen.getByText('Invalid email address')
      expect(error).toHaveAttribute('role', 'alert')
    })

    it('associates error with input', () => {
      render(
        <AccessibleInput
          label="Email"
          error="Invalid email"
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby')
    })

    it('shows help text', () => {
      render(
        <AccessibleInput
          label="Password"
          helpText="Must be at least 8 characters"
        />
      )

      const help = screen.getByText('Must be at least 8 characters')
      expect(help).toBeInTheDocument()
    })

    it('handles input changes', async () => {
      const user = userEvent.setup()
      render(<AccessibleInput label="Name" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'John Doe')

      expect(input).toHaveValue('John Doe')
    })
  })
})
