# Coachtek Frontend

React PWA for coaches, clients, and platform operators.

## Setup

```powershell
cd frontend
pnpm install
copy .env.example .env
pnpm dev
```

App runs at http://localhost:5173

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |

## API mode

By default the app uses mock services (`VITE_USE_MOCK_API=true` in `.env.example`). Set to `false` when the backend is ready.
