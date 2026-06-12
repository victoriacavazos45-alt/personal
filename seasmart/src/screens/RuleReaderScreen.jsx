import { useCallback, useMemo, useState } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Button, GoldRule, SectionLabel } from '../components/ui'
import { QUESTIONS_BY_RULE, RULES, RULE_BY_ID } from '../data/rules'
import { CATEGORIES } from '../data/categories'
import { clampQuestionCount } from '../lib/validate'

// Kindle-style reader: select text to highlight it; tap a highlight to add
// a margin note or remove it. Annotations are anchored to paragraph ids by
// character offset and persist via the store (Supabase or local).

function segmentsFor(text, anns) {
  const ranges = anns
    .map((a) => ({
      id: a.id,
      start: Math.max(0, Math.min(a.start_offset, text.length)),
      end: Math.max(0, Math.min(a.end_offset, text.length)),
    }))
    .filter((r) => r.end > r.start)
  if (ranges.length === 0) return [{ text, ann: null }]

  const bounds = new Set([0, text.length])
  for (const r of ranges) {
    bounds.add(r.start)
    bounds.add(r.end)
  }
  const sorted = [...bounds].sort((a, b) => a - b)
  const segs = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const [s, e] = [sorted[i], sorted[i + 1]]
    const covering = ranges.find((r) => r.start <= s && r.end >= e)
    segs.push({ text: text.slice(s, e), ann: covering?.id ?? null })
  }
  return segs
}

// Character offset of a DOM point within a paragraph element.
function offsetWithin(paragraphEl, container, offset) {
  const range = document.createRange()
  range.selectNodeContents(paragraphEl)
  range.setEnd(container, offset)
  return range.toString().length
}

