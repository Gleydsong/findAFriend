import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error'
import { makeGetPetDetailsUseCase } from '../../../use-cases/factories/make-get-pet-details'

const petDetailsParamsSchema = z.object({
  id: z.uuid(),
})

export async function details(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = petDetailsParamsSchema.parse(request.params)

    const getPetDetailsUseCase = makeGetPetDetailsUseCase()
    const { pet } = await getPetDetailsUseCase.execute({ petId: id })

    return reply.status(200).send({ pet })
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
