'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LessonAsset } from '@/types/modules'

interface ImageGalleryProps {
  assets: LessonAsset[]
  className?: string
}

export function ImageGallery({ assets, className = '' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!assets || assets.length === 0) return null

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < assets.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {assets.map((asset, index) => (
          <button
            key={asset.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <Image
              src={asset.file_url}
              alt={asset.alt_text || asset.file_name}
              fill
              className="object-cover group-hover:scale-110 transition-transform"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100">Ver</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              aria-label="Cerrar"
            >
              <X size={32} className="text-white" />
            </button>

            <motion.div
              className="relative max-w-4xl max-h-[90vh] aspect-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <Image
                src={assets[selectedIndex].file_url}
                alt={assets[selectedIndex].alt_text || assets[selectedIndex].file_name}
                width={1200}
                height={800}
                className="w-full h-full object-contain"
              />

              {assets.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    disabled={selectedIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all disabled:opacity-50"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft size={32} className="text-white" />
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={selectedIndex === assets.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all disabled:opacity-50"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight size={32} className="text-white" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-4 py-2 rounded-full text-white text-sm">
                    {selectedIndex + 1} / {assets.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
