import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator'

@InputType()
export class CreateVerificationInput {
  @Field(() => Boolean, { nullable: true })
  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  verified?: boolean

  @Field(() => Number)
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  garageId: number
}
