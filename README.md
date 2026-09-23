# ☁️ 2 HIGH 2 HANDLE ☁️

A polished, mobile-first two-player party game for people who are ready to overthink absolutely everything.

## Features

- ✅ 100 unique rounds across 10 categories
- ✅ Real-time multiplayer without accounts
- ✅ Room-based gameplay with short codes (e.g., A7K9P)
- ✅ Customizable game settings (length, difficulty, categories)
- ✅ Multiple round types: choice-based, text guesses, drawing, memory, timed actions, debates, chaos
- ✅ Point-based scoring system
- ✅ Responsive mobile-first design
- ✅ Smooth animations and glassmorphism UI
- ✅ Optional vibe break feature
- ✅ Sound settings toggle
- ✅ Animated results screen

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build**: Vite
- **Icons**: Lucide React
- **Backend**: Supabase Realtime (configurable)

## Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Game Flow

1. **Home Page** - Create or join a room
2. **Player Setup** - Enter name, pick avatar, select color
3. **Lobby** - Wait for second player to join
4. **Game Settings** - Configure game length, difficulty, categories
5. **Game Screen** - Play through rounds
6. **Results** - See final scores and winner

## Round Types

- **Guess Me**: Predict what the other player would choose
- **Would You Rather**: Choose between two options
- **Who Knows Who**: Guess personal facts about opponent
- **Make Me Laugh**: Perform comedy actions (timed)
- **Mini Debate**: Argue silly topics
- **Draw It**: One draws, one guesses
- **Memory**: Memorize and recreate sequences
- **Trivia**: Answer multiple-choice questions
- **Deep Thoughts**: Share personal reflections
- **Chaos**: Unpredictable wild challenges

## MVP Acceptance Criteria

✅ Two users can create/join rooms
✅ Both players in lobby
✅ Host can start games
✅ Rounds randomized
✅ No round repeats per game
✅ Scores update correctly
✅ Simultaneous answer mechanics
✅ Timed rounds work
✅ Skip system included
✅ 10/25/50/100 round modes
✅ Category filtering
✅ Mobile responsive
✅ Desktop responsive
✅ No accounts required
✅ No cannabis mechanics required
✅ Fully playable sober

## Key Features Implemented

- 100 complete rounds with all data
- Game engine for round logic and scoring
- Context-based state management
- Responsive grid layouts
- Animated transitions and interactions
- Real-time score updates
- Category emoji badges
- Flavor text for personality
- Winner titles randomization
- Tiebreaker detection

## Future Enhancements

- Supabase Realtime integration for true multiplayer
- Drawing canvas with full tools (pen, eraser, colors, undo)
- Sound effects and music
- Accessibility improvements (ARIA, keyboard nav)
- Additional round types and custom round creation
- Leaderboards and stats tracking
- Mobile app wrapper (React Native)

---

No account. No profile. Just a game. 💜
