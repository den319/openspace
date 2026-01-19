import {
  ArgsType,
  Field,
  registerEnumType,
  PartialType,
  Int,
} from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { CompanyOrderByWithRelationInput } from './order-by.args'
import { CompanyWhereInput, CompanyWhereUniqueInput } from './where.args'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

registerEnumType(Prisma.CompanyScalarFieldEnum, {
  name: 'CompanyScalarFieldEnum',
})

@ArgsType()
class FindManyCompanyArgsStrict
  implements
    RestrictProperties<
      FindManyCompanyArgsStrict,
      Omit<Prisma.CompanyFindManyArgs, 'include' | 'select'>
    >
{
  @Field(() => CompanyWhereInput, { nullable: true })
  where: CompanyWhereInput

  @Field(() => [CompanyOrderByWithRelationInput], { nullable: true })
  orderBy: CompanyOrderByWithRelationInput[]

  @Field(() => CompanyWhereUniqueInput, { nullable: true })
  cursor: CompanyWhereUniqueInput

  @Field(() => Int, { nullable: true })
  take: number

  @Field(() => Int, { nullable: true })
  skip: number

  @Field(() => [Prisma.CompanyScalarFieldEnum], { nullable: true })
  distinct: Prisma.CompanyScalarFieldEnum[]
}

@ArgsType()
export class FindManyCompanyArgs extends PartialType(
  FindManyCompanyArgsStrict,
) {}

@ArgsType()
export class FindUniqueCompanyArgs {
  @Field(() => CompanyWhereUniqueInput)
  @ValidateNested()
  @Type(() => CompanyWhereUniqueInput)
  where: CompanyWhereUniqueInput
}
