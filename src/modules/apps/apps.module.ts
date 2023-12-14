import { Module } from '@nestjs/common';

import { RouterModule } from '@nestjs/core';
import { CommonAuthModule } from '@common/auth/common.auth.module';
import { AppsExampleModule } from './example/apps.example.module';

@Module({
  imports: [CommonAuthModule, AppsExampleModule,
    RouterModule.register([
      {
        path: 'apps',
        module: CommonAuthModule,
      },
      {
        path: 'apps',
        module: AppsExampleModule,
      },
    ]),
  ],
})
export class AppsModule {}
