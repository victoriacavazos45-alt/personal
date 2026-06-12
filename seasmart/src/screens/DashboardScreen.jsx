import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Button, Card, SectionLabel, Spinner } from '../components/ui'
import { CategoryBars, TrendChart } from '../components/charts'
import { CATEGORIES } from '../data/categories'
import { liveStreak } from '../lib/streak'

const RANGES = [
  { id: 'daily', label: 'Daily', days: 14 },
  { id: 'weekly', label: 'Weekly', days: 84 },
  { id: 'monthly', label: 'Monthly', days: 365 },
]

function bucketKey(date, range) {
  const d = new Date(date)
  if (range === 'daily') return d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  if (range === 'weekly') {
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    return monday.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  }
  return d.toLocaleDateString(undefined, { month: 'short' })
}

export default function DashboardScreen() {
  const { navigate } = useRouter()
  const { store, categoryStats, userStats } = useApp()
  const [range, setRange] = useState('daily')
  const [sessions, setSessions] = useState(null)

  useEffect(() => {
    let live = true
    const days = RANGES.find((r) => r.id === range).days
    store
      .getSessions(days)
      .then((s) => live && setSessions(s))
      .catch(() => live && setSessions([]))
    return () => {
      live = false
    }
  }, [store, range])

  const points = useMemo(() => {
    if (!sessions) return []
    const buckets = new Map()
    for (const s of sessions) {
      const key = bucketKey(s.completed_at, range)
      const b = buckets.get(key) ?? { correct: 0, total: 0 }
      b.correct += s.correct_count
      b.total += s.question_count
      buckets.set(key, b)
    }
    return [...buckets.entries()].map(([label, b]) => ({
      label,
      value: Math.round((b.correct / b.total) * 100),
      detail: `${label} — ${Math.round((b.correct / b.total) * 100)}% (${b.correct}/${b.total})`,
    }))
  }, [sessions, range])

  const catRows = useMemo(() => {
    return CATEGORIES.map((c) => {
      const s = categoryStats[c.id]
      const attempts = s?.attempts ?? 0
      const pct = attempts > 0 ? Math.round((1 - s.misses / attempts) * 100) : 0
      return { label: c.label, pct, attempts }
    }).sort((a, b) => b.pct - a.pct || b.attempts - a.attempts)
  }, [categoryStats])

  const attempted = catRows.filter((r) => r.attempts >= 3)
  const strongest = attempted[0]
  const weakest = attempted.length > 1 ? attempted[attempted.length - 1] : null
  const streak = liveStreak(userStats)

  return (
    <Layout title="Progress" backTo="/home">
      <div className="grid grid-cols-3 gap-px bg-beige border border-beige mb-8">
        <Best label="Highest score" value={userStats?.best_score_pct != null ? `${userStats.best_score_pct}%` : '—'} />
        <Best label="Current streak" value={`${streak}d`} />
        <Best label="Longest streak" value={`${userStats?.longest_streak ?? 0}d`} />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Score trend</SectionLabel>
          <div className="flex border border-beige-dark">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 py-1.5 font-sans text-[12px] transition-colors ${
                  range === r.id ? 'bg-navy text-cream' : 'text-navy-mist hover:text-navy'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <Card className="p-5">
          {sessions == null ? (
            <div className="h-[180px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <TrendChart points={points} />
          )}
        </Card>
      </section>

      <section className="mb-10">
        <SectionLabel className="mb-4">Category breakdown</SectionLabel>
        <Card className="p-5">
          <CategoryBars rows={catRows} />
          {(strongest || weakest) && (
            <div className="hairline mt-5 pt-4 font-sans text-[13px] text-navy-mist leading-relaxed">
              {strongest && (
                <p>
                  Strongest: <span className="text-correct-text font-medium">{strongest.label}</span> ({strongest.pct}%)
                </p>
              )}
              {weakest && (
                <p>
                  Weakest: <span className="text-wrong-text font-medium">{weakest.label}</span> ({weakest.pct}%)
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {weakest && (
        <Button
          className="w-full"
          onClick={() =>
            navigate('/quiz', {
              mode: 'standard',
              count: 10,
              categories: [CATEGORIES.find((c) => c.label === weakest.label).id],
              adaptive: false,
            })
          }
        >
          Drill {weakest.label}
        </Button>
      )}
    </Layout>
  )
}

function Best({ label, value }) {
  return (
    <div className="bg-white px-3 py-5 text-center">
      <p className="font-serif text-2xl text-navy tabular-nums">{value}</p>
      <p className="font-sans text-[11px] uppercase tracking-[0.13em] text-navy-mist mt-1">{label}</p>
    </div>
  )
}
