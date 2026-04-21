import { Link } from 'react-router-dom'
import type { Pet } from '../api'
import { ageLabel, sizeLabel } from '../labels'

function pickPhoto(urls: string[]): string | undefined {
  return urls[0]
}

export function PetCard({ pet }: { pet: Pet }) {
  const src = pickPhoto(pet.photos)

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-white shadow-sm transition hover:border-[var(--color-navy)]/25 hover:shadow-md">
      <Link
        to={`/pets/${pet.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-[var(--color-field)]"
      >
        {src ? (
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fde8e9] to-[#f15156]/25 text-4xl font-bold text-[var(--color-navy)]/35">
            {pet.name.slice(0, 1)}
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-[var(--color-ink)] shadow-sm backdrop-blur">
            {ageLabel[pet.age]}
          </span>
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-[var(--color-ink)] shadow-sm backdrop-blur">
            {sizeLabel[pet.size]}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4 text-left">
        <Link to={`/pets/${pet.id}`}>
          <h3 className="text-lg font-bold text-[var(--color-ink)] transition group-hover:text-[var(--color-navy)]">
            {pet.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {pet.about}
        </p>
        <Link
          to={`/pets/${pet.id}`}
          className="mt-auto text-sm font-extrabold text-[var(--color-navy)] underline-offset-4 hover:underline"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  )
}
