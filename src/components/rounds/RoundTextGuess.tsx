import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import CountdownTimer from '../CountdownTimer'

export default function RoundTextGuess() {
  const { gameState, currentPlayer, engine, submitAnswer, lockAnswer } = useGame()
  const [textInput, setTextInput] = useState('')

  if (!gameState || !currentPlayer || !engine) return null

  const currentRound = engine.getCurrentRound()
  if (!currentRound) return null

  const isP1 = currentPlayer.id === gameState.player1?.id
  const locked = isP1 ? gameState.player1Locked : gameState.player2Locked
  const otherPlayer = isP1 ? gameState.player2 : gameState.player1

  const handleLock = () => {
    if (textInput.trim() && !locked) {
      submitAnswer(textInput)
      lockAnswer()
    }
  }

  if (gameState.gameState === 'REVEAL') {
    const myAnswer = isP1 ? gameState.player1Answer : gameState.player2Answer
    const otherAnswer = isP1 ? gameState.player2Answer : gameState.player1Answer

    const similarity = calculateSimilarity(String(myAnswer), String(otherAnswer))
    const isCorrect = similarity > 0.6

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-white/60 text-sm mb-2 uppercase">YOUR ANSWER</p>
            <div className="glass-card p-4 rounded-xl bg-white/5">
              <p className="text-lg text-game-purple">{myAnswer}</p>
            </div>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-2 uppercase">
              {otherPlayer?.name}'S ACTUAL ANSWER
            </p>
            <div className="glass-card p-4 rounded-xl bg-white/5">
              <p className="text-lg text-game-pink">{otherAnswer}</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          {isCorrect ? (
            <>
              <p className="text-6xl mb-4">✨</p>
              <p className="text-3xl font-bold text-game-green mb-2">YOU KNOW THEM!</p>
              <motion.p
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-4xl font-black text-game-green"
              >
                +{currentRound.points}
              </motion.p>
            </>
          ) : (
            <>
              <p className="text-6xl mb-4">💭</p>
              <p className="text-3xl font-bold text-white/70 mb-2">NOT QUITE</p>
              <p className="text-white/60">You're learning about each other!</p>
            </>
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button-primary w-full py-4"
        >
          NEXT ROUND
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-2xl mx-auto"
    >
      <p className="text-center text-xl text-white/80 mb-6 font-semibold">
        {currentRound.prompt}
      </p>

      <div className="space-y-4 mb-6">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={locked}
          placeholder="Type your answer here..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-game-purple/50 transition min-h-24 resize-none"
        />
      </div>

      <div className="space-y-3">
        {!locked ? (
          <motion.button
            whileHover={{ scale: textInput.trim() ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLock}
            disabled={!textInput.trim()}
            className="glass-button-primary w-full py-4 disabled:opacity-50"
          >
            🔒 LOCK ANSWER
          </motion.button>
        ) : (
          <div className="glass-card p-4 text-center">
            <p className="text-game-green font-bold">✓ Locked in!</p>
            <p className="text-white/60 text-sm mt-1">Waiting for other player...</p>
          </div>
        )}
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

function calculateSimilarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b
  const shorter = a.length > b.length ? b : a
  if (longer.length === 0) return 1.0
  const editDistance = getEditDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function getEditDistance(a: string, b: string): number {
  const costs: number[] = []
  for (let j = 0; j <= b.length; j++) {
    let lastValue = j
    for (let i = 1; i <= a.length; i++) {
      let newValue = costs[j] === undefined ? i : costs[j] + 1
      if (a.charAt(i - 1) === b.charAt(j - 1)) {
        newValue = lastValue
      }
      lastValue = newValue
      costs[j] = newValue
    }
  }
  return costs[b.length] || 0
}
