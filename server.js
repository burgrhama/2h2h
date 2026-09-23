import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3000

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const rooms = new Map()

const defaultRoomState = (roomCode, hostId) => ({
  roomCode,
  hostId,
  player1: null,
  player2: null,
  gameState: 'LOBBY',
  currentRound: 0,
  totalRounds: 25,
  roundIds: [],
  player1Answer: null,
  player2Answer: null,
  player1Locked: false,
  player2Locked: false,
  scores: {},
  difficulty: 'chill',
  enabledCategories: [
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
  ],
  createdAt: Date.now(),
})

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return rooms.has(code) ? generateRoomCode() : code
}

const emitRoom = (roomCode) => {
  const room = rooms.get(roomCode)
  if (!room) return
  io.to(roomCode).emit('room:update', { room })
}

io.on('connection', (socket) => {
  socket.on('room:create', ({ player }, callback) => {
    const roomCode = generateRoomCode()
    const nextRoom = defaultRoomState(roomCode, player.id)
    nextRoom.player1 = { ...player, score: 0, connected: true, ready: false }
    nextRoom.scores[player.id] = 0
    rooms.set(roomCode, nextRoom)
    socket.join(roomCode)
    socket.data.roomCode = roomCode
    socket.data.playerId = player.id
    if (callback) callback({ ok: true, room: nextRoom })
    emitRoom(roomCode)
  })

  socket.on('room:join', ({ roomCode, player }, callback) => {
    const normalizedCode = String(roomCode || '').trim().toUpperCase()
    const room = rooms.get(normalizedCode)
    if (!room) {
      if (callback) callback({ ok: false, message: 'Room not found' })
      return
    }

    if (room.player1?.id === player.id || room.player2?.id === player.id) {
      socket.join(normalizedCode)
      socket.data.roomCode = normalizedCode
      socket.data.playerId = player.id
      if (callback) callback({ ok: true, room })
      emitRoom(normalizedCode)
      return
    }

    if (room.player1 && room.player2) {
      if (callback) callback({ ok: false, message: 'Room full' })
      return
    }

    const nextPlayer = { ...player, score: 0, connected: true, ready: false }
    if (!room.player1) {
      room.player1 = nextPlayer
    } else if (!room.player2) {
      room.player2 = nextPlayer
    }
    room.scores[nextPlayer.id] = 0
    socket.join(normalizedCode)
    socket.data.roomCode = normalizedCode
    socket.data.playerId = nextPlayer.id
    if (callback) callback({ ok: true, room })
    emitRoom(normalizedCode)
  })

  socket.on('room:update', ({ roomCode, room }, callback) => {
    const normalizedCode = String(roomCode || '').trim().toUpperCase()
    if (!normalizedCode || !room) {
      if (callback) callback({ ok: false })
      return
    }

    rooms.set(normalizedCode, room)
    if (callback) callback({ ok: true })
    emitRoom(normalizedCode)
  })

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode
    const playerId = socket.data.playerId
    if (!roomCode || !playerId) return

    const room = rooms.get(roomCode)
    if (!room) return

    if (room.player1?.id === playerId) {
      room.player1 = null
      delete room.scores[playerId]
    } else if (room.player2?.id === playerId) {
      room.player2 = null
      delete room.scores[playerId]
    }

    if (!room.player1 && !room.player2) {
      rooms.delete(roomCode)
      return
    }

    if (!room.player1 || !room.player2) {
      room.gameState = 'LOBBY'
    }

    emitRoom(roomCode)
  })
})

app.use(express.static(join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`🎮 2 HIGH 2 HANDLE is running on port ${PORT}`)
  console.log(`📍 Local: http://localhost:${PORT}`)
})
