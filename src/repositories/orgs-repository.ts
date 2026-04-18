import { Org } from '@prisma/client'

export interface CreateOrgInput {
  name: string
  email: string
  passwordHash: string
  address: string
  city: string
  state: string
  cep: string
  whatsapp: string
}

export interface OrgsRepository {
  findByEmail(email: string): Promise<Org | null>
  findById(id: string): Promise<Org | null>
  create(data: CreateOrgInput): Promise<Org>
}
