import { useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient'
import { validateEmail, validatePassword } from '../lib/validate'
import { AnchorIcon, Button, GoldRule, TextInput } from '../components/ui'

export default function AuthScreen({ onLocalEnter }) {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  async function submit(e) {
    e.preventDefault()
    const errs = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setErrors(errs)
    setNotice(null)
    if (errs.email || errs.password) return

    setBusy(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password })
        if (error) throw error
        setNotice({ kind: 'ok', text: 'Account created. If email confirmation is enabled, check your inbox, then sign in.' })
        setMode('signin')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
      }
    } catch (err) {
      setNotice({ kind: 'err', text: err.message || 'Authentication failed.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="bg-navy text-cream px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-md mx-auto">
          <AnchorIcon className="w-8 h-8 text-gold-soft mb-6" />
          <h1 className="font-serif text-5xl sm:text-6xl tracking-tight leading-none">
            Sea<span className="italic">Smart</span>
          </h1>
          <p className="font-sans text-[15px] text-cream/70 mt-4 max-w-sm leading-relaxed">
            Rules of the Road training for Navy bridge watchstanders. Built for the qualification pipeline.
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-10">
        <div className="max-w-md mx-auto">
          {supabaseConfigured ? (
            <>
              <div className="flex gap-6 mb-8">
                {['signin', 'signup'].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m)
                      setNotice(null)
                    }}
                    className={`font-serif text-xl pb-1 border-b-2 transition-colors ${
                      mode === m ? 'border-gold text-navy' : 'border-transparent text-navy-mist'
                    }`}
                  >
                    {m === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="space-y-5" noValidate>
                <TextInput
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  error={errors.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextInput
                  label="Password"
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {notice && (
                  <p
                    className={`font-sans text-[13px] px-4 py-3 border ${
                      notice.kind === 'ok'
                        ? 'bg-correct-bg border-correct-border text-correct-text'
                        : 'bg-wrong-bg border-wrong-border text-wrong-text'
                    }`}
                  >
                    {notice.text}
                  </p>
                )}
                <Button type="submit" disabled={busy} className="w-full">
                  {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
                </Button>
              </form>

              <GoldRule className="my-8" />
              <p className="font-sans text-[13px] text-navy-mist leading-relaxed">
                Email and password only. No name, rank, rate, or unit is collected — no personal information is stored
                or transmitted.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl text-navy mb-3">Local training mode</h2>
              <p className="font-sans text-[14px] text-navy-mist leading-relaxed mb-6">
                Supabase is not configured for this build, so progress will be stored on this device only. Add
                <code className="mx-1 px-1 bg-cream-dark text-navy text-[13px]">VITE_SUPABASE_URL</code>
                and
                <code className="mx-1 px-1 bg-cream-dark text-navy text-[13px]">VITE_SUPABASE_ANON_KEY</code>
                to enable accounts and sync.
              </p>
              <Button onClick={onLocalEnter} className="w-full">
                Start training
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
