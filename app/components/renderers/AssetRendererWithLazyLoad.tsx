'use client'

import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import type { LessonAsset } from '../../../types/lesson'
import { AssetRenderer } from './AssetRenderer'

interface AssetRendererWithLazyLoadProps {
  asset: LessonAsset
  className?: string
}

/**
 * AssetRenderer con lazy loading - no renderiza hasta que sea visible
 */
export function AssetRendererWithLazyLoad({
  asset,
  className = '',
}: AssetRendererWithLazyLoadProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '100px', // Carga 100px antes de que sea visible
  })

  return (
    <div ref={ref}>
      {isVisible ? (
        <AssetRenderer asset={asset} className={className} />
      ) : (
        <AssetLoadingPlaceholder assetType={asset.asset_type} />
      )}
    </div>
  )
}

function AssetLoadingPlaceholder({ assetType }: { assetType: string }) {
  const heightClass = {
    audio: 'h-20',
    image: 'h-64',
    video: 'h-96',
    text: 'h-32',
  }[assetType] || 'h-32'

  return (
    <div className={`${heightClass} rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cargando contenido...
        </p>
      </div>
    </div>
  )
}
