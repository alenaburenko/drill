# Drill — Practice Platform

A sophisticated dark-themed developer practice platform for coding task repetitions, progress tracking, and interview preparation.

## Features

- **Spaced Repetition & Intervals**: Master coding tasks in progressive difficulty levels (Junior → Middle → Senior)
- **6-Stage Learning System**: Read → Study → Retype → Stage 4 → Stage 5 → Stage 6 → Mastered
- **Interactive Code Editor**: Integrated Monaco editor with client-side sandboxed test execution
- **Explanatory Comments Switch**: Instantly toggle detailed line-by-line code explanations
- **Huge Database of Tasks**: Over 540 canonical developer interview tasks across JS, React, CSS, TS, and Algorithms
- **XP & Level System**: Earn experience points, level up, and maintain your practice streak
- **Achievement System**: Unlock achievements as you progress
- **5 Retro Themes**: Cyberpunk, Matrix, Amber (Fallout-style), Dracula, Ice Cold Blue
- **CRT Screen Effects**: Toggleable scanlines, curvature, and flicker
- **Custom Tasks**: Upload your own tasks via form or JSON import
- **Progress Backup & Restore**: Export/import your progress data
- **Full i18n**: Ukrainian and English localisation

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests (Vitest) |
| `npm run lint` | TypeScript type-check |
| `npm run lint:fix` | Format code with Prettier |

## Project Structure

```
src/
├── components/         # React components (CatalogView, DashboardView, TaskView, etc.)
│   └── ui/             # Base UI primitives (Card, Button, Badge, etc.)
├── hooks/              # Custom React hooks (useTaskCatalog, etc.)
├── utils/              # Utility functions (sound, badges, achievements, etc.)
├── tasks/              # Task definitions — 540+ coding challenges
│   ├── itlead.ts       # Core IT Lead Academy tasks
│   └── extra.ts        # Extra tasks from Big Front End
├── __tests__/          # Test files (Vitest)
├── App.tsx             # Main app component with routing and state
├── index.css           # Global styles + 5 retro themes + CRT effects
├── i18n.ts             # Internationalization (UK/EN)
├── router.ts           # Hash-based routing
├── types.ts            # TypeScript type definitions
└── constants.ts        # App constants
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** for build tooling
- **Tailwind CSS 4** (runtime via Vite plugin)
- **Motion** for animations
- **Monaco Editor** for code editing
- **Vitest** for testing (jsdom environment)
- **Lucide React** for icons

## License

MIT — see [LICENSE](LICENSE) for details.
