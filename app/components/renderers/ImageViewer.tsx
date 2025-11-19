'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageViewerProps {
  src: string
  alt: string
  title?: string
  width?: number
  height?: number
  className?: string
}

/**
 * ImageViewer - Visor de imágenes con lightbox y zoom
 * Soporta: lightbox, zoom, fallback
 */
export function ImageViewer({
  src,
  alt,
  title,
  width = 800,
  height = 600,
  className = '',
}: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState(false)

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      const newZoom = direction === 'in' ? prev + 0.2 : prev - 0.2
      return Math.max(1, Math.min(3, newZoom))
    })
  }

  if (error) {
    return (
      <div className={`rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center ${className}`}>
        <p className="text-gray-500">Error al cargar imagen</p>
        <p className="mt-1 text-xs text-gray-400">{alt}</p>
      </div>
    )
  }

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover transition hover:brightness-110"
          onError={() => setError(true)}
          priority={false}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition hover:bg-black/20">
          <ZoomIn className="text-white opacity-0 transition group-hover:opacity-100" size={32} />
        </div>
        {title && (
          <p className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 text-xs text-white">
            {title}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Image */}
            <div className="relative overflow-auto rounded-lg bg-white">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="h-auto w-auto"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-3">
              <button
                onClick={() => handleZoom('out')}
                disabled={zoom <= 1}
                className="rounded-lg bg-white/20 p-2 text-white disabled:opacity-50 hover:bg-white/30 transition"
                aria-label="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <span className="flex items-center px-3 text-sm text-white font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom('in')}
                disabled={zoom >= 3}
                className="rounded-lg bg-white/20 p-2 text-white disabled:opacity-50 hover:bg-white/30 transition"
                aria-label="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
            </div>

            {/* Image info */}
            {title && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white">
                {title}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
