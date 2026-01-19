import {
  Field,
  InputType,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql'
import { User } from '../entity/user.entity'
import { AuthProviderType } from '@prisma/client'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

registerEnumType(AuthProviderType, {
  name: 'AuthProviderType',
})

@InputType()
export class RegisterWithProviderInput extends PickType(
  User,
  ['uid', 'name', 'image'],
  InputType,
) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uid: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  image: string

  @Field(() => AuthProviderType)
  @IsNotEmpty()
  type: AuthProviderType
}

@InputType()
export class RegisterWithCredentialsInput extends PickType(
  User,
  ['name'],
  InputType,
) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  image?: string
  // @Field(() => String)
  // @IsString()
  // @IsNotEmpty()
  // captchaToken: string
}

@InputType()
export class LoginInput extends PickType(RegisterWithCredentialsInput, [
  'email',
  'password',
]) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email: string
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  token: string

  user: User
}
