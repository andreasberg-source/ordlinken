import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const vars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const result = Object.fromEntries(
    vars.map((key) => {
      const val = process.env[key];
      return [key, val ? `✅ set (${val.slice(0, 8)}...)` : '❌ missing'];
    }),
  );

  return NextResponse.json(result, { status: 200 });
}
