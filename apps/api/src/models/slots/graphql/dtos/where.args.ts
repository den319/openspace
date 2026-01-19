import {
  Field,
  InputType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql'
import { $Enums, Prisma, SlotType } from '@prisma/client'
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingListRelationFilter } from 'src/models/bookings/graphql/dtos/where.args'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

registerEnumType(SlotType, {
  name: 'SlotType',
})

@InputType()
export class SlotWhereUniqueInput {
  id: number
}

@InputType()
export class EnumSlotTypeFilter {
  @Field(() => SlotType, { nullable: true })
  equals: SlotType;
  @Field(() => [SlotType], { nullable: true })
  in: SlotType[]
  @Field(() => [SlotType], { nullable: true })
  notIn: SlotType[]
  @Field(() => SlotType, { nullable: true })
  not: SlotType
}

@InputType()
export class SlotWhereInputStrict
  implements
    RestrictProperties<
      SlotWhereInputStrict,
      Omit<Prisma.SlotWhereInput, 'AND' | 'OR' | 'NOT'>
    >
{
  id: IntFilter
  createdAt: DateTimeFilter
  updatedAt: DateTimeFilter
  displayName: StringFilter
  pricePerHour: FloatFilter
  length: IntFilter
  width: IntFilter
  height: IntFilter

  type: EnumSlotTypeFilter
  garageId: IntFilter
  Garage: GarageRelationFilter
  Bookings: BookingListRelationFilter
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  // AND: any[]
  // OR: any[]
  // NOT: any[]
}

@InputType()
export class SlotWhereInput extends PartialType(SlotWhereInputStrict) {
  @Field(() => [SlotWhereInput], { nullable: true })
  AND?: SlotWhereInput[]

  @Field(() => [SlotWhereInput], { nullable: true })
  OR?: SlotWhereInput[]

  @Field(() => [SlotWhereInput], { nullable: true })
  NOT?: SlotWhereInput[]
}

@InputType()
export class SlotListRelationFilter {
  every?: SlotWhereInput
  some?: SlotWhereInput
  none?: SlotWhereInput
}

@InputType()
export class SlotRelationFilter {
  is?: SlotWhereInput
  isNot?: SlotWhereInput
}
