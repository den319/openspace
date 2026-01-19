import { Field, ObjectType } from '@nestjs/graphql'
import { Garage as GarageType, SlotType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class Garage implements RestrictProperties<Garage, GarageType> {
  @Field(() => Number)
  id: number

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String, { nullable: true })
  displayName: string

  @Field(() => String, { nullable: true })
  description: string

  @Field(() => [String])
  images: string[]

  @Field(() => Number)
  companyId: number
}

@ObjectType()
export class SlotTypeCount {
  @Field(() => SlotType)
  type: SlotType

  @Field(() => Number, { nullable: true })
  count?: number
}
