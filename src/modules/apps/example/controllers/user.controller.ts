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
import { UserVm } from './viewmodel/user.viewmodel';
import { UserService } from '../service/user.service';
import { CreateUserReq } from './request/create-user.request';

@UseGuards(AuthGuard(['anonym', 'auth']))
@Controller({ version: '1', path: 'users' })
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {

  }

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
}
