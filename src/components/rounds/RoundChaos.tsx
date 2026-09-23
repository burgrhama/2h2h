import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

export default function RoundChaos() {
  const { gameState, currentPlayer, engine } = useGame()
  const [answer, setAnswer] = useState('')

  if (!gameState || !currentPlayer || !engine) return null

  const currentRound = engine.getCurrentRound()
  if (!currentRound) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-2xl mx-auto"
    >
      <motion.p className="text-center text-2xl font-bold text-gradient mb-6">
        {currentRound.prompt}
      </motion.p>

      {currentRound.instructions && (
        <p className="text-center text-white/60 mb-6 italic">
          {currentRound.instructions}
        </p>
      )}

      {currentRound.type === 'text-input' ? (
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-game-purple/50 transition min-h-24 resize-none mb-4"
          />
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="glass-button-primary w-full py-4"
            >
              ✓ DONE SHARING
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="glass-button-secondary w-full py-3"
            >
              SKIP THIS ONE
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <p className="text-6xl mb-6">⚡</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="glass-button-primary py-4 px-8 mx-auto"
            >
              READY!
            </motion.button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
