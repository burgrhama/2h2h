import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import CountdownTimer from '../CountdownTimer'

export default function RoundChoice() {
  const { gameState, currentPlayer, engine, submitAnswer, lockAnswer } = useGame()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!gameState || !currentPlayer || !engine) return null

  const currentRound = engine.getCurrentRound()
  if (!currentRound || !currentRound.choices) return null

  const isP1 = currentPlayer.id === gameState.player1?.id
  const locked = isP1 ? gameState.player1Locked : gameState.player2Locked
  const myAnswer = isP1 ? gameState.player1Answer : gameState.player2Answer
  const otherPlayer = isP1 ? gameState.player2 : gameState.player1

  const handleSelectChoice = (index: number) => {
    if (!locked) {
      setSelectedIndex(index)
      submitAnswer(index)
    }
  }

  const handleLock = () => {
    if (selectedIndex !== null && !locked) {
      lockAnswer()
    }
  }

  if (gameState.gameState === 'REVEAL') {
    const otherAnswer = isP1 ? gameState.player2Answer : gameState.player1Answer
    const p1Actual = gameState.player1Answer
    const p2Actual = gameState.player2Answer

    // For guess-me: check if p1 guessed p2's actual answer
    const isCorrect =
      currentRound.category === 'guess-me' 
        ? (isP1 && myAnswer === p2Actual) || (!isP1 && myAnswer === p1Actual)
        : myAnswer === otherAnswer

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Your answer */}
          <div>
            <p className="text-white/60 text-sm mb-2 uppercase">YOUR ANSWER</p>
            <div className="glass-card p-4 rounded-xl text-center mb-4">
              <p className="text-xl font-bold text-game-purple">
                {currentRound.choices?.[myAnswer as number]}
              </p>
            </div>
          </div>

          {/* Their answer */}
          <div>
            <p className="text-white/60 text-sm mb-2 uppercase">
              {otherPlayer?.name}'S ANSWER
            </p>
            <div className="glass-card p-4 rounded-xl text-center mb-4">
              <p className="text-xl font-bold text-game-pink">
                {currentRound.choices?.[otherAnswer as number]}
              </p>
            </div>
          </div>
        </div>

        {/* Result */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          {isCorrect ? (
            <>
              <motion.p className="text-6xl mb-4">🎯</motion.p>
              <p className="text-3xl font-bold text-game-green mb-2">CORRECT!</p>
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
              <motion.p className="text-6xl mb-4">❌</motion.p>
              <p className="text-3xl font-bold text-game-pink mb-2">NO MATCH</p>
              <p className="text-white/60">Better luck next round!</p>
            </>
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // This should be handled by parent to move to next round
          }}
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
      <div className="mb-6">
        <p className="text-center text-xl text-white/80 mb-4 font-semibold">
          {currentRound.prompt}
        </p>
        {currentRound.timer && !locked && (
          <div className="flex justify-center mb-4">
            <CountdownTimer duration={currentRound.timer} onComplete={handleLock} />
          </div>
        )}
      </div>

      {/* Choices grid */}
      <div className="space-y-3 mb-8">
        {currentRound.choices.map((choice: string, index: number) => (
          <motion.button
            key={index}
            whileHover={{ scale: locked ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectChoice(index)}
            disabled={locked}
            className={`w-full p-4 rounded-lg font-bold transition text-lg ${
              selectedIndex === index
                ? 'bg-gradient-to-r from-game-purple to-game-pink text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            } ${locked ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {String.fromCharCode(65 + index)}. {choice}
          </motion.button>
        ))}
      </div>

      {/* Lock button */}
      {!locked ? (
        <motion.button
          whileHover={{ scale: selectedIndex !== null ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLock}
          disabled={selectedIndex === null}
          className="glass-button-primary w-full py-4 disabled:opacity-50"
        >
          🔒 LOCK ANSWER
        </motion.button>
      ) : (
        <div className="glass-card p-4 text-center">
          <p className="text-game-green font-bold">✓ Your answer is locked!</p>
          <p className="text-white/60 text-sm mt-1">Waiting for other player...</p>
        </div>
      )}
    </motion.div>
  )
}
