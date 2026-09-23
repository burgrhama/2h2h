import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer, { DataConnection } from 'peerjs'
import GameEngine, { GameState, Player, RoomSettings } from '../engine/GameEngine'

const LEGACY_ROOM_STORAGE_KEY = 'two-high-2-handle-room'
const ROOM_STORAGE_PREFIX = 'two-high-2-handle-room-'
const ACTIVE_ROOM_STORAGE_KEY = 'two-high-2-handle-active-room'

const getRoomStorageKey = (roomCode: string): string => `${ROOM_STORAGE_PREFIX}${roomCode.trim().toUpperCase()}`

interface GameContextType {
  engine: GameEngine | null
  gameState: GameState | null
  currentPlayer: Player | null
  createRoom: (player: Player) => Promise<boolean>
  joinRoom: (roomCode: string, player: Player) => Promise<boolean>
  updateSettings: (settings: RoomSettings) => void
  startGame: () => void
  submitAnswer: (answer: string | number) => void
  lockAnswer: () => void
  nextRound: () => void
  skipRound: () => void
  calculateScore: (isCorrect: boolean) => void
  finishRound: (player1Correct: boolean, player2Correct: boolean) => void
  endGame: () => void
  restartGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null)
  const currentPlayerIdRef = useRef<string | null>(null)
  const restRoomCodeRef = useRef<string | null>(null)
  const peerRef = useRef<Peer | null>(null)
  const peerConnectionsRef = useRef<DataConnection[]>([])
  const roomEngineRef = useRef<GameEngine | null>(null)

  const syncRoomState = useCallback((room: GameState | null) => {
    if (!room) {
      setEngine(null)
      setGameState(null)
      setCurrentPlayer(null)
      return
    }

    const nextEngine = GameEngine.fromState(room)
    setEngine(nextEngine)
    roomEngineRef.current = nextEngine
    setGameState(room)
    setCurrentPlayer(room.player1 ?? room.player2 ?? null)
  }, [])

  const loadRoomFromStorage = useCallback((roomCode?: string): GameState | null => {
    if (typeof window === 'undefined') return null

    try {
      const targetKey = roomCode ? getRoomStorageKey(roomCode) : window.localStorage.getItem(ACTIVE_ROOM_STORAGE_KEY) || LEGACY_ROOM_STORAGE_KEY
      const savedRoom = window.localStorage.getItem(targetKey)
      if (!savedRoom) return null

      const parsedRoom = JSON.parse(savedRoom) as GameState
      return parsedRoom?.roomCode ? parsedRoom : null
    } catch {
      return null
    }
  }, [])

  const findRoomByCode = useCallback((roomCode: string): GameState | null => {
    if (typeof window === 'undefined') return null

    const normalizedCode = roomCode.trim().toUpperCase()
    if (!normalizedCode) return null

    const key = getRoomStorageKey(normalizedCode)
    const savedRoom = window.localStorage.getItem(key)
    if (savedRoom) {
      try {
        const parsedRoom = JSON.parse(savedRoom) as GameState
        return parsedRoom?.roomCode ? parsedRoom : null
      } catch {
        return null
      }
    }

    const legacyRoom = window.localStorage.getItem(LEGACY_ROOM_STORAGE_KEY)
    if (!legacyRoom) return null

    try {
      const parsedLegacyRoom = JSON.parse(legacyRoom) as GameState
      return parsedLegacyRoom?.roomCode === normalizedCode ? parsedLegacyRoom : null
    } catch {
      return null
    }
  }, [])

  const persistRoom = useCallback((engineToSave: GameEngine) => {
    if (typeof window === 'undefined') return
    const roomCode = engineToSave.getState().roomCode
    const payload = JSON.stringify(engineToSave.getState())
    const roomKey = getRoomStorageKey(roomCode)
    window.localStorage.setItem(roomKey, payload)
    window.localStorage.setItem(LEGACY_ROOM_STORAGE_KEY, payload)
    window.localStorage.setItem(ACTIVE_ROOM_STORAGE_KEY, roomKey)
  }, [])

  const applyPeerRoom = useCallback((room: GameState) => {
    const nextEngine = GameEngine.fromState(room)
    roomEngineRef.current = nextEngine
    setEngine(nextEngine)
    setGameState(room)
    setCurrentPlayer([room.player1, room.player2]
      .find((player) => player?.id === currentPlayerIdRef.current) ?? null)
    persistRoom(nextEngine)
  }, [persistRoom])

  const sendPeerRoom = useCallback((room: GameState) => {
    peerConnectionsRef.current = peerConnectionsRef.current.filter((connection) => connection.open)
    for (const connection of peerConnectionsRef.current) {
      connection.send({ type: 'room', room })
    }
  }, [])

  const waitForPeerOpen = useCallback((peer: Peer, timeoutMs = 10000) => new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup()
      reject(new Error('Peer connection timed out'))
    }, timeoutMs)
    const handleOpen = () => {
      cleanup()
      resolve()
    }
    const handleError = (error: Error) => {
      cleanup()
      reject(error)
    }
    const cleanup = () => {
      window.clearTimeout(timeout)
      peer.off('open', handleOpen)
      peer.off('error', handleError)
    }
    peer.once('open', handleOpen)
    peer.once('error', handleError)
  }), [])

  const [engine, setEngine] = useState<GameEngine | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const configuredSocketUrl = (import.meta as ImportMeta & {
      env?: { VITE_SOCKET_URL?: string }
    }).env?.VITE_SOCKET_URL?.trim()
    const socketUrl = configuredSocketUrl ||
      (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '')

    if (!socketUrl) {
      return
    }

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('room:update', (payload: { room: GameState }) => {
      if (!payload?.room) return
      const nextEngine = GameEngine.fromState(payload.room)
      setEngine(nextEngine)
      setGameState(payload.room)
      const current = [payload.room.player1, payload.room.player2]
        .find((player) => player?.id === currentPlayerIdRef.current) ?? null
      setCurrentPlayer(current)
      persistRoom(nextEngine)
    })

    return () => {
      socket.off('room:update')
    }
  }, [persistRoom, socket])

  useEffect(() => {
    if (socket || !restRoomCodeRef.current) return

    const pollRoom = async () => {
      const code = restRoomCodeRef.current
      if (!code) return
      const response = await fetch(`/api/rooms?roomCode=${encodeURIComponent(code)}`)
      if (!response.ok) return
      const payload = await response.json() as { room?: GameState }
      if (!payload.room) return
      const nextEngine = GameEngine.fromState(payload.room)
      setEngine(nextEngine)
      setGameState(payload.room)
      setCurrentPlayer([payload.room.player1, payload.room.player2]
        .find((player) => player?.id === currentPlayerIdRef.current) ?? null)
      persistRoom(nextEngine)
    }

    const interval = window.setInterval(() => {
      void pollRoom()
    }, 1000)
    return () => window.clearInterval(interval)
  }, [gameState?.roomCode, persistRoom, socket])

  const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    if (typeof window !== 'undefined') {
      const roomKey = getRoomStorageKey(code)
      const legacyRoom = window.localStorage.getItem(LEGACY_ROOM_STORAGE_KEY)
      const hasStoredRoom = window.localStorage.getItem(roomKey) ||
        (legacyRoom ? (JSON.parse(legacyRoom) as GameState | null)?.roomCode === code : false)

      if (hasStoredRoom) {
        return generateRoomCode()
      }
    }

    return code
  }

  const waitForSocket = useCallback(async (): Promise<Socket | null> => {
    const activeSocket = socketRef.current ?? socket
    if (!activeSocket) return null
    if (activeSocket.connected) return activeSocket

    return new Promise((resolve) => {
      const timeout = window.setTimeout(() => {
        cleanup()
        resolve(null)
      }, 8000)
      const handleConnect = () => {
        cleanup()
        resolve(activeSocket)
      }
      const handleError = () => {
        cleanup()
        resolve(null)
      }
      const cleanup = () => {
        window.clearTimeout(timeout)
        activeSocket.off('connect', handleConnect)
        activeSocket.off('connect_error', handleError)
      }

      activeSocket.once('connect', handleConnect)
      activeSocket.once('connect_error', handleError)
      activeSocket.connect()
    })
  }, [socket])

  const createRoom = useCallback(async (player: Player) => {
    const activeSocket = await waitForSocket()
    if (!activeSocket && window.location.hostname !== 'localhost') {
      const roomCode = generateRoomCode()
      const nextEngine = new GameEngine(roomCode, player.id)
      nextEngine.addPlayer(player)
      const peer = new Peer(roomCode)
      try {
        await waitForPeerOpen(peer)
      } catch {
        peer.destroy()
        return false
      }

      currentPlayerIdRef.current = player.id
      restRoomCodeRef.current = roomCode
      peerRef.current = peer
      roomEngineRef.current = nextEngine
      peer.on('connection', (connection) => {
        peerConnectionsRef.current.push(connection)
        connection.on('open', () => connection.send({ type: 'room', room: nextEngine.getState() }))
        connection.on('data', (message: { type?: string, player?: Player }) => {
          if (message.type !== 'join' || !message.player || nextEngine.getState().player2) return
          nextEngine.addPlayer(message.player)
          saveAndPublish(nextEngine)
        })
        connection.on('close', () => {
          peerConnectionsRef.current = peerConnectionsRef.current.filter((item) => item !== connection)
        })
      })
      setEngine(nextEngine)
      setGameState(nextEngine.getState())
      setCurrentPlayer(player)
      persistRoom(nextEngine)
      restRoomCodeRef.current = roomCode
      return true
    }
    if (!activeSocket) return false

    return new Promise<boolean>((resolve) => {
      activeSocket.emit('room:create', { player }, (response: { ok: boolean, room?: GameState }) => {
        if (!response.ok || !response.room) {
          resolve(false)
          return
        }

        currentPlayerIdRef.current = player.id
        const nextEngine = GameEngine.fromState(response.room)
        setEngine(nextEngine)
        setGameState(response.room)
        setCurrentPlayer(player)
        persistRoom(nextEngine)
        resolve(true)
      })
    })
  }, [persistRoom, waitForSocket])

  const joinRoom = useCallback(async (roomCode: string, player: Player) => {
    const normalizedCode = roomCode.trim().toUpperCase()
    const activeSocket = await waitForSocket()
    if (!normalizedCode) return false
    if (!activeSocket && window.location.hostname !== 'localhost') {
      const peer = new Peer()
      try {
        await waitForPeerOpen(peer)
      } catch {
        peer.destroy()
        return false
      }
      const connection = peer.connect(normalizedCode, { reliable: true })
      const connected = await new Promise<boolean>((resolve) => {
        const timeout = window.setTimeout(() => resolve(false), 10000)
        connection.once('open', () => {
          window.clearTimeout(timeout)
          resolve(true)
        })
        connection.once('error', () => {
          window.clearTimeout(timeout)
          resolve(false)
        })
      })
      if (!connected) {
        peer.destroy()
        return false
      }

      currentPlayerIdRef.current = player.id
      restRoomCodeRef.current = normalizedCode
      peerRef.current = peer
      peerConnectionsRef.current = [connection]
      connection.on('data', (message: { type?: string, room?: GameState }) => {
        if (message.type === 'room' && message.room) applyPeerRoom(message.room)
      })
      connection.send({ type: 'join', player })
      return true
    }
    if (!activeSocket) return false

    let handled = false

    await new Promise<void>((resolve) => {
      activeSocket.emit('room:join', { roomCode: normalizedCode, player }, (response: { ok: boolean, room?: GameState, message?: string }) => {
        if (!response.ok || !response.room) {
          resolve()
          return
        }

        handled = true
        currentPlayerIdRef.current = player.id
        const nextEngine = GameEngine.fromState(response.room)
        setEngine(nextEngine)
        setGameState(response.room)
        setCurrentPlayer(player)
        persistRoom(nextEngine)
        resolve()
      })
    })

    return handled
  }, [persistRoom, waitForSocket])

  const publishRoom = useCallback((nextEngine: GameEngine) => {
    const activeSocket = socketRef.current
    const nextState = nextEngine.getState()
    if (activeSocket?.connected) {
      activeSocket.emit('room:update', {
        roomCode: nextState.roomCode,
        room: nextState,
      })
    } else if (window.location.hostname !== 'localhost') {
      sendPeerRoom(nextState)
    }
  }, [sendPeerRoom])

  const saveAndPublish = useCallback((nextEngine: GameEngine) => {
    setGameState(nextEngine.getState())
    persistRoom(nextEngine)
    publishRoom(nextEngine)
  }, [persistRoom, publishRoom])

  const updateSettings = useCallback((settings: RoomSettings) => {
    if (engine) {
      engine.updateSettings(settings)
      engine.initializeRounds()
      saveAndPublish(engine)
    }
  }, [engine, saveAndPublish])

  const startGame = useCallback(() => {
    if (engine) {
      engine.startGame()
      saveAndPublish(engine)
    }
  }, [engine, saveAndPublish])

  const submitAnswer = useCallback((answer: string | number) => {
    if (engine && currentPlayer) {
      engine.submitAnswer(currentPlayer.id, answer)
      saveAndPublish(engine)
    }
  }, [engine, currentPlayer, saveAndPublish])

  const lockAnswer = useCallback(() => {
    if (engine && currentPlayer) {
      engine.lockAnswer(currentPlayer.id)
      saveAndPublish(engine)
    }
  }, [engine, currentPlayer, saveAndPublish])

  const nextRound = useCallback(() => {
    if (engine) {
      engine.nextRound()
      saveAndPublish(engine)
    }
  }, [engine, saveAndPublish])

  const skipRound = useCallback(() => {
    if (engine) {
      engine.skipRound()
      saveAndPublish(engine)
    }
  }, [engine, saveAndPublish])

  const calculateScore = useCallback((isCorrect: boolean) => {
    if (engine && currentPlayer && engine.getCurrentRound()) {
      const basePoints = engine.getCurrentRound()?.points || 0
      engine.calculateScore(currentPlayer.id, isCorrect, basePoints)
      saveAndPublish(engine)
    }
  }, [engine, currentPlayer, saveAndPublish])

  const finishRound = useCallback((player1Correct: boolean, player2Correct: boolean) => {
    if (!engine || currentPlayer?.id !== engine.getState().hostId) return

    const round = engine.getCurrentRound()
    const state = engine.getState()
    if (!round || !state.player1 || !state.player2) return

    engine.calculateScore(state.player1.id, player1Correct, round.points)
    engine.calculateScore(state.player2.id, player2Correct, round.points)
    engine.nextRound()
    saveAndPublish(engine)
  }, [currentPlayer, engine, saveAndPublish])

  const endGame = useCallback(() => {
    if (engine) {
      engine.endGame()
      saveAndPublish(engine)
    }
  }, [engine, saveAndPublish])

  const restartGame = useCallback(() => {
    if (engine) {
      engine.restartGame()
      saveAndPublish(engine)
    }
  }, [engine, saveAndPublish])

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
    finishRound,
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
