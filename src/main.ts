import { NestFactory } from '@nestjs/core';
import * as expressListRoutes from 'express-list-routes';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { configServiceInstance } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  const PORT = configServiceInstance.getPort();

  if (!configServiceInstance.isProduction()) {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder()
      .setTitle('Item API')
      .setDescription('My Item API')
      .setVersion('1.0')
      .build());
    SwaggerModule.setup('swagger-api', app, document);
  }

  await app.listen(PORT,() => console.log(`Server started on port ${PORT}`));

  //for routs list logging
  const server = app.getHttpServer();
  const router = server._events.request._router;
  expressListRoutes(router);
}
bootstrap();
