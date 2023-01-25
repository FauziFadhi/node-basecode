import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './config.provider';
import schema from './schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schema,
      envFilePath: process.env.DB_ENV ? `.env.${process.env.DB_ENV}` : '.env',
    }),
    SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
  ],
})
export class DBConfigModule { }
