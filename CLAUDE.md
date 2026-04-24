@AGENTS.md

# OrdLinken — Claude Context

Norwegian daily compound-word game. Players find a hidden solution word that bridges two hint words to form valid Norwegian compound words:

```
hint_before + SOLUTION = compound  (e.g. motor + sykkel = motorsykkel)
SOLUTION + hint_after  = compound  (e.g. sykkel + tur   = sykkeltur)
```

---

## Stack

- **Next.js 16** (App Router, TypeScript) — read `node_modules/next/dist/docs/` before editing routing or server components
- **Supabase** — auth (`@supabase/ssr`) + PostgreSQL database
- **Zustand** — client game state with `localStorage` persistence keyed by Oslo date
- **Tailwind CSS v4** — utility classes only, no `tailwind.config.ts` theme extensions needed
- **Custom UI components** in `src/components/ui/` — no shadcn CLI, components were written by hand

## Key conventions

- **Oslo timezone everywhere.** Never use `new Date().toISOString().slice(0,10)` for "today". Use `getOsloDateString()` from `src/lib/utils.ts`.
- **Solution word is server-only.** It must never appear in any client response. `/api/game/validate` does the comparison server-side using `SUPABASE_SERVICE_ROLE_KEY`. `/api/game/today` returns `solutionLength` and `solutionFirstLetter` only.
- **`SUPABASE_SERVICE_ROLE_KEY` is never `NEXT_PUBLIC_`.** Used only in server-side API routes via `createServiceClient()` in `src/lib/supabase/server.ts`.
- **Guest play is supported** — `/spill` works without login. Results are only saved to Supabase for logged-in users.
- **Leaderboard rank order:** `solved DESC, guess_count ASC, lifeline_count ASC, elapsed_seconds ASC`. No numeric score.

---

## Project structure

```
src/
├── app/
│   ├── spill/page.tsx              # Main game page (Server Component)
│   ├── logg-inn/page.tsx           # Login
│   ├── register/page.tsx           # Registration
│   ├── profil/page.tsx             # User stats + streak (requires login)
│   ├── toppliste/page.tsx          # Daily leaderboard
│   └── api/
│       ├── game/today/route.ts     # GET today's puzzle (no solution)
│       ├── game/validate/route.ts  # POST guess → { correct }
│       ├── game/lifeline/position/route.ts  # POST → { aIsBefore }
│       ├── result/route.ts         # POST save completed game + update streak
│       └── leaderboard/route.ts    # GET today's rankings
├── components/
│   ├── game/                       # GameBoard, HintDisplay, GuessInput, GuessHistory,
│   │                               # GuessRow, LifelinePanel, GameTimer, GameResult, ShareCard
│   ├── auth/                       # LoginForm, RegisterForm
│   ├── leaderboard/                # LeaderboardTable
│   ├── layout/                     # Header
│   └── ui/                         # button, input, dialog
├── store/gameStore.ts              # Zustand store (persisted by Oslo date)
├── hooks/useTimer.ts               # Stopwatch tied to game status
├── lib/
│   ├── utils.ts                    # cn(), getOsloDateString(), formatTime(), formatNorwegianDate()
│   ├── supabase/client.ts          # Browser client
│   ├── supabase/server.ts          # Server client + createServiceClient()
│   └── game/shareFormatter.ts     # Builds Wordle-style share text
└── types/
    ├── game.ts                     # GameState, DailyPuzzle, CompletedGame, LifelineType
    └── api.ts                      # Request/response shapes
middleware.ts                       # Supabase session refresh (must call getUser, not getSession)
supabase/
├── migrations/0001_initial_schema.sql
├── migrations/0002_rls_policies.sql
└── seed.sql                        # 7 test puzzles starting 2026-04-16
```

---

## Database tables

| Table | Key columns |
|-------|-------------|
| `puzzles` | `play_date DATE UNIQUE`, `hint_word_a`, `hint_word_b`, `solution` (server-only), `a_position` ('before'/'after'), `compound_before`, `compound_after`, `puzzle_number` |
| `profiles` | `id` (= auth.users.id), `username`, `current_streak`, `longest_streak`, `last_played_date`, `total_games`, `total_wins` |
| `game_results` | `user_id`, `puzzle_id`, `play_date`, `solved`, `guess_count`, `lifelines_used JSONB`, `lifeline_count`, `elapsed_seconds` |

A trigger (`handle_new_user`) auto-creates a `profiles` row on Supabase sign-up using `raw_user_meta_data->>'username'`.

---

## Environment variables

Required in `.env.local` (already gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only, never NEXT_PUBLIC_
```

---

## First-time setup on a new machine

```bash
npm install
# Fill in .env.local with Supabase credentials
# Run migrations + seed in Supabase SQL editor (supabase/migrations/ + supabase/seed.sql)
npm run dev
```

---

## Adding new puzzles

Insert rows directly into the `puzzles` table in Supabase:

```sql
INSERT INTO puzzles (play_date, hint_word_a, hint_word_b, solution, a_position, compound_before, compound_after, puzzle_number)
VALUES ('2026-05-01', 'hint1', 'hint2', 'solution', 'before', 'hint1solution', 'solutionhint2', 42);
```

Keep `play_date` values at least 1–2 weeks ahead. The game shows "no puzzle today" if the date is missing.

---

## Deployment

Hosted on Vercel. Push to `main` triggers automatic redeploy.
After deploy, set Site URL and Redirect URLs in Supabase → Authentication → URL Configuration.
