import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverProps {
  threshold?: number | number[]
  rootMargin?: string
}

/**
 * Hook para lazy loading de assets usando Intersection Observer
 * Detecta cuando un elemento entra al viewport y dispara callback
 */
export function useIntersectionObserver<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = '50px',
}: UseIntersectionObserverProps = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Stop observing after first intersection
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
