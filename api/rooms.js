const rooms = globalThis.__twoHighTwoHandleRooms || (globalThis.__twoHighTwoHandleRooms = new Map())

const defaultRoom = (roomCode, player) => ({
  roomCode,
  hostId: player.id,
  player1: { ...player, score: 0, connected: true, ready: false },
  player2: null,
  gameState: 'LOBBY',
  currentRound: 0,
  totalRounds: 25,
  roundIds: [],
  player1Answer: null,
  player2Answer: null,
  player1Locked: false,
  player2Locked: false,
  scores: { [player.id]: 0 },
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
  do {
    code = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (rooms.has(code))
  return code
}

const body = (req) => typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store')

  try {
    const input = body(req)
    const normalizedCode = String(input.roomCode || '').trim().toUpperCase()

    if (req.method === 'GET') {
      const room = rooms.get(normalizedCode)
      return room
        ? res.status(200).json({ ok: true, room })
        : res.status(404).json({ ok: false, message: 'Room not found' })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: 'Method not allowed' })
    }

    if (!input.player?.id) {
      return res.status(400).json({ ok: false, message: 'Player is required' })
    }

    if (input.action === 'create') {
      const room = defaultRoom(generateRoomCode(), input.player)
      rooms.set(room.roomCode, room)
      return res.status(200).json({ ok: true, room })
    }

    const room = rooms.get(normalizedCode)
    if (!room) return res.status(404).json({ ok: false, message: 'Room not found' })

    if (input.action === 'join') {
      if (room.player1?.id === input.player.id || room.player2?.id === input.player.id) {
        return res.status(200).json({ ok: true, room })
      }
      if (room.player1 && room.player2) {
        return res.status(409).json({ ok: false, message: 'Room full' })
      }
      room.player2 = { ...input.player, score: 0, connected: true, ready: false }
      room.scores[input.player.id] = 0
      return res.status(200).json({ ok: true, room })
    }

    if (input.action === 'update' && input.room) {
      rooms.set(normalizedCode, input.room)
      return res.status(200).json({ ok: true, room: input.room })
    }

    return res.status(400).json({ ok: false, message: 'Unknown action' })
  } catch (error) {
    console.error('Room API error:', error)
    return res.status(400).json({ ok: false, message: 'Invalid room request' })
  }
}
