import { AppsModule } from '@apps/apps.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@utils/exception/all-exception-filter';
import { CustomValidationPipe } from '@utils/pipe/ValidationPipe';
import { install } from 'source-map-support';

import { AppModule } from './app.module';

async function bootstrap() {
  install();
  /**
   * uncomment these lines, import from async-local-storage
   * enable();
   * disableLinkedTop();
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new CustomValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.useGlobalFilters(new AllExceptionsFilter(new Logger()));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Apps')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AppsModule],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('app.port');
  await app.listen(appPort || 3000);
}
bootstrap();
