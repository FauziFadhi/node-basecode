import { Module } from '@nestjs/common';
import { CacheConfigModule } from '@config/cache/config.module';
import { UserService } from './service/user.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './service/role.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [CacheConfigModule],
  providers: [UserService, RoleService, AuthService],
  controllers: [UserController, RoleController],
})
export class ExampleModule {}
