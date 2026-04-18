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

  it('does not register an org twice with the same email', async () => {
    const payload = {
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      password: '123456',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    }

    await app.inject({
      method: 'POST',
      url: '/orgs',
      payload,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/orgs',
      payload,
    })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toEqual({
      message: 'Org already exists.',
    })
  })

  it('returns validation errors when payload is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/orgs',
      payload: {
        name: '',
        email: 'invalid-email',
        password: '123',
        address: '',
        city: '',
        state: 'S',
        cep: '1234567',
        whatsapp: '123456789',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      message: 'Validation error.',
      issues: {
        name: expect.any(Array),
        email: expect.any(Array),
        password: expect.any(Array),
        address: expect.any(Array),
        city: expect.any(Array),
        state: expect.any(Array),
        cep: expect.any(Array),
        whatsapp: expect.any(Array),
      },
    })
  })
})
