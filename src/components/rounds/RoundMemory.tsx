import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

export default function RoundMemory() {
  const { gameState, currentPlayer, engine } = useGame()
  const [showSequence, setShowSequence] = useState(true)
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    if (engine) {
      const round = engine.getCurrentRound()
      if (round?.prompt) {
        const items = round.prompt.split(' ')
        setSequence(items)
      }
    }
  }, [engine])

  useEffect(() => {
    if (showSequence) {
      const timer = setTimeout(() => setShowSequence(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSequence])

  if (!gameState || !currentPlayer) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-2xl mx-auto text-center"
    >
      {showSequence ? (
        <div>
          <p className="text-white/60 mb-6">MEMORIZE THIS SEQUENCE</p>
          <div className="flex justify-center gap-4 mb-8 text-5xl">
            {sequence.map((item: string, i: number) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
          <motion.p
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-white/60"
          >
            Get ready...
          </motion.p>
        </div>
      ) : (
        <div>
          <p className="text-white/60 mb-6">RECREATE THE SEQUENCE</p>
          <p className="text-3xl font-bold text-gradient mb-6">
            {sequence.length} items
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="glass-button-primary mx-auto py-4 px-8"
          >
            READY?
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
