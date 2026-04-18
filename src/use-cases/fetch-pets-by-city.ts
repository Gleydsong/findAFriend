import { Pet } from '@prisma/client'

import { PetsRepository, SearchPetsFilters } from '../repositories/pets-repository'
import { CityIsRequiredError } from './errors/city-is-required-error'

interface FetchPetsByCityUseCaseRequest extends SearchPetsFilters {
  city: string
}

interface FetchPetsByCityUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute({
    city,
    ...filters
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    if (!city.trim()) {
      throw new CityIsRequiredError()
    }

    const pets = await this.petsRepository.findManyByCity(city, filters)

    return { pets }
  }
}
