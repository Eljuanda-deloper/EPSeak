'use client'

import React, { InputHTMLAttributes } from 'react'

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  helpText?: string
  autoComplete?: string
}

/**
 * Input accesible con ARIA labels y manejo de errores
 */
export const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      error,
      required = false,
      helpText,
      id,
      type = 'text',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helpId = helpText ? `${inputId}-help` : undefined
    const describedBy = [errorId, helpId].filter(Boolean).join(' ')

    return (
      <div className="mb-4">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span aria-label="required">*</span>}
        </label>

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          aria-required={required}
          className={`
            w-full px-3 py-2 border rounded-lg
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <div id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {helpText && !error && (
          <div id={helpId} className="mt-1 text-sm text-gray-500">
            {helpText}
          </div>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'
