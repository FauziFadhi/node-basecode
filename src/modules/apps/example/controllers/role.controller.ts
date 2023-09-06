import {
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { transformer } from '@utils/helper';
import { ResponseInterceptor } from '@utils/interceptors';

import { ApiTags } from '@nestjs/swagger';
import { CreateRoleReq } from './request/create-role.request';
import { RoleService } from '../service/role.service';
import { RoleVm } from './viewmodel/role.viewmodel';

@Controller({ version: '1', path: 'roles' })
@ApiTags('Roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {

  }

  @Post()
  async createUser(@Body() body: CreateRoleReq) {
    const user = await this.roleService.create(body);

    return transformer(RoleVm, user);
  }
}
