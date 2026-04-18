import { randomUUID } from 'node:crypto'

import { Pet } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'
import { CreatePetInput, PetDetails, PetsRepository, SearchPetsFilters } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private readonly orgsRepository: OrgsRepository) {}

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    const org = await this.orgsRepository.findById(pet.orgId)

    if (!org) {
      return null
    }

    const petDetails: PetDetails = {
      ...pet,
      org: {
        id: org.id,
        name: org.name,
        address: org.address,
        city: org.city,
        state: org.state,
        whatsapp: org.whatsapp,
      },
    }

    return petDetails
  }

  async findManyByCity(city: string, filters: SearchPetsFilters = {}) {
    const petsWithOrg = await Promise.all(
      this.items.map(async (pet) => {
        const org = await this.orgsRepository.findById(pet.orgId)

        return { pet, org }
      }),
    )

    return petsWithOrg
      .filter(({ org }) => org?.city.toLowerCase() === city.toLowerCase())
      .filter(({ pet }) => {
        if (filters.age && pet.age !== filters.age) return false
        if (filters.size && pet.size !== filters.size) return false
        if (filters.energyLevel && pet.energyLevel !== filters.energyLevel) return false
        if (filters.independence && pet.independence !== filters.independence) return false
        if (filters.environment && pet.environment !== filters.environment) return false

        return true
      })
      .map(({ pet }) => pet)
  }

  async create(data: CreatePetInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energyLevel: data.energyLevel,
      independence: data.independence,
      environment: data.environment,
      photos: data.photos,
      requirements: data.requirements,
      orgId: data.orgId,
      createdAt: new Date(),
    }

    this.items.push(pet)

    return pet
  }
}
