export type LifelineType = 'position' | 'letter_count' | 'first_letter';

export type GameStatus = 'idle' | 'playing' | 'won' | 'failed';

export interface DailyPuzzle {
  puzzleId: string;
  hintWordA: string;
  hintWordB: string;
  solutionLength: number;
  solutionFirstLetter: string;
  puzzleNumber: number;
  playDate: string; // YYYY-MM-DD Oslo
}

export interface GameState {
  status: GameStatus;
  guesses: string[];
  lifelinesUsed: LifelineType[];
  elapsedSeconds: number;
  // Set when position lifeline is revealed:
  aIsBefore: boolean | null;
  // Puzzle data cached locally
  puzzle: DailyPuzzle | null;
  // Date this state belongs to (Oslo date YYYY-MM-DD)
  stateDate: string | null;
}

export interface CompletedGame {
  puzzleId: string;
  solved: boolean;
  guesses: string[];
  guessCount: number;
  lifelinesUsed: LifelineType[];
  lifelineCount: number;
  elapsedSeconds: number;
}
