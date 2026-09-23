import { motion, AnimatePresence } from 'framer-motion'

interface VibeBreakModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VibeBreakModal({ isOpen, onClose }: VibeBreakModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <div className="glass-card p-8 max-w-sm w-full text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🌿
              </motion.div>

              <h2 className="text-3xl font-bold text-gradient mb-6">
                VIBE BREAK
              </h2>

              <div className="space-y-3 mb-8 text-white/70 text-sm leading-relaxed">
                <p>✓ TAKE A MOMENT</p>
                <p>✓ GET SOME WATER</p>
                <p>✓ PUT ON A SONG</p>
                <p>✓ LOOK OUT THE WINDOW</p>
                <p>✓ OR JUST KEEP PLAYING</p>
              </div>

              <p className="text-xs text-white/50 mb-6">
                No pressure. This game is about vibes.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="glass-button-primary w-full py-3"
                >
                  CONTINUE PLAYING
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="glass-button-secondary w-full py-3"
                >
                  TAKE A BREAK
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
