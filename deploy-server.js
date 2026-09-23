#!/usr/bin/env node

/**
 * 2 HIGH 2 HANDLE - Direct Deployment Script
 * Starts a production server for deployment
 */

import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// Middleware
app.use(express.static(join(__dirname, 'dist')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: '2high2handle' })
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║       🎮 2 HIGH 2 HANDLE - PRODUCTION SERVER RUNNING 🎮       ║
║                                                               ║
║  Server listening on: http://${HOST}:${PORT}                     ║
║  Environment: ${process.env.NODE_ENV || 'production'}                         ║
║  Status: ✅ Ready to accept connections                       ║
║                                                               ║
║  📍 Access your game at:                                     ║
║     http://localhost:${PORT}                                      ║
║     (or your deployment URL)                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📍 SIGTERM received, gracefully shutting down...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('\n📍 SIGINT received, gracefully shutting down...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

export default app
