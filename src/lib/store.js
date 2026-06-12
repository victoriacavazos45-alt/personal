// Data layer. Two interchangeable backends:
//   SupabaseStore — production: RLS-protected tables, anonymous aggregates
//                   via an Edge Function (fire-and-forget, no user identity).
//   LocalStore    — demo/training mode when Supabase env vars are absent;
//                   persists progress data (never auth tokens) in localStorage.
//
// Both expose the same async API so every screen is backend-agnostic, and
// future additions (Google Analytics, privacy tooling) plug in here without
// a rebuild of the UI.

import { supabase, supabaseConfigured } from './supabaseClient'
import { advanceStreak, todayKey } from './streak'

const MIN_MS_BETWEEN_SUBMITS = 3000 // client-side guard; server enforces its own rate limit

class SupabaseStore {
  constructor(userId) {
    this.userId = userId
    this.lastSubmit = 0
  }

  async getQuestionStats() {
    const { data, error } = await supabase
      .from('question_stats')
      .select('question_id, attempts, misses')
    if (error) throw error
    return Object.fromEntries(data.map((r) => [r.question_id, { attempts: r.attempts, misses: r.misses }]))
  }

  async getBookmarks() {
    const { data, error } = await supabase.from('bookmarks').select('question_id')
    if (error) throw error
    return new Set(data.map((r) => r.question_id))
  }

  async toggleBookmark(questionId, on) {
    if (on) {
      const { error } = await supabase
        .from('bookmarks')
        .upsert({ user_id: this.userId, question_id: questionId }, { onConflict: 'user_id,question_id' })
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('question_id', questionId)
      if (error) throw error
    }
  }

  async getSessions(sinceDays = 90) {
    const since = new Date(Date.now() - sinceDays * 86400000).toISOString()
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('id, mode, categories, completed_at, question_count, correct_count')
      .not('completed_at', 'is', null)
      .gte('completed_at', since)
      .order('completed_at', { ascending: true })
    if (error) throw error
    return data
  }

  async getCategoryStats() {
    const { data, error } = await supabase
      .from('category_stats')
      .select('category, attempts, misses')
    if (error) throw error
    return Object.fromEntries(data.map((r) => [r.category, { attempts: r.attempts, misses: r.misses }]))
  }

  async getUserStats() {
    const { data, error } = await supabase.from('user_stats').select('*').maybeSingle()
    if (error) throw error
    return data
  }

  async recordLogin() {
    await this.#bumpStreak()
  }

  async completeSession(session) {
    const now = Date.now()
    if (now - this.lastSubmit < MIN_MS_BETWEEN_SUBMITS) {
      throw new Error('Submitting too fast — slow down.')
    }
    this.lastSubmit = now

    const { error: sErr } = await supabase.from('quiz_sessions').insert({
      id: session.id,
      user_id: this.userId,
      mode: session.mode,
      categories: session.categories,
      started_at: session.startedAt,
      completed_at: session.completedAt,
      question_count: session.total,
      correct_count: session.correct,
    })
    if (sErr) throw sErr

    const rows = session.attempts.map((a) => ({
      user_id: this.userId,
      session_id: session.id,
      question_id: a.questionId,
      category: a.category,
      is_correct: a.isCorrect,
      created_at: a.answeredAt,
    }))
    const { error: aErr } = await supabase.from('quiz_attempts').insert(rows)
    if (aErr) throw aErr

    // Per-question and per-category rollups, kept server-side via RPC so a
    // concurrent session can't clobber counts.
    const { error: rErr } = await supabase.rpc('apply_attempt_rollups', {
      p_attempts: session.attempts.map((a) => ({
        question_id: a.questionId,
        category: a.category,
        is_correct: a.isCorrect,
      })),
    })
    if (rErr) throw rErr

    const stats = await this.#bumpStreak()
    const scorePct = Math.round((session.correct / session.total) * 100)
    if (scorePct > (stats?.best_score_pct ?? -1)) {
      await supabase
        .from('user_stats')
        .update({ best_score_pct: scorePct, best_score_date: todayKey() })
        .eq('user_id', this.userId)
      stats.best_score_pct = scorePct
    }

    this.#sendAnonymousAggregates(session)
    return stats
  }

