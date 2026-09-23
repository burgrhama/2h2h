import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import GameEngine, { GameState, Player, RoomSettings } from '../engine/GameEngine'

interface GameContextType {
  engine: GameEngine | null
  gameState: GameState | null
  currentPlayer: Player | null
  createRoom: (player: Player) => void
  joinRoom: (roomCode: string, player: Player) => void
  updateSettings: (settings: RoomSettings) => void
  startGame: () => void
  submitAnswer: (answer: string | number) => void
  lockAnswer: () => void
  nextRound: () => void
  skipRound: () => void
  calculateScore: (isCorrect: boolean) => void
  endGame: () => void
  restartGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<GameEngine | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)

  const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const createRoom = useCallback((player: Player) => {
    const roomCode = generateRoomCode()
    const newEngine = new GameEngine(roomCode, player.id)
    newEngine.addPlayer(player)
    
    setEngine(newEngine)
    setGameState(newEngine.getState())
    setCurrentPlayer(player)
  }, [])

  const joinRoom = useCallback((roomCode: string, player: Player) => {
    // In a real app, this would fetch from server
    // For MVP, we'll simulate
    if (engine && engine.getState().roomCode === roomCode) {
      engine.addPlayer(player)
      setGameState(engine.getState())
      setCurrentPlayer(player)
    }
  }, [engine])

  const updateSettings = useCallback((settings: RoomSettings) => {
    if (engine) {
      engine.updateSettings(settings)
      engine.initializeRounds()
      setGameState(engine.getState())
    }
  }, [engine])

  const startGame = useCallback(() => {
    if (engine) {
      engine.startGame()
      setGameState(engine.getState())
    }
  }, [engine])

  const submitAnswer = useCallback((answer: string | number) => {
    if (engine && currentPlayer) {
      engine.submitAnswer(currentPlayer.id, answer)
      setGameState(engine.getState())
    }
  }, [engine, currentPlayer])

  const lockAnswer = useCallback(() => {
    if (engine && currentPlayer) {
      engine.lockAnswer(currentPlayer.id)
      setGameState(engine.getState())
    }
  }, [engine, currentPlayer])

  const nextRound = useCallback(() => {
    if (engine) {
      engine.nextRound()
      setGameState(engine.getState())
    }
  }, [engine])

  const skipRound = useCallback(() => {
    if (engine) {
      engine.skipRound()
      setGameState(engine.getState())
    }
  }, [engine])

  const calculateScore = useCallback((isCorrect: boolean) => {
    if (engine && currentPlayer && engine.getCurrentRound()) {
      const basePoints = engine.getCurrentRound()?.points || 0
      engine.calculateScore(currentPlayer.id, isCorrect, basePoints)
      setGameState(engine.getState())
    }
  }, [engine, currentPlayer])

  const endGame = useCallback(() => {
    if (engine) {
      engine.endGame()
      setGameState(engine.getState())
    }
  }, [engine])

  const restartGame = useCallback(() => {
    if (engine) {
      engine.restartGame()
      setGameState(engine.getState())
    }
  }, [engine])

  const value: GameContextType = {
    engine,
    gameState,
    currentPlayer,
    createRoom,
    joinRoom,
    updateSettings,
    startGame,
    submitAnswer,
    lockAnswer,
    nextRound,
    skipRound,
    calculateScore,
    endGame,
    restartGame,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = (): GameContextType => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
