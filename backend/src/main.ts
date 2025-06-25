import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { RoutesResolver } from '@nestjs/core/router/routes-resolver';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  // ✅ Print mapped routes the reliable way
  printAllRoutes(app);

  Logger.log(`✅ Server running on http://localhost:${port}`);
}

function printAllRoutes(app: any) {
  const server = app.getHttpAdapter().getInstance();

  const router = server._router || (server._events?.request && server._events.request._router);

  if (!router || !router.stack) {
    Logger.warn('⚠️ Could not access route stack');
    return;
  }

  Logger.log('📌 Available Routes:');

  router.stack
    .filter((layer) => layer.route && layer.route.path)
    .forEach((layer) => {
      const route = layer.route;
      const methods = Object.keys(route.methods)
        .map((m) => m.toUpperCase())
        .join(', ');
      Logger.log(`${methods} ${route.path}`);
    });
}

bootstrap();
