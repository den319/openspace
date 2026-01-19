import { InputType, ObjectType, PickType, Field } from '@nestjs/graphql'
import { FindManyGarageArgs } from './find.args'
import { Slot } from 'src/models/slots/graphql/entity/slot.entity'
import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class DateFilterInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  start: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  end: string
}

@InputType()
export class GarageFilter extends PickType(
  FindManyGarageArgs,
  ['where', 'orderBy', 'skip', 'take'],
  InputType,
) {}

@ObjectType()
export class MinimalSlotGroupBy extends PickType(Slot, [
  'type',
  'pricePerHour',
]) {
  @Field(() => Number)
  count: number
}
