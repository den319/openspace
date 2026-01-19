import { Field, ObjectType } from '@nestjs/graphql'
import { Address as AddressType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class Address implements RestrictProperties<Address, AddressType> {
  @Field(() => Number)
  id: number

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String)
  address: string

  @Field(() => Number)
  lat: number

  @Field(() => Number)
  lng: number

  @Field(() => Number)
  garageId: number
}
