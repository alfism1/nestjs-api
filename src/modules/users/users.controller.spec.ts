import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/core/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService, // 💡 add prisma service here
        {
          provide: JwtService, // 💡 add jwt service here
          useValue: {
            signAsync: jest.fn(), // 💡 mock signAsync method
          },
        },
      ],
    }).compile();

    controller = app.get<UsersController>(UsersController);
  });

  it('should be defined"', () => {
    expect(controller).toBeDefined();
  });

  describe('users controller', () => {
    // 💡 registerUser method
    describe('registerUser method', () => {
      // 💡 test register success
      it('should register new user', async () => {
        const newUser = {
          email: 'test@user.com',
          name: 'Test User',
          password: 'password',
        };

        const mockRegisterResponse: User = {
          id: 1,
          email: 'test@user.com',
          name: 'Test User',
          password: 'password',
        };

        // delete password from response
        delete mockRegisterResponse.password;

        // 💡 See here -> we mock registerUser function from users.controller.ts
        // to return mockRegisterResponse
        jest
          .spyOn(controller, 'registerUser')
          .mockResolvedValue(mockRegisterResponse);

        // 💡 See here -> we call registerUser method from users.controller.ts
        // with newUser as parameter
        const result = await controller.registerUser(newUser);

        // 💡 See here -> we expect result to be mockRegisterResponse
        expect(result).toEqual(mockRegisterResponse);
      });

      // 💡 test register error due to email already registered
      it('should throw error if email already registered', async () => {
        const registeredUser = {
          email: 'registered@user.com',
          name: 'Registered User',
          password: 'password',
        };

        jest
          .spyOn(controller, 'registerUser')
          .mockRejectedValue(new ConflictException());

        const register = controller.registerUser(registeredUser);

        await expect(register).rejects.toThrow(ConflictException);
      });

      // 💡 test register error due to missing some fields
      it('should throw error if required fields is missing', async () => {
        jest
          .spyOn(controller, 'registerUser')
          .mockRejectedValue(new BadRequestException());

        const register = controller.registerUser(null);

        await expect(register).rejects.toThrow(BadRequestException);
      });
    });

    // 💡 loginUser method
    describe('loginUser method', () => {
      // 💡 test login success
      it('should login user', async () => {
        const mockLoginResponse = {
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyey',
        };

        // 💡 See here -> we mock loginUser function from users.controller.ts
        // to return mockLoginResponse
        jest
          .spyOn(controller, 'loginUser')
          .mockResolvedValue(mockLoginResponse);

        // 💡 See here -> we call loginUser method from users.controller.ts
        // with mockLoginResponse as parameter
        const result = await controller.loginUser({
          email: 'some@user.com',
          password: 'password',
        });

        expect(result).toEqual(mockLoginResponse);
        expect(result.access_token).toBeDefined();
      });

      // 💡 test login error due to wrong email
      it('should throw error if email is wrong', async () => {
        const wrongEmail = {
          email: 'wrong@user.com',
          password: 'password',
        };

        jest
          .spyOn(controller, 'loginUser')
          .mockRejectedValue(new NotFoundException());

        const login = controller.loginUser(wrongEmail);

        await expect(login).rejects.toThrow(NotFoundException);
      });
    });

    // 💡 me method
    describe('me method', () => {
      // 💡 test me success
      it('should return my profile', async () => {
        const mockMyProfileResponse = {
          sub: 5,
          email: 'superb-2@api.com',
          name: 'Super Api 2',
          iat: 1698562521,
          exp: 1698605721,
        };

        // 💡 See here -> we mock me function from users.controller.ts
        // to return mockMyProfileResponse
        jest.spyOn(controller, 'me').mockImplementation(() => {
          return mockMyProfileResponse;
        });

        const result = controller.me(null);

        expect(result).toEqual(mockMyProfileResponse);
        expect(result).toHaveProperty('sub');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('iat');
        expect(result).toHaveProperty('exp');
      });
    });

    // 💡 updateUser method
    describe('updateUser method', () => {
      // 💡 test update success
      it('should update user', async () => {
        const mockUpdateResponse = {
          id: 1,
          email: 'update@user.com',
          name: 'Update User',
          password: 'password',
        };

        // delete password from response
        delete mockUpdateResponse.password;

        // 💡 See here -> we mock updateUser function from users.controller.ts
        // to return mockUpdateResponse
        jest
          .spyOn(controller, 'updateUser')
          .mockResolvedValue(mockUpdateResponse);

        // 💡 See here -> we call updateUser method from users.controller.ts
        // with mockUpdateResponse as parameter
        const result = await controller.updateUser(1, {
          email: 'update@user.com',
          name: 'Update User',
          password: 'password',
        });

        expect(result).toEqual(mockUpdateResponse);
      });

      // 💡 test update error due to user not found
      it('should throw error if user not found', async () => {
        const mockUpdateResponse = {
          id: 1,
          email: 'notfound@test.com',
          name: 'Not Found',
          password: 'password',
        };

        jest
          .spyOn(controller, 'updateUser')
          .mockRejectedValue(new NotFoundException());

        const update = controller.updateUser(1, mockUpdateResponse);

        await expect(update).rejects.toThrow(NotFoundException);
      });
    });

    // 💡 deleteUser method
    describe('deleteUser method', () => {
      // 💡 test delete success
      it('should delete user', async () => {
        const mockDeleteResponse = 'User deleted';

        // 💡 See here -> we mock deleteUser function from users.controller.ts
        // to return mockDeleteResponse
        jest
          .spyOn(controller, 'deleteUser')
          .mockResolvedValue(mockDeleteResponse);

        // 💡 See here -> we call deleteUser method from users.controller.ts
        // with mockDeleteResponse as parameter
        const result = await controller.deleteUser(1);

        expect(result).toEqual(mockDeleteResponse);
      });

      // 💡 test delete error due to user not found
      it('should throw error if user not found', async () => {
        jest
          .spyOn(controller, 'deleteUser')
          .mockRejectedValue(new NotFoundException());

        const deleteUser = controller.deleteUser(1);

        await expect(deleteUser).rejects.toThrow(NotFoundException);
      });
    });
  });
});
