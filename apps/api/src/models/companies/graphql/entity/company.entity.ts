import { Field, ObjectType } from '@nestjs/graphql'
import { Company as CompanyType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class Company implements RestrictProperties<Company, CompanyType> {
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
}
