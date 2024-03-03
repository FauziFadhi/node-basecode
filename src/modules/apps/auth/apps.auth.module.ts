import { Module } from '@nestjs/common';

import { CommonAuthModule } from '@common/auth/common.auth.module';
import { AppsAuthController } from './auth.controller';
import { AnonymStrategy } from './strategy/anonym.strategy';
import { AuthJwtStrategy } from './strategy/auth.strategy';
import { AppsAuthService } from './services/apps.auth.service';

@Module({
  imports: [CommonAuthModule],
  providers: [AppsAuthService, AuthJwtStrategy, AnonymStrategy],
  controllers: [AppsAuthController],
})
export class AppsAuthModule {}
