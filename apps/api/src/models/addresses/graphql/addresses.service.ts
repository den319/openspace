import { Injectable } from '@nestjs/common'
import { FindManyAddressArgs, FindUniqueAddressArgs } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateAddressInput } from './dtos/create-address.input'
import { UpdateAddressInput } from './dtos/update-address.input'
import { LoggingService } from 'src/common/logging/logging.service'

@Injectable()
export class AddressesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}
  async create(
    createAddressInput: CreateAddressInput,
    userId?: string,
    ip?: string,
  ) {
    try {
      const address = await this.prisma.address.create({
        data: createAddressInput,
      })

      await this.loggingService.logDatabase(
        'CREATE',
        'address',
        { addressId: address.id, garageId: createAddressInput.garageId },
        userId,
      )

      return address
    } catch (error) {
      await this.loggingService.logError(
        error,
        'AddressService.create',
        ip,
        userId,
      )
      throw error
    }
  }

  async findAll(args: FindManyAddressArgs, userId?: string, ip?: string) {
    try {
      const addresses = await this.prisma.address.findMany(args)

      await this.loggingService.logDatabase(
        'READ',
        'address',
        { count: addresses.length, filters: args.where },
        userId,
      )

      return addresses
    } catch (error) {
      await this.loggingService.logError(
        error,
        'AddressService.findAll',
        ip,
        userId,
      )
      throw error
    }
  }

  async findOne(args: FindUniqueAddressArgs, userId?: string, ip?: string) {
    try {
      const address = await this.prisma.address.findUnique(args)

      if (address) {
        await this.loggingService.logDatabase(
          'READ',
          'address',
          { addressId: address.id },
          userId,
        )
      }

      return address
    } catch (error) {
      await this.loggingService.logError(
        error,
        'AddressService.findOne',
        ip,
        userId,
      )
      throw error
    }
  }

  async update(
    updateAddressInput: UpdateAddressInput,
    userId?: string,
    ip?: string,
  ) {
    const { id, ...data } = updateAddressInput

    try {
      const address = await this.prisma.address.update({
        where: { id },
        data: data,
      })

      await this.loggingService.logDatabase(
        'UPDATE',
        'address',
        { addressId: id, updatedFields: Object.keys(data) },
        userId,
      )

      return address
    } catch (error) {
      await this.loggingService.logError(
        error,
        'AddressService.update',
        ip,
        userId,
      )
      throw error
    }
  }

  async remove(args: FindUniqueAddressArgs, userId?: string, ip?: string) {
    try {
      const address = await this.prisma.address.delete(args)

      await this.loggingService.logDatabase(
        'DELETE',
        'address',
        { addressId: args.where.id },
        userId,
      )

      return address
    } catch (error) {
      await this.loggingService.logError(
        error,
        'AddressService.remove',
        ip,
        userId,
      )
      throw error
    }
  }
}
