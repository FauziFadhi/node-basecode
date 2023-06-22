import { BullModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigProvider implements SharedBullConfigurationFactory {
  constructor(
    private readonly configService: ConfigService,
  ) {

  }

  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'chelsea24',
      },
      prefix: 'mika-clinic',
    };
  }
}
