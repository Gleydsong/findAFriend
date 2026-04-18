import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

import { OrgAlreadyExistsError } from '../../../use-cases/errors/org-already-exists-error'
import { makeCreateOrgUseCase } from '../../../use-cases/factories/make-create-org'

const registerOrgBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  cep: z.string().min(8),
  whatsapp: z.string().min(10),
})

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = registerOrgBodySchema.parse(request.body)

    const createOrgUseCase = makeCreateOrgUseCase()
    const { org } = await createOrgUseCase.execute(body)

    return reply.status(201).send({ orgId: org.id })
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
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
