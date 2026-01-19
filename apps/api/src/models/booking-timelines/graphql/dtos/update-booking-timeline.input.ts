import { CreateBookingTimelineInput } from './create-booking-timeline.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { BookingTimeline } from '@prisma/client'
import { IsInt, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class UpdateBookingTimelineInput extends PartialType(
  CreateBookingTimelineInput,
) {
  @Field(() => Number)
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  id: BookingTimeline['id']
}
