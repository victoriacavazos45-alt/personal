// Edge Function: anonymous aggregate ingestion.
//
// Receives question-level outcomes with NO user identity (the client sends
// no Authorization header) and increments blind counters. The service role
// key lives only in this function's environment — never on the client.
//
// Rate limiting: simple per-IP sliding window held in memory per function
// instance, plus a hard cap on batch size. Good enough to stop casual
// stuffing; the table itself contains nothing sensitive.

import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const VALID_CATEGORIES = new Set([
  'general',
  'lights_shapes',
  'towing',
  'distress',
  'sound',
  'annexes',
])

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  return list.length > MAX_PER_WINDOW
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return new Response('Too many requests', { status: 429 })
  }

  let body: { results?: Array<{ question_id: string; category: string; is_correct: boolean }> }
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const results = Array.isArray(body.results) ? body.results.slice(0, 50) : []
  const clean = results.filter(
    (r) =>
      typeof r.question_id === 'string' &&
      r.question_id.length <= 32 &&
      /^[A-Z]{3}-\d{3}$/.test(r.question_id) &&
      VALID_CATEGORIES.has(r.category) &&
      typeof r.is_correct === 'boolean'
  )
  if (clean.length === 0) {
    return new Response('No valid results', { status: 400 })
  }

  for (const r of clean) {
    // Upsert + increment. Counters only — no identity, no timestamps tied
    // to a session, nothing joinable back to a user.
    const { data } = await supabase
      .from('aggregate_question_stats')
      .select('times_served, times_missed')
      .eq('question_id', r.question_id)
      .maybeSingle()

    await supabase.from('aggregate_question_stats').upsert({
      question_id: r.question_id,
      category: r.category,
      times_served: (data?.times_served ?? 0) + 1,
      times_missed: (data?.times_missed ?? 0) + (r.is_correct ? 0 : 1),
      updated_at: new Date().toISOString(),
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
