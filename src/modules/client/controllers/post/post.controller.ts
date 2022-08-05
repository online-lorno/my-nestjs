import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common'

import { Post as PostModel } from '@prisma/client'
import { PostService } from '../../../../services/post/post.service'
import {
  PostParamsDto,
  PostFindDto,
  PostFindOneDto,
  PostCreateDto,
  PostUpdateDto,
  PostDeleteDto,
} from '../../dto/post.dto'

@Controller('client/post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async find(@Query() query: PostFindDto): Promise<PostModel[]> {
    const posts = await this.postService.find({
      ...(query?.page &&
        query?.limit && { skip: (+query.page - 1) * +query.limit }),
      ...(query?.limit && { take: +query.limit }),
      where: {
        ...(query?.authorId && { authorId: +query.authorId }),
      },
    })
    return posts
  }

  @Get(':id')
  async findOne(@Param() params: PostFindOneDto): Promise<PostModel> {
    const post = await this.postService.findOne({
      id: +params.id,
    })
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }

  @Post()
  async create(@Body() body: PostCreateDto): Promise<PostModel> {
    const post = await this.postService.create(body)
    return post
  }

  @Put(':id')
  async update(
    @Param() params: PostParamsDto,
    @Body() body: PostUpdateDto,
  ): Promise<PostModel> {
    const post = await this.postService.findOne({
      id: +params.id,
    })
    if (!post) {
      throw new NotFoundException('Post not found')
    }

    const updatedPost = await this.postService.update({
      where: {
        id: +params.id,
      },
      data: body,
    })
    return updatedPost
  }

  @Delete(':id')
  async delete(@Param() params: PostDeleteDto): Promise<PostModel> {
    const user = await this.postService.findOne({
      id: +params.id,
    })
    if (!user) {
      throw new NotFoundException('Post not found')
    }

    const deletedPost = await this.postService.delete({
      id: +params.id,
    })
    return deletedPost
  }
}
