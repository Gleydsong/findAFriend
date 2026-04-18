import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CreatePetUseCase } from './create-pet'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

describe('CreatePetUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('creates a pet linked to an org', async () => {
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

    const { pet } = await sut.execute({
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

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.orgId).toBe(org.id)
  })

  it('does not create a pet for a non-existent org', async () => {
    await expect(() =>
      sut.execute({
        name: 'Bolt',
        about: 'Muito brincalhao',
        age: PetAge.PUPPY,
        size: PetSize.SMALL,
        energyLevel: EnergyLevel.HIGH,
        independence: IndependenceLevel.MEDIUM,
        environment: EnvironmentSize.MEDIUM,
        photos: ['https://example.com/bolt.png'],
        requirements: ['Quintal'],
        orgId: 'non-existent-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
