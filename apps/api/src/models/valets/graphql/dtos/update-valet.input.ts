import { CreateValetInput } from './create-valet.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Valet } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class UpdateValetInput extends PartialType(CreateValetInput) {
  @Field(() => String)
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  uid: Valet['uid']
}
