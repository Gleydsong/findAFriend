import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { create } from './create'
import { details } from './details'
import { search } from './search'

export async function petRoutes(app: FastifyInstance) {
  app.post('/orgs/pets', { onRequest: [verifyJwt] }, create)
  app.get('/pets', search)
  app.get('/pets/:id', details)
}
