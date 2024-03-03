import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';

import { LoginRequest } from './request/login.request';
import { LoginVm } from './viewmodel/login.viewmodel';
import { AppsAuthService } from './services/apps.auth.service';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AppsAuthController {
  constructor(
    private readonly authService: AppsAuthService,
  ) {

  }

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginVm> {
    return this.authService.login(body);
  }
}
