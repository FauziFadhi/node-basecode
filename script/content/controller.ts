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
import { FindOptions } from 'sequelize';
import { ServiceName } from './service';
import { FilterName } from './filter';
import { CreateRequestNameRequest, UpdateRequestNameRequest } from './request';
import { ViewmodelName } from './viewmodel';

@Controller({
  path: 'path_name',
  version: '1',
})
export class ControllerName {
  constructor(private readonly service: ServiceName) {}

  @SerializeResponse('pagination')
  @Get()
  async getPagination(@FilterName() filter: FindOptions, @Query() q) {
    const { count, rows } = await this.service.paginate(filter);

    return { count, rows: transformer(ViewmodelName, rows) };
  }

  @SerializeResponse()
  @Get(':modelId')
  async getOne(@Param('modelId') id: number) {
    const model = await this.service.getOne(id);

    return transformer(ViewmodelName, model);
  }

  @SerializeResponse()
  @Post()
  async create(@Body() body: CreateRequestNameRequest) {
    const model = await this.service.create(body);
    return transformer(ViewmodelName, model);
  }

  @HttpCode(204)
  @Patch(':modelId')
  async update(@Body() body: UpdateRequestNameRequest, @Param('modelId') id: number) {
    await this.service.update(id, body);
  }

  @HttpCode(204)
  @Delete(':modelId')
  async delete(@Param('modelId') id: string) {
    await this.service.bulkDelete(id.split(',').map(Number));
  }
}
