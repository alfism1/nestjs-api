import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipe that will be applied to all routes
  // This will validate the request body against the DTO
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
