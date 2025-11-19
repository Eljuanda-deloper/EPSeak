'use client'

import React, { useRef, useState } from 'react'
import { Play, Pause, Maximize2 } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  type?: 'youtube' | 'vimeo' | 'html5'
  videoId?: string
  title?: string
  className?: string
}

export function VideoPlayer({
  src,
  type = 'html5',
  videoId,
  title,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(err => console.error('Play error:', err))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleFullscreen = () => {
    if (containerRef.current && containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  // YouTube embed
  if (type === 'youtube' && videoId) {
    return (
      <div className={`w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }

  // Vimeo embed
  if (type === 'vimeo' && videoId) {
    return (
      <div className={`w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          width="100%"
          height="100%"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title || 'Video'}
          className="w-full h-full"
        />
      </div>
    )
  }

  // HTML5 video player
  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden group ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40">
        <button
          onClick={handlePlayPause}
          className="p-4 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
      </div>

      <button
        onClick={handleFullscreen}
        className="absolute bottom-4 right-4 p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-75 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Pantalla completa"
      >
        <Maximize2 size={20} />
      </button>
    </div>
  )
}
