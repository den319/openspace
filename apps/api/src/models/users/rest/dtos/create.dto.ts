import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { UserEntity } from '../entity/user.entity'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUser {
  @ApiProperty({ description: 'User unique identifier' })
  @IsString()
  @IsNotEmpty()
  uid: string

  @ApiPropertyOptional({ description: 'User name' })
  @IsString()
  @IsOptional()
  name?: string
}
