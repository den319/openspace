import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { CustomerRelationFilter } from 'src/models/customers/graphql/dtos/where.args'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class ReviewWhereUniqueInput {
  id: number
}

@InputType()
export class ReviewWhereInputStrict
  implements
    RestrictProperties<
      ReviewWhereInputStrict,
      Omit<Prisma.ReviewWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => IntFilter, { nullable: true })
  rating: IntFilter
  @Field(() => StringFilter, { nullable: true })
  comment: StringFilter
  @Field(() => StringFilter, { nullable: true })
  customerId: StringFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => CustomerRelationFilter, { nullable: true })
  Customer: CustomerRelationFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class ReviewWhereInput extends PartialType(ReviewWhereInputStrict) {
  @Field(() => [ReviewWhereInput], { nullable: true })
  AND?: ReviewWhereInput[]

  @Field(() => [ReviewWhereInput], { nullable: true })
  OR?: ReviewWhereInput[]

  @Field(() => [ReviewWhereInput], { nullable: true })
  NOT?: ReviewWhereInput[]
}

@InputType()
export class ReviewListRelationFilter {
  every?: ReviewWhereInput
  some?: ReviewWhereInput
  none?: ReviewWhereInput
}

@InputType()
export class ReviewRelationFilter {
  is?: ReviewWhereInput
  isNot?: ReviewWhereInput
}
