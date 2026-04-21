const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3333'

export { API_BASE }

export type PetAge = 'PUPPY' | 'ADULT' | 'SENIOR'
export type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE'
export type EnergyLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type IndependenceLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type EnvironmentSize = 'SMALL' | 'MEDIUM' | 'LARGE'

export interface Pet {
  id: string
  name: string
  about: string
  age: PetAge
  size: PetSize
  energyLevel: EnergyLevel
  independence: IndependenceLevel
  environment: EnvironmentSize
  photos: string[]
  requirements: string[]
  createdAt: string
  orgId: string
}

export interface PetDetails extends Pet {
  org: {
    id: string
    name: string
    address: string
    city: string
    state: string
    whatsapp: string
  }
}

export interface SearchPetsParams {
  city: string
  age?: PetAge
  size?: PetSize
  energyLevel?: EnergyLevel
  independence?: IndependenceLevel
  environment?: EnvironmentSize
}

function buildSearchQuery(params: SearchPetsParams): string {
  const q = new URLSearchParams({ city: params.city })
  if (params.age) q.set('age', params.age)
  if (params.size) q.set('size', params.size)
  if (params.energyLevel) q.set('energyLevel', params.energyLevel)
  if (params.independence) q.set('independence', params.independence)
  if (params.environment) q.set('environment', params.environment)
  return q.toString()
}

export async function fetchPets(
  params: SearchPetsParams,
): Promise<{ pets: Pet[] }> {
  const res = await fetch(`${API_BASE}/pets?${buildSearchQuery(params)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err === 'object' && err && 'message' in err
        ? String((err as { message: string }).message)
        : `Erro ${res.status}`,
    )
  }
  return res.json() as Promise<{ pets: Pet[] }>
}

export async function fetchPetById(id: string): Promise<{ pet: PetDetails }> {
  const res = await fetch(`${API_BASE}/pets/${id}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err === 'object' && err && 'message' in err
        ? String((err as { message: string }).message)
        : `Erro ${res.status}`,
    )
  }
  return res.json() as Promise<{ pet: PetDetails }>
}

export function whatsappHref(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : '#'
}

export interface LoginBody {
  email: string
  password: string
}

export interface RegisterOrgBody {
  name: string
  email: string
  password: string
  address: string
  city: string
  state: string
  cep: string
  whatsapp: string
}

export async function loginSession(body: LoginBody): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as { token?: string; message?: string }
  if (!res.ok) {
    throw new Error(data.message ?? `Erro ${res.status}`)
  }
  if (!data.token) throw new Error('Resposta inválida')
  return { token: data.token }
}

export async function registerOrg(
  body: RegisterOrgBody,
): Promise<{ orgId: string }> {
  const res = await fetch(`${API_BASE}/orgs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as { orgId?: string; message?: string }
  if (!res.ok) {
    throw new Error(data.message ?? `Erro ${res.status}`)
  }
  if (!data.orgId) throw new Error('Resposta inválida')
  return { orgId: data.orgId }
}
