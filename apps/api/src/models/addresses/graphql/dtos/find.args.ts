import {
  ArgsType,
  Field,
  registerEnumType,
  PartialType,
  Int,
} from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { AddressOrderByWithRelationInput } from './order-by.args'
import { AddressWhereInput, AddressWhereUniqueInput } from './where.args'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

registerEnumType(Prisma.AddressScalarFieldEnum, {
  name: 'AddressScalarFieldEnum',
})

@ArgsType()
class FindManyAddressArgsStrict
  implements
    RestrictProperties<
      FindManyAddressArgsStrict,
      Omit<Prisma.AddressFindManyArgs, 'include' | 'select'>
    >
{
  @Field(() => AddressWhereInput)
  where: AddressWhereInput
  @Field(() => [AddressOrderByWithRelationInput])
  orderBy: AddressOrderByWithRelationInput[]
  @Field(() => AddressWhereUniqueInput)
  cursor: AddressWhereUniqueInput
  @Field(() => Int, { nullable: true })
  take: number
  @Field(() => Int, { nullable: true })
  skip: number
  @Field(() => [Prisma.AddressScalarFieldEnum])
  distinct: Prisma.AddressScalarFieldEnum[]
}

@ArgsType()
export class FindManyAddressArgs extends PartialType(
  FindManyAddressArgsStrict,
) {}

@ArgsType()
export class FindUniqueAddressArgs {
  @Field(() => AddressWhereUniqueInput)
  @ValidateNested()
  @Type(() => AddressWhereUniqueInput)
  where: AddressWhereUniqueInput
}
