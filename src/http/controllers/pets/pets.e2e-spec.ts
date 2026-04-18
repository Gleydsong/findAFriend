import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { createAndAuthenticateOrg } from '../../../../test/helpers/create-and-authenticate-org'

describe('Pet routes (e2e)', () => {
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

  it('creates a pet for an authenticated org', async () => {
    const { token } = await createAndAuthenticateOrg()

    const response = await app.inject({
      method: 'POST',
      url: '/orgs/pets',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Bolt',
        about: 'Muito brincalhao',
        age: PetAge.PUPPY,
        size: PetSize.SMALL,
        energyLevel: EnergyLevel.HIGH,
        independence: IndependenceLevel.MEDIUM,
        environment: EnvironmentSize.MEDIUM,
        photos: ['https://example.com/bolt.png'],
        requirements: ['Quintal'],
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      petId: expect.any(String),
    })
  })

  it('lists pets by city with optional filters', async () => {
    const { token } = await createAndAuthenticateOrg()

    await app.inject({
      method: 'POST',
      url: '/orgs/pets',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Bolt',
        about: 'Muito brincalhao',
        age: PetAge.PUPPY,
        size: PetSize.SMALL,
        energyLevel: EnergyLevel.HIGH,
        independence: IndependenceLevel.MEDIUM,
        environment: EnvironmentSize.MEDIUM,
        photos: ['https://example.com/bolt.png'],
        requirements: ['Quintal'],
      },
    })

    await app.inject({
      method: 'POST',
      url: '/orgs/pets',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Max',
        about: 'Calmo e carinhoso',
        age: PetAge.ADULT,
        size: PetSize.LARGE,
        energyLevel: EnergyLevel.LOW,
        independence: IndependenceLevel.HIGH,
        environment: EnvironmentSize.LARGE,
        photos: ['https://example.com/max.png'],
        requirements: ['Espaco amplo'],
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/pets?city=Sao%20Paulo&size=SMALL',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().pets).toHaveLength(1)
    expect(response.json().pets[0].name).toBe('Bolt')
  })

  it('returns pet details with org contact data', async () => {
    const { token } = await createAndAuthenticateOrg()

    const createPetResponse = await app.inject({
      method: 'POST',
      url: '/orgs/pets',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Bolt',
        about: 'Muito brincalhao',
        age: PetAge.PUPPY,
        size: PetSize.SMALL,
        energyLevel: EnergyLevel.HIGH,
        independence: IndependenceLevel.MEDIUM,
        environment: EnvironmentSize.MEDIUM,
        photos: ['https://example.com/bolt.png'],
        requirements: ['Quintal'],
      },
    })

    const { petId } = createPetResponse.json()

    const response = await app.inject({
      method: 'GET',
      url: `/pets/${petId}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().pet).toEqual(
      expect.objectContaining({
        id: petId,
        name: 'Bolt',
        org: expect.objectContaining({
          whatsapp: '11999999999',
        }),
      }),
    )
  })
})
