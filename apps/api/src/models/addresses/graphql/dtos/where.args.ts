import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { IsInt, IsNotEmpty } from 'class-validator'
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class AddressWhereUniqueInput {
  @Field(() => Number)
  @IsInt()
  @IsNotEmpty()
  id: number
}

@InputType()
export class AddressWhereInputStrict
  implements
    RestrictProperties<
      AddressWhereInputStrict,
      Omit<Prisma.AddressWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  address: StringFilter
  @Field(() => FloatFilter, { nullable: true })
  lat: FloatFilter
  @Field(() => FloatFilter, { nullable: true })
  lng: FloatFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class AddressWhereInput extends PartialType(AddressWhereInputStrict) {
  @Field(() => [AddressWhereInput], { nullable: true })
  AND?: AddressWhereInput[]

  @Field(() => [AddressWhereInput], { nullable: true })
  OR?: AddressWhereInput[]

  @Field(() => [AddressWhereInput], { nullable: true })
  NOT?: AddressWhereInput[]
}

@InputType()
export class AddressListRelationFilter {
  @Field(() => AddressWhereInput, { nullable: true })
  every?: AddressWhereInput
  @Field(() => AddressWhereInput, { nullable: true })
  some?: AddressWhereInput
  @Field(() => AddressWhereInput, { nullable: true })
  none?: AddressWhereInput
}

@InputType()
export class AddressRelationFilter {
  @Field(() => AddressWhereInput, { nullable: true })
  is?: AddressWhereInput
  @Field(() => AddressWhereInput, { nullable: true })
  isNot?: AddressWhereInput
}
