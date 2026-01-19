import { Field, ObjectType } from '@nestjs/graphql'
import { Valet as ValetType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class Valet implements RestrictProperties<Valet, ValetType> {
  @Field(() => String)
  uid: string
  @Field(() => Date)
  createdAt: Date
  @Field(() => Date)
  updatedAt: Date
  @Field(() => String)
  displayName: string
  @Field({ nullable: true })
  image: string
  @Field(() => String)
  licenceID: string
  @Field({ nullable: true })
  companyId: number
}
