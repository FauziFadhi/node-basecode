import { AppsModule } from '@apps/apps.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomValidationPipe } from '@utils/pipes/validation.pipe';
import { install } from 'source-map-support';

import { satisfies } from 'semver';
import * as fastifyMulter from 'fastify-multer';
import { GlobalCustomResponseInterceptor } from '@utils/interceptors/global-response.interceptor';
import { HttpExceptionFilter, BaseExceptionFilter, SequelizeExceptionFilter } from '@utils/exception';
import { engines, version } from '../package.json';

import { AppModule } from './app.module';

export const projectVersion = version;
export const mainPath = __dirname;


async function bootstrap() {
  const nodeVersion = engines.node;
  if (!satisfies(process.version, nodeVersion)) {
    console.log(`Required node version ${nodeVersion} not satisfied with current version ${process.version}.`);
    process.exit(0);
  }

  install();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      querystringParser: (str: string) => Object.fromEntries(new URLSearchParams(str)),
    }),
  );

  app.register(fastifyMulter.contentParser as any);

  app.useGlobalPipes(new CustomValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const logger = new Logger();
  app.useGlobalFilters(
    new BaseExceptionFilter(logger),
    new HttpExceptionFilter(logger),
    new SequelizeExceptionFilter(logger),
  );
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new GlobalCustomResponseInterceptor());

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({
      reason,
      promise,
      message: 'Unhandled Rejection',
    });
  });

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
  await app.listen(appPort || 3000, '0.0.0.0');
  logger.log(`Your Application run in ${await app.getUrl()}`, 'Nest Application');
}
bootstrap();
