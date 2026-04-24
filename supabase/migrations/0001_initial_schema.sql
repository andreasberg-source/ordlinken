-- OrdLinken database schema
-- Run this in your Supabase SQL editor or via supabase db push

-- Daily puzzles
CREATE TABLE IF NOT EXISTS puzzles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_date       DATE NOT NULL UNIQUE,
  hint_word_a     TEXT NOT NULL,
  hint_word_b     TEXT NOT NULL,
  solution        TEXT NOT NULL,
  -- 'before' means hint_a + solution forms a compound; 'after' means solution + hint_a forms a compound
  a_position      TEXT NOT NULL CHECK (a_position IN ('before', 'after')),
  compound_before TEXT NOT NULL,   -- compound where solution follows the first hint
  compound_after  TEXT NOT NULL,   -- compound where solution precedes the second hint
  puzzle_number   INT,             -- sequential display number (#1, #2, ...)
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          TEXT UNIQUE NOT NULL,
  current_streak    INT NOT NULL DEFAULT 0,
  longest_streak    INT NOT NULL DEFAULT 0,
  last_played_date  DATE,
  total_games       INT NOT NULL DEFAULT 0,
  total_wins        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile on user sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Game results (one per registered user per puzzle)
CREATE TABLE IF NOT EXISTS game_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  puzzle_id       UUID NOT NULL REFERENCES puzzles(id),
  play_date       DATE NOT NULL,
  solved          BOOLEAN NOT NULL DEFAULT FALSE,
  guess_count     INT NOT NULL CHECK (guess_count BETWEEN 1 AND 5),
  lifelines_used  JSONB NOT NULL DEFAULT '[]',
  lifeline_count  INT NOT NULL DEFAULT 0 CHECK (lifeline_count BETWEEN 0 AND 3),
  elapsed_seconds INT NOT NULL CHECK (elapsed_seconds >= 0),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, puzzle_id)
);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_game_results_play_date ON game_results(play_date);
CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results(user_id);
