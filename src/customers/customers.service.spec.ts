import { Test, TestingModule } from '@nestjs/testing'
import { CustomersService } from './customers.service'

describe('CustomerService', () => {
  let service: CustomersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService],
    }).compile()

    service = module.get<CustomersService>(CustomersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCustomers', () => {
    it('should return an array of customers', async () => {
      expect(await service.getCustomers()).toBeTruthy()
    })
  })
})
