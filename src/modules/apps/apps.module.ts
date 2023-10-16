import { Module } from '@nestjs/common';

import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [AuthModule, ExampleModule,
    RouterModule.register([
      {
        path: 'apps',
        module: AuthModule,
      },
      {
        path: 'apps',
        module: ExampleModule,
      },
    ]),
  ],
})
export class AppsModule {}
