import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/app/components/auth/LoginForm'

// Mock del contexto de autenticación
const mockSignIn = jest.fn()
jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    loading: false,
    user: null,
  }),
}))

// Mock del router de Next.js
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    mockSignIn.mockClear()
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    // Los campos requeridos deberían mostrar error de validación HTML5
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('calls signIn with correct credentials', async () => {
    mockSignIn.mockResolvedValue({ error: null })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows error message on login failure', async () => {
    mockSignIn.mockResolvedValue({ error: 'Credenciales inválidas' })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)))

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    await waitFor(() => {
      expect(screen.queryByText('Iniciando sesión...')).not.toBeInTheDocument()
    })
  })

  it('handles network errors gracefully', async () => {
    mockSignIn.mockRejectedValue(new Error('Network error'))

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Error inesperado. Por favor, intenta de nuevo.')).toBeInTheDocument()
    })
  })
})