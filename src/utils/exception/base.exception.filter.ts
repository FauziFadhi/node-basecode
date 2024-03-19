import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';
import { meta, responseBody } from '.';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error & { code?: string }, host: ArgumentsHost) {
    const errorCode = exception?.code || undefined;

    const errorMessage = exception.message;

    const request: FastifyRequest = host.switchToHttp().getRequest();
    const metaData = meta({ url: request.url, method: request.method });

    this.logger.error(
      {
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
          url: request.url,
        },
        meta: metaData,
        message: errorMessage,
        errors: exception?.message,
        code: errorCode,
        cause: exception.cause,
      },
      exception.stack,
      'BaseExceptionFilter',
    );

    return host.switchToHttp().getResponse().status(HttpStatus.INTERNAL_SERVER_ERROR).send(
      responseBody({
        code: errorCode,
        message: 'internal server error',
        meta: metaData,
      }),
    );
  }
}
