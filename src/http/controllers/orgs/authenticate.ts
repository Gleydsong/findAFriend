import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

import { InvalidCredentialsError } from '../../../use-cases/errors/invalid-credentials-error'
import { makeAuthenticateOrgUseCase } from '../../../use-cases/factories/make-authenticate-org'

const authenticateOrgBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = authenticateOrgBodySchema.parse(request.body)

    const authenticateOrgUseCase = makeAuthenticateOrgUseCase()
    const { org } = await authenticateOrgUseCase.execute(body)

    const token = await reply.jwtSign({}, { sign: { sub: org.id } })

    return reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
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
