'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook para manejar focus management en aplicaciones complejas
 */

export function useFocusOnMount(shouldFocus = true) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (shouldFocus && ref.current) {
      // Delay pequeno para asegurar que el DOM está listo
      const timer = setTimeout(() => {
        ref.current?.focus()
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [shouldFocus])

  return ref
}

/**
 * Hook para manejar focus restoration
 * Restaura el focus al elemento anterior cuando se cierra un modal/dialog
 */
export function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const savePreviousFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }

  const restoreFocus = () => {
    previousFocusRef.current?.focus?.()
  }

  return { savePreviousFocus, restoreFocus, previousFocusRef }
}

/**
 * Hook para focus trap (mantiene focus dentro de un contenedor)
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    if (!enabled || !ref.current) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const element = ref.current
      if (!element) return

      const focusableElements = Array.from(
        element.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[]

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    ref.current?.addEventListener('keydown', handleKeyDown)

    return () => {
      ref.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, enabled])
}

/**
 * Hook para skip link (saltar al contenido principal)
 */
export function useSkipLink() {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView()
    }
  }

  return handleSkipClick
}
