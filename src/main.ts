import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipe that will be applied to all routes
  // This will validate the request body against the DTO
  app.useGlobalPipes(new ValidationPipe());

  // Check here - Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Superb API')
    .setDescription('The Super API documentation')
    .setVersion('1.0')
    .addTag('superb')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
