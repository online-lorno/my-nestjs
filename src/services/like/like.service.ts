import { Injectable } from '@nestjs/common'

import { Like, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    likeWhereUniqueInput: Prisma.LikeWhereUniqueInput,
  ): Promise<Like | null> {
    return this.prisma.like.findUnique({
      where: likeWhereUniqueInput,
    })
  }

  async find(params: {
    skip?: number
    take?: number
    cursor?: Prisma.LikeWhereUniqueInput
    where?: Prisma.LikeWhereInput
    orderBy?: Prisma.LikeOrderByWithRelationInput
  }): Promise<Like[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.like.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async create(data: Prisma.LikeCreateInput): Promise<Like> {
    return this.prisma.like.create({
      data,
    })
  }

  async delete(where: Prisma.LikeWhereUniqueInput): Promise<Like> {
    return this.prisma.like.delete({
      where,
    })
  }
}
