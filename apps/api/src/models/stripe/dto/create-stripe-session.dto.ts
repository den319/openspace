// import { TotalPrice } from '@openspace/util/types'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreateBookingInput } from 'src/models/bookings/graphql/dtos/create-booking.input'

export class TotalPrice {
  @ApiProperty()
  @IsNumber()
  parkingCharge: number

  @ApiProperty()
  @IsNumber()
  valetChargeDropoff: number

  @ApiProperty()
  @IsNumber()
  valetChargePickup: number
}

export class CreateStripeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uid: string

  @ApiProperty({ type: TotalPrice })
  @ValidateNested()
  @Type(() => TotalPrice)
  totalPriceObj: TotalPrice

  @ApiProperty({ type: CreateBookingInput })
  @ValidateNested()
  @Type(() => CreateBookingInput)
  bookingData: CreateBookingInput
}
