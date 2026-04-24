import type { DailyPuzzle, LifelineType } from './game';

export interface TodayPuzzleResponse extends DailyPuzzle {}

export interface ValidateRequest {
  puzzleId: string;
  guess: string;
}

export interface ValidateResponse {
  correct: boolean;
}

export interface PositionLifelineResponse {
  aIsBefore: boolean;
}

export interface SaveResultRequest {
  puzzleId: string;
  solved: boolean;
  guesses: string[];
  guessCount: number;
  lifelinesUsed: LifelineType[];
  lifelineCount: number;
  elapsedSeconds: number;
  playDate: string;
}

export interface SaveResultResponse {
  ok: boolean;
  newStreak?: number;
}

export interface LeaderboardEntry {
  username: string;
  solved: boolean;
  guessCount: number;
  lifelineCount: number;
  elapsedSeconds: number;
  rank: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  userRank?: number;
}
