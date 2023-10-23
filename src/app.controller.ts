import { Controller, Get } from '@nestjs/common';

import { SerializeResponse } from '@utils/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SerializeResponse()
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
