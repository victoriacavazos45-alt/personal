// Quiz construction: question selection (uniform or adaptive) and
// per-presentation answer shuffling.

import { QUESTIONS } from '../data/questions'

// Fisher–Yates, crypto-seeded where available.
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rand() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0] / 2 ** 32
  }
  return Math.random()
}

// Answer order is re-randomized on every presentation of a question,
// so the correct choice never settles into a consistent letter.
export function shuffledChoices(question) {
  const entries = [
    { text: question.correct, correct: true },
    ...question.distractors.map((d) => ({ text: d, correct: false })),
  ]
  return shuffle(entries)
}

// Weighted sample without replacement.
function weightedSample(items, weights, count) {
  const pool = items.map((item, i) => ({ item, w: weights[i] }))
  const picked = []
  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((s, p) => s + p.w, 0)
    let roll = rand() * total
    let idx = 0
    for (; idx < pool.length - 1; idx++) {
      roll -= pool[idx].w
      if (roll <= 0) break
    }
    picked.push(pool[idx].item)
    pool.splice(idx, 1)
  }
  return picked
}

/**
 * Build a quiz.
 * @param {object} opts
 * @param {string[]} opts.categories  category ids to draw from
 * @param {number}   opts.count       requested question count (5–50)
 * @param {boolean}  opts.adaptive    weight selection toward weak areas
 * @param {object}   opts.questionStats  { [id]: {attempts, misses} }
 * @param {object}   opts.categoryStats  { [cat]: {attempts, misses} }
 * @param {Set}      [opts.onlyIds]   restrict pool (e.g. bookmark quiz)
 */
export function buildQuiz({ categories, count, adaptive, questionStats = {}, categoryStats = {}, onlyIds = null }) {
  let pool = QUESTIONS.filter((q) => categories.includes(q.category))
  if (onlyIds) pool = pool.filter((q) => onlyIds.has(q.id))
  if (pool.length === 0) return []

  const n = Math.min(count, pool.length)

  if (!adaptive) return shuffle(pool).slice(0, n)

  const weights = pool.map((q) => {
    const qs = questionStats[q.id]
    const cs = categoryStats[q.category]
    // Unseen questions get a moderate boost so coverage stays broad.
    const qMissRate = qs && qs.attempts > 0 ? qs.misses / qs.attempts : 0.35
    const cMissRate = cs && cs.attempts > 0 ? cs.misses / cs.attempts : 0.25
    // Base weight 1; a question missed every time approaches 5x; a weak
    // category adds up to 2x on top.
    return (1 + 4 * qMissRate) * (1 + 2 * cMissRate)
  })

  return weightedSample(pool, weights, n)
}

// Renders ruleText with critical phrases wrapped for the yellow highlight.
// Returns an array of segments: { text, highlight }.
export function highlightSegments(ruleText, critical = []) {
  if (!critical.length) return [{ text: ruleText, highlight: false }]
  const escaped = critical
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'gi')
  const lowered = critical.map((c) => c.toLowerCase())
  return ruleText
    .split(re)
    .filter((s) => s !== '')
    .map((s) => ({ text: s, highlight: lowered.includes(s.toLowerCase()) }))
}
