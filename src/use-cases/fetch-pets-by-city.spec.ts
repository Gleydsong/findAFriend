import { EnergyLevel, EnvironmentSize, IndependenceLevel, PetAge, PetSize } from '@prisma/client'

import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { FetchPetsByCityUseCase } from './fetch-pets-by-city'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: FetchPetsByCityUseCase

describe('FetchPetsByCityUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new FetchPetsByCityUseCase(petsRepository)
  })

  it('lists pets available in a city', async () => {
    const saoPauloOrg = await orgsRepository.create({
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      passwordHash: 'hashed-password',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    })

    const campinasOrg = await orgsRepository.create({
      name: 'Patinhas',
      email: 'contato@patinhas.com',
      passwordHash: 'hashed-password',
      address: 'Rua B, 10',
      city: 'Campinas',
      state: 'SP',
      cep: '13000000',
      whatsapp: '11988888888',
    })

    await petsRepository.create({
      name: 'Bolt',
      about: 'Muito brincalhao',
      age: PetAge.PUPPY,
      size: PetSize.SMALL,
      energyLevel: EnergyLevel.HIGH,
      independence: IndependenceLevel.MEDIUM,
      environment: EnvironmentSize.MEDIUM,
      photos: ['https://example.com/bolt.png'],
      requirements: ['Quintal'],
      orgId: saoPauloOrg.id,
    })

    await petsRepository.create({
      name: 'Max',
      about: 'Calmo e carinhoso',
      age: PetAge.ADULT,
      size: PetSize.LARGE,
      energyLevel: EnergyLevel.LOW,
      independence: IndependenceLevel.HIGH,
      environment: EnvironmentSize.LARGE,
      photos: ['https://example.com/max.png'],
      requirements: ['Espaco amplo'],
      orgId: campinasOrg.id,
    })

    const { pets } = await sut.execute({ city: 'Sao Paulo' })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toBe('Bolt')
  })

  it('filters pets by optional characteristics', async () => {
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

    await petsRepository.create({
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

    await petsRepository.create({
      name: 'Max',
      about: 'Calmo e carinhoso',
      age: PetAge.ADULT,
      size: PetSize.LARGE,
      energyLevel: EnergyLevel.LOW,
      independence: IndependenceLevel.HIGH,
      environment: EnvironmentSize.LARGE,
      photos: ['https://example.com/max.png'],
      requirements: ['Espaco amplo'],
      orgId: org.id,
    })

    const { pets } = await sut.execute({
      city: 'Sao Paulo',
      size: PetSize.SMALL,
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toBe('Bolt')
  })
})
