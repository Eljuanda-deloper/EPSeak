'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

/**
 * Hook para lazy load de componentes cuando entran en viewport
 * Mejora performance inicial reduciendo componentes renderizados
 */
export function useLazyComponent(threshold = 0.1) {
  const [shouldRender, setShouldRender] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true, // Solo cargar una vez
  })

  useEffect(() => {
    if (inView && !shouldRender) {
      setShouldRender(true)
    }
  }, [inView, shouldRender])

  return { ref, shouldRender }
}

/**
 * Hook para virtualizar listas largas
 * Usa Intersection Observer para cargar elementos bajo demanda
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement
      const scrollTop = container.scrollTop
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 5)
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + 5
      )

      setVisibleRange({ start, end })
    }

    return () => {
      // Cleanup
    }
  }, [itemHeight, containerHeight, items.length])

  return {
    visibleItems: items.slice(visibleRange.start, visibleRange.end),
    startIndex: visibleRange.start,
  }
}

/**
 * Hook para deferring updates de estado no urgentes
 * Mejora responsiveness de la UI
 */
export function useDeferredValue<T>(value: T) {
  const [deferredValue, setDeferredValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDeferredValue(value)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [value])

  return deferredValue
}
