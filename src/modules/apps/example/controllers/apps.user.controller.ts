import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { transformer } from '@utils/helper';

import { ApiTags } from '@nestjs/swagger';
import { UserVm } from './viewmodel/user.viewmodel';
import { AppsUserService } from '../services/apps.user.service';
import { AppsCreateUserReq } from './requests/apps.create-user.request';

@UseGuards(AuthGuard(['anonym', 'auth']))
@Controller({ version: '1', path: 'users' })
@ApiTags('Users')
export class AppsUserController {
  constructor(
    private readonly userService: AppsUserService,
  ) {

  }

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
      // @LoggedUser() loggedUser: ILoggedUser,
  ): Promise<UserVm> {
    const user = await this.userService.getUser(id);

    return transformer(UserVm, user);
  }

  @Post()
  async createUser(@Body() body: AppsCreateUserReq) {
    const user = await this.userService.createUser(body);

    return transformer(UserVm, user);
  }
}
