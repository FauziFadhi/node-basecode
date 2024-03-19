import { BadRequestException, Controller, Get } from '@nestjs/common';

import { SerializeResponse } from '@utils/decorators';
import { UniqueConstraintError } from 'sequelize';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SerializeResponse()
  @Get()
  getHello() {
    throw new UniqueConstraintError({});
    

    return this.appService.getHello();
  }
}
