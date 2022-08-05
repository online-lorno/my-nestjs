import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common'

import { User } from '@prisma/client'
import { UserService } from '../../../../services/user/user.service'
import {
  UserParamsDto,
  UserFindDto,
  UserFindOneDto,
  UserCreateDto,
  UserUpdateDto,
  UserDeleteDto,
} from '../../dto/user.dto'

@Controller('admin/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async find(@Query() query: UserFindDto): Promise<User[]> {
    const users = await this.userService.find({
      ...(query?.page &&
        query?.limit && { skip: (+query.page - 1) * +query.limit }),
      ...(query?.limit && { take: +query.limit }),
    })
    return users
  }

  @Get(':id')
  async findOne(@Param() params: UserFindOneDto): Promise<User> {
    const user = await this.userService.findOne({
      id: +params.id,
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const user = await this.userService.create(body)
    return user
  }

  @Put(':id')
  async update(
    @Param() params: UserParamsDto,
    @Body() body: UserUpdateDto,
  ): Promise<User> {
    const user = await this.userService.findOne({
      id: +params.id,
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const updatedUser = await this.userService.update({
      where: {
        id: +params.id,
      },
      data: body,
    })
    return updatedUser
  }

  @Delete(':id')
  async delete(@Param() params: UserDeleteDto): Promise<User> {
    const user = await this.userService.findOne({
      id: +params.id,
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const deletedUser = await this.userService.delete({
      id: +params.id,
    })
    return deletedUser
  }
}
