'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Lesson } from '@/types/lesson'
import { AssetRendererWithLazyLoad } from '../renderers/AssetRendererWithLazyLoad'

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
          className="space-y-6"
        >
          {lesson.assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <AssetRendererWithLazyLoad asset={asset} />
            </motion.div>
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
