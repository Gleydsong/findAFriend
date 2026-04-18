import { Pet, PetAge, PetSize, EnergyLevel, EnvironmentSize, IndependenceLevel } from '@prisma/client'

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

export interface CreatePetInput {
  name: string
  about: string
  age: PetAge
  size: PetSize
  energyLevel: EnergyLevel
  independence: IndependenceLevel
  environment: EnvironmentSize
  photos: string[]
  requirements: string[]
  orgId: string
}

export interface SearchPetsFilters {
  age?: PetAge
  size?: PetSize
  energyLevel?: EnergyLevel
  independence?: IndependenceLevel
  environment?: EnvironmentSize
}

export interface PetsRepository {
  findById(id: string): Promise<PetDetails | null>
  findManyByCity(city: string, filters?: SearchPetsFilters): Promise<Pet[]>
  create(data: CreatePetInput): Promise<Pet>
}
