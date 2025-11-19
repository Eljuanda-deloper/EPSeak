'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface TimerProps {
  minutes: number
  onTimeExpired: () => void
}

export default function Timer({ minutes, onTimeExpired }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeExpired()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        setIsWarning(newTime <= 60) // Warning when less than 1 minute
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onTimeExpired])

  const minutesDisplay = Math.floor(timeLeft / 60)
  const secondsDisplay = timeLeft % 60
  const displayTime = `${minutesDisplay}:${secondsDisplay.toString().padStart(2, '0')}`

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold ${
        isWarning
          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>{displayTime}</span>
    </motion.div>
  )
}
