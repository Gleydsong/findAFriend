import { randomUUID } from 'node:crypto'

import { Org } from '@prisma/client'

import { CreateOrgInput, OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByEmail(email: string) {
    return this.items.find((org) => org.email === email) ?? null
  }

  async findById(id: string) {
    return this.items.find((org) => org.id === id) ?? null
  }

  async create(data: CreateOrgInput) {
    const org: Org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      address: data.address,
      city: data.city,
      state: data.state,
      cep: data.cep,
      whatsapp: data.whatsapp,
      createdAt: new Date(),
    }

    this.items.push(org)

    return org
  }
}
