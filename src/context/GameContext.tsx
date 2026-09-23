import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react'
import GameEngine, { GameState, Player, RoomSettings } from '../engine/GameEngine'

const ROOM_STORAGE_KEY = 'two-high-2-handle-room'

interface GameContextType {
  engine: GameEngine | null
  gameState: GameState | null
  currentPlayer: Player | null
  createRoom: (player: Player) => void
  joinRoom: (roomCode: string, player: Player) => boolean
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
  const syncRoomState = useCallback((room: GameState | null) => {
    if (!room) {
      setEngine(null)
      setGameState(null)
      setCurrentPlayer(null)
      return
    }

    const nextEngine = GameEngine.fromState(room)
    setEngine(nextEngine)
    setGameState(room)
    setCurrentPlayer(room.player1 ?? room.player2 ?? null)
  }, [])

  const loadRoomFromStorage = useCallback((): GameState | null => {
    if (typeof window === 'undefined') return null

    try {
      const savedRoom = window.localStorage.getItem(ROOM_STORAGE_KEY)
      if (!savedRoom) return null

      const parsedRoom = JSON.parse(savedRoom) as GameState
      return parsedRoom?.roomCode ? parsedRoom : null
    } catch {
      return null
    }
  }, [])

  const persistRoom = useCallback((engineToSave: GameEngine) => {
    if (typeof window === 'undefined') return
    const payload = JSON.stringify(engineToSave.getState())
    window.localStorage.setItem(ROOM_STORAGE_KEY, payload)
  }, [])

  const [engine, setEngine] = useState<GameEngine | null>(() => {
    const savedRoom = loadRoomFromStorage()
    return savedRoom ? GameEngine.fromState(savedRoom) : null
  })
  const [gameState, setGameState] = useState<GameState | null>(() => loadRoomFromStorage())
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => {
    const savedRoom = loadRoomFromStorage()
    if (!savedRoom) return null
    return savedRoom.player1 ?? savedRoom.player2 ?? null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== ROOM_STORAGE_KEY) return
      syncRoomState(event.newValue ? JSON.parse(event.newValue) as GameState : null)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [syncRoomState])

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
    persistRoom(newEngine)
  }, [persistRoom])

  const joinRoom = useCallback((roomCode: string, player: Player) => {
    const normalizedCode = roomCode.trim().toUpperCase()
    if (!normalizedCode) return false

    const storedRoom = loadRoomFromStorage()
    const roomToJoin = engine && engine.getState().roomCode === normalizedCode
      ? engine
      : storedRoom && storedRoom.roomCode === normalizedCode
        ? GameEngine.fromState(storedRoom)
        : null

    if (!roomToJoin) return false

    const nextState = roomToJoin.getState()
    if (nextState.player1?.id === player.id || nextState.player2?.id === player.id) {
      setEngine(roomToJoin)
      setGameState(nextState)
      setCurrentPlayer(player)
      return true
    }

    if (nextState.player1 && nextState.player2) return false

    roomToJoin.addPlayer(player)
    setEngine(roomToJoin)
    setGameState(roomToJoin.getState())
    setCurrentPlayer(player)
    persistRoom(roomToJoin)
    return true
  }, [engine, loadRoomFromStorage, persistRoom])

  const updateSettings = useCallback((settings: RoomSettings) => {
    if (engine) {
      engine.updateSettings(settings)
      engine.initializeRounds()
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, persistRoom])

  const startGame = useCallback(() => {
    if (engine) {
      engine.startGame()
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, persistRoom])

  const submitAnswer = useCallback((answer: string | number) => {
    if (engine && currentPlayer) {
      engine.submitAnswer(currentPlayer.id, answer)
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, currentPlayer, persistRoom])

  const lockAnswer = useCallback(() => {
    if (engine && currentPlayer) {
      engine.lockAnswer(currentPlayer.id)
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, currentPlayer, persistRoom])

  const nextRound = useCallback(() => {
    if (engine) {
      engine.nextRound()
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, persistRoom])

  const skipRound = useCallback(() => {
    if (engine) {
      engine.skipRound()
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, persistRoom])

  const calculateScore = useCallback((isCorrect: boolean) => {
    if (engine && currentPlayer && engine.getCurrentRound()) {
      const basePoints = engine.getCurrentRound()?.points || 0
      engine.calculateScore(currentPlayer.id, isCorrect, basePoints)
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, currentPlayer, persistRoom])

  const endGame = useCallback(() => {
    if (engine) {
      engine.endGame()
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, persistRoom])

  const restartGame = useCallback(() => {
    if (engine) {
      engine.restartGame()
      setGameState(engine.getState())
      persistRoom(engine)
    }
  }, [engine, persistRoom])

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
