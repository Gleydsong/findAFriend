import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'

import { env } from './env'
import { orgRoutes } from './http/controllers/orgs/routes'
import { petRoutes } from './http/controllers/pets/routes'

export const app = fastify({
  logger: env.NODE_ENV !== 'test',
})

void app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

void app.register(orgRoutes)
void app.register(petRoutes)

app.get('/health', async () => {
  return { status: 'ok' }
})
