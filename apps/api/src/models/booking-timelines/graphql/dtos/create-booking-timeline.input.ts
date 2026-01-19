import { Field, InputType } from '@nestjs/graphql'
import { BookingStatus } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsInt } from 'class-validator'

@InputType()
export class CreateBookingTimelineInput {
  @Field(() => Number)
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  bookingId: number

  @Field(() => BookingStatus)
  @ApiProperty({ required: true, enum: BookingStatus })
  @IsNotEmpty()
  status: BookingStatus
}
