import { type ReactNode, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PetDetails } from '../api'
import { fetchPetById, whatsappHref } from '../api'
import {
  ageLabel,
  energyLabel,
  environmentLabel,
  independenceLabel,
  sizeLabel,
} from '../labels'

export function PetPage() {
  const { id } = useParams<{ id: string }>()
  const [pet, setPet] = useState<PetDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchPetById(id)
      .then(({ pet: data }) => {
        if (!cancelled) setPet(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setPet(null)
          setError(e instanceof Error ? e.message : 'Pet não encontrado')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-[var(--color-muted)]">
        Carregando…
      </div>
    )
  }

  if (error || !pet) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="mb-6 text-red-700">{error ?? 'Não encontrado'}</p>
        <Link
          to="/"
          className="font-extrabold text-[var(--color-navy)] underline underline-offset-4 hover:opacity-80"
        >
          Voltar à busca
        </Link>
      </div>
    )
  }

  const wa = whatsappHref(pet.org.whatsapp)

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        <nav className="mb-8">
          <Link
            to="/"
            className="text-sm font-semibold text-[var(--color-navy)] hover:opacity-80"
          >
            ← Voltar
          </Link>
        </nav>

        <div className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="aspect-square bg-[var(--color-field)] md:aspect-auto md:min-h-[420px]">
              {pet.photos[0] ? (
                <img
                  src={pet.photos[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-[#fde8e9] to-[#f15156]/20 text-7xl font-bold text-[var(--color-navy)]/30">
                  {pet.name.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <h1 className="mb-2 text-3xl font-bold tracking-[-0.02em] text-[var(--color-ink)] sm:text-4xl">
                {pet.name}
              </h1>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge>{ageLabel[pet.age]}</Badge>
                <Badge>{sizeLabel[pet.size]}</Badge>
                <Badge>Energia {energyLabel[pet.energyLevel]}</Badge>
                <Badge>Ind. {independenceLabel[pet.independence]}</Badge>
                <Badge>{environmentLabel[pet.environment]}</Badge>
              </div>
              <p className="text-lg leading-relaxed text-[var(--color-muted)]">
                {pet.about}
              </p>
            </div>
          </div>

          {pet.photos.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 border-t border-[var(--color-border)] p-4 sm:grid-cols-4">
              {pet.photos.slice(1).map((url) => (
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="aspect-square rounded-[10px] object-cover"
                />
              ))}
            </div>
          ) : null}

          <div className="border-t border-[var(--color-border)] p-8 sm:p-10">
            <h2 className="mb-4 text-xl font-bold text-[var(--color-ink)]">
              Requisitos para adoção
            </h2>
            {pet.requirements.length ? (
              <ul className="list-inside list-disc space-y-1 text-[var(--color-muted)]">
                {pet.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--color-muted)]">
                Nenhum requisito listado.
              </p>
            )}
          </div>

          <div className="border-t border-[var(--color-border)] bg-[var(--color-field)] p-8 sm:p-10">
            <h2 className="mb-4 text-xl font-bold text-[var(--color-ink)]">
              Organização
            </h2>
            <p className="font-bold text-[var(--color-ink)]">{pet.org.name}</p>
            <p className="mt-1 text-[var(--color-muted)]">
              {pet.org.address} — {pet.org.city}/{pet.org.state}
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-[52px] items-center justify-center rounded-[20px] bg-[#25d366] px-8 text-[18px] font-extrabold text-white shadow-sm transition hover:bg-[#1ebe57]"
            >
              Conversar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-field)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
      {children}
    </span>
  )
}
