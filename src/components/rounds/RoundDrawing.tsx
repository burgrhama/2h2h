import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

export default function RoundDrawing() {
  const { gameState, currentPlayer } = useGame()

  if (!gameState || !currentPlayer) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-2xl mx-auto"
    >
      <p className="text-center text-xl text-white/80 mb-6 font-semibold">
        Drawing Canvas
      </p>

      {/* Simple canvas placeholder */}
      <div className="bg-white/5 rounded-lg border-2 border-dashed border-white/20 h-80 flex items-center justify-center mb-6">
        <div className="text-center">
          <p className="text-4xl mb-3">✏️</p>
          <p className="text-white/60">Drawing canvas will render here</p>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="glass-button-primary w-full py-3"
        >
          📝 SUBMIT DRAWING
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="glass-button-secondary w-full py-3"
        >
          🗑️ CLEAR
        </motion.button>
      </div>
    </motion.div>
  )
}
