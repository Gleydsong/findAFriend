import { Pet, PetAge, PetSize, EnergyLevel, EnvironmentSize, IndependenceLevel } from '@prisma/client'

import { OrgsRepository } from '../repositories/orgs-repository'
import { PetsRepository } from '../repositories/pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreatePetUseCaseRequest {
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

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energyLevel,
    independence,
    environment,
    photos,
    requirements,
    orgId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energyLevel,
      independence,
      environment,
      photos,
      requirements,
      orgId,
    })

    return { pet }
  }
}
