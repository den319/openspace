import { CreateGarageInput } from './create-garage.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { Garage } from '@prisma/client'
import { IsInt, IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateGarageInput extends PartialType(CreateGarageInput) {
  @Field(() => Number)
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  id: Garage['id']
}
