import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateAdminInput {
  @Field(() => String)
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  uid: string
}
