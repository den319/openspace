import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingListRelationFilter } from 'src/models/bookings/graphql/dtos/where.args'
import { ReviewListRelationFilter } from 'src/models/reviews/graphql/dtos/where.args'
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args'

@InputType()
export class CustomerWhereUniqueInput {
  uid: string
}

@InputType()
export class CustomerWhereInputStrict
  implements
    RestrictProperties<
      CustomerWhereInputStrict,
      Omit<Prisma.CustomerWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => UserRelationFilter, { nullable: true })
  User: UserRelationFilter
  @Field(() => StringFilter, { nullable: true })
  uid: StringFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  displayName: StringFilter
  @Field(() => BookingListRelationFilter, { nullable: true })
  Bookings: BookingListRelationFilter
  @Field(() => ReviewListRelationFilter, { nullable: true })
  Reviews: ReviewListRelationFilter

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class CustomerWhereInput extends PartialType(CustomerWhereInputStrict) {
  @Field(() => [CustomerWhereInput], { nullable: true })
  AND?: CustomerWhereInput[]

  @Field(() => [CustomerWhereInput], { nullable: true })
  OR?: CustomerWhereInput[]

  @Field(() => [CustomerWhereInput], { nullable: true })
  NOT?: CustomerWhereInput[]
}

@InputType()
export class CustomerListRelationFilter {
  every?: CustomerWhereInput
  some?: CustomerWhereInput
  none?: CustomerWhereInput
}

@InputType()
export class CustomerRelationFilter {
  is?: CustomerWhereInput
  isNot?: CustomerWhereInput
}
