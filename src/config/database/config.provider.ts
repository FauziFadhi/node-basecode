import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
  ) {

  }

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: this.configService.getOrThrow('DB_CONNECTION'),
      logging: false,
      logQueryParameters: false,
      define: {
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
        underscored: true,
      },
      replication: {
        read: [
          {
            database: this.configService.getOrThrow('DB_READ_NAME'),
            username: this.configService.getOrThrow('DB_READ_USERNAME'),
            password: this.configService.getOrThrow('DB_READ_PASSWORD'),
            host: this.configService.getOrThrow('DB_READ_HOST'),
            port: +this.configService.getOrThrow('DB_READ_PORT'),
          },
        ],
        write: {
          database: this.configService.getOrThrow('DB_NAME'),
          username: this.configService.getOrThrow('DB_USERNAME'),
          password: this.configService.getOrThrow('DB_PASSWORD'),
          host: this.configService.getOrThrow('DB_HOST'),
          port: +this.configService.getOrThrow('DB_PORT'),
        },
      },
      pool: {
        min: 0,
        max: 30,
      },
      dialectOptions: {
        // decimalNumbers: true,
        // timezone: '+07:00',
      },
      // timezone: '+07:00',
      models: [join(__dirname, '../../models/core')],
      synchronize: false,
    };
  }
}
