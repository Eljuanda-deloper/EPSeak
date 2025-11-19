'use client'

import { useSkipLink } from '@/app/hooks/useFocusManagement'

/**
 * Componente Skip Link
 * Permite a usuarios de teclado saltarse directamente al contenido principal
 * WCAG 2.1 Criterion 2.4.1 (Bypass Blocks) - Level A
 */
export function SkipLink() {
  const handleSkipClick = useSkipLink()

  return (
    <a
      href="#main-content"
      onClick={handleSkipClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-b-lg"
    >
      Ir al contenido principal
    </a>
  )
}

/**
 * CSS para screen reader only content
 * Agregarse al global CSS:
 * 
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border-width: 0;
 * }
 * 
 * .focus\:not-sr-only:focus {
 *   position: static;
 *   width: auto;
 *   height: auto;
 *   padding: inherit;
 *   margin: inherit;
 *   overflow: visible;
 *   clip: auto;
 *   white-space: normal;
 * }
 */
