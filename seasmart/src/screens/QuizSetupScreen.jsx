import { useMemo, useState } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Button, Checkbox, SectionLabel, Toggle } from '../components/ui'
import { CATEGORIES } from '../data/categories'
import { QUESTIONS } from '../data/questions'
import { clampQuestionCount, sanitizeCategoryIds } from '../lib/validate'

export default function QuizSetupScreen() {
  const { navigate } = useRouter()
  const { questionStats } = useApp()
  const [count, setCount] = useState(10)
  const [selected, setSelected] = useState(() => new Set(CATEGORIES.map((c) => c.id)))
  const [adaptive, setAdaptive] = useState(false)

  const poolSize = useMemo(
    () => QUESTIONS.filter((q) => selected.has(q.category)).length,
    [selected]
  )

  const hasHistory = Object.keys(questionStats).length > 0

  function toggleCategory(id, on) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function start() {
    const categories = sanitizeCategoryIds([...selected], CATEGORIES.map((c) => c.id))
    if (categories.length === 0) return
    navigate('/quiz', {
      mode: adaptive ? 'adaptive' : 'standard',
      count: clampQuestionCount(count),
      categories,
      adaptive,
    })
  }

  return (
    <Layout title="Set up your quiz" backTo="/home">
      <section className="mb-10">
        <SectionLabel className="mb-4">Questions</SectionLabel>
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-sans text-[15px] text-ink">Number of questions</span>
          <span className="font-serif text-3xl text-navy tabular-nums">{count}</span>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          step="1"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="ss-slider"
          aria-label="Number of questions"
        />
        <div className="flex justify-between mt-1.5 font-sans text-[12px] text-navy-mist">
          <span>5</span>
          <span>50</span>
        </div>
      </section>

      <section className="mb-10">
        <SectionLabel className="mb-2">Categories</SectionLabel>
        <div className="divide-y divide-cream-dark">
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c.id}
              label={c.label}
              checked={selected.has(c.id)}
              onChange={(on) => toggleCategory(c.id, on)}
            />
          ))}
        </div>
        {selected.size === 0 && (
          <p className="font-sans text-[13px] text-wrong-text mt-2">Select at least one category.</p>
        )}
      </section>

      <section className="mb-10 border border-beige bg-white px-5 py-3">
        <Toggle
          checked={adaptive}
          onChange={setAdaptive}
          label="Adaptive mode"
          sublabel={
            hasHistory
              ? 'Serves more questions from the categories and questions you miss most.'
              : 'Builds on your history — complete a quiz or two first for best results.'
          }
        />
      </section>

      <Button onClick={start} disabled={selected.size === 0} className="w-full">
        Begin — {Math.min(count, poolSize)} questions
      </Button>
      {poolSize < count && selected.size > 0 && (
        <p className="font-sans text-[12px] text-navy-mist mt-2 text-center">
          {poolSize} questions available in the selected categories.
        </p>
      )}
    </Layout>
  )
}
