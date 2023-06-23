/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

import { Request, Response } from 'express';

@Injectable()
export class BullBoardMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next) {
    const a = req.cookies;
    if (req.cookies?.['board'] !== 'test') {
      return new UnauthorizedException();
    }
    next();
  }
}
