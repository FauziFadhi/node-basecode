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

    const meta = {
      path: url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    const errorDefault: JSONAPISerializer.ErrorObject = (typeof errorMessage === 'object' && errorMessage.length)
      ? errorMessage.map((errmsg, index: number) => ({
        source: errorCode === VALIDATION_CODE ? {
          pointer: errmsg.field,
        } : undefined,
        code: errorCode,
        status: `${status}`,
        meta: index === 0 && meta,
        detail: this.getMessage(exception) || errmsg.message,
      }))
      : {
        code: errorCode,
        status: `${status}`,
        meta,
        detail: this.getMessage(exception) || errorMessage,
      };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('UNHANDLED ERROR', {
        stack,
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
        },
        errors: errorDefault,
        cause: exception?.cause || errorMessage,
        message: exception?.message,
      }, 'EXCEPTION');
    } else {
      this.logger.error({
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
        },
        cause: exception?.cause || errorMessage,
        errors: errorDefault,
        message: errorMessage,
      }, stack, 'EXCEPTION');
    }

    response.status(status).send(Serializer.serializeError(errorDefault));
  }

  private getStatus(exception: HttpException | any) {
    return exception instanceof HttpException || exception?.getStatus?.()
      ? +exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: HttpException | any) {
    // eslint-disable-next-line no-nested-ternary
    return exception instanceof HttpException || exception?.getStatus?.()
      ? null
      : ['development', 'local'].includes(process.env.ENV || '') ? null : 'Terjadi kesalahan pada server.';
  }
}
