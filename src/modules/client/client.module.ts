import { Module } from '@nestjs/common'

import { UserController } from './controllers/user/user.controller'
import { UserService } from 'src/services/user/user.service'
import { PrismaService } from 'src/services/prisma.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class ClientModule {}
