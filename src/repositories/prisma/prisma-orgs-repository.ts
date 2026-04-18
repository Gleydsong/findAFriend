import { prisma } from '../../lib/prisma'
import { CreateOrgInput, OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
  async findByEmail(email: string) {
    return prisma.org.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return prisma.org.findUnique({
      where: { id },
    })
  }

  async create(data: CreateOrgInput) {
    return prisma.org.create({
      data,
    })
  }
}
