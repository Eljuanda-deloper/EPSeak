'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  description?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

/**
 * Modal accesible con manejo de focus y keyboard (ESC para cerrar)
 */
export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  description,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalTitleId = ariaLabelledBy || `modal-title-${Math.random().toString(36).substr(2, 9)}`
  const modalDescId = ariaDescribedBy || `modal-desc-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    if (!isOpen) return

    // Guardar el elemento que tenía focus
    const previousActiveElement = document.activeElement as HTMLElement

    // Enfocar el botón de cerrar cuando se abre el modal
    closeButtonRef.current?.focus()

    // Trap focus dentro del modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ) as HTMLElement[]

        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        const activeElement = document.activeElement

        if (e.shiftKey && activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
      previousActiveElement?.focus()
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={description ? modalDescId : undefined}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Cerrar diálogo"
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 id={modalTitleId} className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p id={modalDescId} className="text-gray-600 text-sm mb-4">
                {description}
              </p>
            )}

            {/* Content */}
            <div className="mb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
