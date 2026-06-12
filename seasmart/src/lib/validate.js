// Client-side input validation. The database enforces its own constraints
// and RLS; this layer keeps bad input from ever reaching it.

export function validateEmail(email) {
  const trimmed = String(email ?? '').trim()
  if (!trimmed) return 'Email is required.'
  if (trimmed.length > 254) return 'Email is too long.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return 'Enter a valid email address.'
  return null
}

export function validatePassword(password) {
  const value = String(password ?? '')
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (value.length > 128) return 'Password is too long.'
  return null
}

export function clampQuestionCount(n) {
  const num = Number(n)
  if (!Number.isFinite(num)) return 10
  return Math.min(50, Math.max(5, Math.round(num)))
}

export function sanitizeCategoryIds(ids, validIds) {
  if (!Array.isArray(ids)) return []
  return ids.filter((id) => validIds.includes(id))
}
