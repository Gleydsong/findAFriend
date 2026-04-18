import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetPetDetailsUseCase } from './get-pet-details'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('GetPetDetailsUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetDetailsUseCase(petsRepository)
  })

  it('returns pet details with org contact data', async () => {
    const org = await orgsRepository.create({
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      passwordHash: 'hashed-password',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    })

    const pet = await petsRepository.create({
      name: 'Bolt',
      about: 'Muito brincalhao',
      age: PetAge.PUPPY,
      size: PetSize.SMALL,
      energyLevel: EnergyLevel.HIGH,
      independence: IndependenceLevel.MEDIUM,
      environment: EnvironmentSize.MEDIUM,
      photos: ['https://example.com/bolt.png'],
      requirements: ['Quintal'],
      orgId: org.id,
    })

    const { pet: petDetails } = await sut.execute({ petId: pet.id })

    expect(petDetails.name).toBe('Bolt')
    expect(petDetails.org.whatsapp).toBe('11999999999')
  })

  it('throws when the pet does not exist', async () => {
    await expect(() =>
      sut.execute({ petId: 'non-existent-pet-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
