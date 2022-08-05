import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { times } from 'ramda'

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

  describe('GET /admin/user', () => {
    const users: User[] = times(() => generateUser(), 5)
    it('should return an array of Users', async () => {
      jest.spyOn(service, 'find').mockImplementation(async ({}) => users)

      expect(
        await controller.find({
          page: 1,
          limit: 10,
        }),
      ).toBe(users)
    })
  })

  describe('GET /admin/user/:id', () => {
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

  describe('POST /admin/user', () => {
    const user: User = generateUser()
    it('should create and return a single User', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => user)

      expect(
        await controller.create({
          email: user.email,
          name: user.name as string,
        }),
      ).toBe(user)
    })
  })

  describe('PUT /admin/user/:id', () => {
    const user: User = generateUser()
    const updatedUser: User = {
      ...user,
      email: faker.internet.email(),
      name: faker.name.findName(),
    }
    it('should create and return a single User', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => user)

      expect(
        await controller.create({
          email: user.email,
          name: user.name as string,
        }),
      ).toBe(user)
    })
    it('should update and return a single User using id', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async ({}) => updatedUser)

      expect(
        await controller.update(
          {
            id: user.id,
          },
          {
            email: updatedUser.email,
            name: updatedUser.name as string,
          },
        ),
      ).toBe(updatedUser)
    })
  })

  describe('DELETE /admin/user/:id', () => {
    const user: User = generateUser()
    it('should create and return a single User', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => user)

      expect(
        await controller.create({
          email: user.email,
          name: user.name as string,
        }),
      ).toBe(user)
    })
    it('should delete and return a single User using id', async () => {
      jest.spyOn(service, 'delete').mockImplementation(async ({}) => user)

      expect(
        await controller.delete({
          id: user.id,
        }),
      ).toBe(user)
    })
  })
})
