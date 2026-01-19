import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'

export class UserEntity implements RestrictProperties<UserEntity, User> {
  @ApiProperty({ description: 'User unique identifier' })
  uid: string

  @ApiProperty({ description: 'User creation timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'User last update timestamp' })
  updatedAt: Date

  @ApiProperty({ required: false, description: 'User name' })
  @IsOptional()
  name: string

  @ApiProperty({ required: false, description: 'User image' })
  @IsOptional()
  image: string
}
