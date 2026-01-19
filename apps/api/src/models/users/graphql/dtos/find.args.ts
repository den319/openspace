import {
  ArgsType,
  Field,
  registerEnumType,
  PartialType,
  Int,
} from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { UserOrderByWithRelationInput } from './order-by.args'
import { UserWhereInput, UserWhereUniqueInput } from './where.args'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
// import { DefaultArgs } from '@prisma/client/runtime/client'

registerEnumType(Prisma.UserScalarFieldEnum, {
  name: 'UserScalarFieldEnum',
})

@ArgsType()
class FindManyUserArgsStrict
  implements
    RestrictProperties<
      FindManyUserArgsStrict,
      Omit<Prisma.UserFindManyArgs, 'include' | 'select'>
    >
{
  @Field(() => UserWhereInput)
  where: UserWhereInput
  @Field(() => [UserOrderByWithRelationInput])
  orderBy: UserOrderByWithRelationInput[]
  @Field(() => UserWhereUniqueInput)
  cursor: UserWhereUniqueInput
  @Field(() => Int, { nullable: true })
  take: number
  @Field(() => Int, { nullable: true })
  skip: number
  @Field(() => [Prisma.UserScalarFieldEnum])
  distinct: Prisma.UserScalarFieldEnum[]
}

@ArgsType()
export class FindManyUserArgs extends PartialType(FindManyUserArgsStrict) {}

@ArgsType()
export class FindUniqueUserArgs {
  @Field(() => UserWhereUniqueInput)
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  where: UserWhereUniqueInput
}
