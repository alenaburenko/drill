# Contributing to Drill Practice Platform

Thank you for considering contributing! Here's how to get started.

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm test` | Run all tests (Vitest) |
| `npm run lint` | TypeScript type-check |
| `npm run preview` | Preview production build |

## Code Style

- TypeScript strict mode
- Prettier for formatting (config in `.prettierrc`)
- Single quotes, semicolons required
- 120 character print width
- Use `const` over `let`, never `var`

## Pull Request Process

1. Run `npm run lint` and `npm test` before pushing
2. Ensure all existing tests pass
3. Add tests for new functionality
4. Update README if user-facing changes are made

## Project Structure

```
src/
├── components/     # React components
│   └── ui/         # Base UI primitives
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── tasks/          # Task definitions (data)
├── __tests__/      # Test files
├── App.tsx         # Main app component
├── index.css       # Global styles + themes
├── i18n.ts         # Internationalization
├── router.ts       # Hash-based routing
└── types.ts        # TypeScript types
```
