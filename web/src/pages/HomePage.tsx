import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type {
  EnergyLevel,
  EnvironmentSize,
  IndependenceLevel,
  PetAge,
  PetSize,
  Pet,
  SearchPetsParams,
} from '../api'
import { fetchPets } from '../api'
import { PetCard } from '../components/PetCard'
import {
  ageLabel,
  energyLabel,
  environmentLabel,
  independenceLabel,
  sizeLabel,
} from '../labels'

const ages: PetAge[] = ['PUPPY', 'ADULT', 'SENIOR']
const sizes: PetSize[] = ['SMALL', 'MEDIUM', 'LARGE']
const energies: EnergyLevel[] = ['LOW', 'MEDIUM', 'HIGH']
const indeps: IndependenceLevel[] = ['LOW', 'MEDIUM', 'HIGH']
const envs: EnvironmentSize[] = ['SMALL', 'MEDIUM', 'LARGE']

const field =
  'h-12 w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-field)] px-[18px] text-[18px] font-semibold text-[var(--color-ink)] outline-none ring-[var(--color-navy)] placeholder:text-[var(--color-ink)]/35 focus:ring-2'

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string
  value: T | ''
  onChange: (v: T | '') => void
  options: readonly T[]
  labels: Record<T, string>
}) {
  return (
    <label className="flex flex-col gap-2 text-left">
      <span className="text-[16px] font-semibold text-[var(--color-ink)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange((e.target.value || '') as T | '')}
        className={field}
      >
        <option value="">Qualquer</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {labels[o]}
          </option>
        ))}
      </select>
    </label>
  )
}

export function HomePage() {
  const [city, setCity] = useState('')
  const [submittedCity, setSubmittedCity] = useState('')
  const [age, setAge] = useState<PetAge | ''>('')
  const [size, setSize] = useState<PetSize | ''>('')
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | ''>('')
  const [independence, setIndependence] = useState<IndependenceLevel | ''>('')
  const [environment, setEnvironment] = useState<EnvironmentSize | ''>('')

  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!submittedCity.trim()) return

    const params: SearchPetsParams = {
      city: submittedCity.trim(),
      ...(age && { age }),
      ...(size && { size }),
      ...(energyLevel && { energyLevel }),
      ...(independence && { independence }),
      ...(environment && { environment }),
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchPets(params)
      .then(({ pets: list }) => {
        if (!cancelled) setPets(list)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setPets([])
          setError(e instanceof Error ? e.message : 'Falha na busca')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    submittedCity,
    age,
    size,
    energyLevel,
    independence,
    environment,
  ])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!city.trim()) {
      setError('Informe a cidade da organização (onde o pet está).')
      return
    }
    setError(null)
    setSubmittedCity(city.trim())
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            to="/login"
            className="text-[16px] font-semibold text-[var(--color-navy)] underline decoration-solid underline-offset-4 hover:opacity-80"
          >
            Área da organização
          </Link>
        </div>

        <header className="mb-12 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-coral)]">
            Comunidade
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            Find a Friend
          </h1>
          <p className="mx-auto max-w-xl text-lg text-[var(--color-muted)]">
            Encontre um amigo para chamar de seu. Busque por cidade da ONG e
            refine por perfil.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mb-10 rounded-[20px] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2 text-left">
              <span className="text-[16px] font-semibold text-[var(--color-ink)]">
                Cidade da organização *
              </span>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex.: São Paulo"
                className={`${field} py-3`}
              />
            </label>
            <button
              type="submit"
              className="h-[52px] shrink-0 rounded-[20px] bg-[var(--color-navy)] px-8 text-[18px] font-extrabold text-white transition hover:bg-[#0a2d4d] sm:h-12"
            >
              Buscar amigos
            </button>
          </div>

          {submittedCity ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <Select
                label="Idade"
                value={age}
                onChange={setAge}
                options={ages}
                labels={ageLabel}
              />
              <Select
                label="Porte"
                value={size}
                onChange={setSize}
                options={sizes}
                labels={sizeLabel}
              />
              <Select
                label="Energia"
                value={energyLevel}
                onChange={setEnergyLevel}
                options={energies}
                labels={energyLabel}
              />
              <Select
                label="Independência"
                value={independence}
                onChange={setIndependence}
                options={indeps}
                labels={independenceLabel}
              />
              <Select
                label="Ambiente"
                value={environment}
                onChange={setEnvironment}
                options={envs}
                labels={environmentLabel}
              />
            </div>
          ) : null}
        </form>

        {error ? (
          <p
            className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-center text-[var(--color-muted)]">Carregando…</p>
        ) : null}

        {!loading && submittedCity && pets.length === 0 && !error ? (
          <p className="text-center text-[var(--color-muted)]">
            Nenhum pet encontrado para esses filtros.
          </p>
        ) : null}

        {pets.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <li key={pet.id}>
                <PetCard pet={pet} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
