import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator'

@InputType()
export class CreateValetInput {
  @Field(() => String)
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  uid: string

  @Field(() => String)
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  displayName: string

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string

  @Field(() => String)
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  licenceID: string

  @Field(() => Number, { nullable: true })
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  companyId?: number
}
