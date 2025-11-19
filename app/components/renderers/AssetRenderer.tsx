'use client'

import { Suspense } from 'react'
import type { LessonAsset } from '@/types/lesson'
import { TextRenderer } from './TextRenderer'
import { AudioPlayer } from './AudioPlayer'
import { ImageViewer } from './ImageViewer'
import { VideoPlayer } from './VideoPlayer'

interface AssetRendererProps {
  asset: LessonAsset
  className?: string
}

/**
 * AssetRenderer - Dispatcher que renderiza assets según su tipo
 * Soporta: text, audio, image, video
 */
export function AssetRenderer({ asset, className = '' }: AssetRendererProps) {
  return (
    <Suspense fallback={<AssetLoadingSkeleton />}>
      <AssetContent asset={asset} className={className} />
    </Suspense>
  )
}

function AssetContent({ asset, className = '' }: AssetRendererProps) {
  switch (asset.asset_type) {
    case 'text':
      return (
        <div className={`rounded-lg bg-white p-6 ${className}`}>
          {asset.alt_text && (
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {asset.alt_text}
            </h3>
          )}
          <TextRenderer content={asset.file_url} />
        </div>
      )

    case 'audio':
      return (
        <AudioPlayer
          src={asset.file_url}
          title={asset.alt_text || asset.file_name}
          duration={asset.duration_seconds}
          className={className}
        />
      )

    case 'image':
      return (
        <ImageViewer
          src={asset.file_url}
          alt={asset.alt_text || asset.file_name}
          title={asset.caption_text}
          className={className}
        />
      )

    case 'video':
      // Detect video type
      const youtubeMatch = asset.file_url.match(
        /(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
      )
      const vimeoMatch = asset.file_url.match(/vimeo\.com\/(\d+)/)

      if (youtubeMatch) {
        return (
          <VideoPlayer
            youtubeId={youtubeMatch[1]}
            title={asset.caption_text || asset.file_name}
            className={className}
          />
        )
      }

      if (vimeoMatch) {
        return (
          <VideoPlayer
            vimeoId={vimeoMatch[1]}
            title={asset.caption_text || asset.file_name}
            className={className}
          />
        )
      }

      // Default HTML5 video
      return (
        <VideoPlayer
          src={asset.file_url}
          title={asset.caption_text || asset.file_name}
          className={className}
        />
      )

    default:
      return (
        <div className={`rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center ${className}`}>
          <p className="text-gray-500">Tipo de contenido no soportado</p>
          <p className="mt-1 text-xs text-gray-400">{asset.asset_type}</p>
        </div>
      )
  }
}

function AssetLoadingSkeleton() {
  return (
    <div className="rounded-lg bg-gray-100 p-8">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-full rounded bg-gray-300" />
        <div className="h-4 w-5/6 rounded bg-gray-300" />
      </div>
    </div>
  )
}
