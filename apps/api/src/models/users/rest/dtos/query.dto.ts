import { IsIn, IsOptional } from 'class-validator'
import { Prisma } from '@prisma/client'
import { BaseQueryDto } from 'src/common/dtos/common.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UserQueryDto extends BaseQueryDto {
  @ApiProperty({
    required: false,
    enum: Object.values(Prisma.UserScalarFieldEnum),
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsIn(Object.values(Prisma.UserScalarFieldEnum))
  sortBy?: string

  @ApiProperty({
    required: false,
    enum: Object.values(Prisma.UserScalarFieldEnum),
    description: 'Field to search by',
  })
  @IsOptional()
  @IsIn(Object.values(Prisma.UserScalarFieldEnum))
  searchBy?: string
}
