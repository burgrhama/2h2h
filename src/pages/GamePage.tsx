import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { FLAVOR_TEXTS } from '../types/rounds'
import RoundChoice from '../components/rounds/RoundChoice'
import RoundTextGuess from '../components/rounds/RoundTextGuess'
import RoundDrawing from '../components/rounds/RoundDrawing'
import RoundMemory from '../components/rounds/RoundMemory'
import RoundTimedAction from '../components/rounds/RoundTimedAction'
import RoundDebate from '../components/rounds/RoundDebate'
import RoundChaos from '../components/rounds/RoundChaos'
import VibeBreakModal from '../components/VibeBreakModal'

export default function GamePage() {
  const { gameState, currentPlayer, engine } = useGame()
  const [showVibeBreak, setShowVibeBreak] = useState(false)
  const [flavorText, setFlavorText] = useState('')

  useEffect(() => {
    setFlavorText(FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)])
  }, [gameState?.currentRound])

  if (!gameState || !currentPlayer || !engine) return null

  const currentRound = engine.getCurrentRound()
  const player1 = gameState.player1
  const player2 = gameState.player2

  if (!currentRound || !player1 || !player2) return null

  const player1Score = gameState.scores[player1.id] || 0
  const player2Score = gameState.scores[player2.id] || 0
  const isCurrentPlayerP1 = currentPlayer.id === player1.id

  const renderRound = () => {
    switch (currentRound.type) {
      case 'simultaneous-choice':
      case 'would-you-rather':
      case 'trivia':
        return <RoundChoice />
      case 'text-guess':
        return <RoundTextGuess />
      case 'drawing':
        return <RoundDrawing />
      case 'memory':
        return <RoundMemory />
      case 'timed-action':
        return <RoundTimedAction />
      case 'debate':
        return <RoundDebate />
      case 'text-input':
      case 'chaos':
        return <RoundChaos />
      default:
        return <RoundChoice />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker p-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <p className="text-sm text-white/60 mb-1">
              ROUND {gameState.currentRound + 1} / {gameState.totalRounds}
            </p>
            <div className="w-full bg-white/5 rounded-full h-2">
              <motion.div
                layoutId="progress"
                className="bg-gradient-to-r from-game-purple to-game-pink h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((gameState.currentRound + 1) / gameState.totalRounds) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            className={`glass-card p-4 text-center transition ${
              isCurrentPlayerP1 ? 'ring-2 ring-game-purple' : ''
            }`}
          >
            <div className="text-3xl mb-2">{player1.avatar}</div>
            <p className="font-bold mb-1">{player1.name}</p>
            <motion.div
              key={player1Score}
              initial={{ scale: 1.5, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-3xl font-black text-game-purple"
            >
              ⭐ {player1Score}
            </motion.div>
          </motion.div>

          <motion.div
            className={`glass-card p-4 text-center transition ${
              !isCurrentPlayerP1 ? 'ring-2 ring-game-pink' : ''
            }`}
          >
            <div className="text-3xl mb-2">{player2.avatar}</div>
            <p className="font-bold mb-1">{player2.name}</p>
            <motion.div
              key={player2Score}
              initial={{ scale: 1.5, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-3xl font-black text-game-pink"
            >
              ⭐ {player2Score}
            </motion.div>
          </motion.div>
        </div>

        {/* Category badge */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card inline-block px-6 py-3 mb-4"
          >
            <p className="text-sm text-white/60 mb-1">CATEGORY</p>
            <p className="text-2xl font-bold text-gradient">
              {currentRound.category === 'guess-me' && '🎯 Guess Me'}
              {currentRound.category === 'would-you-rather' && '🤔 Would You Rather'}
              {currentRound.category === 'who-knows-who' && '🧠 Who Knows Who'}
              {currentRound.category === 'make-me-laugh' && '😂 Make Me Laugh'}
              {currentRound.category === 'mini-debate' && '💬 Mini Debate'}
              {currentRound.category === 'draw-it' && '✏️ Draw It'}
              {currentRound.category === 'memory' && '📝 Memory'}
              {currentRound.category === 'trivia' && '🧩 Trivia'}
              {currentRound.category === 'deep-thoughts' && '💭 Deep Thoughts'}
              {currentRound.category === 'chaos' && '⚡ Chaos'}
            </p>
          </motion.div>

          {/* Flavor text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/50 italic"
          >
            {flavorText}
          </motion.p>
        </div>

        {/* Main round component */}
        <div className="mb-8">
          {renderRound()}
        </div>

        {/* Vibe break button */}
        <div className="flex justify-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVibeBreak(true)}
            className="text-white/50 hover:text-white/70 transition flex items-center gap-2"
          >
            <span className="text-xl">🌿</span>
            <span className="text-sm">VIBE BREAK</span>
          </motion.button>
        </div>
      </div>

      {/* Vibe break modal */}
      <VibeBreakModal
        isOpen={showVibeBreak}
        onClose={() => setShowVibeBreak(false)}
      />
    </div>
  )
}
