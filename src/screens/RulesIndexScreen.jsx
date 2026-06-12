import { useMemo, useState } from 'react'
import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Card, SectionLabel } from '../components/ui'
import { IS_PLACEHOLDER, QUESTIONS_BY_RULE, RULE_PARTS, searchRules, snippet } from '../data/rules'

export default function RulesIndexScreen() {
  const { navigate } = useRouter()
  const { annotations } = useApp()
  const [query, setQuery] = useState('')

  const annCountByRule = useMemo(() => {
    const map = {}
    for (const a of annotations) map[a.rule_id] = (map[a.rule_id] ?? 0) + 1
    return map
  }, [annotations])

  const results = useMemo(() => searchRules(query), [query])
  const searching = query.trim().length >= 2

  return (
    <Layout title="Rules Index" backTo="/home">
      {IS_PLACEHOLDER && (
        <p className="mb-6 font-sans text-[12px] text-navy-mist border border-beige px-4 py-2.5 bg-cream-light leading-relaxed">
          Sample text loaded. Replace <code className="px-1 bg-cream-dark">src/data/colregs.json</code> with the
          official publication text to populate the full index.
        </p>
      )}

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the full text…"
        aria-label="Search rules"
        className="w-full bg-white border border-beige-dark px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-navy mb-8"
      />

      {searching ? (
        <>
          <SectionLabel className="mb-3">
            {results.length === 0 ? 'No matches' : `${results.length} match${results.length === 1 ? '' : 'es'}`}
          </SectionLabel>
          <div className="space-y-3">
            {results.map(({ rule, paragraph, index }) => {
              const s = snippet(paragraph.text, index, query.trim().length)
              return (
                <Card
                  key={`${rule.id}-${paragraph.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/rules/${rule.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/rules/${rule.id}`)}
                  className="p-4 cursor-pointer hover:border-navy"
                >
                  <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-gold mb-1">
                    {ruleHeading(rule)}
                  </p>
                  <p className="font-serif text-[15px] text-ink leading-relaxed">
                    {s.pre}
                    <mark className="crit">{s.match}</mark>
                    {s.post}
                  </p>
                </Card>
              )
            })}
          </div>
        </>
      ) : (
        <div className="space-y-9">
          {RULE_PARTS.map((part) => (
            <section key={part.id}>
              <SectionLabel className="mb-3">{part.label}</SectionLabel>
              <div className="divide-y divide-cream-dark border border-beige bg-white">
                {part.rules.map((rule) => {
                  const qCount = QUESTIONS_BY_RULE[rule.id]?.length ?? 0
                  const aCount = annCountByRule[rule.id] ?? 0
                  const empty = rule.paragraphs.length === 0
                  return (
                    <button
                      key={rule.id}
                      onClick={() => navigate(`/rules/${rule.id}`)}
                      className={`w-full flex items-baseline justify-between gap-3 px-5 py-3.5 text-left hover:bg-cream-light transition-colors ${
                        empty ? 'opacity-50' : ''
                      }`}
                    >
                      <span className="font-serif text-[17px] text-navy">
                        {ruleHeading(rule)}
                      </span>
                      <span className="shrink-0 font-sans text-[12px] text-navy-mist tabular-nums">
                        {aCount > 0 && <span className="text-gold mr-2">✎ {aCount}</span>}
                        {qCount > 0 && `${qCount} Q`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Layout>
  )
}

function ruleHeading(rule) {
  return /^annex/i.test(rule.num) ? `${rule.num} — ${rule.title}` : `Rule ${rule.num} — ${rule.title}`
}
