import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Button, SectionLabel } from '../components/ui'
import Illustration from '../components/Illustration'
import { QUESTIONS } from '../data/questions'
import { BOARD_FIB, fibMatches } from '../data/boardItems'
import { shuffle, shuffledChoices } from '../lib/quizEngine'
import { CATEGORIES } from '../data/categories'

// Board Mode: qual-board simulation. Mixed multiple-choice and
// fill-in-the-blank, hard time limit per item, no hints, no rule text —
// a miss flashes the correct answer briefly and moves on.

const MC_COUNT = 6
const FIB_COUNT = 6
const MC_SECONDS = 20
const FIB_SECONDS = 30
const CORRECT_FLASH_MS = 800
const WRONG_FLASH_MS = 2400

function buildBoard() {
  const mc = shuffle(QUESTIONS)
    .slice(0, MC_COUNT)
    .map((q) => ({ kind: 'mc', id: q.id, category: q.category, q }))
  const fib = shuffle(BOARD_FIB)
    .slice(0, FIB_COUNT)
    .map((item) => ({ kind: 'fib', id: item.id, category: item.category, item }))
  return shuffle([...mc, ...fib])
}

function fmtTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function BoardScreen() {
  const { navigate } = useRouter()
  const { store, refresh, userStats } = useApp()

  const [phase, setPhase] = useState('intro') // intro | run | saving
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [feedback, setFeedback] = useState(null) // { correct, display }
  const [fibInput, setFibInput] = useState('')
  const [error, setError] = useState(null)

  const attemptsRef = useRef([])
  const startRef = useRef(null)
  const sessionRef = useRef(null)
  const advanceTimer = useRef(null)

  const item = items[index]
  const choices = useMemo(
    () => (item?.kind === 'mc' ? shuffledChoices(item.q) : []),
    [item]
  )

  // Per-item countdown. Frozen during feedback.
  useEffect(() => {
    if (phase !== 'run' || feedback) return
    if (secondsLeft <= 0) {
      answer(null)
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, feedback, secondsLeft])

  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  function start() {
    const board = buildBoard()
    setItems(board)
    setIndex(0)
    setFibInput('')
    setFeedback(null)
    attemptsRef.current = []
    startRef.current = Date.now()
    sessionRef.current = {
      id: crypto.randomUUID ? crypto.randomUUID() : `b-${Date.now()}`,
      startedAt: new Date().toISOString(),
    }
    setSecondsLeft(board[0].kind === 'mc' ? MC_SECONDS : FIB_SECONDS)
    setPhase('run')
  }

  function answer(givenCorrect, display) {
    if (feedback) return
    const isCorrect = Boolean(givenCorrect)
    attemptsRef.current.push({
      questionId: item.id,
      category: item.category,
      isCorrect,
      answeredAt: new Date().toISOString(),
    })
    setFeedback({ correct: isCorrect, display })
    advanceTimer.current = setTimeout(
      advance,
      isCorrect ? CORRECT_FLASH_MS : WRONG_FLASH_MS
    )
  }

  async function advance() {
    setFeedback(null)
    setFibInput('')
    if (index + 1 < items.length) {
      const nextItem = items[index + 1]
      setIndex(index + 1)
      setSecondsLeft(nextItem.kind === 'mc' ? MC_SECONDS : FIB_SECONDS)
      return
    }
    // Board complete — log and hand off to results.
    setPhase('saving')
    setError(null)
    const attempts = attemptsRef.current
    const correct = attempts.filter((a) => a.isCorrect).length
    const durationSeconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000))
    try {
      const prevBest = userStats?.best_board_seconds ?? null
      const stats = await store.completeSession({
        id: sessionRef.current.id,
        mode: 'board',
        categories: CATEGORIES.map((c) => c.id),
        startedAt: sessionRef.current.startedAt,
        completedAt: new Date().toISOString(),
        total: attempts.length,
        correct,
        attempts,
        durationSeconds,
      })
      await refresh()
      navigate('/results', {
        mode: 'board',
        total: attempts.length,
        correct,
        pct: Math.round((correct / attempts.length) * 100),
        lastPct: null,
        weakestCategory: null,
        durationSeconds,
        bestBoardSeconds: stats?.best_board_seconds ?? null,
        newBoardBest:
          stats?.best_board_seconds != null &&
          stats.best_board_seconds === durationSeconds &&
          durationSeconds !== prevBest,
        missedIds: attempts.filter((a) => !a.isCorrect).map((a) => a.questionId),
        userStats: stats,
      })
    } catch (err) {
      setError(err.message || 'Could not save this board. Check your connection.')
      setPhase('run')
      setIndex(items.length - 1)
    }
  }

  if (phase === 'intro') {
    return (
      <Layout title="Board Mode" backTo="/home">
        <p className="font-serif text-[18px] text-ink leading-relaxed">
          Twelve questions. Mixed format — multiple choice and fill-in-the-blank. Each question is on the
          clock. No hints, no rule text, no second chances.
        </p>
        <div className="mt-6 border border-beige bg-white divide-y divide-cream-dark">
          <IntroRow label="Multiple choice" value={`${MC_COUNT} questions · ${MC_SECONDS}s each`} />
          <IntroRow label="Fill in the blank" value={`${FIB_COUNT} questions · ${FIB_SECONDS}s each`} />
          <IntroRow
            label="Fastest qualifying board"
            value={userStats?.best_board_seconds != null ? fmtTime(userStats.best_board_seconds) : '—'}
          />
        </div>
        <p className="font-sans text-[13px] text-navy-mist mt-4 leading-relaxed">
          A run at 80% or better sets your time. Answer like you're standing in front of the board.
        </p>
        <Button onClick={start} className="w-full mt-6">
          Begin board
        </Button>
      </Layout>
    )
  }

  if (phase === 'saving' || !item) {
    return (
      <Layout>
        <p className="font-sans text-[15px] text-navy-mist text-center py-16">Logging your board…</p>
      </Layout>
    )
  }

  const shell = feedback
    ? feedback.correct
      ? 'bg-correct-bg border-correct-border'
      : 'bg-wrong-bg border-wrong-border animate-shake'
    : 'bg-white border-beige'
  const urgent = secondsLeft <= 5 && !feedback

  return (
    <Layout>
      <div className="flex items-center justify-between mb-2 font-sans text-[12px] text-navy-mist tabular-nums">
        <span>
          {index + 1} / {items.length}
        </span>
        <span className={`font-medium ${urgent ? 'text-wrong-text' : ''}`}>{secondsLeft}s</span>
      </div>
      <div className="h-1 bg-cream-dark mb-7" aria-hidden="true">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${urgent ? 'bg-wrong-border' : 'bg-navy'}`}
          style={{
            width: `${(secondsLeft / (item.kind === 'mc' ? MC_SECONDS : FIB_SECONDS)) * 100}%`,
          }}
        />
      </div>

      <div className={`border p-6 transition-colors duration-200 ${shell}`}>
        {item.kind === 'mc' ? (
          <>
            <h2 className="font-serif text-xl text-navy leading-snug">{item.q.question}</h2>
            <Illustration illo={item.q.illo} />
            <div className="mt-4 space-y-2.5">
              {choices.map((c, i) => (
                <button
                  key={`${item.id}-${i}`}
                  disabled={Boolean(feedback)}
                  onClick={() => answer(c.correct, item.q.correct)}
                  className={`w-full text-left border px-4 py-3 font-sans text-[15px] leading-snug transition-colors ${
                    feedback && c.correct
                      ? 'border-correct-border bg-white'
                      : 'border-beige-dark bg-white hover:border-navy disabled:opacity-60'
                  }`}
                >
                  <span className="font-medium text-navy-mist mr-2">{String.fromCharCode(65 + i)}.</span>
                  {c.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionLabel className="mb-2">{item.item.rule}</SectionLabel>
            <h2 className="font-serif text-xl text-navy leading-relaxed">{item.item.prompt}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!feedback) answer(fibMatches(item.item, fibInput), item.item.display)
              }}
              className="mt-5 flex gap-2"
            >
              <input
                autoFocus
                value={fibInput}
                disabled={Boolean(feedback)}
                onChange={(e) => setFibInput(e.target.value.slice(0, 80))}
                placeholder="Your answer"
                aria-label="Fill in the blank"
                className="flex-1 bg-white border border-beige-dark px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-navy"
              />
              <Button type="submit" disabled={Boolean(feedback) || !fibInput.trim()}>
                Answer
              </Button>
            </form>
          </>
        )}

        {feedback && (
          <p
            className={`mt-5 font-serif text-lg animate-pop ${
              feedback.correct ? 'text-correct-text' : 'text-wrong-text'
            }`}
          >
            {feedback.correct ? 'Correct!' : (
              <>
                Incorrect — <span className="text-ink">{feedback.display}</span>
              </>
            )}
          </p>
        )}

        {error && (
          <p className="mt-4 font-sans text-[13px] text-wrong-text border border-wrong-border bg-wrong-bg px-4 py-3">
            {error}{' '}
            <button onClick={advance} className="underline">
              Retry
            </button>
          </p>
        )}
      </div>
    </Layout>
  )
}

function IntroRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between px-5 py-3.5">
      <span className="font-sans text-[14px] text-ink">{label}</span>
      <span className="font-sans text-[14px] text-navy-mist tabular-nums">{value}</span>
    </div>
  )
}