export default function RuleReaderScreen({ ruleId }) {
  const { navigate } = useRouter()
  const { annotations, addAnnotation, updateAnnotation, deleteAnnotation } = useApp()

  const rule = RULE_BY_ID[ruleId]
  const [pending, setPending] = useState(null) // { paragraph_id, start, end, text }
  const [editing, setEditing] = useState(null) // annotation row
  const [noteDraft, setNoteDraft] = useState('')
  const [busy, setBusy] = useState(false)

  const ruleAnns = useMemo(
    () => annotations.filter((a) => a.rule_id === ruleId),
    [annotations, ruleId]
  )
  const byParagraph = useMemo(() => {
    const map = {}
    for (const a of ruleAnns) (map[a.paragraph_id] ??= []).push(a)
    return map
  }, [ruleAnns])

  const idx = RULES.findIndex((r) => r.id === ruleId)
  const prev = idx > 0 ? RULES[idx - 1] : null
  const next = idx >= 0 && idx < RULES.length - 1 ? RULES[idx + 1] : null
  const relatedQ = QUESTIONS_BY_RULE[ruleId] ?? []

  const captureSelection = useCallback(() => {
    // Defer so mobile selection handles settle before we read the range.
    setTimeout(() => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return
      const range = sel.getRangeAt(0)
      const startP = range.startContainer.parentElement?.closest('[data-pid]')
      const endP = range.endContainer.parentElement?.closest('[data-pid]')
      if (!startP || startP !== endP) return
      const start = offsetWithin(startP, range.startContainer, range.startOffset)
      const end = offsetWithin(startP, range.endContainer, range.endOffset)
      if (end - start < 1) return
      setPending({
        paragraph_id: startP.dataset.pid,
        start,
        end,
        text: range.toString(),
      })
    }, 0)
  }, [])

  if (!rule) {
    return (
      <Layout title="Rules Index" backTo="/rules">
        <p className="font-sans text-[15px] text-navy-mist">Rule not found.</p>
      </Layout>
    )
  }

  async function saveHighlight() {
    if (!pending || busy) return
    setBusy(true)
    try {
      await addAnnotation({
        rule_id: ruleId,
        paragraph_id: pending.paragraph_id,
        start_offset: pending.start,
        end_offset: pending.end,
        selected_text: pending.text.slice(0, 2000),
      })
      window.getSelection()?.removeAllRanges()
      setPending(null)
    } finally {
      setBusy(false)
    }
  }

  function openEditor(annId) {
    const ann = ruleAnns.find((a) => a.id === annId)
    if (!ann) return
    setEditing(ann)
    setNoteDraft(ann.note ?? '')
  }

  async function saveNote() {
    if (!editing || busy) return
    setBusy(true)
    try {
      await updateAnnotation(editing.id, noteDraft.trim().slice(0, 4000))
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }

  async function removeHighlight() {
    if (!editing || busy) return
    setBusy(true)
    try {
      await deleteAnnotation(editing.id)
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }

  const heading = /^annex/i.test(rule.num) ? rule.num : `Rule ${rule.num}`

  return (
    <Layout backTo="/rules">
      <header className="mb-7">
        <SectionLabel>{rule.partLabel}</SectionLabel>
        <h1 className="font-serif text-3xl text-navy tracking-tight mt-1.5">
          {heading} — {rule.title}
        </h1>
        <GoldRule className="mt-4" />
      </header>

      {rule.paragraphs.length === 0 && (
        <p className="font-sans text-[14px] text-navy-mist border border-beige bg-cream-light px-4 py-3 leading-relaxed">
          Text for this rule hasn't been loaded yet — it will appear here once the publication text is added
          to <code className="px-1 bg-cream-dark">src/data/colregs.json</code>.
        </p>
      )}

      <article onPointerUp={captureSelection} onTouchEnd={captureSelection} className="select-text">
        {rule.paragraphs.map((p) => {
          const anns = byParagraph[p.id] ?? []
          const hasNotes = anns.some((a) => a.note)
          return (
            <div key={p.id} className="relative flex gap-2 mb-5">
              {/* margin indicator */}
              <span className="w-3 shrink-0 pt-2" aria-hidden="true">
                {hasNotes && <span className="block w-1.5 h-1.5 rounded-full bg-gold" />}
              </span>
              <p data-pid={p.id} className="font-serif text-[17px] leading-[1.85] text-ink">
                {segmentsFor(p.text, anns).map((seg, i) =>
                  seg.ann ? (
                    <mark
                      key={i}
                      className="crit cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEditor(seg.ann)}
                      onKeyDown={(e) => e.key === 'Enter' && openEditor(seg.ann)}
                    >
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </p>
            </div>
          )
        })}
      </article>

      {relatedQ.length > 0 && (
        <div className="mt-8 border border-beige bg-white p-5">
          <p className="font-sans text-[14px] text-ink">
            <span className="font-medium">{relatedQ.length}</span> quiz question
            {relatedQ.length === 1 ? '' : 's'} cite{relatedQ.length === 1 ? 's' : ''} this rule.
          </p>
          <Button
            variant="secondary"
            className="w-full mt-3"
            onClick={() =>
              navigate('/quiz', {
                mode: 'standard',
                count: clampQuestionCount(relatedQ.length),
                categories: CATEGORIES.map((c) => c.id),
                adaptive: false,
                onlyIds: relatedQ,
              })
            }
          >
            Drill these questions
          </Button>
        </div>
      )}

      <nav className="flex justify-between gap-3 mt-8">
        {prev ? (
          <Button variant="ghost" onClick={() => navigate(`/rules/${prev.id}`)}>
            ← {/^annex/i.test(prev.num) ? prev.num : `Rule ${prev.num}`}
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button variant="ghost" onClick={() => navigate(`/rules/${next.id}`)}>
            {/^annex/i.test(next.num) ? next.num : `Rule ${next.num}`} →
          </Button>
        )}
      </nav>

      {/* selection action bar */}
      {pending && !editing && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-navy text-cream px-5 py-4 animate-fadeUp">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <p className="font-sans text-[13px] text-cream/80 truncate">
              “{pending.text.slice(0, 60)}
              {pending.text.length > 60 ? '…' : ''}”
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setPending(null)}
                className="font-sans text-[13px] px-3 py-2 text-cream/60 hover:text-cream"
              >
                Cancel
              </button>
              <button
                onClick={saveHighlight}
                disabled={busy}
                className="font-sans text-[13px] font-medium px-4 py-2 bg-gold-soft text-navy-night disabled:opacity-50"
              >
                Highlight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* annotation editor sheet */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-night/40" onClick={() => setEditing(null)}>
          <div
            className="w-full sm:max-w-md bg-white border-t sm:border border-beige p-6 animate-fadeUp"
            onClick={(e) => e.stopPropagation()}
          >
            <SectionLabel className="mb-2">Highlight</SectionLabel>
            <p className="font-serif text-[15px] text-ink leading-relaxed mb-4">
              <mark className="crit">{editing.selected_text}</mark>
            </p>
            <label className="block">
              <span className="block font-sans text-[13px] font-medium text-navy mb-1.5">Margin note</span>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                placeholder="Add a note…"
                className="w-full bg-white border border-beige-dark px-3 py-2.5 font-sans text-[14px] text-ink outline-none focus:border-navy resize-none"
              />
            </label>
            <div className="flex gap-3 mt-4">
              <Button onClick={saveNote} disabled={busy} className="flex-1">
                Save
              </Button>
              <Button variant="danger" onClick={removeHighlight} disabled={busy}>
                Remove highlight
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
