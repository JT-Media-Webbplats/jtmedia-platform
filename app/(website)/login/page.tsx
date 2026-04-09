'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authErr || !data.user) {
      setError('Fel e-post eller lösenord.')
      setLoading(false)
      return
    }

    // Check role and redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    router.refresh()
    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/customer')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-black font-black text-sm">
            JT
          </span>
          <span className="text-lg font-black uppercase tracking-tight text-black">
            Media Sweden
          </span>
        </div>

        <h1 className="text-2xl font-black text-black mb-1">Logga in</h1>
        <p className="text-sm text-black/45 mb-8">
          Ange dina uppgifter för att fortsätta.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-black/60 mb-1.5">
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="du@exempel.se"
              className="w-full border-2 border-black/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green transition-colors placeholder-black/25"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-black/60 mb-1.5">
              Lösenord
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border-2 border-black/8 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-brand-green transition-colors placeholder-black/25"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full flex items-center justify-center gap-2 text-black py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Loggar in…' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  )
}
