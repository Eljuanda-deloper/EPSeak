'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, CheckCircle, Clock, BookOpen, MessageSquare } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  content: string
  video_url?: string
  duration_minutes: number
  completed: boolean
}

interface LessonPlayerProps {
  lesson: Lesson
  onComplete: (lessonId: string) => void
  onProgress: (lessonId: string, progress: number) => void
  nextLesson?: Lesson
  previousLesson?: Lesson
  onNavigate: (lessonId: string) => void
}

export default function LessonPlayer({
  lesson,
  onComplete,
  onProgress,
  nextLesson,
  previousLesson,
  onNavigate
}: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(lesson.completed)

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsCompleted(lesson.completed)
    setProgress(0)
    setCurrentTime(0)
  }, [lesson.id, lesson.completed])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const total = videoRef.current.duration || lesson.duration_minutes * 60
      setCurrentTime(current)
      setDuration(total)
      const newProgress = (current / total) * 100
      setProgress(newProgress)
      onProgress(lesson.id, newProgress)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete(lesson.id)
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    if (!isCompleted) {
      handleComplete()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden">
      {/* Video Player */}
      <div className="relative bg-black aspect-video">
        {lesson.video_url ? (
          <video
            ref={videoRef}
            src={lesson.video_url}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A4E5A] to-[#7CC4E0]">
            <div className="text-center text-white">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Contenido de Lección</h3>
              <p className="text-white/80">Lectura y ejercicios interactivos</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-[#7CC4E0] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              {/* Previous/Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => previousLesson && onNavigate(previousLesson.id)}
                  disabled={!previousLesson}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => nextLesson && onNavigate(nextLesson.id)}
                  disabled={!nextLesson}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Time */}
              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration || lesson.duration_minutes * 60)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Fullscreen */}
              <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCompleted ? 'bg-green-100 text-green-600' : 'bg-[#0A4E5A]/10 text-[#0A4E5A]'
            }`}>
              {isCompleted ? <CheckCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0A4E5A]">{lesson.title}</h2>
              <div className="flex items-center gap-4 text-sm text-[#7CC4E0]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration_minutes} minutos</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-[#7CC4E0]'}`} />
                  <span>{isCompleted ? 'Completada' : 'En progreso'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 px-4 py-2 bg-[#E8ECEF] hover:bg-[#7CC4E0]/20 text-[#0A4E5A] rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Notas
            </button>
            {!isCompleted && (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2 bg-[#0A4E5A] hover:bg-[#7CC4E0] text-white rounded-lg transition-colors font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar como completada
              </button>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="prose prose-lg max-w-none text-[#0A4E5A] mb-6">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>

        {/* Notes Section */}
        {showNotes && (
          <div className="border-t border-[#E8ECEF] pt-6">
            <h3 className="text-lg font-semibold text-[#0A4E5A] mb-4">Notas de la lección</h3>
            <textarea
              placeholder="Escribe tus notas aquí..."
              className="w-full h-32 p-4 border border-[#7CC4E0]/30 rounded-xl focus:outline-none focus:border-[#0A4E5A] resize-none text-[#0A4E5A] placeholder-[#7CC4E0]"
              rows={4}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-[#E8ECEF] pt-6 mt-6">
          <button
            onClick={() => previousLesson && onNavigate(previousLesson.id)}
            disabled={!previousLesson}
            className="flex items-center gap-2 px-4 py-2 bg-[#E8ECEF] hover:bg-[#7CC4E0]/20 text-[#0A4E5A] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" />
            Lección anterior
          </button>

          <div className="text-sm text-[#7CC4E0]">
            Progreso: {Math.round(progress)}%
          </div>

          <button
            onClick={() => nextLesson && onNavigate(nextLesson.id)}
            disabled={!nextLesson}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A4E5A] hover:bg-[#7CC4E0] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente lección
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}