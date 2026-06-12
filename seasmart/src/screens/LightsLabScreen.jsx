import { useMemo, useState } from 'react'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import { Button, SectionLabel } from '../components/ui'
import { VESSELS, VESSEL_CATEGORIES } from '../data/vessels'

// Lights Lab (2D): starboard-profile vessel viewer. Day mode shows the
// silhouette and prescribed day shapes; night mode shows the COLREGs light
// configuration. Every light is tappable and opens a rule-reference sheet
// that links into the Rules Index.

const LIGHT_FILL = {
  white: '#F8F5EC',
  red: '#E2574C',
  green: '#3FA66A',
  yellow: '#E8C24A',
}

function NavLight({ light, active, onTap }) {
  const fill = LIGHT_FILL[light.color]
  return (
    <g
      onClick={() => onTap(light)}
      role="button"
      aria-label={light.label}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={light.x} cy={light.y} r="6.5" fill={fill} opacity="0.18" />
      <circle cx={light.x} cy={light.y} r="3.8" fill={fill} opacity="0.45" />
      <circle cx={light.x} cy={light.y} r="2.1" fill={fill} stroke={active ? '#E8C24A' : 'none'} strokeWidth="0.8" />
      {light.optional && (
        <circle cx={light.x} cy={light.y} r="5.4" fill="none" stroke={fill} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.7" />
      )}
      {/* generous invisible tap target */}
      <circle cx={light.x} cy={light.y} r="11" fill="transparent" />
    </g>
  )
}

function DayShape({ shape }) {
  const s = 5
  if (shape.kind === 'diamond') {
    return (
      <polygon
        points={`${shape.x},${shape.y - s} ${shape.x + s * 0.72},${shape.y} ${shape.x},${shape.y + s} ${shape.x - s * 0.72},${shape.y}`}
        fill="#22303E"
      >
        <title>{shape.label}</title>
      </polygon>
    )
  }
  if (shape.kind === 'ball') {
    return (
      <circle cx={shape.x} cy={shape.y} r={s * 0.8} fill="#22303E">
        <title>{shape.label}</title>
      </circle>
    )
  }
  return null
}

function VesselScene({ vessel, night, activeLight, onTapLight }) {
  const hullFill = night ? '#081626' : '#2E4E72'
  return (
    <svg viewBox="0 0 240 100" className="w-full h-auto select-none" role="img" aria-label={`${vessel.name}, ${night ? 'night' : 'day'} view`}>
      <rect width="240" height="100" fill={night ? '#0C1F36' : '#DCE4EA'} />
      {/* waterline + water */}
      <rect y="78" width="240" height="22" fill={night ? '#0A1A2D' : '#B9C9D6'} />
      <line x1="0" y1="78" x2="240" y2="78" stroke={night ? '#2E4E72' : '#9FB1C1'} strokeWidth="0.6" />
      {!night && <circle cx="210" cy="18" r="9" fill="#F5F0E8" opacity="0.9" />}
      {night && (
        <g fill="#F8F5EC" opacity="0.5">
          <circle cx="30" cy="12" r="0.7" />
          <circle cx="78" cy="7" r="0.5" />
          <circle cx="205" cy="10" r="0.6" />
          <circle cx="170" cy="5" r="0.5" />
        </g>
      )}

      {vessel.paths.map((d, i) => (
        <path key={i} d={d} fill={hullFill} />
      ))}
      {(vessel.extras ?? []).map((e, i) =>
        e.kind === 'towline' ? (
          <path key={i} d={e.d} fill="none" stroke={hullFill} strokeWidth="1.2" />
        ) : null
      )}

      {!night && (vessel.dayShapes ?? []).map((s, i) => <DayShape key={i} shape={s} />)}
      {night &&
        vessel.lights.map((l) => (
          <NavLight key={l.id} light={l} active={activeLight?.id === l.id} onTap={onTapLight} />
        ))}
    </svg>
  )
}

