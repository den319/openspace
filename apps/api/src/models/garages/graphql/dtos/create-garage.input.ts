import { Field, InputType, PickType } from '@nestjs/graphql'
import { Garage } from '../entity/garage.entity'
import { CreateAddressInputWithoutGarageId } from 'src/models/addresses/graphql/dtos/create-address.input'
import { CreateSlotInputWithoutGarageId } from 'src/models/slots/graphql/dtos/create-slot.input'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class CreateGarageInput {
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  displayName?: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string

  @Field(() => [String], { nullable: true })
  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]

  @Field(() => CreateAddressInputWithoutGarageId)
  @ApiProperty({ type: CreateAddressInputWithoutGarageId })
  @ValidateNested()
  @Type(() => CreateAddressInputWithoutGarageId)
  @IsNotEmpty()
  Address: CreateAddressInputWithoutGarageId

  @Field(() => [CreateSlotInputWithoutGarageId])
  @ApiProperty({ type: [CreateSlotInputWithoutGarageId] })
  @ValidateNested({ each: true })
  @Type(() => CreateSlotInputWithoutGarageId)
  @IsArray()
  @IsNotEmpty()
  Slots: CreateSlotInputWithoutGarageId[]
}
