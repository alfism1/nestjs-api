import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostsService } from './posts.service';
import { Post as CPost } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { IsMineGuard } from 'src/common/guards/is-mine.guard';
import { ExpressRequestWithUser } from '../users/interfaces/express-request-with-user.interface';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput } from 'src/common/utils/pagination.utils';

@Controller('posts')
export class PostsController {
  // inject posts service
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: ExpressRequestWithUser,
  ): Promise<CPost> {
    // 💡 See this. set authorId to current user's id
    createPostDto.authorId = req.user.sub;
    return this.postsService.createPost(createPostDto);
  }

  @Public()
  @Get()
  getAllPosts(
    @Query() query?: QueryPaginationDto,
  ): Promise<PaginateOutput<CPost>> {
    return this.postsService.getAllPosts(query);
  }

  @Public()
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<CPost> {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  @UseGuards(IsMineGuard) // <--- 💡 Prevent user from updating other user's posts
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CPost> {
    return this.postsService.updatePost(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(IsMineGuard) // <--- 💡 Prevent user from deleting other user's posts
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.postsService.deletePost(+id);
  }
}
