import { AppsModule } from '@apps/apps.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@utils/exception/all-exception-filter';
import { CustomValidationPipe } from '@utils/pipe/ValidationPipe';
import { install } from 'source-map-support';

import { satisfies } from 'semver';
import * as qs from 'qs';
import { engines } from '../package.json';

import { AppModule } from './app.module';

async function bootstrap() {
  install();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
    querystringParser: (str: string) => qs.parse(str),
  }));

  app.useGlobalPipes(new CustomValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.useGlobalFilters(new AllExceptionsFilter());

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

  const version = engines.node;
  if (!satisfies(process.version, version)) {
    console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
    process.exit(1);
  }

  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('app.port');
  await app.listen(appPort || 3000, '0.0.0.0');
  new Logger().log(`Your Application run in ${await app.getUrl()}`, 'Nest Application');
}
bootstrap();
