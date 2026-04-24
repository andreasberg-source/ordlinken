-- Test puzzles for development
-- Insert these via Supabase SQL editor after running the migrations
-- puzzle_number will be assigned sequentially; set play_date to your dev dates

INSERT INTO puzzles (play_date, hint_word_a, hint_word_b, solution, a_position, compound_before, compound_after, puzzle_number)
VALUES
  -- motor + [sykkel] + tur  → motorsykkel + sykkeltur
  ('2026-04-15', 'motor', 'tur', 'sykkel', 'before', 'motorsykkel', 'sykkeltur', 1),

  -- fugle + [sang] + kor  → fuglesang + sangkor
  ('2026-04-16', 'fugle', 'kor', 'sang', 'before', 'fuglesang', 'sangkor', 2),

  -- sol + [seng] + klær  → solseng + sengklær  (NB: sengklær = bedding)
  ('2026-04-17', 'sol', 'klær', 'seng', 'before', 'solseng', 'sengklær', 3),

  -- vann + [fall] + skjerm  → vannfall + fallskjerm
  ('2026-04-18', 'vann', 'skjerm', 'fall', 'before', 'vannfall', 'fallskjerm', 4),

  -- barne + [hage] + fest  → barnehage + hagefest
  ('2026-04-19', 'barne', 'fest', 'hage', 'before', 'barnehage', 'hagefest', 5),

  -- fly + [plass] + mangel  → flyplass + plassmangel
  ('2026-04-20', 'fly', 'mangel', 'plass', 'before', 'flyplass', 'plassmangel', 6),

  -- øye + [blikk] + fang  → øyeblikk + blikkfang
  ('2026-04-21', 'øye', 'fang', 'blikk', 'before', 'øyeblikk', 'blikkfang', 7)

ON CONFLICT (play_date) DO NOTHING;
