import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { times } from 'ramda'

import { Comment, Post, User, PrismaClient } from '@prisma/client'
import { CommentService } from './comment.service'
import { generatePost } from '../post/post.service.spec'
import { generateUser } from '../user/user.service.spec'
import { PrismaModule } from '../../modules/prisma.module'

export interface GenerateCommentProps {
  user?: User
  post?: Post
}

export const generateComment = ({
  user,
  post,
}: GenerateCommentProps): Comment => {
  const newUser: User = generateUser()
  const newPost: Post = generatePost({ user: user ?? newUser })
  const comment: Comment = {
    id: faker.datatype.number(),
    content: faker.lorem.paragraphs(),
    postId: post ? post.id : newPost.id,
    authorId: user ? user.id : newUser.id,
  }

  return comment
}

describe('CommentService', () => {
  let service: CommentService
  const prismaClient = new PrismaClient()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)], // see dynamic import of `PrismaModule` with existing client
      providers: [CommentService],
    }).compile()

    service = module.get<CommentService>(CommentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    const comment: Comment = generateComment({})
    it('should return a single Comment using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => comment)

      expect(
        await service.findOne({
          id: comment.id,
        }),
      ).toBe(comment)
    })
    it('should not return a single Comment using wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect(
        await service.findOne({
          id: faker.datatype.number(),
        }),
      ).toBe(null)
    })
  })

  describe('find', () => {
    const comments: Comment[] = times(() => generateComment({}), 5)
    it('should return an array of Comments', async () => {
      jest.spyOn(service, 'find').mockImplementation(async ({}) => comments)

      expect(await service.find({})).toBe(comments)
    })
  })

  describe('create', () => {
    const comment: Comment = generateComment({})
    it('should create and return a single Comment', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => comment)

      expect(
        await service.create({
          content: comment.content,
          post: {
            connect: {
              id: comment.postId as number,
            },
          },
          author: {
            connect: {
              id: comment.authorId as number,
            },
          },
        }),
      ).toBe(comment)
    })
  })

  describe('update', () => {
    const comment: Comment = generateComment({})
    it('should update and return a single Comment using id', async () => {
      jest.spyOn(service, 'update').mockImplementation(async ({}) => comment)

      expect(
        await service.update({
          where: {
            id: comment.id,
          },
          data: {
            content: comment.content,
          },
        }),
      ).toBe(comment)
    })
  })

  describe('delete', () => {
    const comment: Comment = generateComment({})
    it('should delete and return a single Comment using id', async () => {
      jest.spyOn(service, 'delete').mockImplementation(async ({}) => comment)

      expect(
        await service.delete({
          id: comment.id,
        }),
      ).toBe(comment)
    })
  })
})
