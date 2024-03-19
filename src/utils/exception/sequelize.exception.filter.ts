import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseError } from 'sequelize';
import { meta, responseBody } from '.';

@Catch(BaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: BaseError & { code?: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: FastifyRequest = ctx.getRequest();

    const errorCode = exception?.code || undefined;

    const errorMessage = exception.message;
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
        errors: exception,
        code: errorCode,
        cause: exception.cause,
      },
      exception.stack,
      'SequelizeExceptionFilter',
    );
    const response: FastifyReply = ctx.getResponse();

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
      responseBody({
        code: errorCode,
        message: 'internal server error',
        meta: metaData,
      }),
    );
  }
}
