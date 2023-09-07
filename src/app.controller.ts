import { Controller, Get } from '@nestjs/common';

import { SerializeResponse } from '@utils/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SerializeResponse('pagination')
  @Get()
  getHello() {
    return {
      rows: [{
        id: 1,
      }, {
        id: 1,
      }],
      count: 10,
    };
  }
}
