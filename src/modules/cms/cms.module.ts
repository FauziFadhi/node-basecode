import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      // {
      //   path: 'cms',
      //   module: AuthModule,
      // },
    ]),
  ],
})
export class CmsModule {}
