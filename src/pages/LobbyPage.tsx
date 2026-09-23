import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import GameSettingsPage from './GameSettingsPage'

export default function LobbyPage() {
  const { gameState, currentPlayer } = useGame()
  const [showSettings, setShowSettings] = useState(false)

  if (!gameState) return null

  if (showSettings || gameState.gameState === 'SETTINGS') {
    return <GameSettingsPage />
  }

  const isHostReady = gameState.player1?.ready && gameState.player2?.ready
  const bothPlayersJoined = gameState.player1 && gameState.player2

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 left-10 text-game-purple/10 text-8xl"
        >
          ☁️
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Room code */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            ☁️ 2 HIGH 2 HANDLE
          </h1>
          <div className="glass-card p-6 inline-block mb-4">
            <p className="text-white/60 text-sm mb-2">ROOM CODE</p>
            <p className="text-4xl font-black tracking-widest text-game-pink">
              {gameState.roomCode}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigator.clipboard.writeText(gameState.roomCode)}
              className="text-xs text-white/50 hover:text-white/70 mt-2 transition"
            >
              COPY CODE
            </motion.button>
          </div>
        </div>

        {/* Players display */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {gameState.player1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-5xl mb-3">{gameState.player1.avatar}</div>
              <p className="font-bold text-lg mb-1">{gameState.player1.name}</p>
              <p className="text-sm text-white/60 mb-4">PLAYER 1</p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block px-3 py-1 bg-game-green/20 rounded-full text-game-green text-xs font-bold"
              >
                ✓ READY
              </motion.div>
            </motion.div>
          )}

          {gameState.player2 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-5xl mb-3">{gameState.player2.avatar}</div>
              <p className="font-bold text-lg mb-1">{gameState.player2.name}</p>
              <p className="text-sm text-white/60 mb-4">PLAYER 2</p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block px-3 py-1 bg-game-green/20 rounded-full text-game-green text-xs font-bold"
              >
                ✓ READY
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ borderColor: ['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="glass-card p-6 text-center border-2 border-game-purple/20 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-white/60 mb-2">WAITING FOR PLAYER 2</p>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl"
                >
                  ⏳
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Status */}
        {bothPlayersJoined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <p className="text-lg font-bold text-game-green mb-6">
              ✓ THE ROOM IS READY
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentPlayer?.id === gameState.hostId) {
                  setShowSettings(true)
                }
              }}
              disabled={currentPlayer?.id !== gameState.hostId}
              className="glass-button-primary w-full py-4 text-lg disabled:opacity-50"
            >
              CONFIGURE GAME
            </motion.button>

            {currentPlayer?.id !== gameState.hostId && (
              <p className="text-xs text-white/40 mt-4">
                Waiting for host to start...
              </p>
            )}
          </motion.div>
        )}

        {!bothPlayersJoined && (
          <div className="text-center">
            <p className="text-white/60 mb-4">
              Ask your opponent to enter this code ☝️
            </p>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              ⏳
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
