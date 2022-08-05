import { IsNumberString, IsNotEmpty } from 'class-validator'

export class UserParamsDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number
}

export class UserFindOneDto extends UserParamsDto {}
