import { Field, ObjectType } from '@nestjs/graphql'
import {
  BookingStatus,
  BookingTimeline as BookingTimelineType,
} from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class BookingTimeline
  implements RestrictProperties<BookingTimeline, BookingTimelineType>
{
  @Field(() => Number)
  id: number

  @Field(() => Date)
  timestamp: Date

  @Field(() => BookingStatus)
  status: BookingStatus

  @Field(() => Number)
  bookingId: number

  @Field(() => String, { nullable: true })
  valetId: string

  @Field(() => String, { nullable: true })
  managerId: string
}