export default function LightsLabScreen() {
  const { navigate } = useRouter()
  const [categoryId, setCategoryId] = useState('navy')
  const [vesselId, setVesselId] = useState('ddg')
  const [night, setNight] = useState(true)
  const [activeLight, setActiveLight] = useState(null)

  const vessels = useMemo(() => VESSELS.filter((v) => v.category === categoryId), [categoryId])
  const vessel = VESSELS.find((v) => v.id === vesselId) ?? vessels[0]

  function pickCategory(id) {
    setCategoryId(id)
    const first = VESSELS.find((v) => v.category === id)
    setVesselId(first.id)
    setActiveLight(null)
  }

  return (
    <Layout title="Lights Lab" backTo="/home">
      {/* category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
        {VESSEL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => pickCategory(c.id)}
            className={`shrink-0 font-sans text-[13px] px-3.5 py-1.5 border transition-colors ${
              categoryId === c.id ? 'bg-navy text-cream border-navy' : 'border-beige-dark text-navy-mist hover:text-navy'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* vessel selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1">
        {vessels.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setVesselId(v.id)
              setActiveLight(null)
            }}
            className={`shrink-0 font-serif text-[15px] px-4 py-2 border transition-colors ${
              vessel.id === v.id ? 'border-navy text-navy bg-white' : 'border-beige text-navy-mist hover:border-navy'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      {/* viewer */}
      <div className="border border-beige overflow-hidden">
        <VesselScene vessel={vessel} night={night} activeLight={activeLight} onTapLight={setActiveLight} />
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-beige">
          <div>
            <p className="font-serif text-[17px] text-navy leading-tight">{vessel.name}</p>
            <p className="font-sans text-[12px] text-navy-mist mt-0.5">{vessel.status}</p>
          </div>
          <div className="flex border border-beige-dark shrink-0" role="group" aria-label="Day or night mode">
            {[
              { v: false, label: 'Day' },
              { v: true, label: 'Night' },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => {
                  setNight(m.v)
                  setActiveLight(null)
                }}
                className={`px-4 py-1.5 font-sans text-[13px] transition-colors ${
                  night === m.v ? 'bg-navy text-cream' : 'text-navy-mist hover:text-navy'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="font-sans text-[13px] text-navy-mist leading-relaxed mt-3">
        {night
          ? 'Starboard profile. Tap any light for its rule reference. Dashed rings mark optional lights.'
          : 'Day view — silhouette and any prescribed day shapes.'}{' '}
        {vessel.rulesSummary}
      </p>

      {/* light detail sheet */}
      {night && activeLight && (
        <div className="mt-4 border border-beige bg-white p-5 animate-fadeUp">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionLabel className="mb-1">{activeLight.ref}</SectionLabel>
              <p className="font-serif text-xl text-navy leading-snug">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2 align-baseline border border-beige-dark"
                  style={{ background: LIGHT_FILL[activeLight.color] }}
                  aria-hidden="true"
                />
                {activeLight.label}
                {activeLight.optional && <span className="font-sans text-[12px] text-navy-mist ml-2">optional</span>}
              </p>
            </div>
            <button
              onClick={() => setActiveLight(null)}
              aria-label="Close light details"
              className="font-sans text-navy-mist hover:text-navy text-xl leading-none p-1"
            >
              ×
            </button>
          </div>
          <p className="font-sans text-[13px] text-navy-mist mt-2">Arc: {activeLight.arc}</p>
          <p className="font-sans text-[14px] text-ink leading-relaxed mt-2">{activeLight.desc}</p>
          <Button variant="secondary" className="w-full mt-4" onClick={() => navigate(`/rules/${activeLight.ruleId}`)}>
            Open {activeLight.ref.split('/')[0].trim().replace(/\(.*$/, '').trim()} in the Rules Index
          </Button>
        </div>
      )}
    </Layout>
  )
}
