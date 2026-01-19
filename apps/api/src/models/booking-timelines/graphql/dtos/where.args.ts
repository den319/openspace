import { Field, InputType, PartialType } from '@nestjs/graphql'
import { BookingStatus, Prisma } from '@prisma/client'
import { IsNotEmpty, IsNumber } from 'class-validator'
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingRelationFilter } from 'src/models/bookings/graphql/dtos/where.args'
import { ManagerRelationFilter } from 'src/models/managers/graphql/dtos/where.args'
import { ValetRelationFilter } from 'src/models/valets/graphql/dtos/where.args'

@InputType()
export class BookingTimelineWhereUniqueInput {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id: number
}

@InputType()
export class BookingTimelineWhereInputStrict
  implements
    RestrictProperties<
      BookingTimelineWhereInputStrict,
      Omit<Prisma.BookingTimelineWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  timestamp: DateTimeFilter
  @Field(() => BookingStatus)
  status: BookingStatus
  @Field(() => IntFilter, { nullable: true })
  bookingId: IntFilter
  @Field(() => StringFilter, { nullable: true })
  valetId: StringFilter
  @Field(() => StringFilter, { nullable: true })
  managerId: StringFilter
  @Field(() => BookingRelationFilter, { nullable: true })
  Booking: BookingRelationFilter
  @Field(() => ValetRelationFilter, { nullable: true })
  Valet: ValetRelationFilter
  @Field(() => ManagerRelationFilter, { nullable: true })
  Manager: ManagerRelationFilter

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class BookingTimelineWhereInput extends PartialType(
  BookingTimelineWhereInputStrict,
) {
  @Field(() => [BookingTimelineWhereInput], { nullable: true })
  AND?: BookingTimelineWhereInput[]

  @Field(() => [BookingTimelineWhereInput], { nullable: true })
  OR?: BookingTimelineWhereInput[]

  @Field(() => [BookingTimelineWhereInput], { nullable: true })
  NOT?: BookingTimelineWhereInput[]
}

@InputType()
export class BookingTimelineListRelationFilter {
  every?: BookingTimelineWhereInput
  some?: BookingTimelineWhereInput
  none?: BookingTimelineWhereInput
}

@InputType()
export class BookingTimelineRelationFilter {
  is?: BookingTimelineWhereInput
  isNot?: BookingTimelineWhereInput
}
