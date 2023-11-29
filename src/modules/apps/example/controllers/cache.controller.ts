import {
  Controller,
  Get,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { CacheEndpoint, SerializeResponse } from '@utils/decorators';

@SerializeResponse()
@Controller({ version: '1', path: 'cache' })
@ApiTags('cache')
export class CacheController {
  @CacheEndpoint(100, 'browser')
  @Get('browser')
  async cacheBrowser() {
    return {
      message: 'cache browser',
    };
  }

  @SerializeResponse('pagination')
  @CacheEndpoint(100, 'cdn')
  @Get('cdn')
  async cacheCDN() {
    return {
      message: 'cdn',
    };
  }

  @CacheEndpoint(100, 'server')
  @Get('server')
  async cacheServer() {
    return {
      message: 'server',
    };
  }

  @Get()
  async createUser() {
    return {
      message: 'basic',
    };
  }
}
