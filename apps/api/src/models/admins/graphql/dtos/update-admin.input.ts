import { CreateAdminInput } from './create-admin.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Admin } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class UpdateAdminInput extends PartialType(CreateAdminInput) {
  @Field(() => String)
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  uid: Admin['uid']
}
