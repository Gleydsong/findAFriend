import { app } from '../../../app'

import { resetDatabase } from '../../../../test/helpers/reset-database'

describe('Register org route (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('registers an org', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/orgs',
      payload: {
        name: 'FindAFriend',
        email: 'contato@findafriend.com',
        password: '123456',
        address: 'Rua das Flores, 100',
        city: 'Sao Paulo',
        state: 'SP',
        cep: '01001000',
        whatsapp: '11999999999',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      orgId: expect.any(String),
    })
  })
})
