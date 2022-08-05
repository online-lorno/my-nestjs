import { Controller, Get, Param, NotFoundException } from '@nestjs/common'

import { User } from '@prisma/client'
import { UserService } from '../../../../services/user/user.service'
import { UserFindOneDto } from '../../dto/user.dto'

@Controller('client/user')
export class UserController {
  constructor(private userService: UserService) {}

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
}
