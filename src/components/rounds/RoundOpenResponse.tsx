import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import CountdownTimer from '../CountdownTimer'

export default function RoundOpenResponse() {
  const { gameState, currentPlayer, engine, submitAnswer, lockAnswer, finishRound } = useGame()
  const [answer, setAnswer] = useState('')

  const currentRound = engine?.getCurrentRound()

  useEffect(() => {
    setAnswer('')
  }, [gameState?.currentRound])

  if (!gameState || !currentPlayer || !currentRound) return null

  const isP1 = currentPlayer.id === gameState.player1?.id
  const locked = isP1 ? gameState.player1Locked : gameState.player2Locked
  const otherAnswer = isP1 ? gameState.player2Answer : gameState.player1Answer
  const isReveal = gameState.gameState === 'REVEAL'

  const lock = () => {
    if (answer.trim() && !locked) {
      submitAnswer(answer.trim())
      lockAnswer()
    }
  }

  if (isReveal) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8 max-w-2xl mx-auto">
        <p className="text-center text-white/60 mb-3">BOTH ANSWERS ARE IN</p>
        <p className="text-center text-2xl font-bold text-gradient mb-6">{currentRound.prompt}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-4"><p className="text-xs text-white/50 mb-2">YOUR ANSWER</p><p className="break-words">{isP1 ? gameState.player1Answer : gameState.player2Answer}</p></div>
          <div className="glass-card p-4"><p className="text-xs text-white/50 mb-2">THEIR ANSWER</p><p className="break-words">{otherAnswer}</p></div>
        </div>
        <p className="text-center text-sm text-game-pink mb-5">Blinks are virtual in-game penalties.</p>
        <button
          onClick={() => finishRound(true, true)}
          disabled={currentPlayer.id !== gameState.hostId}
          className="glass-button-primary w-full py-4 disabled:opacity-50"
        >
          {currentPlayer.id === gameState.hostId ? 'NEXT ROUND' : 'WAITING FOR HOST'}
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8 max-w-2xl mx-auto">
      <p className="text-center text-xl text-white/80 mb-2 font-semibold">{currentRound.prompt}</p>
      {currentRound.instructions && <p className="text-center text-white/60 mb-5 italic">{currentRound.instructions}</p>}
      {currentRound.timer && !locked && <div className="flex justify-center mb-5"><CountdownTimer duration={currentRound.timer} onComplete={lock} /></div>}
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        disabled={locked}
        rows={4}
        placeholder="Type your answer or describe what you did..."
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-game-purple/50 resize-y mb-4"
      />
      {!locked ? (
        <button onClick={lock} disabled={!answer.trim()} className="glass-button-primary w-full py-4 disabled:opacity-50">
          LOCK ANSWER
        </button>
      ) : (
        <div className="glass-card p-4 text-center text-game-green font-bold">✓ LOCKED — WAITING FOR THE OTHER PLAYER</div>
      )}
    </motion.div>
  )
}
