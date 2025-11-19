'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Volume2, Maximize } from 'lucide-react'

interface VideoPlayerProps {
  src?: string
  youtubeId?: string
  vimeoId?: string
  title?: string
  posterUrl?: string
  className?: string
}

/**
 * VideoPlayer - Reproductor de video
 * Soporta: YouTube, Vimeo, HTML5 video con controles
 */
export function VideoPlayer({
  src,
  youtubeId,
  vimeoId,
  title,
  posterUrl,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1)
  const [speed, setSpeed] = useState(1)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
      setIsFullscreen(true)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed
    }
  }

  // YouTube embed
  if (youtubeId) {
    return (
      <div className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
          />
        </div>
        {title && (
          <div className="bg-gray-800 px-4 py-2 text-sm text-white">
            {title}
          </div>
        )}
      </div>
    )
  }

  // Vimeo embed
  if (vimeoId) {
    return (
      <div className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}>
        <div className="aspect-video w-full">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
            className="border-0"
          />
        </div>
        {title && (
          <div className="bg-gray-800 px-4 py-2 text-sm text-white">
            {title}
          </div>
        )}
      </div>
    )
  }

  // HTML5 video
  if (src) {
    return (
      <div className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}>
        <div className="relative w-full bg-black">
          <video
            ref={videoRef}
            src={src}
            poster={posterUrl}
            className="w-full"
            controlsList="nodownload"
          />

          {/* Custom controls */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black to-transparent px-4 py-4 opacity-0 transition hover:opacity-100">
            {/* Play/Pause */}
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="flex items-center justify-center rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-white" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 cursor-pointer"
                aria-label="Volume"
              />
            </div>

            {/* Speed */}
            <div className="flex items-center gap-1 ml-auto">
              {[0.75, 1, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`rounded px-2 py-1 text-xs font-medium transition ${
                    speed === s
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label={`${s}x speed`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="flex items-center justify-center rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
              aria-label="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>

        {title && (
          <div className="bg-gray-800 px-4 py-2 text-sm text-white">
            {title}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center ${className}`}>
      <p className="text-gray-500">No video source provided</p>
    </div>
  )
}
