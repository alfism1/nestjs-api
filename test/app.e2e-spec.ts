import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PostsModule } from 'src/modules/posts/posts.module';
import { PrismaClient } from '@prisma/client';

describe('Superb API (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, PostsModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE "public"."Post" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Users', () => {
    it('should create a user', async () => {
      const user = {
        email: 'newuser@e2e.test',
        name: 'New User',
        password: '12345678',
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(user)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        email: user.email,
        name: user.name,
      });
    });

    it('should login a user', async () => {
      const user = {
        email: 'newuser@e2e.test',
        password: '12345678',
      };

      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send(user)

        .expect(201);

      expect(response.body).toEqual({
        access_token: expect.any(String),
      });
    });
  });
});
