import { Injectable } from '@nestjs/common'

@Injectable()
export class CustomersService {
  async getCustomers(): Promise<string[]> {
    return ['customer 1', 'customer 2']
  }
}
