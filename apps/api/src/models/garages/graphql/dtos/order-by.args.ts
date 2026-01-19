import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { AddressOrderByWithRelationInput } from 'src/models/addresses/graphql/dtos/order-by.args'
import { CompanyOrderByWithRelationInput } from 'src/models/companies/graphql/dtos/order-by.args'
import { ReviewOrderByRelationAggregateInput } from 'src/models/reviews/graphql/dtos/order-by.args'
import { SlotOrderByRelationAggregateInput } from 'src/models/slots/graphql/dtos/order-by.args'
import { VerificationOrderByWithRelationInput } from 'src/models/verifications/graphql/dtos/order-by.args'

@InputType()
export class GarageOrderByWithRelationInputStrict
  implements
    RestrictProperties<
      GarageOrderByWithRelationInputStrict,
      Prisma.GarageOrderByWithRelationInput
    >
{
  @Field(() => Prisma.SortOrder)
  id: Prisma.SortOrder
  @Field(() => Prisma.SortOrder)
  createdAt: Prisma.SortOrder
  @Field(() => Prisma.SortOrder)
  updatedAt: Prisma.SortOrder
  @Field(() => Prisma.SortOrder)
  displayName: Prisma.SortOrder
  @Field(() => Prisma.SortOrder)
  description: Prisma.SortOrder
  @Field(() => Prisma.SortOrder)
  images: Prisma.SortOrder
  @Field(() => Prisma.SortOrder)
  companyId: Prisma.SortOrder
  @Field(() => CompanyOrderByWithRelationInput)
  Company: CompanyOrderByWithRelationInput

  @Field(() => AddressOrderByWithRelationInput)
  Address: AddressOrderByWithRelationInput

  @Field(() => VerificationOrderByWithRelationInput)
  Verification: VerificationOrderByWithRelationInput

  @Field(() => ReviewOrderByRelationAggregateInput)
  Reviews: ReviewOrderByRelationAggregateInput

  @Field(() => SlotOrderByRelationAggregateInput)
  Slots: SlotOrderByRelationAggregateInput
  // Todo: Add below field decorator to the SortOrder properties.
  // @Field(() => Prisma.SortOrder)
}

@InputType()
export class GarageOrderByWithRelationInput extends PartialType(
  GarageOrderByWithRelationInputStrict,
) {}

@InputType()
export class GarageOrderByRelationAggregateInput {
  @Field(() => Prisma.SortOrder)
  _count?: Prisma.SortOrder
}
