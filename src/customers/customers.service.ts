import { Injectable } from '@nestjs/common'

@Injectable()
export class CustomersService {
  getCustomers(): string[] {
    return ['customer 1', 'customer 2']
  }
}
