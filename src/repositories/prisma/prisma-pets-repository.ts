import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import { CreatePetInput, PetsRepository, SearchPetsFilters } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    return prisma.pet.findUnique({
      where: { id },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            whatsapp: true,
          },
        },
      },
    })
  }

  async findManyByCity(city: string, filters: SearchPetsFilters = {}) {
    const where: Prisma.PetWhereInput = {
      org: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      },
      ...(filters.age && { age: filters.age }),
      ...(filters.size && { size: filters.size }),
      ...(filters.energyLevel && { energyLevel: filters.energyLevel }),
      ...(filters.independence && { independence: filters.independence }),
      ...(filters.environment && { environment: filters.environment }),
    }

    return prisma.pet.findMany({ where })
  }

  async create(data: CreatePetInput) {
    return prisma.pet.create({
      data,
    })
  }
}
