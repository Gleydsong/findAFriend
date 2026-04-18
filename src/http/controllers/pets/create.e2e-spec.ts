import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { app } from '../../../app'
import { createAndAuthenticateOrg } from '../../../../test/helpers/create-and-authenticate-org'
import { resetDatabase } from '../../../../test/helpers/reset-database'

describe('Create pet route (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await resetDatabase()
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
})
