import { useApp } from '../App'
import { useRouter } from '../lib/router'
import { FlameIcon, Wordmark } from './ui'
import { liveStreak } from '../lib/streak'

export default function Layout({ children, title, backTo }) {
  const { userStats, signOut } = useApp()
  const { navigate } = useRouter()
  const streak = liveStreak(userStats)

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-navy text-cream">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} aria-label="SeaSmart home">
            <Wordmark light />
          </button>
          <div className="flex items-center gap-4">
            <span
              className={`flex items-center gap-1.5 font-sans text-sm tabular-nums ${
                streak > 0 ? 'text-gold-soft' : 'text-cream/40'
              }`}
              title="Daily streak"
            >
              <FlameIcon className="w-4 h-4" />
              {streak}
            </span>
            <button onClick={signOut} className="font-sans text-[12px] uppercase tracking-[0.14em] text-cream/60 hover:text-cream">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-5 py-8 pb-16">
        {(backTo || title) && (
          <div className="mb-6">
            {backTo && (
              <button
                onClick={() => navigate(backTo)}
                className="font-sans text-[13px] text-navy-mist hover:text-navy mb-3 inline-flex items-center gap-1"
              >
                ← Back
              </button>
            )}
            {title && <h1 className="font-serif text-3xl text-navy tracking-tight">{title}</h1>}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
