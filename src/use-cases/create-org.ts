import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrgsRepository } from '../repositories/orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

interface CreateOrgUseCaseRequest {
  name: string
  email: string
  password: string
  address: string
  city: string
  state: string
  cep: string
  whatsapp: string
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private readonly orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    address,
    city,
    state,
    cep,
    whatsapp,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      passwordHash,
      address,
      city,
      state,
      cep,
      whatsapp,
    })

    return { org }
  }
}
