'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, Volume1 } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  duration?: number
  className?: string
}

/**
 * AudioPlayer - Reproductor de audio con controles
 * Soporta: play/pause, volumen, velocidad, progreso
 */
export function AudioPlayer({
  src,
  title,
  duration,
  className = '',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [duration_, setDuration] = useState(duration || 0)

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Handle speed change
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed
    }
  }

  // Handle progress change
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // Update on time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Update duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Handle end
  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 ${className}`}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Title */}
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration_ || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full cursor-pointer"
          aria-label="Audio progress"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration_)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-gray-600" />
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`${s}x speed`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
