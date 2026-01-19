import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'

import { PrismaService } from 'src/common/prisma/prisma.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateAddress } from './dtos/create.dto'
import { AddressQueryDto } from './dtos/query.dto'
import { UpdateAddress } from './dtos/update.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import { AddressEntity } from './entity/address.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { REST_ADDRESS_FIELD_TYPES, type GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { QueryBuilder } from 'src/common/utils/query-builder.utils'
import { Prisma } from '@prisma/client'

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AddressEntity })
  @Post()
  async create(
    @Body() createAddressDto: CreateAddress,
    @GetUser() user: GetUserType,
  ) {
    // const garage = await this.prisma.garage.findUnique({
    //   where: { id: createAddressDto.garageId },
    //   include: { Company: { include: { Managers: true } } },
    // })
    // checkRowLevelPermission(
    //   user,
    //   garage.Company.Managers.map((manager) => manager.uid),
    // )
    return this.prisma.address.create({ data: createAddressDto })
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @Get()
  @ApiOperation({ summary: 'Get all addresses' })
  findAll(
    @Query() { skip, take, order, sortBy, search, searchBy }: AddressQueryDto,
  ) {
    console.log({ search, searchBy })

    const where =
      search && searchBy
        ? QueryBuilder.buildWhereClause<Prisma.AddressWhereInput>(
            searchBy,
            search,
            REST_ADDRESS_FIELD_TYPES,
          )
        : {}

    return this.prisma.address.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: QueryBuilder.buildOrderByClause(sortBy, order),
      ...QueryBuilder.buildPaginationOptions(skip, take),
      // ...(skip ? { skip: +skip } : null),
      // ...(take ? { take: +take } : null),
      // ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOkResponse({ type: AddressEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.address.findUnique({ where: { id } })
  }

  @ApiOkResponse({ type: AddressEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddress,
    @GetUser() user: GetUserType,
  ) {
    // const address = await this.prisma.address.findUnique({
    //   where: { id },
    //   include: {
    //     Garage: { include: { Company: { include: { Managers: true } } } },
    //   },
    // })
    // checkRowLevelPermission(
    //   user,
    //   address.Garage.Company.Managers.map((manager) => manager.uid),
    // )
    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    })
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    // const address = await this.prisma.address.findUnique({
    //   where: { id },
    //   include: {
    //     Garage: { include: { Company: { include: { Managers: true } } } },
    //   },
    // })
    // checkRowLevelPermission(
    //   user,
    //   address.Garage.Company.Managers.map((manager) => manager.uid),
    // )
    return this.prisma.address.delete({ where: { id } })
  }
}
