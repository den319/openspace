import { Field, InputType, PartialType } from '@nestjs/graphql'
import { User } from '../entity/user.entity'
import { User as PrismaUser } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class UpdateUserInput extends PartialType(User) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uid: PrismaUser['uid']
}
