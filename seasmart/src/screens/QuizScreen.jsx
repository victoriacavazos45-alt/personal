import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import Illustration from '../components/Illustration'
import { BookmarkIcon, Burst, Button } from '../components/ui'
import { buildQuiz, highlightSegments, shuffledChoices } from '../lib/quizEngine'
import { CATEGORY_LABEL } from '../data/categories'

function newSessionId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function QuizScreen({ config }) {
  const { navigate } = useRouter()
  const { store, bookmarks, toggleBookmark, questionStats, categoryStats, refresh } = useApp()

  const quiz = useMemo(() => {
    if (!config) return []
    return buildQuiz({
      categories: config.categories,
      count: config.count,
      adaptive: Boolean(config.adaptive),
      questionStats,
      categoryStats,
      onlyIds: config.onlyIds ? new Set(config.onlyIds) : null,
    })
    // built once per mount — stats snapshots are from quiz start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null) // index into choices
  const [attempts, setAttempts] = useState([])
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState(null)
  const sessionRef = useRef({ id: newSessionId(), startedAt: new Date().toISOString() })

  const question = quiz[index]
  // Choices reshuffle on every presentation of the question.
  const choices = useMemo(() => (question ? shuffledChoices(question) : []), [question])

  useEffect(() => {
    if (!config) navigate('/quiz-setup')
  }, [config, navigate])

  if (!config) return null

  if (quiz.length === 0) {
    return (
      <Layout title="Quiz" backTo="/quiz-setup">
        <p className="font-sans text-[15px] text-navy-mist">No questions match this configuration.</p>
      </Layout>
    )
  }

  const answered = picked != null
  const isCorrect = answered && choices[picked].correct
  const correctIdx = choices.findIndex((c) => c.correct)
  const isLast = index === quiz.length - 1
  const correctSoFar = attempts.filter((a) => a.isCorrect).length + (isCorrect ? 1 : 0)

  function pick(i) {
    if (answered) return
    setPicked(i)
    setAttempts((prev) => [
      ...prev,
      {
        questionId: question.id,
        category: question.category,
        isCorrect: choices[i].correct,
        answeredAt: new Date().toISOString(),
      },
    ])
  }

  async function next() {
    if (!isLast) {
      setIndex(index + 1)
      setPicked(null)
      return
    }
    // Finish: log the session, compute improvement, hand off to results.
    setFinishing(true)
    setError(null)
    const finalAttempts = attempts
    const correct = finalAttempts.filter((a) => a.isCorrect).length
    const session = {
      id: sessionRef.current.id,
      mode: config.mode ?? 'standard',
      categories: config.categories,
      startedAt: sessionRef.current.startedAt,
      completedAt: new Date().toISOString(),
      total: quiz.length,
      correct,
      attempts: finalAttempts,
    }
    try {
      const previous = await store.getSessions(365)
      const lastPct = previous.length
        ? Math.round((previous[previous.length - 1].correct_count / previous[previous.length - 1].question_count) * 100)
        : null
      const stats = await store.completeSession(session)
      await refresh()

      // Weakest category within this session
      const byCat = {}
      for (const a of finalAttempts) {
        const c = (byCat[a.category] ??= { n: 0, miss: 0 })
        c.n += 1
        if (!a.isCorrect) c.miss += 1
      }
      let weakest = null
      for (const [cat, s] of Object.entries(byCat)) {
        const rate = s.miss / s.n
        if (!weakest || rate > weakest.rate) weakest = { cat, rate, miss: s.miss }
      }

      navigate('/results', {
        total: quiz.length,
        correct,
        pct: Math.round((correct / quiz.length) * 100),
        lastPct,
        weakestCategory: weakest && weakest.miss > 0 ? weakest.cat : null,
        mode: config.mode ?? 'standard',
        userStats: stats,
        missedIds: finalAttempts.filter((a) => !a.isCorrect).map((a) => a.questionId),
      })
    } catch (err) {
      setError(err.message || 'Could not save this session. Check your connection and try again.')
      setFinishing(false)
    }
  }

  const shellClass = !answered
    ? 'bg-white border-beige'
    : isCorrect
      ? 'bg-correct-bg border-correct-border'
      : 'bg-wrong-bg border-wrong-border animate-shake'

  return (
    <Layout>
      {/* progress */}
      <div className="flex items-center justify-between mb-2 font-sans text-[12px] text-navy-mist tabular-nums">
        <span>
          Question {index + 1} of {quiz.length}
        </span>
        <span>
          {correctSoFar} correct · {CATEGORY_LABEL[question.category]}
        </span>
      </div>
      <div className="h-1 bg-cream-dark mb-7" aria-hidden="true">
        <div
          className="h-full bg-navy transition-all duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / quiz.length) * 100}%` }}
        />
      </div>

      <div className={`border p-6 transition-colors duration-300 ${shellClass}`}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="font-serif text-xl text-navy leading-snug">{question.question}</h2>
          <button
            onClick={() => toggleBookmark(question.id)}
            aria-label={bookmarks.has(question.id) ? 'Remove bookmark' : 'Bookmark this question'}
            className={`shrink-0 p-1 ${bookmarks.has(question.id) ? 'text-gold' : 'text-navy-mist hover:text-navy'}`}
          >
            <BookmarkIcon filled={bookmarks.has(question.id)} />
          </button>
        </div>

        <Illustration illo={question.illo} />

        <div className="mt-4 space-y-2.5">
          {choices.map((c, i) => {
            let cls = 'border-beige-dark bg-white hover:border-navy'
            if (answered) {
              if (c.correct) cls = 'border-correct-border bg-white'
              else if (i === picked) cls = 'border-wrong-border bg-white opacity-90'
              else cls = 'border-beige-dark bg-white opacity-50'
            }
            return (
              <button
                key={`${question.id}-${i}`}
                onClick={() => pick(i)}
                disabled={answered}
                className={`w-full text-left border px-4 py-3.5 font-sans text-[15px] text-ink leading-snug transition-colors ${cls}`}
              >
                <span className="font-medium text-navy-mist mr-2">{String.fromCharCode(65 + i)}.</span>
                {c.text}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-6 animate-fadeUp">
            {isCorrect ? (
              <p className="font-serif text-xl text-correct-text flex items-center gap-2 animate-pop">
                Correct! <Burst />
              </p>
            ) : (
              <>
                <p className="font-serif text-xl text-wrong-text">Incorrect</p>
                <div className="mt-3 bg-white border border-beige p-4">
                  <p className="font-sans text-[13px] text-navy-mist mb-1">Correct answer</p>
                  <p className="font-sans text-[15px] text-ink font-medium">
                    {choices[correctIdx].text}
                  </p>
                  <div className="hairline my-3" />
                  <p className="font-sans text-[12px] uppercase tracking-[0.14em] text-gold mb-2">{question.rule}</p>
                  <p className="font-serif text-[16px] leading-relaxed text-ink">
                    {highlightSegments(question.ruleText, question.critical).map((seg, i) =>
                      seg.highlight ? (
                        <mark key={i} className="crit">
                          {seg.text}
                        </mark>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      )
                    )}
                  </p>
                </div>
              </>
            )}

            {error && (
              <p className="mt-4 font-sans text-[13px] text-wrong-text border border-wrong-border bg-wrong-bg px-4 py-3">
                {error}
              </p>
            )}

            <Button onClick={next} disabled={finishing} className="w-full mt-5">
              {finishing ? 'Saving…' : isLast ? 'Finish quiz' : 'Next question'}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
