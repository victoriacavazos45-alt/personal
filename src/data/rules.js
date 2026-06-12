// Rules Index data access. The rule text itself lives in colregs.json —
// a drop-in file maintained outside the codebase (pasted from the official
// USCG publication). This module derives lookup tables and the mapping
// from rules to the quiz questions that cite them.

import colregs from './colregs.json'
import { QUESTIONS } from './questions'

export const RULE_PARTS = colregs.parts

export const RULES = RULE_PARTS.flatMap((p) => p.rules.map((r) => ({ ...r, partId: p.id, partLabel: p.label })))

export const RULE_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]))

export const IS_PLACEHOLDER = RULES.some((r) =>
  r.paragraphs.some((p) => p.text.startsWith('[Placeholder]'))
)

// Map a question's rule citation (e.g. "Rule 24 / Rule 27",
// "Annex IV — Distress Signals") to rule ids in this index.
const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4 }

export function ruleIdsForQuestion(question) {
  const ids = new Set()
  const text = question.rule ?? ''
  for (const m of text.matchAll(/Rule\s+(\d+)/gi)) ids.add(`rule-${m[1]}`)
  for (const m of text.matchAll(/Annex\s+(IV|III|II|I)/gi)) ids.add(`annex-${ROMAN[m[1].toLowerCase()]}`)
  return [...ids]
}

// ruleId -> array of question ids citing it (built once).
export const QUESTIONS_BY_RULE = (() => {
  const map = {}
  for (const q of QUESTIONS) {
    for (const id of ruleIdsForQuestion(q)) {
      ;(map[id] ??= []).push(q.id)
    }
  }
  return map
})()

// Full-text search across every paragraph. Returns
// [{ rule, paragraph, index }] with the match position for snippets.
export function searchRules(query) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const hits = []
  for (const rule of RULES) {
    for (const paragraph of rule.paragraphs) {
      const idx = paragraph.text.toLowerCase().indexOf(q)
      if (idx !== -1) hits.push({ rule, paragraph, index: idx })
    }
  }
  return hits.slice(0, 50)
}

export function snippet(text, index, qLen, radius = 60) {
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + qLen + radius)
  return {
    pre: (start > 0 ? '…' : '') + text.slice(start, index),
    match: text.slice(index, index + qLen),
    post: text.slice(index + qLen, end) + (end < text.length ? '…' : ''),
  }
}
