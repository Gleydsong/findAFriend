import { app } from '../../../app'

import { resetDatabase } from '../../../../test/helpers/reset-database'

describe('Authenticate org route (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('authenticates an org and returns a JWT', async () => {
    await app.inject({
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

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'contato@findafriend.com',
        password: '123456',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      token: expect.any(String),
    })
  })
})
