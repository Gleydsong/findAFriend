import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { app } from '../../../app'
import { createAndAuthenticateOrg } from '../../../../test/helpers/create-and-authenticate-org'
import { resetDatabase } from '../../../../test/helpers/reset-database'

describe('Pet details route (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await resetDatabase()
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
