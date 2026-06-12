// SVG illustration scenes for image-based questions: night light
// configurations, day shapes, and distress signals. Parametric so new
// questions reuse the same scenes.

const LIGHT_FILL = {
  white: '#F8F5EC',
  red: '#E2574C',
  green: '#3FA66A',
  yellow: '#E8C24A',
}

function NavLight({ c, x, y }) {
  const fill = LIGHT_FILL[c] ?? LIGHT_FILL.white
  return (
    <g>
      <circle cx={x} cy={y} r="7" fill={fill} opacity="0.18" />
      <circle cx={x} cy={y} r="4.2" fill={fill} opacity="0.45" />
      <circle cx={x} cy={y} r="2.4" fill={fill} />
    </g>
  )
}

function NightScene({ lights }) {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto" role="img" aria-label="Night light configuration">
      <rect width="100" height="80" fill="#0C1F36" />
      {/* faint horizon and water */}
      <line x1="0" y1="66" x2="100" y2="66" stroke="#2E4E72" strokeWidth="0.5" />
      <g opacity="0.25" stroke="#2E4E72" strokeWidth="0.4">
        <line x1="8" y1="71" x2="30" y2="71" />
        <line x1="55" y1="74" x2="80" y2="74" />
        <line x1="30" y1="77" x2="48" y2="77" />
      </g>
      {lights.map((l, i) => (
        <NavLight key={i} {...l} />
      ))}
    </svg>
  )
}

const SHAPE_H = 18

function DayShape({ kind, cx, cy }) {
  const s = 7.5
  switch (kind) {
    case 'ball':
      return <circle cx={cx} cy={cy} r={s * 0.78} fill="#22303E" />
    case 'diamond':
      return (
        <polygon
          points={`${cx},${cy - s} ${cx + s * 0.72},${cy} ${cx},${cy + s} ${cx - s * 0.72},${cy}`}
          fill="#22303E"
        />
      )
    case 'cone-up':
      return <polygon points={`${cx},${cy - s} ${cx + s * 0.8},${cy + s * 0.7} ${cx - s * 0.8},${cy + s * 0.7}`} fill="#22303E" />
    case 'cone-down':
      return <polygon points={`${cx},${cy + s} ${cx + s * 0.8},${cy - s * 0.7} ${cx - s * 0.8},${cy - s * 0.7}`} fill="#22303E" />
    case 'cylinder':
      return <rect x={cx - s * 0.55} y={cy - s} width={s * 1.1} height={s * 2} fill="#22303E" />
    default:
      return null
  }
}

function ShapesScene({ stack }) {
  const totalH = stack.length * SHAPE_H
  const top = 40 - totalH / 2
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto" role="img" aria-label="Day shape signal">
      <rect width="100" height="80" fill="#DCE4EA" />
      <line x1="0" y1="66" x2="100" y2="66" stroke="#9FB1C1" strokeWidth="0.6" />
      {/* halyard */}
      <line x1="50" y1={top - 4} x2="50" y2="66" stroke="#5C7494" strokeWidth="0.8" />
      {stack.map((kind, i) => (
        <DayShape key={i} kind={kind} cx={50} cy={top + SHAPE_H / 2 + i * SHAPE_H} />
      ))}
    </svg>
  )
}

function FlagBallScene() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto" role="img" aria-label="Square flag with ball">
      <rect width="100" height="80" fill="#DCE4EA" />
      <line x1="0" y1="66" x2="100" y2="66" stroke="#9FB1C1" strokeWidth="0.6" />
      <line x1="44" y1="10" x2="44" y2="66" stroke="#5C7494" strokeWidth="1" />
      <rect x="44" y="12" width="26" height="22" fill="#22303E" />
      <circle cx="44" cy="44" r="7" fill="#22303E" />
    </svg>
  )
}

function FlareScene() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto" role="img" aria-label="Red flare at night">
      <rect width="100" height="80" fill="#0C1F36" />
      <line x1="0" y1="66" x2="100" y2="66" stroke="#2E4E72" strokeWidth="0.5" />
      <path d="M50 64 Q48 44 52 24" stroke="#E2574C" strokeWidth="0.8" fill="none" opacity="0.6" strokeDasharray="2 2" />
      <circle cx="52" cy="22" r="8" fill="#E2574C" opacity="0.2" />
      <circle cx="52" cy="22" r="4.5" fill="#E2574C" opacity="0.5" />
      <circle cx="52" cy="22" r="2.4" fill="#FCD9D4" />
    </svg>
  )
}

function FlamesScene() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto" role="img" aria-label="Flames on a vessel">
      <rect width="100" height="80" fill="#10263F" />
      <line x1="0" y1="66" x2="100" y2="66" stroke="#2E4E72" strokeWidth="0.5" />
      {/* hull silhouette */}
      <path d="M28 60 L72 60 L66 66 L34 66 Z" fill="#0A1828" />
      <g>
        <path d="M50 58 C44 50 47 42 50 36 C52 42 57 45 55 52 C58 50 59 47 59 44 C62 50 60 56 50 58 Z" fill="#E8913F" />
        <path d="M50 57 C47 52 48 47 50 43 C51 47 54 49 52 53 Z" fill="#F3C25A" />
      </g>
    </svg>
  )
}

function SmokeScene() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto" role="img" aria-label="Orange smoke signal">
      <rect width="100" height="80" fill="#DCE4EA" />
      <line x1="0" y1="66" x2="100" y2="66" stroke="#9FB1C1" strokeWidth="0.6" />
      <path d="M48 64 C46 56 50 52 48 46 C54 48 52 40 58 40 C56 34 64 32 64 26" stroke="#E8913F" strokeWidth="0" fill="none" />
      <g fill="#E8913F">
        <circle cx="49" cy="58" r="5" opacity="0.85" />
        <circle cx="53" cy="50" r="6.5" opacity="0.75" />
        <circle cx="58" cy="40" r="8" opacity="0.65" />
        <circle cx="64" cy="29" r="9.5" opacity="0.5" />
      </g>
    </svg>
  )
}

export default function Illustration({ illo }) {
  if (!illo) return null
  let scene = null
  if (illo.kind === 'lights') scene = <NightScene lights={illo.lights} />
  else if (illo.kind === 'shapes') scene = <ShapesScene stack={illo.stack} />
  else if (illo.kind === 'flagball') scene = <FlagBallScene />
  else if (illo.kind === 'flare') scene = <FlareScene />
  else if (illo.kind === 'flames') scene = <FlamesScene />
  else if (illo.kind === 'smoke') scene = <SmokeScene />
  if (!scene) return null
  return (
    <figure className="my-4 max-w-xs mx-auto">
      <div className="border border-beige-dark overflow-hidden">{scene}</div>
      {illo.caption && (
        <figcaption className="font-sans text-[12px] text-navy-mist text-center mt-2 tracking-wide">
          {illo.caption}
        </figcaption>
      )}
    </figure>
  )
}
