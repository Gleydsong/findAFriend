import { compare } from 'bcryptjs'

import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { CreateOrgUseCase } from './create-org'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('CreateOrgUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('creates an org with a hashed password', async () => {
    const { org } = await sut.execute({
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      password: '123456',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(await compare('123456', org.passwordHash)).toBe(true)
  })

  it('does not allow two orgs with the same email', async () => {
    await sut.execute({
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      password: '123456',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    })

    await expect(() =>
      sut.execute({
        name: 'Outra ORG',
        email: 'contato@findafriend.com',
        password: '123456',
        address: 'Rua B, 10',
        city: 'Campinas',
        state: 'SP',
        cep: '13000000',
        whatsapp: '11988888888',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
