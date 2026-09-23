import { ROUNDS, GameCategory, Difficulty } from '../types/rounds'

export interface Player {
  id: string
  name: string
  avatar: string
  color: string
  score: number
  connected: boolean
  ready: boolean
}

export interface GameState {
  roomCode: string
  hostId: string
  player1: Player | null
  player2: Player | null
  gameState: 'LOBBY' | 'SETTINGS' | 'PLAYING' | 'WAITING' | 'REVEAL' | 'SCORING' | 'FINISHED'
  currentRound: number
  totalRounds: number
  roundIds: number[]
  player1Answer: string | number | null
  player2Answer: string | number | null
  player1Locked: boolean
  player2Locked: boolean
  scores: { [key: string]: number }
  difficulty: Difficulty
  enabledCategories: GameCategory[]
  createdAt: number
}

export interface RoomSettings {
  gameLength: 10 | 25 | 50 | 100 | 'random'
  difficulty: Difficulty
  enabledCategories: GameCategory[]
  allowRepeats: boolean
  randomizeOrder: boolean
}

class GameEngine {
  private gameState: GameState

  constructor(roomCode: string, hostId: string) {
    this.gameState = {
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
    }
  }

  getState(): GameState {
    return this.gameState
  }

  addPlayer(player: Player): void {
    if (!this.gameState.player1) {
      this.gameState.player1 = player
      this.gameState.scores[player.id] = 0
    } else if (!this.gameState.player2) {
      this.gameState.player2 = player
      this.gameState.scores[player.id] = 0
    }
  }

  updateSettings(settings: RoomSettings): void {
    this.gameState.difficulty = settings.difficulty
    this.gameState.enabledCategories = settings.enabledCategories

    let length = settings.gameLength === 'random' ? this.getRandomLength() : settings.gameLength
    this.gameState.totalRounds = length
  }

  private getRandomLength(): 10 | 25 | 50 | 100 {
    const lengths: (10 | 25 | 50 | 100)[] = [10, 25, 50, 100]
    return lengths[Math.floor(Math.random() * lengths.length)]
  }

  initializeRounds(): void {
    const filtered = ROUNDS.filter(
      (round) =>
        this.gameState.enabledCategories.includes(round.category) &&
        this.matchesDifficulty(round)
    )

    const shuffled = this.shuffleArray(filtered)
    this.gameState.roundIds = shuffled.slice(0, this.gameState.totalRounds).map((r: any) => r.id)
  }

  private matchesDifficulty(round: any): boolean {
    const difficulty = this.gameState.difficulty
    if (difficulty === 'unhinged') return true
    if (difficulty === 'chaotic') return round.difficulty !== 'unhinged'
    return round.difficulty === 'chill'
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  startGame(): void {
    this.gameState.gameState = 'PLAYING'
    this.gameState.currentRound = 0
  }

  getCurrentRound() {
    const roundId = this.gameState.roundIds[this.gameState.currentRound]
    return ROUNDS.find((r) => r.id === roundId)
  }

  submitAnswer(playerId: string, answer: string | number): void {
    if (this.gameState.player1?.id === playerId) {
      this.gameState.player1Answer = answer
    } else if (this.gameState.player2?.id === playerId) {
      this.gameState.player2Answer = answer
    }
  }

  lockAnswer(playerId: string): void {
    if (this.gameState.player1?.id === playerId) {
      this.gameState.player1Locked = true
    } else if (this.gameState.player2?.id === playerId) {
      this.gameState.player2Locked = true
    }

    if (this.gameState.player1Locked && this.gameState.player2Locked) {
      this.gameState.gameState = 'REVEAL'
    }
  }

  calculateScore(playerId: string, isCorrect: boolean, basePoints: number): void {
    if (isCorrect) {
      this.gameState.scores[playerId] += basePoints
    }
  }

  nextRound(): void {
    this.gameState.currentRound++
    this.gameState.player1Answer = null
    this.gameState.player2Answer = null
    this.gameState.player1Locked = false
    this.gameState.player2Locked = false

    if (this.gameState.currentRound >= this.gameState.totalRounds) {
      this.gameState.gameState = 'FINISHED'
    } else {
      this.gameState.gameState = 'PLAYING'
    }
  }

  skipRound(): void {
    this.nextRound()
  }

  endGame(): void {
    this.gameState.gameState = 'FINISHED'
  }

  restartGame(): void {
    this.gameState.currentRound = 0
    this.gameState.player1Answer = null
    this.gameState.player2Answer = null
    this.gameState.player1Locked = false
    this.gameState.player2Locked = false
    this.gameState.gameState = 'SETTINGS'
    if (this.gameState.player1) this.gameState.scores[this.gameState.player1.id] = 0
    if (this.gameState.player2) this.gameState.scores[this.gameState.player2.id] = 0
  }

  getWinner(): Player | null {
    if (!this.gameState.player1 || !this.gameState.player2) return null

    const p1Score = this.gameState.scores[this.gameState.player1.id] || 0
    const p2Score = this.gameState.scores[this.gameState.player2.id] || 0

    if (p1Score > p2Score) return this.gameState.player1
    if (p2Score > p1Score) return this.gameState.player2
    return null
  }

  isTie(): boolean {
    if (!this.gameState.player1 || !this.gameState.player2) return false

    const p1Score = this.gameState.scores[this.gameState.player1.id] || 0
    const p2Score = this.gameState.scores[this.gameState.player2.id] || 0

    return p1Score === p2Score
  }
}

export default GameEngine
