import { IsIn, IsOptional } from 'class-validator'
import { Prisma } from '@prisma/client'
import { BaseQueryDto } from 'src/common/dtos/common.dto'
import { ApiProperty } from '@nestjs/swagger'

export class AdminQueryDto extends BaseQueryDto {
  @ApiProperty({
    required: false,
    enum: Object.values(Prisma.AdminScalarFieldEnum),
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsIn(Object.values(Prisma.AdminScalarFieldEnum))
  sortBy?: string

  @ApiProperty({
    required: false,
    enum: Object.values(Prisma.AdminScalarFieldEnum),
    description: 'Field to search by',
  })
  @IsOptional()
  @IsIn(Object.values(Prisma.AdminScalarFieldEnum))
  searchBy?: string
}
