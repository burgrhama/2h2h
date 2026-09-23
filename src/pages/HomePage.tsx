import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { AVATARS, PLAYER_COLORS } from '../types/rounds'

const DEFAULT_PLAYER_NAME = '2High2Handle'

export default function HomePage() {
  const { createRoom, joinRoom } = useGame()
  const [screen, setScreen] = useState<'home' | 'create' | 'join'>('home')
  const [playerName, setPlayerName] = useState(DEFAULT_PLAYER_NAME)
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0])

  const sanitizePlayerName = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return DEFAULT_PLAYER_NAME
    return trimmed.replace(/\s+/g, ' ').slice(0, 24)
  }

  const makePlayer = () => ({
    id: `player-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: sanitizePlayerName(playerName),
    avatar: selectedAvatar,
    color: selectedColor,
    score: 0,
    connected: true,
    ready: false,
  })

  const handleCreateRoom = () => {
    const safeName = sanitizePlayerName(playerName)
    setPlayerName(safeName)
    createRoom({ ...makePlayer(), name: safeName })
    setScreen('home')
    setJoinRoomCode('')
    setJoinError('')
  }

  const handleJoinRoom = () => {
    const safeName = sanitizePlayerName(playerName)
    setPlayerName(safeName)

    if (!joinRoomCode.trim()) {
      setJoinError('Enter your name and a room code.')
      return
    }

    const ok = joinRoom(joinRoomCode, { ...makePlayer(), name: safeName })
    if (!ok) {
      setJoinError('That room code is invalid or the room is already full.')
      return
    }

    setScreen('home')
    setPlayerName('')
    setJoinRoomCode('')
    setJoinError('')
  }

  if (screen === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 left-10 text-game-purple/20 text-6xl"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ x: [100, 0, 100] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute top-1/3 right-10 text-game-pink/20 text-5xl"
          >
            ☁️
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-gradient">
            CREATE YOUR PLAYER
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/80">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 24))}
                placeholder={DEFAULT_PLAYER_NAME}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-game-purple/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-white/80">
                Pick Your Vibe
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-3xl p-2 rounded-lg transition ${
                      selectedAvatar === avatar
                        ? 'bg-game-purple/30 border-2 border-game-purple'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-white/80">
                Your Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PLAYER_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-full h-10 rounded-lg transition border-2 ${
                      selectedColor === color
                        ? 'border-white'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="glass-card p-4 text-center">
              <p className="text-sm text-white/60 mb-2">Your Avatar</p>
              <div className="text-5xl mb-2">{selectedAvatar}</div>
              <p className="font-semibold" style={{ color: selectedColor }}>
                {playerName || 'Your Name'}
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateRoom}
                disabled={!playerName.trim()}
                className="glass-button-primary w-full disabled:opacity-50"
              >
                CREATE ROOM
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setScreen('home')
                  setPlayerName('')
                  setJoinError('')
                }}
                className="glass-button-secondary w-full"
              >
                BACK
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (screen === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute top-24 left-16 text-game-purple/20 text-6xl"
          >
            ☁️
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-gradient">
            JOIN A ROOM
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/80">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 24))}
                placeholder={DEFAULT_PLAYER_NAME}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-game-purple/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white/80">
                Room Code
              </label>
              <input
                type="text"
                value={joinRoomCode}
                onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
                placeholder="ABCDE"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 uppercase tracking-[0.35em] focus:outline-none focus:border-game-purple/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-white/80">
                Pick Your Vibe
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-3xl p-2 rounded-lg transition ${
                      selectedAvatar === avatar
                        ? 'bg-game-purple/30 border-2 border-game-purple'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-white/80">
                Your Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PLAYER_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-full h-10 rounded-lg transition border-2 ${
                      selectedColor === color
                        ? 'border-white'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {joinError && (
              <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {joinError}
              </p>
            )}

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinRoom}
                disabled={!playerName.trim() || !joinRoomCode.trim()}
                className="glass-button-primary w-full disabled:opacity-50"
              >
                JOIN ROOM
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setScreen('home')
                  setPlayerName('')
                  setJoinRoomCode('')
                  setJoinError('')
                }}
                className="glass-button-secondary w-full"
              >
                BACK
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 text-game-purple/15 text-8xl"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{
            x: [50, 0, 50],
            y: [30, 0, 30]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 right-10 text-game-pink/15 text-7xl"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{
            x: [-30, 30, -30],
            y: [20, -20, 20]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 text-game-blue/15 text-6xl"
        >
          ☁️
        </motion.div>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute w-2 h-2 bg-game-purple/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              bottom: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-8xl font-black mb-4 text-gradient">
            ☁️ 2 HIGH 2<br />
            HANDLE ☁️
          </h1>
        </motion.div>

        <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
          A two-player game for people who are ready to overthink absolutely everything.
        </p>

        <p className="text-sm text-white/40 mb-12">
          No account. No profile. Just a game.
        </p>

        <div className="space-y-4 max-w-sm mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('create')}
            className="glass-button-primary w-full text-lg py-4"
          >
            CREATE ROOM
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('join')}
            className="glass-button-secondary w-full text-lg py-4"
          >
            JOIN ROOM
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="text-sm text-white/50 hover:text-white/70 transition"
          >
            HOW TO PLAY
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="text-sm text-white/50 hover:text-white/70 transition"
          >
            SETTINGS
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
