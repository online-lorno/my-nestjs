import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { User, PrismaClient } from '@prisma/client'
import { UserController } from './user.controller'
import { UserService } from '../../../../services/user/user.service'
import { generateUser } from '../../../../services/user/user.service.spec'
import { PrismaModule } from '../../../prisma.module'

describe('UserController', () => {
  let controller: UserController
  let service: UserService
  const prismaClient = new PrismaClient()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)], // see dynamic import of `PrismaModule` with existing client
      controllers: [UserController],
      providers: [UserService],
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

  describe('GET /client/user/:id', () => {
    const user: User = generateUser()
    it('should return a single User using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => user)

      expect(await controller.findOne({ id: user.id })).toBe(user)
    })
    it('should return an error using a wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect.assertions(2)
      try {
        await controller.findOne({ id: faker.datatype.number() })
      } catch (error) {
        expect(error.status).toBe(404)
        expect(error.response).toMatchObject({
          statusCode: 404,
          message: 'User not found',
          error: 'Not Found',
        })
      }
    })
  })
})
