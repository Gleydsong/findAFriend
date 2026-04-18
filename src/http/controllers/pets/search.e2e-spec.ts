import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { app } from '../../../app'
import { createAndAuthenticateOrg } from '../../../../test/helpers/create-and-authenticate-org'
import { resetDatabase } from '../../../../test/helpers/reset-database'

describe('Search pets route (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await resetDatabase()
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
})
