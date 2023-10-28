// src/modules/posts/dtos/create-post.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  published: boolean = false;

  authorId: number;
}
