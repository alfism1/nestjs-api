import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUsertDto } from './dtos/update-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { ExpressRequestWithUser } from './interfaces/express-request-with-user.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { IsMineGuard } from 'src/common/guards/is-mine.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// 💡 See here. Add this decorator to add tags to swagger docs
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  // 💡 See here. Add this decorator to add operationId
  @ApiOperation({
    summary: 'Register a new user',
    operationId: 'create',
  })
  // 💡 See here. Add this decorator to add API Success response
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateUserDto,
  })
  // 💡 See here. Add this decorator to add API Bad Request response
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: [
          'email must be an email',
          'email should not be empty',
          'password should not be empty',
          'name should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  // 💡 See here. Add this decorator to add API Conflict response
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    schema: {
      example: {
        message: 'Email already registered',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // call users service method to register new user
    return this.usersService.registerUser(createUserDto);
  }

  @Public()
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    // call users service method to login user
    return this.usersService.loginUser(loginUserDto);
  }

  @Get('me')
  me(@Request() req: ExpressRequestWithUser): UserPayload {
    return req.user;
  }

  @Patch(':id')
  @UseGuards(IsMineGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUsertDto,
  ): Promise<User> {
    // call users service method to update user
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(IsMineGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    // call users service method to delete user
    return this.usersService.deleteUser(+id);
  }
}
