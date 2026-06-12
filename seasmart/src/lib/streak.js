// Streak math shared by both store backends.

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dayDiff(fromKey, toKey) {
  const from = new Date(`${fromKey}T00:00:00`)
  const to = new Date(`${toKey}T00:00:00`)
  return Math.round((to - from) / 86400000)
}

// Returns the updated streak fields given the previous state and an activity today.
export function advanceStreak(prev, today = todayKey()) {
  const current = prev?.current_streak ?? 0
  const longest = prev?.longest_streak ?? 0
  const last = prev?.last_active_date ?? null

  let next
  if (!last) next = 1
  else {
    const diff = dayDiff(last, today)
    if (diff === 0) next = Math.max(current, 1)
    else if (diff === 1) next = current + 1
    else next = 1 // missed a day — streak breaks
  }
  return {
    current_streak: next,
    longest_streak: Math.max(longest, next),
    last_active_date: today,
  }
}

// A streak only "counts" as alive if the last activity was today or yesterday.
export function liveStreak(stats, today = todayKey()) {
  if (!stats?.last_active_date) return 0
  const diff = dayDiff(stats.last_active_date, today)
  return diff <= 1 ? stats.current_streak : 0
}
