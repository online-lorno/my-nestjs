import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { AdminModule } from '~/modules/admin/admin.module'
import { ClientModule } from '~/modules/client/client.module'

@Module({
  imports: [ConfigModule.forRoot(), AdminModule, ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
