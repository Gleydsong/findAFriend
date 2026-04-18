import { PgAdapter } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

import { env } from '../env'

const adapter = new PgAdapter({
  connectionString: env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })
