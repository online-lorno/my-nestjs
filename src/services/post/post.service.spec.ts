import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { times } from 'ramda'

import { Post, User, PrismaClient } from '@prisma/client'
import { PostService } from './post.service'
import { generateUser } from '../user/user.service.spec'
import { PrismaModule } from '../../modules/prisma.module'

export const generatePost = (): Post => {
  const user: User = generateUser()
  const post: Post = {
    id: faker.datatype.number(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    authorId: user.id,
    published: true,
  }

  return post
}

describe('PostService', () => {
  let service: PostService
  const prismaClient = new PrismaClient()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)], // see dynamic import of `PrismaModule` with existing client
      providers: [PostService],
    }).compile()

    service = module.get<PostService>(PostService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    const post: Post = generatePost()
    it('should return a single Post using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => post)

      expect(
        await service.findOne({
          id: post.id,
        }),
      ).toBe(post)
    })
    it('should not return a single Post using wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect(
        await service.findOne({
          id: faker.datatype.number(),
        }),
      ).toBe(null)
    })
  })

  describe('find', () => {
    const posts: Post[] = times(generatePost, 5)
    it('should return an array of Posts', async () => {
      jest.spyOn(service, 'find').mockImplementation(async ({}) => posts)

      expect(await service.find({})).toBe(posts)
    })
  })

  describe('create', () => {
    const post: Post = generatePost()
    it('should create and return a single Post', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => post)

      expect(
        await service.create({
          title: post.title,
          content: post.content,
          author: {
            connect: {
              id: post.authorId as number,
            },
          },
          published: post.published,
        }),
      ).toBe(post)
    })
  })

  describe('update', () => {
    const post: Post = generatePost()
    const updatedPost: Post = {
      ...post,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
    }
    it('should create and return a single Post', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => post)

      expect(
        await service.create({
          title: post.title,
          content: post.content,
          author: {
            connect: {
              id: post.authorId as number,
            },
          },
          published: post.published,
        }),
      ).toBe(post)
    })
    it('should update and return a single Post using id', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async ({}) => updatedPost)

      expect(
        await service.update({
          where: {
            id: post.id,
          },
          data: {
            title: updatedPost.title,
            content: updatedPost.content,
          },
        }),
      ).toBe(updatedPost)
    })
  })

  describe('delete', () => {
    const post: Post = generatePost()
    it('should create and return a single Post', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => post)

      expect(
        await service.create({
          title: post.title,
          content: post.content,
          author: {
            connect: {
              id: post.authorId as number,
            },
          },
          published: post.published,
        }),
      ).toBe(post)
    })
    it('should delete and return a single Post using id', async () => {
      jest.spyOn(service, 'delete').mockImplementation(async ({}) => post)

      expect(
        await service.delete({
          id: post.id,
        }),
      ).toBe(post)
    })
  })
})
