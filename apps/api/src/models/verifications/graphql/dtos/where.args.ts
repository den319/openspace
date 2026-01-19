import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { IsNotEmpty, IsNumber } from 'class-validator'
import {
  BoolFilter,
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { AdminRelationFilter } from 'src/models/admins/graphql/dtos/where.args'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class VerificationWhereUniqueInput {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  garageId: number
}

@InputType()
export class VerificationWhereInputStrict
  implements
    RestrictProperties<
      VerificationWhereInputStrict,
      Omit<Prisma.VerificationWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => BoolFilter, { nullable: true })
  verified: BoolFilter
  @Field(() => StringFilter, { nullable: true })
  adminId: StringFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => AdminRelationFilter, { nullable: true })
  Admin: AdminRelationFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class VerificationWhereInput extends PartialType(
  VerificationWhereInputStrict,
) {
  @Field(() => [VerificationWhereInput], { nullable: true })
  AND?: VerificationWhereInput[]

  @Field(() => [VerificationWhereInput], { nullable: true })
  OR?: VerificationWhereInput[]

  @Field(() => [VerificationWhereInput], { nullable: true })
  NOT?: VerificationWhereInput[]
}

@InputType()
export class VerificationListRelationFilter {
  every?: VerificationWhereInput
  some?: VerificationWhereInput
  none?: VerificationWhereInput
}

@InputType()
export class VerificationRelationFilter {
  is?: VerificationWhereInput
  isNot?: VerificationWhereInput
}
