import {
  IsNumberString,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator'

export class PostParamsDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number
}

export class PostFindDto {
  @IsOptional()
  @IsNumberString()
  page?: number

  @IsOptional()
  @IsNumberString()
  limit?: number

  @IsOptional()
  @IsNumberString()
  authorId?: number
}

export class PostFindOneDto extends PostParamsDto {}

export class PostCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @IsBoolean()
  published?: boolean

  @IsNotEmpty()
  @IsNumberString()
  authorId: number
}

export class PostUpdateDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsBoolean()
  published?: boolean
}

export class PostDeleteDto extends PostParamsDto {}
