import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { transformer } from '@utils/helper';

import { ApiTags } from '@nestjs/swagger';
import { RoleVm } from './viewmodel/role.viewmodel';
import { AppsRoleService } from '../services/apps.role.service';
import { AppsCreateRoleReq } from './requests/apps.create-role.request';

@Controller({ version: '1', path: 'roles' })
@ApiTags('Roles')
export class AppsRoleController {
  constructor(
    private readonly roleService: AppsRoleService,
  ) {

  }

  @Post()
  async createUser(@Body() body: AppsCreateRoleReq) {
    const user = await this.roleService.create(body);

    return transformer(RoleVm, user);
  }
}
