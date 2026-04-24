-- Row Level Security policies for OrdLinken

-- Enable RLS
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- puzzles: anyone can read (but solution is never queried by client-facing routes)
CREATE POLICY "puzzles_public_read" ON puzzles
  FOR SELECT USING (true);

-- profiles: anyone can read (for leaderboard), users can update own profile
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_own_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- game_results: users can insert/update own results; leaderboard reads are public
CREATE POLICY "game_results_own_insert" ON game_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "game_results_own_update" ON game_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "game_results_public_read" ON game_results
  FOR SELECT USING (true);
