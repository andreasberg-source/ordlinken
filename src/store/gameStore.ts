import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, GameStatus, LifelineType, DailyPuzzle } from '@/types/game';
import { getOsloDateString } from '@/lib/utils';

interface GameActions {
  initPuzzle: (puzzle: DailyPuzzle) => void;
  startPlaying: () => void;
  addGuess: (guess: string, correct: boolean) => void;
  useLifeline: (type: LifelineType) => void;
  revealPosition: (aIsBefore: boolean) => void;
  setElapsed: (seconds: number) => void;
  resetIfStale: () => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  status: 'idle',
  guesses: [],
  lifelinesUsed: [],
  elapsedSeconds: 0,
  aIsBefore: null,
  puzzle: null,
  stateDate: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initPuzzle(puzzle) {
        const today = getOsloDateString();
        const existing = get();
        // If stateDate matches today, keep existing progress
        if (existing.stateDate === today && existing.puzzle?.puzzleId === puzzle.puzzleId) {
          return;
        }
        set({ ...initialState, puzzle, stateDate: today });
      },

      startPlaying() {
        if (get().status === 'idle') {
          set({ status: 'playing' });
        }
      },

      addGuess(guess, correct) {
        const state = get();
        const guesses = [...state.guesses, guess];
        let status: GameStatus = state.status;

        if (correct) {
          status = 'won';
        } else if (guesses.length >= 5) {
          status = 'failed';
        }

        set({ guesses, status });
      },

      useLifeline(type) {
        const state = get();
        if (!state.lifelinesUsed.includes(type)) {
          set({ lifelinesUsed: [...state.lifelinesUsed, type] });
        }
      },

      revealPosition(aIsBefore) {
        set({ aIsBefore });
      },

      setElapsed(seconds) {
        set({ elapsedSeconds: seconds });
      },

      resetIfStale() {
        const today = getOsloDateString();
        if (get().stateDate !== today) {
          set({ ...initialState });
        }
      },
    }),
    {
      name: `ordlinken-game-${getOsloDateString()}`,
      storage: createJSONStorage(() => localStorage),
      // Re-key each day so stale state auto-clears
      version: 1,
    },
  ),
);
