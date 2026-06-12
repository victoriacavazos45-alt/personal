// SeaSmart design-system primitives. No component libraries — everything
// here is hand-built to the editorial navy/cream/gold system.

export function AnchorIcon({ className = 'w-5 h-5 text-gold' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <circle cx="12" cy="5" r="2.4" />
      <path d="M12 7.4V20M12 20c-4.2 0-7.2-2.8-7.8-6.4M12 20c4.2 0 7.2-2.8 7.8-6.4M4.2 13.6 2.6 15.4m1.6-1.8 2.3.6M19.8 13.6l1.6 1.8m-1.6-1.8-2.3.6M8.6 10.4h6.8" />
    </svg>
  )
}

export function Wordmark({ light = false, className = '' }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <AnchorIcon className={`w-4 h-4 self-center ${light ? 'text-gold-soft' : 'text-gold'}`} />
      <span className={`font-serif text-xl tracking-tight ${light ? 'text-cream' : 'text-navy'}`}>
        Sea<span className="italic">Smart</span>
      </span>
    </span>
  )
}

export function GoldRule({ className = '' }) {
  return <div className={`h-px w-12 bg-gold ${className}`} aria-hidden="true" />
}

export function Button({ variant = 'primary', className = '', disabled, children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-wide transition-colors duration-150 select-none px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-navy text-cream hover:bg-navy-deep',
    secondary: 'border border-navy text-navy hover:bg-navy hover:text-cream bg-transparent',
    ghost: 'text-navy hover:bg-cream-dark bg-transparent',
    danger: 'border border-wrong-border text-wrong-text hover:bg-wrong-bg bg-transparent',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white border border-beige shadow-[0_1px_3px_rgba(27,58,92,0.06)] ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SectionLabel({ children, className = '' }) {
  return (
    <p className={`font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold ${className}`}>
      {children}
    </p>
  )
}

export function Checkbox({ checked, onChange, label, disabled }) {
  return (
    <label
      className={`flex items-center gap-3 py-2.5 cursor-pointer select-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span
        className={`w-5 h-5 shrink-0 border flex items-center justify-center transition-colors ${
          checked ? 'bg-navy border-navy' : 'bg-white border-beige-dark'
        }`}
        aria-hidden="true"
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-cream" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6.5 4.8 9 10 3" />
          </svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="font-sans text-[15px] text-ink">{label}</span>
    </label>
  )
}

export function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 cursor-pointer select-none">
      <span>
        <span className="block font-sans text-[15px] text-ink">{label}</span>
        {sublabel && <span className="block font-sans text-[13px] text-navy-mist mt-0.5">{sublabel}</span>}
      </span>
      <span
        className={`relative w-11 h-6 shrink-0 rounded-full transition-colors ${checked ? 'bg-navy' : 'bg-beige-dark'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

export function TextInput({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      <span className="block font-sans text-[13px] font-medium text-navy mb-1.5">{label}</span>
      <input
        className={`w-full bg-white border px-4 py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-navy ${
          error ? 'border-wrong-border' : 'border-beige-dark'
        } ${className}`}
        {...props}
      />
      {error && <span className="block font-sans text-[13px] text-wrong-text mt-1.5">{error}</span>}
    </label>
  )
}

export function Spinner({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-spin text-navy ${className}`} fill="none" aria-label="Loading">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function BookmarkIcon({ filled, className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 3.5h12a.5.5 0 0 1 .5.5v16.4a.3.3 0 0 1-.47.25L12 16.4l-6.03 4.25A.3.3 0 0 1 5.5 20.4V4a.5.5 0 0 1 .5-.5Z" />
    </svg>
  )
}

export function FlameIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.7 3.2-.6 5-2 6.6C8.4 10.4 7 12.2 7 15a5 5 0 0 0 10 0c0-1.5-.5-2.7-1.2-3.9-.4 1-1 1.7-1.9 2.2.4-3.4-.4-7.6-1.9-11.3Z" />
    </svg>
  )
}

// Confetti-style micro-celebration: small gold/navy dots bursting outward.
export function Burst() {
  const dots = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2
    const dist = 34 + (i % 3) * 12
    return {
      tx: `${Math.cos(angle) * dist}px`,
      ty: `${Math.sin(angle) * dist}px`,
      color: i % 3 === 0 ? '#7F6A3E' : i % 3 === 1 ? '#1B3A5C' : '#9A8556',
      delay: `${(i % 4) * 40}ms`,
    }
  })
  return (
    <span className="relative inline-block w-0 h-0 align-middle" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full animate-burst"
          style={{ '--tx': d.tx, '--ty': d.ty, background: d.color, animationDelay: d.delay }}
        />
      ))}
    </span>
  )
}
