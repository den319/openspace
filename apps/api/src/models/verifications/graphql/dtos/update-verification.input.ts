import { CreateVerificationInput } from './create-verification.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Verification } from '@prisma/client'
import { IsInt, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class UpdateVerificationInput extends PartialType(
  CreateVerificationInput,
) {
  @Field(() => Number)
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  garageId: Verification['garageId']
}
