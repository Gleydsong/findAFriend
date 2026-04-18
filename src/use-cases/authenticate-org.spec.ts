import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateOrgUseCase } from './authenticate-org'
import { CreateOrgUseCase } from './create-org'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let createOrgUseCase: CreateOrgUseCase
let sut: AuthenticateOrgUseCase

describe('AuthenticateOrgUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    createOrgUseCase = new CreateOrgUseCase(orgsRepository)
    sut = new AuthenticateOrgUseCase(orgsRepository)
  })

  it('authenticates an org with valid credentials', async () => {
    await createOrgUseCase.execute({
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      password: '123456',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    })

    const { org } = await sut.execute({
      email: 'contato@findafriend.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('rejects invalid credentials', async () => {
    await expect(() =>
      sut.execute({
        email: 'contato@findafriend.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
