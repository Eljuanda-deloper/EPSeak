import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createClient } from '@supabase/supabase-js'

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('completes full registration and login flow', async () => {
    // Mock successful registration
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    })

    // Mock successful login
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'token123' },
      },
      error: null,
    })

    // Mock profile creation
    mockSupabaseClient.from.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { id: '123', username: 'testuser' },
            error: null,
          }),
        })),
      })),
    })

    // Import components after mocks are set up
    const { default: RegisterForm } = await import('@/app/components/auth/RegisterForm')
    const { default: LoginForm } = await import('@/app/components/auth/LoginForm')

    // Test registration
    render(<RegisterForm />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    const registerButton = screen.getByRole('button', { name: /crear cuenta/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'password123')

    await userEvent.click(registerButton)

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // Test login after registration
    render(<LoginForm />)

    const loginEmailInput = screen.getByLabelText(/correo electrónico/i)
    const loginPasswordInput = screen.getByLabelText(/contraseña/i)
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(loginEmailInput, 'test@example.com')
    await userEvent.type(loginPasswordInput, 'password123')

    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('handles authentication errors gracefully', async () => {
    // Mock registration error
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Email already registered' },
    })

    const { default: RegisterForm } = await import('@/app/components/auth/RegisterForm')

    render(<RegisterForm />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    const registerButton = screen.getByRole('button', { name: /crear cuenta/i })

    await userEvent.type(emailInput, 'existing@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'password123')

    await userEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument()
    })
  })

  it('validates form inputs correctly', async () => {
    const { default: RegisterForm } = await import('@/app/components/auth/RegisterForm')

    render(<RegisterForm />)

    const passwordInput = screen.getByLabelText(/contraseña/i)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    const registerButton = screen.getByRole('button', { name: /crear cuenta/i })

    // Test password mismatch
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'differentpassword')

    await userEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
    })

    // Test short password
    await userEvent.clear(passwordInput)
    await userEvent.clear(confirmPasswordInput)
    await userEvent.type(passwordInput, '123')
    await userEvent.type(confirmPasswordInput, '123')

    await userEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    })
  })
})