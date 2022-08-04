import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CustomersController } from './customers/customers.controller'
import { CustomersService } from './customers/customers.service'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, CustomersController],
  providers: [AppService, CustomersService],
})
export class AppModule {}
