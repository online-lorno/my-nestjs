import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { times } from 'ramda'

import { User, PrismaClient } from '@prisma/client'
import { UserService } from './user.service'
import { PrismaModule } from '../../modules/prisma.module'

export const generateUser = (): User => {
  const userFirstName = faker.name.firstName()
  const userEmail = faker.internet.email(userFirstName)
  const user: User = {
    id: faker.datatype.number(),
    name: faker.name.findName(userFirstName),
    email: userEmail,
  }

  return user
}

describe('UserService', () => {
  let service: UserService
  const prismaClient = new PrismaClient()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)], // see dynamic import of `PrismaModule` with existing client
      providers: [UserService],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    const user: User = generateUser()
    it('should return a single User using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => user)

      expect(
        await service.findOne({
          id: user.id,
        }),
      ).toBe(user)
    })
    it('should not return a single User using wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect(
        await service.findOne({
          id: faker.datatype.number(),
        }),
      ).toBe(null)
    })
  })

  describe('find', () => {
    const users: User[] = times(generateUser, 5)
    it('should return an array of Users', async () => {
      jest.spyOn(service, 'find').mockImplementation(async ({}) => users)

      expect(await service.find({})).toBe(users)
    })
  })

  describe('create', () => {
    const user: User = generateUser()
    it('should create and return a single User', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => user)

      expect(
        await service.create({
          email: user.email,
          name: user.name,
        }),
      ).toBe(user)
    })
  })

  describe('update', () => {
    const user: User = generateUser()
    it('should update and return a single User using id', async () => {
      jest.spyOn(service, 'update').mockImplementation(async ({}) => user)

      expect(
        await service.update({
          where: {
            id: user.id,
          },
          data: {
            email: user.email,
            name: user.name,
          },
        }),
      ).toBe(user)
    })
  })

  describe('delete', () => {
    const user: User = generateUser()
    it('should delete and return a single User using id', async () => {
      jest.spyOn(service, 'delete').mockImplementation(async ({}) => user)

      expect(
        await service.delete({
          id: user.id,
        }),
      ).toBe(user)
    })
  })
})
