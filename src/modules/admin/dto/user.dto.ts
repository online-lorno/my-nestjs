import {
  IsNumberString,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator'

export class UserParamsDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number
}

export class UserFindDto {
  @IsOptional()
  @IsNumberString()
  page?: number

  @IsOptional()
  @IsNumberString()
  limit?: number
}

export class UserFindOneDto extends UserParamsDto {}

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  name: string
}

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  name?: string
}

export class UserDeleteDto extends UserParamsDto {}
