import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequest } from './request/login.request';
import { LoginVm } from './viewmodel/login.viewmodel';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {

  }

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginVm> {
    return this.authService.login(body);
  }
}
