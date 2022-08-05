import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { times } from 'ramda'

import { Comment, Like, Post, User, PrismaClient } from '@prisma/client'
import { LikeService } from './like.service'
import { generateComment } from '../comment/comment.service.spec'
import { generatePost } from '../post/post.service.spec'
import { generateUser } from '../user/user.service.spec'
import { PrismaModule } from '../../modules/prisma.module'

export interface GenerateLikeProps {
  user?: User
  post?: Post
  comment?: Comment
  type?: 'post' | 'comment'
}

export const generateLike = ({
  user,
  post,
  comment,
  type = 'post',
}: GenerateLikeProps): Like => {
  const newUser: User = generateUser()
  const newPost: Post = generatePost({ user: user ?? newUser })
  const newComment: Comment = generateComment({
    user: user ?? newUser,
    post: post ?? newPost,
  })
  const like: Like = {
    id: faker.datatype.number(),
    authorId: user ? user.id : newUser.id,
    postId: type === 'post' ? (post ? post.id : newPost.id) : null,
    commentId:
      type === 'comment' ? (comment ? comment.id : newComment.id) : null,
  }

  return like
}

describe('LikeService', () => {
  let service: LikeService
  const prismaClient = new PrismaClient()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)], // see dynamic import of `PrismaModule` with existing client
      providers: [LikeService],
    }).compile()

    service = module.get<LikeService>(LikeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    const like: Like = generateLike({})
    it('should return a single Like using id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => like)

      expect(
        await service.findOne({
          id: like.id,
        }),
      ).toBe(like)
    })
    it('should not return a single Like using wrong id', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async ({}) => null)

      expect(
        await service.findOne({
          id: faker.datatype.number(),
        }),
      ).toBe(null)
    })
  })

  describe('find', () => {
    const likes: Like[] = times(() => generateLike({}), 5)
    it('should return an array of Likes', async () => {
      jest.spyOn(service, 'find').mockImplementation(async ({}) => likes)

      expect(await service.find({})).toBe(likes)
    })
  })

  describe('create', () => {
    const like: Like = generateLike({})
    it('should create and return a single Like', async () => {
      jest.spyOn(service, 'create').mockImplementation(async ({}) => like)

      expect(
        await service.create({
          post: {
            connect: {
              id: like.postId as number,
            },
          },
          author: {
            connect: {
              id: like.authorId as number,
            },
          },
        }),
      ).toBe(like)
    })
  })

  describe('delete', () => {
    const like: Like = generateLike({})
    it('should delete and return a single Like using id', async () => {
      jest.spyOn(service, 'delete').mockImplementation(async ({}) => like)

      expect(
        await service.delete({
          id: like.id,
        }),
      ).toBe(like)
    })
  })
})
