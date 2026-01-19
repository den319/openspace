import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { GarageOrderByRelationAggregateInput } from 'src/models/garages/graphql/dtos/order-by.args'
import { ManagerOrderByRelationAggregateInput } from 'src/models/managers/graphql/dtos/order-by.args'
import { ValetOrderByRelationAggregateInput } from 'src/models/valets/graphql/dtos/order-by.args'

@InputType()
export class CompanyOrderByWithRelationInputStrict
  implements
    RestrictProperties<
      CompanyOrderByWithRelationInputStrict,
      Prisma.CompanyOrderByWithRelationInput
    >
{
  @Field(() => Prisma.SortOrder, { nullable: true })
  id: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  createdAt: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  updatedAt: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  displayName: Prisma.SortOrder

  @Field(() => Prisma.SortOrder, { nullable: true })
  description: Prisma.SortOrder

  @Field(() => GarageOrderByRelationAggregateInput, { nullable: true })
  Garages: GarageOrderByRelationAggregateInput

  @Field(() => ManagerOrderByRelationAggregateInput, { nullable: true })
  Managers: ManagerOrderByRelationAggregateInput

  @Field(() => ValetOrderByRelationAggregateInput, { nullable: true })
  Valets: ValetOrderByRelationAggregateInput
}

@InputType()
export class CompanyOrderByWithRelationInput extends PartialType(
  CompanyOrderByWithRelationInputStrict,
) {}

@InputType()
export class CompanyOrderByRelationAggregateInput {
  @Field(() => Prisma.SortOrder, { nullable: true })
  _count?: Prisma.SortOrder
}
