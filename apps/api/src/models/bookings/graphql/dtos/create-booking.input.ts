import { Field, Float, InputType } from '@nestjs/graphql'
import { SlotType } from '@prisma/client'
import { CreateValetAssignmentInputWithoutBookingId } from 'src/models/valet-assignments/graphql/dtos/create-valet-assignment.input'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class CreateBookingInput {
  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId: string

  @Field(() => String)
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startTime: string

  @Field(() => String)
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endTime: string

  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleNumber: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string

  @Field(() => Number)
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  garageId: number

  @Field(() => SlotType)
  @ApiProperty({ enum: SlotType })
  @IsEnum(SlotType)
  @IsNotEmpty()
  type: SlotType

  @Field(() => Float, { nullable: true })
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  pricePerHour?: number

  @Field(() => Float, { nullable: true })
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalPrice?: number

  @Field(() => CreateValetAssignmentInputWithoutBookingId, { nullable: true })
  @ApiProperty({ required: false })
  @IsOptional()
  valetAssignment?: CreateValetAssignmentInputWithoutBookingId
}
