import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Parse .env.local
const envLines = readFileSync(join(root, '.env.local'), 'utf8').split('\n');
const env = {};
for (const line of envLines) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Parse CSV (ISO-8859/Latin-1 encoded)
const csvRaw = readFileSync(join(root, 'public', 'ordliste.csv'), 'latin1');
const lines = csvRaw.split(/\r?\n/).filter(Boolean);
const dataLines = lines.slice(1); // skip header

const csvRows = dataLines.map((line) => {
  const [hint_word_a, solution, hint_word_b, compound_before, compound_after] = line.split(';');
  return { hint_word_a, solution, hint_word_b, compound_before, compound_after };
});

// Find the last existing play_date and puzzle_number
const { data: maxRow, error: maxErr } = await supabase
  .from('puzzles')
  .select('play_date, puzzle_number')
  .order('play_date', { ascending: false })
  .limit(1)
  .single();

if (maxErr && maxErr.code !== 'PGRST116') {
  console.error('Failed to query existing puzzles:', maxErr.message);
  process.exit(1);
}

let nextDate;
let nextNumber;

if (maxRow) {
  const last = new Date(maxRow.play_date);
  last.setUTCDate(last.getUTCDate() + 1);
  nextDate = last.toISOString().slice(0, 10);
  nextNumber = (maxRow.puzzle_number ?? 0) + 1;
} else {
  nextDate = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  nextNumber = 1;
}

console.log(`Last existing puzzle: ${maxRow ? `${maxRow.play_date} (#${maxRow.puzzle_number})` : 'none'}`);
console.log(`Starting import from ${nextDate}, puzzle #${nextNumber}`);
console.log(`Rows to import: ${csvRows.length}`);

// Build insert rows
const puzzles = csvRows.map((row, i) => {
  const d = new Date(nextDate);
  d.setUTCDate(d.getUTCDate() + i);
  return {
    play_date: d.toISOString().slice(0, 10),
    hint_word_a: row.hint_word_a,
    hint_word_b: row.hint_word_b,
    solution: row.solution,
    a_position: 'before',
    compound_before: row.compound_before,
    compound_after: row.compound_after,
    puzzle_number: nextNumber + i,
  };
});

const { error: insertErr, count } = await supabase
  .from('puzzles')
  .upsert(puzzles, { onConflict: 'play_date', ignoreDuplicates: true, count: 'exact' });

if (insertErr) {
  console.error('Insert failed:', insertErr.message);
  process.exit(1);
}

console.log(`Done. Inserted ${count ?? '?'} puzzles.`);
console.log(`Date range: ${puzzles[0].play_date} → ${puzzles[puzzles.length - 1].play_date}`);
