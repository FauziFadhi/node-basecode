import { Module } from '@nestjs/common';
import { CacheConfigModule } from '@config/cache/config.module';
import { AppsUserController } from './controllers/apps.user.controller';
import { AppsUserService } from './services/apps.user.service';
import { AppsRoleService } from './services/apps.role.service';
import { AppsExampleAuthService } from './services/apps.example-auth.service';

@Module({
  imports: [CacheConfigModule],
  providers: [AppsUserService, AppsRoleService, AppsExampleAuthService],
  controllers: [AppsUserController],
})
export class AppsExampleModule {}
