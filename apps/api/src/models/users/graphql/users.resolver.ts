import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthProvider, User } from './entity/user.entity'
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args'
import {
  LoginInput,
  LoginOutput,
  RegisterWithCredentialsInput,
  RegisterWithProviderInput,
} from './dtos/create-user.input'
import { UpdateUserInput } from './dtos/update-user.input'
import { checkRowLevelPermission } from 'src/common/auth/util'
import type { GetUserType } from 'src/common/types'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { UserWhereUniqueInput } from './dtos/where.args'
import { Admin } from 'src/models/admins/graphql/entity/admin.entity'
import { Manager } from 'src/models/managers/graphql/entity/manager.entity'
import { Valet } from 'src/models/valets/graphql/entity/valet.entity'
import { Customer } from 'src/models/customers/graphql/entity/customer.entity'
import { ThrottlerGuard } from 'src/common/auth/throttle.guard'

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  // SECURITY NOTE: These endpoints are public and vulnerable to abuse
  // TODO: Add CAPTCHA verification (e.g., Google reCAPTCHA)
  // TODO: Add IP-based blocking for suspicious activity
  // TODO: Consider email verification before account activation
  @UseGuards(ThrottlerGuard)
  @Mutation(() => User)
  async registerWithCredentials(
    @Args('registerWithCredentialsInput')
    args: RegisterWithCredentialsInput,
    // @Context() context: any,
  ) {
    // console.log({args})
    // const req = context.req
    return this.usersService.registerWithCredentials(
      args,
      // req
    )
  }

  // SECURITY NOTE: These endpoints are public and vulnerable to abuse
  // TODO: Implement rate limiting (@UseGuards(ThrottlerGuard))
  // TODO: Add CAPTCHA verification (e.g., Google reCAPTCHA)
  // TODO: Add IP-based blocking for suspicious activity
  // TODO: Consider email verification before account activation
  @UseGuards(ThrottlerGuard)
  @Mutation(() => User)
  async registerWithProvider(
    @Args('registerWithProviderInput') args: RegisterWithProviderInput,
  ) {
    // console.log({args})
    return this.usersService.registerWithProvider(args)
  }

  @Mutation(() => LoginOutput)
  async login(
    @Args('loginInput') args: LoginInput,
    // @Context() context: any,
  ) {
    // const req = context.req
    return this.usersService.login(
      args,
      // req
    )
  }

  @AllowAuthenticated()
  @Query(() => User)
  whoami(@GetUser() user: GetUserType) {
    return this.usersService.findOne({ where: { uid: user.uid } })
  }

  @Query(() => [User], { name: 'users' })
  findAll(@Args() args: FindManyUserArgs) {
    return this.usersService.findAll(args)
  }

  @AllowAuthenticated()
  @Query(() => User, { name: 'user' })
  findOne(@Args() args: FindUniqueUserArgs, @GetUser() user: GetUserType) {
    // console.log({args: args})
    checkRowLevelPermission(user, args.where.uid)
    return this.usersService.findOne(args)
  }

  @AllowAuthenticated()
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') args: UpdateUserInput,
    @GetUser() user: GetUserType,
  ) {
    const userInfo = await this.prisma.user.findUnique({
      where: { uid: args.uid },
    })
    checkRowLevelPermission(user, userInfo.uid)
    return this.usersService.update(args)
  }

  @AllowAuthenticated()
  @Mutation(() => User)
  async removeUser(
    @Args() args: FindUniqueUserArgs,
    @GetUser() user: GetUserType,
  ) {
    const userInfo = await this.prisma.user.findUnique(args)
    checkRowLevelPermission(user, userInfo.uid)
    return this.usersService.remove(args)
  }

  @Query(() => AuthProvider, { name: 'getAuthProvider', nullable: true })
  getAuthProvider(@Args('uid') uid: string) {
    return this.prisma.authProvider.findUnique({ where: { uid } })
  }

  @ResolveField(() => Admin, { nullable: true })
  admin(@Parent() user: User) {
    return this.prisma.admin.findUnique({ where: { uid: user.uid } })
  }

  @ResolveField(() => Manager, { nullable: true })
  manager(@Parent() user: User) {
    return this.prisma.manager.findUnique({ where: { uid: user.uid } })
  }

  @ResolveField(() => Valet, { nullable: true })
  valet(@Parent() user: User) {
    return this.prisma.valet.findUnique({ where: { uid: user.uid } })
  }

  @ResolveField(() => Customer, { nullable: true })
  customer(@Parent() user: User) {
    return this.prisma.customer.findUnique({ where: { uid: user.uid } })
  }
}
