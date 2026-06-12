// Hand-built SVG charts (no chart libraries): score trend line chart and
// category accuracy bars.

import { useState } from 'react'

export function TrendChart({ points, height = 180 }) {
  // points: [{ label, value (0–100), detail }]
  const [active, setActive] = useState(null)
  const w = 320
  const h = height
  const padX = 10
  const padTop = 16
  const padBottom = 26

  if (!points.length) {
    return (
      <div className="h-[180px] flex items-center justify-center font-sans text-sm text-navy-mist">
        Complete a quiz to see your trend.
      </div>
    )
  }

  const innerW = w - padX * 2
  const innerH = h - padTop - padBottom
  const x = (i) => (points.length === 1 ? w / 2 : padX + (i / (points.length - 1)) * innerW)
  const y = (v) => padTop + innerH - (v / 100) * innerH

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ')
  const area = `${path} L${x(points.length - 1).toFixed(1)},${padTop + innerH} L${x(0).toFixed(1)},${padTop + innerH} Z`

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto select-none" role="img" aria-label="Score trend chart">
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={padX} x2={w - padX} y1={y(g)} y2={y(g)} stroke="#E5DCCB" strokeWidth="1" />
            <text x={padX} y={y(g) - 3} fontSize="8" fill="#5C7494" fontFamily="Inter, sans-serif">
              {g}
            </text>
          </g>
        ))}
        <path d={area} fill="#1B3A5C" opacity="0.07" />
        <path d={path} fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={x(i)}
              cy={y(p.value)}
              r={active === i ? 5 : 3.4}
              fill={active === i ? '#7F6A3E' : '#1B3A5C'}
              stroke="#FAF7F1"
              strokeWidth="1.4"
            />
            {/* generous invisible tap target */}
            <rect
              x={x(i) - 12}
              y={padTop}
              width="24"
              height={innerH}
              fill="transparent"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
            />
            {(points.length <= 8 || i % Math.ceil(points.length / 8) === 0) && (
              <text x={x(i)} y={h - 8} fontSize="8" fill="#5C7494" textAnchor="middle" fontFamily="Inter, sans-serif">
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      {active != null && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-navy text-cream font-sans text-[12px] px-3 py-1.5 pointer-events-none whitespace-nowrap">
          {points[active].detail ?? `${points[active].label}: ${points[active].value}%`}
        </div>
      )}
    </div>
  )
}

export function CategoryBars({ rows }) {
  // rows: [{ label, pct (0–100 accuracy), attempts }]
  if (!rows.length) {
    return <p className="font-sans text-sm text-navy-mist py-4">No category data yet.</p>
  }
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-sans text-[13px] text-ink">{r.label}</span>
            <span className="font-sans text-[12px] text-navy-mist tabular-nums">
              {r.attempts > 0 ? `${r.pct}% · ${r.attempts} answered` : 'not yet attempted'}
            </span>
          </div>
          <div className="h-2 bg-cream-dark overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${r.attempts > 0 ? Math.max(r.pct, 2) : 0}%`,
                background: r.pct >= 80 ? '#5F7E5A' : r.pct >= 60 ? '#7F6A3E' : '#A05E50',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
