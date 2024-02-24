import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { SerializeResponse } from '@utils/decorators';
import { transformer } from '@utils/helper';
import { ServiceName } from './service';

@Controller({
  path: 'path_name',
  version: '1',
})
export class ControllerName {
  constructor(private readonly service: ServiceName) {}

  @SerializeResponse('pagination')
  @Get()
  async getPagination(@Query() q) {
    const { count, rows } = await this.service.paginate(q);

    return { count, rows: transformer({} as any, rows) };
  }

  @SerializeResponse()
  @Get(':modelId')
  async getOne(@Param('modelId') id: number) {
    const model = await this.service.getOne(id);

    return transformer({} as any, model);
  }

  @SerializeResponse()
  @Post()
  async create(@Body() body) {
    const model = await this.service.create(body);
    return transformer({} as any, model);
  }

  @HttpCode(204)
  @Patch(':modelId')
  async update(@Body() body, @Param('modelId') id: number) {
    await this.service.update(id, body);
  }

  @HttpCode(204)
  @Delete(':modelId')
  async delete(@Param('modelId') id: string) {
    await this.service.bulkDelete(id.split(',').map(Number));
  }
}
