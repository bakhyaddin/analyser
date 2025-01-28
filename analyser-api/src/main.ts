import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppConfigService } from './configs/app';
import { SwaggerService } from './providers/swagger/provider.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);
  const swaggerService = app.get(SwaggerService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      // stripts only decorated properties and pass to the service
      whitelist: true,
      transform: true,
    }),
  );
  // replace nestjs logger with the pino logger
  app.useLogger(app.get(Logger));
  // setup swagger
  swaggerService.setup(app);

  await app.listen(appConfigService.port);
}
bootstrap();
