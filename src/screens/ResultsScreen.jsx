import { useEffect } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Burst, Button, Card, GoldRule, SectionLabel } from '../components/ui'
import { CATEGORY_LABEL } from '../data/categories'
import { liveStreak } from '../lib/streak'

// Session-end summary. A quiz never ends cold: score, improvement,
// weakest category, and exactly one suggested next action.
export default function ResultsScreen({ summary }) {
  const { navigate } = useRouter()
  const { bookmarks, userStats } = useApp()

  useEffect(() => {
    if (!summary) navigate('/home')
  }, [summary, navigate])
  if (!summary) return null

  const { total, correct, pct, lastPct, weakestCategory, missedIds } = summary
  const delta = lastPct != null ? pct - lastPct : null
  const isPersonalBest = pct >= (userStats?.best_score_pct ?? 0) && pct === userStats?.best_score_pct
  const streak = liveStreak(userStats)

  // One suggested next action, in priority order. Never a dead end.
  let nextAction
  if (weakestCategory) {
    nextAction = {
      label: `Drill ${CATEGORY_LABEL[weakestCategory]}`,
      desc: `A focused 10-question set on your weakest category this session.`,
      go: () =>
        navigate('/quiz', { mode: 'standard', count: 10, categories: [weakestCategory], adaptive: false }),
    }
  } else if (missedIds?.length > 0 || bookmarks.size >= 5) {
    nextAction = {
      label: 'Run your bookmark quiz',
      desc: `Quiz yourself on the ${bookmarks.size} questions you've saved.`,
      go: () => navigate('/bookmarks'),
    }
  } else {
    nextAction = {
      label: 'Try adaptive mode',
      desc: 'Let SeaSmart target the questions you miss most.',
      go: () =>
        navigate('/quiz', {
          mode: 'adaptive',
          count: 15,
          categories: Object.keys(CATEGORY_LABEL),
          adaptive: true,
        }),
    }
  }

  return (
    <Layout>
      <div className="text-center pt-4 pb-2 animate-fadeUp">
        <SectionLabel>Session complete</SectionLabel>
        <p className="font-serif text-[84px] leading-none text-navy mt-4 tabular-nums animate-pop">
          {pct}
          <span className="text-3xl text-navy-mist">%</span>
          {(isPersonalBest || pct === 100) && <Burst />}
        </p>
        <p className="font-sans text-[15px] text-navy-mist mt-2">
          {correct} of {total} correct
        </p>
        {isPersonalBest && pct > 0 && (
          <p className="mt-3 inline-block font-sans text-[12px] uppercase tracking-[0.16em] text-gold animate-pulseGold">
            ★ Personal best
          </p>
        )}
      </div>

      <GoldRule className="mx-auto my-7" />

      <div className="grid grid-cols-2 gap-px bg-beige border border-beige mb-8">
        <Cell
          label="vs. last session"
          value={delta == null ? 'first one' : `${delta >= 0 ? '+' : ''}${delta} pts`}
          tone={delta == null ? 'muted' : delta >= 0 ? 'good' : 'bad'}
        />
        <Cell label="Streak" value={`${streak} day${streak === 1 ? '' : 's'}`} tone="muted" />
        <Cell
          label="Weakest category"
          value={weakestCategory ? CATEGORY_LABEL[weakestCategory] : 'None — clean run'}
          tone={weakestCategory ? 'bad' : 'good'}
        />
        <Cell label="Missed" value={`${total - correct} question${total - correct === 1 ? '' : 's'}`} tone="muted" />
      </div>

      <SectionLabel className="mb-3">Next challenge</SectionLabel>
      <Card className="p-6">
        <h2 className="font-serif text-2xl text-navy">{nextAction.label}</h2>
        <p className="font-sans text-[14px] text-navy-mist mt-1.5 leading-relaxed">{nextAction.desc}</p>
        <Button onClick={nextAction.go} className="w-full mt-5">
          Go
        </Button>
      </Card>

      <div className="flex gap-3 mt-4">
        <Button variant="secondary" className="flex-1" onClick={() => navigate('/quiz-setup')}>
          New quiz
        </Button>
        <Button variant="ghost" className="flex-1" onClick={() => navigate('/dashboard')}>
          View progress
        </Button>
      </div>
    </Layout>
  )
}

function Cell({ label, value, tone }) {
  const color = tone === 'good' ? 'text-correct-text' : tone === 'bad' ? 'text-wrong-text' : 'text-navy'
  return (
    <div className="bg-white px-4 py-4">
      <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-navy-mist">{label}</p>
      <p className={`font-serif text-lg mt-1 ${color}`}>{value}</p>
    </div>
  )
}
