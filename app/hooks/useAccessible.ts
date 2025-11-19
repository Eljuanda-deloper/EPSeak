'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook para mejorar accesibilidad con ARIA
 * Gestiona focus, keyboard navigation, y announcements
 */

export function useAccessible() {
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Anuncia un mensaje para screen readers
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const ariaLive = document.createElement('div')
    ariaLive.setAttribute('aria-live', priority)
    ariaLive.setAttribute('aria-atomic', 'true')
    ariaLive.className = 'sr-only'
    ariaLive.textContent = message

    document.body.appendChild(ariaLive)

    // Remover después de 1 segundo
    setTimeout(() => {
      document.body.removeChild(ariaLive)
    }, 1000)
  }

  /**
   * Maneja navegación con teclado (Tab, Enter, Arrow keys)
   */
  const handleKeyboardNavigation = (
    event: React.KeyboardEvent,
    focusableElements: HTMLElement[]
  ) => {
    if (!['Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return
    }

    const currentElement = event.target as HTMLElement
    const currentIndex = focusableElements.indexOf(currentElement)

    if (event.key === 'Tab') {
      event.preventDefault()
      const nextIndex = event.shiftKey
        ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
        : (currentIndex + 1) % focusableElements.length

      focusableElements[nextIndex]?.focus()
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      currentElement.click()
    }

    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault()
      const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length
      focusableElements[prevIndex]?.focus()
    }

    if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()
      const nextIndex = (currentIndex + 1) % focusableElements.length
      focusableElements[nextIndex]?.focus()
    }
  }

  /**
   * Obtiene todos los elementos focusables
   */
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return []

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
  }

  return {
    containerRef,
    announce,
    handleKeyboardNavigation,
    getFocusableElements,
  }
}

/**
 * Hook para screen reader only content
 * Content que solo leen los screen readers
 */
export function useScreenReaderOnly() {
  return {
    className: 'sr-only',
    style: {
      position: 'absolute' as const,
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap' as const,
      border: '0',
    },
  }
}

/**
 * Hook para skip to main content
 */
export function useSkipToMain() {
  return {
    skipLinkId: 'main-content',
    linkClassName: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50',
  }
}
