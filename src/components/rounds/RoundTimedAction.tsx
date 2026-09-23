import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import CountdownTimer from '../CountdownTimer'

export default function RoundTimedAction() {
  const { gameState, currentPlayer, engine } = useGame()

  if (!gameState || !currentPlayer || !engine) return null

  const currentRound = engine.getCurrentRound()
  if (!currentRound) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-2xl mx-auto"
    >
      <p className="text-center text-xl text-white/80 mb-6 font-semibold">
        {currentRound.prompt}
      </p>

      {currentRound.instructions && (
        <p className="text-center text-white/60 mb-8 italic">
          {currentRound.instructions}
        </p>
      )}

      <div className="flex justify-center mb-8">
        <CountdownTimer
          duration={currentRound.timer || 30}
          onComplete={() => {}}
          size="lg"
        />
      </div>

      <div className="bg-game-purple/10 border border-game-purple/20 rounded-lg p-8 text-center mb-6 min-h-32 flex items-center justify-center">
        <div>
          <p className="text-white/60 mb-2">Ready to perform?</p>
          <p className="text-4xl">🎤</p>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="glass-button-primary w-full py-4"
        >
          ✓ DONE - LOCK IT IN
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="glass-button-secondary w-full py-3"
        >
          SKIP
        </motion.button>
      </div>
    </motion.div>
  )
}
