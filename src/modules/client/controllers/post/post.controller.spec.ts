import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { times } from 'ramda'

import { Post, PrismaClient } from '@prisma/client'
import { PostController } from './post.controller'
import { PostService } from '../../../../services/post/post.service'
import { generatePost } from '../../../../services/post/post.service.spec'
import { PrismaModule } from '../../../prisma.module'

describe('PostController', () => {
  let controller: PostController
  let service: PostService
  const prismaClient = new PrismaClient()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)], // see dynamic import of `PrismaModule` with existing client
      controllers: [PostController],
      providers: [PostService],
    }).compile()

    controller = module.get<PostController>(PostController)
    service = module.get<PostService>(PostService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

  describe('GET /client/post', () => {
    const posts: Post[] = times(() => generatePost({}), 5)
    it('should return an array of Posts', async () => {
      jest.spyOn(service, 'find').mockImplementation(async ({}) => posts)

      expect(
        await controller.find({
          page: 1,
          limit: 10,
        }),
      ).toBe(posts)
    })
  })

  describe('GET /client/post/:id', () => {
    const post: Post = generatePost({})
    it('should return a single Post using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => post)

      expect(await controller.findOne({ id: post.id })).toBe(post)
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
          message: 'Post not found',
          error: 'Not Found',
        })
      }
    })
  })

  describe('POST /client/post', () => {
    const post: Post = generatePost({})
    it('should create and return a single Post', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => post)

      expect(
        await controller.create({
          title: post.title,
          content: post.content as string,
          published: post.published as boolean,
          authorId: post.authorId as number,
        }),
      ).toBe(post)
    })
  })

  describe('PUT /client/post/:id', () => {
    const post: Post = generatePost({})
    it('should update and return a single Post using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => post)
      jest.spyOn(service, 'update').mockImplementation(async ({}) => post)

      expect(
        await controller.update(
          {
            id: post.id,
          },
          {
            title: post.title,
            content: post.content as string,
            published: post.published as boolean,
          },
        ),
      ).toBe(post)
    })
    it('should return an error using a wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect.assertions(2)
      try {
        await controller.update(
          { id: faker.datatype.number() },
          {
            title: post.title,
            content: post.content as string,
            published: post.published as boolean,
          },
        )
      } catch (error) {
        expect(error.status).toBe(404)
        expect(error.response).toMatchObject({
          statusCode: 404,
          message: 'Post not found',
          error: 'Not Found',
        })
      }
    })
  })

  describe('DELETE /client/post/:id', () => {
    const post: Post = generatePost({})
    it('should delete and return a single Post using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => post)
      jest.spyOn(service, 'delete').mockImplementation(async ({}) => post)

      expect(
        await controller.delete({
          id: post.id,
        }),
      ).toBe(post)
    })
    it('should return an error using a wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect.assertions(2)
      try {
        await controller.delete({ id: faker.datatype.number() })
      } catch (error) {
        expect(error.status).toBe(404)
        expect(error.response).toMatchObject({
          statusCode: 404,
          message: 'Post not found',
          error: 'Not Found',
        })
      }
    })
  })
})
