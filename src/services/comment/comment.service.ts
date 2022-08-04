import { Injectable } from '@nestjs/common'

import { Comment, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    })
  }

  async find(params: {
    skip?: number
    take?: number
    cursor?: Prisma.CommentWhereUniqueInput
    where?: Prisma.CommentWhereInput
    orderBy?: Prisma.CommentOrderByWithRelationInput
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.CommentWhereUniqueInput
    data: Prisma.CommentUpdateInput
  }): Promise<Comment> {
    const { where, data } = params
    return this.prisma.comment.update({
      data,
      where,
    })
  }

  async delete(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    return this.prisma.comment.delete({
      where,
    })
  }
}
