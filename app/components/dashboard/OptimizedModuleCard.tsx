'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface OptimizedModuleCardProps {
  id: string
  title: string
  description: string
  completionPercentage: number
  isUnlocked: boolean
  imageUrl?: string
  areaOfInterest: string
  lessonsCount: number
}

export default function OptimizedModuleCard({
  id,
  title,
  description,
  completionPercentage,
  isUnlocked,
  imageUrl,
  areaOfInterest,
  lessonsCount,
}: OptimizedModuleCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full"
    >
      <Link href={isUnlocked ? `/dashboard/modules/${id}` : '#'}>
        <div
          className={`h-full rounded-lg border transition-all duration-300 ${
            isUnlocked
              ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer bg-white'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-75'
          }`}
        >
          {/* Image Container - Optimized */}
          <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden rounded-t-lg">
            {imageUrl && !imageError ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={false}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {/* Lock Badge */}
            {!isUnlocked && (
              <div className="absolute top-3 right-3 bg-orange-100 rounded-full p-2">
                <Lock className="w-4 h-4 text-orange-600" />
              </div>
            )}

            {/* Area Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                {areaOfInterest}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
              {description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
              <span>{lessonsCount} lecciones</span>
              <span>{completionPercentage}% completado</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {isUnlocked ? (
                <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </span>
              ) : (
                <span className="text-gray-400 text-sm font-medium">
                  Bloqueado
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
