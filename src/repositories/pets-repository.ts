import { Pet, PetAge, PetSize, EnergyLevel, EnvironmentSize, IndependenceLevel } from '@prisma/client'

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
  findById(id: string): Promise<Pet | null>
  findManyByCity(city: string, filters?: SearchPetsFilters): Promise<Pet[]>
  create(data: CreatePetInput): Promise<Pet>
}
