import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@InputType()
export class CreateCompanyInput {
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  displayName?: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string

  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerId: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  managerName?: string
}
