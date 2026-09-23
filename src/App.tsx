import React from 'react'
import { useGame } from './context/GameContext'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  const { gameState } = useGame()

  if (!gameState) {
    return <HomePage />
  }

  switch (gameState.gameState) {
    case 'LOBBY':
      return <LobbyPage />
    case 'SETTINGS':
      return <LobbyPage />
    case 'PLAYING':
    case 'REVEAL':
    case 'SCORING':
    case 'WAITING':
      return <GamePage />
    case 'FINISHED':
      return <ResultsPage />
    default:
      return <HomePage />
  }
}
