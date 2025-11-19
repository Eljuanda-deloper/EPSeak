'use client'

import React from 'react'
import { LessonWithAssets } from '@/types/modules'
import { TextContent } from './TextContent'
import { AudioPlayer } from './AudioPlayer'
import { VideoPlayer } from './VideoPlayer'
import { ImageGallery } from './ImageGallery'

interface LessonContentProps {
  lesson: LessonWithAssets
  className?: string
}

export function LessonContent({ lesson, className = '' }: LessonContentProps) {
  const audioAssets = lesson.assets.filter(a => a.type === 'audio')
  const imageAssets = lesson.assets.filter(a => a.type === 'image')
  const videoAssets = lesson.assets.filter(a => a.type === 'video')

  return (
    <main className={`space-y-8 ${className}`}>
      {/* Main content */}
      {lesson.content_text && (
        <TextContent content={lesson.content_text} title={lesson.title} />
      )}

      {/* Audio content */}
      {audioAssets.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Audio</h2>
          <div className="space-y-4">
            {audioAssets.map((asset) => (
              <AudioPlayer key={asset.id} src={asset.file_url} title={asset.file_name} />
            ))}
          </div>
        </section>
      )}

      {/* Video content */}
      {videoAssets.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Videos</h2>
          <div className="space-y-4">
            {videoAssets.map((asset) => (
              <VideoPlayer
                key={asset.id}
                src={asset.file_url}
                title={asset.file_name}
                type="html5"
              />
            ))}
          </div>
        </section>
      )}

      {/* Images */}
      {imageAssets.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Imágenes</h2>
          <ImageGallery assets={imageAssets} />
        </section>
      )}
    </main>
  )
}
