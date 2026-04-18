import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'

describe('ORG routes (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    await prisma.pet.deleteMany()
    await prisma.org.deleteMany()
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
