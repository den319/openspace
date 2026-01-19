import { BadRequestException, Injectable } from '@nestjs/common'
import { FindManyCompanyArgs, FindUniqueCompanyArgs } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateCompanyInput } from './dtos/create-company.input'
import { UpdateCompanyInput } from './dtos/update-company.input'

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}
  async create({
    description,
    displayName,
    managerId,
    managerName,
  }: CreateCompanyInput) {
    const existingManager = await this.prisma.manager.findUnique({
      where: { uid: managerId },
    })

    if (existingManager && existingManager.companyId) {
      throw new BadRequestException('This manager already belongs to a company')
    }

    // Use a transaction to ensure atomicity and handle potential race conditions
    return this.prisma.$transaction(async (tx) => {
      // Find the next available ID to avoid sequence issues
      const lastCompany = await tx.company.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      })

      const nextId = lastCompany ? lastCompany.id + 1 : 1

      return tx.company.create({
        data: {
          id: nextId, // Explicitly set the ID
          description,
          displayName,
          Managers: {
            create: {
              displayName: managerName,
              uid: managerId,
            },
          },
        },
      })
    })
  }

  findAll(args: FindManyCompanyArgs) {
    return this.prisma.company.findMany(args)
  }

  findOne(args: FindUniqueCompanyArgs) {
    return this.prisma.company.findUnique(args)
  }

  update(updateCompanyInput: UpdateCompanyInput) {
    const { id, ...data } = updateCompanyInput
    return this.prisma.company.update({
      where: { id },
      data: data,
    })
  }

  remove(args: FindUniqueCompanyArgs) {
    return this.prisma.company.delete(args)
  }
}
