import { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate'
import { register } from './register'

export async function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)
}
