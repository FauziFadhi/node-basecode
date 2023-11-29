import { Module } from '@nestjs/common';
import { CacheConfigModule } from '@config/cache/config.module';
import { UserService } from './service/user.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './service/role.service';
import { ExampleAuthService } from './service/auth.service';
import { CacheController } from './controllers/cache.controller';

@Module({
  imports: [CacheConfigModule],
  providers: [UserService, RoleService, ExampleAuthService],
  controllers: [UserController, RoleController, CacheController],
})
export class ExampleModule {}
