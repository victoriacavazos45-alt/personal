import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { BookmarkIcon, Card, GoldRule, SectionLabel } from '../components/ui'
import { liveStreak } from '../lib/streak'
import { CATEGORY_LABEL } from '../data/categories'

function weakestCategory(categoryStats) {
  let worst = null
  for (const [cat, s] of Object.entries(categoryStats)) {
    if (s.attempts < 3) continue
    const acc = 1 - s.misses / s.attempts
    if (!worst || acc < worst.acc) worst = { cat, acc }
  }
  return worst
}

export default function HomeScreen() {
  const { navigate } = useRouter()
  const { bookmarks, userStats, categoryStats, localMode } = useApp()
  const streak = liveStreak(userStats)
  const weak = weakestCategory(categoryStats)

  const menu = [
    {
      title: 'Start a quiz',
      desc: 'Customizable drill from the USCG question bank.',
      action: () => navigate('/quiz-setup'),
      primary: true,
    },
    {
      title: 'Bookmarked questions',
      desc:
        bookmarks.size > 0
          ? `${bookmarks.size} saved — review or quiz yourself on them.`
          : 'Save tough questions during a quiz to build your own bank.',
      action: () => navigate('/bookmarks'),
      icon: <BookmarkIcon className="w-4 h-4 text-gold" filled={bookmarks.size > 0} />,
    },
    {
      title: 'Progress',
      desc: 'Score trends and your strongest and weakest categories.',
      action: () => navigate('/dashboard'),
    },
  ]

  return (
    <Layout>
      {localMode && (
        <p className="mb-6 font-sans text-[12px] text-navy-mist border border-beige px-4 py-2.5 bg-cream-light">
          Local training mode — progress is stored on this device only.
        </p>
      )}

      <SectionLabel>Rules of the Road</SectionLabel>
      <h1 className="font-serif text-4xl text-navy tracking-tight mt-2 leading-tight">
        Stand a smarter watch.
      </h1>
      <GoldRule className="mt-5 mb-8" />

      <div className="grid gap-4">
        {menu.map((item) => (
          <Card
            key={item.title}
            onClick={item.action}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && item.action()}
            className={`p-6 cursor-pointer transition-colors hover:border-navy ${
              item.primary ? 'bg-navy text-cream border-navy hover:bg-navy-deep' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className={`font-serif text-2xl ${item.primary ? 'text-cream' : 'text-navy'} flex items-center gap-2`}>
                  {item.title} {item.icon}
                </h2>
                <p className={`font-sans text-[14px] mt-1.5 leading-relaxed ${item.primary ? 'text-cream/70' : 'text-navy-mist'}`}>
                  {item.desc}
                </p>
              </div>
              <span className={`font-serif text-2xl ${item.primary ? 'text-gold-soft' : 'text-gold'}`} aria-hidden="true">
                →
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-3 gap-px bg-beige border border-beige">
        <Stat label="Streak" value={`${streak}d`} />
        <Stat label="Best score" value={userStats?.best_score_pct != null ? `${userStats.best_score_pct}%` : '—'} />
        <Stat label="Longest streak" value={`${userStats?.longest_streak ?? 0}d`} />
      </div>

      {weak && (
        <p className="mt-6 font-sans text-[13px] text-navy-mist">
          Focus area: <span className="text-navy font-medium">{CATEGORY_LABEL[weak.cat]}</span> —{' '}
          {Math.round(weak.acc * 100)}% accuracy so far.
        </p>
      )}
    </Layout>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white px-4 py-5 text-center">
      <p className="font-serif text-2xl text-navy tabular-nums">{value}</p>
      <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-navy-mist mt-1">{label}</p>
    </div>
  )
}
