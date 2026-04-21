import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginSession } from '../api'
import { setToken } from '../auth/storage'
import { AuthSidePanel } from '../components/AuthSidePanel'
import { FormField, TextInput } from '../components/FormField'
import { PasswordField } from '../components/PasswordField'
import { loginAssets } from '../figma/authAssets'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const justRegistered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered,
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token } = await loginSession({ email, password })
      setToken(token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh max-w-[1280px] flex-col gap-8 px-4 py-8 md:flex-row md:items-stretch md:gap-12 md:px-8 lg:px-14">
        <AuthSidePanel assets={loginAssets} />
        <div className="flex flex-1 flex-col justify-center py-4 md:py-12">
          {justRegistered ? (
            <p className="mb-6 rounded-xl border border-[#d3e2e5] bg-[#f5f8fa] px-4 py-3 text-center text-sm text-[#0d3b66]">
              Cadastro concluído. Faça login com seu email e senha.
            </p>
          ) : null}
          <h1 className="mb-10 text-[clamp(2rem,5vw,3.375rem)] font-bold leading-[0.9] tracking-[-0.02em] text-[#0d3b66]">
            Boas-vindas!
          </h1>
          <form onSubmit={onSubmit} className="flex max-w-[488px] flex-col gap-8">
            <FormField label="Email" id="login-email">
              <TextInput
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>
            <PasswordField
              label="Senha"
              name="password"
              eyeIconSrc={loginAssets.eyeOff}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="h-[72px] w-full rounded-[20px] bg-[#0d3b66] text-[20px] font-extrabold text-white transition hover:bg-[#0a2d4d] disabled:opacity-60"
              >
                {loading ? 'Entrando…' : 'Login'}
              </button>
              <Link
                to="/cadastro"
                className="flex h-[72px] w-full items-center justify-center rounded-[20px] bg-[#0d3b66]/5 text-[20px] font-extrabold text-[#0d3b66] transition hover:bg-[#0d3b66]/10"
              >
                Cadastrar minha organização
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
