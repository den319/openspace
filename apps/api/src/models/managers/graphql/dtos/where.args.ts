import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingTimelineListRelationFilter } from 'src/models/booking-timelines/graphql/dtos/where.args'
import { CompanyRelationFilter } from 'src/models/companies/graphql/dtos/where.args'
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args'

@InputType()
export class ManagerWhereUniqueInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uid: string
}

@InputType()
export class ManagerWhereInputStrict
  implements
    RestrictProperties<
      ManagerWhereInputStrict,
      Omit<Prisma.ManagerWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => UserRelationFilter, { nullable: true })
  User: UserRelationFilter
  @Field(() => StringFilter, { nullable: true })
  uid: StringFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  displayName: StringFilter
  @Field(() => IntFilter, { nullable: true })
  companyId: IntFilter
  @Field(() => CompanyRelationFilter, { nullable: true })
  Company: CompanyRelationFilter
  @Field(() => BookingTimelineListRelationFilter, { nullable: true })
  BookingTimeline: BookingTimelineListRelationFilter
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class ManagerWhereInput extends PartialType(ManagerWhereInputStrict) {
  @Field(() => [ManagerWhereInput], { nullable: true })
  AND?: ManagerWhereInput[]

  @Field(() => [ManagerWhereInput], { nullable: true })
  OR?: ManagerWhereInput[]

  @Field(() => [ManagerWhereInput], { nullable: true })
  NOT?: ManagerWhereInput[]
}

@InputType()
export class ManagerListRelationFilter {
  every?: ManagerWhereInput
  some?: ManagerWhereInput
  none?: ManagerWhereInput
}

@InputType()
export class ManagerRelationFilter {
  is?: ManagerWhereInput
  isNot?: ManagerWhereInput
}
