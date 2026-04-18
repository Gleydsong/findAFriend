import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

import { CityIsRequiredError } from '../../../use-cases/errors/city-is-required-error'
import { makeFetchPetsByCityUseCase } from '../../../use-cases/factories/make-fetch-pets-by-city'

const searchPetsQuerySchema = z.object({
  city: z.string().min(1),
  age: z.nativeEnum(PetAge).optional(),
  size: z.nativeEnum(PetSize).optional(),
  energyLevel: z.nativeEnum(EnergyLevel).optional(),
  independence: z.nativeEnum(IndependenceLevel).optional(),
  environment: z.nativeEnum(EnvironmentSize).optional(),
})

export async function search(request: FastifyRequest, reply: FastifyReply) {
  try {
    const query = searchPetsQuerySchema.parse(request.query)

    const fetchPetsByCityUseCase = makeFetchPetsByCityUseCase()
    const { pets } = await fetchPetsByCityUseCase.execute(query)

    return reply.status(200).send({ pets })
  } catch (error) {
    if (error instanceof CityIsRequiredError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error.',
        issues: error.flatten().fieldErrors,
      })
    }

    throw error
  }
}
