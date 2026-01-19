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
import { CreateUser } from './dtos/create.dto'
import { UserQueryDto } from './dtos/query.dto'
import { UpdateUser } from './dtos/update.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import { UserEntity } from './entity/user.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { REST_USER_FIELD_TYPES, type GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { contains } from 'class-validator'
import { QueryBuilder } from 'src/common/utils/query-builder.utils'
import { Prisma } from '@prisma/client'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  create(@Body() createUserDto: CreateUser, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, createUserDto.uid)
    return this.prisma.user.create({ data: createUserDto })
  }

  @ApiOkResponse({ type: [UserEntity] })
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(
    @Query() { skip, take, order, sortBy, search, searchBy }: UserQueryDto,
  ) {
    console.log({ search, searchBy })

    const where =
      search && searchBy
        ? QueryBuilder.buildWhereClause<Prisma.UserWhereInput>(
            searchBy,
            search,
            REST_USER_FIELD_TYPES,
          )
        : {}

    return this.prisma.user.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: QueryBuilder.buildOrderByClause(sortBy, order),
      ...QueryBuilder.buildPaginationOptions(skip, take),
      // ...(skip ? { skip: +skip } : null),
      // ...(take ? { take: +take } : null),
      // ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOkResponse({ type: UserEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.user.findUnique({ where: { uid } })
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUser,
    @GetUser() user: GetUserType,
  ) {
    const userInfo = await this.prisma.user.findUnique({ where: { uid } })
    checkRowLevelPermission(user, userInfo.uid)
    return this.prisma.user.update({
      where: { uid },
      data: updateUserDto,
    })
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() user: GetUserType) {
    const userInfo = await this.prisma.user.findUnique({ where: { uid } })
    checkRowLevelPermission(user, userInfo.uid)
    return this.prisma.user.delete({ where: { uid } })
  }
}
