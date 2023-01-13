import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as JSONAPISerializer from 'json-api-serializer';
import { VALIDATION_CODE } from '../error';

// tslint:disable-next-line:variable-name
const Serializer = new JSONAPISerializer();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
  ) {

  }

  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const request: Request = ctx.getRequest();

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
        status: status as any,
        meta: index === 0 && meta,
        detail: errmsg.message,
      }));

      errorDefault = error;
    } else {
      errorDefault = {
        code: errorCode,
        status: status as any,
        meta,
        detail: errorMessage,
      };
    }

    // Log.create(
    //   {
    //     type: LOG_TYPE_ERR,
    //     code: errorCode || '00',
    //     title: 'ERROR',
    //     branch: user?.clinic?.id || 0,
    //     detail:
    //       (typeof errorMessage == 'object' && JSON.stringify(errorMessage)) ||
    //       errorMessage,
    //     request: request.body,
    //     user,
    //     url,
    //     reference: stack,
    //     statusCode: status,
    //     date: dateNow().toDate().toString(),
    //     headers,
    //   },
    //   { logging: false },
    // );

    response.status(status).json(Serializer.serializeError(errorDefault));
  }

  private httpExceptionHandling(exception: HttpException) {

  }

  private getStatus(exception: HttpException | any) {
    return exception instanceof HttpException || exception?.getStatus?.()
      ? +exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
