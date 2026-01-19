import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args'
import { VerificationListRelationFilter } from 'src/models/verifications/graphql/dtos/where.args'

@InputType()
export class AdminWhereUniqueInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uid: string
}

@InputType()
export class AdminWhereInputStrict
  implements
    RestrictProperties<
      AdminWhereInputStrict,
      Omit<Prisma.AdminWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => VerificationListRelationFilter, { nullable: true })
  Verifications: VerificationListRelationFilter
  @Field(() => StringFilter, { nullable: true })
  uid: StringFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => UserRelationFilter, { nullable: true })
  User: UserRelationFilter
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class AdminWhereInput extends PartialType(AdminWhereInputStrict) {
  @Field(() => [AdminWhereInput], { nullable: true })
  AND?: AdminWhereInput[]

  @Field(() => [AdminWhereInput], { nullable: true })
  OR?: AdminWhereInput[]

  @Field(() => [AdminWhereInput], { nullable: true })
  NOT?: AdminWhereInput[]
}

@InputType()
export class AdminListRelationFilter {
  every?: AdminWhereInput
  some?: AdminWhereInput
  none?: AdminWhereInput
}

@InputType()
export class AdminRelationFilter {
  is?: AdminWhereInput
  isNot?: AdminWhereInput
}
