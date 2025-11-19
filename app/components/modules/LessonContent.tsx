'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Lesson } from '@/types/lesson'
import type { LessonAsset } from '@/types/lesson'

interface LessonContentProps {
  lesson: Lesson
  isCompleted: boolean
}

export function LessonContent({ lesson, isCompleted }: LessonContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Text content */}
      {lesson.content && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose dark:prose-invert max-w-none"
        >
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {lesson.content}
          </div>
        </motion.div>
      )}

      {/* Assets */}
      {lesson.assets && lesson.assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {lesson.assets.map((asset, index) => (
            <LessonAssetRenderer
              key={asset.id}
              asset={asset}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {/* Completion indicator */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-center"
        >
          ✓ Esta lección ha sido completada
        </motion.div>
      )}
    </motion.div>
  )
}

function LessonAssetRenderer({
  asset,
  index,
}: {
  asset: LessonAsset
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
    >
      {asset.asset_type === 'audio' && (
        <div className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {asset.file_name}
          </p>
          <audio
            controls
            className="w-full"
            src={asset.file_url}
          >
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )}

      {asset.asset_type === 'image' && (
        <div className="p-4">
          <img
            src={asset.file_url}
            alt={asset.alt_text || 'Imagen de lección'}
            className="max-w-full h-auto rounded"
          />
          {asset.alt_text && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {asset.alt_text}
            </p>
          )}
        </div>
      )}

      {asset.asset_type === 'video' && (
        <div className="p-4">
          {asset.file_url.includes('youtube') || asset.file_url.includes('youtu.be') ? (
            <iframe
              className="w-full aspect-video rounded"
              src={asset.file_url.replace('watch?v=', 'embed/')}
              title={asset.file_name}
              frameBorder="0"
              allowFullScreen
            />
          ) : asset.file_url.includes('vimeo') ? (
            <iframe
              className="w-full aspect-video rounded"
              src={asset.file_url}
              title={asset.file_name}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <video
              controls
              className="w-full rounded"
              src={asset.file_url}
            >
              Tu navegador no soporta el elemento de video.
            </video>
          )}
        </div>
      )}
    </motion.div>
  )
}
