import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import * as JSONAPISerializer from 'json-api-serializer';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VALIDATION_CODE } from '../error';

// tslint:disable-next-line:variable-name
const Serializer = new JSONAPISerializer();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse();

    const request: FastifyRequest = ctx.getRequest();

    // const isAcceptedApi = request.url.includes('api/');

    // const user = isAcceptedApi ? request.user : 'ATTACK';
    const { url } = request;
    // const headers = request.headers;

    const status = this.getStatus(exception);

    const stack = exception?.stack || null;
    const errorResponse = (exception)?.response;

    // console.log('\x1b[36m', stack, '\x1b[0m');

    const errorCode = errorResponse?.error || errorResponse?.code || undefined;

    const errorMessage = errorResponse?.message
    || exception?.message
    || exception;

    this.logger.error(errorMessage, stack, 'ALLEXCEPTION FILTER');

    const meta = {
      path: url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    let errorDefault: JSONAPISerializer.ErrorObject;

    if (typeof errorMessage === 'object' && errorMessage.length) {
      const error = errorMessage.map((errmsg, index: number) => ({
        source: errorCode === VALIDATION_CODE ? {
          pointer: errmsg.field,
        } : undefined,
        code: errorCode,
        status: `${status}`,
        meta: index === 0 && meta,
        detail: errmsg.message,
      }));

      errorDefault = error;
    } else {
      errorDefault = {
        code: errorCode,
        status: `${status}`,
        meta,
        detail: errorMessage,
      };
    }

    response.status(status).send(Serializer.serializeError(errorDefault));
  }

  private httpExceptionHandling(exception: HttpException) {

  }

  private getStatus(exception: HttpException | any) {
    return exception instanceof HttpException || exception?.getStatus?.()
      ? +exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
