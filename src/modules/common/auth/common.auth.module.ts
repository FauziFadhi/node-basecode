import { AuthConfigModule } from '@config/auth/config.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthProvider } from './provider.service';

@Module({
  imports: [AuthConfigModule, JwtModule.register({}), PassportModule],
  providers: [AuthProvider],
  exports: [AuthProvider, AuthConfigModule],
})
export class CommonAuthModule {}
