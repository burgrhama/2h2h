import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { WINNER_TITLES } from '../types/rounds'

export default function ResultsPage() {
  const { gameState, engine, restartGame } = useGame()

  if (!gameState || !engine) return null

  const player1 = gameState.player1
  const player2 = gameState.player2

  if (!player1 || !player2) return null

  const p1Score = gameState.scores[player1.id] || 0
  const p2Score = gameState.scores[player2.id] || 0
  const p1Hits = gameState.hits[player1.id] || 0
  const p2Hits = gameState.hits[player2.id] || 0
  const winner = engine.getWinner()
  const isTie = engine.isTie()

  const randomTitle = WINNER_TITLES[Math.floor(Math.random() * WINNER_TITLES.length)]

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker flex items-center justify-center p-4 overflow-hidden">
      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100,
              y: -10,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: 100,
              rotate: 360,
              opacity: 0,
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: ['#a855f7', '#ec4899', '#06b6d4', '#22c55e'][
                Math.floor(Math.random() * 4)
              ],
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Cloud animations */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-7xl mb-4"
        >
          ☁️
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black text-gradient mb-8">
          GAME OVER
        </h1>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <div className="text-5xl mb-3">{player1.avatar}</div>
            <p className="font-bold text-lg mb-2">{player1.name}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-5xl font-black text-game-purple"
            >
              ⭐ {p1Score}
            </motion.p>
            <p className="text-game-pink mt-2">💨 {p1Hits} HIT{p1Hits === 1 ? '' : 'S'}</p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <div className="text-5xl mb-3">{player2.avatar}</div>
            <p className="font-bold text-lg mb-2">{player2.name}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-5xl font-black text-game-pink"
            >
              ⭐ {p2Score}
            </motion.p>
            <p className="text-game-pink mt-2">💨 {p2Hits} HIT{p2Hits === 1 ? '' : 'S'}</p>
          </motion.div>
        </div>

        {/* Winner section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-8 mb-8"
        >
          {isTie ? (
            <>
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🤝
              </motion.p>
              <h2 className="text-4xl font-black text-gradient mb-2">
                PERFECT TIE
              </h2>
              <p className="text-white/70 italic">
                Neither of you was capable of defeating the other.
              </p>
            </>
          ) : (
            <>
              <motion.p
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.p>
              <h2 className="text-4xl font-black text-gradient mb-2">
                WINNER: {winner?.name.toUpperCase()}
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-2xl font-bold text-game-purple mt-4"
              >
                {randomTitle}
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="glass-card p-6 mb-8 border border-white/10"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white/60 text-sm mb-1">TOTAL ROUNDS</p>
              <p className="text-2xl font-bold">{gameState.totalRounds}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">TOTAL POINTS</p>
              <p className="text-2xl font-bold">{p1Score + p2Score}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">DIFFICULTY</p>
              <p className="text-2xl font-bold uppercase">{gameState.difficulty}</p>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              restartGame()
              // Navigate back to settings
            }}
            className="glass-button-primary w-full py-4 text-lg"
          >
            PLAY AGAIN 🔄
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-secondary w-full py-4 text-lg"
          >
            RETURN HOME
          </motion.button>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-white/40 text-sm mt-8"
        >
          Thanks for playing! 💜
        </motion.p>
      </motion.div>
    </div>
  )
}
