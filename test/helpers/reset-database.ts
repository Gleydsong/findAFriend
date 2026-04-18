import { prisma } from '../../src/lib/prisma'

export async function resetDatabase() {
  await prisma.pet.deleteMany()
  await prisma.org.deleteMany()
}
