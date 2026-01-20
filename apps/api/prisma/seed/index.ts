import { PrismaClient } from '@prisma/client'
import { garages } from './data'

let prisma

async function main() {
  prisma = new PrismaClient()

  const company = await prisma.company.upsert({
    where: { displayName: 'OpenSpace' },
    update: {},
    create: {
      displayName: 'OpenSpace',
      description: 'Default Company',
    },
  })

  // Reset sequence to ensure proper autoincrement for future inserts
  await prisma.$executeRaw`SELECT setval('"Company_id_seq"', ${company.id})`

  for (const garage of garages) {
    await prisma.garage.create({
      data: garage,
    })
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
