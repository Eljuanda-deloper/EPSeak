/**
 * Utilidades para manejo de errores en API
 */

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function handleAPIResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new APIError(
      response.status,
      error.error || `HTTP ${response.status}`,
      error
    )
  }

  return response.json()
}

export function handleError(error: unknown): string {
  if (error instanceof APIError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Error desconocido'
}

export function logError(context: string, error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}
