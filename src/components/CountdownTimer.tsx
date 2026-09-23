import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  duration: number
  onComplete: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function CountdownTimer({
  duration,
  onComplete,
  size = 'md',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }

  const isWarning = timeLeft <= 10

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: isWarning ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
      className={`glass-card px-6 py-3 rounded-full font-black ${sizeClasses[size]} ${
        isWarning ? 'text-game-pink' : 'text-game-blue'
      }`}
    >
      ⏱️ {displayTime}
    </motion.div>
  )
}
