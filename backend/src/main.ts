// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  // ✅ Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // auto transform JSON strings to numbers
    })
  );

  await app.listen(3003);
}
bootstrap();
