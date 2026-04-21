import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerOrg } from '../api'
import { AuthSidePanel } from '../components/AuthSidePanel'
import { FormField, TextInput } from '../components/FormField'
import { PasswordField } from '../components/PasswordField'
import { registerAssets } from '../figma/authAssets'

function onlyDigits(s: string): string {
  return s.replace(/\D/g, '')
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    const cepDigits = onlyDigits(cep)
    if (cepDigits.length < 8) {
      setError('CEP inválido (mínimo 8 dígitos).')
      return
    }
    const stateUf = state.trim().toUpperCase().slice(0, 2)
    if (stateUf.length !== 2) {
      setError('UF deve ter 2 letras.')
      return
    }
    const waDigits = onlyDigits(whatsapp)
    if (waDigits.length < 10) {
      setError('WhatsApp deve ter pelo menos 10 dígitos.')
      return
    }
    setLoading(true)
    try {
      await registerOrg({
        name: name.trim(),
        email: email.trim(),
        password,
        address: address.trim(),
        city: city.trim(),
        state: stateUf,
        cep: cepDigits,
        whatsapp: waDigits,
      })
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh max-w-[1280px] flex-col gap-8 px-4 py-8 md:flex-row md:items-start md:gap-12 md:px-8 lg:px-14">
        <AuthSidePanel assets={registerAssets} />
        <div className="flex flex-1 flex-col pb-12 pt-4 md:py-10">
          <h1 className="mb-10 text-center text-[clamp(1.75rem,4vw,3.375rem)] font-bold leading-[0.9] tracking-[-0.02em] text-[#0d3b66] md:text-left">
            Cadastre sua
            <br />
            organização
          </h1>
          <form onSubmit={onSubmit} className="flex max-w-[488px] flex-col gap-8">
            <FormField label="Nome do responsável" id="reg-name">
              <TextInput
                id="reg-name"
                name="name"
                autoComplete="name"
                placeholder="Antônio Bandeira"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Email" id="reg-email">
              <TextInput
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>
            <FormField label="CEP" id="reg-cep">
              <TextInput
                id="reg-cep"
                name="cep"
                autoComplete="postal-code"
                placeholder="13254-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                required
                minLength={8}
              />
            </FormField>
            <FormField label="Endereço" id="reg-address">
              <TextInput
                id="reg-address"
                name="address"
                autoComplete="street-address"
                placeholder="rua do meio"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </FormField>
            <div className="grid gap-8 sm:grid-cols-2">
              <FormField label="Cidade" id="reg-city">
                <TextInput
                  id="reg-city"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Rio do Sul"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="UF" id="reg-state">
                <TextInput
                  id="reg-state"
                  name="state"
                  autoComplete="address-level1"
                  placeholder="SC"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  required
                />
              </FormField>
            </div>
            <div className="w-full max-w-[488px]">
              <div className="overflow-hidden rounded-[20px] border border-dashed border-[#0d3b66]">
                <img
                  src={registerAssets.mapBg}
                  alt=""
                  className="h-[142px] w-full object-cover"
                />
              </div>
            </div>
            <FormField label="Whatsapp" id="reg-wa">
              <TextInput
                id="reg-wa"
                name="whatsapp"
                autoComplete="tel"
                placeholder="81 91234.5678"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </FormField>
            <PasswordField
              label="Senha"
              name="password"
              autoComplete="new-password"
              eyeIconSrc={registerAssets.eyeOff}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <PasswordField
              label="Confirmar Senha"
              name="confirm-password"
              autoComplete="new-password"
              eyeIconSrc={registerAssets.eyeOff}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="h-[72px] w-full rounded-[20px] bg-[#0d3b66] text-[20px] font-extrabold text-white transition hover:bg-[#0a2d4d] disabled:opacity-60"
              >
                {loading ? 'Enviando…' : 'Cadastrar'}
              </button>
              <Link
                to="/login"
                className="flex h-[72px] w-full items-center justify-center rounded-[20px] bg-white text-[20px] font-extrabold text-[#0d3b66] underline decoration-solid underline-offset-4"
              >
                Já possui conta?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
