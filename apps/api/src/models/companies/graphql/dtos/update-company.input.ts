import { CreateCompanyInput } from './create-company.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { Company } from '@prisma/client'
import { IsInt, IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @Field(() => Number)
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: Company['id']
}