  async #bumpStreak() {
    const prev = await this.getUserStats()
    const next = advanceStreak(prev)
    const row = {
      user_id: this.userId,
      ...next,
      best_score_pct: prev?.best_score_pct ?? null,
      best_score_date: prev?.best_score_date ?? null,
    }
    const { data, error } = await supabase
      .from('user_stats')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw error
    return data
  }

  // Blind aggregate pipeline: question-level outcomes only, sent to an Edge
  // Function with NO Authorization header so no user identity travels with
  // the payload. Failure here never affects the user-facing flow.
  #sendAnonymousAggregates(session) {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-aggregate`
      const payload = {
        results: session.attempts.map((a) => ({
          question_id: a.questionId,
          category: a.category,
          is_correct: a.isCorrect,
        })),
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* aggregates are best-effort */
    }
  }
}

// ── Local (demo) backend ────────────────────────────────────────────

const LOCAL_KEY = 'seasmart-local-v1'

function loadLocal() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY)) ?? {}
  } catch {
    return {}
  }
}

function saveLocal(db) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(db))
}

class LocalStore {
  constructor() {
    this.db = {
      questionStats: {},
      categoryStats: {},
      bookmarks: [],
      sessions: [],
      userStats: null,
      ...loadLocal(),
    }
    this.lastSubmit = 0
  }

  #persist() {
    saveLocal(this.db)
  }

  async getQuestionStats() {
    return { ...this.db.questionStats }
  }

  async getBookmarks() {
    return new Set(this.db.bookmarks)
  }

  async toggleBookmark(questionId, on) {
    const set = new Set(this.db.bookmarks)
    if (on) set.add(questionId)
    else set.delete(questionId)
    this.db.bookmarks = [...set]
    this.#persist()
  }

  async getSessions(sinceDays = 90) {
    const since = Date.now() - sinceDays * 86400000
    return this.db.sessions.filter((s) => new Date(s.completed_at).getTime() >= since)
  }

  async getCategoryStats() {
    return { ...this.db.categoryStats }
  }

  async getUserStats() {
    return this.db.userStats
  }

  async recordLogin() {
    this.db.userStats = { ...this.db.userStats, ...advanceStreak(this.db.userStats) }
    this.#persist()
    return this.db.userStats
  }

  async completeSession(session) {
    const now = Date.now()
    if (now - this.lastSubmit < MIN_MS_BETWEEN_SUBMITS) {
      throw new Error('Submitting too fast — slow down.')
    }
    this.lastSubmit = now

    this.db.sessions.push({
      id: session.id,
      mode: session.mode,
      categories: session.categories,
      completed_at: session.completedAt,
      question_count: session.total,
      correct_count: session.correct,
    })
    for (const a of session.attempts) {
      const q = this.db.questionStats[a.questionId] ?? { attempts: 0, misses: 0 }
      q.attempts += 1
      if (!a.isCorrect) q.misses += 1
      this.db.questionStats[a.questionId] = q

      const c = this.db.categoryStats[a.category] ?? { attempts: 0, misses: 0 }
      c.attempts += 1
      if (!a.isCorrect) c.misses += 1
      this.db.categoryStats[a.category] = c
    }
    const streak = advanceStreak(this.db.userStats)
    const scorePct = Math.round((session.correct / session.total) * 100)
    this.db.userStats = {
      ...this.db.userStats,
      ...streak,
      best_score_pct: Math.max(this.db.userStats?.best_score_pct ?? 0, scorePct),
      best_score_date:
        scorePct > (this.db.userStats?.best_score_pct ?? -1)
          ? todayKey()
          : this.db.userStats?.best_score_date ?? null,
    }
    this.#persist()
    return this.db.userStats
  }
}

export function createStore(userId) {
  return supabaseConfigured ? new SupabaseStore(userId) : new LocalStore()
}

export { supabaseConfigured }
