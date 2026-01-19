import { Field, ObjectType } from '@nestjs/graphql'
import { Verification as VerificationType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class Verification
  implements RestrictProperties<Verification, VerificationType>
{
  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Boolean)
  verified: boolean

  @Field(() => String)
  adminId: string

  @Field(() => Number)
  garageId: number
}
