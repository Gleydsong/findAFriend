import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '../../../use-cases/factories/make-create-pet'

const createPetBodySchema = z.object({
  name: z.string().min(1),
  about: z.string().min(1),
  age: z.nativeEnum(PetAge),
  size: z.nativeEnum(PetSize),
  energyLevel: z.nativeEnum(EnergyLevel),
  independence: z.nativeEnum(IndependenceLevel),
  environment: z.nativeEnum(EnvironmentSize),
  photos: z.array(z.string().url()).default([]),
  requirements: z.array(z.string()).default([]),
})

const authPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = createPetBodySchema.parse(request.body)
    const { sub: orgId } = authPayloadSchema.parse(request.user)

    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({
      ...body,
      orgId,
    })

    return reply.status(201).send({ petId: pet.id })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
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
