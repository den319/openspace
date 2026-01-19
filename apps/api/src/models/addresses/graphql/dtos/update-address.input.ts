import { Field, InputType, PartialType, Int } from '@nestjs/graphql'
import { Address as PrismaAddress } from '@prisma/client'
import { IsInt, IsNotEmpty } from 'class-validator'
import { CreateAddressInput } from './create-address.input'

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: PrismaAddress['id']
}
