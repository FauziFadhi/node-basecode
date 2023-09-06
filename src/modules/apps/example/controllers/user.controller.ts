import { User } from '@models/core/User';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User as LoggedUser } from '@utils/decorators';
import { transformer } from '@utils/helper';

import { ILoggedUser } from '@apps/auth/interface/logged-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import { UserCacheCdnType } from '@utils/enum/user-cache-cdn-type.enum';
import { CacheEndpoint } from '@utils/decorators/cache';
import { UserVm } from './viewmodel/user.viewmodel';
import { UserService } from '../service/user.service';
import { CreateUserReq } from './request/create-user.request';

@UseGuards(AuthGuard(['auth', 'anonym']))
@Controller({ version: '1', path: 'users' })
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {

  }

  someBody: any = {
    name: 'Supardi',
    email: 'supardi@mail.com',
    superheroAlias: 'Suparman At Madness',
  };

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
      @LoggedUser() loggedUser: ILoggedUser,
  ): Promise<UserVm> {
    const user = await this.userService.getUser(id);

    return transformer(UserVm, user);
  }

  @Post()
  async createUser(@Body() body: CreateUserReq) {
    const user = await this.userService.createUser(body);

    return transformer(UserVm, user);
  }

  @CacheEndpoint(60, 'cdn')
  @Post('x1')
  async testTllCdn(@Body() body: any) {
    this.someBody = body;
    return this.someBody;
  }

  @CacheEndpoint(60)
  @Get('x1')
  async testTllCdn1() {
    return this.someBody;
  }

  @CacheEndpoint(60)
  @Post('x2')
  async testTllCdnPublic(@Body() body: any) {
    this.someBody = body;
    return this.someBody;
  }

  @CacheEndpoint(60, 'server')
  @Get('x2')
  async testTllCdn1Public() {
    return this.someBody;
  }
}
