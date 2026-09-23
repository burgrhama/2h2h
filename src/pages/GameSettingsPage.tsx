import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Difficulty, GameCategory } from '../types/rounds'

export default function GameSettingsPage() {
  const { gameState, updateSettings, startGame } = useGame()
  const [gameLength, setGameLength] = useState<10 | 25 | 50 | 100 | 'random'>(25)
  const [difficulty, setDifficulty] = useState<Difficulty>('chill')
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>([
    'guess-me',
    'would-you-rather',
    'who-knows-who',
    'make-me-laugh',
    'mini-debate',
    'draw-it',
    'memory',
    'trivia',
    'deep-thoughts',
    'chaos',
  ])

  const categories: { id: GameCategory; label: string; emoji: string }[] = [
    { id: 'guess-me', label: 'Guess Me', emoji: '🎯' },
    { id: 'would-you-rather', label: 'Would You Rather', emoji: '🤔' },
    { id: 'who-knows-who', label: 'Who Knows Who', emoji: '🧠' },
    { id: 'make-me-laugh', label: 'Make Me Laugh', emoji: '😂' },
    { id: 'mini-debate', label: 'Mini Debate', emoji: '💬' },
    { id: 'draw-it', label: 'Draw It', emoji: '✏️' },
    { id: 'memory', label: 'Memory', emoji: '📝' },
    { id: 'trivia', label: 'Trivia', emoji: '🧩' },
    { id: 'deep-thoughts', label: 'Deep Thoughts', emoji: '💭' },
    { id: 'chaos', label: 'Chaos', emoji: '⚡' },
  ]

  const toggleCategory = (cat: GameCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c: GameCategory) => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const handleStart = () => {
    updateSettings({
      gameLength,
      difficulty,
      enabledCategories: selectedCategories,
      allowRepeats: false,
      randomizeOrder: true,
    })
    startGame()
  }

  if (!gameState) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-dark to-game-darker flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="glass-card p-8 mb-6">
          <h1 className="text-4xl font-bold text-gradient mb-8 text-center">
            GAME SETTINGS
          </h1>

          {/* Game length */}
          <div className="mb-8">
            <p className="text-lg font-bold mb-4 text-white/90">GAME LENGTH</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[10, 25, 50, 100].map((len) => (
                <motion.button
                  key={len}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameLength(len as 10 | 25 | 50 | 100)}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    gameLength === len
                      ? 'bg-gradient-to-r from-game-purple to-game-pink text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {len}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameLength('random')}
                className={`py-3 px-4 rounded-lg font-bold transition col-span-2 md:col-span-1 ${
                  gameLength === 'random'
                    ? 'bg-gradient-to-r from-game-purple to-game-pink text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                RANDOM
              </motion.button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <p className="text-lg font-bold mb-4 text-white/90">DIFFICULTY</p>
            <div className="grid grid-cols-3 gap-3">
              {(['chill', 'chaotic', 'unhinged'] as Difficulty[]).map((diff) => (
                <motion.button
                  key={diff}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(diff)}
                  className={`py-3 px-4 rounded-lg font-bold transition uppercase ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-game-purple to-game-pink text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {diff}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <p className="text-lg font-bold mb-4 text-white/90">CATEGORY MIX</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(cat.id)}
                  className={`py-3 px-3 rounded-lg font-bold transition text-sm ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-gradient-to-r from-game-purple to-game-pink text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl mb-1">{cat.emoji}</div>
                  <div className="text-xs">{cat.label.split(' ')[0]}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="glass-card bg-white/5 p-4 mb-6 border border-white/10 rounded-lg">
            <p className="text-white/70 text-sm">
              🎮 Selected: <span className="font-bold text-white">{selectedCategories.length} categories</span> •
              🎯 Rounds: <span className="font-bold text-white">{gameLength === 'random' ? 'Random' : gameLength}</span> •
              ⚙️ Difficulty: <span className="font-bold text-white uppercase">{difficulty}</span>
            </p>
          </div>

          {/* Start button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="glass-button-primary w-full py-4 text-lg font-bold"
          >
            LET'S PLAY! 🚀
          </motion.button>
        </div>

        {/* Back button */}
      </motion.div>
    </div>
  )
}
