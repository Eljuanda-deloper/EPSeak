'use client'

import React, { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
}

export function AudioPlayer({ src, title, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => console.error('Play error:', err))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 p-6 rounded-lg ${className}`}>
      {title && <h3 className="font-semibold mb-4">{title}</h3>}
      
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handlePlayPause}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="flex-1 flex items-center gap-3 min-w-64">
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-12">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.currentTime = Number(e.target.value)
                setCurrentTime(Number(e.target.value))
              }
            }}
            className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
            aria-label="Progreso de audio"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-12">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={playbackRate}
            onChange={(e) => {
              const rate = Number(e.target.value)
              setPlaybackRate(rate)
              if (audioRef.current) audioRef.current.playbackRate = rate
            }}
            className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
            aria-label="Velocidad de reproducción"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const v = Number(e.target.value)
              setVolume(v)
              if (audioRef.current) audioRef.current.volume = v
            }}
            className="w-20 h-2 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
            aria-label="Volumen"
          />
        </div>
      </div>
    </div>
  )
}
