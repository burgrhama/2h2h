import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import CountdownTimer from '../CountdownTimer'

export default function RoundDebate() {
  const { gameState, currentPlayer, engine } = useGame()
  const [debatePhase, setDebatePhase] = useState<'waiting' | 'player1' | 'player2' | 'vote'>('waiting')

  if (!gameState || !currentPlayer || !engine) return null

  const currentRound = engine.getCurrentRound()
  if (!currentRound) return null

  const isP1 = currentPlayer.id === gameState.player1?.id
  const otherPlayer = isP1 ? gameState.player2 : gameState.player1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-3xl mx-auto"
    >
      <p className="text-center text-2xl font-bold text-gradient mb-2">
        {currentRound.prompt}
      </p>

      <p className="text-center text-white/60 mb-8 italic">
        Each player has 30 seconds to argue their case
      </p>

      {debatePhase === 'waiting' && (
        <div className="text-center mb-6">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <p className="text-6xl mb-3">🎙️</p>
            <p className="text-white/60 mb-6">Starting debate...</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setDebatePhase(isP1 ? 'player1' : 'player2')}
              className="glass-button-primary py-4 px-8"
            >
              START DEBATE
            </motion.button>
          </motion.div>
        </div>
      )}

      {(debatePhase === 'player1' || debatePhase === 'player2') && (
        <div className="mb-6">
          <p className="text-center text-white/60 mb-4">
            {isP1 ? 'Your turn to argue!' : `${gameState.player1?.name} is arguing...`}
          </p>
          <div className="flex justify-center mb-6">
            <CountdownTimer duration={30} onComplete={() => setDebatePhase('vote')} size="lg" />
          </div>

          {isP1 && debatePhase === 'player1' && (
            <div className="bg-game-purple/10 border border-game-purple/20 rounded-lg p-8 text-center mb-6 min-h-24">
              <p className="text-white/60">Make your argument! 30 seconds on the clock.</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {debatePhase === 'vote' && (
          <>
            <p className="text-center font-bold text-white/80 mb-4">
              Who had the more convincing argument?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="glass-button-primary py-4"
              >
                ✓ {gameState.player1?.name}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="glass-button-secondary py-4"
              >
                ✓ {otherPlayer?.name}
              </motion.button>
            </div>
          </>
        )}

        {debatePhase !== 'vote' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="glass-button-secondary w-full py-3"
          >
            SKIP DEBATE
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
