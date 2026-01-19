import { Field, InputType, OmitType, PickType } from '@nestjs/graphql'
import { Address } from '../entity/address.entity'
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

@InputType()
export class CreateAddressInput extends OmitType(
  Address,
  ['createdAt', 'updatedAt', 'id'],
  InputType,
) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  address: string

  @Field(() => Number)
  @IsNumber()
  @IsLatitude()
  lat: number

  @Field(() => Number)
  @IsNumber()
  @IsLongitude()
  lng: number

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  garageId: number
}

@InputType()
export class CreateAddressInputWithoutGarageId extends PickType(
  CreateAddressInput,
  ['address', 'lat', 'lng'],
  InputType,
) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  address: string

  @Field(() => Number)
  @IsNumber()
  @IsLatitude()
  lat: number

  @Field(() => Number)
  @IsNumber()
  @IsLongitude()
  lng: number
}
