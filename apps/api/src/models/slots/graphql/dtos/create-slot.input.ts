import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { SlotType } from '@prisma/client'
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class CreateSlotInput {
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  displayName?: string

  @Field(() => Float)
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pricePerHour: number

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  length?: number

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  width?: number

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  height?: number

  @Field(() => SlotType)
  @ApiProperty({ enum: SlotType })
  @IsEnum(SlotType)
  @IsNotEmpty()
  type: SlotType

  @Field(() => Int)
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  garageId: number
}

@InputType()
export class CreateSlotInputWithoutGarageId {
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  displayName?: string

  @Field(() => Float)
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pricePerHour: number

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  length?: number

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  width?: number

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  height?: number

  @Field(() => SlotType)
  @ApiProperty({ enum: SlotType })
  @IsEnum(SlotType)
  @IsNotEmpty()
  type: SlotType

  @Field(() => Int)
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  count: number
}
